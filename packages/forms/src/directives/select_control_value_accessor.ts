/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, forwardRef, Host, Input, OnDestroy, Optional, Renderer2, StaticProvider, ɵlooseIdentical as looseIdentical} from '@angular/core';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from './control_value_accessor';

export const SELECT_VALUE_ACCESSOR: StaticProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};

function _buildValueString(id: string|null, value: any): string {
  if (id == null) return `${value}`;
  if (value && typeof value === 'object') value = 'Object';
  return `${id}: ${value}`.slice(0, 50);
}

function _extractId(valueString: string): string {
  return valueString.split(':')[0];
}

/**
 *  @description
 *  The `ControlValueAccessor`для записи выберите значение управления и прослушивание выбрать режимуправления.
 * меняется. Метод доступа к значениям используется `FormControlDirective` , `FormControlName` и
 *  `NgModel`директивы.
 *
 *  @usageNotes
 *
 *  ### Использование элементов управления в реактивной форме
 *
 * В следующих примерах показано, как использовать элемент управления select в реактивной форме.
 *
 *  {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 *  ### Использование элементов управления select в форме на основе шаблона
 *
 * Чтобы использовать выбор в шаблоне управляемой форме, просто добавьте `ngModel` и `name`
 * атрибут основного `<select>`.
 *
 *  {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 *  ### Настройка параметров выбора
 *
 * Angular использует идентификатор объекта для выбора опции. Это возможно для идентичности предметов
 * изменить, пока данные не изменяются. Это может произойти, например, если товары произведены
 * с RPC на сервер, и этот RPC повторно запускается. Даже если данные не изменились, то.
 * Второй ответ будет производить объекты с разными идентичностями.
 *
 * Чтобы настроить алгоритм сравнения опций по умолчанию, `<select>` поддерживает `compareWith` вход.
 *  `compareWith`принимает функцию, которая имеет два аргумента: `option1` и `option2`.
 * Если `compareWith` , Angular выбирает опцию по возвращаемому значению функции.
 *
 *  ```ts
 *  const selectedCountriesControl = new FormControl();
 *  ```
 *
 *  ```
 *  <select [compareWith]="compareFn"[formControl]="selectedCountriesControl">
 *      <optionngFor="let country of countries" [ngValue]="country">
 *          {{country.name}}
 *      </option>
 *  </select>
 *
 *  compareFn(c1: Country, c2: Country): boolean {
 *      return c1 && c2 ? c1.id === c2.id : c1 === c2;
 *  }
 *  ```
 *
 * Примечание: мы слушаем событие 'change', потому что события 'input' не запускаются
 * для выбирает в Firefox иIE:.
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1024350
 * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/4660045/
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
  host: {'(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()'},
  providers: [SELECT_VALUE_ACCESSOR]
})
export class SelectControlValueAccessor implements ControlValueAccessor {
  value: any;
  /** @internal */
  _optionMap: Map<string, any> = new Map<string, any>();
  /** @internal */
  _idCounter: number = 0;

  /**
   * @description
   * The registered callback function called when a change event occurs on the input element.
   */
  onChange = (_: any) => {};

  /**
   * @description
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => {};

  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   */
  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }

  private _compareWith: (o1: any, o2: any) => boolean = looseIdentical;

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  /**
   * Sets the "value" property on the input element. The "selectedIndex"
   * property is also set if an ID is provided on the option element.
   *
   * @param value The checked value
   */
  writeValue(value: any): void {
    this.value = value;
    const id: string|null = this._getOptionId(value);
    if (id == null) {
      this._renderer.setProperty(this._elementRef.nativeElement, 'selectedIndex', -1);
    }
    const valueString = _buildValueString(id, value);
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', valueString);
  }

  /**
   * @description
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (value: any) => any): void {
    this.onChange = (valueString: string) => {
      this.value = this._getOptionValue(valueString);
      fn(this.value);
    };
  }

  /**
   * @description
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => any): void {
    this.onTouched = fn;
  }

  /**
   * Sets the "disabled" property on the select input element.
   *
   * @param isDisabled The disabled value
   */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  /** @internal */
  _registerOption(): string {
    return (this._idCounter++).toString();
  }

  /** @internal */
  _getOptionId(value: any): string|null {
    for (const id of Array.from(this._optionMap.keys())) {
      if (this._compareWith(this._optionMap.get(id), value)) return id;
    }
    return null;
  }

  /** @internal */
  _getOptionValue(valueString: string): any {
    const id: string = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
  }
}

/**
 *  @description
 * Marks `<option>` как динамика, так Angular может быть уведомлен при изменении параметров.
 *
 *  @see `SelectControlValueAccessor`
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({selector: 'option'})
export class NgSelectOption implements OnDestroy {
  /**
   * @description
   * ID of the option element
   */
  // TODO(issue/24571): remove '!'.
  id!: string;

  constructor(
      private _element: ElementRef, private _renderer: Renderer2,
      @Optional() @Host() private _select: SelectControlValueAccessor) {
    if (this._select) this.id = this._select._registerOption();
  }

  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   */
  @Input('ngValue')
  set ngValue(value: any) {
    if (this._select == null) return;
    this._select._optionMap.set(this.id, value);
    this._setElementValue(_buildValueString(this.id, value));
    this._select.writeValue(this._select.value);
  }

  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   */
  @Input('value')
  set value(value: any) {
    this._setElementValue(value);
    if (this._select) this._select.writeValue(this._select.value);
  }

  /** @internal */
  _setElementValue(value: string): void {
    this._renderer.setProperty(this._element.nativeElement, 'value', value);
  }

  /**
   * @description
   * Lifecycle method called before the directive's instance is destroyed. For internal use only.
   */
  ngOnDestroy(): void {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
}
