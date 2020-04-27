/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, InjectionToken, ɵɵinject} from '@angular/core';
import {getDOM} from '../dom_adapter';
import {DOCUMENT} from '../dom_tokens';

/**
 * Этот класс не должен использоваться непосредственно разработчиком приложения. Вместо этого используйте
 *  {@link Location},
 *
 *  `PlatformLocation`инкапсулирует все вызовы API DOM, что позволяет маршрутизатору быть платформой
 * агностик.
 * Это означает, что у нас может быть разная реализация `PlatformLocation` для разных
 * платформы, которые поддерживают Angular. Например, `@angular/platform-browser` предоставляет
 * реализация, специфичная для среды браузера, в то время как `@angular/platform-webworker` предоставляет
 * один подходит для использования с веб-работниками.
 *
 *  The `PlatformLocation`классиспользуется непосредственно всеми реализациями{@link LocationStrategy}
 * когда им нужно взаимодействовать с API-интерфейсом DOM, например pushState, popState и т
 *
 *  {@link LocationStrategy}в свою очередь используется{@link Location}сервис, который используется напрямую
 * посредством{@link Router}для того, чтобы перемещаться между маршрутами. Поскольку все взаимодействия между {@link
 * Router} /
 *  {@link Location}/{@link LocationStrategy}и DOM APIs потока через `PlatformLocation`
 * Все они независимы от платформы.
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'platform',
  // See #23917
  useFactory: useBrowserPlatformLocation
})
export abstract class PlatformLocation {
  abstract getBaseHrefFromDOM(): string;
  abstract getState(): unknown;
  abstract onPopState(fn: LocationChangeListener): void;
  abstract onHashChange(fn: LocationChangeListener): void;

  abstract get href(): string;
  abstract get protocol(): string;
  abstract get hostname(): string;
  abstract get port(): string;
  abstract get pathname(): string;
  abstract get search(): string;
  abstract get hash(): string;

  abstract replaceState(state: any, title: string, url: string): void;

  abstract pushState(state: any, title: string, url: string): void;

  abstract forward(): void;

  abstract back(): void;
}

export function useBrowserPlatformLocation() {
  return ɵɵinject(BrowserPlatformLocation);
}

/**
 * @description
 * Указывает, когда местоположение инициализируется.
 *
 * @publicApi
 */
export const LOCATION_INITIALIZED = new InjectionToken<Promise<any>>('Location Initialized');

/**
 * @description
 * Сериализуемая версия события из `onPopState` или `onHashChange`
 *
 * @publicApi
 */
export interface LocationChangeEvent {
  type: string;
  state: any;
}

/**
 * @publicApi
 */
export interface LocationChangeListener {
  (event: LocationChangeEvent): any;
}



/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 */
@Injectable({
  providedIn: 'platform',
  // See #23917
  useFactory: createBrowserPlatformLocation,
})
export class BrowserPlatformLocation extends PlatformLocation {
  public readonly location!: Location;
  private _history!: History;

  constructor(@Inject(DOCUMENT) private _doc: any) {
    super();
    this._init();
  }

  // This is moved to its own method so that `MockPlatformLocationStrategy` can overwrite it
  /** @internal */
  _init() {
    (this as {location: Location}).location = getDOM().getLocation();
    this._history = getDOM().getHistory();
  }

  getBaseHrefFromDOM(): string {
    return getDOM().getBaseHref(this._doc)!;
  }

  onPopState(fn: LocationChangeListener): void {
    getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('popstate', fn, false);
  }

  onHashChange(fn: LocationChangeListener): void {
    getDOM().getGlobalEventTarget(this._doc, 'window').addEventListener('hashchange', fn, false);
  }

  get href(): string {
    return this.location.href;
  }
  get protocol(): string {
    return this.location.protocol;
  }
  get hostname(): string {
    return this.location.hostname;
  }
  get port(): string {
    return this.location.port;
  }
  get pathname(): string {
    return this.location.pathname;
  }
  get search(): string {
    return this.location.search;
  }
  get hash(): string {
    return this.location.hash;
  }
  set pathname(newPath: string) {
    this.location.pathname = newPath;
  }

  pushState(state: any, title: string, url: string): void {
    if (supportsState()) {
      this._history.pushState(state, title, url);
    } else {
      this.location.hash = url;
    }
  }

  replaceState(state: any, title: string, url: string): void {
    if (supportsState()) {
      this._history.replaceState(state, title, url);
    } else {
      this.location.hash = url;
    }
  }

  forward(): void {
    this._history.forward();
  }

  back(): void {
    this._history.back();
  }

  getState(): unknown {
    return this._history.state;
  }
}

export function supportsState(): boolean {
  return !!window.history.pushState;
}
export function createBrowserPlatformLocation() {
  return new BrowserPlatformLocation(ɵɵinject(DOCUMENT));
}
