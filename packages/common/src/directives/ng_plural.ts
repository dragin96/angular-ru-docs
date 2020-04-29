/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Attribute, Directive, Host, Input, TemplateRef, ViewContainerRef} from '@angular/core';

import {getPluralCategory, NgLocalization} from '../i18n/localization';

import {SwitchView} from './ng_switch';


/**
 *  @ngModule CommonModule
 *
 *  @usageNotes
 *  ```
 *  <some-element [ngPlural]="value">
 *    <ng-template ngPluralCase="=0">there is nothing</ng-template>
 *    <ng-template ngPluralCase="=1">there is one</ng-template>
 *    <ng-template ngPluralCase="few">there are a few</ng-template>
 *  </some-element>
 *  ```
 *
 *  @description
 *
 * Добавляет / удаляет поддеревья DOM на основе числового значения. Специально для плюрализации.
 *
 * Отображает поддеревья DOM, которые соответствуют значению выражения переключателя, или, если это не так, поддеревья DOM
 * которые соответствуют категории плюрализации выражения переключения.
 *
 * чтобы использовать эту директивувы должны предоставить контейнер элементкоторый устанавливает `[ngPlural]` атрибут.
 * к выражению переключателя. Внутренние элементы с `[ngPluralCase]` будут отображаться на основе их
 * выражение:.
 * - если для `[ngPluralCase]` установлено значение, начинающееся с `=` , он будет отображаться только если значение
 * точно соответствует выражению переключателя
 * - в противном случае представление будет рассматриваться как «соответствие категории» и будет отображаться только в том случае, если оно точное
 * совпадения значений не найдены, и значение отображается в его категорию для определенной локали.
 *
 * См. Http://cldr.unicode.org/index/cldr-spec/plural-rules
 *
 * @publicApi
 */
@Directive({selector: '[ngPlural]'})
export class NgPlural {
  // TODO(issue/24571): remove '!'.
  private _switchValue!: number;
  // TODO(issue/24571): remove '!'.
  private _activeView!: SwitchView;
  private _caseViews: {[k: string]: SwitchView} = {};

  constructor(private _localization: NgLocalization) {}

  @Input()
  set ngPlural(value: number) {
    this._switchValue = value;
    this._updateView();
  }

  addCase(value: string, switchView: SwitchView): void {
    this._caseViews[value] = switchView;
  }

  private _updateView(): void {
    this._clearViews();

    const cases = Object.keys(this._caseViews);
    const key = getPluralCategory(this._switchValue, cases, this._localization);
    this._activateView(this._caseViews[key]);
  }

  private _clearViews() {
    if (this._activeView) this._activeView.destroy();
  }

  private _activateView(view: SwitchView) {
    if (view) {
      this._activeView = view;
      this._activeView.create();
    }
  }
}

/**
 *  @ngModule CommonModule
 *
 *  @description
 *
 * Создает представление, которое будет добавлено / удалено из родительского {@link NgPlural} когда
 * данное выражение соответствует множественному выражению в соответствии с правилами CLDR.
 *
 *  @usageNotes
 *  ```
 *  <some-element [ngPlural]="value">
 *    <ng-template ngPluralCase="=0">...</ng-template>
 *    <ng-template ngPluralCase="other">...</ng-template>
 *  </some-element>
 * ```
 *
 * Видеть{@link NgPlural}для более подробной информации и примера.
 *
 * @publicApi
 */
@Directive({selector: '[ngPluralCase]'})
export class NgPluralCase {
  constructor(
      @Attribute('ngPluralCase') public value: string, template: TemplateRef<Object>,
      viewContainer: ViewContainerRef, @Host() ngPlural: NgPlural) {
    const isANumber: boolean = !isNaN(Number(value));
    ngPlural.addCase(isANumber ? `=${value}` : value, new SwitchView(viewContainer, template));
  }
}
