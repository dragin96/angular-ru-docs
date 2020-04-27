/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @publicApi
 */
export type Glob = string;

/**
 * @publicApi
 */
export type Duration = string;

/**
 * Объект конфигурации Angular Service Worker верхнего уровня.
 *
 * @publicApi
 */
export interface Config {
  appData?: {};
  index: string;
  assetGroups?: AssetGroup[];
  dataGroups?: DataGroup[];
  navigationUrls?: string[];
}

/**
 * Конфигурация для определенной группы активов.
 *
 * @publicApi
 */
export interface AssetGroup {
  name: string;
  installMode?: 'prefetch'|'lazy';
  updateMode?: 'prefetch'|'lazy';
  resources: {files?: Glob[]; urls?: Glob[];};
}

/**
 * Конфигурация для определенной группы динамических URL.
 *
 * @publicApi
 */
export interface DataGroup {
  name: string;
  urls: Glob[];
  version?: number;
  cacheConfig: {
    maxSize: number; maxAge: Duration;
    timeout?: Duration;
    strategy?: 'freshness' | 'performance';
  };
}
