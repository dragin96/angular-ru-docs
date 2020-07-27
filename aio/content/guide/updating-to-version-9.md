{@a updating-to-angular-version-9}
# Обновление до версии Angular 9

Это руководство содержит информацию, касающуюся обновления до версии 9 Angular.

{@a updating-cli-apps}
## Обновление приложений CLI

Для получения пошаговых инструкций по обновлению до последней версии Angular (и для этого используйте наши инструменты автоматической миграции) используйте интерактивное руководство по обновлению по адресу [update.angular.io](https://update.angular.io).

Если вам интересно узнать о конкретных миграциях, выполняемых CLI, обратитесь к [разделу раздел автоматических миграций](#migrations)для получения подробной информации о том, какой код изменяется и почему.

{@a changes-and-deprecations-in-version-9}
## Изменения и устаревшие версии 9

<div class="alert is-helpful">

   Для получения информации о методах устаревания и удаления см. [Angular Практики выпуска Angular](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices").

</div>

{@a breaking-changes}
{@a new-breaking-changes}
### Новые переломные изменения

- Angular теперь компилируется с Ivy по умолчанию. Смотрите [раздел совместимости Ivy](#ivy).

- Приложения CLI компилируются в [режим AOT](/guide/aot-compiler)по умолчанию (что включает проверку типа шаблона).
Пользователи, которые раньше работали только с JIT, могут увидеть новые ошибки типа.
Смотрите наш[руководство по проверке типов шаблонов](guide/template-typecheck)для получения дополнительной информации и советов по отладке.

- Typescript 3.4 и 3.5 больше не поддерживаются. Пожалуйста, обновите до Typescript 3.7.

- `tslib` указан как зависимость от сверстников, а не как прямая зависимость. Если вы не используете CLI, вы должны установить вручную `tslib`, используя `yarn add tslib ` или ` npm install tslib --save`.

{@a deprecations}
{@a new-deprecations}
### Новые Амортизации

| API | Замена | Примечания
| -------------------------------------------------- ---------------------- | ------------------------------------ | ----- |
| [ `entryComponents` ](api/core/NgModule#entryComponents) | нет | Смотрите [ `entryComponents` ](guide/deprecations#entryComponents)|
| [ `CurrencyPipe` - ` DEFAULT_CURRENCY_CODE ` ](api/common/CurrencyPipe#currency-code-deprecation)| ` {provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}` | Начиная с версии v11 код по умолчанию будет извлечен из данных локали, предоставленных `LOCAL_ID`, а не `USD` . |
| [ `ANALYZE_FOR_ENTRY_COMPONENTS` ](api/core/ANALYZE_FOR_ENTRY_COMPONENTS)| нет | Смотрите [ `ANALYZE_FOR_ENTRY_COMPONENTS` ](guide/deprecations#entryComponents)|
| `ModuleWithProviders` без универсального | `ModuleWithProviders` с универсальным | Смотрите [раздел ModuleWithProviders](guide/deprecations#moduleWithProviders)|
| Недекорированные базовые классы, использующие Angular элементы | Базовые классы с `@Directive()`, использующий Angular функции | Смотрите [раздел недекорированных базовых классов](guide/deprecations#undecorated-base-classes)|
| `esm5` и `fesm5` распределение в `@angular/*` npm пакеты | `esm2015` и `fesm2015` входа | Смотрите [ `esm5` и ` fesm5` ](guide/deprecations#esm5-fesm5)|
| [ `TestBed.get` ](api/core/testing/TestBed#get) | [ `TestBed.inject` ](api/core/testing/TestBed#inject)| Такое же поведение, но тип безопасный. |


{@a removals}
{@a new-removals-of-deprecated-apis}
### Новые удаления устаревших API

| Пакет | API | Замена | Примечания
| ------- | -------------- | ----------- | ----- |
| `@angular/core` | [ `Рендерер` ](https://v8.angular.io/api/core/Renderer)| [ `Renderer2` ](api/core/Renderer2)| [Руководство по миграции.](guide/migration-renderer)|
| `@angular/core` | [ `RootRenderer` ](https://v8.angular.io/api/core/RootRenderer)| [ `RendererFactory2` ](api/core/RendererFactory2)| нет |
| `@angular/core` | [ `RenderComponentType` ](https://v8.angular.io/api/core/RenderComponentType)| [ `RendererType2` ](api/core/RendererType2)| нет |
| `@angular/core` | [ `WtfScopeFn` ](https://v8.angular.io/api/core/WtfScopeFn)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/core` | [ `wtfCreateScope` ](https://v8.angular.io/api/core/wtfCreateScope)| нет | V8 | Смотрите [Web Tracing Framework](guide/deprecations#wtf)|
| `@angular/core` | [ `wtfStartTimeRange` ](https://v8.angular.io/api/core/wtfStartTimeRange)| нет | V8 | Смотрите [Web Tracing Framework](guide/deprecations#wtf)|
| `@angular/core` | [ `wtfEndTimeRange` ](https://v8.angular.io/api/core/wtfEndTimeRange)| нет | V8 | Смотрите [Web Tracing Framework](guide/deprecations#wtf)|
| `@angular/core` | [ `wtfLeave` ](https://v8.angular.io/api/core/wtfLeave)| нет | V8 | Смотрите [Web Tracing Framework](guide/deprecations#wtf)|
| `@angular/common` | `DeprecatedI18NPipesModule` | [ `CommonModule` ](api/common/CommonModule#pipes)| нет |
| `@angular/common` | `DeprecatedCurrencyPipe` | [ `CurrencyPipe` ](api/common/CurrencyPipe)| нет |
| `@angular/common` | `DeprecatedDatePipe` | [ `DatePipe` ](api/common/DatePipe)| нет |
| `@angular/common` | `DeprecatedDecimalPipe` | [ `DecimalPipe` ](api/common/DecimalPipe)| нет |
| `@angular/common` | `DeprecatedPercentPipe` | [ `PercentPipe` ](api/common/PercentPipe)| нет |
| `@angular/forms` | [ `NgFormSelectorWarning` ](https://v8.angular.io/api/forms/NgFormSelectorWarning)| нет |
| `@angular/forms` | `ngForm` элементов | `ng-form` Селектор элементов | нет |
| `@angular/service-worker` | `versionedFiles` | `files` | В файле конфигурации работника сервиса `ngsw-config.json`, заменить `versionedFiles` с `files` . Смотрите [Конфигурация сервисного работника](guide/service-worker-config#assetgroups). |

{@a ivy}

{@a ivy-features-and-compatibility}
## Особенности Ivy и совместимость

В версии 9 Angular Ivy является движком рендеринга по умолчанию. Если вы еще не слышали о Ivy, вы можете прочитать больше об этом в [Angular руководство Ivy](guide/ivy).

* Помимо других функций, Ivy представляет более полную проверку типов в шаблонах. Подробнее см. [Проверка типа шаблона](guide/template-typecheck).

* Общее руководство по отладке и список незначительных изменений, связанных с Ivy, см. В [Руководство по совместимости Ivy](guide/ivy-compatibility).

* Для получения справки об отказе от Ivy см. Инструкции [здесь](guide/ivy#opting-out-of-angular-ivy).

{@a migrations}
{@a automated-migrations-for-version-9}
## Автоматизированные миграции для версии 9

Читайте о миграции ручки CLI для вас автоматически:

- [Переход с `Renderer` на ` Renderer2` ](guide/migration-renderer)
- [Перенос отсутствующих декораторов `@Directive ()` / `@ Component ()` ](guide/migration-undecorated-classes)
- [Перенос отсутствующих декораторов `@Injectable ()` и неполных определений провайдеров](guide/migration-injectable)
- [Миграция динамических запросов](guide/migration-dynamic-flag)
- [Переход на новую поддержку `$ localize` i18n](guide/migration-localize)
- [Миграция `ModuleWithProviders` ](guide/migration-module-with-providers)
