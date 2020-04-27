/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, forwardRef, Host, Inject, Input, OnDestroy, OnInit, Optional, Self, SkipSelf} from '@angular/core';

import {NG_ASYNC_VALIDATORS, NG_VALIDATORS} from '../validators';

import {AbstractFormGroupDirective} from './abstract_form_group_directive';
import {ControlContainer} from './control_container';
import {NgForm} from './ng_form';
import {TemplateDrivenErrors} from './template_driven_errors';

export const modelGroupProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgModelGroup)
};

/**
 *  @description
 * Создает и связывает `FormGroup` экземплярс элементом DOM.
 *
 * Эта директива может использоваться только как потомок `NgForm` (внутри `<form>` тегов).
 *
 * Используйте эту директиву для проверки подгруппы вашей формы отдельно от
 * остальная часть вашей формы, или если некоторые значения в вашей доменной модели имеют больше смысла
 * потреблять вместе во вложенном объекте.
 *
 * Укажите имя для подгруппы, и оно станет ключевым
 * для подгруппы в полной стоимости формы. Если вам нужен прямой доступ, экспортируйте директиву в
 * локальная переменная шаблона с использованием `ngModelGroup` (например: `#myGroup="ngModelGroup"`).
 *
 *  @usageNotes
 *
 *  ### Использование элементов управления в группировке
 *
 * В следующем примере показано, как объединить элементы управления в подгруппе
 * формы.
 *
 *  {@example forms/ts/ngModelGroup/ng_model_group_example.ts region='Component'}
 *
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({selector: '[ngModelGroup]', providers: [modelGroupProvider], exportAs: 'ngModelGroup'})
export class NgModelGroup extends AbstractFormGroupDirective implements OnInit, OnDestroy {
  /**
   * @description
   * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
   * to a key in the parent `NgForm`.
   */
  // TODO(issue/24571): remove '!'.
  @Input('ngModelGroup') name!: string;

  constructor(
      @Host() @SkipSelf() parent: ControlContainer,
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this._parent = parent;
    this._validators = validators;
    this._asyncValidators = asyncValidators;
  }

  /** @internal */
  _checkParentType(): void {
    if (!(this._parent instanceof NgModelGroup) && !(this._parent instanceof NgForm)) {
      TemplateDrivenErrors.modelGroupParentException();
    }
  }
}
