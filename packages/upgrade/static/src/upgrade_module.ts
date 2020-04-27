/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, isDevMode, NgModule, NgZone, Testability} from '@angular/core';

import {bootstrap, element as angularElement, IInjectorService, IIntervalService, IProvideService, ITestabilityService, module_ as angularModule} from '../../src/common/src/angular1';
import {$$TESTABILITY, $DELEGATE, $INJECTOR, $INTERVAL, $PROVIDE, INJECTOR_KEY, LAZY_MODULE_REF, UPGRADE_APP_TYPE_KEY, UPGRADE_MODULE_NAME} from '../../src/common/src/constants';
import {controllerKey, LazyModuleRef, UpgradeAppType} from '../../src/common/src/util';

import {angular1Providers, setTempInjectorRef} from './angular1_providers';
import {NgAdapterInjector} from './util';



/**
 *  @description
 *
 *  An `NgModule`NgModule, который вы импортируетечтобы обеспечить AngularJS основныхуслуг,.
 * и имеет метод экземпляра, используемый для начальной загрузки гибридного приложения обновления.
 *
 * Часть[апгрейд / статика](api?query=upgrade/static)
 * библиотека для гибридных приложений обновления, которые поддерживают компиляцию AOT
 *
 *  The `upgrade/static`пакет содержит хелперыкоторые позволяют AngularJS и Angularкомпоненты.
 * для совместного использования в гибридном приложении обновления, которое поддерживает компиляцию AOT.
 *
 * частности, классы и функции в `upgrade/static` модуляпозволяют:.
 *
 *  1. Создание директивы Angular, которая оборачивает и выставляет компонент AngularJS так
 * что его можно использовать в угловом шаблоне. Смотрите `UpgradeComponent`.
 * 2. Создание директивы AngularJS, которая оборачивает и выставляет компонент Angular так
 * что он может быть использован в шаблоне AngularJS. Смотрите `downgradeComponent`.
 * 3. Создание поставщика корневого инжектора Angular, который оборачивает и выставляет AngularJS
 * сервис, так что он может быть введен в Angular контекст. См
 *     {@link UpgradeModule#upgrading-an-angular-1-service Upgrading an AngularJS service}ниже.
 * 4. Создание службы AngularJS, которая оборачивает и предоставляет доступ к инъекциям Angular
 * чтобы его можно было вставить в контекст AngularJS. Смотрите `downgradeInjectable`.
 * 3. Начальная загрузка гибридного Angular приложения, содержащего обе платформы
 * сосуществовать в одном приложении.
 *
 *  @usageNotes
 *
 *  ```ts
 *  import {UpgradeModule} from '@angular/upgrade/static';
 *  ```
 *
 * Смотрите также{@link UpgradeModule#examples examples}ниже.
 *
 *  ### Ментальная модель
 *
 * При рассуждении о том, как работает гибридное приложение, полезно иметь умственную модель, которая
 * описывает, что происходит, и объясняет, что происходит на самом низком уровне.
 *
 *  1. В одном приложении работают две независимые платформы, каждая из которых обрабатывает
 * другой как черный ящик.
 * 2. Каждый элемент DOM на странице принадлежит ровно одному фреймворку. Какую бы рамку
 * экземпляр элемента является владельцем. Каждый фреймворк только обновляет / взаимодействует со своим собственным
 * DOM элементы и игнорирует других.
 * 3. Директивы AngularJS всегда выполняются внутри базы кода AngularJS независимо от
 * где они созданы.
 * 4. Angular компоненты всегда выполняются внутри кодовой базы Angular Framework независимо от
 * где они созданы.
 * 5. Компонент AngularJS можно «обновить» до компонента Angular
 * определяя директиву Angular, которая загружает компонент AngularJS на своем месте
 * в ДОМ. Смотрите `UpgradeComponent`.
 * 6. Компонент Angular может быть «понижен» до компонента AngularJS. Это достигается путем
 * определяя директиву AngularJS, которая загружает компонент Angular на его месте
 * в ДОМ. Смотрите `downgradeComponent`.
 * 7. Каждый раз, когда создается экземпляр «обновленного» / «пониженного качества», хост-элемент принадлежит
 * Фреймворк делает экземпляр. Другая структура затем создает и владеет
 * посмотреть на этот компонент.
 *     1. Это подразумевает, что привязки компонентов всегда будут следовать семантике
 * рамки реализации.
 * 2. Атрибуты DOM анализируются платформой, которой принадлежит текущий шаблон.Так.
 * атрибуты в шаблонах AngularJS должны использовать kebab-case, в то время как шаблоны AngularJS должны использовать
 * верблюжий.
 * 3. Однако синтаксис привязки шаблона всегда будет использовать стиль Angular, например, квадрат
 * скобки (`[...]`) для привязки свойства.
 * 8. Angular загружается первым; AngularJS загружается вторым. AngularJS всегда владеет
 * корневой компонент приложения.
 * 9. Новое приложение работает в Angular зоне, и поэтому ему больше не нужны вызовы
 *     `$apply()`.
 *
 *  ### The `UpgradeModule`класса.
 *
 * Этот класс является `NgModule` , который вы импортируете для предоставления основных сервисов AngularJS
 * и имеет метод экземпляра, используемый для начальной загрузки гибридного приложения обновления.
 *
 * Основные услуги AngularJS
 * этого `NgModule``NgModule` добавит провайдеров для ядра
 *    [Услуги AngularJS](https://docs.angularjs.org/api/ng/service)для корневого инжектора.
 *
 * Бутстрап
 * Экземпляр времени выполнения этого класса содержит{@link UpgradeModule#bootstrap `bootstrap()`}
 * метод, который используется для начальной загрузки модуля AngularJS верхнего уровня на элемент в
 * DOM для гибридного приложения обновления.
 *
 * Он также содержит свойства для доступа к{@link UpgradeModule#injector root injector},То.
 * начальная `NgZone` и
 *    [AngularJS $ инжектор](https://docs.angularjs.org/api/auto/service/$injector).
 *
 * ### Examples
 *
 * Импортируйте `UpgradeModule` на свой верхний уровень{@link NgModule Angular `NgModule`},
 *
 *  {@example upgrade/static/ts/full/module.ts region='ng2-module'}
 *
 * Затем `UpgradeModule` в свой Angular `NgModule``NgModule` и используйте его для начальной загрузки верхнего уровня
 *  [Модуль AngularJS](https://docs.angularjs.org/api/ng/type/angular.Module)в
 *  `ngDoBootstrap()`метод.
 *
 *  {@example upgrade/static/ts/full/module.ts region='bootstrap-ng1'}
 *
 * Наконец,весь процесс, загрузив свой Angularвысшего уровня `NgModule``NgModule`.
 *
 *  {@example upgrade/static/ts/full/module.ts region='bootstrap-ng2'}
 *
 *  {@a upgrading-an-angular-1-service}
 *  ### Обновление сервиса AngularJS
 *
 * Не существует специального API для обновления сервиса AngularJS. Вместо этого вы должны просто следовать
 * Следующийрецепт:.
 *
 * Скажемвас есть услугиAngularJS:.
 *
 *  {@example upgrade/static/ts/full/module.ts region="ng1-text-formatter-service"}
 *
 * Затем вы должны определить поставщика Angular, который будет включен в ваш `NgModule``providers`
 * имущество.
 *
 *  {@example upgrade/static/ts/full/module.ts region="upgrade-ng1-service"}
 *
 * Затем вы можете использовать «обновленный» сервис AngularJS, внедрив его в компонент Angular
 * или сервис.
 *
 *  {@example upgrade/static/ts/full/module.ts region="use-ng1-upgraded-service"}
 *
 * @publicApi
 */
@NgModule({providers: [angular1Providers]})
export class UpgradeModule {
  /**
   * The AngularJS `$injector` for the upgrade application.
   */
  public $injector: any /*angular.IInjectorService*/;
  /** The Angular Injector **/
  public injector: Injector;

  constructor(
      /** The root `Injector` for the upgrade application. */
      injector: Injector,
      /** The bootstrap zone for the upgrade application */
      public ngZone: NgZone) {
    this.injector = new NgAdapterInjector(injector);
  }

  /**
   * Bootstrap an AngularJS application from this NgModule
   * @param element the element on which to bootstrap the AngularJS application
   * @param [modules] the AngularJS modules to bootstrap for this application
   * @param [config] optional extra AngularJS bootstrap configuration
   */
  bootstrap(
      element: Element, modules: string[] = [], config?: any /*angular.IAngularBootstrapConfig*/) {
    const INIT_MODULE_NAME = UPGRADE_MODULE_NAME + '.init';

    // Create an ng1 module to bootstrap
    const initModule =
        angularModule(INIT_MODULE_NAME, [])

            .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Static)

            .value(INJECTOR_KEY, this.injector)

            .factory(
                LAZY_MODULE_REF,
                [INJECTOR_KEY, (injector: Injector) => ({injector} as LazyModuleRef)])

            .config([
              $PROVIDE, $INJECTOR,
              ($provide: IProvideService, $injector: IInjectorService) => {
                if ($injector.has($$TESTABILITY)) {
                  $provide.decorator($$TESTABILITY, [
                    $DELEGATE,
                    (testabilityDelegate: ITestabilityService) => {
                      const originalWhenStable: Function = testabilityDelegate.whenStable;
                      const injector = this.injector;
                      // Cannot use arrow function below because we need the context
                      const newWhenStable = function(callback: Function) {
                        originalWhenStable.call(testabilityDelegate, function() {
                          const ng2Testability: Testability = injector.get(Testability);
                          if (ng2Testability.isStable()) {
                            callback();
                          } else {
                            ng2Testability.whenStable(
                                newWhenStable.bind(testabilityDelegate, callback));
                          }
                        });
                      };

                      testabilityDelegate.whenStable = newWhenStable;
                      return testabilityDelegate;
                    }
                  ]);
                }

                if ($injector.has($INTERVAL)) {
                  $provide.decorator($INTERVAL, [
                    $DELEGATE,
                    (intervalDelegate: IIntervalService) => {
                      // Wrap the $interval service so that setInterval is called outside NgZone,
                      // but the callback is still invoked within it. This is so that $interval
                      // won't block stability, which preserves the behavior from AngularJS.
                      let wrappedInterval =
                          (fn: Function, delay: number, count?: number, invokeApply?: boolean,
                           ...pass: any[]) => {
                            return this.ngZone.runOutsideAngular(() => {
                              return intervalDelegate((...args: any[]) => {
                                // Run callback in the next VM turn - $interval calls
                                // $rootScope.$apply, and running the callback in NgZone will
                                // cause a '$digest already in progress' error if it's in the
                                // same vm turn.
                                setTimeout(() => {
                                  this.ngZone.run(() => fn(...args));
                                });
                              }, delay, count, invokeApply, ...pass);
                            });
                          };

                      (wrappedInterval as any)['cancel'] = intervalDelegate.cancel;
                      return wrappedInterval;
                    }
                  ]);
                }
              }
            ])

            .run([
              $INJECTOR,
              ($injector: IInjectorService) => {
                this.$injector = $injector;

                // Initialize the ng1 $injector provider
                setTempInjectorRef($injector);
                this.injector.get($INJECTOR);

                // Put the injector on the DOM, so that it can be "required"
                angularElement(element).data!(controllerKey(INJECTOR_KEY), this.injector);

                // Wire up the ng1 rootScope to run a digest cycle whenever the zone settles
                // We need to do this in the next tick so that we don't prevent the bootup
                // stabilizing
                setTimeout(() => {
                  const $rootScope = $injector.get('$rootScope');
                  const subscription = this.ngZone.onMicrotaskEmpty.subscribe(() => {
                    if ($rootScope.$$phase) {
                      if (isDevMode()) {
                        console.warn(
                            'A digest was triggered while one was already in progress. This may mean that something is triggering digests outside the Angular zone.');
                      }

                      return $rootScope.$evalAsync();
                    }

                    return $rootScope.$digest();
                  });
                  $rootScope.$on('$destroy', () => {
                    subscription.unsubscribe();
                  });
                }, 0);
              }
            ]);

    const upgradeModule = angularModule(UPGRADE_MODULE_NAME, [INIT_MODULE_NAME].concat(modules));

    // Make sure resumeBootstrap() only exists if the current bootstrap is deferred
    const windowAngular = (window as any)['angular'];
    windowAngular.resumeBootstrap = undefined;

    // Bootstrap the AngularJS application inside our zone
    this.ngZone.run(() => {
      bootstrap(element, [upgradeModule.name], config);
    });

    // Patch resumeBootstrap() to run inside the ngZone
    if (windowAngular.resumeBootstrap) {
      const originalResumeBootstrap: () => void = windowAngular.resumeBootstrap;
      const ngZone = this.ngZone;
      windowAngular.resumeBootstrap = function() {
        let args = arguments;
        windowAngular.resumeBootstrap = originalResumeBootstrap;
        return ngZone.run(() => windowAngular.resumeBootstrap.apply(this, args));
      };
    }
  }
}
