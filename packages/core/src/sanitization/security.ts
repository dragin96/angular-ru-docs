/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * SecurityContext отмечает местоположение, которое имеет опасные последствия для безопасности, например, свойство DOM
 * наподобие `innerHTML` которое может привести к ошибкам безопасности межсайтового скриптинга (XSS) при неправильном использовании
 * обрабатываются.
 *
 * Смотрите DomSanitizer для более подробной информации о безопасности в приложениях Angular.
 *
 * @publicApi
 */
export enum SecurityContext {
  NONE = 0,
  HTML = 1,
  STYLE = 2,
  SCRIPT = 3,
  URL = 4,
  RESOURCE_URL = 5,
}
