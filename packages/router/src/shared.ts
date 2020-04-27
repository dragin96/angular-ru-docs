/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Route, UrlMatchResult} from './config';
import {UrlSegment, UrlSegmentGroup} from './url_tree';


/**
 * Основной маршрутный выход.
 *
 * @publicApi
 */
export const PRIMARY_OUTLET = 'primary';

/**
 * Коллекция параметров матрицы и URL-адреса запроса.
 *  @see `convertToParamMap()`
 *  @see `ParamMap`
 *
 * @publicApi
 */
export type Params = {
  [key: string]: any;
};

/**
 * Карта, которая обеспечивает доступ к обязательным и необязательным параметрам
 * специфичные для маршрута.
 * Карта поддерживает получение одного значения с помощью `get()`
 * или несколько значений с помощью `getAll()`.
 *
 *  @see [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 *
 * @publicApi
 */
export interface ParamMap {
  /**
   * Reports whether the map contains a given parameter.
   * @param name The parameter name.
   * @returns True if the map contains the given parameter, false otherwise.
   */
  has(name: string): boolean;
  /**
   * Retrieves a single value for a parameter.
   * @param name The parameter name.
   * @return The parameter's single value,
   * or the first value if the parameter has multiple values,
   * or `null` when there is no such parameter.
   */
  get(name: string): string|null;
  /**
   * Retrieves multiple values for a parameter.
   * @param name The parameter name.
   * @return An array containing one or more values,
   * or an empty array if there is no such parameter.
   *
   */
  getAll(name: string): string[];

  /** Names of the parameters in the map. */
  readonly keys: string[];
}

class ParamsAsMap implements ParamMap {
  private params: Params;

  constructor(params: Params) {
    this.params = params || {};
  }

  has(name: string): boolean {
    return this.params.hasOwnProperty(name);
  }

  get(name: string): string|null {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v[0] : v;
    }

    return null;
  }

  getAll(name: string): string[] {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v : [v];
    }

    return [];
  }

  get keys(): string[] {
    return Object.keys(this.params);
  }
}

/**
 * Преобразует `Params` в `ParamMap`.
 *  @param params Экземпляр для преобразования.
 *  @returns Новый экземпляр карты.
 *
 * @publicApi
 */
export function convertToParamMap(params: Params): ParamMap {
  return new ParamsAsMap(params);
}

const NAVIGATION_CANCELING_ERROR = 'ngNavigationCancelingError';

export function navigationCancelingError(message: string) {
  const error = Error('NavigationCancelingError: ' + message);
  (error as any)[NAVIGATION_CANCELING_ERROR] = true;
  return error;
}

export function isNavigationCancelingError(error: Error) {
  return error && (error as any)[NAVIGATION_CANCELING_ERROR];
}

// Matches the route configuration (`route`) against the actual URL (`segments`).
export function defaultUrlMatcher(
    segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route): UrlMatchResult|null {
  const parts = route.path!.split('/');

  if (parts.length > segments.length) {
    // The actual URL is shorter than the config, no match
    return null;
  }

  if (route.pathMatch === 'full' &&
      (segmentGroup.hasChildren() || parts.length < segments.length)) {
    // The config is longer than the actual URL but we are looking for a full match, return null
    return null;
  }

  const posParams: {[key: string]: UrlSegment} = {};

  // Check each config part against the actual URL
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const segment = segments[index];
    const isParameter = part.startsWith(':');
    if (isParameter) {
      posParams[part.substring(1)] = segment;
    } else if (part !== segment.path) {
      // The actual URL part does not match the config, no match
      return null;
    }
  }

  return {consumed: segments.slice(0, parts.length), posParams};
}
