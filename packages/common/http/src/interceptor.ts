/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, InjectionToken} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpHandler} from './backend';
import {HttpRequest} from './request';
import {HttpEvent} from './response';

/**
 * Перехватывает и обрабатывает `HttpRequest` или `HttpResponse`.
 *
 * Большинство перехватчиков преобразуют исходящий запрос перед передачей его в
 * Следующий перехватчик в цепочке, вызывая `next.handle(transformedReq)`.
 * Перехватчик может преобразовать
 * поток ответных событий, также применяя дополнительные операторы RxJS к потоку
 * возвращается `next.handle()`.
 *
 * В более редких случаях перехватчик может полностью обработать запрос
 * иновый поток событий вместо вызова `next.handle()``next.handle()` .Это.
 * приемлемое поведение, но имейте в виду, что дальнейшие перехватчики будут полностью пропущены.
 *
 * Также редко, но допустимо, чтобы перехватчик возвращал множественные ответы на
 * поток событий для одного запроса.
 *
 * @publicApi
 *
 * @see [HTTP Guide](guide/http#intercepting-requests-and-responses)
 *
 * @usageNotes
 *
 * To use the same instance of `HttpInterceptors` for the entire app, import the `HttpClientModule`
 * only in your `AppModule`, and add the interceptors to the root application injector .
 * If you import `HttpClientModule` multiple times across different modules (for example, in lazy
 * loading modules), each import creates a new copy of the `HttpClientModule`, which overwrites the
 * interceptors provided in the root module.
 *
 */
export interface HttpInterceptor {
  /**
   * Identifies and handles a given HTTP request.
   * @param req The outgoing request object to handle.
   * @param next The next interceptor in the chain, or the backend
   * if no interceptors remain in the chain.
   * @returns An observable of the event stream.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

/**
 * `HttpHandler` which applies an `HttpInterceptor` to an `HttpRequest`.
 *
 *
 */
export class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.interceptor.intercept(req, this.next);
  }
}

/**
 * Токен мульти-провайдера, представляющий массив зарегистрированных
 *  `HttpInterceptor`объекты.
 *
 * @publicApi
 */
export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('HTTP_INTERCEPTORS');

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
