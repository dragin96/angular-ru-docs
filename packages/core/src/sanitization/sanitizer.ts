/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵɵdefineInjectable} from '../di/interface/defs';
import {SecurityContext} from './security';

/**
 * Sanitizer используется представлениями для очистки потенциально опасных значений.
 *
 * @publicApi
 */
export abstract class Sanitizer {
  abstract sanitize(context: SecurityContext, value: {}|string|null): string|null;
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: Sanitizer,
    providedIn: 'root',
    factory: () => null,
  });
}
