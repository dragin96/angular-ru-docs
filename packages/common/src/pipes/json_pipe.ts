/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Pipe, PipeTransform} from '@angular/core';

/**
 *  @ngModule CommonModule
 *  @description
 *
 * Преобразует значение в его представление в формате JSON. Полезно для отладки.
 *
 *  @usageNotes
 *
 * Следующий компонент использует JSON-канал для преобразования объекта
 * в формате JSON, и отображает строку в обоих форматах для сравнения.
 *
 *  {@example common/pipes/ts/json_pipe.ts region='JsonPipe'}
 *
 * @publicApi
 */
@Pipe({name: 'json', pure: false})
export class JsonPipe implements PipeTransform {
  /**
   * @param value A value of any type to convert into a JSON-format string.
   */
  transform(value: any): string {
    return JSON.stringify(value, null, 2);
  }
}
