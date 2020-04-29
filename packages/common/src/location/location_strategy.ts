/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, InjectionToken, Optional, ɵɵinject} from '@angular/core';
import {DOCUMENT} from '../dom_tokens';
import {LocationChangeListener, PlatformLocation} from './platform_location';
import {joinWithSlash, normalizeQueryParams} from './util';

/**
 * Включает `Location` сервис для чтения состояния маршрута из URL браузера.
 * Angular обеспечивает двестратегии:.
 *  `HashLocationStrategy `и` PathLocationStrategy`PathLocationStrategy.
 *
 * Приложения должны использовать `Router` или `Location` услугив.
 * взаимодействовать с состоянием маршрута приложения.
 *
 * Например, `HashLocationStrategy` создает URL-адреса как
 *  <code class="no-auto-link">http://example.com#/foo</code>,.
 * и `PathLocationStrategy` производит.
 *  <code class="no-auto-link">http://example.com/foo</code>как эквивалентный URL.
 *
 * Смотрите эти два класса для более.
 *
 * @publicApi
 */
@Injectable({providedIn: 'root', useFactory: provideLocationStrategy})
export abstract class LocationStrategy {
  abstract path(includeHash?: boolean): string;
  abstract prepareExternalUrl(internal: string): string;
  abstract pushState(state: any, title: string, url: string, queryParams: string): void;
  abstract replaceState(state: any, title: string, url: string, queryParams: string): void;
  abstract forward(): void;
  abstract back(): void;
  abstract onPopState(fn: LocationChangeListener): void;
  abstract getBaseHref(): string;
}

export function provideLocationStrategy(platformLocation: PlatformLocation) {
  // See #23917
  const location = ɵɵinject(DOCUMENT).location;
  return new PathLocationStrategy(
      ɵɵinject(PlatformLocation as any), location && location.origin || '');
}


/**
 * Предопределенный[токен DI](guide/glossary#di-token)для базового href
 * для использования с `PathLocationStrategy`.
 * Базовый href - это префикс URL, который должен быть сохранен при генерации
 * и распознавание URL.
 *
 *  @usageNotes
 *
 * В следующем примере показано, как использовать этот токен для настройки инжектора корневого приложения
 * с базовым значением href, чтобы структура DI могла предоставлять зависимости в любом месте приложения.
 *
 *  ```typescript
 *  import {Component, NgModule} from '@angular/core';
 *  import {APP_BASE_HREF} from '@angular/common';
 *
 *  @NgModule({
 *    providers: [{provide: APP_BASE_HREF, useValue: '/my/app'}]
 *  })
 *  class AppModule {}
 *  ```
 *
 * @publicApi
 */
export const APP_BASE_HREF = new InjectionToken<string>('appBaseHref');

/**
 *  @description
 *  A {@link LocationStrategy}используется для настройки {@link Location} Служба
 * представлять свое государство в
 *  [(Путь)](https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax)из.
 * URL браузера.
 *
 * Если вы используете `PathLocationStrategy` , вы должны предоставить{@link APP_BASE_HREF}
 * или добавьте базовый элемент в документ. Этот префикс URL, который будет сохранен
 * при создании и распознавании URL.
 *
 * Например, если вы предоставляете `APP_BASE_HREF` из `'/my/app'` ивызов.
 *  `location.go('/foo')`, URL браузера станет
 *  `example.com/my/app/foo`.
 *
 * Аналогично, если вы добавите в документ`<base href='/my/app'/>`и вызовите
 *  `location.go('/foo')`, URL браузера станет
 *  `example.com/my/app/foo`.
 *
 *  @usageNotes
 *
 *  ### Пример
 *
 *  {@example common/location/ts/path_location_component.ts region='LocationComponent'}
 *
 * @publicApi
 */
@Injectable()
export class PathLocationStrategy extends LocationStrategy {
  private _baseHref: string;

  constructor(
      private _platformLocation: PlatformLocation,
      @Optional() @Inject(APP_BASE_HREF) href?: string) {
    super();

    if (href == null) {
      href = this._platformLocation.getBaseHrefFromDOM();
    }

    if (href == null) {
      throw new Error(
          `No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.`);
    }

    this._baseHref = href;
  }

  onPopState(fn: LocationChangeListener): void {
    this._platformLocation.onPopState(fn);
    this._platformLocation.onHashChange(fn);
  }

  getBaseHref(): string {
    return this._baseHref;
  }

  prepareExternalUrl(internal: string): string {
    return joinWithSlash(this._baseHref, internal);
  }

  path(includeHash: boolean = false): string {
    const pathname =
        this._platformLocation.pathname + normalizeQueryParams(this._platformLocation.search);
    const hash = this._platformLocation.hash;
    return hash && includeHash ? `${pathname}${hash}` : pathname;
  }

  pushState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
    this._platformLocation.pushState(state, title, externalUrl);
  }

  replaceState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + normalizeQueryParams(queryParams));
    this._platformLocation.replaceState(state, title, externalUrl);
  }

  forward(): void {
    this._platformLocation.forward();
  }

  back(): void {
    this._platformLocation.back();
  }
}
