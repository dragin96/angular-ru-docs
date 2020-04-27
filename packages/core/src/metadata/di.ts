/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '../di/injection_token';
import {Type} from '../interface/type';
import {makePropDecorator} from '../util/decorators';

/**
 * Токен DI, который можно использовать для создания виртуального[провайдера](guide/glossary#provider)
 * это заполнит поле `entryComponents` компонентов и NgModules
 * основе его `useValue` стоимости недвижимости useValue.
 * Все компоненты, на которые есть ссылка в `useValue``useValue` (либо напрямую
 * или во вложенном массиве или карте) добавляются в `entryComponents`.
 *
 *  @usageNotes
 *
 * В следующем примере показано, как маршрутизатор может заполнять `entryComponents`
 * поле NgModule на основе конфигурации маршрутизатора, которая ссылается
 * к компонентам.
 *
 *  ```typescript
 *  // helper function inside the router
 *  function provideRoutes(routes) {
 *    return [
 *      {provide: ROUTES, useValue: routes},
 *      {provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: routes, multi: true}
 *    ];
 *  }
 *
 *  // user code
 *  let routes = [
 *    {path: '/root', component: RootComp},
 *    {path: '/teams', component: TeamsComp}
 *  ];
 *
 *  @NgModule({
 *    providers: [provideRoutes(routes)]
 *  })
 *  class ModuleWithRoutes {}
 *  ```
 *
 * @publicApi
 * @deprecated Since 9.0.0. With Ivy, this property is no longer necessary.
 */
export const ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken<any>('AnalyzeForEntryComponents');

/**
 * Введите в `Attribute` декоратор / функции конструктора.
 *
 * @publicApi
 */
export interface AttributeDecorator {
  /**
 * Указывает, что должно быть введено постоянное значение атрибута.
 *
 * Директива может вводить константные строковые литералы атрибутов хост-элемента.
 *
 *  @usageNotes
 *
 * Предположим, у нас есть `<input>` элементи мы хотим знать его `type`.
 *
 *  ```html
 *  <input type="text">
 *  ```
 *
 * Декоратор можетстроковый литерал `text``text` как в следующем примере.
 *
 *  {@example core/ts/metadata/metadata.ts region='attributeMetadata'}
 *
 * @publicApi
   */
  (name: string): any;
  new(name: string): Attribute;
}


/**
 * Тип метаданных Атрибута.
 *
 * @publicApi
 */
export interface Attribute {
  /**
   * The name of the attribute to be injected into the constructor.
   */
  attributeName?: string;
}

/**
 * Тип метаданных запроса.
 *
 * @publicApi
 */
export interface Query {
  descendants: boolean;
  first: boolean;
  read: any;
  isViewQuery: boolean;
  selector: any;
  static?: boolean;
}

/**
 * Базовый класс для метаданных запроса.
 *
 *  @see `ContentChildren`.
 *  @see `ContentChild`.
 *  @see `ViewChildren`.
 *  @see `ViewChild`.
 *
 * @publicApi
 */
export abstract class Query {}

/**
 * Тип функции декоратора / конструктора ContentChildren.
 *
 *  @see `ContentChildren`.
 * @publicApi
 */
export interface ContentChildrenDecorator {
  /**
   * Parameter decorator that configures a content query.
   *
   * Use to get the `QueryList` of elements or directives from the content DOM.
   * Any time a child element is added, removed, or moved, the query list will be
   * updated, and the changes observable of the query list will emit a new value.
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   *
   * Does not retrieve elements or directives that are in other components' templates,
   * since a component's template is always a black box to its ancestors.
   *
   * **Metadata Properties**:
   *
   * * **selector** - The directive type or the name used for querying.
   * * **descendants** - True to include all descendants, otherwise include only direct children.
   * * **read** - True to read a different token from the queried elements.
   *
   * @usageNotes
   *
   * Here is a simple demonstration of how the `ContentChildren` decorator can be used.
   *
   * {@example core/di/ts/contentChildren/content_children_howto.ts region='HowTo'}
   *
   * ### Tab-pane example
   *
   * Here is a slightly more realistic example that shows how `ContentChildren` decorators
   * can be used to implement a tab pane component.
   *
   * {@example core/di/ts/contentChildren/content_children_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: Type<any>|Function|string, opts?: {descendants?: boolean, read?: any}): any;
  new(selector: Type<any>|Function|string, opts?: {descendants?: boolean, read?: any}): Query;
}

/**
 * Тип метаданных ContentChildren.
 *
 *
 *  @Annotation
 * @publicApi
 */
export type ContentChildren = Query;

/**
 * ContentChildren декоратор и метаданные.
 *
 *
 *  @Annotation
 * @publicApi
 */
export const ContentChildren: ContentChildrenDecorator = makePropDecorator(
    'ContentChildren',
    (selector?: any, data: any = {}) =>
        ({selector, first: false, isViewQuery: false, descendants: false, ...data}),
    Query);

/**
 * Тип функции декоратора / конструктора ContentChild.
 *
 * @publicApi
 */
export interface ContentChildDecorator {
  /**
   * Parameter decorator that configures a content query.
   *
   * Use to get the first element or the directive matching the selector from the content DOM.
   * If the content DOM changes, and a new child matches the selector,
   * the property will be updated.
   *
   * Content queries are set before the `ngAfterContentInit` callback is called.
   *
   * Does not retrieve elements or directives that are in other components' templates,
   * since a component's template is always a black box to its ancestors.
   *
   * **Metadata Properties**:
   *
   * * **selector** - The directive type or the name used for querying.
   * * **read** - True to read a different token from the queried element.
   * * **static** - True to resolve query results before change detection runs,
   * false to resolve after change detection. Defaults to false.
   *
   * @usageNotes
   *
   * {@example core/di/ts/contentChild/content_child_howto.ts region='HowTo'}
   *
   * ### Example
   *
   * {@example core/di/ts/contentChild/content_child_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: Type<any>|Function|string, opts?: {read?: any, static?: boolean}): any;
  new(selector: Type<any>|Function|string, opts?: {read?: any, static?: boolean}): ContentChild;
}

/**
 * Тип метаданных ContentChild.
 *
 * @publicApi
 */
export type ContentChild = Query;

/**
 * ContentChild декоратор и метаданные.
 *
 *
 *  @Annotation
 *
 * @publicApi
 */
export const ContentChild: ContentChildDecorator = makePropDecorator(
    'ContentChild',
    (selector?: any, data: any = {}) =>
        ({selector, first: true, isViewQuery: false, descendants: true, ...data}),
    Query);

/**
 * Тип функции декоратора / конструктора ViewChildren.
 *
 *  @see `ViewChildren`.
 *
 * @publicApi
 */
export interface ViewChildrenDecorator {
  /**
   * Parameter decorator that configures a view query.
   *
   * Use to get the `QueryList` of elements or directives from the view DOM.
   * Any time a child element is added, removed, or moved, the query list will be updated,
   * and the changes observable of the query list will emit a new value.
   *
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * **Metadata Properties**:
   *
   * * **selector** - The directive type or the name used for querying.
   * * **read** - True to read a different token from the queried elements.
   *
   * @usageNotes
   *
   * {@example core/di/ts/viewChildren/view_children_howto.ts region='HowTo'}
   *
   * ### Another example
   *
   * {@example core/di/ts/viewChildren/view_children_example.ts region='Component'}
   *
   * @Annotation
   */
  (selector: Type<any>|Function|string, opts?: {read?: any}): any;
  new(selector: Type<any>|Function|string, opts?: {read?: any}): ViewChildren;
}

/**
 * Тип метаданных ViewChildren.
 *
 * @publicApi
 */
export type ViewChildren = Query;

/**
 * ViewChildren декоратор и метаданные.
 *
 *  @Annotation
 * @publicApi
 */
export const ViewChildren: ViewChildrenDecorator = makePropDecorator(
    'ViewChildren',
    (selector?: any, data: any = {}) =>
        ({selector, first: false, isViewQuery: true, descendants: true, ...data}),
    Query);

/**
 * Тип функции декоратора / конструктора ViewChild.
 *
 *  @see `ViewChild`.
 * @publicApi
 */
export interface ViewChildDecorator {
  /**
   * @description
   * Property decorator that configures a view query.
   * The change detector looks for the first element or the directive matching the selector
   * in the view DOM. If the view DOM changes, and a new child matches the selector,
   * the property is updated.
   *
   * View queries are set before the `ngAfterViewInit` callback is called.
   *
   * **Metadata Properties**:
   *
   * * **selector** - The directive type or the name used for querying.
   * * **read** - True to read a different token from the queried elements.
   * * **static** - True to resolve query results before change detection runs,
   * false to resolve after change detection. Defaults to false.
   *
   *
   * The following selectors are supported.
   *   * Any class with the `@Component` or `@Directive` decorator
   *   * A template reference variable as a string (e.g. query `<my-component #cmp></my-component>`
   * with `@ViewChild('cmp')`)
   *   * Any provider defined in the child component tree of the current component (e.g.
   * `@ViewChild(SomeService) someService: SomeService`)
   *   * Any provider defined through a string token (e.g. `@ViewChild('someToken') someTokenVal:
   * any`)
   *   * A `TemplateRef` (e.g. query `<ng-template></ng-template>` with `@ViewChild(TemplateRef)
   * template;`)
   *
   * @usageNotes
   *
   * {@example core/di/ts/viewChild/view_child_example.ts region='Component'}
   *
   * ### Example 2
   *
   * {@example core/di/ts/viewChild/view_child_howto.ts region='HowTo'}
   *
   * @Annotation
   */
  (selector: Type<any>|Function|string, opts?: {read?: any, static?: boolean}): any;
  new(selector: Type<any>|Function|string, opts?: {read?: any, static?: boolean}): ViewChild;
}

/**
 * Тип метаданных ViewChild.
 *
 * @publicApi
 */
export type ViewChild = Query;

/**
 * Декоратор ViewChild и метаданные.
 *
 *  @Annotation
 * @publicApi
 */
export const ViewChild: ViewChildDecorator = makePropDecorator(
    'ViewChild',
    (selector: any, data: any) =>
        ({selector, first: true, isViewQuery: true, descendants: true, ...data}),
    Query);
