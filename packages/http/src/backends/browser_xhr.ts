/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable} from '@angular/core';

/**
 * Бекенд для HTTPкоторый использует `XMLHttpRequest` браузера API.
 *
 * Старайтесь не оценивать это в не браузерных контекстах.
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
@Injectable()
export class BrowserXhr {
  constructor() {}
  build(): any {
    return <any>(new XMLHttpRequest());
  }
}
