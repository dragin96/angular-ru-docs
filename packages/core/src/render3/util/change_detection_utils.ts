/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {detectChanges, markDirty} from '../instructions/all';
import {getRootComponents} from './discovery_utils';

/**
 * Отмечает компонент для проверки (в случае компонентов OnPush) и синхронно
 * выполняет обнаружение изменений в приложении, к которому принадлежит этот компонент.
 *
 *  @param Компонент Компонент для{@link ChangeDetectorRef#markForCheck mark for check},
 *
 * @publicApi
 * @globalApi ng
 */
export function applyChanges(component: {}): void {
  markDirty(component);
  getRootComponents(component).forEach(rootComponent => detectChanges(rootComponent));
}
