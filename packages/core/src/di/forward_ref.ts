/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';
import {getClosureSafeProperty} from '../util/property';
import {stringify} from '../util/stringify';



/**
 * Интерфейс, в который передана функция {@link forwardRef} должен реализовать.
 *
 *  @usageNotes
 *  ### Пример
 *
 *  {@example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref_fn'}
 * @publicApi
 */
export interface ForwardRefFn {
  (): any;
}

const __forward_ref__ = getClosureSafeProperty({__forward_ref__: getClosureSafeProperty});

/**
 * Позволяет ссылаться на ссылки, которые еще не определены.
 *
 * Например, `forwardRef` используетсякогда `token` который мы должны обратиться к дляцелей.
 * DI объявлен, но еще не определен. Он также используется, когда `token` который мы используем при создании
 * запрос еще не определен.
 *
 *  @usageNotes
 *  ### Пример
 *  {@example core/di/ts/forward_ref/forward_ref_spec.ts region='forward_ref'}
 * @publicApi
 */
export function forwardRef(forwardRefFn: ForwardRefFn): Type<any> {
  (<any>forwardRefFn).__forward_ref__ = forwardRef;
  (<any>forwardRefFn).toString = function() {
    return stringify(this());
  };
  return (<Type<any>><any>forwardRefFn);
}

/**
 * Лениво извлекает ссылочное значение из forwardRef.
 *
 * Действует как функция тождества, когда ей присваивается значение не вперед-ref.
 *
 *  @usageNotes
 *  ### Пример
 *
 *  {@example core/di/ts/forward_ref/forward_ref_spec.ts region='resolve_forward_ref'}
 *
 *  @see `forwardRef`
 * @publicApi
 */
export function resolveForwardRef<T>(type: T): T {
  return isForwardRef(type) ? type() : type;
}

/** Checks whether a function is wrapped by a `forwardRef`. */
export function isForwardRef(fn: any): fn is() => any {
  return typeof fn === 'function' && fn.hasOwnProperty(__forward_ref__) &&
      fn.__forward_ref__ === forwardRef;
}
