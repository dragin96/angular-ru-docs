/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectorRef, EventEmitter, OnDestroy, Pipe, PipeTransform, WrappedValue, ɵisObservable, ɵisPromise, ɵlooseIdentical} from '@angular/core';
import {Observable, SubscriptionLike} from 'rxjs';
import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

interface SubscriptionStrategy {
  createSubscription(async: Observable<any>|Promise<any>, updateLatestValue: any): SubscriptionLike
      |Promise<any>;
  dispose(subscription: SubscriptionLike|Promise<any>): void;
  onDestroy(subscription: SubscriptionLike|Promise<any>): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  createSubscription(async: Observable<any>, updateLatestValue: any): SubscriptionLike {
    return async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      }
    });
  }

  dispose(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }

  onDestroy(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
}

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(async: Promise<any>, updateLatestValue: (v: any) => any): Promise<any> {
    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<any>): void {}

  onDestroy(subscription: Promise<any>): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _observableStrategy = new ObservableStrategy();

/**
 *  @ngModule CommonModule
 *  @description
 *
 * Развертывает значение из асинхронного примитива.
 *
 *  The `async`трубы подписывается на `Observable` или `Promise` и возвращает последнее значениеимеет.
 * излучается. Когдановое значение, `async``async` каналпомечает компонент для проверки
 * меняется. Когда компонент уничтожается, `async` каналавтоматически отписывается, чтобы избежать
 * потенциальные утечки памяти.
 *
 *  @usageNotes
 *
 *  ### Примеры
 *
 * Этот пример связывает `Promise` с представлением. Нажатие `Resolve` кнопкиразрешает
 * обещание.
 *
 *  {@example common/pipes/ts/async_pipe.ts region='AsyncPipePromise'}
 *
 * Кроме тогоможно использовать `async` с наблюдаемыми. Ниже пример связывает `time` Наблюдаемое.
 * на вид. The Observable постоянно обновляет представление с текущим временем.
 *
 *  {@example common/pipes/ts/async_pipe.ts region='AsyncPipeObservable'}
 *
 * @publicApi
 */
@Pipe({name: 'async', pure: false})
export class AsyncPipe implements OnDestroy, PipeTransform {
  private _latestValue: any = null;
  private _latestReturnedValue: any = null;

  private _subscription: SubscriptionLike|Promise<any>|null = null;
  private _obj: Observable<any>|Promise<any>|EventEmitter<any>|null = null;
  private _strategy: SubscriptionStrategy = null!;

  constructor(private _ref: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    if (this._subscription) {
      this._dispose();
    }
  }

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T>|null|undefined): T|null;
  transform<T>(obj: Promise<T>|null|undefined): T|null;
  transform(obj: Observable<any>|Promise<any>|null|undefined): any {
    if (!this._obj) {
      if (obj) {
        this._subscribe(obj);
      }
      this._latestReturnedValue = this._latestValue;
      return this._latestValue;
    }

    if (obj !== this._obj) {
      this._dispose();
      return this.transform(obj as any);
    }

    if (ɵlooseIdentical(this._latestValue, this._latestReturnedValue)) {
      return this._latestReturnedValue;
    }

    this._latestReturnedValue = this._latestValue;
    return WrappedValue.wrap(this._latestValue);
  }

  private _subscribe(obj: Observable<any>|Promise<any>|EventEmitter<any>): void {
    this._obj = obj;
    this._strategy = this._selectStrategy(obj);
    this._subscription = this._strategy.createSubscription(
        obj, (value: Object) => this._updateLatestValue(obj, value));
  }

  private _selectStrategy(obj: Observable<any>|Promise<any>|EventEmitter<any>): any {
    if (ɵisPromise(obj)) {
      return _promiseStrategy;
    }

    if (ɵisObservable(obj)) {
      return _observableStrategy;
    }

    throw invalidPipeArgumentError(AsyncPipe, obj);
  }

  private _dispose(): void {
    this._strategy.dispose(this._subscription!);
    this._latestValue = null;
    this._latestReturnedValue = null;
    this._subscription = null;
    this._obj = null;
  }

  private _updateLatestValue(async: any, value: Object): void {
    if (async === this._obj) {
      this._latestValue = value;
      this._ref.markForCheck();
    }
  }
}
