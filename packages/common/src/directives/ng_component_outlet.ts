/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ComponentFactoryResolver, ComponentRef, Directive, Injector, Input, NgModuleFactory, NgModuleRef, OnChanges, OnDestroy, SimpleChanges, StaticProvider, Type, ViewContainerRef} from '@angular/core';


/**
 * Создает один{@link Component}введите и вставьте его Host View в текущий View.
 *  `NgComponentOutlet`обеспечивает декларативный подход для создания динамических компонентов.
 *
 *  `NgComponentOutlet`требует тип компонента, если установлено ложное значение, представление очистится и
 * любой существующий компонент будет уничтожен.
 *
 *  @usageNotes
 *
 *  ### Точная настройка
 *
 * Вы можете контролировать процесс создания компоненты с помощью следующих дополнительныхатрибутов:.
 *
 *  `ngComponentOutletInjector`: необязательный пользовательский{@link Injector}это будет использоваться в качестве родителя для
 * Компонент. По умолчанию используется инжектор контейнера текущего представления.
 *
 *  `ngComponentOutletContent`: необязательный список проектируемых узлов для вставки в контент
 * раздел компонента, если существует.
 *
 *  `ngComponentOutletNgModuleFactory`: Необязательная фабрика модулей, позволяющая динамически загружать другие
 * модуль, а затем загрузить компонент из этого модуля.
 *
 *  ### Синтаксис.
 *
 * Простой.
 *  ```
 *  <ng-containerngComponentOutlet="componentTypeExpression"></ng-container>
 *  ```
 *
 * Индивидуальный инжектор / контент
 *  ```
 *  <ng-containerngComponentOutlet="componentTypeExpression;
 *                                    injector: injectorExpression;
 *                                    content: contentNodesExpression;">
 *  </ng-container>
 *  ```
 *
 * Индивидуальный ngModuleFactory
 *  ```
 *  <ng-containerngComponentOutlet="componentTypeExpression;
 *                                    ngModuleFactory: moduleFactory;">
 *  </ng-container>
 *  ```
 *
 *  ### Простойпример.
 *
 *  {@example common/ngComponentOutlet/ts/module.ts region='SimpleExample'}
 *
 * Более полный пример с дополнительнымиопциями:.
 *
 *  {@example common/ngComponentOutlet/ts/module.ts region='CompleteExample'}
 *
 * @publicApi
 * @ngModule CommonModule
 */
@Directive({selector: '[ngComponentOutlet]'})
export class NgComponentOutlet implements OnChanges, OnDestroy {
  // TODO(issue/24571): remove '!'.
  @Input() ngComponentOutlet!: Type<any>;
  // TODO(issue/24571): remove '!'.
  @Input() ngComponentOutletInjector!: Injector;
  // TODO(issue/24571): remove '!'.
  @Input() ngComponentOutletContent!: any[][];
  // TODO(issue/24571): remove '!'.
  @Input() ngComponentOutletNgModuleFactory!: NgModuleFactory<any>;

  private _componentRef: ComponentRef<any>|null = null;
  private _moduleRef: NgModuleRef<any>|null = null;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngOnChanges(changes: SimpleChanges) {
    this._viewContainerRef.clear();
    this._componentRef = null;

    if (this.ngComponentOutlet) {
      const elInjector = this.ngComponentOutletInjector || this._viewContainerRef.parentInjector;

      if (changes['ngComponentOutletNgModuleFactory']) {
        if (this._moduleRef) this._moduleRef.destroy();

        if (this.ngComponentOutletNgModuleFactory) {
          const parentModule = elInjector.get(NgModuleRef);
          this._moduleRef = this.ngComponentOutletNgModuleFactory.create(parentModule.injector);
        } else {
          this._moduleRef = null;
        }
      }

      const componentFactoryResolver = this._moduleRef ? this._moduleRef.componentFactoryResolver :
                                                         elInjector.get(ComponentFactoryResolver);

      const componentFactory =
          componentFactoryResolver.resolveComponentFactory(this.ngComponentOutlet);

      this._componentRef = this._viewContainerRef.createComponent(
          componentFactory, this._viewContainerRef.length, elInjector,
          this.ngComponentOutletContent);
    }
  }

  ngOnDestroy() {
    if (this._moduleRef) this._moduleRef.destroy();
  }
}
