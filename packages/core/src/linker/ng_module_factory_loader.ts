/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModuleFactory as R3NgModuleFactory, NgModuleType} from '../render3/ng_module_ref';

import {NgModuleFactory} from './ng_module_factory';
import {getRegisteredNgModuleType} from './ng_module_factory_registration';


/**
 * Используется для загрузки заводских модулей.
 *
 * @publicApi
 * @deprecated the `string` form of `loadChildren` is deprecated, and `NgModuleFactoryLoader` is
 * part of its implementation. See `LoadChildren` for more details.
 */
export abstract class NgModuleFactoryLoader {
  abstract load(path: string): Promise<NgModuleFactory<any>>;
}

export function getModuleFactory__PRE_R3__(id: string): NgModuleFactory<any> {
  const factory = getRegisteredNgModuleType(id) as NgModuleFactory<any>| null;
  if (!factory) throw noModuleError(id);
  return factory;
}

export function getModuleFactory__POST_R3__(id: string): NgModuleFactory<any> {
  const type = getRegisteredNgModuleType(id) as NgModuleType | null;
  if (!type) throw noModuleError(id);
  return new R3NgModuleFactory(type);
}

/**
 * Возвращает NgModuleFactory с заданным идентификатором, если он существует и был загружен.
 * Фабрики для модулей, которые не указывают `id` не могут быть получены. Кидает, если модуль
 * не может быть найден.
 * @publicApi
 */
export const getModuleFactory: (id: string) => NgModuleFactory<any> = getModuleFactory__PRE_R3__;

function noModuleError(
    id: string,
    ): Error {
  return new Error(`No module with ID ${id} loaded`);
}
