/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';

/**
 * Объект конфигурации передан для инициализации платформы.
 *
 * @publicApi
 */
export interface PlatformConfig {
  document?: string;
  url?: string;
}

/**
 * Токен DI для установки начальной конфигурации для платформы.
 *
 * @publicApi
 */
export const INITIAL_CONFIG = new InjectionToken<PlatformConfig>('Server.INITIAL_CONFIG');

/**
 * Функциякоторая будет выполняться при вызове `renderModuleFactory` или `renderModule` просто.
 * до того, как текущее состояние платформы будет преобразовано в строку.
 *
 * @publicApi
 */
export const BEFORE_APP_SERIALIZED =
    new InjectionToken<Array<() => void | Promise<void>>>('Server.RENDER_MODULE_HOOK');
