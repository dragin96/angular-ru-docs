{@a deprecated-apis-and-features}
# Устаревшие API и функции

Angular стремится сбалансировать инновации и стабильность.
Иногда API и функции устаревают, и их необходимо удалить или заменить, чтобы Angular мог быть в курсе новых лучших практик, изменений зависимостей или изменений в самой (веб) платформе.

Чтобы сделать эти переходы максимально простыми, мы отказываемся от API и функций на некоторое время, прежде чем удалять их. Это дает вам время обновить свои приложения до последних API и лучших практик.

В этом руководстве содержится сводная информация обо всех API и функциях Angular, которые в настоящее время устарели.


<div class="alert is-helpful">


Функции и API, которые были объявлены устаревшими в версии 6 или более ранней, являются кандидатами на удаление в версии 9 или более поздней основной версии. Для получения информации о методах устаревания и удаления см. [Angular Практики выпуска Angular](guide/releases#deprecation-practices "Angular Release Practices: Deprecation practices").

Пошаговые инструкции по обновлению до последней версии Angular можно в интерактивном руководстве по обновлению по адресу [найти update.angular.io](https://update.angular.io).

</div>


{@a index}
## Индекс

Чтобы помочь вашим приложениям в будущем, в следующей таблице перечислены все устаревшие API и функции, упорядоченные по версии, в которой они являются кандидатами на удаление. Каждый элемент связан с разделом далее в этом руководстве, в котором описывается причина устаревания и варианты замены.

<!--
deprecation -> removal cheat sheet
v4 - v7
v5 - v8
v6 - v9
v7 - v10
v8 - v11
v9 - v12
-->


| Пакет | API или функция | Может быть удален в |
| ----------------------------- | -------------------------------------------------- ------------------------- | ----------------- |
| `@angular/common`| [ `ReflectiveInjector` ](#reflectiveinjector)| <!--v8-->v10 |
| `@angular/common`| [ `CurrencyPipe`-` DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation)| <!--v9-->v11 |
| `@angular/core`| [ `CollectionChangeRecord` ](#core)| <!--v7-->v10 |
| `@angular/core`| [ `DefaultIterableDiffer` ](#core)| <!--v7-->v10 |
| `@angular/core`| [ `ReflectiveKey` ](#core)| <!--v8-->v10 |
| `@angular/core`| [ `RenderComponentType` ](#core)| <!--v7-->v10 |
| `@angular/core`| [ `ViewEncapsulation.Native` ](#core)| <!--v6-->v10 |
| `@angular/core`| [ `ModuleWithProviders`без универсального](#moduleWithProviders)| <!--v9-->v10 |
| `@angular/core`| [Недекорированные базовые классы, использующие Angular объекты](#undecorated-base-classes)| <!--v9-->v10 |
| `@angular/forms`| [ `ngModel`с реактивными формами](#ngmodel-reactive)| <!--v6-->v10 |
| `@angular/router`| [ `preserveQueryParams` ](#router)| <!--v7-->v10 |
| `@angular/upgrade`| [`@ angular / upgrade`](#upgrade)| <!--v8-->v10 |
| `@angular/upgrade`| [ `getAngularLib` ](#upgrade-static)| <!--v8-->v10 |
| `@angular/upgrade`| [ `setAngularLib` ](#upgrade-static)| <!--v8-->v10 |
| `@angular/platform-webworker` | [Все точки входа](api/platform-webworker)| <!--v8-->v10 |
| синтаксис шаблона | [`](#template-tag)| <!--v7-->v10 |
| полифилы | [отражение-метаданные](#reflect-metadata)| <!--v8-->v10 |
| формат пакета npm | [точки входа `esm5` и` fesm5` в пакетах @ angular / * npm](guide/deprecations#esm5-fesm5)| <!-- v9 -->v10 |
| `@angular/core`| [ `defineInjectable` ](#core)| <!--v8-->v11 |
| `@angular/core`| [ `entryComponents` ](api/core/NgModule#entryComponents)| <!--v9-->v11 |
| `@angular/core`| [ `ANALYZE_FOR_ENTRY_COMPONENTS` ](api/core/ANALYZE_FOR_ENTRY_COMPONENTS)| <!--v9-->v11 |
| `@angular/router`| [строковый синтаксис `loadChildren`](#loadChildren)| <!--v9-->v11 |
| `@angular/core/testing`| [ `TestBed.get` ](#testing)| <!--v9-->v12 |
| `@angular/router`| [Параметры `ActivatedRoute` и свойства` queryParams`](#activatedroute-props)| не указано |
| синтаксис шаблона | [`/ deep /`, `>>>` и `:: ng-deep`](#deep-component-style-selector)| <!--v7-->не указано |




{@a deprecated-apis}
## Устаревшие API

В этом разделе содержится полный список всех устаревших API-интерфейсов с подробной информацией, которая поможет вам спланировать переход на замену.


<div class="alert is-helpful">

Совет: в [справочный раздел API](api)На этом сайте документации устаревшие API обозначены как ~~ зачеркнутый. ~~ Вы можете отфильтровать список API с помощью [** Status: устарело **](api?status=deprecated).

</div>

{@a common}
{@a angularcommon}
### @ Angular / общий

| API | Замена | Аннонс deprecated | Примечания
| -------------------------------------------------- ------------------------------------------- | -------------------------------------------------- - | --------------------- | ----- |
| [ `CurrencyPipe`-` DEFAULT_CURRENCY_CODE`](api/common/CurrencyPipe#currency-code-deprecation) | `{provide: DEFAULT_CURRENCY_CODE, useValue: 'USD'}`| v9 | Начиная с версии v11 код по умолчанию будет извлечен из данных локали, предоставленных `LOCAL_ID` , а не `USD` . |


{@a core}
{@a angularcore}
### @ Angular / основной

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [ `CollectionChangeRecord` ](api/core/CollectionChangeRecord)| [ `IterableChangeRecord` ](api/core/IterableChangeRecord)| v4 | нет |
| [ `DefaultIterableDiffer` ](api/core/DefaultIterableDiffer)| н / д | v4 | Не является частью публичного API. |
| [ `ReflectiveInjector` ](api/core/ReflectiveInjector)| [ `Injector.create` ](api/core/Injector#create)| v5 | Смотри [ `ReflectiveInjector` ](#reflectiveinjector)|
| [ `ReflectiveKey` ](api/core/ReflectiveKey)| нет | v5 | нет |
| [ `ViewEncapsulation.Native` ](api/core/ViewEncapsulation#Native)| [ `ViewEncapsulation.ShadowDom` ](api/core/ViewEncapsulation#ShadowDom)| v6 | Используйте собственный механизм инкапсуляции рендерера. Смотрите [view.ts](https://github.com/angular/angular/blob/3e992e18ebf51d6036818f26c3d77b52d3ec48eb/packages/core/src/metadata/view.ts#L32).
| [ `defineInjectable` ](api/core/defineInjectable)| `ɵɵdefineInjectable` | V8 | Используется только в сгенерированном коде. Исходный код не должен зависеть от этого API. |
| [ `entryComponents` ](api/core/NgModule#entryComponents)| нет | v9 | Смотрите [ `entryComponents` ](#entryComponents)|
| [ `ANALYZE_FOR_ENTRY_COMPONENTS` ](api/core/ANALYZE_FOR_ENTRY_COMPONENTS)| нет | v9 | Смотрите [ `ANALYZE_FOR_ENTRY_COMPONENTS` ](#entryComponents)|
| `ModuleWithProviders` без универсального |`ModuleWithProviders`с универсальным | v9 | Смотрите [раздел ModuleWithProviders](#moduleWithProviders)|
| Недекорированные базовые классы, использующие Angular элементы | Базовые классы с `@Directive()` , использующий Angular функции | v9 | Смотрите [раздел недекорированных базовых классов](#undecorated-base-classes)|






{@a testing}
{@a angularcoretesting}
### @ Angular / ядро ​​/ тестирование

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [ `TestBed.get` ](api/core/testing/TestBed#get)| [ `TestBed.inject` ](api/core/testing/TestBed#inject)| v9 | Такое же поведение, но тип безопасный. |


{@a forms}
{@a angularforms}
### @angular/forms

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [ `ngModel`с реактивными формами](#ngmodel-reactive)| [ `FormControlDirective` ](api/forms/FormControlDirective)| v6 | нет |

{@a router}
{@a angularrouter}
### @ Angular / маршрутизатор

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [ `PreserveQueryParams` ](api/router/NavigationExtras#preserveQueryParams)| [ `queryParamsHandling` ](api/router/NavigationExtras#queryParamsHandling)| v4 | нет |

{@a platform-webworker}
### @angular/platform-webworker

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [Все точки входа](api/platform-webworker)| нет | V8 | Смотрите [платформа-веб-работник](#webworker-apps). |

{@a platform-webworker-dynamic}
### @angular/platform-webworker-dynamic

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [Все точки входа](api/platform-webworker-dynamic)| нет | V8 | Смотри [платформа-веб-работник](#webworker-apps). |

{@a upgrade}
### @angular/upgrade

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [Все точки входа](api/upgrade)| [`@ angular / upgrade / static`](api/upgrade/static)| v5 | Смотрите [Обновление от AngularJS](guide/upgrade). |

{@a upgrade-static}
### @angular/upgrade/static

| API | Замена | Аннонс deprecated | Примечания
| --- | ----------- | --------------------- | ----- |
| [ `getAngularLib` ](api/upgrade/static/getAngularLib)| [ `getAngularJSGlobal` ](api/upgrade/static/getAngularJSGlobal)| v5 | Смотрите [Обновление от AngularJS](guide/upgrade). |
[ `setAngularLib` ](api/upgrade/static/setAngularLib)| [ `setAngularJSGlobal` ](api/upgrade/static/setAngularJSGlobal)| v5 | Смотрите [Обновление от AngularJS](guide/upgrade). |



{@a deprecated-features}
## Устаревшие функции

В этом разделе перечислены все устаревшие функции, которые включают синтаксис шаблона, параметры конфигурации и любые другие устаревшие функции, не перечисленные в [Устаревшие API](#deprecated-apis)раздел выше. Он также включает в себя устаревшие сценарии использования API или комбинации API, чтобы дополнить информацию выше.



{@a wtf}
{@a web-tracing-framework-integration}
### Интеграция Web Tracing Framework

Ранее Angular поддерживал интеграцию с [Web Tracing Framework (WTF)](https://google.github.io/tracing-framework/)для тестирования производительности приложений Angular. Эта интеграция не была сохранена и не существовала. В результате интеграция устарела в версии Angular 8 и из-за отсутствия каких-либо свидетельств какого-либо существующего использования, удаленного в версии 9


{@a deep-component-style-selector}
{@a deep-and-ng-deep-component-style-selectors}
### `/deep/ `,` >>>` а также `:ng-deep`селекторы стиля компонента

Пронзительный теневой доминантный комбинатор устарел, и поддержка в настоящее время [удалена из основных браузеров и инструментов](https://developers.google.com/web/updates/2017/10/remove-shadow-piercing). Таким образом, в v4 мы отказались от поддержки в Angular для всех 3 `/deep/` , `>>>`а также `::ng-deep`. До удаления, `::ng-deep` предпочтителен для более широкой совместимости с инструментами.

Для получения дополнительной информации см. [/ Deep /, >>> и :: ng-deep](guide/component-styles#deprecated-deep--and-ng-deep "Component Styles guide, Deprecated deep and ngdeep")
в руководстве по стилям компонентов.


{@a template-tag}
{@a &lttemplate&gt-tag}
### Тег <template>

`<template>`В v4 тег был объявлен устаревшим, чтобы избежать столкновения с элементом DOM с тем же именем (например, при использовании веб-компонентов). использование `<ng-template>` вместо . Для получения дополнительной информации см. [Опережающая компиляция](guide/angular-compiler-options#enablelegacytemplate)Руководство .



{@a ngmodel-reactive}
{@a ngmodel-with-reactive-forms}
### ngModel с реактивными формами

Поддержка использования `ngModel` входное свойство и `ngModelChange` Событие с реактивным
директивы формы устарели в Angular v6 и будут удалены в следующей версии
Angular

Сейчас устарела

```html
<input [formControl]="control" [(ngModel)]="value">
```

```ts
this.value = 'some value';
```

Это устарело по нескольким причинам. Сначала разработчики нашли этот шаблон
запутанный. Похоже на фактический `ngModel` Директива используется, но на самом деле это так
свойство ввода / вывода с именем `ngModel` в директиве о реактивной форме
приближает некоторые, но не все, поведения директивы.
Это позволяет получать и устанавливать значения и перехватывать значения событий, но
некоторые из `ngModel` Другие функции , такие как
задержка обновлений с `ngModelOptions` или экспорт директивы не работают.

Кроме того, этот шаблон смешивает стратегии шаблонных и реактивных форм, которые
предотвращает использование всех преимуществ любой стратегии.
Установка значения в шаблоне нарушает независимость от шаблона
принципы, лежащие в основе реактивных форм, в то время как добавление `FormControl` / `FormGroup` Слой в
класс устраняет удобство определения форм в шаблоне.

Чтобы обновить свой код до того, как поддержка будет удалена, вам нужно решить, стоит ли придерживаться
с директивами реактивной формы (и получить / установить значения, используя шаблоны реактивной формы) или
переключиться на директивы на основе шаблонов.

После выбора (1 - использование активных форм):

```html
<input [formControl]="control">
```

```ts
this.control.setValue('some value');
```

После выбора (2 - использование форм на основе шаблонов):

```html
<input [(ngModel)]="value">
```

```ts
this.value = 'some value';
```

По умолчанию, когда вы используете этот шаблон, вы увидите предупреждение об устаревании один раз в dev
Режим. Вы можете отключить это предупреждение, предоставив конфигурацию для
`ReactiveFormsModule`во время импорта:

```ts
imports: [
  ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'});
]
```

Кроме того, вы можете выбрать отдельное предупреждение для каждого экземпляра этого
шаблон со значением конфигурации `"always"` . Это может помочь отследить, где в коде
шаблон используется при обновлении кода.


{@a reflectiveinjector}
{@a reflectiveinjector}
### Рефлективный Инжектор

В v5 Angular заменил `ReflectiveInjector` с `StaticInjector` . Для инжектора больше не требуется полифилл Reflect, что уменьшает размер приложения для большинства разработчиков.

Перед тем как :

```
ReflectiveInjector.resolveAndCreate(providers);
```

После того, как :

```
Injector.create({providers});
```

{@a loadChildren}
{@a loadchildren-string-syntax}
### Синтаксис строки loadChildren

Когда Angular впервые представил ленивые маршруты, в браузере не было поддержки динамической загрузки дополнительного JavaScript. Angular создал нашу собственную схему, используя синтаксис`loadChildren: './lazy/lazy.module#LazyModule'`и встроенный инструментарий для его поддержки. Теперь, когда динамический импорт ECMAScript поддерживается во многих браузерах, Angular движется к этому новому синтаксису.

В версии 8 строковый синтаксис для [ `loadChildren` ](api/router/LoadChildren)спецификации маршрута устарел, в пользу нового синтаксиса, который использует `import()` синтаксис .

Перед тем как :

```
const routes: Routes = [{
  path: 'lazy',
  // The following string syntax for loadChildren is deprecated
  loadChildren: './lazy/lazy.module#LazyModule'
}];
```

После того, как :

```
const routes: Routes = [{
  path: 'lazy',
  // The new import() syntax
  loadChildren: () => import('./lazy/lazy.module').then(m => m.LazyModule)
}];
```


<div class="alert is-helpful">


**Обновление версии 8 **: при обновлении до версии 8 команда [`ng update`](cli/update)выполняет преобразование автоматически. До версии 7 `import()` Синтаксис работает только в режиме JIT (с механизмом просмотра).


</div>

<div class="alert is-helpful">

**Синтаксис объявления **: важно следовать синтаксису объявления маршрута`loadChildren: () => import('...').then(m => m.ModuleName)`чтобы разрешить `ngc` чтобы обнаружить лениво загруженный модуль и связанный с ним `NgModule` . Вы можете найти полный список разрешенных синтаксических конструкций [здесь](https://github.com/angular/angular-cli/blob/a491b09800b493fe01301387fa9a025f7c7d4808/packages/ngtools/webpack/src/transformers/import_factory.ts#L104-L113). Эти ограничения будут ослаблены с выпуском Ivy, так как он больше не будет использовать `NgFactories` .

</div>



{@a activatedroute-props}

{@a activatedroute-params-and-queryparams-properties}
### ActivatedRoute params и свойства queryParams

[ActivatedRoute](api/router/ActivatedRoute)содержит два [свойства](api/router/ActivatedRoute#properties), которые менее эффективны, чем их замены, и могут быть устаревшими в будущей версии Angular.

| Недвижимость | Замена |
| -------- | ----------- |
| `params` | `paramMap` |
| `queryParams` | `queryParamMap` |

Для получения дополнительной информации см [Получение информации о маршруте](guide/router#activated-route)раздел [руководство маршрутизатора](guide/router).


{@a reflect-metadata}
{@a dependency-on-a-reflect-metadata-polyfill-in-jit-mode}
### Зависимость от полифилла отражающих метаданных в режиме JIT
Angular приложения и, в частности, приложения, основанные на JIT-компиляторе, раньше требовали многозаполнения для рефлекса [-метаданных](https://github.com/rbuckton/reflect-metadata)API .

Потребность в этом полифилле была удалена в Angular версии 8.0 ( [см. # 14473](https://github.com/angular/angular-cli/pull/14473)), что делает ненужным присутствие poylfill в большинстве приложений Angular. Поскольку на полифил могут зависеть сторонние библиотеки, вместо того, чтобы удалять его из всех проектов Angular, мы осуждаем требование для этого полифилла начиная с версии 8.0. Это должно дать авторам библиотеки и разработчикам приложений достаточно времени, чтобы оценить, нужно ли им заполнение, и выполнить любой рефакторинг, необходимый для удаления зависимости от него.

В типичном угловом проекте полифилл не используется в производственных сборках, поэтому удаление его не должно влиять на производственные приложения. Целью этого удаления является общее упрощение настройки сборки и уменьшение количества внешних зависимостей.

{@a static-query-resolution}
{@a viewchild-contentchild-static-resolution-as-the-default}
### `@ViewChild() `/` @ContentChild()`статическое разрешение по умолчанию

Смотрите [специальное руководство по миграции для статических запросов](guide/static-query-migration).

{@a contentchild-input-together}
{@a contentchild-input-used-together}
### `@ContentChild() `/` @Input()`используется вместе

Следующий шаблон является устаревшим:

```ts
@Input() @ContentChild(TemplateRef) tpl !: TemplateRef<any>;
```

Вместо того, чтобы использовать этот шаблон, разделите два декоратора на их собственные
свойства и добавить резервную логику , как в следующем примере:

```ts
@Input() tpl !: TemplateRef<any>;
@ContentChild(TemplateRef) inlineTemplate !: TemplateRef<any>;
```
{@a cant-assign-template-vars}
{@a cannot-assign-to-template-variables}
### Невозможно назначить переменные шаблона

В следующем примере двустороннее связывание означает, что `optionName`
должно быть написано, когда `valueChange` Событие срабатывает.

```html
<option *ngFor="let optionName of options" [(value)]="optionName"></option>
```

Однако на практике Angular просто игнорирует двусторонние привязки к шаблонным переменным. Начиная с версии 8, попытка записи в переменные шаблона не рекомендуется. В будущей версии мы добавим, чтобы указать, что запись не поддерживается.

```html
<option *ngFor="let optionName of options" [value]="optionName"></option>
```

{@a undecorated-base-classes}
{@a undecorated-base-classes-using-angular-features}
### Недекорированные базовые классы с использованием Angular функций

Начиная с версии 9, это не рекомендуется , чтобы иметь непараметризованный базовый класс , что:

- использует Angular функции
- продлен директивой или компонентом

Angular крючки жизненного цикла или любые из следующих Angular полех декораторов считаются Angularи характеристиками:

- `@Input()`
- `@Output()`
- `@HostBinding()`
- `@HostListener()`
- `@ViewChild() `/` @ViewChildren()`
- `@ContentChild() `/` @ContentChildren()`

Например, следующий случай устарел, потому что базовый класс использует `@Input()` и не имеет уровня класса декоратора:

```ts
class Base {
  @Input()
  foo: string;
}

@Directive(...)
class Dir extends Base {
  ngOnChanges(): void {
    // notified when bindings to [foo] are updated
  }
}
```

В будущей версии Angular этот код начнет выдавать ошибку.
Чтобы исправить этот пример, добавьте селектор без `@Directive()` декоратор для базового класса:

```ts
@Directive()
class Base {
  @Input()
  foo: string;
}

@Directive(...)
class Dir extends Base {
  ngOnChanges(): void {
    // notified when bindings to [foo] are updated
  }
}
```

В версии 9 CLI имеет автоматическую миграцию, которая обновит ваш код, когда вы`ng update`запущено.
См. [Специальное руководство по миграции](guide/migration-undecorated-classes)для получения дополнительной информации об изменениях и дополнительных примеров.



{@a binding-to-innertext}
{@a binding-to-innertext-in-platform-server}
### Привязка к `innerText` в `platform-server`

[Domino](https://github.com/fgnass/domino), который используется при рендеринге на стороне сервера, не поддерживает `innerText` , так что в "адаптере домино" платформы-сервера был специальный код, к которому можно вернуться `textContent` если вы пытались привязать к `innerText` .

Эти два свойства имеют тонкие различия, поэтому переключение на `textContent` под капотом может удивить пользователей. По этой причине мы осуждаем это поведение. В дальнейшем пользователи должны явно связываться с `textContent` при использовании Domino.

{@a wtf-apis}
{@a wtfstarttimerange-and-all-wtf-apis}
### `wtfStartTimeRange`и все `wtf*` API

Все из `wtf*` API устарели и будут удалены в следующей версии.

{@a webworker-apps}
{@a running-angular-applications-in-platform-webworker}
### Запуск Angular-приложений в платформе webworker

`@angular/platform-*`позволяют запускать Angular в разных контекстах. Для примера
`@angular/platform-server`позволяет запускать Angular на сервере, и `@angular/platform-browser`
позволяет запускать Angular в веб-браузере.

`@angular/platform-webworker`был представлен в Angular версии 2 как эксперимент по использованию
Архитектура рендеринга Angular для запуска всего веб-приложения в
[веб-работник](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API). Мы многому научились
Исходя из этого эксперимента и пришли к выводу, что все приложение работает в сети
работник не самая лучшая стратегия для большинства приложений.

В дальнейшем мы сосредоточим наши усилия, связанные с веб-работниками, на их основном использовании
разгрузка процессора интенсивно, некритическая работа , необходимую для начального рендеринга (например, поиск в памяти
и обработке изображений). Узнайте больше в
[руководство по использованию веб-работников с Angular интерфейсом командной строки](guide/web-worker).

Начиная с Angular версии 8, все`platform-webworker`API устарели.
Это включает в себя оба пакета: `@angular/platform-webworker` и
`@angular/platform-webworker-dynamic`.

{@a entryComponents}
{@a entrycomponents-and-analyzeforentrycomponents-no-longer-required}
### `entryComponents `и` ANALYZE_FOR_ENTRY_COMPONENTS`больше не требуется
Ранее `entryComponents` массив в `NgModule` Определение использовалось для компилятору, какие компоненты будут создаваться и вставляться динамически. С Плющом это больше не требование, и `entryComponents` Массив может быть удален из существующих объявлений модуля. То же самое относится к `ANALYZE_FOR_ENTRY_COMPONENTS` токен инъекции.

{@a moduleWithProviders}
{@a modulewithproviders-type-without-a-generic}
### `ModuleWithProviders`Тип без универсального

Некоторые Angular библиотеки, такие как `@angular/router` и `@ngrx/store` , реализуйте API, которые возвращают тип с именем `ModuleWithProviders` (обычно через метод с именем `forRoot()` ).
Этот тип представляет `NgModule` вместе с дополнительными провайдерами.
Angular версия 9 не одобряет использование `ModuleWithProviders` без явно универсального типа, где универсальный тип ссылается на тип `NgModule` .
В будущей версии Angular универсальный больше не будет опциональным.


Если вы используете CLI,`ng update`Необходимо [перенести ваш код автоматически](guide/migration-module-with-providers).
Если вы не используете CLI, вы можете добавить в приложение любые недостающие универсальные типы вручную.
Например:

**До**
```ts
@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config}
      ]
    };
  }
}
```

**После**

```ts
@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders<SomeModule> {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}
```

{@a esm5-fesm5}
{@a esm5-and-fesm5-code-formats-in-angular-npm-packages}
### `esm5 `и` fesm5`форматы кода в @ Angular / * НМП пакетов

Начиная с Angular v8, CLI в основном потребляет `fesm2015` вариант кода распространяется через `@angular/*` npm пакеты.
Это делает `esm5` и `fesm5` устарели и не нужны, увеличивая размер пакета и увеличивая скорость установки npm.

Удаление этого дистрибутива в будущем не повлияет на пользователей CLI, если они не изменят свою конфигурацию сборки, чтобы явно использовать эти дистрибутивы кода.

Любое приложение все еще полагается на `esm5` и `fesm5` в качестве входных данных для своей системы сборки должен будет гарантировать, что конвейер сборки способен принимать код JavaScript, соответствующий спецификации языка ECMAScript 2015 (ES2015).

Обратите внимание, что это изменение не делает существующие библиотеки, распространяемые в этом формате, несовместимыми с Angular CLI.
Интерфейс командной строки откатится и будет использовать библиотеки в менее желательных форматах, если другие недоступны.
Тем не менее, мы рекомендуем библиотекам отправлять свой код в формате ES2015, чтобы ускорить сборку и уменьшить объем вывода.

В практическом плане `package.json` всего `@angular` пакеты будут изменяться следующим образом:

**Перед тем как **:
```
{
  "name": "@angular/core",
  "version": "9.0.0",
  "main": "./bundles/core.umd.js",
  "module": "./fesm5/core.js",
  "es2015": "./fesm2015/core.js",
  "esm5": "./esm5/core.js",
  "esm2015": "./esm2015/core.js",
  "fesm5": "./fesm5/core.js",
  "fesm2015": "./fesm2015/core.js",
  ...
}
```

**После того, как **:
```
{
  "name": "@angular/core",
  "version": "10.0.0",
  "main": "./bundles/core.umd.js",
  "module": "./fesm2015/core.js",
  "es2015": "./fesm2015/core.js",
  "esm2015": "./esm2015/core.js",
  "fesm2015": "./fesm2015/core.js",
  ...
}
```

Для получения дополнительной информации о формате пакета npm см. [Спецификация Angular формата пакета](https://goo.gl/jB3GVv).



{@a removed}
{@a removed-apis}
## Удалены API

Следующие интерфейсы были удалены , начиная с версии 9.0.0 *:

| Пакет | API | Замена | Примечания
| ---------------- | -------------- | ----------- | ----- |
| `@angular/core`| [ `Рендерер` ](https://v8.angular.io/api/core/Renderer)| [ `Renderer2` ](https://angular.io/api/core/Renderer2)| [Руководство по миграции](guide/migration-renderer)|
| `@angular/core`| [ `RootRenderer` ](https://v8.angular.io/api/core/RootRenderer)| [ `RendererFactory2` ](https://angular.io/api/core/RendererFactory2)| нет |
| `@angular/core`| [ `RenderComponentType` ](https://v8.angular.io/api/core/RenderComponentType)| [ `RendererType2` ](https://angular.io/api/core/RendererType2)| нет |
| `@angular/core`| [ `WtfScopeFn` ](https://v8.angular.io/api/core/WtfScopeFn)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/core`| [ `wtfCreateScope` ](https://v8.angular.io/api/core/wtfCreateScope)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/core`| [ `wtfStartTimeRange` ](https://v8.angular.io/api/core/wtfStartTimeRange)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/core`| [ `wtfEndTimeRange` ](https://v8.angular.io/api/core/wtfEndTimeRange)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/core`| [ `wtfLeave` ](https://v8.angular.io/api/core/wtfLeave)| нет | V8 | Смотрите [Web Tracing Framework](#wtf)|
| `@angular/common` | `DeprecatedI18NPipesModule` | [ `CommonModule` ](api/common/CommonModule#pipes)| нет |
| `@angular/common` | `DeprecatedCurrencyPipe` | [ `CurrencyPipe` ](api/common/CurrencyPipe)| нет |
| `@angular/common` | `DeprecatedDatePipe`| [ `DatePipe` ](api/common/DatePipe)| нет |
| `@angular/common` | `DeprecatedDecimalPipe` | [ `DecimalPipe` ](api/common/DecimalPipe)| нет |
| `@angular/common` | `DeprecatedPercentPipe` | [ `PercentPipe` ](api/common/PercentPipe)| нет |
| `@angular/forms` | [ `NgFormSelectorWarning` ](https://v8.angular.io/api/forms/NgFormSelectorWarning)| нет | нет |
| `@angular/forms` | `ngForm` элементов | `ng-form` Селектор элементов | нет |
| `@angular/service-worker` | `versionedFiles` | `files` | В файле конфигурации работника сервиса `ngsw-config.json` , заменить `versionedFiles` с `files` . Смотрите [Конфигурация сервисного работника](guide/service-worker-config#assetgroups). |

*Чтобы увидеть API, удаленные в версии 8, ознакомьтесь с этим руководством на сайте документации [версия 8](https://v8.angular.io/guide/deprecations#removed).


<!-- The following anchor is used by redirects from the removed API pages. Do not change or remove. -->
{@a http}
### @angular/http

<!--
Deprecation announced in version 5
https://blog.angular.io/version-5-0-0-of-angular-now-available-37e414935ced)
-->


Весь [`@ angular / http`](http://v7.angular.io/api/http)пакет был удален. Использование [`@ Angular / Common / http`](api/common/http)вместо этого.

Новый API - это меньший, более простой и мощный способ выполнения HTTP-запросов в Angular.
Новый API упрощает эргономику по умолчанию: нет необходимости отображать, вызывая `.json()` метод.
Он также поддерживает типизированные возвращаемые значения и перехватчики.

Для того, чтобы обновить свои приложения:
* замещать `HttpModule` с [ `HttpClientModule` ](api/common/http/HttpClientModule)(из [` @ angular / common / http`](api/common/http)) в каждом из ваших модулей.
* Заменить `Http` Сервис сервисом [ `HttpClient` ](api/common/http/HttpClient).
* Удалить любой`map(res => res.json())`вызовы. Они больше не нужны.

Для получения дополнительной информации об использовании `@angular/common/http` , см. [руководство HttpClient](guide/http "HTTP Client guide").


| `@angular/http` | Ближайшая замена в `@angular/common/http` |
| ------------- | ------------------------------------------- |
| `BaseRequestOptions` |[ `HttpRequest` ](/api/common/http/HttpRequest)|
| `BaseResponseOptions` | [ `HttpResponse` ](/api/common/http/HttpResponse)|
| `BrowserXhr` | |
| `Connection` | [ `HttpBackend` ](/api/common/http/HttpBackend)|
| `ConnectionBackend` | [ `HttpBackend` ](/api/common/http/HttpBackend)|
| `CookieXSRFStrategy` | [ `HttpClientXsrfModule` ](/api/common/http/HttpClientXsrfModule)|
| `Headers` | [ `HttpHeaders` ](/api/common/http/HttpHeaders)|
| `Http` | [ `HttpClient` ](/api/common/http/HttpClient)|
| `HttpModule` | [ `HttpClientModule` ](/api/common/http/HttpClientModule)|
| `Jsonp` | [ `HttpClient` ](/api/common/http/HttpClient)|
| `JSONPBackend` | [ `JsonpClientBackend` ](/api/common/http/JsonpClientBackend)|
| `JSONPConnection` | [ `JsonpClientBackend` ](/api/common/http/JsonpClientBackend)|
| `JsonpModule` | [ `HttpClientJsonpModule` ](/api/common/http/HttpClientJsonpModule)|
| `QueryEncoder` | [ `HttpUrlEncodingCodec` ](/api/common/http/HttpUrlEncodingCodec)|
| `ReadyState` | [ `HttpBackend` ](/api/common/http/HttpBackend)|
| `Request` | [ `HttpRequest` ](/api/common/http/HttpRequest)|
| `RequestMethod` | [ `HttpClient` ](/api/common/http/HttpClient)|
| `RequestOptions` | [ `HttpRequest` ](/api/common/http/HttpRequest)|
| `RequestOptionsArgs` | [ `HttpRequest` ](/api/common/http/HttpRequest)|
| `Response` | [ `HttpResponse` ](/api/common/http/HttpResponse)|
| `ResponseContentType` | [ `HttpClient` ](/api/common/http/HttpClient)|
| `ResponseOptions` | [ `HttpResponse` ](/api/common/http/HttpResponse)|
| `ResponseOptionsArgs` | [ `HttpResponse` ](/api/common/http/HttpResponse)|
| `ResponseType` | [ `HttpClient` ](/api/common/http/HttpClient)|
| `URLSearchParams` | [ `HttpParams` ](/api/common/http/HttpParams)|
| `XHRBackend` | [ `HttpXhrBackend` ](/api/common/http/HttpXhrBackend)|
| `XHRConnection` | [ `HttpXhrBackend` ](/api/common/http/HttpXhrBackend)|
| `XSRFStrategy` | [ `HttpClientXsrfModule` ](/api/common/http/HttpClientXsrfModule)|


| `@angular/http/testing` | Ближайшая замена в `@angular/common/http/testing` |
| --------------------- | ------------------------------------------- |
| `MockBackend` | [ `HttpTestingController` ](/api/common/http/testing/HttpTestingController)|
| `MockConnection` | [ `HttpTestingController` ](/api/common/http/testing/HttpTestingController)|
