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
 * Универсальный селектор, отображающий строку, соответствующую текущему значению.
 *
 * Если ни один из ключей от `mapping` не соответствуют `value` значения, затемсодержимым.
 * из `other` ключ возвращается при его наличии, в противном случае возвращается пустая строка.
 *
 *  @usageNotes
 *
 *  ### Пример
 *
 *  {@example common/pipes/ts/i18n_pipe.ts region='I18nSelectPipeComponent'}
 *
 * @publicApi
 */
@Pipe({name: 'i18nSelect', pure: true})
export class I18nSelectPipe implements PipeTransform {
  /**
   * @param value a string to be internationalized.
   * @param mapping an object that indicates the text that should be displayed
   * for different values of the provided `value`.
   */
  transform(value: string|null|undefined, mapping: {[key: string]: string}): string {
    if (value == null) return '';

    if (typeof mapping !== 'object' || typeof value !== 'string') {
      throw invalidPipeArgumentError(I18nSelectPipe, mapping);
    }

    if (mapping.hasOwnProperty(value)) {
      return mapping[value];
    }

    if (mapping.hasOwnProperty('other')) {
      return mapping['other'];
    }

    return '';
  }
}
