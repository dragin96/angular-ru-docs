/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '../i18n/format_date';
import {invalidPipeArgumentError} from './invalid_pipe_argument_error';

// clang-format off
/**
 *  @ngModule CommonModule
 *  @description
 *
 * Форматирует значение даты в соответствии с правилами локали.
 *
 * Только данные `en-US` поставляются с Angular. Локализовать даты
 * на другом языке вы должны импортировать соответствующие данные локали.
 * См.[Руководство I18n](guide/i18n#i18n-pipes)для получения дополнительной информации.
 *
 *  @see `formatDate()`
 *
 *
 *  @usageNotes
 *
 * Результат этого канала не переоценивается, когда ввод изменяется. Чтобы избежать необходимости
 * переформатируйте дату в каждом цикле обнаружения изменений, рассматривайте дату как неизменный объект
 * и измените задание, когда труба должна снова работать.
 *
 *  ### Предопределенные параметры формата
 *
 * Примеры приведены в `en-US` locale.
 *
 * - `'short'` : эквивалентно``'M/d/yy, h:mm a' `(` 6/15/15, 9:03 AM`),
 * - `'medium'` : эквивалентно``'MMM d, y, h:mm:ss a' `(` Jun 15, 2015, 9:03:01 AM`).
 * - `'long'` : эквивалентно``'MMMM d, y, h:mm:ss a z' `(` June 15, 2015 at 9:03:01 AM.GMT+1`).
 * - `'full'` : эквивалентно``'EEEE, MMMM d, y, h:mm:ss a zzzz' `(` Monday, June 15, 2015 at.9:03:01 AM GMT+01:00`).
 * - `'shortDate'` : эквивалентно` `'M/d/yy'` (`6/15/15`).
 * - `'mediumDate'` mediumDate: эквивалентно`'MMM d, y' `(` Jun 15, 2015`г.).
 * - `'longDate'` : эквивалентно``'MMMM d, y' `(` June 15, 2015``June 15, 2015`).
 * - `'fullDate'` : эквивалентно``'EEEE, MMMM d, y' `(` Monday, June 15, 2015``Monday, June 15, 2015`).
 * - `'shortTime'` : эквивалентно`'h:mm a' `(` 9:03 AM`).
 * - `'mediumTime'` : эквивалентно``'h:mm:ss a' `(` 9:03:01 AM`).
 * - `'longTime'` : эквивалентно``'h:mm:ss a z' `(` 9:03:01 AM GMT+1`).
 * - `'fullTime'` : эквивалентно``'h:mm:ss a zzzz' `(` 9:03:01 AM GMT+01:00`).
 *
 *  ### Пользовательские параметры формата
 *
 * Вы можете создать строку формата, используя символы для указания компонентов
 * значения даты и времени, как описано в следующей таблице.
 * Детали формата зависят от локали.
 * Поля, отмеченные (), доступны только в дополнительном наборе данных для данной локали.
 *
 * | Тип поля | Формат | Описание | Пример значения |
 * | -------------------- | ------------- | -------------- ------------------------------------------------- | -------------------------------------------------- ---------- |
 * | Эра | G, GG & GGG | Сокращенно | AD |
 * | | GGGG | Широкий | Анно Домини |
 * | | GGGGG | Узкий | A |
 * | Год | у | Числовой: минимальные цифры | 2, 20, 201, 2017, 20173 |
 * | | гг | Числовой: 2 цифры + дополненный нулями | 02, 20, 01, 17, 73 |
 * | | гггг | Числовой: 3 цифры + дополненный нулями | 002, 020, 201, 2017, 20173 |
 * | | гггг | Числовой: 4 цифры или более + с добавлением нуля | 0002, 0020, 0201, 2017, 20173 |
 * | Месяц | М | Числовой: 1 цифра | 9, 12 |
 * | | ММ | Числовой: 2 цифры + дополненный нулями | 09, 12 |
 * | | МММ | Сокращенно | Сент |
 * | | ММММ | Широкий | Сентябрь |
 * | | МММММ | Узкий | S |
 * | Месяц автономный | L | Числовой: 1 цифра | 9, 12 |
 * | | LL | Числовой: 2 цифры + дополненный нулями | 09, 12 |
 * | | LLL | Сокращенно | Сент |
 * | | LLLL | Широкий | Сентябрь |
 * | | LLLLL | Узкий | S |
 * | Неделя года | ш | Числовой: минимальные цифры |1... 53 |
 * | | WW | Числовой: 2 цифры + дополненный нулями | 01... 53 |
 * | Неделя месяца | W | Числовой: 1 цифра |1... 5 |
 * | День месяца | д | Числовой: минимальные цифры | 1 |
 * | | дд | Числовой: 2 цифры + дополненный нулями | 01 |
 * | День недели | E, EE & EEE | Сокращенно | Вт |
 * | | EEEE | Широкий | Вторник |
 * | | EEEEE | Узкий | T |
 * | | EEEEEE | Короткая | Ту |
 * | Период | аааааа | Сокращенно | утра / вечера или утра / вечера |
 * | | аааа | Широкий (отступление к `a` при отсутствии) | анте меридием / пост меридием |
 * | | ааааа | Узкий | а / п |
 * | Период | B, BB & BBB | Сокращенно | середина. |
 * | | BBBB | Широкий | утра, вечера, полночь, полдень, утро, день, вечер, ночь |
 * | | BBBBB | Узкий | MD |
 * | Период автономный | b, bb & bbb | Сокращенно | середина. |
 * | | BBBB | Широкий | утра, вечера, полночь, полдень, утро, день, вечер, ночь |
 * | | bbbbb | Узкий | MD |
 * | Час 1-12 | ч | Числовой: минимальные цифры | 1, 12 |
 * | | чч | Числовой: 2 цифры + дополненный нулями | 01, 12 |
 * | Час 0-23 | H | Числовой: минимальные цифры | 0, 23 |
 * | | ЧЧ | Числовой: 2 цифры + дополненный нулями | 00, 23 |
 * | Минута | м | Числовой: минимальные цифры | 8, 59 |
 * | | мм | Числовой: 2 цифры + дополненный нулями | 08, 59 |
 * | Второй | с | Числовой: минимальные цифры | 0 ... 59 |
 * | | сс | Числовой: 2 цифры + дополненный нулями | 00 ... 59 |
 * | Дробные секунды | S | Числовой: 1 цифра | 0 ... 9 |
 * | | СС | Числовой: 2 цифры + дополненный нулями | 00 ... 99 |
 * | | ССС | Числовой: 3 цифры + заполнение нулями (= миллисекунды) | 000 ... 999 |
 * | Зона | z, zz & zzz | Краткий специфический не локальный формат (откат к O) | GMT-8 |
 * | | zzzz | Длинный конкретный не локационный формат (откат к OOOO) | GMT-08: 00 |
 * | | Z, ZZ & ZZZ | ISO8601 базовый формат | -0800 |
 * | | ZZZZ | Лонг локализованный формат GMT | GMT-8: 00 |
 * | | ZZZZZ | Расширенный формат ISO8601 + индикатор Z для смещения 0 (= XXXXX) | -08: 00 |
 * | | О, ОО & ООО | Краткий локализованный формат GMT | GMT-8 |
 * | | ОООО | Лонг локализованный формат GMT | GMT-08: 00 |
 *
 * Обратите внимание, что коррекция часового пояса не применяется к строке ISO, в которой нет компонента времени, например «2016-09-19»
 *
 *  ### Примеры форматов
 *
 * Эти примеры преобразовывают дату в различные форматы
 * предполагая, что `dateObj` является JavaScript- `Date` для
 * Год выпуска: 2015, месяц: 6, день: 15, час: 21, минут: 43, второй:11,.
 * указано по местному времени для `en-US`.
 *
 *  ```
 *  {{ dateObj | date }}// output is 'Jun 15, 2015'
 *  {{ dateObj | date:'medium' }}// output is 'Jun 15, 2015, 9:43:11 PM'
 *  {{ dateObj | date:'shortTime' }}// output is '9:43 PM'
 *  {{ dateObj | date:'mm:ss' }}// output is '43:11'
 *  ```
 *
 *  ### Пример использования
 *
 * Следующий компонент использует конвейер даты для отображения текущей даты в разных форматах.
 *
 *  ```
 *  @Component({
 *   selector: 'date-pipe',
 *   template: `<div>
 *     <p>Today is {{today | date}}</p>
 *     <p>Or if you prefer, {{today | date:'fullDate'}}</p>
 *     <p>The time is {{today | date:'h:mm a z'}}</p>
 *   </div>`
 *  })
 *  // Get the current date and time as a date-time value.
 *  export class DatePipeComponent {
 *    today: number = Date.now();
 *  }
 *  ```
 *
 * @publicApi
 */
// clang-format on
@Pipe({name: 'date', pure: true})
export class DatePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {}

  /**
   * @param value The date expression: a `Date` object,  a number
   * (milliseconds since UTC epoch), or an ISO string (https://www.w3.org/TR/NOTE-datetime).
   * @param format The date/time components to include, using predefined options or a
   * custom format string.
   * @param timezone A timezone offset (such as `'+0430'`), or a standard
   * UTC/GMT or continental US timezone abbreviation.
   * When not supplied, uses the end-user's local system timezone.
   * @param locale A locale code for the locale format rules to use.
   * When not supplied, uses the value of `LOCALE_ID`, which is `en-US` by default.
   * See [Setting your app locale](guide/i18n#setting-up-the-locale-of-your-app).
   * @returns A date string in the desired format.
   */
  transform(value: any, format = 'mediumDate', timezone?: string, locale?: string): string|null {
    if (value == null || value === '' || value !== value) return null;

    try {
      return formatDate(value, format, locale || this.locale, timezone);
    } catch (error) {
      throw invalidPipeArgumentError(DatePipe, error.message);
    }
  }
}
