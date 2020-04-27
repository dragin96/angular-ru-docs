/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ReadyState, RequestMethod, ResponseContentType, ResponseType} from './enums';
import {Headers} from './headers';
import {Request} from './static_request';
import {URLSearchParams} from './url_search_params';

/**
 * Абстрактный класс, из которого происходят реальные бэкэнды.
 *
 * Основной целью `ConnectionBackend` является создание новых соединений для выполнения заданного
 *  {@link Request},
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export abstract class ConnectionBackend {
  abstract createConnection(request: any): Connection;
}

/**
 * Абстрактный класс, из которого происходят реальные связи.
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export abstract class Connection {
  // TODO(issue/24571): remove '!'.
  readyState!: ReadyState;
  // TODO(issue/24571): remove '!'.
  request!: Request;
  response: any;  // TODO: generic of <Response>;
}

/**
 * XSRFStrategy настраивает защиту XSRF (например, через заголовки) по HTTP-запросу.
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export abstract class XSRFStrategy {
  abstract configureRequest(req: Request): void;
}

/**
 * Интерфейс для параметров для создания RequestOptions, основанных на
 *  [RequestInit](https://fetch.spec.whatwg.org/#requestinit)из спецификации Fetch.
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export interface RequestOptionsArgs {
  url?: string|null;
  method?: string|RequestMethod|null;
  /** @deprecated from 4.0.0. Use params instead. */
  search?: string|URLSearchParams|{[key: string]: any | any[]}|null;
  params?: string|URLSearchParams|{[key: string]: any | any[]}|null;
  headers?: Headers|null;
  body?: any;
  withCredentials?: boolean|null;
  responseType?: ResponseContentType|null;
}

/**
 * Required structure when constructing new Request();
 */
export interface RequestArgs extends RequestOptionsArgs {
  url: string|null;
}

/**
 * Интерфейс для вариантов построения ответа на основе
 *  [ResponseInit](https://fetch.spec.whatwg.org/#responseinit)из спецификации Fetch.
 *
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export interface ResponseOptionsArgs {
  body?: string|Object|FormData|ArrayBuffer|Blob|null;
  status?: number|null;
  statusText?: string|null;
  headers?: Headers|null;
  type?: ResponseType|null;
  url?: string|null;
}
