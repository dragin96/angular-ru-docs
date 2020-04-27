/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {isPromise} from '../src/util/lang';

import {Inject, Injectable, InjectionToken, Optional} from './di';


/**
 * Маркер инъекции, который позволяет вам предоставлять одну или несколько функций инициализации.
 * Эти функции вводятся при запуске приложения и выполняются во время
 * инициализация приложения. Если какая-либо из этих функций возвращает Promise, инициализация
 * не завершается, пока не будет выполнено обещание.
 *
 * Вы можете, например, создать заводскую функцию, которая загружает языковые данные
 * или внешней конфигурации, и предоставьте эту функцию `APP_INITIALIZER`.
 * Таким образом, функция выполняется во время процесса начальной загрузки приложения
 * и необходимые данные доступны при запуске.
 *
 * @publicApi
 */
export const APP_INITIALIZER = new InjectionToken<Array<() => void>>('Application Initializer');

/**
 * Класс, который отражает состояние бега{@link APP_INITIALIZER}s.
 *
 * @publicApi
 */
@Injectable()
export class ApplicationInitStatus {
  // TODO(issue/24571): remove '!'.
  private resolve!: Function;
  // TODO(issue/24571): remove '!'.
  private reject!: Function;
  private initialized = false;
  public readonly donePromise: Promise<any>;
  public readonly done = false;

  constructor(@Inject(APP_INITIALIZER) @Optional() private appInits: (() => any)[]) {
    this.donePromise = new Promise((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }

  /** @internal */
  runInitializers() {
    if (this.initialized) {
      return;
    }

    const asyncInitPromises: Promise<any>[] = [];

    const complete = () => {
      (this as {done: boolean}).done = true;
      this.resolve();
    };

    if (this.appInits) {
      for (let i = 0; i < this.appInits.length; i++) {
        const initResult = this.appInits[i]();
        if (isPromise(initResult)) {
          asyncInitPromises.push(initResult);
        }
      }
    }

    Promise.all(asyncInitPromises)
        .then(() => {
          complete();
        })
        .catch(e => {
          this.reject(e);
        });

    if (asyncInitPromises.length === 0) {
      complete();
    }
    this.initialized = true;
  }
}
