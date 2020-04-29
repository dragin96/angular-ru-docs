/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, forwardRef, Host, Inject, Input, OnDestroy, OnInit, Optional, Self, SkipSelf} from '@angular/core';

import {FormArray} from '../../model';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS} from '../../validators';
import {AbstractFormGroupDirective} from '../abstract_form_group_directive';
import {ControlContainer} from '../control_container';
import {ReactiveErrors} from '../reactive_errors';
import {composeAsyncValidators, composeValidators, controlPath} from '../shared';
import {AsyncValidatorFn, ValidatorFn} from '../validators';

import {FormGroupDirective} from './form_group_directive';

export const formGroupNameProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormGroupName)
};

/**
 *  @description
 *
 * Синхронизирует вложенную `FormGroup` с элементом DOM.
 *
 * Эта директива может использоваться только с родительской `FormGroupDirective`.
 *
 * Он принимает имя строки вложенной формы `FormGroup` для ссылки, и
 * ищет `FormGroup` зарегистрированную с таким именем в родительском
 *  `FormGroup` `FormGroup` экземплярвы передали `FormGroupDirective`.
 *
 * Используйте вложенные группы форм для проверки подгруппы a
 * формировать отдельно от остальных или группировать значения определенных
 * контролирует в свой собственный вложенный объект.
 *
 *  @see [(Reactive GuideForms).](guide/reactive-forms)
 *
 *  @usageNotes
 *
 *  ### Доступ к группе по имени
 *
 * В следующем примере используется {@link AbstractControl#get get} метод доступа к
 * связанный `FormGroup`
 *
 *  ```ts
 *    this.form.get('name');
 *  ```
 *
 *  ### Доступ к отдельным элементам управления в группе
 *
 * В следующем примере используется {@link AbstractControl#get get} метод доступа
 * отдельные элементы управления в группе с использованием точечного синтаксиса.
 *
 *  ```ts
 *    this.form.get('name.first');
 *  ```
 *
 *  ### Зарегистрируйте вложенную `FormGroup`.
 *
 * Следующий пример регистрирует nestedname `FormGroup` пределах существующего `FormGroup` FormGroup,.
 * и предоставляет методы для извлечения вложенной формы `FormGroup` и отдельных элементов управления.
 *
 *  {@example forms/ts/nestedFormGroup/nested_form_group_example.ts region='Component'}
 *
 *  @ngModule ReactiveFormsModule
 * @publicApi
 */
@Directive({selector: '[formGroupName]', providers: [formGroupNameProvider]})
export class FormGroupName extends AbstractFormGroupDirective implements OnInit, OnDestroy {
  /**
   * @description
   * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   * Accepts a name as a string or a number.
   * The name in the form of a string is useful for individual forms,
   * while the numerical form allows for form groups to be bound
   * to indices when iterating over groups in a `FormArray`.
   */
  // TODO(issue/24571): remove '!'.
  @Input('formGroupName') name!: string|number|null;

  constructor(
      @Optional() @Host() @SkipSelf() parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this._parent = parent;
    this._validators = validators;
    this._asyncValidators = asyncValidators;
  }

  /** @internal */
  _checkParentType(): void {
    if (_hasInvalidParent(this._parent)) {
      ReactiveErrors.groupParentException();
    }
  }
}

export const formArrayNameProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => FormArrayName)
};

/**
 *  @description
 *
 * Синхронизирует вложенный `FormArray` с элементом DOM.
 *
 * Эта директива предназначена для использования с родителем `FormGroupDirective` (селектор:.
 *  `[formGroup]`).
 *
 * Он принимает имя строки вложенного `FormArray` вы хотите связать, и
 * будет искать `FormArray` зарегистрирован с этим именем вродителях.
 *  `FormGroup` `FormGroup` экземплярвы передали `FormGroupDirective`.
 *
 *  @see [(Reactive GuideForms).](guide/reactive-forms)
 *  @see `AbstractControl`
 *
 *  @usageNotes
 *
 *  ### Пример
 *
 *  {@example forms/ts/nestedFormArray/nested_form_array_example.ts region='Component'}
 *
 *  @ngModule ReactiveFormsModule
 * @publicApi
 */
@Directive({selector: '[formArrayName]', providers: [formArrayNameProvider]})
export class FormArrayName extends ControlContainer implements OnInit, OnDestroy {
  /** @internal */
  _parent: ControlContainer;

  /** @internal */
  _validators: any[];

  /** @internal */
  _asyncValidators: any[];

  /**
   * @description
   * Tracks the name of the `FormArray` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   * Accepts a name as a string or a number.
   * The name in the form of a string is useful for individual forms,
   * while the numerical form allows for form arrays to be bound
   * to indices when iterating over arrays in a `FormArray`.
   */
  // TODO(issue/24571): remove '!'.
  @Input('formArrayName') name!: string|number|null;

  constructor(
      @Optional() @Host() @SkipSelf() parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this._parent = parent;
    this._validators = validators;
    this._asyncValidators = asyncValidators;
  }

  /**
   * @description
   * A lifecycle method called when the directive's inputs are initialized. For internal use only.
   *
   * @throws If the directive does not have a valid parent.
   */
  ngOnInit(): void {
    this._checkParentType();
    this.formDirective!.addFormArray(this);
  }

  /**
   * @description
   * A lifecycle method called before the directive's instance is destroyed. For internal use only.
   */
  ngOnDestroy(): void {
    if (this.formDirective) {
      this.formDirective.removeFormArray(this);
    }
  }

  /**
   * @description
   * The `FormArray` bound to this directive.
   */
  get control(): FormArray {
    return this.formDirective!.getFormArray(this);
  }

  /**
   * @description
   * The top-level directive for this group if present, otherwise null.
   */
  get formDirective(): FormGroupDirective|null {
    return this._parent ? <FormGroupDirective>this._parent.formDirective : null;
  }

  /**
   * @description
   * Returns an array that represents the path from the top-level form to this control.
   * Each index is the string name of the control on that level.
   */
  get path(): string[] {
    return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
  }

  /**
   * @description
   * Synchronous validator function composed of all the synchronous validators registered with this
   * directive.
   */
  get validator(): ValidatorFn|null {
    return composeValidators(this._validators);
  }

  /**
   * @description
   * Async validator function composed of all the async validators registered with this directive.
   */
  get asyncValidator(): AsyncValidatorFn|null {
    return composeAsyncValidators(this._asyncValidators);
  }

  private _checkParentType(): void {
    if (_hasInvalidParent(this._parent)) {
      ReactiveErrors.arrayParentException();
    }
  }
}

function _hasInvalidParent(parent: ControlContainer): boolean {
  return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) &&
      !(parent instanceof FormArrayName);
}
