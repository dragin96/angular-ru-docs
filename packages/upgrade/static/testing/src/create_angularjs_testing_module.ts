/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '@angular/core';
import {TestBed} from '@angular/core/testing';

import * as ng from '../../../src/common/src/angular1';
import {$INJECTOR, INJECTOR_KEY, UPGRADE_APP_TYPE_KEY} from '../../../src/common/src/constants';
import {UpgradeAppType} from '../../../src/common/src/util';


/**
 * Вспомогательная функция, используемая при модульном тестировании сервисов AngularJS, которые зависят от версии Angular
 * Сервисы.
 *
 * Эта функция возвращает модуль AngularJS, который настроен для подключения AngularJS и Angular
 * инжекторы без необходимости фактически загружать гибридное приложение.
 * Это упрощает и ускоряет юнит-тестирование сервисов.
 *
 * Используйте возвращенный модуль AngularJS в вызове
 *  [ `angular.mocks.module` ](https://docs.angularjs.org/api/ngMock/function/angular.mock.module)для
 * включите этот модуль в инжектор модульного тестирования.
 *
 * В следующем фрагменте коды мы настраиваем `$injector` с двумямодулями:.
 * AngularJS `ng1AppModule` , который является частью AngularJS нашего гибридного приложения и
 *  `Ng2AppModule`, который является Angular частью.
 *
 *  <code-example path="upgrade/static/ts/full/module.spec.ts"
 *  region="angularjs-setup"></code-example>
 *
 * Как только это будет сделано, мы сможем получить сервисы через AngularJS `$injector` в обычном режиме.
 * Службы, которые являются (или зависят от) устаревшей службой Angular, будут созданы как
 * Нужен Angular корень `Injector`.
 *
 * В следующем фрагменте кода `heroesService``heroesService` - этоAngular, которым мы являемся
 * доступ из AngularJS.
 *
 *  <code-example path="upgrade/static/ts/full/module.spec.ts"
 *  region="angularjs-spec"></code-example>
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
 * Не используйте `createAngularJSTestingModule` в той же спецификации, что `createAngularTestingModule`.
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
 *  @param angularModules набор Angular модулей для включения в конфигурацию.
 *
 * @publicApi
 */
export function createAngularJSTestingModule(angularModules: any[]): string {
  return ng.module_('$$angularJSTestingModule', [])
      .constant(UPGRADE_APP_TYPE_KEY, UpgradeAppType.Static)
      .factory(
          INJECTOR_KEY,
          [
            $INJECTOR,
            ($injector: ng.IInjectorService) => {
              TestBed.configureTestingModule({
                imports: angularModules,
                providers: [{provide: $INJECTOR, useValue: $injector}]
              });
              return TestBed.inject(Injector);
            }
          ])
      .name;
}
