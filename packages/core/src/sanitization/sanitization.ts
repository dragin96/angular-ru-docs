/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {getDocument} from '../render3/interfaces/document';
import {SANITIZER} from '../render3/interfaces/view';
import {getLView} from '../render3/state';
import {renderStringify} from '../render3/util/misc_utils';

import {allowSanitizationBypassAndThrow, BypassType, unwrapSafeValue} from './bypass';
import {_sanitizeHtml as _sanitizeHtml} from './html_sanitizer';
import {Sanitizer} from './sanitizer';
import {SecurityContext} from './security';
import {_sanitizeStyle, StyleSanitizeFn, StyleSanitizeMode} from './style_sanitizer';
import {_sanitizeUrl as _sanitizeUrl} from './url_sanitizer';



/**
 *  An `html`дезинфицирующеекоторый преобразует ненадежного `html` строку в доверенную строку,удалив.
 * опасный контент.
 *
 * Этот метод анализирует `html` и находит потенциально опасный контент (такой как URL и
 * javascript) и удаляет его.
 *
 * Можно пометить строку как доверенную, вызвав{@link bypassSanitizationTrustHtml},
 *
 *  @param unsafeHtml `html``html` ,, как правило, от пользователя.
 *  @returns `html`строка, которая безопасна для отображения пользователю, потому что весь опасный JavaScript
 * и URL были удалены.
 *
 * @publicApi
 */
export function ɵɵsanitizeHtml(unsafeHtml: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.HTML, unsafeHtml) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeHtml, BypassType.Html)) {
    return unwrapSafeValue(unsafeHtml);
  }
  return _sanitizeHtml(getDocument(), renderStringify(unsafeHtml));
}

/**
 *  A `style`дезинфицирующегокоторый преобразует ненадежный `style` строкув доверенную строку путемудаления.
 * опасный контент.
 *
 * Этот метод анализирует `style` и находит потенциально опасный контент (такой как URL и
 * javascript) и удаляет его.
 *
 * Можно пометить строку как доверенную, вызвав{@link bypassSanitizationTrustStyle},
 *
 *  @param unsafeStyle ненадежный `style` стиль,правилоот пользователя.
 *  @returns `style`строкакоторый является безопасным для связывания с `style` свойств стиля, потому чтовсе.
 * опасный javascript и URL были удалены.
 *
 * @publicApi
 */
export function ɵɵsanitizeStyle(unsafeStyle: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.STYLE, unsafeStyle) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeStyle, BypassType.Style)) {
    return unwrapSafeValue(unsafeStyle);
  }
  return _sanitizeStyle(renderStringify(unsafeStyle));
}

/**
 *  A `url`дезинфицирующеекоторый преобразует ненадежный `url` строкув доверенную строку путемудаления.
 * опасно.
 * содержание.
 *
 * Этот метод анализирует `url` и находит потенциально опасный контент (такой как javascript) и
 * удаляет это.
 *
 * Можно пометить строку как доверенную, вызвав{@link bypassSanitizationTrustUrl},
 *
 *  @param unsafeUrl Ненадежных `url` URL,правилоот пользователя.
 *  @returns `url`строкакоторую можно безопасно связать со `src` свойствами`такими как`<img src>`, потому что
 * весь опасный javascript был удален.
 *
 * @publicApi
 */
export function ɵɵsanitizeUrl(unsafeUrl: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.URL, unsafeUrl) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeUrl, BypassType.Url)) {
    return unwrapSafeValue(unsafeUrl);
  }
  return _sanitizeUrl(renderStringify(unsafeUrl));
}

/**
 *  A `url`дезинфицирующеекоторый только позволяет доверять `url` с помощью.
 *
 * Это передает только `url` помеченные как доверенные путем вызова{@link bypassSanitizationTrustResourceUrl},
 *
 *  @param unsafeResourceUrl Ненадежных `url` URL,правилоот пользователя.
 *  @returns `url`строкакоторую можно безопасно связать со `src` свойствами`такими как`<img src>`, потому что
 * Только доверенные `url` были разрешены для прохождения.
 *
 * @publicApi
 */
export function ɵɵsanitizeResourceUrl(unsafeResourceUrl: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.RESOURCE_URL, unsafeResourceUrl) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeResourceUrl, BypassType.ResourceUrl)) {
    return unwrapSafeValue(unsafeResourceUrl);
  }
  throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
}

/**
 *  A `script`дезинфицирующеекоторый только позволяет доверять JavaScript через.
 *
 * Это передает только `script` помеченный как доверенный путем вызова {@link
 * bypassSanitizationTrustScript}.
 *
 *  @param unsafeScript ненадежный `script` , обычно от пользователя.
 *  @returns `url`строкакоторая является безопасной для привязки к `<script>` элементтакие как`<img src>`SRC,.
 * потому что только доверенные `scripts` были разрешены для прохождения.
 *
 * @publicApi
 */
export function ɵɵsanitizeScript(unsafeScript: any): string {
  const sanitizer = getSanitizer();
  if (sanitizer) {
    return sanitizer.sanitize(SecurityContext.SCRIPT, unsafeScript) || '';
  }
  if (allowSanitizationBypassAndThrow(unsafeScript, BypassType.Script)) {
    return unwrapSafeValue(unsafeScript);
  }
  throw new Error('unsafe value used in a script context');
}

/**
 * Detects which sanitizer to use for URL property, based on tag name and prop name.
 *
 * The rules are based on the RESOURCE_URL context config from
 * `packages/compiler/src/schema/dom_security_schema.ts`.
 * If tag and prop names don't match Resource URL schema, use URL sanitizer.
 */
export function getUrlSanitizer(tag: string, prop: string) {
  if ((prop === 'src' &&
       (tag === 'embed' || tag === 'frame' || tag === 'iframe' || tag === 'media' ||
        tag === 'script')) ||
      (prop === 'href' && (tag === 'base' || tag === 'link'))) {
    return ɵɵsanitizeResourceUrl;
  }
  return ɵɵsanitizeUrl;
}

/**
 * Санитизирует URL, выбирая дезинфицирующую функцию на основе тегов и имен свойств.
 *
 * Эта функция используется в случае, если мы не можем определить контекст безопасности во время компиляции, когда только prop
 * имя доступно. Это происходит, когда мы генерируем привязки хоста для Директив / Компонентов.
 * Элемент хоста неизвестен во время компиляции, поэтому мы откладываем вычисление определенного дезинфицирующего средства до
 * время выполнения.
 *
 *  @param unsafeUrl Ненадежных `url` URL,правилоот пользователя.
 *  @param тег целевой элемент имя тега.
 *  @param имя свойства, которое содержит значение.
 *  @returns `url`строкакоторую можно связать.
 *
 * @publicApi
 */
export function ɵɵsanitizeUrlOrResourceUrl(unsafeUrl: any, tag: string, prop: string): any {
  return getUrlSanitizer(tag, prop)(unsafeUrl);
}

/**
 * Средство очистки стиля по умолчанию будет обрабатывать очистку для свойств стиля с помощью
 * дезинфекция любого свойства CSS, которое может включать `url``url` (обычно это свойства на основе изображений)
 *
 * @publicApi
 */
export const ɵɵdefaultStyleSanitizer =
    (function(prop: string, value: string|null, mode?: StyleSanitizeMode): string|boolean|null {
      if (value === undefined && mode === undefined) {
        // This is a workaround for the fact that `StyleSanitizeFn` should not exist once PR#34480
        // lands. For now the `StyleSanitizeFn` and should act like `(value: any) => string` as a
        // work around.
        return ɵɵsanitizeStyle(prop);
      }
      mode = mode || StyleSanitizeMode.ValidateAndSanitize;
      let doSanitizeValue = true;
      if (mode & StyleSanitizeMode.ValidateProperty) {
        doSanitizeValue = stylePropNeedsSanitization(prop);
      }

      if (mode & StyleSanitizeMode.SanitizeOnly) {
        return doSanitizeValue ? ɵɵsanitizeStyle(value) : unwrapSafeValue(value);
      } else {
        return doSanitizeValue;
      }
    } as StyleSanitizeFn);

export function stylePropNeedsSanitization(prop: string): boolean {
  return prop === 'background-image' || prop === 'backgroundImage' || prop === 'background' ||
      prop === 'border-image' || prop === 'borderImage' || prop === 'border-image-source' ||
      prop === 'borderImageSource' || prop === 'filter' || prop === 'list-style' ||
      prop === 'listStyle' || prop === 'list-style-image' || prop === 'listStyleImage' ||
      prop === 'clip-path' || prop === 'clipPath';
}

export function validateAgainstEventProperties(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...` +
        `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
        ` current module.`;
    throw new Error(msg);
  }
}

export function validateAgainstEventAttributes(name: string) {
  if (name.toLowerCase().startsWith('on')) {
    const msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
        `please use (${name.slice(2)})=...`;
    throw new Error(msg);
  }
}

function getSanitizer(): Sanitizer|null {
  const lView = getLView();
  return lView && lView[SANITIZER];
}
