/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../../interface/type';

/**
 * Конфигурирует `Injector` возвращать значение для маркеров.
 * База для `ValueProvider` декоратор.
 *
 * @publicApi
 */
export interface ValueSansProvider {
  /**
   * The value to inject.
   */
  useValue: any;
}

/**
 * Конфигурирует `Injector` возвращать значение для маркеров.
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  ### Пример
 *
 *  {@example core/di/ts/provider_spec.ts region='ValueProvider'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ValueProvider extends ValueSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Настраивает `Injector` для возврата экземпляра` `useClass` для токена.
 * База для `StaticClassProvider` декоратор.
 *
 * @publicApi
 */
export interface StaticClassSansProvider {
  /**
   * An optional class to instantiate for the `token`. By default, the `provide`
   * class is instantiated.
   */
  useClass: Type<any>;

  /**
   * A list of `token`s to be resolved by the injector. The list of values is then
   * used as arguments to the `useClass` constructor.
   */
  deps: any[];
}

/**
 * Настраивает `Injector` для возврата экземпляра` `useClass` для токена.
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='StaticClassProvider'}
 *
 * Обратите вниманиечто следующие два провайдера неравен:.
 *
 *  {@example core/di/ts/provider_spec.ts region='StaticClassProviderDifference'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface StaticClassProvider extends StaticClassSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Конфигурирует `Injector` вернуть экземпляр маркера.
 *
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  ```ts
 *  @Injectable(SomeModule, {deps: []})
 *  class MyService {}
 *  ```
 *
 * @publicApi
 */
export interface ConstructorSansProvider {
  /**
   * A list of `token`s to be resolved by the injector.
   */
  deps?: any[];
}

/**
 * Конфигурирует `Injector` вернуть экземпляр маркера.
 *
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='ConstructorProvider'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ConstructorProvider extends ConstructorSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: Type<any>;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Конфигурирует `Injector` для возвращения значения другого `useExisting` маркер.
 *
 *  @see `ExistingProvider`
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 * @publicApi
 */
export interface ExistingSansProvider {
  /**
   * Existing `token` to return. (Equivalent to `injector.get(useExisting)`)
   */
  useExisting: any;
}

/**
 * Конфигурирует `Injector` для возвращения значения другого `useExisting` маркер.
 *
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='ExistingProvider'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ExistingProvider extends ExistingSansProvider {
  /**
   * An injection token. Typically an instance of `Type` or `InjectionToken`, but can be `any`.
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Конфигурирует `Injector` для возвращения значения путем вызова `useFactory` функцию useFactory.
 *
 *  @see `FactoryProvider` `FactoryProvider`
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 * @publicApi
 */
export interface FactorySansProvider {
  /**
   * A function to invoke to create a value for this `token`. The function is invoked with
   * resolved values of `token`s in the `deps` field.
   */
  useFactory: Function;

  /**
   * A list of `token`s to be resolved by the injector. The list of values is then
   * used as arguments to the `useFactory` function.
   */
  deps?: any[];
}

/**
 * Конфигурирует `Injector` для возвращения значения путем вызова `useFactory` функцию useFactory.
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='FactoryProvider'}
 *
 * Зависимости могут быть помечены какнеобязательные:.
 *
 *  {@example core/di/ts/provider_spec.ts region='FactoryProviderOptionalDeps'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface FactoryProvider extends FactorySansProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Описываеткак `Injector` должен быть сконфигурирован как статический (то есть, без отражения).
 * Статический провайдер предоставляет токены инжектору для различных типов зависимостей.
 *
 *  @see [Injector.create ()](/api/core/Injector#create).
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection-providers).
 *
 * @publicApi
 */
export type StaticProvider =
    ValueProvider|ExistingProvider|StaticClassProvider|ConstructorProvider|FactoryProvider|any[];


/**
 * Конфигурирует `Injector` вернуть экземпляр `Type` когда `Type' is used as the token...Create an instance by invoking the ` новый` operator and supplying additional arguments..This form is a short form of `TypeProvider`;
 *
 * Для получения дополнительной информации см.[«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='TypeProvider'}
 *
 * @publicApi
 */
export interface TypeProvider extends Type<any> {}

/**
 * Конфигурирует `Injector` для возвращения значения путем вызова `useClass` функцию useClass.
 * База для `ClassProvider` декоратор.
 *
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 * @publicApi
 */
export interface ClassSansProvider {
  /**
   * Class to instantiate for the `token`.
   */
  useClass: Type<any>;
}

/**
 * Настраивает `Injector` для возврата экземпляра` `useClass` для токена.
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @usageNotes
 *
 *  {@example core/di/ts/provider_spec.ts region='ClassProvider'}
 *
 * Обратите вниманиечто следующие два провайдера неравен:.
 *
 *  {@example core/di/ts/provider_spec.ts region='ClassProviderDifference'}
 *
 *  ### Многозначный пример
 *
 *  {@example core/di/ts/provider_spec.ts region='MultiProviderAspect'}
 *
 * @publicApi
 */
export interface ClassProvider extends ClassSansProvider {
  /**
   * An injection token. (Typically an instance of `Type` or `InjectionToken`, but can be `any`).
   */
  provide: any;

  /**
   * When true, injector returns an array of instances. This is useful to allow multiple
   * providers spread across many files to provide configuration information to a common token.
   */
  multi?: boolean;
}

/**
 * Описываеткак `Injector` должен быть сконфигурирован.
 *  @see [«Руководство по внедрению зависимостей»](guide/dependency-injection).
 *
 *  @see `StaticProvider`
 *
 * @publicApi
 */
export type Provider = TypeProvider|ValueProvider|ClassProvider|ConstructorProvider|
    ExistingProvider|FactoryProvider|any[];

/**
 * Describes a function that is used to process provider lists (such as provider
 * overrides).
 */
export type ProcessProvidersFunction = (providers: Provider[]) => Provider[];
