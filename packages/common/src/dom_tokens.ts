/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';

/**
 * Токен DI, представляющий основной контекст рендеринга. В браузере это DOM Document.
 *
 * Примечание. Документ может быть недоступен в контексте приложения при применении и рендеринге
 * Контексты не совпадают (например, при запуске приложения в Web Worker).
 *
 * @publicApi
 */
export const DOCUMENT = new InjectionToken<Document>('DocumentToken');
