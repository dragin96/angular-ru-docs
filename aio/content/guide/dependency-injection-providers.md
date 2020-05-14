{@a dependency-providers}
# Поставщики зависимостей

[Поставщик](guide/glossary#provider) зависимости настраивает инжектор
с помощью [DI токена](guide/glossary#di-token),
который этот инжектор использует для предоставления конкретной версии значения зависимости во время выполнения.
Инжектор полагается на конфигурацию провайдера для создания экземпляров зависимостей
что он внедряется в компоненты, директивы, каналы и другие службы.

Вы должны настроить инжектор с поставщиком, или он не будет знать, как создать зависимость.
Самый очевидный способ для инжектора создать экземпляр класса обслуживания - это сам класс.
Если вы указываете сам класс обслуживания в качестве маркера провайдера, то по умолчанию поведение инжектора создает экземпляр этого класса с помощью `new`.

В следующем типичном примере `Logger` Сам класс обеспечивает `Logger` экземпляр.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

Однако вы можете настроить инжектор с альтернативным поставщиком
для того, чтобы доставить какой-то другой объект, который обеспечивает необходимую функциональность регистрации.
Например:
* Вы можете предоставить замещающий класс.

* Вы можете предоставить похожий на логгер объект.

* Ваш провайдер может вызвать функцию фабрики регистратора.

{@a provide}

{@a the-provider-object-literal}
## `Provider` объекта литерал

Синтаксис поставщика классов - это сокращенное выражение, которое расширяется
в конфигурацию провайдера, определяемую [интерфейс `Provider` ](api/core/Provider).
В следующем фрагменте кода показано, как класс, заданный как `providers` Значение раскрывается в полный объект провайдера.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-logger">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-3" >
</code-example>

Расширенная конфигурация провайдера - это литерал объекта с двумя свойствами.

* `provide` свойство содержит [токен](guide/dependency-injection#token)
это служит ключом как для определения значения зависимости, так и для настройки инжектора.

* Второе свойство - это объект определения провайдера, который сообщает инжектору, как создать значение зависимости.
Ключ определения провайдера может быть `useClass`, как в примере.
Это также может быть `useExisting`, `useValue` или `useFactory`.
Каждый из этих ключей обеспечивает свой тип зависимости, как описано ниже.


{@a class-provider}

{@a alternative-class-providers}
## Поставщики альтернативного класса

Разные классы могут предоставлять одну и ту же услугу.
Например, следующий код сообщает инжектор
вернуть `BetterLogger` когда компонент запрашивает регистратор
с использованием `Logger`.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-4" >
</code-example>

{@a class-provider-dependencies}

{@a class-providers-with-dependencies}
### Класс провайдеров с зависимостями

Другой класс, `EvenBetterLogger`, может отображать имя пользователя в сообщении журнала.
Этот регистратор получает пользователя от введенного `UserService`.

<code-example path="dependency-injection/src/app/providers.component.ts" region="EvenBetterLogger"></code-example>

Инжектор нуждается в поставщиках для этой новой службы регистрации и ее зависимых `UserService` . Настройте этот альтернативный регистратор с помощью `useClass` определения провайдера, например `BetterLogger` . В следующем массиве указаны оба поставщика в `providers` опция метаданных родительского модуля или компонента.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-5"></code-example>

{@a aliased-class-providers}

{@a aliased-class-providers}
### Псевдоним класса провайдеров

Предположим, старый компонент зависит от `OldLogger` Класс.
 `OldLogger` имеет тот же интерфейс, что и `NewLogger`, но по какой-то причине
Вы не можете обновить старый компонент, чтобы использовать его.

Когда старый компонент регистрирует сообщение с `OldLogger`,
Вы хотите экземпляр синглтона `NewLogger` для обработки этого вместо.
В этом случае инжектор зависимостей должен внедрить этот единственный экземпляр
когда компонент запрашивает новый или старый регистратор.
 `OldLogger` должен быть *псевдонимом* для `NewLogger`.

Если вы пытаетесь псевдоним `OldLogger` для `NewLogger` с `useClass`, вы получите два разных `NewLogger` в вашем приложении.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6a"></code-example>

Чтобы убедиться, что есть только один экземпляр `NewLogger`, псевдоним `OldLogger` с `useExisting` опция.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-6b"></code-example>

{@a value-provider}

{@a value-providers}
## Значение провайдеров

Иногда проще предоставить готовый объект, чем попросить инжектора создать его из класса.
Для того, чтобы придать уже созданный объект,
настроить инжектор с `useValue` опция

Следующий код определяет переменную, которая создает такой объект, чтобы играть роль регистратора.

<code-example path="dependency-injection/src/app/providers.component.ts" region="silent-logger"></code-example>

Следующий объект провайдера использует `useValue` ключ чтобы связать переменную с `Logger`.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-7"></code-example>

{@a non-class-dependencies}

{@a non-class-dependencies}
### Неклассовые зависимости

Не все зависимости являются классами.
Иногда вы хотите ввести строку, функцию или объект.

Приложения часто определяют объекты конфигурации с множеством мелких фактов
например, название приложения или адрес конечной точки веб-API.
Эти объекты конфигурации не всегда являются экземплярами класса.
Они могут быть объектными литералами, как показано в следующем примере.

<code-example path="dependency-injection/src/app/app.config.ts" region="config" header="src/app/app.config.ts (excerpt)"></code-example>

{@a interface-not-valid-token}

**Интерфейсы TypeScript не являются допустимыми токенами**

 `HERO_DI_CONFIG ` соответствует ` AppConfig` Интерфейс.
К сожалению, вы не можете использовать интерфейс TypeScript в качестве токена.
В TypeScript интерфейс является артефактом времени разработки и не имеет представления (токена) времени выполнения, которое может использовать инфраструктура DI.

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9-interface"></code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-9-ctor-interface"></code-example>

<div class="alert is-helpful">

Это может показаться странным, если вы привыкли к внедрению зависимостей в строго типизированных языках, где интерфейс является предпочтительным ключом поиска зависимостей.
Однако JavaScript не имеет интерфейсов, поэтому, когда TypeScript переносится в JavaScript, интерфейс исчезает.
Для Angular не осталось информации о типе интерфейса для поиска во время выполнения.

</div>

Одна из альтернатив - предоставить и внедрить объект конфигурации в NgModule, например `AppModule`.

<code-example path="dependency-injection/src/app/app.module.ts" region="providers" header="src/app/app.module.ts (providers)"></code-example>

Другое решение для выбора токена провайдера для внеклассных зависимостей
определить и использовать `InjectionToken` объект.
В следующем примере показано, как определить такой токен.

<code-example path="dependency-injection/src/app/app.config.ts" region="token" header="src/app/app.config.ts"></code-example>

Параметр type, хотя и является необязательным, передает тип зависимости разработчикам и инструментам.
Описание токена - еще одна помощь для разработчиков.

Зарегистрируйте поставщика зависимостей, используя `InjectionToken` объект:

<code-example path="dependency-injection/src/app/providers.component.ts" region="providers-9"></code-example>

Теперь вы можете добавить объект конфигурации в любой конструктор, которому он нужен, с помощью
помощь `@Inject()` параметр декоратор.

<code-example path="dependency-injection/src/app/app.component.2.ts" region="ctor" header="src/app/app.component.ts"></code-example>

<div class="alert is-helpful">

Хотя `AppConfig` Интерфейс не играет роли в внедрении зависимостей
он поддерживает типирование объекта конфигурации в классе.

</div>


{@a factory-provider}
{@a factory-providers}

## Фабрика провайдеров

Иногда вам нужно динамически создать зависимое значение
на основе информации, которую вы не будете иметь до времени выполнения.
Например, вам может потребоваться информация, которая неоднократно изменяется в ходе сеанса браузера.
Кроме того, ваша инъекционная служба может не иметь независимого доступа к источнику информации.

В таких случаях вы можете использовать*заводской провайдер*.
Поставщики фабрики также могут быть полезны при создании экземпляра зависимости от
сторонняя библиотека, не предназначенная для работы с DI.

Например, предположим, `HeroService` должен скрывать *секретных* героев от обычных пользователей.
Только авторизованные пользователи должны видеть секретных героев.

подобно `EvenBetterLogger `, ` HeroService` должен знать, авторизован ли пользователь для просмотра секретных героев.
Эта авторизация может измениться в течение одного сеанса приложения
как при входе в систему другого пользователя.

Допустим, вы не хотите вводить `UserService` непосредственно в `HeroService`, потому что вы не хотите усложнять этот сервис конфиденциальной информацией.
 `HeroService` не будет иметь прямого доступа к пользовательской информации для принятия решения
кто уполномочен, а кто нет.

Чтобы решить эту проблему, мы даем `HeroService` конструктор логический флаг для управления отображением секретных героев.

<code-example path="dependency-injection/src/app/heroes/hero.service.ts" region="internals" header="src/app/heroes/hero.service.ts (excerpt)"></code-example>

Вы можете ввести `Logger`, но вы не можете ввести `isAuthorized` флаг. Вместо этого вы можете использовать поставщика фабрики для создания нового экземпляра регистратора для `HeroService`.

Фабричный поставщик нуждается в заводской функции.

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="factory" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

Хотя `HeroService` не имеет доступа к `UserService`, заводская функция делает.
Вы вводите оба `Logger` и `UserService` в заводской провайдер
и пусть инжектор передает их на заводские функции.

<code-example path="dependency-injection/src/app/heroes/hero.service.provider.ts" region="provider" header="src/app/heroes/hero.service.provider.ts (excerpt)"></code-example>

* `useFactory` сообщает Angular, что поставщик является фабричной функцией, реализация которой `heroServiceFactory`.

* `deps` Свойство является массивом [токенов провайдера](guide/dependency-injection#token).
 `Logger ` и ` UserService` служат токенами для их собственных поставщиков классов.
Инжектор разрешает эти токены и внедряет соответствующие сервисы в соответствующие параметры фабричной функции.

Обратите внимание, что вы захватили провайдера фабрики в экспортируемой переменной, `heroServiceProvider`.
Этот дополнительный шаг делает поставщика фабрики многоразовым.
Вы можете настроить поставщика `HeroService` с этой переменной, где вам это нужно.
В этом примере он нужен только в `HeroesComponent`,
где `heroServiceProvider` заменяет `HeroService` в метаданных `providers` массив.

Ниже показаны новые и старые реализации бок о бок.

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component (v3)" path="dependency-injection/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component (v2)" path="dependency-injection/src/app/heroes/heroes.component.1.ts">
  </code-pane>

</code-tabs>

{@a predefined-tokens-and-multiple-providers}
## Предопределенные токены и несколько провайдеров

Angular предоставляет ряд встроенных констант токенов инъекций, которые вы можете использовать для настройки поведения
различные системы.

Например, вы можете использовать следующие встроенные токены в качестве хуков в процессе начальной загрузки и инициализации фреймворка.
Объект провайдера может связать любой из этих маркеров внедрения с одной или несколькими функциями обратного вызова, которые выполняют действия по инициализации для конкретного приложения.

* [PLATFORM_INITIALIZER](api/core/PLATFORM_INITIALIZER): обратный вызов вызывается при инициализации платформы.

* [APP_BOOTSTRAP_LISTENER вызов](api/core/APP_BOOTSTRAP_LISTENER): обратный вызывается для каждого загружаемого компонента. Функция-обработчик получает экземпляр ComponentRef загрузочного компонента.

* [APP_INITIALIZER](api/core/APP_INITIALIZER): Обратный вызов вызывается до инициализации приложения. Все зарегистрированные инициализаторы могут при желании вернуть Обещание. Все функции инициализатора, которые возвращают Promises, должны быть разрешены до загрузки приложения. Если один из инициализаторов не удается разрешить, приложение не загружается.

У объекта провайдера может быть третий вариант, `multi: true`, который вы можете использовать с `APP_INITIALIZER` 
зарегистрировать несколько обработчиков для события предоставления.

Например, при начальной загрузке приложения вы можете зарегистрировать множество инициализаторов, используя один и тот же токен.

```
export const APP_TOKENS = [
 { provide: PLATFORM_INITIALIZER, useFactory: platformInitialized, multi: true },
 { provide: APP_INITIALIZER, useFactory: delayBootstrapping, multi: true },
 { provide: APP_BOOTSTRAP_LISTENER, useFactory: appBootstrapped, multi: true },
];
```

Несколько провайдеров могут быть связаны с одним токеном и в других областях.
Например, вы можете зарегистрировать пользовательский валидатор форм с помощью встроенного [NG_VALIDATORS](api/forms/NG_VALIDATORS)маркер,
и предоставить несколько экземпляров данного поставщика валидатора с помощью `multi: true` Свойство в объекте провайдера.
Angular добавляет ваши пользовательские валидаторы в существующую коллекцию.

Маршрутизатор также использует несколько провайдеров, связанных с одним токеном.
Когда вы предоставляете несколько наборов маршрутов, используя [RouterModule.forRoot](api/router/RouterModule#forroot)
и [RouterModule.forChild](api/router/RouterModule#forchild)в одном модуле
в [МАРШРУТЫ](api/router/ROUTES)лексем сочетает в себе все различные предлагаемые наборы маршрутов в одно значение.

<div class="alert is-helpful">

Искать [Константы в документации API)](api?type=const)чтобы найти больше встроенных токенов.

</div>

{@a tree-shakable-provider}
{@a tree-shakable-providers}

{@a tree-shakable-providers}
## Поставщики, работающие на деревьях

Встряхивание дерева относится к параметру компилятора, который удаляет код из окончательного пакета, если приложение не ссылается на этот код.
Когда провайдеры могут перемещаться по деревьям, Angular компилятор удаляет связанные
сервисы из окончательного вывода, когда он определяет, что ваше приложение не использует эти сервисы.
Это значительно уменьшает размер ваших связок.

<div class="alert is-helpful">

В идеале, если приложение не внедряет службу, Angular не должен включать ее в окончательный вывод.
Тем не менее, Angular должен уметь определять во время сборки, будет ли приложение нуждаться в услуге или нет.
Потому что всегда можно ввести сервис напрямую, используя `injector.get(Service)`,
Angular не может идентифицировать все места в вашем коде, где может произойти эта инъекция
так что у него нет другого выбора, кроме как включить сервис в инжектор.
Таким образом, сервисы в NgModule `providers` Массив или на уровне компонентов не может быть преобразован в дерево.

</div>

В следующем примере провайдеров без возможности обмена дерева в Angular настраивается поставщик услуг для инжектора модуля NgModule.

<code-example path="dependency-injection/src/app/tree-shaking/service-and-module.ts" header="src/app/tree-shaking/service-and-modules.ts"></code-example>

Затем вы можете импортировать этот модуль в модуль приложения
сделать сервис доступным для инъекций в вашем приложении
как в следующем примере.

<code-example path="dependency-injection/src/app/tree-shaking/app.module.ts" header="src/app/tree-shaking/app.modules.ts"></code-example>

когда `ngc` работает, он компилирует `AppModule` в фабрику модулей, которая содержит определения для всех провайдеров, объявленных во всех модулях, которые он включает. Во время выполнения эта фабрика становится инжектором, который создает эти службы.

Тряска дерева здесь не работает, потому что Angular не может решить исключить один кусок кода (определение поставщика для сервиса в фабрике модулей) на основе того, используется ли другой кусок кода (класс обслуживания). Чтобы сделать службы доступными для дерева, информация о том, как создать экземпляр службы (определение поставщика), должна быть частью самого класса службы.

{@a creating-tree-shakable-providers}
### Создание древовидных провайдеров

Вы можете сделать провайдера доступным для дерева, указав его в `@Injectable()` на самом сервисе, а не в метаданных для NgModule или компонента, который зависит от сервиса.

В следующем примере показан древовидный эквивалент `ServiceModule` Пример выше.

<code-example path="dependency-injection/src/app/tree-shaking/service.ts" header="src/app/tree-shaking/service.ts"></code-example>

Службу можно создать, настроив заводскую функцию, как показано в следующем примере.

<code-example path="dependency-injection/src/app/tree-shaking/service.0.ts" header="src/app/tree-shaking/service.0.ts"></code-example>

<div class="alert is-helpful">

Чтобы переопределить поставщика с возможностью ветвления дерева, настройте инжектор определенного модуля NgModule или компонента с другим поставщиком, используя `providers: []` синтаксис массива `@NgModule()` или `@Component()` декоратор.

</div>
