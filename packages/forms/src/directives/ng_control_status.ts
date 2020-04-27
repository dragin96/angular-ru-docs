/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, Self} from '@angular/core';

import {AbstractControlDirective} from './abstract_control_directive';
import {ControlContainer} from './control_container';
import {NgControl} from './ng_control';

export class AbstractControlStatus {
  private _cd: AbstractControlDirective;

  constructor(cd: AbstractControlDirective) {
    this._cd = cd;
  }

  get ngClassUntouched(): boolean {
    return this._cd.control ? this._cd.control.untouched : false;
  }
  get ngClassTouched(): boolean {
    return this._cd.control ? this._cd.control.touched : false;
  }
  get ngClassPristine(): boolean {
    return this._cd.control ? this._cd.control.pristine : false;
  }
  get ngClassDirty(): boolean {
    return this._cd.control ? this._cd.control.dirty : false;
  }
  get ngClassValid(): boolean {
    return this._cd.control ? this._cd.control.valid : false;
  }
  get ngClassInvalid(): boolean {
    return this._cd.control ? this._cd.control.invalid : false;
  }
  get ngClassPending(): boolean {
    return this._cd.control ? this._cd.control.pending : false;
  }
}

export const ngControlStatusHost = {
  '[class.ng-untouched]': 'ngClassUntouched',
  '[class.ng-touched]': 'ngClassTouched',
  '[class.ng-pristine]': 'ngClassPristine',
  '[class.ng-dirty]': 'ngClassDirty',
  '[class.ng-valid]': 'ngClassValid',
  '[class.ng-invalid]': 'ngClassInvalid',
  '[class.ng-pending]': 'ngClassPending',
};

/**
 *  @description
 * Директива автоматически применяется к элементам управления Angular, которые устанавливают классы CSS
 * на основе контроля состояния.
 *
 *  @usageNotes
 *
 *  ### CSS классы применяются
 *
 * Следующие классы применяютсякачестве свойства становитсяистинным:.
 *
 * нг-действительный
 * нг-недействительным
 * в ожидании
 * нг-нетронутый
 * нг-грязный.
 * нг нетронутой
 * н-тронутый
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({selector: '[formControlName],[ngModel],[formControl]', host: ngControlStatusHost})
export class NgControlStatus extends AbstractControlStatus {
  constructor(@Self() cd: NgControl) {
    super(cd);
  }
}

/**
 *  @description
 * Директива автоматически применяется к группам Angular форм, которые задают классы CSS
 * основанный на состоянии контроля (действительный / недействительный / грязный / и т. д.).
 *
 *  @see `NgControlStatus`
 *
 *  @ngModule ReactiveFormsModule
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      '[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]',
  host: ngControlStatusHost
})
export class NgControlStatusGroup extends AbstractControlStatus {
  constructor(@Self() cd: ControlContainer) {
    super(cd);
  }
}
