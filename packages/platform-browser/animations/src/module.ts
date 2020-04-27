/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {BROWSER_ANIMATIONS_PROVIDERS, BROWSER_NOOP_ANIMATIONS_PROVIDERS} from './providers';

/**
 * Экспортирует `BrowserModule` с дополнительными[поставщики внедрения зависимостей](guide/glossary#provider)
 * для использования с анимацией. Смотрите[Анимации](guide/animations).
 * @publicApi
 */
@NgModule({
  exports: [BrowserModule],
  providers: BROWSER_ANIMATIONS_PROVIDERS,
})
export class BrowserAnimationsModule {
}

/**
 * Нулевой проигрыватель, который необходимо импортировать, чтобы разрешить отключение анимации.
 * @publicApi
 */
@NgModule({
  exports: [BrowserModule],
  providers: BROWSER_NOOP_ANIMATIONS_PROVIDERS,
})
export class NoopAnimationsModule {
}
