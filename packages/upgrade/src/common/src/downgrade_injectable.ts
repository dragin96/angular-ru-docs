/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector} from '@angular/core';
import {IInjectorService} from './angular1';
import {$INJECTOR, INJECTOR_KEY} from './constants';
import {getTypeName, isFunction, validateInjectionKey} from './util';

/**
 *  @description
 *
 * Вспомогательная функция, позволяющая сервису Angular быть доступным из AngularJS.
 *
 * Часть[апгрейд / статика](api?query=upgrade%2Fstatic)
 * библиотека для гибридных приложений обновления, которые поддерживают компиляцию AOT
 *
 * Эта вспомогательная функция возвращает заводскую функцию, которая обеспечивает доступ к Angular
 * сервис, определенный `token` параметром.
 *
 *  @usageNotes
 *  ### Примеры
 *
 * Сначала убедитесь, что сервис, который должен быть понижен, предоставляется в `NgModule`
 * это будет частью приложения обновления. Например, давайте предположим, что у нас есть
 * определено `HeroesService`
 *
 *  {@example upgrade/static/ts/full/module.ts region="ng2-heroes-service"}
 *
 * и что мы включили это в наше приложение для обновления `NgModule`
 *
 *  {@example upgrade/static/ts/full/module.ts region="ng2-module"}
 *
 * Теперь мы можем зарегистрировать `downgradeInjectable` фабричную функциюдля сервиса
 * на модуле AngularJS.
 *
 *  {@example upgrade/static/ts/full/module.ts region="downgrade-ng2-heroes-service"}
 *
 * Внутри контроллера компонента AngularJS мы можем получить
 * Пониженное обслуживание через имя, которое мы дали при понижении.
 *
 *  {@example upgrade/static/ts/full/module.ts region="example-app"}
 *
 *  <div class="alert is-important">
 *
 * При использовании `downgradeModule()` , понизившиеся инъекции не будут доступны до Angular
 * Модуль, который предоставляет их, создается. Для того, чтобы быть в безопасности, вы должны убедиться, что
 * Пониженные инъекционные препараты нигде не используются в той части приложения, где они находятся
 * гарантировано, что их модуль был создан.
 *
 * Например, _OK_ использовать устаревшую службу в обновленном компоненте, который используется только
 * от пониженного Angular компонента, предоставленного тем же Angular модулем, что и инъекционный, но
 * _не разрешено_ использовать его в компоненте AngularJS, который может использоваться независимо от Angular или
 * используйте его в устаревшем компоненте Angular из другого модуля.
 *
 *  </div>
 *
 *  @param токен `InjectionToken` который идентифицирует сервис, предоставляемый из Angular.
 *  @param downgradedModule имя пониженного качества модуля (если есть), который нужно ввести
 * «принадлежит», как возвращено вызовом `downgradeModule()` . Это модуль, инжектор которого будет
 * быть использованы для создания экземпляров инъекционных.<br />
 * (Эта опция необходима только при использовании `downgradeModule()` для понижения более чем одного Angular
 * модуль.)
 *
 *  @returns а[(заводская функция)](https://docs.angularjs.org/guide/di)которая можетбыть.
 * используется для регистрации службы в модуле AngularJS.
 *
 * @publicApi
 */
export function downgradeInjectable(token: any, downgradedModule: string = ''): Function {
  const factory = function($injector: IInjectorService) {
    const injectorKey = `${INJECTOR_KEY}${downgradedModule}`;
    const injectableName = isFunction(token) ? getTypeName(token) : String(token);
    const attemptedAction = `instantiating injectable '${injectableName}'`;

    validateInjectionKey($injector, downgradedModule, injectorKey, attemptedAction);

    const injector: Injector = $injector.get(injectorKey);
    return injector.get(token);
  };
  (factory as any)['$inject'] = [$INJECTOR];

  return factory;
}
