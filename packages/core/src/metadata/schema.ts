/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


/**
 * Определение схемы, связанной с модулем NgModule.
 *
 *  @see `@NgModule `@NgModule,` CUSTOM_ELEMENTS_SCHEMA `CUSTOM_ELEMENTS_SCHEMA,` NO_ERRORS_SCHEMA`
 *
 *  @param name Имя определенной схемы.
 *
 * @publicApi
 */
export interface SchemaMetadata {
  name: string;
}

/**
 * Определяет схему, позволяющее NgModule содержатьследующее:.
 * - Не Angular элементы, названные с тире (`-`).
 * - Свойства элемента, названные с тире (`-`).
 * Тире - это соглашение об именах пользовательских элементов.
 *
 * @publicApi
 */
export const CUSTOM_ELEMENTS_SCHEMA: SchemaMetadata = {
  name: 'custom-elements'
};

/**
 * Определяет схему, которая допускает любое свойство любого элемента.
 *
 * @publicApi
 */
export const NO_ERRORS_SCHEMA: SchemaMetadata = {
  name: 'no-errors-schema'
};
