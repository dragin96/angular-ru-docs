/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '../../di/injector';
import {assertLView} from '../assert';
import {discoverLocalRefs, getComponentAtNodeIndex, getDirectivesAtNodeIndex, getLContext} from '../context_discovery';
import {NodeInjector} from '../di';
import {buildDebugNode, DebugNode} from '../instructions/lview_debug';
import {LContext} from '../interfaces/context';
import {DirectiveDef} from '../interfaces/definition';
import {TElementNode, TNode, TNodeProviderIndexes} from '../interfaces/node';
import {isLView} from '../interfaces/type_checks';
import {CLEANUP, CONTEXT, FLAGS, HEADER_OFFSET, HOST, LView, LViewFlags, T_HOST, TVIEW} from '../interfaces/view';

import {stringifyForError} from './misc_utils';
import {getLViewParent, getRootContext} from './view_traversal_utils';
import {getTNode, unwrapRNode} from './view_utils';



/**
 * Извлекает экземпляр компонента, связанный с данным элементом DOM.
 *
 *  @usageNotes
 * Учитывая следующую структуруDOM:.
 *  ```html
 *  <my-app>
 *    <div>
 *      <child-comp></child-comp>
 *    </div>
 *  </my-app>
 *  ```
 * Вызов `getComponent` на `<child-comp>` будет возвращать экземпляр `ChildComponent`
 * связанный с этим элементом DOM.
 *
 * Вызов функции в `<my-app>` вернет `MyApp`.
 *
 *
 *  @param элемент DOM элемент, из которого должен быть получен компонент.
 *  @returns Компонент экземплярсвязанный с элементом или `null` еслиесть.
 * нет компонента, связанного с ним.
 *
 * @publicApi
 * @globalApi ng
 */
export function getComponent<T>(element: Element): T|null {
  assertDomElement(element);
  const context = loadLContext(element, false);
  if (context === null) return null;

  if (context.component === undefined) {
    context.component = getComponentAtNodeIndex(context.nodeIndex, context.lView);
  }

  return context.component as T;
}


/**
 * Если внутри вложенное зрения (например `ngIf` или `ngFor` ngFor), извлекает контекствнедренных.
 * посмотреть, что элемент является частью. В противном случае извлекает экземпляр компонента, вид которого
 * владеет элементом (в этом случае результат совпадает с вызовом `getOwningComponent`).
 *
 *  @param элемент Элемент, для которого нужно получить экземпляр окружающего компонента.
 *  @returns Экземпляр компонента, который находится вокруг элемента, или ноль, если элемент не является
 * внутри любого компонента.
 *
 * @publicApi
 * @globalApi ng
 */
export function getContext<T>(element: Element): T|null {
  assertDomElement(element);
  const context = loadLContext(element, false);
  return context === null ? null : context.lView[CONTEXT] as T;
}

/**
 * Извлекает экземпляр компонента, представление которого содержит элемент DOM.
 *
 * Например, если `<child-comp>` используется в шаблоне `<app-comp>`
 * (т.е. `ViewChild` из `<app-comp>` приложение-комп), вызов `getOwningComponent` на `<child-comp>`
 * вернул бы `<app-comp>`.
 *
 *  @param elementOrDir DOM-элемент, компонент или экземпляр директивы
 * для которого нужно извлечь корневые компоненты.
 *  @returns Экземпляр компонента, чье представление владеет элементом DOM или значение NULL, если элемент не является
 * часть представления компонента.
 *
 * @publicApi
 * @globalApi ng
 */
export function getOwningComponent<T>(elementOrDir: Element|{}): T|null {
  const context = loadLContext(elementOrDir, false);
  if (context === null) return null;

  let lView = context.lView;
  let parent: LView|null;
  ngDevMode && assertLView(lView);
  while (lView[HOST] === null && (parent = getLViewParent(lView)!)) {
    // As long as lView[HOST] is null we know we are part of sub-template such as `*ngIf`
    lView = parent;
  }
  return lView[FLAGS] & LViewFlags.IsRoot ? null : lView[CONTEXT] as T;
}

/**
 * Извлекает все корневые компоненты, связанные с элементом DOM, директивой или экземпляром компонента.
 * Корневые компоненты - это те, которые были загружены Angular.
 *
 *  @param elementOrDir DOM-элемент, компонент или экземпляр директивы
 * для которого нужно извлечь корневые компоненты.
 *  @returns Корневые компоненты, связанные с целевым объектом.
 *
 * @publicApi
 * @globalApi ng
 */
export function getRootComponents(elementOrDir: Element|{}): {}[] {
  return [...getRootContext(elementOrDir).components];
}

/**
 * Извлекает `Injector` связанный с элементом, компонента или директивынапример.
 *
 *  @param elementOrDir DOM элемент, компонент или экземпляр директивы, для которого
 * вернуть инжектор.
 *  @returns Инжектор, связанный с элементом, компонентом или экземпляром директивы.
 *
 * @publicApi
 * @globalApi ng
 */
export function getInjector(elementOrDir: Element|{}): Injector {
  const context = loadLContext(elementOrDir, false);
  if (context === null) return Injector.NULL;

  const tNode = context.lView[TVIEW].data[context.nodeIndex] as TElementNode;
  return new NodeInjector(tNode, context.lView);
}

/**
 * Retrieve a set of injection tokens at a given DOM node.
 *
 * @param element Element for which the injection tokens should be retrieved.
 */
export function getInjectionTokens(element: Element): any[] {
  const context = loadLContext(element, false);
  if (context === null) return [];
  const lView = context.lView;
  const tView = lView[TVIEW];
  const tNode = tView.data[context.nodeIndex] as TNode;
  const providerTokens: any[] = [];
  const startIndex = tNode.providerIndexes & TNodeProviderIndexes.ProvidersStartIndexMask;
  const endIndex = tNode.directiveEnd;
  for (let i = startIndex; i < endIndex; i++) {
    let value = tView.data[i];
    if (isDirectiveDefHack(value)) {
      // The fact that we sometimes store Type and sometimes DirectiveDef in this location is a
      // design flaw.  We should always store same type so that we can be monomorphic. The issue
      // is that for Components/Directives we store the def instead the type. The correct behavior
      // is that we should always be storing injectable type in this location.
      value = value.type;
    }
    providerTokens.push(value);
  }
  return providerTokens;
}

/**
 * Извлекает экземпляры директивы, связанные с данным элементом DOM. Не включаетсебя.
 * экземпляры компонентов.
 *
 *  @usageNotes
 * Учитывая следующую структуруDOM:.
 *  ```
 *  <my-app>
 *    <button my-button></button>
 *    <my-comp></my-comp>
 *  </my-app>
 *  ```
 * Вызов `getDirectives` на `<button>` возвращает массив с экземпляром `MyButton`
 * директива, связанная с элементом DOM.
 *
 * Вызов `getDirectives` на `<my-comp>` будет возвращать пустой массив.
 *
 *  @param элемент DOM элемент, для которого нужно получить директивы.
 *  @returns Массив директив, связанных с элементом.
 *
 * @publicApi
 * @globalApi ng
 */
export function getDirectives(element: Element): {}[] {
  const context = loadLContext(element)!;

  if (context.directives === undefined) {
    context.directives = getDirectivesAtNodeIndex(context.nodeIndex, context.lView, false);
  }

  // The `directives` in this case are a named array called `LComponentView`. Clone the
  // result so we don't expose an internal data structure in the user's console.
  return context.directives === null ? [] : [...context.directives];
}

/**
 * Returns LContext associated with a target passed as an argument.
 * Throws if a given target doesn't have associated LContext.
 */
export function loadLContext(target: {}): LContext;
export function loadLContext(target: {}, throwOnNotFound: false): LContext|null;
export function loadLContext(target: {}, throwOnNotFound: boolean = true): LContext|null {
  const context = getLContext(target);
  if (!context && throwOnNotFound) {
    throw new Error(
        ngDevMode ? `Unable to find context associated with ${stringifyForError(target)}` :
                    'Invalid ng target');
  }
  return context;
}

/**
 * Retrieve map of local references.
 *
 * The references are retrieved as a map of local reference name to element or directive instance.
 *
 * @param target DOM element, component or directive instance for which to retrieve
 *    the local references.
 */
export function getLocalRefs(target: {}): {[key: string]: any} {
  const context = loadLContext(target, false);
  if (context === null) return {};

  if (context.localRefs === undefined) {
    context.localRefs = discoverLocalRefs(context.lView, context.nodeIndex);
  }

  return context.localRefs || {};
}

/**
 * Извлекает элемент хоста экземпляра компонента или директивы.
 * Элемент host является элементом DOM, который соответствует селектору директивы.
 *
 *  @param componentOrDirective Компонент или экземпляр директивы, для которого хост
 * элемент должен быть восстановлен.
 *  @returns Хост-элемент цели.
 *
 * @publicApi
 * @globalApi ng
 */
export function getHostElement(componentOrDirective: {}): Element {
  return getLContext(componentOrDirective)!.native as never as Element;
}

/**
 * Retrieves the rendered text for a given component.
 *
 * This function retrieves the host element of a component and
 * and then returns the `textContent` for that element. This implies
 * that the text returned will include re-projected content of
 * the component as well.
 *
 * @param component The component to return the content text for.
 */
export function getRenderedText(component: any): string {
  const hostElement = getHostElement(component);
  return hostElement.textContent || '';
}

export function loadLContextFromNode(node: Node): LContext {
  if (!(node instanceof Node)) throw new Error('Expecting instance of DOM Element');
  return loadLContext(node)!;
}

/**
 * Конфигурация прослушивателя событий, возвращенная из `getListeners`.
 * @publicApi
 */
export interface Listener {
  /** Name of the event listener. */
  name: string;
  /** Element that the listener is bound to. */
  element: Element;
  /** Callback that is invoked when the event is triggered. */
  callback: (value: any) => any;
  /** Whether the listener is using event capturing. */
  useCapture: boolean;
  /**
   * Type of the listener (e.g. a native DOM event or a custom @Output).
   */
  type: 'dom'|'output';
}


/**
 * Получает список прослушивателей событий, связанных с элементом DOM. Список включает хост
 * прослушиватели, но они не включают прослушиватели событий, определенные вне контекста Angular
 * (например, через `addEventListener`).
 *
 *  @usageNotes
 * Учитывая следующую структуруDOM:.
 *  ```
 *  <my-app>
 *    <div (click)="doSomething()"></div>
 *  </my-app>
 *
 *  ```
 * Вызов `getListeners` на `<div>` будет возвращать объекткоторый выглядит следующим:.
 *  ```
 *  {
 *    name: 'click',
 *    element: <div>,
 *    callback: () => doSomething(),
 *    useCapture: false
 *  }
 *  ```
 *
 *  @param element Элемент, для которого должны быть получены слушатели DOM.
 *  @returns Массив слушателей событий в элементе DOM.
 *
 * @publicApi
 * @globalApi ng
 */
export function getListeners(element: Element): Listener[] {
  assertDomElement(element);
  const lContext = loadLContext(element, false);
  if (lContext === null) return [];

  const lView = lContext.lView;
  const tView = lView[TVIEW];
  const lCleanup = lView[CLEANUP];
  const tCleanup = tView.cleanup;
  const listeners: Listener[] = [];
  if (tCleanup && lCleanup) {
    for (let i = 0; i < tCleanup.length;) {
      const firstParam = tCleanup[i++];
      const secondParam = tCleanup[i++];
      if (typeof firstParam === 'string') {
        const name: string = firstParam;
        const listenerElement = unwrapRNode(lView[secondParam]) as any as Element;
        const callback: (value: any) => any = lCleanup[tCleanup[i++]];
        const useCaptureOrIndx = tCleanup[i++];
        // if useCaptureOrIndx is boolean then report it as is.
        // if useCaptureOrIndx is positive number then it in unsubscribe method
        // if useCaptureOrIndx is negative number then it is a Subscription
        const type =
            (typeof useCaptureOrIndx === 'boolean' || useCaptureOrIndx >= 0) ? 'dom' : 'output';
        const useCapture = typeof useCaptureOrIndx === 'boolean' ? useCaptureOrIndx : false;
        if (element == listenerElement) {
          listeners.push({element, name, callback, useCapture, type});
        }
      }
    }
  }
  listeners.sort(sortListeners);
  return listeners;
}

function sortListeners(a: Listener, b: Listener) {
  if (a.name == b.name) return 0;
  return a.name < b.name ? -1 : 1;
}

/**
 * This function should not exist because it is megamorphic and only mostly correct.
 *
 * See call site for more info.
 */
function isDirectiveDefHack(obj: any): obj is DirectiveDef<any> {
  return obj.type !== undefined && obj.template !== undefined && obj.declaredInputs !== undefined;
}

/**
 * Returns the attached `DebugNode` instance for an element in the DOM.
 *
 * @param element DOM element which is owned by an existing component's view.
 */
export function getDebugNode(element: Element): DebugNode|null {
  let debugNode: DebugNode|null = null;

  const lContext = loadLContextFromNode(element);
  const lView = lContext.lView;
  const nodeIndex = lContext.nodeIndex;
  if (nodeIndex !== -1) {
    const valueInLView = lView[nodeIndex];
    // this means that value in the lView is a component with its own
    // data. In this situation the TNode is not accessed at the same spot.
    const tNode = isLView(valueInLView) ? (valueInLView[T_HOST] as TNode) :
                                          getTNode(lView[TVIEW], nodeIndex - HEADER_OFFSET);
    debugNode = buildDebugNode(tNode, lView, nodeIndex);
  }

  return debugNode;
}

/**
 * Retrieve the component `LView` from component/element.
 *
 * NOTE: `LView` is a private and should not be leaked outside.
 *       Don't export this method to `ng.*` on window.
 *
 * @param target DOM element or component instance for which to retrieve the LView.
 */
export function getComponentLView(target: any): LView {
  const lContext = loadLContext(target);
  const nodeIndx = lContext.nodeIndex;
  const lView = lContext.lView;
  const componentLView = lView[nodeIndx];
  ngDevMode && assertLView(componentLView);
  return componentLView;
}

/** Asserts that a value is a DOM Element. */
function assertDomElement(value: any) {
  if (typeof Element !== 'undefined' && !(value instanceof Element)) {
    throw new Error('Expecting instance of DOM Element');
  }
}
