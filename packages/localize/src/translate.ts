/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {LocalizeFn} from './localize';
import {MessageId, ParsedTranslation, parseTranslation, TargetMessage, translate as _translate} from './utils';

/**
 * We augment the `$localize` object to also store the translations.
 *
 * Note that because the TRANSLATIONS are attached to a global object, they will be shared between
 * all applications that are running in a single page of the browser.
 */
declare const $localize: LocalizeFn&{TRANSLATIONS: Record<MessageId, ParsedTranslation>};

/**
 * Загрузить перевод для `$localize`.
 *
 * Данные `translations` обрабатываются и добавляются к поиску на основе их `MessageId` MessageId.
 * Новый перевод перезапишет предыдущий перевод, если он имеет тот же `MessageId`.
 *
 * Если сообщение генерируется компилятором Angular из `i18n``i18n` в шаблоне, то
 *    `MessageId`передается в `$localize` call как пользовательский `MessageId` . `MessageId`
 * будет соответствовать тому, что извлечено в файлы перевода.
 *
 * Если перевод выполняется из вызова `$localize` в коде приложения, а не пользовательский` `MessageId`
 * обеспечивается, то `MessageId` могут быть получены путем передачи отмеченных строкMessage-части.
 * в `parseMessage()` (в настоящее время не общедоступный API).
 *
 * @publicApi
 *
 */
export function loadTranslations(translations: Record<MessageId, TargetMessage>) {
  // Ensure the translate function exists
  if (!$localize.translate) {
    $localize.translate = translate;
  }
  if (!$localize.TRANSLATIONS) {
    $localize.TRANSLATIONS = {};
  }
  Object.keys(translations).forEach(key => {
    $localize.TRANSLATIONS[key] = parseTranslation(translations[key]);
  });
}

/**
 * Удалите все переводы для `$localize`.
 *
 * @publicApi
 */
export function clearTranslations() {
  $localize.translate = undefined;
  $localize.TRANSLATIONS = {};
}

/**
 * Translate the text of the given message, using the loaded translations.
 *
 * This function may reorder (or remove) substitutions as indicated in the matching translation.
 */
export function translate(messageParts: TemplateStringsArray, substitutions: readonly any[]):
    [TemplateStringsArray, readonly any[]] {
  try {
    return _translate($localize.TRANSLATIONS, messageParts, substitutions);
  } catch (e) {
    console.warn(e.message);
    return [messageParts, substitutions];
  }
}
