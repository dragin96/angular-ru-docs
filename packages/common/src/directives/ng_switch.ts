/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, DoCheck, Host, Input, TemplateRef, ViewContainerRef} from '@angular/core';

export class SwitchView {
  private _created = false;

  constructor(
      private _viewContainerRef: ViewContainerRef, private _templateRef: TemplateRef<Object>) {}

  create(): void {
    this._created = true;
    this._viewContainerRef.createEmbeddedView(this._templateRef);
  }

  destroy(): void {
    this._created = false;
    this._viewContainerRef.clear();
  }

  enforceState(created: boolean) {
    if (created && !this._created) {
      this.create();
    } else if (!created && this._created) {
      this.destroy();
    }
  }
}

/**
 *  @ngModule CommonModule
 *
 *  @description
 *  The `[ngSwitch]`директивана контейнере задает выражение для сопоставления.
 * Соответствующие выражения предоставляются `ngSwitchCase` директивамидля представлений внутри контейнера.
 * - Каждый вид, который соответствует, представлен.
 * - Если совпадений нет, отображается представление с `ngSwitchDefault` директивой.
 * - Элементы внутри `[NgSwitch]` но вне любого `NgSwitchCase`
 * или `ngSwitchDefault` Директивасохраняется в этом месте.
 *
 *  @usageNotes
 * Определите элемент контейнера для директивы и укажите выражение switch
 * в соответствии сатрибутом:.
 *
 *  ```
 *  <container-element [ngSwitch]="switch_expression">
 *  ```
 *
 * Внутри контейнера `ngSwitchCase` определяют выражения соответствия
 * в качестве атрибутов. Включите `ngSwitchDefault` в качестве окончательного.
 *
 *  ```
 *  <container-element [ngSwitch]="switch_expression">
 *     <some-elementngSwitchCase="match_expression_1">...</some-element>
 *  ...
 *     <some-elementngSwitchDefault>...</some-element>
 *  </container-element>
 *  ```
 *
 *  ### Примеры использования
 *
 * Следующий пример показываеткак использовать больше чем один случайчтобы отобразитьтот жевид:.
 *
 *  ```
 *  <container-element [ngSwitch]="switch_expression">
 *    <!-- the same view can be shown in more than one case -->
 *    <some-elementngSwitchCase="match_expression_1">...</some-element>
 *    <some-elementngSwitchCase="match_expression_2">...</some-element>
 *    <some-other-elementngSwitchCase="match_expression_3">...</some-other-element>
 *    <!--default case when there are no matches -->
 *    <some-elementngSwitchDefault>...</some-element>
 *  </container-element>
 *  ```
 *
 * В следующем примере показанокак случаи могут бытьвложенными:.
 *  ```
 *  <container-element [ngSwitch]="switch_expression">
 *        <some-elementngSwitchCase="match_expression_1">...</some-element>
 *        <some-elementngSwitchCase="match_expression_2">...</some-element>
 *        <some-other-elementngSwitchCase="match_expression_3">...</some-other-element>
 *        <ng-containerngSwitchCase="match_expression_3">
 *          <!-- use a ng-container to group multiple root nodes -->
 *          <inner-element></inner-element>
 *          <inner-other-element></inner-other-element>
 *        </ng-container>
 *        <some-elementngSwitchDefault>...</some-element>
 *      </container-element>
 *  ```
 *
 * @publicApi
 * @see `NgSwitchCase`
 * @see `NgSwitchDefault`
 * @see [Structural Directives](guide/structural-directives)
 *
 */
@Directive({selector: '[ngSwitch]'})
export class NgSwitch {
  // TODO(issue/24571): remove '!'.
  private _defaultViews!: SwitchView[];
  private _defaultUsed = false;
  private _caseCount = 0;
  private _lastCaseCheckIndex = 0;
  private _lastCasesMatched = false;
  private _ngSwitch: any;

  @Input()
  set ngSwitch(newValue: any) {
    this._ngSwitch = newValue;
    if (this._caseCount === 0) {
      this._updateDefaultCases(true);
    }
  }

  /** @internal */
  _addCase(): number {
    return this._caseCount++;
  }

  /** @internal */
  _addDefault(view: SwitchView) {
    if (!this._defaultViews) {
      this._defaultViews = [];
    }
    this._defaultViews.push(view);
  }

  /** @internal */
  _matchCase(value: any): boolean {
    const matched = value == this._ngSwitch;
    this._lastCasesMatched = this._lastCasesMatched || matched;
    this._lastCaseCheckIndex++;
    if (this._lastCaseCheckIndex === this._caseCount) {
      this._updateDefaultCases(!this._lastCasesMatched);
      this._lastCaseCheckIndex = 0;
      this._lastCasesMatched = false;
    }
    return matched;
  }

  private _updateDefaultCases(useDefault: boolean) {
    if (this._defaultViews && useDefault !== this._defaultUsed) {
      this._defaultUsed = useDefault;
      for (let i = 0; i < this._defaultViews.length; i++) {
        const defaultView = this._defaultViews[i];
        defaultView.enforceState(useDefault);
      }
    }
  }
}

/**
 *  @ngModule CommonModule
 *
 *  @description
 * Предоставляет выражение регистра переключателя для сопоставления с `ngSwitch` выражением.
 * Когда выражения совпадают, данный `NgSwitchCase``NgSwitchCase` отображается.
 * Если несколько выражений совпадения соответствуют значению выражения переключения, отображаются все из них.
 *
 *  @usageNotes
 *
 * В контейнере переключателя `ngSwitchCase` определяют выражения соответствия
 * в качестве атрибутов. Включите `ngSwitchDefault` в качестве окончательного.
 *
 *  ```
 *  <container-element [ngSwitch]="switch_expression">
 *    <some-elementngSwitchCase="match_expression_1">...</some-element>
 *    ...
 *    <some-elementngSwitchDefault>...</some-element>
 *  </container-element>
 *  ```
 *
 * Каждый оператор switch-case содержит встроенный шаблон HTML или ссылку на шаблон
 * это определяет поддерево, которое будет выбрано, если значение выражения соответствия
 * соответствует значению выражения switch.
 *
 * В отличие от JavaScript, который использует строгое равенство, Angular использует свободное равенство.
 * Это означает, что пустая строка, `""` соответствует 0
 *
 * @publicApi
 * @see `NgSwitch`
 * @see `NgSwitchDefault`
 *
 */
@Directive({selector: '[ngSwitchCase]'})
export class NgSwitchCase implements DoCheck {
  private _view: SwitchView;
  /**
   * Stores the HTML template to be selected on match.
   */
  @Input() ngSwitchCase: any;

  constructor(
      viewContainer: ViewContainerRef, templateRef: TemplateRef<Object>,
      @Host() private ngSwitch: NgSwitch) {
    ngSwitch._addCase();
    this._view = new SwitchView(viewContainer, templateRef);
  }

  /**
   * Performs case matching. For internal use only.
   */
  ngDoCheck() {
    this._view.enforceState(this.ngSwitch._matchCase(this.ngSwitchCase));
  }
}

/**
 *  @ngModule CommonModule
 *
 *  @description
 *
 * Создает представлениекоторое не визуализируетсякогда нет `NgSwitchCase` выражений
 * соответствует `NgSwitch``NgSwitch`.
 * Это утверждение должно быть последним случаем в `NgSwitch`.
 *
 * @publicApi
 * @see `NgSwitch`
 * @see `NgSwitchCase`
 *
 */
@Directive({selector: '[ngSwitchDefault]'})
export class NgSwitchDefault {
  constructor(
      viewContainer: ViewContainerRef, templateRef: TemplateRef<Object>,
      @Host() ngSwitch: NgSwitch) {
    ngSwitch._addDefault(new SwitchView(viewContainer, templateRef));
  }
}
