/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {APP_ID, Injectable, NgModule} from '@angular/core';

export function escapeHtml(text: string): string {
  const escapedText: {[k: string]: string} = {
    '&': '&a;',
    '"': '&q;',
    '\'': '&s;',
    '<': '&l;',
    '>': '&g;',
  };
  return text.replace(/[&"'<>]/g, s => escapedText[s]);
}

export function unescapeHtml(text: string): string {
  const unescapedText: {[k: string]: string} = {
    '&a;': '&',
    '&q;': '"',
    '&s;': '\'',
    '&l;': '<',
    '&g;': '>',
  };
  return text.replace(/&[^;]+;/g, s => unescapedText[s]);
}

/**
 * Типобезопасный ключ для использования с `TransferState`.
 *
 * Пример:.
 *
 *  ```
 *  const COUNTER_KEY = makeStateKey<number>('counter');
 *  let value = 10;
 *
 *  transferState.set(COUNTER_KEY, value);
 *  ```
 *
 * @publicApi
 */
export type StateKey<T> = string&{__not_a_string: never};

/**
 * Создайте `StateKey<T>` который можно использовать для хранения значения типа T с помощью `TransferState`.
 *
 * Пример:.
 *
 *  ```
 *  const COUNTER_KEY = makeStateKey<number>('counter');
 *  let value = 10;
 *
 *  transferState.set(COUNTER_KEY, value);
 *  ```
 *
 * @publicApi
 */
export function makeStateKey<T = void>(key: string): StateKey<T> {
  return key as StateKey<T>;
}

/**
 * Хранилище значений ключей, которое передается из приложения на стороне сервера в приложение
 * на стороне клиента.
 *
 *  `TransferState`будет доступен в качестве токена для инъекций. Чтобы использовать его импорт
 *  `ServerTransferStateModule`на сервере `BrowserTransferStateModule` на клиенте.
 *
 * Значения в хранилище сериализуются / десериализуются с использованием JSON.stringify / JSON.parse. Так только
 * логические, числовые, строковые, нулевые и неклассовые объекты будут сериализованы и десериализированы в
 * без потерь способ.
 *
 * @publicApi
 */
@Injectable()
export class TransferState {
  private store: {[k: string]: {}|undefined} = {};
  private onSerializeCallbacks: {[k: string]: () => {} | undefined} = {};

  /** @internal */
  static init(initState: {}) {
    const transferState = new TransferState();
    transferState.store = initState;
    return transferState;
  }

  /**
   * Get the value corresponding to a key. Return `defaultValue` if key is not found.
   */
  get<T>(key: StateKey<T>, defaultValue: T): T {
    return this.store[key] !== undefined ? this.store[key] as T : defaultValue;
  }

  /**
   * Set the value corresponding to a key.
   */
  set<T>(key: StateKey<T>, value: T): void {
    this.store[key] = value;
  }

  /**
   * Remove a key from the store.
   */
  remove<T>(key: StateKey<T>): void {
    delete this.store[key];
  }

  /**
   * Test whether a key exists in the store.
   */
  hasKey<T>(key: StateKey<T>) {
    return this.store.hasOwnProperty(key);
  }

  /**
   * Register a callback to provide the value for a key when `toJson` is called.
   */
  onSerialize<T>(key: StateKey<T>, callback: () => T): void {
    this.onSerializeCallbacks[key] = callback;
  }

  /**
   * Serialize the current state of the store to JSON.
   */
  toJson(): string {
    // Call the onSerialize callbacks and put those values into the store.
    for (const key in this.onSerializeCallbacks) {
      if (this.onSerializeCallbacks.hasOwnProperty(key)) {
        try {
          this.store[key] = this.onSerializeCallbacks[key]();
        } catch (e) {
          console.warn('Exception in onSerialize callback: ', e);
        }
      }
    }
    return JSON.stringify(this.store);
  }
}

export function initTransferState(doc: Document, appId: string) {
  // Locate the script tag with the JSON data transferred from the server.
  // The id of the script tag is set to the Angular appId + 'state'.
  const script = doc.getElementById(appId + '-state');
  let initialState = {};
  if (script && script.textContent) {
    try {
      initialState = JSON.parse(unescapeHtml(script.textContent));
    } catch (e) {
      console.warn('Exception while restoring TransferState for app ' + appId, e);
    }
  }
  return TransferState.init(initialState);
}

/**
 * NgModule для установки на стороне клиента при использовании `TransferState` для передачи состояния из
 * сервер клиенту.
 *
 * @publicApi
 */
@NgModule({
  providers: [{provide: TransferState, useFactory: initTransferState, deps: [DOCUMENT, APP_ID]}],
})
export class BrowserTransferStateModule {
}
