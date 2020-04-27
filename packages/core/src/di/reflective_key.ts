/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {stringify} from '../util/stringify';
import {resolveForwardRef} from './forward_ref';


/**
 * Уникальный объект, используемый для извлечения элементов из{@link ReflectiveInjector},
 *
 * Клавишиимеют:.
 * - общесистемный уникальный `id`.
 * - это `token` маркер.
 *
 *  `Key`используется внутри{@link ReflectiveInjector}потому что его общесистемный уникальный `id` позволяет
 *  the
 * Инжектор для более эффективного хранения созданных объектов.
 *
 *  `Key`не должен создаваться напрямую.{@link ReflectiveInjector}создает ключи автоматически, когда
 * разрешения.
 * провайдеры.
 *
 *  @deprecated Без замены
 * @publicApi
 */
export class ReflectiveKey {
  public readonly displayName: string;
  /**
   * Private
   */
  constructor(public token: Object, public id: number) {
    if (!token) {
      throw new Error('Token must be defined!');
    }
    this.displayName = stringify(this.token);
  }

  /**
   * Retrieves a `Key` for a token.
   */
  static get(token: Object): ReflectiveKey {
    return _globalKeyRegistry.get(resolveForwardRef(token));
  }

  /**
   * @returns the number of keys registered in the system.
   */
  static get numberOfKeys(): number {
    return _globalKeyRegistry.numberOfKeys;
  }
}

export class KeyRegistry {
  private _allKeys = new Map<Object, ReflectiveKey>();

  get(token: Object): ReflectiveKey {
    if (token instanceof ReflectiveKey) return token;

    if (this._allKeys.has(token)) {
      return this._allKeys.get(token)!;
    }

    const newKey = new ReflectiveKey(token, ReflectiveKey.numberOfKeys);
    this._allKeys.set(token, newKey);
    return newKey;
  }

  get numberOfKeys(): number {
    return this._allKeys.size;
  }
}

const _globalKeyRegistry = new KeyRegistry();
