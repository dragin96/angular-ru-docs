/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModuleFactory, NgModuleRef, Type} from '@angular/core';
import {Observable} from 'rxjs';

import {EmptyOutletComponent} from './components/empty_outlet';
import {ActivatedRouteSnapshot} from './router_state';
import {PRIMARY_OUTLET} from './shared';
import {UrlSegment, UrlSegmentGroup} from './url_tree';


/**
 * Представляет конфигурацию маршрута для службы Router.
 * Массив `Route` объектов, используемый `Router.config` и для вложенных конфигураций маршрутов
 * в `Route.children`.
 *
 *  @see `Route`
 *  @see `Router`
 * @publicApi
 */
export type Routes = Route[];

/**
 * Представляет результат сопоставления URL-адресов с пользовательской функцией сопоставления.
 *
 *  `consumed`является массивом потребленных сегментов URL.
 *  `posParams`- это карта позиционных параметров.
 *
 *  @see `UrlMatcher()`
 * @publicApi
 */
export type UrlMatchResult = {
  consumed: UrlSegment[];
  posParams?: {[name: string]: UrlSegment};
};

/**
 * Функция для сопоставления маршрута с URL. Реализуйте настраиваемое сопоставление URL
 * для `Route.matcher` когда комбинация` `path` и `pathMatch`
 * не достаточно выразителен. Не может быть использована вместе с `path` и `pathMatch` pathMatch.
 *
 *  @param сегменты Массив сегментов URL.
 *  @param группа А сегментная группа.
 *  @param route Маршрут, с которым нужно сравнивать.
 *  @returns Матч-результат.
 *
 *  @usageNotes
 *
 * Следующее сопоставление соответствует HTML-файлам.
 *
 *  ```
 *  export function htmlFiles(url: UrlSegment[]) {
 *    return url.length === 1 && url[0].path.endsWith('.html') ? ({consumed: url}) : null;
 *  }
 *
 *  export const routes = [{ matcher: htmlFiles, component: AnyComponent }];
 *  ```
 *
 * @publicApi
 */
export type UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) =>
    UrlMatchResult|null;

/**
 *
 * Представляет статические данные, связанные с конкретным маршрутом.
 *
 *  @see `Route#data`
 *
 * @publicApi
 */
export type Data = {
  [name: string]: any
};

/**
 *
 * Представляет разрешенные данные, связанные с конкретным маршрутом.
 *
 *  @see `Route#resolve`.
 *
 * @publicApi
 */
export type ResolveData = {
  [name: string]: any
};

/**
 *
 * Функция, которая вызывается для разрешения коллекции ленивых загруженных маршрутов.
 *
 * Часто эта функция будет реализована с использованием динамическогоES `import()` выражения.Например:.
 *
 *  ```
 *  [{
 *    path: 'lazy',
 *    loadChildren: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
 *  }];
 *  ```
 *
 * Эта функция должна соответствовать форме выше: функция стрелки формы
 *  `() => import('...').then(mod => mod.MODULE)`.
 *
 *  @see `Route#loadChildren`.
 * @publicApi
 */
export type LoadChildrenCallback = () => Type<any>|NgModuleFactory<any>|Observable<Type<any>>|
    Promise<NgModuleFactory<any>|Type<any>|any>;

/**
 *
 * Строка вида `path/to/file#exportName` который действует как URL для набора маршрутов кнагрузке,.
 * или функция, которая возвращает такой набор.
 *
 * Строка форма `LoadChildren` является устаревшим (см `DeprecatedLoadChildren` DeprecatedLoadChildren).Функция.
 * форму ( `LoadChildrenCallback``LoadChildrenCallback` следует использовать).
 *
 *  @see `Route#loadChildren`.
 * @publicApi
 */
export type LoadChildren = LoadChildrenCallback|DeprecatedLoadChildren;

/**
 * Строка вида `path/to/file#exportName` которая действует как URL для набора загружаемых маршрутов.
 *
 *  @see `Route#loadChildren`
 * @publicApi
 * @deprecated the `string` form of `loadChildren` is deprecated in favor of the proposed ES dynamic
 * `import()` expression, which offers a more natural and standards-based mechanism to dynamically
 * load an ES module at runtime.
 */
export type DeprecatedLoadChildren = string;

/**
 *
 * Как обрабатывать параметры запроса в ссылке на маршрутизатор.
 * Одиниз:.
 * - `merge` : объединить новые с текущими параметрами.
 * - `preserve` : сохранить текущие параметры.
 *
 *  @see `NavigationExtras#queryParamsHandling`
 *  @see `RouterLink`
 * @publicApi
 */
export type QueryParamsHandling = 'merge'|'preserve'|'';

/**
 *
 * Политика, когда нужно запускать охранников и распознаватели на маршруте.
 *
 *  @see `Route#runGuardsAndResolvers`
 * @publicApi
 */
export type RunGuardsAndResolvers =
    'pathParamsChange'|'pathParamsOrQueryParamsChange'|'paramsChange'|'paramsOrQueryParamsChange'|
    'always'|((from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot) => boolean);

/**
 * Объект конфигурации, который определяет один маршрут.
 * Набор маршрутов собраны в `Routes` массивачтобы определить `Router` конфигурацию маршрутизатора.
 * Маршрутизатор пытается сопоставить сегменты данного URL с каждым маршрутом
 * используя параметры конфигурации, определенные в этом объекте.
 *
 * Поддерживает статические, параметризованные, перенаправления и подстановочные маршруты, а также
 * пользовательские данные маршрута и методы разрешения.
 *
 * Для получения подробной информации об использовании см.[Руководство по маршрутизации](guide/router).
 *
 *  @usageNotes
 *
 *  ### Простая настройка
 *
 * Следующий маршрут указывает, что при навигации, например
 *  `/team/11/user/bob`, маршрутизатор создает компонент 'Team'
 * с дочерним компонентом «Пользователь» в нем.
 *
 *  ```
 *  [{
 *    path: 'team/:id',
 *   component: Team,
 *    children: [{
 *      path: 'user/:name',
 *      component: User
 *    }]
 *  }]
 *  ```
 *
 *  ### Несколько розеток
 *
 * Следующий маршрут создает компоненты одного уровня с несколькими выходами.
 * При переходе к `/team/11(aux:chat/jim)` маршрутизатор создает компонент 'Team' рядом с
 * компонент «Чат». Компонент «Чат» находится в розетке «aux».
 *
 *  ```
 *  [{
 *    path: 'team/:id',
 *    component: Team
 *  }, {
 *    path: 'chat/:user',
 *    component: Chat
 *    outlet: 'aux'
 *  }]
 *  ```
 *
 *  ### Wild Cards
 *
 * Следующий маршрут использует подстановочные знаки для указания компонента
 * это всегда создается независимо от того, куда вы переходите.
 *
 *  ```
 *  [{
 *    path: '',
 *    component: WildcardComponent
 *  }]
 *  ```
 *
 *  ### Перенаправляет
 *
 * Следующий маршрут использует `redirectTo` свойствоигнорироватьсегмент.
 * заданный URL при поиске дочернего пути.
 *
 * При переходе к «/ team / 11 / legacy / user / jim» маршрутизатор меняет сегмент URL
 * '/ team / 11 / legacy / user / jim' в '/ team / 11 / user / jim', а затем создает его
 * компонент Team с дочерним компонентом User.
 *
 *  ```
 *  [{
 *    path: 'team/:id',
 *    component: Team,
 *    children: [{
 *      path: 'legacy/user/:name',
 *      redirectTo: 'user/:name'
 *    }, {
 *      path: 'user/:name',
 *      component: User
 *    }]
 *  }]
 *  ```
 *
 * Путь перенаправления может быть относительным, как показано в этом примере, или абсолютным.
 * Если мы изменим значение `redirectTo` в примере на абсолютный сегмент URL '/ user /: name'
 * URL-адрес результата также является абсолютным, '/ user / jim'.
 *
 *  ### Пустой Путь
 *
 * Конфигурации маршрута с пустым путем могут использоваться для создания экземпляров компонентов, которые не «потребляют»
 * любые сегменты URL.
 *
 * В следующей конфигурации при переходе к
 *  `/team/11`, маршрутизатор создает компонент 'AllUsers'.
 *
 *  ```
 *  [{
 *    path: 'team/:id',
 *    component: Team,
 *    children: [{
 *      path: '',
 *      component: AllUsers
 *    }, {
 *      path: 'user/:name',
 *      component: User
 *    }]
 *  }]
 *  ```
 *
 * Маршруты с пустыми путями могут иметь детей. В следующем примере при навигации
 * в `/team/11/user/jim` маршрутизатор создает экземпляр обертки с помощью
 * пользовательский компонент в нем.
 *
 * Обратите внимание, что пустой путь маршрута наследует параметры и данные своего родителя.
 *
 *  ```
 *  [{
 *    path: 'team/:id',
 *    component: Team,
 *    children: [{
 *      path: '',
 *      component: WrapperCmp,
 *      children: [{
 *        path: 'user/:name',
 *        component: User
 *      }]
 *    }]
 *  }]
 *  ```
 *
 *  ### Соответствующая стратегия
 *
 * Стратегия сопоставления пути по умолчанию - «префикс», что означает, что маршрутизатор
 * проверяет элементы URL слева, чтобы увидеть, соответствует ли URL указанному пути.
 * Например, '/ team / 11 / user' соответствует 'team /: id'.
 *
 *  ```
 *  [{
 *    path: '',
 *    pathMatch: 'prefix', //default
 *    redirectTo: 'main'
 *  }, {
 *    path: 'main',
 *    component: Main
 *  }]
 *  ```
 *
 * Вы можете указать стратегию соответствия пути 'full', чтобы убедиться, что путь
 * охватывает весь неиспользованный URL. Это важно сделать при перенаправлении
 * маршруты с пустыми путями.противном случае, потому что пустой путь является префиксом любогоURL,.
 * маршрутизатор будет применять перенаправление даже при переходе к месту назначения перенаправления
 * создавая бесконечный цикл.
 *
 * В следующем примере, предоставление «полной» `pathMatch` стратегииобеспечивает
 * что маршрутизатор применяет перенаправление, если и только при переходе к '/'.
 *
 *  ```
 *  [{
 *    path: '',
 *    pathMatch: 'full',
 *    redirectTo: 'main'
 *  }, {
 *    path: 'main',
 *    component: Main
 *  }]
 *  ```
 *
 *  ### Бескомпонентные маршруты
 *
 * Вы можете поделиться параметрами между родственными компонентами.
 * Например, предположим, что два родственных компонента должны находиться рядом друг с другом
 * и оба они требуют параметра ID. Вы можете сделать это, используя маршрут
 * это не определяет компонент на верхнем уровне.
 *
 * В следующем примере «MainChild» и «AuxChild» являются братьями и сестрами.
 * При переходе к «parent / 10 / (a // aux: b)» маршрут создается
 * основные дочерние и вспомогательные дочерние компоненты рядом друг с другом.
 * Чтобы это работало, компонент приложения должен иметь основной и дополнительный выходы.
 *
 *  ```
 *  [{
 *     path: 'parent/:id',
 *     children: [
 *       { path: 'a', component: MainChild },
 *       { path: 'b', component: AuxChild, outlet: 'aux' }
 *     ]
 *  }]
 *  ```
 *
 * Маршрутизатор объединяет параметры, данные и разрешение без компонентов
 * родитель в параметры, данные и решимость детей.
 *
 * Это особенно полезно, когда определены дочерние компоненты
 * с пустой строкой пути, как в следующем примере.
 * С этой конфигурацией, переход к «/ parent / 10» создает
 * основные дочерние и вспомогательные компоненты.
 *
 *  ```
 *  [{
 *     path: 'parent/:id',
 *     children: [
 *       { path: '', component: MainChild },
 *       { path: '', component: AuxChild, outlet: 'aux' }
 *     ]
 *  }]
 *  ```
 *
 *  ### Ленивая загрузка
 *
 * Ленивая загрузка ускоряет время загрузки приложения, разделяя приложение
 * в несколько пакетов и загрузки их по требованию.
 * Чтобы использовать ленивую загрузку, предоставьте `loadChildren` свойство вместо `children` собственности.
 *
 * Учитывая следующий пример маршрута, маршрутизатор будет загружаться лениво
 * связанный модуль по требованию с использованием браузера собственной системы импорта.
 *
 *  ```
 *  [{
 *    path: 'lazy',
 *    loadChildren: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
 *  }];
 *  ```
 *
 * @publicApi
 */
export interface Route {
  /**
   * The path to match against. Cannot be used together with a custom `matcher` function.
   * A URL string that uses router matching notation.
   * Can be a wild card (`**`) that matches any URL (see Usage Notes below).
   * Default is "/" (the root path).
   *
   */
  path?: string;
  /**
   * The path-matching strategy, one of 'prefix' or 'full'.
   * Default is 'prefix'.
   *
   * By default, the router checks URL elements from the left to see if the URL
   * matches a given  path, and stops when there is a match. For example,
   * '/team/11/user' matches 'team/:id'.
   *
   * The path-match strategy 'full' matches against the entire URL.
   * It is important to do this when redirecting empty-path routes.
   * Otherwise, because an empty path is a prefix of any URL,
   * the router would apply the redirect even when navigating
   * to the redirect destination, creating an endless loop.
   *
   */
  pathMatch?: string;
  /**
   * A custom URL-matching function. Cannot be used together with `path`.
   */
  matcher?: UrlMatcher;
  /**
   * The component to instantiate when the path matches.
   * Can be empty if child routes specify components.
   */
  component?: Type<any>;
  /**
   * A URL to which to redirect when a the path matches.
   * Absolute if the URL begins with a slash (/), otherwise relative to the path URL.
   * When not present, router does not redirect.
   */
  redirectTo?: string;
  /**
   * Name of a `RouterOutlet` object where the component can be placed
   * when the path matches.
   */
  outlet?: string;
  /**
   * An array of dependency-injection tokens used to look up `CanActivate()`
   * handlers, in order to determine if the current user is allowed to
   * activate the component. By default, any user can activate.
   */
  canActivate?: any[];
  /**
   * An array of DI tokens used to look up `CanActivateChild()` handlers,
   * in order to determine if the current user is allowed to activate
   * a child of the component. By default, any user can activate a child.
   */
  canActivateChild?: any[];
  /**
   * An array of DI tokens used to look up `CanDeactivate()`
   * handlers, in order to determine if the current user is allowed to
   * deactivate the component. By default, any user can deactivate.
   *
   */
  canDeactivate?: any[];
  /**
   * An array of DI tokens used to look up `CanLoad()`
   * handlers, in order to determine if the current user is allowed to
   * load the component. By default, any user can load.
   */
  canLoad?: any[];
  /**
   * Additional developer-defined data provided to the component via
   * `ActivatedRoute`. By default, no additional data is passed.
   */
  data?: Data;
  /**
   * A map of DI tokens used to look up data resolvers. See `Resolve`.
   */
  resolve?: ResolveData;
  /**
   * An array of child `Route` objects that specifies a nested route
   * configuration.
   */
  children?: Routes;
  /**
   * A `LoadChildren` object specifying lazy-loaded child routes.
   */
  loadChildren?: LoadChildren;
  /**
   * Defines when guards and resolvers will be run. One of
   * - `paramsOrQueryParamsChange` : Run when query parameters change.
   * - `always` : Run on every execution.
   * By default, guards and resolvers run only when the matrix
   * parameters of the route change.
   */
  runGuardsAndResolvers?: RunGuardsAndResolvers;
  /**
   * Filled for routes with `loadChildren` once the module has been loaded
   * @internal
   */
  _loadedConfig?: LoadedRouterConfig;
}

export class LoadedRouterConfig {
  constructor(public routes: Route[], public module: NgModuleRef<any>) {}
}

export function validateConfig(config: Routes, parentPath: string = ''): void {
  // forEach doesn't iterate undefined values
  for (let i = 0; i < config.length; i++) {
    const route: Route = config[i];
    const fullPath: string = getFullPath(parentPath, route);
    validateNode(route, fullPath);
  }
}

function validateNode(route: Route, fullPath: string): void {
  if (!route) {
    throw new Error(`
      Invalid configuration of route '${fullPath}': Encountered undefined route.
      The reason might be an extra comma.

      Example:
      const routes: Routes = [
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        { path: 'dashboard',  component: DashboardComponent },, << two commas
        { path: 'detail/:id', component: HeroDetailComponent }
      ];
    `);
  }
  if (Array.isArray(route)) {
    throw new Error(`Invalid configuration of route '${fullPath}': Array cannot be specified`);
  }
  if (!route.component && !route.children && !route.loadChildren &&
      (route.outlet && route.outlet !== PRIMARY_OUTLET)) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': a componentless route without children or loadChildren cannot have a named outlet set`);
  }
  if (route.redirectTo && route.children) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': redirectTo and children cannot be used together`);
  }
  if (route.redirectTo && route.loadChildren) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': redirectTo and loadChildren cannot be used together`);
  }
  if (route.children && route.loadChildren) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': children and loadChildren cannot be used together`);
  }
  if (route.redirectTo && route.component) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': redirectTo and component cannot be used together`);
  }
  if (route.path && route.matcher) {
    throw new Error(
        `Invalid configuration of route '${fullPath}': path and matcher cannot be used together`);
  }
  if (route.redirectTo === void 0 && !route.component && !route.children && !route.loadChildren) {
    throw new Error(`Invalid configuration of route '${
        fullPath}'. One of the following must be provided: component, redirectTo, children or loadChildren`);
  }
  if (route.path === void 0 && route.matcher === void 0) {
    throw new Error(`Invalid configuration of route '${
        fullPath}': routes must have either a path or a matcher specified`);
  }
  if (typeof route.path === 'string' && route.path.charAt(0) === '/') {
    throw new Error(`Invalid configuration of route '${fullPath}': path cannot start with a slash`);
  }
  if (route.path === '' && route.redirectTo !== void 0 && route.pathMatch === void 0) {
    const exp =
        `The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`;
    throw new Error(`Invalid configuration of route '{path: "${fullPath}", redirectTo: "${
        route.redirectTo}"}': please provide 'pathMatch'. ${exp}`);
  }
  if (route.pathMatch !== void 0 && route.pathMatch !== 'full' && route.pathMatch !== 'prefix') {
    throw new Error(`Invalid configuration of route '${
        fullPath}': pathMatch can only be set to 'prefix' or 'full'`);
  }
  if (route.children) {
    validateConfig(route.children, fullPath);
  }
}

function getFullPath(parentPath: string, currentRoute: Route): string {
  if (!currentRoute) {
    return parentPath;
  }
  if (!parentPath && !currentRoute.path) {
    return '';
  } else if (parentPath && !currentRoute.path) {
    return `${parentPath}/`;
  } else if (!parentPath && currentRoute.path) {
    return currentRoute.path;
  } else {
    return `${parentPath}/${currentRoute.path}`;
  }
}

/**
 * Makes a copy of the config and adds any default required properties.
 */
export function standardizeConfig(r: Route): Route {
  const children = r.children && r.children.map(standardizeConfig);
  const c = children ? {...r, children} : {...r};
  if (!c.component && (children || c.loadChildren) && (c.outlet && c.outlet !== PRIMARY_OUTLET)) {
    c.component = EmptyOutletComponent;
  }
  return c;
}
