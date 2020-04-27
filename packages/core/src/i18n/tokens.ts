/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '../di/injection_token';

/**
 * Предоставьте этот токен, чтобы установить язык вашего приложения.
 * Он используется для извлечения i18n, по i18n труб (DatePipe, I18nPluralPipe,CurrencyPipe,.
 * DecimalPipe и PercentPipe) и выражениями ICU.
 *
 * См.[Руководство i18n](guide/i18n#setting-up-locale)для получения дополнительной информации.
 *
 *  @usageNotes
 *  ### Пример
 *
 *  ```typescript
 *  import { LOCALE_ID } from '@angular/core';
 *  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *  import { AppModule } from './app/app.module';
 *
 *  platformBrowserDynamic().bootstrapModule(AppModule, {
 *    providers: [{provide: LOCALE_ID, useValue: 'en-US' }]
 *  });
 *  ```
 *
 * @publicApi
 */
export const LOCALE_ID = new InjectionToken<string>('LocaleId');

/**
 * Предоставьте этот токен, чтобы установить код валюты по умолчанию, для которого ваше приложение использует
 * CurrencyPipe, когда в него не передан код валюты. Это используетсятолько.
 * CurrencyPipe и не имеет отношения к национальной валюте. По умолчанию USD, если не настроен.
 *
 * См.[Руководство i18n](guide/i18n#setting-up-locale)для получения дополнительной информации.
 *
 *  <div class="alert is-helpful">
 *
 * Устаревшиеизвещение:.
 *
 * Код валюты по умолчанию в настоящее время всегда `USD` но это не рекомендуется с v9.
 *
 * В версии 10 код валюты по умолчанию будет взят из текущей локали.
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
 *  @usageNotes
 *  ### Пример
 *
 *  ```typescript
 *  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *  import { AppModule } from './app/app.module';
 *
 *  platformBrowserDynamic().bootstrapModule(AppModule, {
 *    providers: [{provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' }]
 *  });
 *  ```
 *
 * @publicApi
 */
export const DEFAULT_CURRENCY_CODE = new InjectionToken<string>('DefaultCurrencyCode');

/**
 * Используйте этот маркер в загрузчикечтобы обеспечить содержание вашего файла перевода ( `xtb` XTB,.
 *  `xlf `или` xlf2`xlf2)когда вы хотите перевести приложение на другом языке.
 *
 * См.[Руководство i18n](guide/i18n#merge)для получения дополнительной информации.
 *
 *  @usageNotes
 *  ### Пример
 *
 *  ```typescript
 *  import { TRANSLATIONS } from '@angular/core';
 *  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *  import { AppModule } from './app/app.module';
 *
 *  // content of your translation file
 *  const translations = '....';
 *
 *  platformBrowserDynamic().bootstrapModule(AppModule, {
 *    providers: [{provide: TRANSLATIONS, useValue: translations }]
 *  });
 *  ```
 *
 * @publicApi
 */
export const TRANSLATIONS = new InjectionToken<string>('Translations');

/**
 * Предоставьте этот токен в начальной загрузке, чтобы установить формат вашего{@link TRANSLATIONS}: `xtb` XTB,.
 *  `xlf `или` xlf2`xlf2.
 *
 * См.[Руководство i18n](guide/i18n#merge)для получения дополнительной информации.
 *
 *  @usageNotes
 *  ### Пример
 *
 *  ```typescript
 *  import { TRANSLATIONS_FORMAT } from '@angular/core';
 *  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *  import { AppModule } from './app/app.module';
 *
 *  platformBrowserDynamic().bootstrapModule(AppModule, {
 *    providers: [{provide: TRANSLATIONS_FORMAT, useValue: 'xlf' }]
 *  });
 *  ```
 *
 * @publicApi
 */
export const TRANSLATIONS_FORMAT = new InjectionToken<string>('TranslationsFormat');

/**
 * Используйте это перечисление в bootstrap как опцию `bootstrapModule` для определения стратегии
 * что компилятор должен использовать в случае отсутствияперевода:.
 * - Ошибка: выбросить, если у вас отсутствуют переводы.
 * - Предупреждение (по умолчанию): показывать предупреждение в консоли и / или оболочке.
 * - Игнорировать: ничего не делать.
 *
 * См.[Руководство i18n](guide/i18n#missing-translation)для получения дополнительной информации.
 *
 *  @usageNotes
 *  ### Пример
 *  ```typescript
 *  import { MissingTranslationStrategy } from '@angular/core';
 *  import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
 *  import { AppModule } from './app/app.module';
 *
 *  platformBrowserDynamic().bootstrapModule(AppModule, {
 *    missingTranslation: MissingTranslationStrategy.Error
 *  });
 *  ```
 *
 * @publicApi
 */
export enum MissingTranslationStrategy {
  Error = 0,
  Warning = 1,
  Ignore = 2,
}
