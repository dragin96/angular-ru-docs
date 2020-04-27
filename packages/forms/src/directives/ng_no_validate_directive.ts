/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive} from '@angular/core';

/**
 *  @description
 *
 * добавляет `novalidate``novalidate` По умолчаниюко всем формам.
 *
 *  `novalidate`используется для отключения проверки родной формы браузера.
 *
 * Если вы хотите использовать встроенную проверку с угловатыми формами, просто добавьте `ngNativeValidate` атрибутngNativeValidate:.
 *
 *  ```
 *  <form ngNativeValidate></form>
 *  ```
 *
 * @publicApi
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 */
@Directive({
  selector: 'form:not([ngNoForm]):not([ngNativeValidate])',
  host: {'novalidate': ''},
})
export class ɵNgNoValidate {
}

export {ɵNgNoValidate as NgNoValidate};
