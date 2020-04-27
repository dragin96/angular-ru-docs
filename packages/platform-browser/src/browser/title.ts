/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT, ɵgetDOM as getDOM} from '@angular/common';
import {Inject, Injectable, ɵɵinject} from '@angular/core';


/**
 * Factory to create Title service.
 */
export function createTitle() {
  return new Title(ɵɵinject(DOCUMENT));
}

/**
 * Служба, которая может использоваться для получения и установки заголовка текущего HTML-документа.
 *
 * Так как приложение Angular не может быть загружено во весь документ HTML (`<html>`)
 * это невозможным связать с `text` имущества `HTMLTitleElement` элементов.
 * (представляющий `<title>` тег заголовка). Вместо этого этот сервис можно использовать для установки и получения тока
 * значение заголовка.
 *
 * @publicApi
 */
@Injectable({providedIn: 'root', useFactory: createTitle, deps: []})
export class Title {
  constructor(@Inject(DOCUMENT) private _doc: any) {}
  /**
   * Get the title of the current HTML document.
   */
  getTitle(): string {
    return this._doc.title;
  }

  /**
   * Set the title of the current HTML document.
   * @param newTitle
   */
  setTitle(newTitle: string) {
    this._doc.title = newTitle || '';
  }
}
