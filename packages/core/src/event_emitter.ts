/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/// <reference types="rxjs" />

import {Subject, Subscription} from 'rxjs';

/**
 * Используйте в компонентах с `@Output` директивойдляпользовательских событий
 * синхронно или асинхронно, и зарегистрируйте обработчики для этих событий
 * подписавшись на экземпляр.
 *
 *  @usageNotes
 *
 * Удлиняет
 *  [RxJS `Тема`](https://rxjs.dev/api/index/class/Subject)
 * для Angular путем добавления `emit()` метода.
 *
 * В следующем примере компонент определяет два выходных свойства
 * которые создают источники событий. Когда заголовок кликается, эмиттер
 * испускает событие открытия или закрытия для переключения текущего состояния видимости.
 *
 *  ```html
 *  @Component({
 *    selector: 'zippy',
 *    template: `
 *    <div class="zippy">
 *      <div (click)="toggle()">Toggle</div>
 *      <div [hidden]="!visible">
 *        <ng-content></ng-content>
 *      </div>
 *   </div>`})
 *  export class Zippy {
 *    visible: boolean = true;
 *    @Output() open: EventEmitter<any> = new EventEmitter();
 *    @Output() close: EventEmitter<any> = new EventEmitter();
 *
 *    toggle() {
 *      this.visible = !this.visible;
 *      if (this.visible) {
 *        this.open.emit(null);
 *      } else {
 *        this.close.emit(null);
 *      }
 *    }
 *  }
 *  ```
 *
 * Получите доступ к объекту события с помощью `$event` аргументапереданного в выходное событие
 * Обработчик:.
 *
 *  ```html
 *  <zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>
 *  ```
 *
 *  @see [Наблюдаемые в Angular](guide/observables-in-angular)
 * @publicApi
 */
export class EventEmitter<T extends any> extends Subject<T> {
  /**
   * @internal
   */
  __isAsync: boolean;  // tslint:disable-line

  /**
   * Creates an instance of this class that can
   * deliver events synchronously or asynchronously.
   *
   * @param isAsync When true, deliver events asynchronously.
   *
   */
  constructor(isAsync: boolean = false) {
    super();
    this.__isAsync = isAsync;
  }

  /**
   * Emits an event containing a given value.
   * @param value The value to emit.
   */
  emit(value?: T) {
    super.next(value);
  }

  /**
   * Registers handlers for events emitted by this instance.
   * @param generatorOrNext When supplied, a custom handler for emitted events.
   * @param error When supplied, a custom handler for an error notification
   * from this emitter.
   * @param complete When supplied, a custom handler for a completion
   * notification from this emitter.
   */
  subscribe(generatorOrNext?: any, error?: any, complete?: any): Subscription {
    let schedulerFn: (t: any) => any;
    let errorFn = (err: any): any => null;
    let completeFn = (): any => null;

    if (generatorOrNext && typeof generatorOrNext === 'object') {
      schedulerFn = this.__isAsync ? (value: any) => {
        setTimeout(() => generatorOrNext.next(value));
      } : (value: any) => {
        generatorOrNext.next(value);
      };

      if (generatorOrNext.error) {
        errorFn = this.__isAsync ? (err) => {
          setTimeout(() => generatorOrNext.error(err));
        } : (err) => {
          generatorOrNext.error(err);
        };
      }

      if (generatorOrNext.complete) {
        completeFn = this.__isAsync ? () => {
          setTimeout(() => generatorOrNext.complete());
        } : () => {
          generatorOrNext.complete();
        };
      }
    } else {
      schedulerFn = this.__isAsync ? (value: any) => {
        setTimeout(() => generatorOrNext(value));
      } : (value: any) => {
        generatorOrNext(value);
      };

      if (error) {
        errorFn = this.__isAsync ? (err) => {
          setTimeout(() => error(err));
        } : (err) => {
          error(err);
        };
      }

      if (complete) {
        completeFn = this.__isAsync ? () => {
          setTimeout(() => complete());
        } : () => {
          complete();
        };
      }
    }

    const sink = super.subscribe(schedulerFn, errorFn, completeFn);

    if (generatorOrNext instanceof Subscription) {
      generatorOrNext.add(sink);
    }

    return sink;
  }
}
