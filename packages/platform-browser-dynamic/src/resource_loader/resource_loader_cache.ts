/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ResourceLoader} from '@angular/compiler';
import {ɵglobal as global} from '@angular/core';

/**
 * Реализация ResourceLoader, которая использует кэш шаблона, чтобы избежать фактического
 * ResourceLoader.
 *
 * Кэш шаблона должен быть собран и загружен в окно. $ TemplateCache
 * через отдельный механизм.
 *
 * @publicApi
 */
export class CachedResourceLoader extends ResourceLoader {
  private _cache: {[url: string]: string};

  constructor() {
    super();
    this._cache = (<any>global).$templateCache;
    if (this._cache == null) {
      throw new Error('CachedResourceLoader: Template cache was not found in $templateCache.');
    }
  }

  get(url: string): Promise<string> {
    if (this._cache.hasOwnProperty(url)) {
      return Promise.resolve(this._cache[url]);
    } else {
      return <Promise<any>>Promise.reject(
          'CachedResourceLoader: Did not find cached template for ' + url);
    }
  }
}
