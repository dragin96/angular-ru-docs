/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Представляет базовое изменение от предыдущего к новому значению для одного
 * свойство в директиве экземпляра. Передается как значение в
 *  {@link SimpleChanges}объект `ngOnChanges``ngOnChanges` hook.
 *
 *  @see `OnChanges`
 *
 * @publicApi
 */
export class SimpleChange {
  constructor(public previousValue: any, public currentValue: any, public firstChange: boolean) {}
  /**
   * Check whether the new value is the first value assigned.
   */
  isFirstChange(): boolean {
    return this.firstChange;
  }
}

/**
 * Хеш-таблица изменений, представленных{@link SimpleChange}объекты хранятся
 * в объявленном названии свойства, к которому они принадлежат в Директиве или Компоненте.Это.
 * тип, передаваемый в `ngOnChanges`.
 *
 *  @see `OnChanges`
 *
 * @publicApi
 */
export interface SimpleChanges {
  [propName: string]: SimpleChange;
}
