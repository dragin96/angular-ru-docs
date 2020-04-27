/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * This file is used to control if the default rendering pipeline should be `ViewEngine` or `Ivy`.
 *
 * For more information on how to run and debug tests with either Ivy or View Engine (legacy),
 * please see [BAZEL.md](./docs/BAZEL.md).
 */

let _devMode: boolean = true;
let _runModeLocked: boolean = false;


/**
 * Возвращает, находится ли Angular в режиме разработки. После того, как позвонил один раз
 * значение заблокировано и больше не изменится.
 *
 * По умолчанию это верно, если пользователь не вызывает `enableProdMode` перед вызовом этого.
 *
 * @publicApi
 */
export function isDevMode(): boolean {
  _runModeLocked = true;
  return _devMode;
}

/**
 * Отключить режим разработки Angular, который отключает утверждения и прочее
 * проверяет в рамках.
 *
 * Одно важное утверждение, которое это отключает, подтверждает, что проход обнаружения изменений
 * не приводит к дополнительным изменениям в каких-либо привязках (также известный как
 * однонаправленный поток данных).
 *
 * @publicApi
 */
export function enableProdMode(): void {
  if (_runModeLocked) {
    throw new Error('Cannot enable prod mode after platform setup.');
  }
  _devMode = false;
}