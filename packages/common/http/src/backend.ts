/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Observable} from 'rxjs';
import {HttpRequest} from './request';
import {HttpEvent} from './response';

/**
 * Преобразует `HttpRequest` в поток `HttpEvent` , один из которых, вероятно, будет
 *  `HttpResponse`.
 *
 *  `HttpHandler`инъекций. При внедрении экземпляр обработчика отправляет запросы в
 * первый перехватчик в цепи, который отправляет на второй и т. д., в конечном итоге достигнув
 *  `HttpBackend`.
 *
 * В одном `HttpInterceptor` HttpInterceptor, то `HttpHandler` параметром является следующим перехватчиком в цепи.
 *
 * @publicApi
 */
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}

/**
 * Финальный `HttpHandler` который отправит запрос через HTTP-API браузера в бэкэнд.
 *
 * Перехватчики находятся между `HttpClient` интерфейсоми `HttpBackend`.
 *
 * При `HttpBackend` отправляет запросы напрямую в бэкэнд, не идя
 * через цепочку перехватчиков.
 *
 * @publicApi
 */
export abstract class HttpBackend implements HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
