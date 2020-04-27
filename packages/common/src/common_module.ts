/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {COMMON_DIRECTIVES} from './directives/index';
import {NgLocaleLocalization, NgLocalization} from './i18n/localization';
import {COMMON_PIPES} from './pipes/index';


// Note: This does not contain the location providers,
// as they need some platform specific implementations to work.
/**
 * Экспортирует все основные Angular директивы и трубы
 * такие как `NgIf` , `NgForOf` , `DecimalPipe` и так далее.
 * Реэкспортируется с помощью `BrowserModule` , который автоматически включается в корень
 *  `AppModule`при создании нового приложения с помощью команды CLI `new`.
 *
 * Опция `providers` настраивает инжектор NgModule для предоставления
 * зависимости локализации для участников.
 * В `exports` вариантыделают заявленные директивы и трубы дляимпорта.
 * другими NgModules.
 *
 * @publicApi
 */
@NgModule({
  declarations: [COMMON_DIRECTIVES, COMMON_PIPES],
  exports: [COMMON_DIRECTIVES, COMMON_PIPES],
  providers: [
    {provide: NgLocalization, useClass: NgLocaleLocalization},
  ],
})
export class CommonModule {
}
