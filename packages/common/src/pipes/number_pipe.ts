/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {formatCurrency, formatNumber, formatPercent} from '../i18n/format_number';
import {getCurrencySymbol} from '../i18n/locale_data_api';

import {invalidPipeArgumentError} from './invalid_pipe_argument_error';


/**
 *  @ngModule CommonModule
 *  @description
 *
 * Преобразует число в строку
 * отформатирован в соответствии с правилами локали, которые определяют размер группы и
 * разделитель, символ десятичной точки и другие специфичные для локали
 * конфигурации.
 *
 * Если параметры не указаны, функция округляется до ближайшего значения, используя это
 *  [метод округления](https://en.wikibooks.org/wiki/Arithmetic/Rounding).
 * Поведение отличается от поведения JavaScript`` `Math.round()` ``функция.
 * Например, в следующем случае труба округляется вниз, где
 *  `` `Math.round()` ``округляет:.
 *
 *  ```html
 *  -2.5 | number:'1.0-0'
 *  > -3
 *  Math.round(-2.5)
 *  > -2
 *  ```
 *
 *  @see `formatNumber()`
 *
 *  @usageNotes
 * Следующий код показывает, как канал преобразует числа
 * в текстовые строки, в соответствии с различными спецификациями формата
 * где локаль звонящего по умолчанию - `en-US`.
 *
 *  ### Пример
 *
 *  <code-example path="common/pipes/ts/number_pipe.ts" region='NumberPipe'></code-example>
 *
 * @publicApi
 */
@Pipe({name: 'number'})
export class DecimalPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   * @param value The number to be formatted.
   * @param digitsInfo Decimal representation options, specified by a string
   * in the following format:<br>
   * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
   *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
   * Default is `1`.
   *   - `minFractionDigits`: The minimum number of digits after the decimal point.
   * Default is `0`.
   *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
   * Default is `3`.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   */
  transform(value: any, digitsInfo?: string, locale?: string): string|null {
    if (isEmpty(value)) return null;

    locale = locale || this._locale;

    try {
      const num = strToNumber(value);
      return formatNumber(num, locale, digitsInfo);
    } catch (error) {
      throw invalidPipeArgumentError(DecimalPipe, error.message);
    }
  }
}

/**
 *  @ngModule CommonModule
 *  @description
 *
 * Преобразует число в процент
 * строка, отформатированная в соответствии с правилами локали, которые определяют размер группы и
 * разделитель, символ десятичной точки и другие специфичные для локали
 * конфигурации.
 *
 *  @see `formatPercent()`
 *
 *  @usageNotes
 * Следующий код показывает, как канал преобразует числа
 * в текстовые строки, в соответствии с различными спецификациями формата
 * где локаль звонящего по умолчанию - `en-US`.
 *
 *  <code-example path="common/pipes/ts/percent_pipe.ts" region='PercentPipe'></code-example>
 *
 * @publicApi
 */
@Pipe({name: 'percent'})
export class PercentPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  /**
   *
   * @param value The number to be formatted as a percentage.
   * @param digitsInfo Decimal representation options, specified by a string
   * in the following format:<br>
   * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
   *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
   * Default is `1`.
   *   - `minFractionDigits`: The minimum number of digits after the decimal point.
   * Default is `0`.
   *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
   * Default is `0`.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   */
  transform(value: any, digitsInfo?: string, locale?: string): string|null {
    if (isEmpty(value)) return null;
    locale = locale || this._locale;
    try {
      const num = strToNumber(value);
      return formatPercent(num, locale, digitsInfo);
    } catch (error) {
      throw invalidPipeArgumentError(PercentPipe, error.message);
    }
  }
}

/**
 *  @ngModule CommonModule
 *  @description
 *
 * Преобразует число в строку валюты, отформатированную в соответствии с правилами локали
 * которые определяют группу размеров и разделитель, десятичнойточки,.
 * и другие специфичные для локали конфигурации.
 *
 *  {@a currency-code-deprecation}
 *  <div class="alert is-helpful">
 *
 * Устаревшиеизвещение:.
 *
 * Код валюты по умолчанию в настоящее время всегда `USD` но это не рекомендуется с v9.
 *
 * В версии 11 код валюты по умолчанию будет взят из текущей локали, обозначенной
 *  the `LOCAL_ID`маркер. См.[Руководство i18n](guide/i18n#setting-up-the-locale-of-your-app)для
 * больше информации.
 *
 * Если вам нужно предыдущее поведение, установите его, создав `DEFAULT_CURRENCY_CODE` провайдерав
 * приложение `NgModule` NgModule:.
 *
 *  ```ts
 *  {provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}
 *  ```
 *
 *  </div>
 *
 *  @see `getCurrencySymbol()`
 *  @see `formatCurrency()`
 *
 *  @usageNotes
 * Следующий код показывает, как канал преобразует числа
 * в текстовые строки, в соответствии с различными спецификациями формата
 * где локаль звонящего по умолчанию - `en-US`.
 *
 *  <code-example path="common/pipes/ts/currency_pipe.ts" region='CurrencyPipe'></code-example>
 *
 * @publicApi
 */
@Pipe({name: 'currency'})
export class CurrencyPipe implements PipeTransform {
  constructor(
      @Inject(LOCALE_ID) private _locale: string,
      @Inject(DEFAULT_CURRENCY_CODE) private _defaultCurrencyCode: string = 'USD') {}

  /**
   *
   * @param value The number to be formatted as currency.
   * @param currencyCode The [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code,
   * such as `USD` for the US dollar and `EUR` for the euro. The default currency code can be
   * configured using the `DEFAULT_CURRENCY_CODE` injection token.
   * @param display The format for the currency indicator. One of the following:
   *   - `code`: Show the code (such as `USD`).
   *   - `symbol`(default): Show the symbol (such as `$`).
   *   - `symbol-narrow`: Use the narrow symbol for locales that have two symbols for their
   * currency.
   * For example, the Canadian dollar CAD has the symbol `CA$` and the symbol-narrow `$`. If the
   * locale has no narrow symbol, uses the standard symbol for the locale.
   *   - String: Use the given string value instead of a code or a symbol.
   * For example, an empty string will suppress the currency & symbol.
   *   - Boolean (marked deprecated in v5): `true` for symbol and false for `code`.
   *
   * @param digitsInfo Decimal representation options, specified by a string
   * in the following format:<br>
   * <code>{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}</code>.
   *   - `minIntegerDigits`: The minimum number of integer digits before the decimal point.
   * Default is `1`.
   *   - `minFractionDigits`: The minimum number of digits after the decimal point.
   * Default is `2`.
   *   - `maxFractionDigits`: The maximum number of digits after the decimal point.
   * Default is `2`.
   * If not provided, the number will be formatted with the proper amount of digits,
   * depending on what the [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) specifies.
   * For example, the Canadian dollar has 2 digits, whereas the Chilean peso has none.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   */
  transform(
      value: any, currencyCode?: string,
      display: 'code'|'symbol'|'symbol-narrow'|string|boolean = 'symbol', digitsInfo?: string,
      locale?: string): string|null {
    if (isEmpty(value)) return null;

    locale = locale || this._locale;

    if (typeof display === 'boolean') {
      if (<any>console && <any>console.warn) {
        console.warn(
            `Warning: the currency pipe has been changed in Angular v5. The symbolDisplay option (third parameter) is now a string instead of a boolean. The accepted values are "code", "symbol" or "symbol-narrow".`);
      }
      display = display ? 'symbol' : 'code';
    }

    let currency: string = currencyCode || this._defaultCurrencyCode;
    if (display !== 'code') {
      if (display === 'symbol' || display === 'symbol-narrow') {
        currency = getCurrencySymbol(currency, display === 'symbol' ? 'wide' : 'narrow', locale);
      } else {
        currency = display;
      }
    }

    try {
      const num = strToNumber(value);
      return formatCurrency(num, locale, currency, currencyCode, digitsInfo);
    } catch (error) {
      throw invalidPipeArgumentError(CurrencyPipe, error.message);
    }
  }
}

function isEmpty(value: any): boolean {
  return value == null || value === '' || value !== value;
}

/**
 * Transforms a string into a number (if needed).
 */
function strToNumber(value: number|string): number {
  // Convert strings to numbers
  if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
    return Number(value);
  }
  if (typeof value !== 'number') {
    throw new Error(`${value} is not a number`);
  }
  return value;
}
