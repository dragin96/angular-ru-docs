/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, NgModule, Type} from '@angular/core';

import * as angular from '../../../src/common/src/angular1';
import {$INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY} from '../../../src/common/src/constants';
import {UpgradeAppType} from '../../../src/common/src/util';

let $injector: angular.IInjectorService|null = null;
let injector: Injector;

export function $injectorFactory() {
  return $injector;
}

@NgModule({providers: [{provide: $INJECTOR, useFactory: $injectorFactory}]})
export class AngularTestingModule {
  constructor(i: Injector) {
    injector = i;
  }
}

/**
 * Вспомогательная функция, используемая при модульном тестировании сервисов Angular, которые зависят от обновленного AngularJS
 * Сервисы.
 *
 * Эта функция возвращает `NgModule` оформленного классакоторый выполненвозможностью телеграфироватьAngular.
 * и инжекторы AngularJS без необходимости фактически загружать гибридное приложение.
 * Это упрощает и ускоряет юнит-тестирование сервисов.
 *
 * Используйте возвращаемый класс в качестве «импорта» при настройке `TestBed`.
 *
 * В следующем фрагменте кода мы настраиваем TestBed с двумя импортами.
 *  The `Ng2AppModule`Angular часть нашего гибридного приложения и `ng1AppModule` является.
 * AngularJS часть.
 *
 *  <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-setup"></code-example>
 *
 * Как только это будет сделано, мы сможем получить сервис через Angular `Injector` как обычно.
 * Службы, которые являются (или зависят от) обновленной службой AngularJS, будут созданы
 * по мере необходимости AngularJS `$injector`.
 *
 * В следующем фрагменте кода `HeroesService` - это служба Angular, которая зависит от
 * Служба AngularJS, `titleCase`.
 *
 *  <code-example path="upgrade/static/ts/full/module.spec.ts" region="angular-spec"></code-example>
 *
 *  <div class="alert is-important">
 *
 * Этот помощник предназначен для тестирования сервисов, а не компонентов.
 * Для тестирования компонентов вы все равно должны загрузить гибридное приложение. Смотрите `UpgradeModule` или
 *  `downgradeModule`для получения дополнительной информации.
 *
 *  </div>
 *
 *  <div class="alert is-important">
 *
 * Полученная конфигурация не связывает дайджесты AngularJS с хуками Zone. Это
 * ответственность автора теста за вызов `$rootScope.$apply` , если необходимо, триггер
 * AngularJS обработчики асинхронных событий из Angular.
 *
 *  </div>
 *
 *  <div class="alert is-important">
 *
 * Помощник устанавливает глобальные переменные для хранения общих инжекторов Angular и AngularJS.
 *
 * Вызывайте этого помощника только один раз за спецификацию.
 * Не используйте `createAngularTestingModule` в той же спецификации, что `createAngularJSTestingModule`.
 *
 *  </div>
 *
 * Вот пример приложения и его модульных тестов, которые используют `createAngularTestingModule`
 * и `createAngularJSTestingModule`.
 *
 *  <code-tabs>
 *   <code-pane header="module.spec.ts" path="upgrade/static/ts/full/module.spec.ts"></code-pane>
 *   <code-pane header="module.ts" path="upgrade/static/ts/full/module.ts"></code-pane>
 *  </code-tabs>
 *
 *
 *  @param angularJSМодулирует коллекцию имен модулей AngularJS для включения в
 * конфигурации.
 *  @param [strictDi] должен ли в инжекторе AngularJS быть `strictDI` включен.
 *
 * @publicApi
 */
export function createAngularTestingModule(
    angularJSModules: string[], strictDi?: boolean): Type<any> {
  angular.module_('$$angularJSTestingModule', angularJSModules)
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Static)
      .factory(INJECTOR_KEY, () => injector);
  $injector = angular.injector(['ng', '$$angularJSTestingModule'], strictDi);
  return AngularTestingModule;
}
