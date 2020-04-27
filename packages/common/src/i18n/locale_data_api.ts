/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵCurrencyIndex, ɵExtraLocaleDataIndex, ɵfindLocaleData, ɵgetLocaleCurrencyCode, ɵgetLocalePluralCase, ɵLocaleDataIndex} from '@angular/core';

import {CURRENCIES_EN, CurrenciesSymbols} from './currencies';


/**
 * Стили форматирования, которые можно использовать для представления чисел.
 * @see `getLocaleNumberFormat()`.
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberFormatStyle {
  Decimal,
  Percent,
  Currency,
  Scientific
}

/**
 * Случаи множественности, используемые для перевода множественного числа на разные языки.
 *
 *  @see `NgPlural`
 *  @see `NgPluralCase`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum Plural {
  Zero = 0,
  One = 1,
  Two = 2,
  Few = 3,
  Many = 4,
  Other = 5,
}

/**
 * Контекстно-зависимые формы перевода для строк.
 * Обычно автономная версия предназначена для именительной формы слова
 * и версия формата используется для родительного падежа.
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum FormStyle {
  Format,
  Standalone
}

/**
 * Ширина строк доступна для переводов.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для слова «воскресенье» на английском языке.
 *
 * @publicApi
 */
export enum TranslationWidth {
  /** 1 character for `en-US`. For example: 'S' */
  Narrow,
  /** 3 characters for `en-US`. For example: 'Sun' */
  Abbreviated,
  /** Full length for `en-US`. For example: "Sunday" */
  Wide,
  /** 2 characters for `en-US`, For example: "Su" */
  Short
}

/**
 * Ширина строки доступна для форматов даты и времени.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для `en-US` ан-США.
 *
 *  @see `getLocaleDateFormat()`
 *  @see `getLocaleTimeFormat()``.@see `getLocaleDateTimeFormat () `
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 * @publicApi
 */
export enum FormatWidth {
  /**
   * For `en-US`, 'M/d/yy, h:mm a'`
   * (Example: `6/15/15, 9:03 AM`)
   */
  Short,
  /**
   * For `en-US`, `'MMM d, y, h:mm:ss a'`
   * (Example: `Jun 15, 2015, 9:03:01 AM`)
   */
  Medium,
  /**
   * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
   * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
   */
  Long,
  /**
   * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
   * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
   */
  Full
}

/**
 * Символы, которые можно использовать для замены заполнителей в шаблонах чисел.
 * Примеры основаны на значениях `en-US`.
 *
 *  @see `getLocaleNumberSymbol()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberSymbol {
  /**
   * Decimal separator.
   * For `en-US`, the dot character.
   * Example : 2,345`.`67
   */
  Decimal,
  /**
   * Grouping separator, typically for thousands.
   * For `en-US`, the comma character.
   * Example: 2`,`345.67
   */
  Group,
  /**
   * List-item separator.
   * Example: "one, two, and three"
   */
  List,
  /**
   * Sign for percentage (out of 100).
   * Example: 23.4%
   */
  PercentSign,
  /**
   * Sign for positive numbers.
   * Example: +23
   */
  PlusSign,
  /**
   * Sign for negative numbers.
   * Example: -23
   */
  MinusSign,
  /**
   * Computer notation for exponential value (n times a power of 10).
   * Example: 1.2E3
   */
  Exponential,
  /**
   * Human-readable format of exponential.
   * Example: 1.2x103
   */
  SuperscriptingExponent,
  /**
   * Sign for permille (out of 1000).
   * Example: 23.4‰
   */
  PerMille,
  /**
   * Infinity, can be used with plus and minus.
   * Example: ∞, +∞, -∞
   */
  Infinity,
  /**
   * Not a number.
   * Example: NaN
   */
  NaN,
  /**
   * Symbol used between time units.
   * Example: 10:52
   */
  TimeSeparator,
  /**
   * Decimal separator for currency values (fallback to `Decimal`).
   * Example: $2,345.67
   */
  CurrencyDecimal,
  /**
   * Group separator for currency values (fallback to `Group`).
   * Example: $2,345.67
   */
  CurrencyGroup
}

/**
 * Значение для каждого дня недели, на основе `en-US` языка.
 *
 * @publicApi
 */
export enum WeekDay {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

/**
 * Получает идентификатор локали из загруженной в данный момент локали.
 * Загруженный язык может быть, например, глобальным, а не региональным.
 *  @param locale Код локали, такой как `fr-FR`.
 *  @returns Код локали. Например, `fr`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleId(locale: string): string {
  return ɵfindLocaleData(locale)[ɵLocaleDataIndex.LocaleId];
}

/**
 * Получает строки дневного периода для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных периодических строк. Например,`[AM, PM] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const amPmData = <[string, string][][]>[
    data[ɵLocaleDataIndex.DayPeriodsFormat], data[ɵLocaleDataIndex.DayPeriodsStandalone]
  ];
  const amPm = getLastDefinedValue(amPmData, formStyle);
  return getLastDefinedValue(amPm, width);
}

/**
 * Получает дни недели для данной локали, используя григорианский календарь.
 *
 * @param locale Код локали для используемых правил формата локали.
 * @param formStyle Обязательная грамматическая форма.
 * @param ширина Требуемая ширина символа.
 * @returns Массив локализованных именных строк.
 * Например,`[Sunday, Monday, ... Saturday] `для` en-US`ан-США.
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const daysData =
      <string[][][]>[data[ɵLocaleDataIndex.DaysFormat], data[ɵLocaleDataIndex.DaysStandalone]];
  const days = getLastDefinedValue(daysData, formStyle);
  return getLastDefinedValue(days, width);
}

/**
 * Получает месяцы года для данной локали, используя григорианский календарь.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных именных строк.
 * Например,`[January, February, ...] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleMonthNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const monthsData =
      <string[][][]>[data[ɵLocaleDataIndex.MonthsFormat], data[ɵLocaleDataIndex.MonthsStandalone]];
  const months = getLastDefinedValue(monthsData, formStyle);
  return getLastDefinedValue(months, width);
}

/**
 * Получает эры григорианского календаря для данной локали.
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *
 *  @returns Массив локализованных строк эпохи.
 * Например,`[AD, BC] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleEraNames(locale: string, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const erasData = <[string, string][]>data[ɵLocaleDataIndex.Eras];
  return getLastDefinedValue(erasData, width);
}

/**
 * Получает первый день недели для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Ряд индекса дня, используя 0основе индекса буднего дня для `en-US`
 * (Воскресенье = 0, понедельник = 1, ...).
 * Например, для `fr-FR` возвращает 1, чтобы указать, что первым днем является понедельник.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleFirstDayOfWeek(locale: string): WeekDay {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.FirstDayOfWeek];
}

/**
 * Диапазон дней недели, которые считаются выходными для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Диапазон значений дня,`[startDay, endDay]`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleWeekEndRange(locale: string): [WeekDay, WeekDay] {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.WeekendRange];
}

/**
 * Получает локализованную строку форматирования значения даты.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная форматирующая строка.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.DateFormat], width);
}

/**
 * Извлекает локализованную строку форматирования значения времени.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная строка форматирования.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.TimeFormat], width);
}

/**
 * Получает локализованную строку форматирования даты и времени.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная строка форматирования.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  const dateTimeFormatData = <string[]>data[ɵLocaleDataIndex.DateTimeFormat];
  return getLastDefinedValue(dateTimeFormatData, width);
}

/**
 * Получает локализованный символ числа, который можно использовать для замены заполнителей в числовых форматах.
 *  @param locale Код локали.
 *  @param символ Символ для локализации.
 *  @returns Символ для локализованного символа.
 *  @see `NumberSymbol`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberSymbol(locale: string, symbol: NumberSymbol): string {
  const data = ɵfindLocaleData(locale);
  const res = data[ɵLocaleDataIndex.NumberSymbols][symbol];
  if (typeof res === 'undefined') {
    if (symbol === NumberSymbol.CurrencyDecimal) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
    } else if (symbol === NumberSymbol.CurrencyGroup) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Group];
    }
  }
  return res;
}

/**
 * Получает числовой формат для заданной локали.
 *
 * Числа форматируются с использованием шаблонов, таких как `#,###.00` . Например, шаблон `#,###.00`
 * при использовании для форматирования числа 12345,678 может привести к "12'345,678". Это произойдет, если
 * разделитель группировки для вашего языка - апостроф, а десятичный разделитель - запятая.
 *
 *  <b>Важный:</b>Символы `.``,` `0` `#`(и другие ниже) являются специальными заполнителями
 * которые обозначают десятичный разделитель и т. д. и НЕ являются реальными символами.
 * Вы НЕ должны «переводить» заполнители. Например, не меняйте `.` в `,` хотя в
 * на вашем языке десятичная точка пишется через запятую. Символы должны быть заменены на
 * местные эквиваленты, используя соответствующий `NumberSymbol` для вашего языка.
 *
 * Вот специальные символыиспользуемые в шаблонахномера:.
 *
 * | Символ | Значение |
 * | -------- | --------- |
 * | , | Заменяется автоматически на символ, используемый для десятичной точки. |
 * | , | Заменен «группирующим» (тысячным) разделителем. |
 * | 0 | Заменяется на цифру (или ноль, если цифр недостаточно). |
 * |# | Заменяется цифрой (или ничем, если их недостаточно). |
 * | ¤ | Заменяется символом валюты, таким как $ или USD. |
 * | % | Отмечает процентный формат. Символ% может изменить положение, но его следует сохранить. |
 * | E | Отмечает научный формат. Символ E может изменить положение, но его следует сохранить. |
 * | '| Специальные символы, используемые в качестве буквенных символов, заключаются в одинарные кавычки ASCII. |
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param Тип Типа числового значения для форматирования (например, `Decimal` или `Currency` валюты.).
 *  @returns Локализованная строка формата.
 *  @see `NumberFormatStyle`
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/number-patterns)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberFormat(locale: string, type: NumberFormatStyle): string {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.NumberFormats][type];
}

/**
 * Получает символ, используемый для представления валюты основной страны
 * соответствует данной локали. Например, «$» для `en-US`.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Локализованный символ персонажа
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencySymbol(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencySymbol] || null;
}

/**
 * Получает название валюты для основной страны, соответствующей
 * в данный регион. Например, «Доллар США» для `en-US`.
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Название валюты
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencyName(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencyName] || null;
}

/**
 * Получает код валюты по умолчанию для данной локали.
 *
 * По умолчанию определяется как первая валюта, которая все еще используется.
 *
 *  @param locale Код локали, код валюты которой мы хотим.
 *  @returns Код валюты по умолчанию для данной локали.
 *
 * @publicApi
 */
export function getLocaleCurrencyCode(locale: string): string|null {
  return ɵgetLocaleCurrencyCode(locale);
}

/**
 * Retrieves the currency values for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The currency values.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
function getLocaleCurrencies(locale: string): {[code: string]: CurrenciesSymbols} {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Currencies];
}

/**
 * @alias core/ɵgetLocalePluralCase
 * @publicApi
 */
export const getLocalePluralCase: (locale: string) => ((value: number) => Plural) =
    ɵgetLocalePluralCase;

function checkFullData(data: any) {
  if (!data[ɵLocaleDataIndex.ExtraData]) {
    throw new Error(`Missing extra locale data for the locale "${
        data[ɵLocaleDataIndex
                 .LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`);
  }
}

/**
 * Извлекает специфичные для локали правила, используемые для определения того, какой период дня использовать
 * когда для локали определено более одного периода.
 *
 * Существует правило для каждого определенного периода дня.
 * первое правило применяется к периоду первого дня и так далее.
 * Вернитесь к AM / PM, когда нет доступных правил.
 *
 * Правило может указывать период как диапазон времени или как одно значение времени.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Правила для местности, одно значение времени или массива offrom время, довремени,.
 * или ноль, если нет доступных периодов.
 *
 *  @see `getLocaleExtraDayPeriods()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriodRules(locale: string): (Time|[Time, Time])[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const rules = data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodsRules] || [];
  return rules.map((rule: string|[string, string]) => {
    if (typeof rule === 'string') {
      return extractTime(rule);
    }
    return [extractTime(rule[0]), extractTime(rule[1])];
  });
}

/**
 * Извлекает специфичные для локали дневные периоды, которые приблизительно показывают, как день разбивается
 * на разных языках.
 * Например, для `en-US` периоды: утро, полдень, день, вечер и полночь.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Переведенные строки дневного периода.
 *  @see `getLocaleExtraDayPeriodRules()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const dayPeriodsData = <string[][][]>[
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodFormats],
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodStandalone]
  ];
  const dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
  return getLastDefinedValue(dayPeriods, width) || [];
}

/**
 * Получает направление записи указанной локали
 *  @param locale Код локали для используемых правил формата локали.
 * @publicApi
 * @returns 'rtl' or 'ltr'
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
export function getLocaleDirection(locale: string): 'ltr'|'rtl' {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Directionality];
}

/**
 * Извлекает первое значение, определенное в массиве, начиная с позиции индекса.
 *
 * Во избежание повторения одних и тех же данных (например, когда формы "format" и "standalone" совпадают)
 * добавьте первое значение к массивам данных локали и добавьте другие значения, только если они отличаются.
 *
 *  @param data Массив данных для извлечения.
 *  @param index Индекс на основе 0 в массив для начала.
 *  @returns Значение непосредственно перед заданной позицией индекса.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
function getLastDefinedValue<T>(data: T[], index: number): T {
  for (let i = index; i > -1; i--) {
    if (typeof data[i] !== 'undefined') {
      return data[i];
    }
  }
  throw new Error('Locale data API: locale data undefined');
}

/**
 * Представляет значение времени в часах и минутах.
 *
 * @publicApi
 */
export type Time = {
  hours: number,
  minutes: number
};

/**
 * Extracts the hours and minutes from a string like "15:45"
 */
function extractTime(time: string): Time {
  const [h, m] = time.split(':');
  return {hours: +h, minutes: +m};
}



/**
 * Получает символ валюты для данного кода валюты.
 *
 * Например, для значения по умолчанию `en-US` локали, код `USD` может.
 * быть представлен узким символом `/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵCurrencyIndex, ɵExtraLocaleDataIndex, ɵfindLocaleData, ɵgetLocaleCurrencyCode, ɵgetLocalePluralCase, ɵLocaleDataIndex} from '@angular/core';

import {CURRENCIES_EN, CurrenciesSymbols} from './currencies';


/**
 * Стили форматирования, которые можно использовать для представления чисел.
 *  @see `getLocaleNumberFormat()`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberFormatStyle {
  Decimal,
  Percent,
  Currency,
  Scientific
}

/**
 * Случаи множественности, используемые для перевода множественного числа на разные языки.
 *
 *  @see `NgPlural`
 *  @see `NgPluralCase`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum Plural {
  Zero = 0,
  One = 1,
  Two = 2,
  Few = 3,
  Many = 4,
  Other = 5,
}

/**
 * Контекстно-зависимые формы перевода для строк.
 * Обычно автономная версия предназначена для именительной формы слова
 * и версия формата используется для родительного падежа.
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum FormStyle {
  Format,
  Standalone
}

/**
 * Ширина строк доступна для переводов.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для слова «воскресенье» на английском языке.
 *
 * @publicApi
 */
export enum TranslationWidth {
  /** 1 character for `en-US`. For example: 'S' */
  Narrow,
  /** 3 characters for `en-US`. For example: 'Sun' */
  Abbreviated,
  /** Full length for `en-US`. For example: "Sunday" */
  Wide,
  /** 2 characters for `en-US`, For example: "Su" */
  Short
}

/**
 * Ширина строки доступна для форматов даты и времени.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для `en-US` ан-США.
 *
 *  @see `getLocaleDateFormat()`
 *  @see `getLocaleTimeFormat()``.@see `getLocaleDateTimeFormat () `
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 * @publicApi
 */
export enum FormatWidth {
  /**
   * For `en-US`, 'M/d/yy, h:mm a'`
   * (Example: `6/15/15, 9:03 AM`)
   */
  Short,
  /**
   * For `en-US`, `'MMM d, y, h:mm:ss a'`
   * (Example: `Jun 15, 2015, 9:03:01 AM`)
   */
  Medium,
  /**
   * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
   * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
   */
  Long,
  /**
   * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
   * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
   */
  Full
}

/**
 * Символы, которые можно использовать для замены заполнителей в шаблонах чисел.
 * Примеры основаны на значениях `en-US`.
 *
 *  @see `getLocaleNumberSymbol()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberSymbol {
  /**
   * Decimal separator.
   * For `en-US`, the dot character.
   * Example : 2,345`.`67
   */
  Decimal,
  /**
   * Grouping separator, typically for thousands.
   * For `en-US`, the comma character.
   * Example: 2`,`345.67
   */
  Group,
  /**
   * List-item separator.
   * Example: "one, two, and three"
   */
  List,
  /**
   * Sign for percentage (out of 100).
   * Example: 23.4%
   */
  PercentSign,
  /**
   * Sign for positive numbers.
   * Example: +23
   */
  PlusSign,
  /**
   * Sign for negative numbers.
   * Example: -23
   */
  MinusSign,
  /**
   * Computer notation for exponential value (n times a power of 10).
   * Example: 1.2E3
   */
  Exponential,
  /**
   * Human-readable format of exponential.
   * Example: 1.2x103
   */
  SuperscriptingExponent,
  /**
   * Sign for permille (out of 1000).
   * Example: 23.4‰
   */
  PerMille,
  /**
   * Infinity, can be used with plus and minus.
   * Example: ∞, +∞, -∞
   */
  Infinity,
  /**
   * Not a number.
   * Example: NaN
   */
  NaN,
  /**
   * Symbol used between time units.
   * Example: 10:52
   */
  TimeSeparator,
  /**
   * Decimal separator for currency values (fallback to `Decimal`).
   * Example: $2,345.67
   */
  CurrencyDecimal,
  /**
   * Group separator for currency values (fallback to `Group`).
   * Example: $2,345.67
   */
  CurrencyGroup
}

/**
 * Значение для каждого дня недели, на основе `en-US` языка.
 *
 * @publicApi
 */
export enum WeekDay {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

/**
 * Получает идентификатор локали из загруженной в данный момент локали.
 * Загруженный язык может быть, например, глобальным, а не региональным.
 *  @param locale Код локали, такой как `fr-FR`.
 *  @returns Код локали. Например, `fr`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleId(locale: string): string {
  return ɵfindLocaleData(locale)[ɵLocaleDataIndex.LocaleId];
}

/**
 * Получает строки дневного периода для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных периодических строк. Например,`[AM, PM] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const amPmData = <[string, string][][]>[
    data[ɵLocaleDataIndex.DayPeriodsFormat], data[ɵLocaleDataIndex.DayPeriodsStandalone]
  ];
  const amPm = getLastDefinedValue(amPmData, formStyle);
  return getLastDefinedValue(amPm, width);
}

/**
 * Получает дни недели для данной локали, используя григорианский календарь.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных именных строк.
 * Например,`[Sunday, Monday, ... Saturday] `для` en-US`ан-США.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const daysData =
      <string[][][]>[data[ɵLocaleDataIndex.DaysFormat], data[ɵLocaleDataIndex.DaysStandalone]];
  const days = getLastDefinedValue(daysData, formStyle);
  return getLastDefinedValue(days, width);
}

/**
 * Получает месяцы года для данной локали, используя григорианский календарь.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных именных строк.
 * Например,`[January, February, ...] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleMonthNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const monthsData =
      <string[][][]>[data[ɵLocaleDataIndex.MonthsFormat], data[ɵLocaleDataIndex.MonthsStandalone]];
  const months = getLastDefinedValue(monthsData, formStyle);
  return getLastDefinedValue(months, width);
}

/**
 * Получает эры григорианского календаря для данной локали.
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *
 *  @returns Массив локализованных строк эпохи.
 * Например,`[AD, BC] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleEraNames(locale: string, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const erasData = <[string, string][]>data[ɵLocaleDataIndex.Eras];
  return getLastDefinedValue(erasData, width);
}

/**
 * Получает первый день недели для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Ряд индекса дня, используя 0основе индекса буднего дня для `en-US`
 * (Воскресенье = 0, понедельник = 1, ...).
 * Например, для `fr-FR` возвращает 1, чтобы указать, что первым днем является понедельник.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleFirstDayOfWeek(locale: string): WeekDay {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.FirstDayOfWeek];
}

/**
 * Диапазон дней недели, которые считаются выходными для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Диапазон значений дня,`[startDay, endDay]`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleWeekEndRange(locale: string): [WeekDay, WeekDay] {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.WeekendRange];
}

/**
 * Получает локализованную строку форматирования значения даты.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная форматирующая строка.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.DateFormat], width);
}

/**
 * Извлекает локализованную строку форматирования значения времени.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная строка форматирования.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.TimeFormat], width);
}

/**
 * Получает локализованную строку форматирования даты и времени.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная строка форматирования.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  const dateTimeFormatData = <string[]>data[ɵLocaleDataIndex.DateTimeFormat];
  return getLastDefinedValue(dateTimeFormatData, width);
}

/**
 * Получает локализованный символ числа, который можно использовать для замены заполнителей в числовых форматах.
 *  @param locale Код локали.
 *  @param символ Символ для локализации.
 *  @returns Символ для локализованного символа.
 *  @see `NumberSymbol`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberSymbol(locale: string, symbol: NumberSymbol): string {
  const data = ɵfindLocaleData(locale);
  const res = data[ɵLocaleDataIndex.NumberSymbols][symbol];
  if (typeof res === 'undefined') {
    if (symbol === NumberSymbol.CurrencyDecimal) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
    } else if (symbol === NumberSymbol.CurrencyGroup) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Group];
    }
  }
  return res;
}

/**
 * Получает числовой формат для заданной локали.
 *
 * Числа форматируются с использованием шаблонов, таких как `#,###.00` . Например, шаблон `#,###.00`
 * при использовании для форматирования числа 12345,678 может привести к "12'345,678". Это произойдет, если
 * разделитель группировки для вашего языка - апостроф, а десятичный разделитель - запятая.
 *
 *  <b>Важный:</b>Символы `.``,` `0` `#`(и другие ниже) являются специальными заполнителями
 * которые обозначают десятичный разделитель и т. д. и НЕ являются реальными символами.
 * Вы НЕ должны «переводить» заполнители. Например, не меняйте `.` в `,` хотя в
 * на вашем языке десятичная точка пишется через запятую. Символы должны быть заменены на
 * местные эквиваленты, используя соответствующий `NumberSymbol` для вашего языка.
 *
 * Вот специальные символыиспользуемые в шаблонахномера:.
 *
 * | Символ | Значение |
 * | -------- | --------- |
 * | , | Заменяется автоматически на символ, используемый для десятичной точки. |
 * | , | Заменен «группирующим» (тысячным) разделителем. |
 * | 0 | Заменяется на цифру (или ноль, если цифр недостаточно). |
 * |# | Заменяется цифрой (или ничем, если их недостаточно). |
 * | ¤ | Заменяется символом валюты, таким как $ или USD. |
 * | % | Отмечает процентный формат. Символ% может изменить положение, но его следует сохранить. |
 * | E | Отмечает научный формат. Символ E может изменить положение, но его следует сохранить. |
 * | '| Специальные символы, используемые в качестве буквенных символов, заключаются в одинарные кавычки ASCII. |
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param Тип Типа числового значения для форматирования (например, `Decimal` или `Currency` валюты.).
 *  @returns Локализованная строка формата.
 *  @see `NumberFormatStyle`
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/number-patterns)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberFormat(locale: string, type: NumberFormatStyle): string {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.NumberFormats][type];
}

/**
 * Получает символ, используемый для представления валюты основной страны
 * соответствует данной локали. Например, «$» для `en-US`.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Локализованный символ персонажа
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencySymbol(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencySymbol] || null;
}

/**
 * Получает название валюты для основной страны, соответствующей
 * в данный регион. Например, «Доллар США» для `en-US`.
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Название валюты
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencyName(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencyName] || null;
}

/**
 * Получает код валюты по умолчанию для данной локали.
 *
 * По умолчанию определяется как первая валюта, которая все еще используется.
 *
 *  @param locale Код локали, код валюты которой мы хотим.
 *  @returns Код валюты по умолчанию для данной локали.
 *
 * @publicApi
 */
export function getLocaleCurrencyCode(locale: string): string|null {
  return ɵgetLocaleCurrencyCode(locale);
}

/**
 * Retrieves the currency values for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The currency values.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
function getLocaleCurrencies(locale: string): {[code: string]: CurrenciesSymbols} {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Currencies];
}

/**
 * @alias core/ɵgetLocalePluralCase
 * @publicApi
 */
export const getLocalePluralCase: (locale: string) => ((value: number) => Plural) =
    ɵgetLocalePluralCase;

function checkFullData(data: any) {
  if (!data[ɵLocaleDataIndex.ExtraData]) {
    throw new Error(`Missing extra locale data for the locale "${
        data[ɵLocaleDataIndex
                 .LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`);
  }
}

/**
 * Извлекает специфичные для локали правила, используемые для определения того, какой период дня использовать
 * когда для локали определено более одного периода.
 *
 * Существует правило для каждого определенного периода дня.
 * первое правило применяется к периоду первого дня и так далее.
 * Вернитесь к AM / PM, когда нет доступных правил.
 *
 * Правило может указывать период как диапазон времени или как одно значение времени.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Правила для местности, одно значение времени или массива offrom время, довремени,.
 * или ноль, если нет доступных периодов.
 *
 *  @see `getLocaleExtraDayPeriods()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriodRules(locale: string): (Time|[Time, Time])[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const rules = data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodsRules] || [];
  return rules.map((rule: string|[string, string]) => {
    if (typeof rule === 'string') {
      return extractTime(rule);
    }
    return [extractTime(rule[0]), extractTime(rule[1])];
  });
}

/**
 * Извлекает специфичные для локали дневные периоды, которые приблизительно показывают, как день разбивается
 * на разных языках.
 * Например, для `en-US` периоды: утро, полдень, день, вечер и полночь.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Переведенные строки дневного периода.
 *  @see `getLocaleExtraDayPeriodRules()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const dayPeriodsData = <string[][][]>[
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodFormats],
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodStandalone]
  ];
  const dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
  return getLastDefinedValue(dayPeriods, width) || [];
}

/**
 * Получает направление записи указанной локали
 *  @param locale Код локали для используемых правил формата локали.
 * @publicApi
 * @returns 'rtl' or 'ltr'
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
export function getLocaleDirection(locale: string): 'ltr'|'rtl' {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Directionality];
}

/**
 * Извлекает первое значение, определенное в массиве, начиная с позиции индекса.
 *
 * Во избежание повторения одних и тех же данных (например, когда формы "format" и "standalone" совпадают)
 * добавьте первое значение к массивам данных локали и добавьте другие значения, только если они отличаются.
 *
 *  @param data Массив данных для извлечения.
 *  @param index Индекс на основе 0 в массив для начала.
 *  @returns Значение непосредственно перед заданной позицией индекса.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
function getLastDefinedValue<T>(data: T[], index: number): T {
  for (let i = index; i > -1; i--) {
    if (typeof data[i] !== 'undefined') {
      return data[i];
    }
  }
  throw new Error('Locale data API: locale data undefined');
}

/**
 * Представляет значение времени в часах и минутах.
 *
 * @publicApi
 */
export type Time = {
  hours: number,
  minutes: number
};

/**
 * Extracts the hours and minutes from a string like "15:45"
 */
function extractTime(time: string): Time {
  const [h, m] = time.split(':');
  return {hours: +h, minutes: +m};
}



/**
 или широким символом `US/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵCurrencyIndex, ɵExtraLocaleDataIndex, ɵfindLocaleData, ɵgetLocaleCurrencyCode, ɵgetLocalePluralCase, ɵLocaleDataIndex} from '@angular/core';

import {CURRENCIES_EN, CurrenciesSymbols} from './currencies';


/**
 * Стили форматирования, которые можно использовать для представления чисел.
 *  @see `getLocaleNumberFormat()`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberFormatStyle {
  Decimal,
  Percent,
  Currency,
  Scientific
}

/**
 * Случаи множественности, используемые для перевода множественного числа на разные языки.
 *
 *  @see `NgPlural`
 *  @see `NgPluralCase`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum Plural {
  Zero = 0,
  One = 1,
  Two = 2,
  Few = 3,
  Many = 4,
  Other = 5,
}

/**
 * Контекстно-зависимые формы перевода для строк.
 * Обычно автономная версия предназначена для именительной формы слова
 * и версия формата используется для родительного падежа.
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/date-time#TOC-Stand-Alone-vs.-Format-Styles)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum FormStyle {
  Format,
  Standalone
}

/**
 * Ширина строк доступна для переводов.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для слова «воскресенье» на английском языке.
 *
 * @publicApi
 */
export enum TranslationWidth {
  /** 1 character for `en-US`. For example: 'S' */
  Narrow,
  /** 3 characters for `en-US`. For example: 'Sun' */
  Abbreviated,
  /** Full length for `en-US`. For example: "Sunday" */
  Wide,
  /** 2 characters for `en-US`, For example: "Su" */
  Short
}

/**
 * Ширина строки доступна для форматов даты и времени.
 * Конкретная ширина символов зависит от региона.
 * Примеры приведены для `en-US` ан-США.
 *
 *  @see `getLocaleDateFormat()`
 *  @see `getLocaleTimeFormat()``.@see `getLocaleDateTimeFormat () `
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 * @publicApi
 */
export enum FormatWidth {
  /**
   * For `en-US`, 'M/d/yy, h:mm a'`
   * (Example: `6/15/15, 9:03 AM`)
   */
  Short,
  /**
   * For `en-US`, `'MMM d, y, h:mm:ss a'`
   * (Example: `Jun 15, 2015, 9:03:01 AM`)
   */
  Medium,
  /**
   * For `en-US`, `'MMMM d, y, h:mm:ss a z'`
   * (Example: `June 15, 2015 at 9:03:01 AM GMT+1`)
   */
  Long,
  /**
   * For `en-US`, `'EEEE, MMMM d, y, h:mm:ss a zzzz'`
   * (Example: `Monday, June 15, 2015 at 9:03:01 AM GMT+01:00`)
   */
  Full
}

/**
 * Символы, которые можно использовать для замены заполнителей в шаблонах чисел.
 * Примеры основаны на значениях `en-US`.
 *
 *  @see `getLocaleNumberSymbol()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export enum NumberSymbol {
  /**
   * Decimal separator.
   * For `en-US`, the dot character.
   * Example : 2,345`.`67
   */
  Decimal,
  /**
   * Grouping separator, typically for thousands.
   * For `en-US`, the comma character.
   * Example: 2`,`345.67
   */
  Group,
  /**
   * List-item separator.
   * Example: "one, two, and three"
   */
  List,
  /**
   * Sign for percentage (out of 100).
   * Example: 23.4%
   */
  PercentSign,
  /**
   * Sign for positive numbers.
   * Example: +23
   */
  PlusSign,
  /**
   * Sign for negative numbers.
   * Example: -23
   */
  MinusSign,
  /**
   * Computer notation for exponential value (n times a power of 10).
   * Example: 1.2E3
   */
  Exponential,
  /**
   * Human-readable format of exponential.
   * Example: 1.2x103
   */
  SuperscriptingExponent,
  /**
   * Sign for permille (out of 1000).
   * Example: 23.4‰
   */
  PerMille,
  /**
   * Infinity, can be used with plus and minus.
   * Example: ∞, +∞, -∞
   */
  Infinity,
  /**
   * Not a number.
   * Example: NaN
   */
  NaN,
  /**
   * Symbol used between time units.
   * Example: 10:52
   */
  TimeSeparator,
  /**
   * Decimal separator for currency values (fallback to `Decimal`).
   * Example: $2,345.67
   */
  CurrencyDecimal,
  /**
   * Group separator for currency values (fallback to `Group`).
   * Example: $2,345.67
   */
  CurrencyGroup
}

/**
 * Значение для каждого дня недели, на основе `en-US` языка.
 *
 * @publicApi
 */
export enum WeekDay {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday
}

/**
 * Получает идентификатор локали из загруженной в данный момент локали.
 * Загруженный язык может быть, например, глобальным, а не региональным.
 *  @param locale Код локали, такой как `fr-FR`.
 *  @returns Код локали. Например, `fr`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleId(locale: string): string {
  return ɵfindLocaleData(locale)[ɵLocaleDataIndex.LocaleId];
}

/**
 * Получает строки дневного периода для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных периодических строк. Например,`[AM, PM] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const amPmData = <[string, string][][]>[
    data[ɵLocaleDataIndex.DayPeriodsFormat], data[ɵLocaleDataIndex.DayPeriodsStandalone]
  ];
  const amPm = getLastDefinedValue(amPmData, formStyle);
  return getLastDefinedValue(amPm, width);
}

/**
 * Получает дни недели для данной локали, используя григорианский календарь.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных именных строк.
 * Например,`[Sunday, Monday, ... Saturday] `для` en-US`ан-США.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDayNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const daysData =
      <string[][][]>[data[ɵLocaleDataIndex.DaysFormat], data[ɵLocaleDataIndex.DaysStandalone]];
  const days = getLastDefinedValue(daysData, formStyle);
  return getLastDefinedValue(days, width);
}

/**
 * Получает месяцы года для данной локали, используя григорианский календарь.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param formStyle Обязательная грамматическая форма.
 *  @param ширина Требуемая ширина символа.
 *  @returns Массив локализованных именных строк.
 * Например,`[January, February, ...] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleMonthNames(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  const monthsData =
      <string[][][]>[data[ɵLocaleDataIndex.MonthsFormat], data[ɵLocaleDataIndex.MonthsStandalone]];
  const months = getLastDefinedValue(monthsData, formStyle);
  return getLastDefinedValue(months, width);
}

/**
 * Получает эры григорианского календаря для данной локали.
 * @param locale Код локали для используемых правил формата локали.
 * @param formStyle Обязательная грамматическая форма.
 * @param ширина Требуемая ширина символа.
 *
 * @returns Массив локализованных строк эпохи.
 * Например,`[AD, BC] `для` en-US`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleEraNames(locale: string, width: TranslationWidth): [string, string] {
  const data = ɵfindLocaleData(locale);
  const erasData = <[string, string][]>data[ɵLocaleDataIndex.Eras];
  return getLastDefinedValue(erasData, width);
}

/**
 * Получает первый день недели для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Ряд индекса дня, используя 0основе индекса буднего дня для `en-US`
 * (Воскресенье = 0, понедельник = 1, ...).
 * Например, для `fr-FR` возвращает 1, чтобы указать, что первым днем является понедельник.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleFirstDayOfWeek(locale: string): WeekDay {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.FirstDayOfWeek];
}

/**
 * Диапазон дней недели, которые считаются выходными для данной локали.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Диапазон значений дня,`[startDay, endDay]`.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleWeekEndRange(locale: string): [WeekDay, WeekDay] {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.WeekendRange];
}

/**
 * Получает локализованную строку форматирования значения даты.
 *
 * @param locale Код локали для используемых правил формата локали.
 * @param ширина Тип формата.
 * @returns Локализованная форматирующая строка.
 * @see `FormatWidth`
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.DateFormat], width);
}

/**
 * Извлекает локализованную строку форматирования значения времени.
 *
 * @param locale Код локали для используемых правил формата локали.
 * @param ширина Тип формата.
 * @returns Локализованная строка форматирования.
 * @see `FormatWidth`
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  return getLastDefinedValue(data[ɵLocaleDataIndex.TimeFormat], width);
}

/**
 * Получает локализованную строку форматирования даты и времени.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param ширина Тип формата.
 *  @returns Локализованная строка форматирования.
 *  @see `FormatWidth`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleDateTimeFormat(locale: string, width: FormatWidth): string {
  const data = ɵfindLocaleData(locale);
  const dateTimeFormatData = <string[]>data[ɵLocaleDataIndex.DateTimeFormat];
  return getLastDefinedValue(dateTimeFormatData, width);
}

/**
 * Получает локализованный символ числа, который можно использовать для замены заполнителей в числовых форматах.
 *  @param locale Код локали.
 *  @param символ Символ для локализации.
 *  @returns Символ для локализованного символа.
 *  @see `NumberSymbol`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberSymbol(locale: string, symbol: NumberSymbol): string {
  const data = ɵfindLocaleData(locale);
  const res = data[ɵLocaleDataIndex.NumberSymbols][symbol];
  if (typeof res === 'undefined') {
    if (symbol === NumberSymbol.CurrencyDecimal) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Decimal];
    } else if (symbol === NumberSymbol.CurrencyGroup) {
      return data[ɵLocaleDataIndex.NumberSymbols][NumberSymbol.Group];
    }
  }
  return res;
}

/**
 * Получает числовой формат для заданной локали.
 *
 * Числа форматируются с использованием шаблонов, таких как `#,###.00` . Например, шаблон `#,###.00`
 * при использовании для форматирования числа 12345,678 может привести к "12'345,678". Это произойдет, если
 * разделитель группировки для вашего языка - апостроф, а десятичный разделитель - запятая.
 *
 *  <b>Важный:</b>Символы `.``,` `0` `#`(и другие ниже) являются специальными заполнителями
 * которые обозначают десятичный разделитель и т. д. и НЕ являются реальными символами.
 * Вы НЕ должны «переводить» заполнители. Например, не меняйте `.` в `,` хотя в
 * на вашем языке десятичная точка пишется через запятую. Символы должны быть заменены на
 * местные эквиваленты, используя соответствующий `NumberSymbol` для вашего языка.
 *
 * Вот специальные символыиспользуемые в шаблонахномера:.
 *
 * | Символ | Значение |
 * | -------- | --------- |
 * | , | Заменяется автоматически на символ, используемый для десятичной точки. |
 * | , | Заменен «группирующим» (тысячным) разделителем. |
 * | 0 | Заменяется на цифру (или ноль, если цифр недостаточно). |
 * |# | Заменяется цифрой (или ничем, если их недостаточно). |
 * | ¤ | Заменяется символом валюты, таким как $ или USD. |
 * | % | Отмечает процентный формат. Символ% может изменить положение, но его следует сохранить. |
 * | E | Отмечает научный формат. Символ E может изменить положение, но его следует сохранить. |
 * | '| Специальные символы, используемые в качестве буквенных символов, заключаются в одинарные кавычки ASCII. |
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @param Тип Типа числового значения для форматирования (например, `Decimal` или `Currency` валюты.).
 *  @returns Локализованная строка формата.
 *  @see `NumberFormatStyle`
 *  @see [Веб-сайт CLDR](http://cldr.unicode.org/translation/number-patterns)
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleNumberFormat(locale: string, type: NumberFormatStyle): string {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.NumberFormats][type];
}

/**
 * Получает символ, используемый для представления валюты основной страны
 * соответствует данной локали. Например, «$» для `en-US`.
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Локализованный символ персонажа
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencySymbol(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencySymbol] || null;
}

/**
 * Получает название валюты для основной страны, соответствующей
 * в данный регион. Например, «Доллар США» для `en-US`.
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Название валюты
 * или `null` если основная страна не может быть определена.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleCurrencyName(locale: string): string|null {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.CurrencyName] || null;
}

/**
 * Получает код валюты по умолчанию для данной локали.
 *
 * По умолчанию определяется как первая валюта, которая все еще используется.
 *
 *  @param locale Код локали, код валюты которой мы хотим.
 *  @returns Код валюты по умолчанию для данной локали.
 *
 * @publicApi
 */
export function getLocaleCurrencyCode(locale: string): string|null {
  return ɵgetLocaleCurrencyCode(locale);
}

/**
 * Retrieves the currency values for a given locale.
 * @param locale A locale code for the locale format rules to use.
 * @returns The currency values.
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
function getLocaleCurrencies(locale: string): {[code: string]: CurrenciesSymbols} {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Currencies];
}

/**
 * @alias core/ɵgetLocalePluralCase
 * @publicApi
 */
export const getLocalePluralCase: (locale: string) => ((value: number) => Plural) =
    ɵgetLocalePluralCase;

function checkFullData(data: any) {
  if (!data[ɵLocaleDataIndex.ExtraData]) {
    throw new Error(`Missing extra locale data for the locale "${
        data[ɵLocaleDataIndex
                 .LocaleId]}". Use "registerLocaleData" to load new data. See the "I18n guide" on angular.io to know more.`);
  }
}

/**
 * Извлекает специфичные для локали правила, используемые для определения того, какой период дня использовать
 * когда для локали определено более одного периода.
 *
 * Существует правило для каждого определенного периода дня.
 * первое правило применяется к периоду первого дня и так далее.
 * Вернитесь к AM / PM, когда нет доступных правил.
 *
 * Правило может указывать период как диапазон времени или как одно значение времени.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 *  @param locale Код локали для используемых правил формата локали.
 *  @returns Правила для местности, одно значение времени или массива offrom время, довремени,.
 * или ноль, если нет доступных периодов.
 *
 *  @see `getLocaleExtraDayPeriods()`
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriodRules(locale: string): (Time|[Time, Time])[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const rules = data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodsRules] || [];
  return rules.map((rule: string|[string, string]) => {
    if (typeof rule === 'string') {
      return extractTime(rule);
    }
    return [extractTime(rule[0]), extractTime(rule[1])];
  });
}

/**
 * Извлекает специфичные для локали дневные периоды, которые приблизительно показывают, как день разбивается
 * на разных языках.
 * Например, для `en-US` периоды: утро, полдень, день, вечер и полночь.
 *
 * Эта функциональность доступна только тогда, когда вы загрузили полные данные локали.
 * Смотрите[«Руководство по I18n»](guide/i18n#i18n-pipes).
 *
 * @param locale Код локали для используемых правил формата локали.
 * @param formStyle Обязательная грамматическая форма.
 * @param ширина Требуемая ширина символа.
 * @returns Переведенные строки дневного периода.
 * @see `getLocaleExtraDayPeriodRules()`
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getLocaleExtraDayPeriods(
    locale: string, formStyle: FormStyle, width: TranslationWidth): string[] {
  const data = ɵfindLocaleData(locale);
  checkFullData(data);
  const dayPeriodsData = <string[][][]>[
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodFormats],
    data[ɵLocaleDataIndex.ExtraData][ɵExtraLocaleDataIndex.ExtraDayPeriodStandalone]
  ];
  const dayPeriods = getLastDefinedValue(dayPeriodsData, formStyle) || [];
  return getLastDefinedValue(dayPeriods, width) || [];
}

/**
 * Получает направление записи указанной локали
 * @param locale Код локали для используемых правил формата локали.
 * @publicApi
 * @returns 'rtl' or 'ltr'
 * @see [Internationalization (i18n) Guide](https://angular.io/guide/i18n)
 */
export function getLocaleDirection(locale: string): 'ltr'|'rtl' {
  const data = ɵfindLocaleData(locale);
  return data[ɵLocaleDataIndex.Directionality];
}

/**
 * Извлекает первое значение, определенное в массиве, начиная с позиции индекса.
 *
 * Во избежание повторения одних и тех же данных (например, когда формы "format" и "standalone" совпадают)
 * добавьте первое значение к массивам данных локали и добавьте другие значения, только если они отличаются.
 *
 * @param data Массив данных для извлечения.
 * @param index Индекс на основе 0 в массив для начала.
 * @returns Значение непосредственно перед заданной позицией индекса.
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
function getLastDefinedValue<T>(data: T[], index: number): T {
  for (let i = index; i > -1; i--) {
    if (typeof data[i] !== 'undefined') {
      return data[i];
    }
  }
  throw new Error('Locale data API: locale data undefined');
}

/**
 * Представляет значение времени в часах и минутах.
 *
 * @publicApi
 */
export type Time = {
  hours: number,
  minutes: number
};

/**
 * Extracts the hours and minutes from a string like "15:45"
 */
function extractTime(time: string): Time {
  const [h, m] = time.split(':');
  return {hours: +h, minutes: +m};
}



/**
 * Retrieves the currency symbol for a given currency code.
 *
 * For example, for the default `en-US` locale, the code `USD` can
 * be represented by the narrow symbol `$` or the wide symbol `US$`.
 *
 *  @param код Код валюты.
 *  @param формат Формат: `wide` или `narrow`.
 *  @param locale Код локали для используемых правил формата локали.
 *
 *  @returns Символ или код валюты, если символ недоступен.
 *  @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getCurrencySymbol(code: string, format: 'wide'|'narrow', locale = 'en'): string {
  const currency = getLocaleCurrencies(locale)[code] || CURRENCIES_EN[code] || [];
  const symbolNarrow = currency[ɵCurrencyIndex.SymbolNarrow];

  if (format === 'narrow' && typeof symbolNarrow === 'string') {
    return symbolNarrow;
  }

  return currency[ɵCurrencyIndex.Symbol] || code;
}

// Most currencies have cents, that's why the default is 2
const DEFAULT_NB_OF_CURRENCY_DIGITS = 2;

/**
 * Сообщает количество десятичных цифр для данной валюты.
 * Стоимость зависит от наличия центов в этой конкретной валюте.
 *
 * @param код Код валюты.
 * @returns Количество десятичных цифр, обычно 0 или 2
 * @see [(Интернационализация (i18n)Guide).](https://angular.io/guide/i18n)
 *
 * @publicApi
 */
export function getNumberOfCurrencyDigits(code: string): number {
  let digits;
  const currency = CURRENCIES_EN[code];
  if (currency) {
    digits = currency[ɵCurrencyIndex.NbOfDigits];
  }
  return typeof digits === 'number' ? digits : DEFAULT_NB_OF_CURRENCY_DIGITS;
}
