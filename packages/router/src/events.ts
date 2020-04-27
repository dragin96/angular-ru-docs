/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Route} from './config';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from './router_state';

/**
 * Определяет вызов или событие, которое вызвало навигацию.
 *
 * 'обязательно': запускается с помощью `router.navigateByUrl()` или `router.navigate()`.
 * 'popstate': `popstate` событием.
 * 'hashchange': `hashchange` событием.
 *
 * @publicApi
 */
export type NavigationTrigger = 'imperative'|'popstate'|'hashchange';

/**
 * База для событий, через которые проходит маршрутизатор, в отличие от событий, привязанных к конкретному
 * маршрут. Запускается один раз за любую навигацию.
 *
 *  @usageNotes
 *
 *  ```ts
 *  class MyService {
 *    constructor(public router: Router, logger: Logger) {
 *      router.events.pipe(
 *        filter(e => e instanceof RouterEvent)
 *      ).subscribe(e => {
 *        logger.log(e.id, e.url);
 *      });
 *    }
 *  }
 *  ```
 *
 *  @see `Event`
 * @publicApi
 */
export class RouterEvent {
  constructor(
      /** A unique ID that the router assigns to every router navigation. */
      public id: number,
      /** The URL that is the destination for this navigation. */
      public url: string) {}
}

/**
 * Событие, запускаемое при запуске навигации.
 *
 * @publicApi
 */
export class NavigationStart extends RouterEvent {
  /**
   * Identifies the call or event that triggered the navigation.
   * An `imperative` trigger is a call to `router.navigateByUrl()` or `router.navigate()`.
   *
   */
  navigationTrigger?: 'imperative'|'popstate'|'hashchange';

  /**
   * The navigation state that was previously supplied to the `pushState` call,
   * when the navigation is triggered by a `popstate` event. Otherwise null.
   *
   * The state object is defined by `NavigationExtras`, and contains any
   * developer-defined state value, as well as a unique ID that
   * the router assigns to every router transition/navigation.
   *
   * From the perspective of the router, the router never "goes back".
   * When the user clicks on the back button in the browser,
   * a new navigation ID is created.
   *
   * Use the ID in this previous-state object to differentiate between a newly created
   * state and one returned to by a `popstate` event, so that you can restore some
   * remembered state, such as scroll position.
   *
   */
  restoredState?: {[k: string]: any, navigationId: number}|null;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      navigationTrigger: 'imperative'|'popstate'|'hashchange' = 'imperative',
      /** @docsNotRequired */
      restoredState: {[k: string]: any, navigationId: number}|null = null) {
    super(id, url);
    this.navigationTrigger = navigationTrigger;
    this.restoredState = restoredState;
  }

  /** @docsNotRequired */
  toString(): string {
    return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
  }
}

/**
 * Событие срабатывает, когда навигация завершается успешно.
 *
 * @publicApi
 */
export class NavigationEnd extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string) {
    super(id, url);
  }

  /** @docsNotRequired */
  toString(): string {
    return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}')`;
  }
}

/**
 * Событие, вызванное отменой навигации, прямо или косвенно.
 *
 * Это может произойти, когда[маршрутная охрана](guide/router#milestone-5-route-guards)
 * возвращает `false` или инициирует перенаправление, возвращая `UrlTree`.
 *
 * @publicApi
 */
export class NavigationCancel extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public reason: string) {
    super(id, url);
  }

  /** @docsNotRequired */
  toString(): string {
    return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
  }
}

/**
 * Событие, вызванное ошибкой навигации из-за непредвиденной ошибки.
 *
 * @publicApi
 */
export class NavigationError extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public error: any) {
    super(id, url);
  }

  /** @docsNotRequired */
  toString(): string {
    return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
  }
}

/**
 * Событие срабатывает при распознавании маршрутов.
 *
 * @publicApi
 */
export class RoutesRecognized extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  /** @docsNotRequired */
  toString(): string {
    return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * Событие, инициированное в начале фазы защиты маршрутизации.
 *
 * @publicApi
 */
export class GuardsCheckStart extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  toString(): string {
    return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * Событие сработало в конце фазы маршрутизации Guard.
 *
 * @publicApi
 */
export class GuardsCheckEnd extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot,
      /** @docsNotRequired */
      public shouldActivate: boolean) {
    super(id, url);
  }

  toString(): string {
    return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
  }
}

/**
 * Событие, инициированное в начале фазы разрешения маршрутизации.
 *
 * Запускается в фазе «разрешения» независимо от того, есть ли что-либо для разрешения.
 * В будущем может измениться только на запуск, когда есть вещи, которые необходимо решить.
 *
 * @publicApi
 */
export class ResolveStart extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  toString(): string {
    return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * Событие, инициированное в конце фазы разрешения маршрутизации.
 *  @see `ResolveStart`.
 *
 * @publicApi
 */
export class ResolveEnd extends RouterEvent {
  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  toString(): string {
    return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * Событие сработало перед ленивой загрузкой конфигурации маршрута.
 *
 * @publicApi
 */
export class RouteConfigLoadStart {
  constructor(
      /** @docsNotRequired */
      public route: Route) {}
  toString(): string {
    return `RouteConfigLoadStart(path: ${this.route.path})`;
  }
}

/**
 * Событие срабатывает, когда маршрут загружен с отложенным доступом.
 *
 * @publicApi
 */
export class RouteConfigLoadEnd {
  constructor(
      /** @docsNotRequired */
      public route: Route) {}
  toString(): string {
    return `RouteConfigLoadEnd(path: ${this.route.path})`;
  }
}

/**
 * Событие, инициированное в начале дочерней активации
 * часть решающей фазы маршрутизации.
 *  @see`ChildActivationEnd`
 *  @see `ResolveStart`
 *
 * @publicApi
 */
export class ChildActivationStart {
  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ChildActivationStart(path: '${path}')`;
  }
}

/**
 * Событие, вызванное в конце части активации ребенка
 * Разрешить фазу маршрутизации.
 *  @see `ChildActivationStart`
 *  @see `ResolveStart`
 * @publicApi
 */
export class ChildActivationEnd {
  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ChildActivationEnd(path: '${path}')`;
  }
}

/**
 * Событие, инициированное в начале активационной части
 * Разрешить фазу маршрутизации.
 *  @see ActivationEnd`.@see `ResolveStart`
 *
 * @publicApi
 */
export class ActivationStart {
  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ActivationStart(path: '${path}')`;
  }
}

/**
 * Событие, вызванное в конце части активации
 * Разрешить фазу маршрутизации.
 *  @see `ActivationStart`
 *  @see `ResolveStart`
 *
 * @publicApi
 */
export class ActivationEnd {
  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ActivationEnd(path: '${path}')`;
  }
}

/**
 * Событие, вызванное прокруткой.
 *
 * @publicApi
 */
export class Scroll {
  constructor(
      /** @docsNotRequired */
      readonly routerEvent: NavigationEnd,

      /** @docsNotRequired */
      readonly position: [number, number]|null,

      /** @docsNotRequired */
      readonly anchor: string|null) {}

  toString(): string {
    const pos = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
    return `Scroll(anchor: '${this.anchor}', position: '${pos}')`;
  }
}

/**
 * События маршрутизатора, которые позволяют отслеживать жизненный цикл маршрутизатора.
 *
 * Последовательность событий маршрутизатора следующая
 *
 * - `NavigationStart` NavigationStart,.
 * - `RouteConfigLoadStart` RouteConfigLoadStart,.
 * - `RouteConfigLoadEnd` RouteConfigLoadEnd,.
 * - `RoutesRecognized` RoutesRecognized,.
 * - `GuardsCheckStart` GuardsCheckStart,.
 * - `ChildActivationStart` ChildActivationStart,.
 * - `ActivationStart` ActivationStart,.
 * - `GuardsCheckEnd` GuardsCheckEnd,.
 * - `ResolveStart` ResolveStart,.
 * - `ResolveEnd` ResolveEnd,.
 * - `ActivationEnd`
 * - `ChildActivationEnd`
 * - `NavigationEnd` NavigationEnd,.
 * - `NavigationCancel` NavigationCancel,.
 * - `NavigationError`
 * - `Scroll`
 *
 * @publicApi
 */
export type Event = RouterEvent|RouteConfigLoadStart|RouteConfigLoadEnd|ChildActivationStart|
    ChildActivationEnd|ActivationStart|ActivationEnd|Scroll;
