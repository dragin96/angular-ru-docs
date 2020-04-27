/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * fakeAsync has been moved to zone.js
 * this file is for fallback in case old version of zone.js is used
 */
const _Zone: any = typeof Zone !== 'undefined' ? Zone : null;
const FakeAsyncTestZoneSpec = _Zone && _Zone['FakeAsyncTestZoneSpec'];
type ProxyZoneSpec = {
  setDelegate(delegateSpec: ZoneSpec): void; getDelegate(): ZoneSpec; resetDelegate(): void;
};
const ProxyZoneSpec: {get(): ProxyZoneSpec; assertPresent: () => ProxyZoneSpec} =
    _Zone && _Zone['ProxyZoneSpec'];

let _fakeAsyncTestZoneSpec: any = null;

/**
 * Удаляет общую ложную асинхронную зону для теста.
 * Дляв глобальном `beforeEach``beforeEach`.
 *
 * @publicApi
 */
export function resetFakeAsyncZoneFallback() {
  _fakeAsyncTestZoneSpec = null;
  // in node.js testing we may not have ProxyZoneSpec in which case there is nothing to reset.
  ProxyZoneSpec && ProxyZoneSpec.assertPresent().resetDelegate();
}

let _inFakeAsyncCall = false;

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
export function fakeAsyncFallback(fn: Function): (...args: any[]) => any {
  // Not using an arrow function to preserve context passed from call site
  return function(this: unknown, ...args: any[]) {
    const proxyZoneSpec = ProxyZoneSpec.assertPresent();
    if (_inFakeAsyncCall) {
      throw new Error('fakeAsync() calls can not be nested');
    }
    _inFakeAsyncCall = true;
    try {
      if (!_fakeAsyncTestZoneSpec) {
        if (proxyZoneSpec.getDelegate() instanceof FakeAsyncTestZoneSpec) {
          throw new Error('fakeAsync() calls can not be nested');
        }

        _fakeAsyncTestZoneSpec = new FakeAsyncTestZoneSpec();
      }

      let res: any;
      const lastProxyZoneSpec = proxyZoneSpec.getDelegate();
      proxyZoneSpec.setDelegate(_fakeAsyncTestZoneSpec);
      try {
        res = fn.apply(this, args);
        flushMicrotasksFallback();
      } finally {
        proxyZoneSpec.setDelegate(lastProxyZoneSpec);
      }

      if (_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
        throw new Error(
            `${_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length} ` +
            `periodic timer(s) still in the queue.`);
      }

      if (_fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
        throw new Error(
            `${_fakeAsyncTestZoneSpec.pendingTimers.length} timer(s) still in the queue.`);
      }
      return res;
    } finally {
      _inFakeAsyncCall = false;
      resetFakeAsyncZoneFallback();
    }
  };
}

function _getFakeAsyncZoneSpec(): any {
  if (_fakeAsyncTestZoneSpec == null) {
    throw new Error('The code should be running in the fakeAsync zone to call this function');
  }
  return _fakeAsyncTestZoneSpec;
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
 * @publicApi
 */
export function tickFallback(
    millis: number = 0, tickOptions: {processNewMacroTasksSynchronously: boolean} = {
      processNewMacroTasksSynchronously: true
    }): void {
  _getFakeAsyncZoneSpec().tick(millis, null, tickOptions);
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
export function flushFallback(maxTurns?: number): number {
  return _getFakeAsyncZoneSpec().flush(maxTurns);
}

/**
 * Откажитесь от всех оставшихся периодических задач.
 *
 * @publicApi
 */
export function discardPeriodicTasksFallback(): void {
  const zoneSpec = _getFakeAsyncZoneSpec();
  zoneSpec.pendingPeriodicTimers.length = 0;
}

/**
 * Сбросьте любые ожидающие выполнения микрозадачи.
 *
 * @publicApi
 */
export function flushMicrotasksFallback(): void {
  _getFakeAsyncZoneSpec().flushMicrotasks();
}
