/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createPlatformFactory, PlatformRef} from './application_ref';
import {PLATFORM_ID} from './application_tokens';
import {Console} from './console';
import {Injector, StaticProvider} from './di';
import {TestabilityRegistry} from './testability/testability';

const _CORE_PLATFORM_PROVIDERS: StaticProvider[] = [
  // Set a default platform name for platforms that don't set it explicitly.
  {provide: PLATFORM_ID, useValue: 'unknown'},
  {provide: PlatformRef, deps: [Injector]},
  {provide: TestabilityRegistry, deps: []},
  {provide: Console, deps: []},
];

/**
 * Эта платформа должна быть включена в любую другую платформу
 *
 * @publicApi
 */
export const platformCore = createPlatformFactory(null, 'core', _CORE_PLATFORM_PROVIDERS);
