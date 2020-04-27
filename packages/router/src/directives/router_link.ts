/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {LocationStrategy} from '@angular/common';
import {Attribute, Directive, ElementRef, HostBinding, HostListener, Input, isDevMode, OnChanges, OnDestroy, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';

import {QueryParamsHandling} from '../config';
import {Event, NavigationEnd} from '../events';
import {Router} from '../router';
import {ActivatedRoute} from '../router_state';
import {UrlTree} from '../url_tree';


/**
 *  @description
 *
 * Позволяет вам ссылаться на конкретные маршруты в вашем приложении.
 *
 * Рассмотрим следующую конфигурациюмаршрута:.
 *  `[{ path: 'user/:name', component: UserCmp }]`.
 * При связывании с этим `user/:name` route вы используете `RouterLink` директиву.
 *
 * Если ссылка является статической, вы можете использовать директиву следующим:.
 *  `<a routerLink="/user/bob">link to user component</a>`
 *
 * Если вы используете динамические значения для генерации ссылки, вы можете передать массив пути
 * сегменты, за которыми следуют параметры для каждого сегмента.
 *
 * Например,`['/team', teamId, 'user', userName, {details: true}]`
 * означает, что мы хотим сгенерировать ссылку на `/team/11/user/bob;details=true`.
 *
 * Несколько статических сегментов могут быть объединены в один
 * (например,`['/team/11/user', userName, {details: true}]`).
 *
 * Имя первого сегмента может начинаться с `/` , `./` или `../` :
 * Если первый сегмент начинается с `/` , маршрутизатор будет искать маршрут от корня
 * приложение.
 * Если первый сегмент начинается с `./` или не начинается с косой черты, маршрутизатор будет
 * вместо этого посмотрите на детей текущего активированного маршрута.
 * И если первый сегмент начинается с `../` , маршрутизатор поднимется на один уровень вверх.
 *
 * Вы можете установить параметры запроса и фрагмент следующим:.
 *
 *  ```
 *  <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" fragment="education">
 *    link to user component
 *  </a>
 *  ```
 * RouterLink будет использовать их для генерации этой ссылки: `/user/bob#education?debug=true`.
 *
 * (Устаревшее в v4.0.0 используйте `queryParamsHandling` вместо). Вы также можете указать
 * директивачтобы сохранить текущие параметры запроса ифрагмент:.
 *
 *  ```
 *  <a [routerLink]="['/user/bob']" preserveQueryParams preserveFragment>
 *    link to user component
 *  </a>
 *  ```
 *
 * Вы можете указать директиве, как обрабатывать queryParams. Возможныварианты:.
 * - `'merge'` : объединить queryParams с текущим queryParams
 * - `'preserve'` : сохранить текущие параметры запроса
 * - по умолчанию / `''` : используйте только queryParams
 *
 * Те же варианты для{@link NavigationExtras#queryParamsHandling
 *  NavigationExtras#queryParamsHandling},
 *
 *  ```
 *  <a [routerLink]="['/user/bob']" [queryParams]="{debug: true}" queryParamsHandling="merge">
 *    link to user component
 *  </a>
 *  ```
 *
 * Вы можете предоставить `state``state` для сохранения в History.state браузера
 * свойство (см. https://developer.mozilla.org/en-US/docs/Web/API/History#Свойства).Это.
 * используется следующим:.
 *
 *  ```
 *  <a [routerLink]="['/user/bob']" [state]="{tracingId: 123}">
 *    link to user component
 *  </a>
 *  ```
 *
 * И позже значение может быть считано из маршрутизатора через `router.getCurrentNavigation`.
 * Например, чтобы захватить `tracingId` вышетечение `NavigationStart` события:.
 *
 *  ```
 *  // Get NavigationStart events
 *  router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(e => {
 *    const navigation = router.getCurrentNavigation();
 *    tracingService.trace({id: navigation.extras.state.tracingId});
 *  });
 *  ```
 *
 * Директива ссылки на маршрутизатор всегда обрабатывает предоставленный ввод как дельту текущего URL.
 *
 * Например, если текущий URL-адрес `/user/(box//aux:team)`.
 *
 * Затем следующая ссылка`<a [routerLink]="['/user/jim']">Jim</a>`создаст ссылку
 *  `/user/(jim//aux:team)`.
 *
 * Видеть{@link Router#createUrlTree createUrlTree}за дополнительной информацией.
 *
 *  @ngModule RouterModule
 *
 * @publicApi
 */
@Directive({selector: ':not(a):not(area)[routerLink]'})
export class RouterLink {
  // TODO(issue/24571): remove '!'.
  @Input() queryParams!: {[k: string]: any};
  // TODO(issue/24571): remove '!'.
  @Input() fragment!: string;
  // TODO(issue/24571): remove '!'.
  @Input() queryParamsHandling!: QueryParamsHandling;
  // TODO(issue/24571): remove '!'.
  @Input() preserveFragment!: boolean;
  // TODO(issue/24571): remove '!'.
  @Input() skipLocationChange!: boolean;
  // TODO(issue/24571): remove '!'.
  @Input() replaceUrl!: boolean;
  @Input() state?: {[k: string]: any};
  private commands: any[] = [];
  // TODO(issue/24571): remove '!'.
  private preserve!: boolean;

  constructor(
      private router: Router, private route: ActivatedRoute,
      @Attribute('tabindex') tabIndex: string, renderer: Renderer2, el: ElementRef) {
    if (tabIndex == null) {
      renderer.setAttribute(el.nativeElement, 'tabindex', '0');
    }
  }

  @Input()
  set routerLink(commands: any[]|string) {
    if (commands != null) {
      this.commands = Array.isArray(commands) ? commands : [commands];
    } else {
      this.commands = [];
    }
  }

  /**
   * @deprecated 4.0.0 use `queryParamsHandling` instead.
   */
  @Input()
  set preserveQueryParams(value: boolean) {
    if (isDevMode() && <any>console && <any>console.warn) {
      console.warn('preserveQueryParams is deprecated!, use queryParamsHandling instead.');
    }
    this.preserve = value;
  }

  @HostListener('click')
  onClick(): boolean {
    const extras = {
      skipLocationChange: attrBoolValue(this.skipLocationChange),
      replaceUrl: attrBoolValue(this.replaceUrl),
      state: this.state,
    };
    this.router.navigateByUrl(this.urlTree, extras);
    return true;
  }

  get urlTree(): UrlTree {
    return this.router.createUrlTree(this.commands, {
      relativeTo: this.route,
      queryParams: this.queryParams,
      fragment: this.fragment,
      preserveQueryParams: attrBoolValue(this.preserve),
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: attrBoolValue(this.preserveFragment),
    });
  }
}

/**
 *  @description
 *
 * Позволяет вам ссылаться на конкретные маршруты в вашем приложении.
 *
 * См. `RouterLink` для получения дополнительной информации.
 *
 *  @ngModule RouterModule
 *
 * @publicApi
 */
@Directive({selector: 'a[routerLink],area[routerLink]'})
export class RouterLinkWithHref implements OnChanges, OnDestroy {
  // TODO(issue/24571): remove '!'.
  @HostBinding('attr.target') @Input() target!: string;
  // TODO(issue/24571): remove '!'.
  @Input() queryParams!: {[k: string]: any};
  // TODO(issue/24571): remove '!'.
  @Input() fragment!: string;
  // TODO(issue/24571): remove '!'.
  @Input() queryParamsHandling!: QueryParamsHandling;
  // TODO(issue/24571): remove '!'.
  @Input() preserveFragment!: boolean;
  // TODO(issue/24571): remove '!'.
  @Input() skipLocationChange!: boolean;
  // TODO(issue/24571): remove '!'.
  @Input() replaceUrl!: boolean;
  @Input() state?: {[k: string]: any};
  private commands: any[] = [];
  private subscription: Subscription;
  // TODO(issue/24571): remove '!'.
  private preserve!: boolean;

  // the url displayed on the anchor element.
  // TODO(issue/24571): remove '!'.
  @HostBinding() href!: string;

  constructor(
      private router: Router, private route: ActivatedRoute,
      private locationStrategy: LocationStrategy) {
    this.subscription = router.events.subscribe((s: Event) => {
      if (s instanceof NavigationEnd) {
        this.updateTargetUrlAndHref();
      }
    });
  }

  @Input()
  set routerLink(commands: any[]|string) {
    if (commands != null) {
      this.commands = Array.isArray(commands) ? commands : [commands];
    } else {
      this.commands = [];
    }
  }

  @Input()
  set preserveQueryParams(value: boolean) {
    if (isDevMode() && <any>console && <any>console.warn) {
      console.warn('preserveQueryParams is deprecated, use queryParamsHandling instead.');
    }
    this.preserve = value;
  }

  ngOnChanges(changes: {}): any {
    this.updateTargetUrlAndHref();
  }
  ngOnDestroy(): any {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event.button', '$event.ctrlKey', '$event.metaKey', '$event.shiftKey'])
  onClick(button: number, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean): boolean {
    if (button !== 0 || ctrlKey || metaKey || shiftKey) {
      return true;
    }

    if (typeof this.target === 'string' && this.target != '_self') {
      return true;
    }

    const extras = {
      skipLocationChange: attrBoolValue(this.skipLocationChange),
      replaceUrl: attrBoolValue(this.replaceUrl),
      state: this.state
    };
    this.router.navigateByUrl(this.urlTree, extras);
    return false;
  }

  private updateTargetUrlAndHref(): void {
    this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree));
  }

  get urlTree(): UrlTree {
    return this.router.createUrlTree(this.commands, {
      relativeTo: this.route,
      queryParams: this.queryParams,
      fragment: this.fragment,
      preserveQueryParams: attrBoolValue(this.preserve),
      queryParamsHandling: this.queryParamsHandling,
      preserveFragment: attrBoolValue(this.preserveFragment),
    });
  }
}

function attrBoolValue(s: any): boolean {
  return s === '' || !!s;
}
