/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ComponentRef} from '@angular/core';
import {exportNgVar} from '../../dom/util';
import {AngularProfiler} from './common_tools';

const PROFILER_GLOBAL_NAME = 'profiler';

/**
 * Включены инструменты Angular отладки, доступные через ваш браузер
 * консоль разработчика.
 *
 * Использование:.
 *
 *  1. Откройте консоль разработчика (например, в Chrome Ctrl + Shift + j)
 *  1. Тип `ng.``ng.` (обычно консоль будет отображать предложение автозаполнения)
 *  1. Попробуйте профилирование обнаружения изменений `ng.profiler.timeChangeDetection()`
 * затем нажмите Enter.
 *
 * @publicApi
 */
export function enableDebugTools<T>(ref: ComponentRef<T>): ComponentRef<T> {
  exportNgVar(PROFILER_GLOBAL_NAME, new AngularProfiler(ref));
  return ref;
}

/**
 * Отключает Angular инструменты.
 *
 * @publicApi
 */
export function disableDebugTools(): void {
  exportNgVar(PROFILER_GLOBAL_NAME, null);
}
