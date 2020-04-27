/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, DoCheck, EmbeddedViewRef, Input, isDevMode, IterableChangeRecord, IterableChanges, IterableDiffer, IterableDiffers, NgIterable, TemplateRef, TrackByFunction, ViewContainerRef} from '@angular/core';

/**
 * @publicApi
 */
export class NgForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  constructor(public $implicit: T, public ngForOf: U, public index: number, public count: number) {}

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.count - 1;
  }

  get even(): boolean {
    return this.index % 2 === 0;
  }

  get odd(): boolean {
    return !this.even;
  }
}

/**
 * A[(структурная директива)](guide/structural-directives)чтоделает.
 * шаблон для каждого элемента в коллекции.
 * Директива помещается в элемент, который становится родителем
 * из клонированных шаблонов.
 *
 *  The `ngForOf`директиваобычно используетсяв.
 *  [сокращенная форма](guide/structural-directives#the-asterisk--prefix) `ngFor`.
 * В этой форме шаблон, который будет отображаться для каждой итерации, является содержимым
 * якорного элемента, содержащего директиву.
 *
 * В следующем примере показан сокращенный синтаксис с некоторыми параметрами
 * содержится в `<li>` элементе.
 *
 *  ```
 *  <lingFor="let item of items; index as i; trackBy: trackByFn">...</li>
 *  ```
 *
 * Сокращенная форма раскрывается в длинную форму, в которой используется `ngForOf` селектор
 * в `<ng-template>` элементе.
 * Содержимое элемента `<ng-template>` является элементом `<li>` который содержит
 * краткая директива.
 *
 * Вот расширенная версия краткого примера.
 *
 *  ```
 *  <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
 *    <li>...</li>
 *  </ng-template>
 *  ```
 *
 * Angular автоматически расширяет сокращенный синтаксис при компиляции шаблона.
 * Контекст для каждого встроенного представления логически объединяется с текущим компонентом
 * контекст в соответствии с его лексическим положением.
 *
 * При использовании сокращенного синтаксиса Angular разрешает только[одну структурную директиву.на элемент](guide/structural-directives#one-structural-directive-per-host-element).
 * Если вы хотите перебрать условно,например,.
 * поставил `ngIf` на элемент контейнеракоторый оборачивает `ngFor` элемент.
 * Для дальнейшего обсуждения, см
 *  [Структурные директивы](guide/structural-directives#one-per-element).
 *
 *  @usageNotes
 *
 *  ### Локальные переменные
 *
 *  `NgForOf`предоставляет экспортированные значения, которые можно связать с локальными переменными.
 * Например:.
 *
 *   ```
 *  <lingFor="let user of users; index as i; first as isFirst">
 *     {{i}}/{{users.length}}. {{user}} <spanngIf="isFirst">default</span>
 *  </li>
 *  ```
 *
 * Следующие экспортируемые значения могут быть привязаны к локальнымпеременным:.
 *
 * -`$implicit: T`: значение отдельных элементов в итерируемом (`ngForOf`).
 * -`ngForOf: NgIterable<T>`: значение итерируемого выражения. Полезно, когда выражение
 * более сложный, чем доступ к свойству, например, при использовании асинхронного канала (`userStreams |.async`).
 * -`index: number`: Индекс текущего элемента в итерируемом.
 * -`count: number`: длина повторяемого элемента.
 * -`first: boolean`: True, когда элемент является первым элементом в повторяемом элементе.
 * -`last: boolean`: True, когда элемент является последним элементом в повторяемом элементе.
 * -`even: boolean`: True, когда элемент имеет четный индекс в итерируемом элементе.
 * -`odd: boolean`: True, если элемент имеет нечетный индекс в итерируемой.
 *
 *  ### Изменить распространение
 *
 * Когда содержимое изменений итератора, `NgForOf` делает соответствующие изменения вDOM:.
 *
 * Когда элемент добавляется, новый экземпляр шаблона добавляется в DOM.
 * Когда элемент удаляется, его экземпляр шаблона удаляется из DOM.
 * Когда элементы переупорядочиваются, их соответствующие шаблоны переупорядочиваются в DOM.
 *
 * Angular использует идентификатор объекта для отслеживания вставок и удалений внутри итератора и воспроизведения
 * эти изменения в DOM. Это имеет важные последствия для анимации и любого состояния
 * имеющиеся элементы управления, такие как `<input>` элементыкоторые принимают пользовательский ввод. Вставленные строки могут
 * быть анимированными, удаленные строки могут быть анимированы, а неизмененные строки сохраняют любое несохраненное состояние
 * такие как пользовательский ввод.
 * Более подробнуюо анимации см[(переходы и триггеры).](guide/transition-and-triggers)триггеры).
 *
 * Идентичность элементов в итераторе может изменяться, а данные - нет.
 * Это может произойти, например, если итератор создается из RPC на сервер, и это
 * RPC перезапущен. Даже если данные не изменились, второй ответ создает объекты с
 * разные идентичности, и Angular должен разрушить весь DOM и восстановить его (как будто все старое
 * элементы были удалены и все новые элементы вставлены).
 *
 * Чтобы избежать этой дорогостоящей операции, вы можете настроить алгоритм отслеживания по умолчанию.
 * путем предоставления `trackBy` для `NgForOf``NgForOf`.
 *  `trackBy`принимает функциюкоторая имеет два аргумента: `index` и `item` элемент.
 * Если `trackBy` , Angular треки изменяются в зависимости от возвращаемого значения функции.
 *
 *  @see [Структурные директивы](guide/structural-directives)
 *  @ngModule CommonModule
 * @publicApi
 */
@Directive({selector: '[ngFor][ngForOf]'})
export class NgForOf<T, U extends NgIterable<T> = NgIterable<T>> implements DoCheck {
  /**
   * The value of the iterable expression, which can be used as a
   * [template input variable](guide/structural-directives#template-input-variable).
   */
  @Input()
  set ngForOf(ngForOf: U&NgIterable<T>|undefined|null) {
    this._ngForOf = ngForOf;
    this._ngForOfDirty = true;
  }
  /**
   * A function that defines how to track changes for items in the iterable.
   *
   * When items are added, moved, or removed in the iterable,
   * the directive must re-render the appropriate DOM nodes.
   * To minimize churn in the DOM, only nodes that have changed
   * are re-rendered.
   *
   * By default, the change detector assumes that
   * the object instance identifies the node in the iterable.
   * When this function is supplied, the directive uses
   * the result of calling this function to identify the item node,
   * rather than the identity of the object itself.
   *
   * The function receives two inputs,
   * the iteration index and the node object ID.
   */
  @Input()
  set ngForTrackBy(fn: TrackByFunction<T>) {
    if (isDevMode() && fn != null && typeof fn !== 'function') {
      // TODO(vicb): use a log service once there is a public one available
      if (<any>console && <any>console.warn) {
        console.warn(
            `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
            `See https://angular.io/api/common/NgForOf#change-propagation for more information.`);
      }
    }
    this._trackByFn = fn;
  }

  get ngForTrackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }

  private _ngForOf: U|undefined|null = null;
  private _ngForOfDirty: boolean = true;
  private _differ: IterableDiffer<T>|null = null;
  // TODO(issue/24571): remove '!'.
  private _trackByFn!: TrackByFunction<T>;

  constructor(
      private _viewContainer: ViewContainerRef,
      private _template: TemplateRef<NgForOfContext<T, U>>, private _differs: IterableDiffers) {}

  /**
   * A reference to the template that is stamped out for each item in the iterable.
   * @see [template reference variable](guide/template-syntax#template-reference-variables--var-)
   */
  @Input()
  set ngForTemplate(value: TemplateRef<NgForOfContext<T, U>>) {
    // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
    // The current type is too restrictive; a template that just uses index, for example,
    // should be acceptable.
    if (value) {
      this._template = value;
    }
  }

  /**
   * Applies the changes when needed.
   */
  ngDoCheck(): void {
    if (this._ngForOfDirty) {
      this._ngForOfDirty = false;
      // React on ngForOf changes only once all inputs have been initialized
      const value = this._ngForOf;
      if (!this._differ && value) {
        try {
          this._differ = this._differs.find(value).create(this.ngForTrackBy);
        } catch {
          throw new Error(`Cannot find a differ supporting object '${value}' of type '${
              getTypeName(value)}'. NgFor only supports binding to Iterables such as Arrays.`);
        }
      }
    }
    if (this._differ) {
      const changes = this._differ.diff(this._ngForOf);
      if (changes) this._applyChanges(changes);
    }
  }

  private _applyChanges(changes: IterableChanges<T>) {
    const insertTuples: RecordViewTuple<T, U>[] = [];
    changes.forEachOperation(
        (item: IterableChangeRecord<any>, adjustedPreviousIndex: number|null,
         currentIndex: number|null) => {
          if (item.previousIndex == null) {
            // NgForOf is never "null" or "undefined" here because the differ detected
            // that a new item needs to be inserted from the iterable. This implies that
            // there is an iterable value for "_ngForOf".
            const view = this._viewContainer.createEmbeddedView(
                this._template, new NgForOfContext<T, U>(null!, this._ngForOf!, -1, -1),
                currentIndex === null ? undefined : currentIndex);
            const tuple = new RecordViewTuple<T, U>(item, view);
            insertTuples.push(tuple);
          } else if (currentIndex == null) {
            this._viewContainer.remove(
                adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);
          } else if (adjustedPreviousIndex !== null) {
            const view = this._viewContainer.get(adjustedPreviousIndex)!;
            this._viewContainer.move(view, currentIndex);
            const tuple = new RecordViewTuple(item, <EmbeddedViewRef<NgForOfContext<T, U>>>view);
            insertTuples.push(tuple);
          }
        });

    for (let i = 0; i < insertTuples.length; i++) {
      this._perViewChange(insertTuples[i].view, insertTuples[i].record);
    }

    for (let i = 0, ilen = this._viewContainer.length; i < ilen; i++) {
      const viewRef = <EmbeddedViewRef<NgForOfContext<T, U>>>this._viewContainer.get(i);
      viewRef.context.index = i;
      viewRef.context.count = ilen;
      viewRef.context.ngForOf = this._ngForOf!;
    }

    changes.forEachIdentityChange((record: any) => {
      const viewRef =
          <EmbeddedViewRef<NgForOfContext<T, U>>>this._viewContainer.get(record.currentIndex);
      viewRef.context.$implicit = record.item;
    });
  }

  private _perViewChange(
      view: EmbeddedViewRef<NgForOfContext<T, U>>, record: IterableChangeRecord<any>) {
    view.context.$implicit = record.item;
  }

  /**
   * Asserts the correct type of the context for the template that `NgForOf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgForOf` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T, U extends NgIterable<T>>(dir: NgForOf<T, U>, ctx: any):
      ctx is NgForOfContext<T, U> {
    return true;
  }
}

class RecordViewTuple<T, U extends NgIterable<T>> {
  constructor(public record: any, public view: EmbeddedViewRef<NgForOfContext<T, U>>) {}
}

function getTypeName(type: any): string {
  return type['name'] || typeof type;
}
