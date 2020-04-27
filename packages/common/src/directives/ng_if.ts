/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef, ɵstringify as stringify} from '@angular/core';


/**
 * Структурная директива, которая условно включает шаблон, основанный на значении
 * выражение приведено к логическому.
 * Когда выражение оценивается как true, Angular отображает шаблон
 * условиив `then` пункта, а когда ложь илинулевой,.
 * Angular отображает шаблон, предоставленный в дополнительном `else` . По умолчанию
 * шаблон для `else` пуст.
 *
 * А[(форма сокращенной)](guide/structural-directives#the-asterisk--prefix)директивы,.
 *  `ngIf="condition"`, обычно используется при условии
 * в качестве атрибута элемента привязки для вставленного шаблона.
 * Angular расширяет это в более явную версию, в которой элемент привязки
 * содержится в `<ng-template>` элементе.
 *
 * Простая форма с синтаксисомсокращенном:.
 *
 *  ```
 *  <divngIf="condition">Content to render when condition is true.</div>
 *  ```
 *
 * Простая форма с расширеннымсинтаксисом:.
 *
 *  ```
 *  <ng-template [ngIf]="condition"><div>Content to render when condition is
 *  true.</div></ng-template>
 *  ```
 *
 * Форма с «другим»блоком:.
 *
 *  ```
 *  <divngIf="condition; else elseBlock">Content to render when condition is true.</div>
 *  <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 *  ```
 *
 * Сокращенная форма с «тогда» и «Else»блоков:.
 *
 *  ```
 *  <divngIf="condition; then thenBlock else elseBlock"></div>
 *  <ng-template #thenBlock>Content to render when condition is true.</ng-template>
 *  <ng-template #elseBlock>Content to render when condition is false.</ng-template>
 *  ```
 *
 * Форма с хранения значениялокально:.
 *
 *  ```
 *  <divngIf="condition as value; else elseBlock">{{value}}</div>
 *  <ng-template #elseBlock>Content to render when value is null.</ng-template>
 *  ```
 *
 *  @usageNotes
 *
 *  The `ngIf`директиванаиболее часто используется условно отображать шаблонрядный,.
 * как видно в следующем примере.
 * По умолчанию `else` пуст.
 *
 *  {@example common/ngIf/ts/module.ts region='NgIfSimple'}
 *
 *  ### Отображение альтернативного шаблона с использованием `else`
 *
 * Чтобы отобразить шаблонкогда `expression` выражение в ЛОЖЬ, используйте `else` шаблона.
 * привязка, как показано в следующем примере.
 *  The `else`привязки точек к `<ng-template>` нг-элементамеченой `#elseBlock` #elseBlock.
 * Шаблон может быть определен в любом месте в представлении компонента, но обычно размещается сразу после
 *  `ngIf`для удобства чтения.
 *
 *  {@example common/ngIf/ts/module.ts region='NgIfElse'}
 *
 *  ### Используя внешний `then` шаблон
 *
 * В предыдущем примере шаблон then-условия указан как встроенный, как содержимое
 * тег, который содержит `ngIf` директиву. Вы также можете указать шаблон, который определен
 * внешне, путем ссылки на помеченный элемент `<ng-template>` . Когда вы делаете это, вы можете
 * измените шаблон для использования во время выполнения, как показано в следующем примере.
 *
 *  {@example common/ngIf/ts/module.ts region='NgIfThenElse'}
 *
 *  ### Сохранение условного результата в переменной
 *
 * Возможно, вы захотите показать набор свойств из того же объекта. Если вы ждете
 * для асинхронных данных объект может быть неопределенным.
 * В этом случае вы можете использовать `ngIf` и сохранить результат условия в локальном
 * переменная, как показано в следующем примере.
 *
 *  {@example common/ngIf/ts/module.ts region='NgIfAs'}
 *
 * Этот код использует только один `AsyncPipe` , поэтомутолько одна подписка.
 * Условный оператор сохраняет результат `userStream|async` в локальной переменной` `user`.
 * Затем вы можетесвязать локального `user` повторно.
 *
 * Условные отображает данные только тогдакогда `userStream` возвращаетзначение,.
 * так что вам не нужно использовать
 *  [безопасный оператор навигации](guide/template-syntax#safe-navigation-operator)(`?.`)
 * для защиты от нулевых значений при доступе к свойствам.
 * Вы можете отобразить альтернативный шаблон во время ожидания данных.
 *
 *  ### Сокращенный синтаксис
 *
 * Сокращенный синтаксис `ngIf` расширяется до двух отдельных спецификаций шаблона
 * для условий «тогда» и «еще». Например, рассмотрим следующую стенографию
 * это означает, что страница загрузки отображается в ожидании загрузки данных.
 *
 *  ```
 *  <div class="hero-list"ngIf="heroes else loading">
 *   ...
 *  </div>
 *
 *  <ng-template #loading>
 *   <div>Loading...</div>
 *  </ng-template>
 *  ```
 *
 * Вы можете видеть, что предложение "else" ссылается на `<ng-template>`
 * с `#loading` и шаблоном для предложения then
 * предоставляется в качестве содержимого элемента привязки.
 *
 * Однако, когда Angular расширяет сокращенный синтаксис, он создает
 * другой `<ng-template>` с `ngIf` и `ngIfElse`.
 * Элемент привязки, содержащий шаблон для предложения then, становится
 * содержимое этогобез `<ng-template>``<ng-template>`.
 *
 *  ```
 *  <ng-template [ngIf]="heroes" [ngIfElse]="loading">
 *   <div class="hero-list">
 *    ...
 *   </div>
 *  </ng-template>
 *
 *  <ng-template #loading>
 *   <div>Loading...</div>
 *  </ng-template>
 *  ```
 *
 * Наличие неявного объекта шаблона имеет значение для вложения
 * структурные директивы. Подробнее об этом см
 *  [Структурные директивы](https://angular.io/guide/structural-directives#one-per-element).
 *
 *  @ngModule CommonModule
 * @publicApi
 */
@Directive({selector: '[ngIf]'})
export class NgIf<T = unknown> {
  private _context: NgIfContext<T> = new NgIfContext<T>();
  private _thenTemplateRef: TemplateRef<NgIfContext<T>>|null = null;
  private _elseTemplateRef: TemplateRef<NgIfContext<T>>|null = null;
  private _thenViewRef: EmbeddedViewRef<NgIfContext<T>>|null = null;
  private _elseViewRef: EmbeddedViewRef<NgIfContext<T>>|null = null;

  constructor(private _viewContainer: ViewContainerRef, templateRef: TemplateRef<NgIfContext<T>>) {
    this._thenTemplateRef = templateRef;
  }

  /**
   * The Boolean expression to evaluate as the condition for showing a template.
   */
  @Input()
  set ngIf(condition: T) {
    this._context.$implicit = this._context.ngIf = condition;
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to true.
   */
  @Input()
  set ngIfThen(templateRef: TemplateRef<NgIfContext<T>>|null) {
    assertTemplate('ngIfThen', templateRef);
    this._thenTemplateRef = templateRef;
    this._thenViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  /**
   * A template to show if the condition expression evaluates to false.
   */
  @Input()
  set ngIfElse(templateRef: TemplateRef<NgIfContext<T>>|null) {
    assertTemplate('ngIfElse', templateRef);
    this._elseTemplateRef = templateRef;
    this._elseViewRef = null;  // clear previous view if any.
    this._updateView();
  }

  private _updateView() {
    if (this._context.$implicit) {
      if (!this._thenViewRef) {
        this._viewContainer.clear();
        this._elseViewRef = null;
        if (this._thenTemplateRef) {
          this._thenViewRef =
              this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainer.clear();
        this._thenViewRef = null;
        if (this._elseTemplateRef) {
          this._elseViewRef =
              this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
        }
      }
    }
  }

  /** @internal */
  public static ngIfUseIfTypeGuard: void;

  /**
   * Assert the correct type of the expression bound to the `ngIf` input within the template.
   *
   * The presence of this static field is a signal to the Ivy template type check compiler that
   * when the `NgIf` structural directive renders its template, the type of the expression bound
   * to `ngIf` should be narrowed in some way. For `NgIf`, the binding expression itself is used to
   * narrow its type, which allows the strictNullChecks feature of TypeScript to work with `NgIf`.
   */
  static ngTemplateGuard_ngIf: 'binding';

  /**
   * Asserts the correct type of the context for the template that `NgIf` will render.
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgIf` structural directive renders its template with a specific context type.
   */
  static ngTemplateContextGuard<T>(dir: NgIf<T>, ctx: any): ctx is NgIfContext<NonNullable<T>> {
    return true;
  }
}

/**
 * @publicApi
 */
export class NgIfContext<T = unknown> {
  public $implicit: T = null!;
  public ngIf: T = null!;
}

function assertTemplate(property: string, templateRef: TemplateRef<any>|null): void {
  const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
  if (!isTemplateRefOrNull) {
    throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
  }
}
