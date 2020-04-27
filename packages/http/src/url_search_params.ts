/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

function paramParser(rawParams: string = ''): Map<string, string[]> {
  const map = new Map<string, string[]>();
  if (rawParams.length > 0) {
    const params: string[] = rawParams.split('&');
    params.forEach((param: string) => {
      const eqIdx = param.indexOf('=');
      const [key, val]: string[] =
          eqIdx == -1 ? [param, ''] : [param.slice(0, eqIdx), param.slice(eqIdx + 1)];
      const list = map.get(key) || [];
      list.push(val);
      map.set(key, list);
    });
  }
  return map;
}
/**
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 **/
export class QueryEncoder {
  encodeKey(key: string): string {
    return standardEncoding(key);
  }

  encodeValue(value: string): string {
    return standardEncoding(value);
  }
}

function standardEncoding(v: string): string {
  return encodeURIComponent(v)
      .replace(/%40/gi, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/gi, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%2B/gi, '+')
      .replace(/%3D/gi, '=')
      .replace(/%3F/gi, '?')
      .replace(/%2F/gi, '/');
}

/**
 * Картографическое представление параметров поиска URL, основанных на
 *  [URLSearchParams](https://url.spec.whatwg.org/#urlsearchparams)в URL уровня жизни
 * с несколькими расширениями для объединения URLSearchParamsобъектов:.
 * - setAll ()
 * - appendAll ()
 * - заменить все ()
 *
 * Этот класс принимает необязательный второй параметр ${@link QueryEncoder},.
 * который используется для сериализации параметров перед выполнением запроса. Поумолчанию.
 *  `QueryEncoder`кодирует ключи и значения параметровпомощью `encodeURIComponent` encodeURIComponent,.
 * а затем расшифровывает определенные символы, которые могут быть частью запроса
 * в соответствии с IETF RFC 3986: https://tools.ietf.org/html/rfc3986.
 *
 * Это символы, которые не закодированы:`! $ \' ( ) + , ; A 9 - . _ ~ ? /`
 *
 * Если набор допустимых символов запроса не является приемлемым для конкретного внутреннегоинтерфейса,.
 *  `QueryEncoder`может бытьподклассы и предоставлен как 2-й аргумент для URLSearchParams.
 *
 *  ```
 *  import {URLSearchParams, QueryEncoder} from '@angular/http';
 *  class MyQueryEncoder extends QueryEncoder {
 *    encodeKey(k: string): string {
 *      return myEncodingFunction(k);
 *    }
 *
 *    encodeValue(v: string): string {
 *      return myEncodingFunction(v);
 *    }
 *  }
 *
 *  let params = new URLSearchParams('', new MyQueryEncoder());
 *  ```
 *  @deprecated см. https://angular.io/guide/http
 * @publicApi
 */
export class URLSearchParams {
  paramsMap: Map<string, string[]>;
  constructor(
      public rawParams: string = '', private queryEncoder: QueryEncoder = new QueryEncoder()) {
    this.paramsMap = paramParser(rawParams);
  }

  clone(): URLSearchParams {
    const clone = new URLSearchParams('', this.queryEncoder);
    clone.appendAll(this);
    return clone;
  }

  has(param: string): boolean {
    return this.paramsMap.has(param);
  }

  get(param: string): string|null {
    const storedParam = this.paramsMap.get(param);

    return Array.isArray(storedParam) ? storedParam[0] : null;
  }

  getAll(param: string): string[] {
    return this.paramsMap.get(param) || [];
  }

  set(param: string, val: string) {
    if (val === void 0 || val === null) {
      this.delete(param);
      return;
    }
    const list = this.paramsMap.get(param) || [];
    list.length = 0;
    list.push(val);
    this.paramsMap.set(param, list);
  }

  // A merge operation
  // For each name-values pair in `searchParams`, perform `set(name, values[0])`
  //
  // E.g: "a=[1,2,3], c=[8]" + "a=[4,5,6], b=[7]" = "a=[4], c=[8], b=[7]"
  //
  // TODO(@caitp): document this better
  setAll(searchParams: URLSearchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      list.length = 0;
      list.push(value[0]);
      this.paramsMap.set(param, list);
    });
  }

  append(param: string, val: string): void {
    if (val === void 0 || val === null) return;
    const list = this.paramsMap.get(param) || [];
    list.push(val);
    this.paramsMap.set(param, list);
  }

  // A merge operation
  // For each name-values pair in `searchParams`, perform `append(name, value)`
  // for each value in `values`.
  //
  // E.g: "a=[1,2], c=[8]" + "a=[3,4], b=[7]" = "a=[1,2,3,4], c=[8], b=[7]"
  //
  // TODO(@caitp): document this better
  appendAll(searchParams: URLSearchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      for (let i = 0; i < value.length; ++i) {
        list.push(value[i]);
      }
      this.paramsMap.set(param, list);
    });
  }


  // A merge operation
  // For each name-values pair in `searchParams`, perform `delete(name)`,
  // followed by `set(name, values)`
  //
  // E.g: "a=[1,2,3], c=[8]" + "a=[4,5,6], b=[7]" = "a=[4,5,6], c=[8], b=[7]"
  //
  // TODO(@caitp): document this better
  replaceAll(searchParams: URLSearchParams) {
    searchParams.paramsMap.forEach((value, param) => {
      const list = this.paramsMap.get(param) || [];
      list.length = 0;
      for (let i = 0; i < value.length; ++i) {
        list.push(value[i]);
      }
      this.paramsMap.set(param, list);
    });
  }

  toString(): string {
    const paramsList: string[] = [];
    this.paramsMap.forEach((values, k) => {
      values.forEach(
          v => paramsList.push(
              this.queryEncoder.encodeKey(k) + '=' + this.queryEncoder.encodeValue(v)));
    });
    return paramsList.join('&');
  }

  delete(param: string): void {
    this.paramsMap.delete(param);
  }
}
