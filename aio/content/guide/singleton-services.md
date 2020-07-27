{@a singleton-services}
# Синглтон сервис

Синглтон сервис - это сервис, для которого в приложении существует только один экземпляр.

Для примера приложения, использующего единый сервис для всего приложения, который описан на этой странице, см
<live-example name="ngmodules"></live-example>демонстрируя все документированные функции NgModules.

{@a providing-a-singleton-service}
## Предоставление единого сервиса

Есть два способа создать синглтон сервис в Angular:

* Установить `providedIn` собственность `@Injectable()` для `"root"`.
* Включить услугу в `AppModule` или в модуле, который импортируется только `AppModule` 


{@a providedIn}

{@a using-providedin}
### С помощью `providedIn` 

Начиная с Angular 6.0, предпочтительным способом создания одноэлементного сервиса является установка `providedIn` в `root` на сервисе `@Injectable()` декоратор. Это говорит Angular
предоставлять сервис в корне приложения.

<code-example path="providers/src/app/user.service.0.ts" header="src/app/user.service.ts"></code-example>

Для получения более подробной информации об услугах см. [Услуги](tutorial/toh-pt4)Главу
[Учебник Тур героев](tutorial).

{@a ngmodule-providers-array}
### NgModule `providers` массив

В приложениях, созданных с версиями Angular до 6.0, сервисы регистрируются NgModule `providers` массивов следующим образом :

```ts
@NgModule({
  ...
  providers: [UserService],
  ...
})

```

Если бы этот NgModule был корневым `AppModule`, `UserService` будет и доступным
на протяжении всего приложения. Хотя вы можете видеть это закодировано таким образом, используя `providedIn` собственность `@Injectable()` с версии Angular 6.0, декоратор для самого сервиса предпочтительнее, так как он делает ваши сервисы доступными для дерева.

{@a forRoot}

{@a the-forroot-pattern}
## `forRoot()` модели

Как правило, вам нужно только `providedIn` для предоставления услуг и `forRoot()` / `forChild()` для маршрутизации. Тем не менее, понимание того, как `forRoot()` работает, чтобы удостовериться, что сервис является одноэлементным, и проинформирует вашу разработку на более глубоком уровне

Если модуль определяет как поставщиков, так и декларации (компоненты, директивы, трубы),
затем загрузка модуля в несколько функциональных модулей будет дублировать регистрацию службы. Это может привести к нескольким экземплярам службы, и служба больше не будет работать как одиночная.

Есть несколько способов, чтобы предотвратить это:

* Используйте [предоставленный синтаксис](guide/singleton-services#providedIn)вместо регистрации службы в модуле.
* Разделяйте свои сервисы на собственный модуль.
* определять `forRoot()` и `forChild()` в модуле.

<div class="alert is-helpful">

**Примечание:** есть два примера приложений, где вы можете увидеть этот сценарий; более продвинутый <live-example noDownload name="ngmodules">пример NgModules live </live-example>, который содержит `forRoot()` и `forChild()` в модулях маршрутизации и `GreetingModule` и простой <live-example name="lazy-loading-ngmodules" noDownload>пример Lazy Loading live </live-example>. Вводное объяснение см. В руководстве [Модули отложенной загрузки](guide/lazy-loading-ngmodules).

</div>


использование `forRoot()` в
отделите провайдеров от модуля, чтобы вы могли импортировать этот модуль в корневой модуль
с `providers` и дочерние модули без `providers`.

1. Создать статический метод `forRoot()` в модуле.
2. Поместите поставщиков в `forRoot()`.

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts"></code-example>


{@a forRoot-router}

{@a forroot-and-the-router}
### `forRoot()` и `Router` 

 `RouterModule` предоставляет `Router` сервис, а также директивы маршрутизатора, такие как `RouterOutlet` и `routerLink` . Импортирует модуль корневого приложения `RouterModule` чтобы приложение имело `Router` и компоненты корневого приложения могут обращаться к директивам маршрутизатора. Любые функциональные модули также должны импортировать `RouterModule` чтобы их компоненты могли помещать директивы маршрутизатора в свои шаблоны.

Если `RouterModule` не было `forRoot()` то каждый функциональный модуль будет создавать новую `Router` Экземпляр, который сломает приложение, так как может быть только один `Router` . Используя `forRoot()`, импортирует модуль корневого приложения `RouterModule.forRoot(...)` и получает `Router` и импорт всех функциональных модулей `RouterModule.forChild(...)` который не создает экземпляр другого `Router`.

<div class="alert is-helpful">

**Примечание:** Если у вас есть модуль, который имеет как поставщиков, так и декларации,
Вы можете использовать это
Техника, чтобы отделить их, и вы можете увидеть этот шаблон в старых приложениях.
Однако, начиная с Angular 6.0, лучшая практика предоставления услуг - это
 `@Injectable()` `providedIn` собственность.

</div>

{@a how-forroot-works}
### Как `forRoot()` работает

 `forRoot()` принимает объект конфигурации службы и возвращает a
[ModuleWithProviders](api/core/ModuleWithProviders), который есть
простой объект со следующими свойствами:

* `ngModule` : в этом примере `GreetingModule` Класс
* `providers` : настроенные провайдеры

В <live-example name="ngmodules">живом примере </live-example>
корень `AppModule` импортирует `GreetingModule` и добавляет
 `providers ` к ` AppModule` Поставщики . В частности,
Angular накапливает всех импортных провайдеров
перед добавлением пунктов, перечисленных в `@NgModule.providers`.
Эта последовательность гарантирует, что все, что вы добавляете явно
 `AppModule` Поставщики имеют приоритет над поставщиками
импортных модулей.

Пример импорта приложения `GreetingModule` и использует его `forRoot()` один раз, в `AppModule` . Если вы зарегистрируете его один раз, это предотвратит множественные случаи.

Вы также можете добавить `forRoot()` в `GreetingModule` который настраивает
приветствие `UserService`.

В следующем примере необязательный вводится `UserServiceConfig` 
расширяет приветствие `UserService` . Если `UserServiceConfig` существует, `UserService` устанавливает имя пользователя из этой конфигурации.

<code-example path="ngmodules/src/app/greeting/user.service.ts" region="ctor" header="src/app/greeting/user.service.ts (constructor)"></code-example>

Вот `forRoot()` который принимает `UserServiceConfig` объект:

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="for-root" header="src/app/greeting/greeting.module.ts (forRoot)"></code-example>

Наконец, позвоните в `imports` список `AppModule` . В следующем
фрагмент, остальные части файла не учтены. Полный файл см. В <live-example name="ngmodules"></live-example>или перейдите к следующему разделу этого документа.

<code-example path="ngmodules/src/app/app.module.ts" region="import-for-root" header="src/app/app.module.ts (imports)"></code-example>

Приложение отображает «Мисс Марпл» в качестве пользователя вместо стандартного «Шерлок Холмс».

Не забудьте импортировать `GreetingModule` как импорт Javascript вверху файла и не добавляйте его более чем в один `@NgModule` `imports` список.

{@a prevent-reimport-of-the-greetingmodule}
## Предотвратить реимпорт `GreetingModule` 

Только корень `AppModule` должен импортировать `GreetingModule` . Если а
модуль, загруженный с отложенной загрузкой, тоже импортирует его, приложение может генерировать
[несколько экземпляров](guide/ngmodule-faq#q-why-bad)услуги.

Предотвращение повторного импорта загруженного модуля `GreetingModule`, добавьте следующее `GreetingModule` Конструктор.

<code-example path="ngmodules/src/app/greeting/greeting.module.ts" region="ctor" header="src/app/greeting/greeting.module.ts"></code-example>

Конструктор говорит Angular вводить `GreetingModule` в себя.
Инъекция была бы круглой, если бы Angular искал
 `GreetingModule` в _current_ инжекторе, но `@SkipSelf()` 
декоратор означает «искать `GreetingModule` у предка
инжектор, выше меня в иерархии инжектора.»

По умолчанию, инжектор выдает ошибку, когда он не может
найти запрашиваемую поставщика.
 `@Optional()` означает, что не найти службу в порядке.
Инжектор возвращается `null`, `parentModule` Параметр имеет значение null
и конструктор завершает без происшествий.

Это другая история, если вы неправильно импортируете `GreetingModule` в лениво загруженный модуль, такой как `CustomersModule`.

Angular создает загруженный модуль с собственным инжектором
дитя корневого инжектора.
 `@SkipSelf()` заставляет Angular искать `GreetingModule` в родительском инжекторе, который на этот раз является корневым инжектором.
Конечно, он находит экземпляр, импортированный корнем `AppModule`.
Сейчас `parentModule` существует, и конструктор выдает ошибку.

Вот эти два файла в полном объеме для справки:

<code-tabs>
 <code-pane header="app.module.ts" path="ngmodules/src/app/app.module.ts">
 </code-pane>
 <code-pane header="greeting.module.ts" region="whole-greeting-module" path="ngmodules/src/app/greeting/greeting.module.ts">
 </code-pane>
</code-tabs>

<hr />

{@a more-on-ngmodules}
## Больше на NgModules

Вы также можете быть заинтересованы в:
* [Совместное использование модулей](guide/sharing-ngmodules), в котором подробно рассматриваются концепции, представленные на этой странице.
* [Ленивые загрузочные модули](guide/lazy-loading-ngmodules).
* [NgModule FAQ](guide/ngmodule-faq).
