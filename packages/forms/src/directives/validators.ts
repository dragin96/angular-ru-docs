/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, forwardRef, Input, OnChanges, SimpleChanges, StaticProvider} from '@angular/core';
import {Observable} from 'rxjs';

import {AbstractControl} from '../model';
import {NG_VALIDATORS, Validators} from '../validators';


/**
 *  @description
 * Определяет карту ошибок, возвращенных после неудачных проверок.
 *
 * @publicApi
 */
export type ValidationErrors = {
  [key: string]: any
};

/**
 *  @description
 * Интерфейс, реализованный классами, которые выполняют синхронную проверку.
 *
 *  @usageNotes
 *
 *  ### Предоставить собственный валидатор
 *
 * В следующем примере реализуется `Validator` интерфейсдля создания
 * директива валидатора с пользовательским ключом ошибки.
 *
 *  ```typescript
 *  @Directive({
 *    selector: '[customValidator]',
 *    providers: [{provide: NG_VALIDATORS, useExisting: CustomValidatorDirective, multi: true}]
 *  })
 *  class CustomValidatorDirective implements Validator {
 *    validate(control: AbstractControl): ValidationErrors|null {
 *      return {'custom': true};
 *    }
 *  }
 *  ```
 *
 * @publicApi
 */
export interface Validator {
  /**
   * @description
   * Method that performs synchronous validation against the provided control.
   *
   * @param control The control to validate against.
   *
   * @returns A map of validation errors if validation fails,
   * otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors|null;

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange?(fn: () => void): void;
}

/**
 *  @description
 * Интерфейс, реализованный классами, которые выполняют асинхронную проверку.
 *
 *  @usageNotes
 *
 *  ### Предоставьте пользовательскую директиву асинхронного валидатора
 *
 * В следующем примере реализуется `AsyncValidator` интерфейсдля создания
 * асинхронная директива валидатора с пользовательским ключом ошибки.
 *
 *  ```typescript
 *  import { of as observableOf } from 'rxjs';
 *
 *  @Directive({
 *    selector: '[customAsyncValidator]',
 *    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: CustomAsyncValidatorDirective, multi:
 *  true}]
 *  })
 *  class CustomAsyncValidatorDirective implements AsyncValidator {
 *    validate(control: AbstractControl): Observable<ValidationErrors|null> {
 *      return observableOf({'custom': true});
 *    }
 *  }
 *  ```
 *
 * @publicApi
 */
export interface AsyncValidator extends Validator {
  /**
   * @description
   * Method that performs async validation against the provided control.
   *
   * @param control The control to validate against.
   *
   * @returns A promise or observable that resolves a map of validation errors
   * if validation fails, otherwise null.
   */
  validate(control: AbstractControl):
      Promise<ValidationErrors|null>|Observable<ValidationErrors|null>;
}

/**
 * @description
 * Provider which adds `RequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const REQUIRED_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => RequiredValidator),
  multi: true
};

/**
 * @description
 * Provider which adds `CheckboxRequiredValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const CHECKBOX_REQUIRED_VALIDATOR: StaticProvider = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CheckboxRequiredValidator),
  multi: true
};


/**
 *  @description
 * Директивакоторая добавляет `required` валидатор для какоголибо контроляотмеченногос.
 *  `required`атрибут. Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление необходимого валидатора с использованием шаблонно-управляемых форм
 *
 *  ```
 *  <input name="fullName" ngModel required>
 *  ```
 *
 *  @ngModule FormsModule
 *  @ngModule ReactiveFormsModule
 * @publicApi
 */
@Directive({
  selector:
      ':not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]',
  providers: [REQUIRED_VALIDATOR],
  host: {'[attr.required]': 'required ? "" : null'}
})
export class RequiredValidator implements Validator {
  // TODO(issue/24571): remove '!'.
  private _required!: boolean;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the required attribute bound to this directive.
   */
  @Input()
  get required(): boolean|string {
    return this._required;
  }

  set required(value: boolean|string) {
    this._required = value != null && value !== false && `${value}` !== 'false';
    if (this._onChange) this._onChange();
  }

  /**
   * @description
   * Method that validates whether the control is empty.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this.required ? Validators.required(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}


/**
 * Директива, которая добавляет `required` валидатор к элементам управления флажками, отмеченными значком
 *  `required`атрибут. Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление необходимого валидатора флажка с использованием шаблонно-управляемых форм
 *
 * В следующем примере показано, как добавить необходимый флажок для валидатора к входу, присоединенному к
 * ngModel привязка.
 *
 *  ```
 *  <input type="checkbox" name="active" ngModel required>
 *  ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
@Directive({
  selector:
      'input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]',
  providers: [CHECKBOX_REQUIRED_VALIDATOR],
  host: {'[attr.required]': 'required ? "" : null'}
})
export class CheckboxRequiredValidator extends RequiredValidator {
  /**
   * @description
   * Method that validates whether or not the checkbox has been checked.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this.required ? Validators.requiredTrue(control) : null;
  }
}

/**
 * @description
 * Provider which adds `EmailValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const EMAIL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => EmailValidator),
  multi: true
};

/**
 * Директива, которая добавляет `email` валидаторк элементам управления, отмеченным знаком
 *  `email`атрибут. Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление валидатора электронной почты
 *
 * В следующем примере показано, как добавить валидатор электронной почты к входу, присоединенному к ngModel
 * связывание.
 *
 *  ```
 *  <input type="email" name="email" ngModel email>
 *  <input type="email" name="email" ngModel email="true">
 *  <input type="email" name="email" ngModel [email]="true">
 *  ```
 *
 * @publicApi
 * @ngModule FormsModule
 * @ngModule ReactiveFormsModule
 */
@Directive({
  selector: '[email][formControlName],[email][formControl],[email][ngModel]',
  providers: [EMAIL_VALIDATOR]
})
export class EmailValidator implements Validator {
  // TODO(issue/24571): remove '!'.
  private _enabled!: boolean;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the email attribute bound to this directive.
   */
  @Input()
  set email(value: boolean|string) {
    this._enabled = value === '' || value === true || value === 'true';
    if (this._onChange) this._onChange();
  }

  /**
   * @description
   * Method that validates whether an email address is valid.
   * Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this._enabled ? Validators.email(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

/**
 *  @description
 * Функция, которая получает элемент управления и синхронно возвращает карту
 * ошибки проверки, если присутствуют, в противном случае ноль.
 *
 * @publicApi
 */
export interface ValidatorFn {
  (control: AbstractControl): ValidationErrors|null;
}

/**
 *  @description
 * Функция, которая получает элемент управления и возвращает Обещание или наблюдаемый
 * который выдает ошибки проверки, если они есть, в противном случае - ноль.
 *
 * @publicApi
 */
export interface AsyncValidatorFn {
  (control: AbstractControl): Promise<ValidationErrors|null>|Observable<ValidationErrors|null>;
}

/**
 * @description
 * Provider which adds `MinLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MIN_LENGTH_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MinLengthValidator),
  multi: true
};

/**
 * Директива, которая добавляет проверку минимальной длины к элементам управления, отмеченным знаком
 *  `minlength`атрибут. Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление валидатора минимальной длины
 *
 * В следующем примере показано, как добавить валидатор минимальной длины к входу, присоединенному к
 * ngModel привязка.
 *
 *  ```html
 *  <input name="firstName" ngModel minlength="4">
 *  ```
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector: '[minlength][formControlName],[minlength][formControl],[minlength][ngModel]',
  providers: [MIN_LENGTH_VALIDATOR],
  host: {'[attr.minlength]': 'minlength ? minlength : null'}
})
export class MinLengthValidator implements Validator, OnChanges {
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the the minimum length bound to this directive.
   */
  // TODO(issue/24571): remove '!'.
  @Input() minlength!: string|number;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('minlength' in changes) {
      this._createValidator();
      if (this._onChange) this._onChange();
    }
  }

  /**
   * @description
   * Method that validates whether the value meets a minimum length
   * requirement. Returns the validation result if enabled, otherwise null.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this.minlength == null ? null : this._validator(control);
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = Validators.minLength(
        typeof this.minlength === 'number' ? this.minlength : parseInt(this.minlength, 10));
  }
}

/**
 * @description
 * Provider which adds `MaxLengthValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const MAX_LENGTH_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MaxLengthValidator),
  multi: true
};

/**
 * Директива, которая добавляет проверку максимальной длины к элементам управления, отмеченным знаком
 *  `maxlength`атрибут. Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление валидатора максимальной длины
 *
 * В следующем примере показано, как добавить валидатор максимальной длины к входу, присоединенному к
 * ngModel привязка.
 *
 *  ```html
 *  <input name="firstName" ngModel maxlength="25">
 *  ```
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector: '[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]',
  providers: [MAX_LENGTH_VALIDATOR],
  host: {'[attr.maxlength]': 'maxlength ? maxlength : null'}
})
export class MaxLengthValidator implements Validator, OnChanges {
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the the maximum length bound to this directive.
   */
  // TODO(issue/24571): remove '!'.
  @Input() maxlength!: string|number;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('maxlength' in changes) {
      this._createValidator();
      if (this._onChange) this._onChange();
    }
  }

  /**
   * @description
   * Method that validates whether the value exceeds
   * the maximum length requirement.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this.maxlength != null ? this._validator(control) : null;
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = Validators.maxLength(
        typeof this.maxlength === 'number' ? this.maxlength : parseInt(this.maxlength, 10));
  }
}

/**
 * @description
 * Provider which adds `PatternValidator` to the `NG_VALIDATORS` multi-provider list.
 */
export const PATTERN_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => PatternValidator),
  multi: true
};


/**
 *  @description
 * Директива, которая добавляет валидацию регулярных выражений в элементы управления, помеченные знаком
 *  `pattern`атрибут модели. Регулярное выражение должно соответствовать всему контрольному значению.
 * Директива предоставляется в `NG_VALIDATORS` мульти-провайдеров.
 *
 *  @see [Проверка формы](guide/form-validation)
 *
 *  @usageNotes
 *
 *  ### Добавление шаблона проверки
 *
 * В следующем примере показано, как добавить средство проверки шаблона к входу, присоединенному к
 * ngModel привязка.
 *
 *  ```html
 *  <input name="firstName" ngModel pattern="[a-zA-Z ]">
 *  ```
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector: '[pattern][formControlName],[pattern][formControl],[pattern][ngModel]',
  providers: [PATTERN_VALIDATOR],
  host: {'[attr.pattern]': 'pattern ? pattern : null'}
})
export class PatternValidator implements Validator, OnChanges {
  // TODO(issue/24571): remove '!'.
  private _validator!: ValidatorFn;
  // TODO(issue/24571): remove '!'.
  private _onChange!: () => void;

  /**
   * @description
   * Tracks changes to the pattern bound to this directive.
   */
  // TODO(issue/24571): remove '!'.
  @Input() pattern!: string|RegExp;

  /**
   * @description
   * A lifecycle method called when the directive's inputs change. For internal use
   * only.
   *
   * @param changes A object of key/value pairs for the set of changed inputs.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if ('pattern' in changes) {
      this._createValidator();
      if (this._onChange) this._onChange();
    }
  }

  /**
   * @description
   * Method that validates whether the value matches the
   * the pattern requirement.
   */
  validate(control: AbstractControl): ValidationErrors|null {
    return this._validator(control);
  }

  /**
   * @description
   * Registers a callback function to call when the validator inputs change.
   *
   * @param fn The callback function
   */
  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }

  private _createValidator(): void {
    this._validator = Validators.pattern(this.pattern);
  }
}
