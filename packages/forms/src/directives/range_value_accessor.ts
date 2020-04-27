/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, forwardRef, Renderer2, StaticProvider} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from './control_value_accessor';

export const RANGE_VALUE_ACCESSOR: StaticProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RangeValueAccessor),
  multi: true
};

/**
 *  @description
 *  The `ControlValueAccessor`для записи значения диапазона и прослушивания входного диапазона изменений.
 * Метод доступа к значениям используется `FormControlDirective` , `FormControlName` и `NgModel`
 * директивы.
 *
 *  @usageNotes
 *
 *  ### Использование диапазона ввода с реактивной формой
 *
 * В следующем примере показано, как использовать диапазон ввода с реактивной формой.
 *
 *  ```ts
 *  const ageControl = new FormControl();
 *  ```
 *
 *  ```
 *  <input type="range" [formControl]="ageControl">
 *  ```
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]',
  host: {
    '(change)': 'onChange($event.target.value)',
    '(input)': 'onChange($event.target.value)',
    '(blur)': 'onTouched()'
  },
  providers: [RANGE_VALUE_ACCESSOR]
})
export class RangeValueAccessor implements ControlValueAccessor {
  /**
   * @description
   * The registered callback function called when a change or input event occurs on the input
   * element.
   */
  onChange = (_: any) => {};

  /**
   * @description
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => {};

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  /**
   * Sets the "value" property on the input element.
   *
   * @param value The checked value
   */
  writeValue(value: any): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', parseFloat(value));
  }

  /**
   * @description
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (_: number|null) => void): void {
    this.onChange = (value) => {
      fn(value == '' ? null : parseFloat(value));
    };
  }

  /**
   * @description
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Sets the "disabled" property on the range input element.
   *
   * @param isDisabled The disabled value
   */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }
}
