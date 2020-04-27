/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ModuleWithProviders, NgModule} from '@angular/core';

import {InternalFormsSharedModule, NG_MODEL_WITH_FORM_CONTROL_WARNING, REACTIVE_DRIVEN_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES} from './directives';
import {RadioControlRegistry} from './directives/radio_control_value_accessor';
import {FormBuilder} from './form_builder';

/**
 * Экспорт необходимых поставщиков и директив для шаблонно-управляемых форм
 * делая их доступными для импорта NgModules, которые импортируют этот модуль.
 *
 *  @see [Обзор форм](/guide/forms-overview)
 *  @see [Руководство по формам на основе шаблонов](/guide/forms)
 *
 * @publicApi
 */
@NgModule({
  declarations: TEMPLATE_DRIVEN_DIRECTIVES,
  providers: [RadioControlRegistry],
  exports: [InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
})
export class FormsModule {
}

/**
 * Экспортирует необходимую инфраструктуру и директивы для реактивных форм
 * делая их доступными для импорта NgModules, которые импортируют этот модуль.
 *
 *  @see [Обзор форм](guide/forms-overview)
 *  @see [(Reactive GuideForms).](guide/reactive-forms)
 *
 * @publicApi
 */
@NgModule({
  declarations: [REACTIVE_DRIVEN_DIRECTIVES],
  providers: [FormBuilder, RadioControlRegistry],
  exports: [InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
})
export class ReactiveFormsModule {
  /**
   * @description
   * Provides options for configuring the reactive forms module.
   *
   * @param opts An object of configuration options
   * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
   * binding is used with reactive form directives.
   */
  static withConfig(opts: {
    /** @deprecated as of v6 */ warnOnNgModelWithFormControl: 'never'|'once'|'always'
  }): ModuleWithProviders<ReactiveFormsModule> {
    return {
      ngModule: ReactiveFormsModule,
      providers: [
        {provide: NG_MODEL_WITH_FORM_CONTROL_WARNING, useValue: opts.warnOnNgModelWithFormControl}
      ]
    };
  }
}
