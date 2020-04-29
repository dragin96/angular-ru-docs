/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, NgModuleFactory, NgModuleRef, StaticProvider} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';

import {IInjectorService, IProvideService, module_ as angularModule} from '../../src/common/src/angular1';
import {$INJECTOR, $PROVIDE, DOWNGRADED_MODULE_COUNT_KEY, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_APP_TYPE_KEY, UPGRADE_MODULE_NAME} from '../../src/common/src/constants';
import {getDowngradedModuleCount, isFunction, LazyModuleRef, UpgradeAppType} from '../../src/common/src/util';

import {angular1Providers, setTempInjectorRef} from './angular1_providers';
import {NgAdapterInjector} from './util';


let moduleUid = 0;

/**
 *  @description
 *
 * Вспомогательная функция для создания модуля AngularJS, который может загружать модуль Angular
 * «по требованию» (возможно, лениво), когда {@link downgradeComponent downgraded component} должен быть
 * инстанцирован.
 *
 * Часть[обновление / статическая](api?query=upgrade/static)библиотека для гибридных приложений обновления
 * поддержка компиляции AOT.
 *
 * Это позволяет загружать / загружать Angular часть гибридного приложения лениво и без необходимости
 * оплатить стоимость авансом. Например, у вас может быть приложение AngularJS, которое использует Angular для
 * конкретные маршруты и создавать экземпляры модулей Angular только если / когда пользователь посещает один из них
 * маршруты.
 *
 * Модуль Angular будет загружен один раз (при первом запросе) и тот же
 * ссылка будет использоваться с этого момента.
 *
 *  `downgradeModule()`требует или `NgModuleFactory` илифункцию:.
 * - `NgModuleFactory` : если вы передадите` `NgModuleFactory` , он будет использован для создания экземпляра модуля
 * используя `platformBrowser` 's{@link PlatformRef#bootstrapModuleFactory bootstrapModuleFactory()},
 * - `Function` : если вы передадите функцию, она должна вернуть обещание, разрешенное в
 *    `NgModuleRef`. Функция вызывается с массивом дополнительных{@link StaticProvider Providers}
 * которыекак ожидается, будут доступны с возвращаемым `NgModuleRef` NgModuleRef«s `Injector` Injector.
 *
 *  `downgradeModule()`возвращает имя созданного модуля оболочки AngularJS. Вы можете использовать его для
 * объявите зависимость в вашем основном модуле AngularJS.
 *
 *  {@example upgrade/static/ts/lite/module.ts region="basic-how-to"}
 *
 * Для получения более подробной информации о том, как использовать `downgradeModule()` смотрите
 *  [Обновление для производительности](guide/upgrade-performance).
 *
 *  @usageNotes
 *
 * Помимо `UpgradeModule` , вы можете использовать остальных `upgrade/static``upgrade/static` как обычно
 * создать гибридное приложение. Обратите внимание, что Angular части (например, пониженные услуги) не будут
 * доступно до тех пор, пока пониженный модуль не будет загружен, то есть путем создания экземпляра пониженного уровня
 * составная часть.
 *
 *  <div class="alert is-important">
 *
 * Вы не можете использовать `downgradeModule()` и `UpgradeModule` в одном и том же гибридном приложении.<br />
 * Используйте один или другой.
 *
 *  </div>
 *
 *  ### Отличия от `UpgradeModule`
 *
 * Помимо их различного API, между ними есть два важных внутренних различия
 *  `downgradeModule() `и ` UpgradeModule` которые влияют на поведение гибридныхприложений:.
 *
 *  1. В отличие от `UpgradeModule` , `downgradeModule()` не загружает основной модуль AngularJS
 * внутри{@link NgZone Angular zone},
 * 2. В отличие от `UpgradeModule` , `downgradeModule()` не запускается автоматически
 *     [$ digest ()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest)когда изменения есть
 * обнаружен в Angular части приложения.
 *
 * Это означает, что приложения, использующие `UpgradeModule` будут больше запускать обнаружение изменений
 * часто, чтобы гарантировать, что обе структуры должным образом уведомлены о возможных изменениях.
 * Это неизбежно приведет к большему количеству прогонов обнаружения изменений, чем необходимо.
 *
 *  `downgradeModule()`, с другой стороны, не пытается связать две системы обнаружения изменений как
 * строгое ограничение явного обнаружения изменений выполняется только в тех случаях, когда оно знает, что это так
 * необходимо (например, когда изменяются входные данные компонента пониженной версии). Это улучшает производительность
 * особенно в приложениях с интенсивным обнаружением изменений, но оставляет их на усмотрение разработчика вручную
 * уведомить каждую структуру по мере необходимости.
 *
 * Для более подробного обсуждения различий и их последствий см
 *  [Обновление для производительности](guide/upgrade-performance).
 *
 *  <div class="alert is-helpful">
 *
 * Вы можете вручную запустить прогон обнаружения изменений в AngularJS, используя
 *    [scope. $ apply (...)](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply)или
 *    [$ rootScope. $ digest ()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$digest).
 *
 * Вы можете вручную запустить прогон обнаружения изменений в Angular, используя{@link NgZone#run
 *    ngZone.run(...)},
 *
 *  </div>
 *
 *  ### Понижение нескольких модулей
 *
 * Можно понизить версию нескольких модулей и включить их в приложение AngularJS. Дюйм
 * В этом случае каждый пониженный модуль будет загружен при ассоциированном пониженном компоненте или
 * инъекционный должен быть создан.
 *
 * Что нужно иметь в виду, когда понижая несколькомодулей:.
 *
 * - Каждый ухудшенный компонент / инъецируемый должен быть явно связан с пониженным
 * модуль. Смотрите `downgradeComponent()` и `downgradeInjectable()` для более подробной информации.
 *
 * - Если вы хотите, чтобы некоторые инъекционные препараты были доступны всем устаревшим модулям, вы можете указать их как
 *    `StaticProvider`с, при создании `PlatformRef` (напримерпомощью `platformBrowser` или.
 *    `platformBrowserDynamic`).
 *
 * - Когда используешь {@link PlatformRef#bootstrapmodule `bootstrapModule()`} или.
 *    {@link PlatformRef#bootstrapmodulefactory `bootstrapModuleFactory()`}чтобы загрузить
 * Пониженные модули, каждый считается «корневым» модулем. Как следствие, новый экземпляр
 * будет создан для каждой инъекции, предоставленной в `"root"``"root"` (через
 *    {@link Injectable#providedIn `providedIn`}).
 * Если это не ваше намерение, вы можете иметь общий модуль (который будет действовать как «корень»)
 * модуль) и создать все загрубленные модулииспользуя форсунку этогомодуля:.
 *
 *    {@example upgrade/static/ts/lite-multi-shared/module.ts region="shared-root-module"}
 *
 * @publicApi
 */
export function downgradeModule<T>(moduleFactoryOrBootstrapFn: NgModuleFactory<T>|(
    (extraProviders: StaticProvider[]) => Promise<NgModuleRef<T>>)): string {
  const lazyModuleName = `${UPGRADE_MODULE_NAME}.lazy${++moduleUid}`;
  const lazyModuleRefKey = `${LAZY_MODULE_REF}${lazyModuleName}`;
  const lazyInjectorKey = `${INJECTOR_KEY}${lazyModuleName}`;

  const bootstrapFn = isFunction(moduleFactoryOrBootstrapFn) ?
      moduleFactoryOrBootstrapFn :
      (extraProviders: StaticProvider[]) =>
          platformBrowser(extraProviders).bootstrapModuleFactory(moduleFactoryOrBootstrapFn);

  let injector: Injector;

  // Create an ng1 module to bootstrap.
  angularModule(lazyModuleName, [])
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Lite)
      .factory(INJECTOR_KEY, [lazyInjectorKey, identity])
      .factory(
          lazyInjectorKey,
          () => {
            if (!injector) {
              throw new Error(
                  'Trying to get the Angular injector before bootstrapping the corresponding ' +
                  'Angular module.');
            }
            return injector;
          })
      .factory(LAZY_MODULE_REF, [lazyModuleRefKey, identity])
      .factory(
          lazyModuleRefKey,
          [
            $INJECTOR,
            ($injector: IInjectorService) => {
              setTempInjectorRef($injector);
              const result: LazyModuleRef = {
                promise: bootstrapFn(angular1Providers).then(ref => {
                  injector = result.injector = new NgAdapterInjector(ref.injector);
                  injector.get($INJECTOR);

                  return injector;
                })
              };
              return result;
            }
          ])
      .config([
        $INJECTOR, $PROVIDE,
        ($injector: IInjectorService, $provide: IProvideService) => {
          $provide.constant(DOWNGRADED_MODULE_COUNT_KEY, getDowngradedModuleCount($injector) + 1);
        }
      ]);

  return lazyModuleName;
}

function identity<T = any>(x: T): T {
  return x;
}
