/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {discardPeriodicTasksFallback, fakeAsyncFallback, flushFallback, flushMicrotasksFallback, resetFakeAsyncZoneFallback, tickFallback} from './fake_async_fallback';

const _Zone: any = typeof Zone !== 'undefined' ? Zone : null;
const fakeAsyncTestModule = _Zone && _Zone[_Zone.__symbol__('fakeAsyncTest')];

/**
 * Удаляет общую ложную асинхронную зону для теста.
 * Дляв глобальном `beforeEach``beforeEach`.
 *
 * @publicApi
 */
export function resetFakeAsyncZone(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.resetFakeAsyncZone();
  } else {
    return resetFakeAsyncZoneFallback();
  }
}

/**
 * Обертка функция должна быть выполнена в зонеfakeAsync:.
 * - microtasks вручную выполняется путем вызова `flushMicrotasks()`,
 * - таймеры синхронны, `tick()` имитирует асинхронный ход времени.
 *
 * Если в конце функции есть ожидающие таймеры, будет сгенерировано исключение.
 *
 * Может использоваться для переноса вызовов inject ().
 *
 *  @usageNotes
 *  ### Пример
 *
 *  {@example core/testing/ts/fake_async.ts region='basic'}
 *
 *  @param фин
 *  @returns Функция упакована для выполнения в зоне fakeAsync
 *
 * @publicApi
 */
export function fakeAsync(fn: Function): (...args: any[]) => any {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.fakeAsync(fn);
  } else {
    return fakeAsyncFallback(fn);
  }
}

/**
 * Имитирует асинхронное течение времени для таймеров в зоне fakeAsync.
 *
 * Очередь микрозадач очищается в самом начале этой функции и после любого обратного вызова таймера
 * был выполнен
 *
 *  @usageNotes
 *  ### Пример
 *
 *  {@example core/testing/ts/fake_async.ts region='basic'}
 *
 *  @param миллисекунда - количество миллисекунд, на которое продвигается виртуальный таймер
 *  @param tickOptions, варианты галочки с вызываемым флагом
 * processNewMacroTasksSynchronously, вызывать ли новые macroTasks, по умолчанию это
 * false означает, что новые макрозадачи будут вызваны
 *
 * Например,.
 *
 * it ('test with nested setTimeout', fakeAsync (() => {
 * let nestedTimeoutInvoked = false;
 * function funcWithNestedTimeout () {
 * setTimeout (() => {
 * nestedTimeoutInvoked = true;
 * });
 * };
 * SetTimeout (funcWithNestedTimeout);
 * поставить галочку();
 * ожидать (nestedTimeoutInvoked) .toBe (истина);
 * }));
 *
 * в этом случае у нас есть вложенный тайм-аут (новый macroTask), когда мы ставим галочку, оба
 * FuncWithNestedTimeout и вложенный тайм-аут будут вызваны оба.
 *
 * it ('test with nested setTimeout', fakeAsync (() => {
 * let nestedTimeoutInvoked = false;
 * function funcWithNestedTimeout () {
 * setTimeout (() => {
 * nestedTimeoutInvoked = true;
 * });
 * };
 * SetTimeout (funcWithNestedTimeout);
 * галочка (0, {processNewMacroTasksSynchronously: false});
 * ожидать (nestedTimeoutInvoked) .toBe (ложь);
 * }));
 *
 * если мы передаем tickOptions с processNewMacroTasksSynchronously, чтобы быть ложным, вложенный тайм-аут
 * не будет вызван.
 *
 *
 * @publicApi
 */
export function tick(
    millis: number = 0, tickOptions: {processNewMacroTasksSynchronously: boolean} = {
      processNewMacroTasksSynchronously: true
    }): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.tick(millis, tickOptions);
  } else {
    return tickFallback(millis, tickOptions);
  }
}

/**
 * Имитирует асинхронное прохождение времени для таймеров в зоне fakeAsync
 * опустошение очереди макросов до тех пор, пока она не станет пустой. Возвращаемое значение - миллисекунды
 * времени, которое прошло бы.
 *
 *  @param maxTurns
 *  @returns Имитированное время в миллис.
 *
 * @publicApi
 */
export function flush(maxTurns?: number): number {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.flush(maxTurns);
  } else {
    return flushFallback(maxTurns);
  }
}

/**
 * Откажитесь от всех оставшихся периодических задач.
 *
 * @publicApi
 */
export function discardPeriodicTasks(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.discardPeriodicTasks();
  } else {
    discardPeriodicTasksFallback();
  }
}

/**
 * Сбросьте любые ожидающие выполнения микрозадачи.
 *
 * @publicApi
 */
export function flushMicrotasks(): void {
  if (fakeAsyncTestModule) {
    return fakeAsyncTestModule.flushMicrotasks();
  } else {
    return flushMicrotasksFallback();
  }
}
