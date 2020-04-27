/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Pipe, PipeTransform} from '@angular/core';
import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

/**
 *  @ngModule CommonModule
 *  @description
 *
 * Создает новый `Array` или `String` содержащую подмножество (фрагмент) элементов.
 *
 *  @usageNotes
 *
 * Все поведение основано на ожидаемом поведении JavaScript API `Array.prototype.slice()`
 * и `String.prototype.slice()`.
 *
 * При работе на `Array` Array, возвращаемый `Array` всегда копиядаже есливсе.
 * элементы возвращаются.
 *
 * При работе с пустым значением канал возвращает пустое значение.
 *
 *  ### Пример списка
 *
 * Это `ngFor` пример:.
 *
 *  {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_list'}
 *
 * производитследующее:.
 *
 *  ```html
 *  <li>b</li>
 *  <li>c</li>
 *  ```
 *
 *  ### Строковые примеры
 *
 *  {@example common/pipes/ts/slice_pipe.ts region='SlicePipe_string'}
 *
 * @publicApi
 */
@Pipe({name: 'slice', pure: false})
export class SlicePipe implements PipeTransform {
  /**
   * @param value a list or a string to be sliced.
   * @param start the starting index of the subset to return:
   *   - **a positive integer**: return the item at `start` index and all items after
   *     in the list or string expression.
   *   - **a negative integer**: return the item at `start` index from the end and all items after
   *     in the list or string expression.
   *   - **if positive and greater than the size of the expression**: return an empty list or
   * string.
   *   - **if negative and greater than the size of the expression**: return entire list or string.
   * @param end the ending index of the subset to return:
   *   - **omitted**: return all items until the end.
   *   - **if positive**: return all items before `end` index of the list or string.
   *   - **if negative**: return all items before `end` index from the end of the list or string.
   */
  transform<T>(value: ReadonlyArray<T>, start: number, end?: number): Array<T>;
  transform(value: string, start: number, end?: number): string;
  transform(value: null, start: number, end?: number): null;
  transform(value: undefined, start: number, end?: number): undefined;
  transform(value: any, start: number, end?: number): any {
    if (value == null) return value;

    if (!this.supports(value)) {
      throw invalidPipeArgumentError(SlicePipe, value);
    }

    return value.slice(start, end);
  }

  private supports(obj: any): boolean {
    return typeof obj === 'string' || Array.isArray(obj);
  }
}
