/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export const PLATFORM_BROWSER_ID = 'browser';
export const PLATFORM_SERVER_ID = 'server';
export const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
export const PLATFORM_WORKER_UI_ID = 'browserWorkerUi';

/**
 * Возвращает, представляет ли идентификатор платформы платформу браузера.
 * @publicApi
 */
export function isPlatformBrowser(platformId: Object): boolean {
  return platformId === PLATFORM_BROWSER_ID;
}

/**
 * Возвращает, представляет ли идентификатор платформы серверную платформу.
 * @publicApi
 */
export function isPlatformServer(platformId: Object): boolean {
  return platformId === PLATFORM_SERVER_ID;
}

/**
 * Возвращает, представляет ли идентификатор платформы платформу приложения веб-работника.
 * @publicApi
 */
export function isPlatformWorkerApp(platformId: Object): boolean {
  return platformId === PLATFORM_WORKER_APP_ID;
}

/**
 * Возвращает, представляет ли идентификатор платформы платформу пользовательского интерфейса веб-работника.
 * @publicApi
 */
export function isPlatformWorkerUi(platformId: Object): boolean {
  return platformId === PLATFORM_WORKER_UI_ID;
}
