/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {forwardRef, Inject, Injectable, Injector, Sanitizer, SecurityContext, ɵ_sanitizeHtml as _sanitizeHtml, ɵ_sanitizeStyle as _sanitizeStyle, ɵ_sanitizeUrl as _sanitizeUrl, ɵallowSanitizationBypassAndThrow as allowSanitizationBypassOrThrow, ɵbypassSanitizationTrustHtml as bypassSanitizationTrustHtml, ɵbypassSanitizationTrustResourceUrl as bypassSanitizationTrustResourceUrl, ɵbypassSanitizationTrustScript as bypassSanitizationTrustScript, ɵbypassSanitizationTrustStyle as bypassSanitizationTrustStyle, ɵbypassSanitizationTrustUrl as bypassSanitizationTrustUrl, ɵBypassType as BypassType, ɵgetSanitizationBypassType as getSanitizationBypassType, ɵunwrapSafeValue as unwrapSafeValue} from '@angular/core';

export {SecurityContext};



/**
 * Интерфейс маркера для значения, которое безопасно использовать в определенном контексте.
 *
 * @publicApi
 */
export interface SafeValue {}

/**
 * Интерфейс маркера для значения, которое безопасно использовать в качестве HTML.
 *
 * @publicApi
 */
export interface SafeHtml extends SafeValue {}

/**
 * Интерфейс маркера для значения, которое безопасно использовать в качестве стиля (CSS).
 *
 * @publicApi
 */
export interface SafeStyle extends SafeValue {}

/**
 * Интерфейс маркера для значения, которое безопасно использовать в качестве JavaScript.
 *
 * @publicApi
 */
export interface SafeScript extends SafeValue {}

/**
 * Интерфейс маркера для значения, которое безопасно использовать в качестве URL-ссылки на документ.
 *
 * @publicApi
 */
export interface SafeUrl extends SafeValue {}

/**
 * Интерфейс маркера для значения, которое безопасно использовать в качестве URL для загрузки исполняемого кода.
 *
 * @publicApi
 */
export interface SafeResourceUrl extends SafeValue {}

/**
 * DomSanitizer помогает предотвращать ошибки безопасности межсайтовых сценариев (XSS) путем очистки
 * Значения, которые будут безопасны для использования в различных контекстах DOM.
 *
 * Например, когда связывание URL в`<a [href]="someValue"> `гиперссылка,` someValue`будет.
 * дезинфицируется так, что злоумышленник не может внедрить, например, `javascript:` URLURL, который будет выполнять код
 * веб-сайт.
 *
 * В определенных ситуациях может потребоваться отключить санитарную обработку, например, если
 * Приложение действительно должно создать `javascript:` ссылкуstyle с динамическим значением в нем.
 * Пользователи могут обойтибезопасности, создав значение с одним из `bypassSecurityTrust...`
 * методы, а затем привязка к этому значению из шаблона.
 *
 * Эти ситуации должны быть очень редкими, и следует избегать чрезвычайной осторожности
 * Ошибка безопасности межсайтового скриптинга (XSS)!
 *
 * При использовании `bypassSecurityTrust...` , обязательно вызовите метод как можно раньше и как
 * максимально близко к источнику значения, чтобы было легко проверить, нет ли ошибки безопасности
 * созданный его использованием.
 *
 * Не требуется (и не рекомендуется) обходить безопасность, если значение безопасно, например, URL-адрес
 * не начинается с подозрительного протокола или фрагмента HTML, который не содержит опасного
 * код. Дезинфицирующее средство оставляет безопасные значения без изменений.
 *
 * @security Вызов любого из `bypassSecurityTrust...` API-интерфейсовотключает встроеннуюAngular
 * очистка переданного значения. Тщательно проверьте и проверьте все значения и пути кода
 * в этот вызов. Убедитесь, что любые пользовательские данные надлежащим образом экранированы для этого контекста безопасности.
 * Для получения более подробной информации см.[Руководство по безопасности](http://g.co/ng/security).
 *
 * @publicApi
 */
@Injectable({providedIn: 'root', useExisting: forwardRef(() => DomSanitizerImpl)})
export abstract class DomSanitizer implements Sanitizer {
  /**
   * Sanitizes a value for use in the given SecurityContext.
   *
   * If value is trusted for the context, this method will unwrap the contained safe value and use
   * it directly. Otherwise, value will be sanitized to be safe in the given context, for example
   * by replacing URLs that have an unsafe protocol part (such as `javascript:`). The implementation
   * is responsible to make sure that the value can definitely be safely used in the given context.
   */
  abstract sanitize(context: SecurityContext, value: SafeValue|string|null): string|null;

  /**
   * Bypass security and trust the given value to be safe HTML. Only use this when the bound HTML
   * is unsafe (e.g. contains `<script>` tags) and the code should be executed. The sanitizer will
   * leave safe HTML intact, so in most situations this method should not be used.
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   */
  abstract bypassSecurityTrustHtml(value: string): SafeHtml;

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   */
  abstract bypassSecurityTrustStyle(value: string): SafeStyle;

  /**
   * Bypass security and trust the given value to be safe JavaScript.
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   */
  abstract bypassSecurityTrustScript(value: string): SafeScript;

  /**
   * Bypass security and trust the given value to be a safe style URL, i.e. a value that can be used
   * in hyperlinks or `<img src>`.
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   */
  abstract bypassSecurityTrustUrl(value: string): SafeUrl;

  /**
   * Bypass security and trust the given value to be a safe resource URL, i.e. a location that may
   * be used to load executable code from, like `<script src>`, or `<iframe src>`.
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   */
  abstract bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl;
}

export function domSanitizerImplFactory(injector: Injector) {
  return new DomSanitizerImpl(injector.get(DOCUMENT));
}

@Injectable({providedIn: 'root', useFactory: domSanitizerImplFactory, deps: [Injector]})
export class DomSanitizerImpl extends DomSanitizer {
  constructor(@Inject(DOCUMENT) private _doc: any) {
    super();
  }

  sanitize(ctx: SecurityContext, value: SafeValue|string|null): string|null {
    if (value == null) return null;
    switch (ctx) {
      case SecurityContext.NONE:
        return value as string;
      case SecurityContext.HTML:
        if (allowSanitizationBypassOrThrow(value, BypassType.Html)) {
          return unwrapSafeValue(value);
        }
        return _sanitizeHtml(this._doc, String(value));
      case SecurityContext.STYLE:
        if (allowSanitizationBypassOrThrow(value, BypassType.Style)) {
          return unwrapSafeValue(value);
        }
        return _sanitizeStyle(value as string);
      case SecurityContext.SCRIPT:
        if (allowSanitizationBypassOrThrow(value, BypassType.Script)) {
          return unwrapSafeValue(value);
        }
        throw new Error('unsafe value used in a script context');
      case SecurityContext.URL:
        const type = getSanitizationBypassType(value);
        if (allowSanitizationBypassOrThrow(value, BypassType.Url)) {
          return unwrapSafeValue(value);
        }
        return _sanitizeUrl(String(value));
      case SecurityContext.RESOURCE_URL:
        if (allowSanitizationBypassOrThrow(value, BypassType.ResourceUrl)) {
          return unwrapSafeValue(value);
        }
        throw new Error(
            'unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
      default:
        throw new Error(`Unexpected SecurityContext ${ctx} (see http://g.co/ng/security#xss)`);
    }
  }

  bypassSecurityTrustHtml(value: string): SafeHtml {
    return bypassSanitizationTrustHtml(value);
  }
  bypassSecurityTrustStyle(value: string): SafeStyle {
    return bypassSanitizationTrustStyle(value);
  }
  bypassSecurityTrustScript(value: string): SafeScript {
    return bypassSanitizationTrustScript(value);
  }
  bypassSecurityTrustUrl(value: string): SafeUrl {
    return bypassSanitizationTrustUrl(value);
  }
  bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
    return bypassSanitizationTrustResourceUrl(value);
  }
}
