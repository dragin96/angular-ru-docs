/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, DoCheck, ElementRef, Input, KeyValueChanges, KeyValueDiffer, KeyValueDiffers, Renderer2} from '@angular/core';


/**
 *  @ngModule CommonModule
 *
 *  @usageNotes
 *
 * Установите шрифт содержащего элемента в результате выражения.
 *
 *  ```
 *  <some-element [ngStyle]="{'font-style': styleExp}">...</some-element>
 *  ```
 *
 * Установите ширину содержащего элемента равным значению в пикселях, возвращаемому выражением.
 *
 *  ```
 *  <some-element [ngStyle]="{'max-width.px': widthExp}">...</some-element>
 *  ```
 *
 * Установите коллекцию значений стиля, используя выражение, которое возвращает пары ключ-значение.
 *
 *  ```
 *  <some-element [ngStyle]="objExp">...</some-element>
 *  ```
 *
 *  @description
 *
 * Директива атрибута, которая обновляет стили для содержащего элемента HTML.
 * Устанавливает одно или несколько свойств стиля, заданных в виде пар ключ-значение, разделенных двоеточиями.
 * Ключ - это имя стиля с необязательным `.<unit>` суффиксом
 * (например, «top.px», «font-style.em»).
 * Значение - это выражение для оценки.
 * Результирующее ненулевое значение, выраженное в данной единице
 * назначается данному свойству стиля.
 * Если результат оценки равен нулю, соответствующий стиль удаляется.
 *
 * @publicApi
 */
@Directive({selector: '[ngStyle]'})
export class NgStyle implements DoCheck {
  private _ngStyle: {[key: string]: string}|null = null;
  private _differ: KeyValueDiffer<string, string|number>|null = null;

  constructor(
      private _ngEl: ElementRef, private _differs: KeyValueDiffers, private _renderer: Renderer2) {}

  @Input('ngStyle')
  set ngStyle(values: {[klass: string]: any}|null) {
    this._ngStyle = values;
    if (!this._differ && values) {
      this._differ = this._differs.find(values).create();
    }
  }

  ngDoCheck() {
    if (this._differ) {
      const changes = this._differ.diff(this._ngStyle!);
      if (changes) {
        this._applyChanges(changes);
      }
    }
  }

  private _setStyle(nameAndUnit: string, value: string|number|null|undefined): void {
    const [name, unit] = nameAndUnit.split('.');
    value = value != null && unit ? `${value}${unit}` : value;

    if (value != null) {
      this._renderer.setStyle(this._ngEl.nativeElement, name, value as string);
    } else {
      this._renderer.removeStyle(this._ngEl.nativeElement, name);
    }
  }

  private _applyChanges(changes: KeyValueChanges<string, string|number>): void {
    changes.forEachRemovedItem((record) => this._setStyle(record.key, null));
    changes.forEachAddedItem((record) => this._setStyle(record.key, record.currentValue));
    changes.forEachChangedItem((record) => this._setStyle(record.key, record.currentValue));
  }
}
