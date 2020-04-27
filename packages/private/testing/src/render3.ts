/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ɵresetJitOptions as resetJitOptions} from '@angular/core';

/**
 * Включает функцию в новую функцию, которая устанавливает документ и HTML для запуска теста.
 *
 * Эта функция предназначена для упаковки существующей функции тестирования. Обертка
 * добавляет HTML в `body` элемента `document` а затем разрывает ее.
 *
 * Эта функция предназначена для использования с`async await `и` Promise`с. Если завернутый
 * Функция возвращает обещание (или `async` асинхронной)то демонтаж задерживается до этого `Promise`
 * решено.
 *
 * На `node` эта функция обнаруживает, присутствует ли `document` и если нет, то создаст один
 * загрузка `domino` и установка его.
 *
 * Пример:.
 *
 *  ```
 *  describe('something', () => {
 *    it('should do something', withBody('<my-app></my-app>', async () => {
 *      const myApp = renderComponent(MyApp);
 *      await whenRendered(myApp);
 *      expect(getRenderedText(myApp)).toEqual('Hello World!');
 *    }));
 *  });
 *  ```
 *
 *  @param HTML HTMLкоторый должен быть вставлен в `body`of the `document`документа.
 *  @param blockFn функция для переноса. Функция может возвращать обещание или быть `async` асинхронной.
 * @publicApi
 */
export function withBody<T extends Function>(html: string, blockFn: T): T {
  return function(done: DoneFn) {
    if (typeof blockFn === 'function') {
      document.body.innerHTML = html;
      const blockReturn = blockFn();
      if (blockReturn instanceof Promise) {
        blockReturn.then(done, done.fail);
      } else {
        done();
      }
    }
  } as any;
}

let savedDocument: Document|undefined = undefined;
let savedRequestAnimationFrame: ((callback: FrameRequestCallback) => number)|undefined = undefined;
let savedNode: typeof Node|undefined = undefined;
let requestAnimationFrameCount = 0;

/**
 * System.js uses regexp to look for `require` statements. `domino` has to be
 * extracted into a constant so that the regexp in the System.js does not match
 * and does not try to load domino in the browser.
 */
const domino: any = (function(domino) {
  if (typeof global == 'object' && global.process && typeof require == 'function') {
    try {
      return require(domino);
    } catch (e) {
      // It is possible that we don't have domino available in which case just give up.
    }
  }
  // Seems like we don't have domino, give up.
  return null;
})('domino');

/**
 * Убедитесьчто глобальное имеет `Document` если мы вnode.js.
 * @publicApi
 */
export function ensureDocument(): void {
  if (domino) {
    // we are in node.js.
    const window = domino.createWindow('', 'http://localhost');
    savedDocument = (global as any).document;
    (global as any).window = window;
    (global as any).document = window.document;
    // Trick to avoid Event patching from
    // https://github.com/angular/angular/blob/7cf5e95ac9f0f2648beebf0d5bd9056b79946970/packages/platform-browser/src/dom/events/dom_events.ts#L112-L132
    // It fails with Domino with TypeError: Cannot assign to read only property
    // 'stopImmediatePropagation' of object '#<Event>'
    (global as any).Event = null;
    savedNode = (global as any).Node;
    (global as any).Node = domino.impl.Node;

    savedRequestAnimationFrame = (global as any).requestAnimationFrame;
    (global as any).requestAnimationFrame = function(cb: FrameRequestCallback): number {
      setImmediate(cb);
      return requestAnimationFrameCount++;
    };
  }
}

/**
 * Восстановите состояние `Document` между тестами.
 * @publicApi
 */
export function cleanupDocument(): void {
  if (savedDocument) {
    (global as any).document = savedDocument;
    (global as any).window = undefined;
    savedDocument = undefined;
  }
  if (savedNode) {
    (global as any).Node = savedNode;
    savedNode = undefined;
  }
  if (savedRequestAnimationFrame) {
    (global as any).requestAnimationFrame = savedRequestAnimationFrame;
    savedRequestAnimationFrame = undefined;
  }
}

if (typeof beforeEach == 'function') beforeEach(ensureDocument);
if (typeof afterEach == 'function') afterEach(cleanupDocument);

if (typeof afterEach === 'function') afterEach(resetJitOptions);
