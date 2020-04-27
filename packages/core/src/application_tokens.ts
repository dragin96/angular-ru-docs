/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from './di';
import {ComponentRef} from './linker/component_factory';


/**
 * Токен DI, представляющий уникальный строковый идентификатор, назначенный приложению Angular и использованный
 * прежде всего для префикса атрибутов приложения и стилей CSS, когда
 *  {@link ViewEncapsulation#Emulated ViewEncapsulation.Emulated}используется.
 *
 * Если вам необходимо избежать использования случайно сгенерированного значения в качестве идентификатора приложения, вы можете указать его
 * пользовательское значение через провайдера DI<!-- TODO: provider -->настройка рута{@link Injector}
 * используя этот токен.
 * @publicApi
 */
export const APP_ID = new InjectionToken<string>('AppId');

export function _appIdRandomProviderFactory() {
  return `${_randomChar()}${_randomChar()}${_randomChar()}`;
}

/**
 * Поставщики, которые будут генерировать случайные APP_ID_TOKEN.
 * @publicApi
 */
export const APP_ID_RANDOM_PROVIDER = {
  provide: APP_ID,
  useFactory: _appIdRandomProviderFactory,
  deps: <any[]>[],
};

function _randomChar(): string {
  return String.fromCharCode(97 + Math.floor(Math.random() * 25));
}

/**
 * Функция, которая будет выполняться при инициализации платформы.
 * @publicApi
 */
export const PLATFORM_INITIALIZER = new InjectionToken<Array<() => void>>('Platform Initializer');

/**
 * Токен, который указывает на непрозрачный идентификатор платформы.
 * @publicApi
 */
export const PLATFORM_ID = new InjectionToken<Object>('Platform ID');

/**
 * Все обратные вызовы, предоставляемые через этот токен, будут вызываться для каждого загружаемого компонента.
 * Подпись обратноговызова:.
 *
 *  `(componentRef: ComponentRef) => void`.
 *
 * @publicApi
 */
export const APP_BOOTSTRAP_LISTENER =
    new InjectionToken<Array<(compRef: ComponentRef<any>) => void>>('appBootstrapListener');

/**
 * Токен, указывающий корневой каталог приложения
 * @publicApi
 */
export const PACKAGE_ROOT_URL = new InjectionToken<string>('Application Packages Root URL');
