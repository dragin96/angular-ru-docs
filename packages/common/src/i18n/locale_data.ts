/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵregisterLocaleData} from '@angular/core';

/**
 * Зарегистрируйте глобальные данные для внутреннего использования Angular. Смотрите
 *  [«Руководство по I18n»](guide/i18n#i18n-pipes)чтобы узнать, как импортировать дополнительные данные локали.
 *
 * Сигнатура registerLocaleData (data: any, extraData ?: any) устарела с версии 5.1
 *
 * @publicApi
 */
export function registerLocaleData(data: any, localeId?: string|any, extraData?: any): void {
  return ɵregisterLocaleData(data, localeId, extraData);
}
