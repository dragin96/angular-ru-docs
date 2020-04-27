/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ComponentFactory, Injector} from '@angular/core';
import {Observable} from 'rxjs';

/**
 * Интерфейс для событий, генерируемых через NgElementStrategy.
 *
 * @publicApi
 */
export interface NgElementStrategyEvent {
  name: string;
  value: any;
}

/**
 * Базовая стратегия, используемая NgElement для создания / уничтожения компонента и реагирования на ввод
 * меняется.
 *
 * @publicApi
 */
export interface NgElementStrategy {
  events: Observable<NgElementStrategyEvent>;

  connect(element: HTMLElement): void;
  disconnect(): void;
  getInputValue(propName: string): any;
  setInputValue(propName: string, value: string): void;
}

/**
 * Фабрика используется для создания новых стратегий для каждого экземпляра NgElement.
 *
 * @publicApi
 */
export interface NgElementStrategyFactory {
  /** Creates a new instance to be used for an NgElement. */
  create(injector: Injector): NgElementStrategy;
}
