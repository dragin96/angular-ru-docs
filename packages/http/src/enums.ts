/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Поддерживаемые методы http.
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export enum RequestMethod {
  Get,
  Post,
  Put,
  Delete,
  Options,
  Head,
  Patch
}

/**
 * Все возможные состояния, в которых может быть соединение, основаны на
 *  [Состояния](http://www.w3.org/TR/XMLHttpRequest/#states)из `XMLHttpRequest` спецификации, но с
 * дополнительное состояние «ОТМЕНЕНО».
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export enum ReadyState {
  Unsent,
  Open,
  HeadersReceived,
  Loading,
  Done,
  Cancelled
}

/**
 * Приемлемые типы ответов, которые будут связаны с{@link Response}, основываясь на
 *  [ResponseType](https://fetch.spec.whatwg.org/#responsetype)из спецификации Fetch.
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export enum ResponseType {
  Basic,
  Cors,
  Default,
  Error,
  Opaque
}

/**
 * Supported content type to be automatically associated with a {@link Request}.
 * @deprecated see https://angular.io/guide/http
 */
export enum ContentType {
  NONE,
  JSON,
  FORM,
  FORM_DATA,
  TEXT,
  BLOB,
  ARRAY_BUFFER
}

/**
 * Определите, какой буфер использовать для хранения ответа
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export enum ResponseContentType {
  Text,
  Json,
  ArrayBuffer,
  Blob
}
