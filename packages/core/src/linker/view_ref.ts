/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ApplicationRef} from '../application_ref';
import {ChangeDetectorRef} from '../change_detection/change_detector_ref';

/**
 * Представляет Angular[(вид),.](guide/glossary#view)(вид),.
 * в частности[хоста](guide/glossary#view-tree), которое определяется компонентом.
 * Также служит базовым классом
 * это добавляет методы уничтожения для[встроенные представления](guide/glossary#view-tree).
 *
 *  @see `EmbeddedViewRef`
 *
 * @publicApi
 */
export abstract class ViewRef extends ChangeDetectorRef {
  /**
   * Destroys this view and all of the data structures associated with it.
   */
  abstract destroy(): void;

  /**
   * Reports whether this view has been destroyed.
   * @returns True after the `destroy()` method has been called, false otherwise.
   */
  abstract get destroyed(): boolean;

  /**
   * A lifecycle hook that provides additional developer-defined cleanup
   * functionality for views.
   * @param callback A handler function that cleans up developer-defined data
   * associated with a view. Called when the `destroy()` method is invoked.
   */
  abstract onDestroy(callback: Function): any /** TODO #9100 */;
}

/**
 * Представляет Angular[представление](guide/glossary#view)в контейнере представления.
 * На[встроенное представление](guide/glossary#view-tree)можно ссылаться из компонента
 * кроме компонента хостинга, шаблон которого определяет его, или его можно определить
 * независимо от `TemplateRef`.
 *
 * Свойства элементов в представлении могут изменяться, но структура (количество и порядок) элементов в
 * вид не может. Измените структуру элементов, вставив, переместив или
 * удаление вложенных представлений в контейнере представлений.
 *
 *  @see `ViewContainerRef`
 *
 *  @usageNotes
 *
 * Следующий шаблон разбивается на два отдельных `TemplateRef` экземпляра
 * внешний и внутренний.
 *
 *  ```
 *  Count: {{items.length}}
 *  <ul>
 *    <lingFor="letitem of items">{{item}}</li>
 *  </ul>
 *  ```
 *
 * Это внешняя `TemplateRef` TemplateRef:.
 *
 *  ```
 *  Count: {{items.length}}
 *  <ul>
 *    <ng-template ngFor let-item [ngForOf]="items"></ng-template>
 *  </ul>
 *  ```
 *
 * Это внутренний `TemplateRef` TemplateRef:.
 *
 *  ```
 *    <li>{{item}}</li>
 *  ```
 *
 * Наружный и внутренний `TemplateRef` экземплярысобраны в представления следующим:.
 *
 *  ```
 *  <!-- ViewRef: outer-0 -->
 *  Count: 2
 *  <ul>
 *    <ng-template view-container-ref></ng-template>
 *    <!-- ViewRef: inner-1 --><li>first</li><!-- /ViewRef: inner-1 -->
 *    <!-- ViewRef: inner-2 --><li>second</li><!-- /ViewRef: inner-2 -->
 *  </ul>
 *  <!-- /ViewRef: outer-0 -->
 *  ```
 * @publicApi
 */
export abstract class EmbeddedViewRef<C> extends ViewRef {
  /**
   * The context for this view, inherited from the anchor element.
   */
  abstract get context(): C;

  /**
   * The root nodes for this embedded view.
   */
  abstract get rootNodes(): any[];
}

export interface InternalViewRef extends ViewRef {
  detachFromAppRef(): void;
  attachToAppRef(appRef: ApplicationRef): void;
}
