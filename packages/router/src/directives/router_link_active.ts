/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterContentInit, ContentChildren, Directive, ElementRef, Input, OnChanges, OnDestroy, Optional, QueryList, Renderer2, SimpleChanges} from '@angular/core';
import {Subscription} from 'rxjs';

import {Event, NavigationEnd} from '../events';
import {Router} from '../router';

import {RouterLink, RouterLinkWithHref} from './router_link';


/**
 *
 *  @description
 *
 * Позволяет добавить класс CSS к элементу, когда маршрут ссылки становится активным.
 *
 * Эта директива позволяет добавлять класс CSS к элементу при маршруте ссылки
 * становится активным.
 *
 * Рассмотрим следующийпример:.
 *
 *  ```
 *  <a routerLink="/user/bob" routerLinkActive="active-link">Bob</a>
 *  ```
 *
 * Если URL-адрес равен «/ user» или «/ user / bob», класс active-link будет иметь значение
 * добавить в `a` тег. Если URL-адрес изменится, класс будет удален.
 *
 * Вы можете установить более одного класса, аименно:.
 *
 *  ```
 *  <a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>
 *  <a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
 *  ```
 *
 * Вы можете настроить RouterLinkActive, передавая `exact: true`. Это добавит классы
 * только когда URL точно соответствует ссылке.
 *
 *  ```
 *  <a routerLink="/user/bob" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact:
 *  true}">Bob</a>
 *  ```
 *
 * Вы можете назначить экземпляр RouterLinkActive переменной шаблона и напрямую проверить
 *  the `isActive`статус.
 *  ```
 *  <a routerLink="/user/bob" routerLinkActive #rla="routerLinkActive">
 *    Bob {{ rla.isActive ? '(already open)' : ''}}
 *  </a>
 *  ```
 *
 * Наконец, вы можете применить директиву RouterLinkActive к предку RouterLink.
 *
 *  ```
 *  <div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
 *    <a routerLink="/user/jim">Jim</a>
 *    <a routerLink="/user/bob">Bob</a>
 *  </div>
 *  ```
 *
 * Это установит класс active-link для тега div, если URL является либо «/ user / jim», либо
 * '/ пользователь / боб.
 *
 *  @ngModule RouterModule
 *
 * @publicApi
 */
@Directive({
  selector: '[routerLinkActive]',
  exportAs: 'routerLinkActive',
})
export class RouterLinkActive implements OnChanges, OnDestroy, AfterContentInit {
  // TODO(issue/24571): remove '!'.
  @ContentChildren(RouterLink, {descendants: true}) links!: QueryList<RouterLink>;
  // TODO(issue/24571): remove '!'.
  @ContentChildren(RouterLinkWithHref, {descendants: true})
  linksWithHrefs!: QueryList<RouterLinkWithHref>;

  private classes: string[] = [];
  private subscription: Subscription;
  public readonly isActive: boolean = false;

  @Input() routerLinkActiveOptions: {exact: boolean} = {exact: false};

  constructor(
      private router: Router, private element: ElementRef, private renderer: Renderer2,
      @Optional() private link?: RouterLink,
      @Optional() private linkWithHref?: RouterLinkWithHref) {
    this.subscription = router.events.subscribe((s: Event) => {
      if (s instanceof NavigationEnd) {
        this.update();
      }
    });
  }


  ngAfterContentInit(): void {
    this.links.changes.subscribe(_ => this.update());
    this.linksWithHrefs.changes.subscribe(_ => this.update());
    this.update();
  }

  @Input()
  set routerLinkActive(data: string[]|string) {
    const classes = Array.isArray(data) ? data : data.split(' ');
    this.classes = classes.filter(c => !!c);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private update(): void {
    if (!this.links || !this.linksWithHrefs || !this.router.navigated) return;
    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      if (this.isActive !== hasActiveLinks) {
        (this as any).isActive = hasActiveLinks;
        this.classes.forEach((c) => {
          if (hasActiveLinks) {
            this.renderer.addClass(this.element.nativeElement, c);
          } else {
            this.renderer.removeClass(this.element.nativeElement, c);
          }
        });
      }
    });
  }

  private isLinkActive(router: Router): (link: (RouterLink|RouterLinkWithHref)) => boolean {
    return (link: RouterLink|RouterLinkWithHref) =>
               router.isActive(link.urlTree, this.routerLinkActiveOptions.exact);
  }

  private hasActiveLinks(): boolean {
    const isActiveCheckFn = this.isLinkActive(this.router);
    return this.link && isActiveCheckFn(this.link) ||
        this.linkWithHref && isActiveCheckFn(this.linkWithHref) ||
        this.links.some(isActiveCheckFn) || this.linksWithHrefs.some(isActiveCheckFn);
  }
}
