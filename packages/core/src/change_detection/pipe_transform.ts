/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Интерфейс, который реализован каналами для выполнения преобразования.
 * Angular вызывает `transform` метод со значениемпривязки.
 * в качестве первого аргумента и любые параметры в качестве второго аргумента в форме списка.
 *
 *  @usageNotes
 *
 * В следующем примере, `RepeatPipe` повторяет заданное значение заданное количество раз.
 *
 *  ```ts
 *  import {Pipe, PipeTransform} from '@angular/core';
 *
 *  @Pipe({name: 'repeat'})
 *  export class RepeatPipe implements PipeTransform {
 *    transform(value: any, times: number) {
 *      return value.repeat(times);
 *    }
 *  }
 *  ```
 *
 * Вызывая`{{ 'ok' | repeat:3 }}`в шаблоне выдает `okokok`.
 *
 * @publicApi
 */
export interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
