/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';

import {ɵɵdefineInjectable} from './interface/defs';

/**
 * Создает токен, который можно использовать в провайдере DI.
 *
 * Используйте `InjectionToken` всякий раз, когда тип, который вы вводите, не является reified (не имеет
 * представление во время выполнения), например, при внедрении интерфейса, вызываемого типа, массива или
 * параметризованный тип.
 *
 *  `InjectionToken `параметризован` T`который является типом объекта, который будет возвращен
 *  the `Injector`Инжектор. Это обеспечивает дополнительный уровень безопасности типов.
 *
 *  ```
 *  interface MyInterface {...}
 *  var myInterface = injector.get(new InjectionToken<MyInterface>('SomeToken'));
 *  // myInterface is inferred to be MyInterface.
 *  ```
 *
 * При создании `InjectionToken` , вы можете дополнительно указать фабричную функцию, которая возвращает
 * (возможнопутем создания) значение по умолчанию параметризованного типа `T` T. Это настраивает
 *  `InjectionToken`использует эту фабрику в качестве провайдера, как если бы она была явно определена в
 * корневой инжектор приложения. Если фабричная функция, которая принимает нулевые аргументы, должна ввести
 * зависимости, это можно сделать с помощью `inject``inject` . Смотрите ниже пример.
 *
 * Кроме того, если `factory` указанвы можете также указать `providedIn` вариант providedIn,который.
 * отменяет вышеуказанное поведение и помечает токен как принадлежащий определенному `@NgModule` . Как
 * упоминалось выше, `'root'` является значением по умолчанию для `providedIn` providedIn.
 *
 *  @usageNotes
 *  ### Основной пример
 *
 *  ### Простой InjectionToken
 *
 *  {@example core/di/ts/injector_spec.ts region='InjectionToken'}
 *
 *  ### Потрясенный деревьями InjectionToken
 *
 *  {@example core/di/ts/injector_spec.ts region='ShakableInjectionToken'}
 *
 *
 * @publicApi
 */
export class InjectionToken<T> {
  /** @internal */
  readonly ngMetadataName = 'InjectionToken';

  readonly ɵprov: never|undefined;

  constructor(protected _desc: string, options?: {
    providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T
  }) {
    this.ɵprov = undefined;
    if (typeof options == 'number') {
      // This is a special hack to assign __NG_ELEMENT_ID__ to this instance.
      // __NG_ELEMENT_ID__ is Used by Ivy to determine bloom filter id.
      // We are using it to assign `-1` which is used to identify `Injector`.
      (this as any).__NG_ELEMENT_ID__ = options;
    } else if (options !== undefined) {
      this.ɵprov = ɵɵdefineInjectable({
        token: this,
        providedIn: options.providedIn || 'root',
        factory: options.factory,
      });
    }
  }

  toString(): string {
    return `InjectionToken ${this._desc}`;
  }
}

export interface InjectableDefToken<T> extends InjectionToken<T> {
  ɵprov: never;
}
