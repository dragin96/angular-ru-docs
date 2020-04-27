/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injectable, Injector, ModuleWithProviders, NgModule} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpBackend, HttpHandler} from './backend';
import {HttpClient} from './client';
import {HTTP_INTERCEPTORS, HttpInterceptor, HttpInterceptorHandler, NoopInterceptor} from './interceptor';
import {JsonpCallbackContext, JsonpClientBackend, JsonpInterceptor} from './jsonp';
import {HttpRequest} from './request';
import {HttpEvent} from './response';
import {BrowserXhr, HttpXhrBackend, XhrFactory} from './xhr';
import {HttpXsrfCookieExtractor, HttpXsrfInterceptor, HttpXsrfTokenExtractor, XSRF_COOKIE_NAME, XSRF_HEADER_NAME} from './xsrf';

/**
 * An injectable `HttpHandler` that applies multiple interceptors
 * to a request before passing it to the given `HttpBackend`.
 *
 * The interceptors are loaded lazily from the injector, to allow
 * interceptors to themselves inject classes depending indirectly
 * on `HttpInterceptingHandler` itself.
 * @see `HttpInterceptor`
 */
@Injectable()
export class HttpInterceptingHandler implements HttpHandler {
  private chain: HttpHandler|null = null;

  constructor(private backend: HttpBackend, private injector: Injector) {}

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
      this.chain = interceptors.reduceRight(
          (next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.backend);
    }
    return this.chain.handle(req);
  }
}

/**
 * Constructs an `HttpHandler` that applies interceptors
 * to a request before passing it to the given `HttpBackend`.
 *
 * Use as a factory function within `HttpClientModule`.
 *
 *
 */
export function interceptingHandler(
    backend: HttpBackend, interceptors: HttpInterceptor[]|null = []): HttpHandler {
  if (!interceptors) {
    return backend;
  }
  return interceptors.reduceRight(
      (next, interceptor) => new HttpInterceptorHandler(next, interceptor), backend);
}

/**
 * Factory function that determines where to store JSONP callbacks.
 *
 * Ordinarily JSONP callbacks are stored on the `window` object, but this may not exist
 * in test environments. In that case, callbacks are stored on an anonymous object instead.
 *
 *
 */
export function jsonpCallbackContext(): Object {
  if (typeof window === 'object') {
    return window;
  }
  return {};
}

/**
 * Настраивает поддержку защиты XSRF для исходящих запросов.
 *
 * Для серверакоторый поддерживает кукиоснове системы защитыXSRF,.
 * используйте непосредственно для настройки защиты XSRF с правильным
 * имена файлов cookie и заголовков.
 *
 * Если имена не указаны, именем файла cookie по умолчанию является `XSRF-TOKEN`
 * и имя заголовка по умолчанию `X-XSRF-TOKEN`.
 *
 * @publicApi
 */
@NgModule({
  providers: [
    HttpXsrfInterceptor,
    {provide: HTTP_INTERCEPTORS, useExisting: HttpXsrfInterceptor, multi: true},
    {provide: HttpXsrfTokenExtractor, useClass: HttpXsrfCookieExtractor},
    {provide: XSRF_COOKIE_NAME, useValue: 'XSRF-TOKEN'},
    {provide: XSRF_HEADER_NAME, useValue: 'X-XSRF-TOKEN'},
  ],
})
export class HttpClientXsrfModule {
  /**
   * Disable the default XSRF protection.
   */
  static disable(): ModuleWithProviders<HttpClientXsrfModule> {
    return {
      ngModule: HttpClientXsrfModule,
      providers: [
        {provide: HttpXsrfInterceptor, useClass: NoopInterceptor},
      ],
    };
  }

  /**
   * Configure XSRF protection.
   * @param options An object that can specify either or both
   * cookie name or header name.
   * - Cookie name default is `XSRF-TOKEN`.
   * - Header name default is `X-XSRF-TOKEN`.
   *
   */
  static withOptions(options: {
    cookieName?: string,
    headerName?: string,
  } = {}): ModuleWithProviders<HttpClientXsrfModule> {
    return {
      ngModule: HttpClientXsrfModule,
      providers: [
        options.cookieName ? {provide: XSRF_COOKIE_NAME, useValue: options.cookieName} : [],
        options.headerName ? {provide: XSRF_HEADER_NAME, useValue: options.headerName} : [],
      ],
    };
  }
}

/**
 * Настраивает[инжектор зависимости](guide/glossary#injector)для `HttpClient`
 * с поддержкой услуг для XSRF. Автоматически импортируется `HttpClientModule`.
 *
 * Вы можете добавить перехватчики в цепочку за `HttpClient` их к
 * мультипровер для встроенного[DI токен](guide/glossary#di-token) `HTTP_INTERCEPTORS`.
 *
 * @publicApi
 */
@NgModule({
  /**
   * Optional configuration for XSRF protection.
   */
  imports: [
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
  ],
  /**
   * Configures the [dependency injector](guide/glossary#injector) where it is imported
   * with supporting services for HTTP communications.
   */
  providers: [
    HttpClient,
    {provide: HttpHandler, useClass: HttpInterceptingHandler},
    HttpXhrBackend,
    {provide: HttpBackend, useExisting: HttpXhrBackend},
    BrowserXhr,
    {provide: XhrFactory, useExisting: BrowserXhr},
  ],
})
export class HttpClientModule {
}

/**
 * Настраивает[инжектор зависимости](guide/glossary#injector)для `HttpClient`
 * с поддержкой услуг для JSONP.
 * Без этого модуля запросы Jsonp доходят до бэкэнда
 * с методом JSONP, где они отклонены.
 *
 * Вы можете добавить перехватчики в цепочку за `HttpClient` их к
 * мультипровер для встроенного[DI токен](guide/glossary#di-token) `HTTP_INTERCEPTORS`.
 *
 * @publicApi
 */
@NgModule({
  providers: [
    JsonpClientBackend,
    {provide: JsonpCallbackContext, useFactory: jsonpCallbackContext},
    {provide: HTTP_INTERCEPTORS, useClass: JsonpInterceptor, multi: true},
  ],
})
export class HttpClientJsonpModule {
}
