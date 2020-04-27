{@a dependency-injection-in-action}
# Внедрение зависимости в действии

В этом разделе рассматриваются многие функции внедрения зависимостей (DI) в Angular.
{@a toc}

Смотрите <live-example name="dependency-injection-in-action"></live-example>
кода в этой кулинарной книге.

{@a nested-dependencies}

{@a nested-service-dependencies}
## Вложенные сервисные зависимости

_Consumer_ внедренного сервиса не должен знать, как создать этот сервис.
Задача инфраструктуры DI - создавать и кэшировать зависимости. Потребитель просто
необходимо сообщить структуре DI, какие зависимости ей нужны.

Иногда услуга зависит от других услуг, которые могут зависеть от других услуг.
Каркас внедрения зависимостей разрешает эти вложенные зависимости в правильном порядке.
На каждом шаге потребитель зависимостей объявляет, что ему требуется в своем
конструктор, и позволяет инфраструктуре предоставлять их.

Следующий пример показывает, что `AppComponent` заявляет о своей зависимости от `LoggerService` и `UserContext`.

<code-example path="dependency-injection-in-action/src/app/app.component.ts" region="ctor" header="src/app/app.component.ts"></code-example>


 `UserContext` в свою очередь зависит от обоих `LoggerService` и
 `UserService`, еще один сервис, который собирает информацию о конкретном пользователе.


<code-example path="dependency-injection-in-action/src/app/user-context.service.ts" region="injectables" header="user-context.service.ts (injection)"></code-example>


Когда Angular создает `AppComponent`, структура DI создает экземпляр `LoggerService` и начинает создавать `UserContextService`.
 `UserContextService` также нуждается `LoggerService`, который уже имеется в фреймворке, поэтому фреймворк может предоставить тот же экземпляр. `UserContextService` также нуждается `UserService`, который фреймворк еще не создал. `UserService` не имеет дальнейших зависимостей, поэтому инфраструктура может просто использовать `new` чтобы создать экземпляр класса и предоставить экземпляр для `UserContextService` конструктор.

Родитель `AppComponent` не должен знать о зависимостях зависимостей.
Объявите, что нужно в конструкторе (в данном случае `LoggerService` и `UserContextService`)
и каркас разрешает вложенные зависимости.

Когда все зависимости на месте, `AppComponent` отображает информацию о пользователе.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/logged-in-user.png" alt="Logged In User">
</div>

{@a service-scope}

{@a limit-service-scope-to-a-component-subtree}
## Ограничьте область обслуживания для поддерева компонента

Приложение Angular имеет несколько инжекторов, расположенных в виде иерархии дерева, которая параллельна дереву компонента.
Каждый инжектор создает отдельный экземпляр зависимости.
Тот же самый экземпляр вводится везде, где этот инжектор предоставляет эту услугу.
Конкретная услуга может предоставляться и создаваться на любом уровне иерархии инжекторов
это означает, что может быть несколько экземпляров службы, если она предоставляется несколькими инжекторами.

Зависимости, предоставляемые корневым инжектором, могут быть внедрены в *любой* компонент в *любом месте* приложения.
В некоторых случаях вы можете захотеть ограничить доступность службы для определенного региона приложения.
Например, вы можете захотеть, чтобы позволить пользователям явно OPT, чтобы воспользоваться услугой,
вместо того, чтобы позволить корневому инжектору обеспечить его автоматически.

Вы можете ограничить область действия внедренного сервиса до *ветви* иерархии приложения
предоставляя эту услугу *в подчиненном компоненте для этой ветви*.
В этом примере показано, как создать другой экземпляр `HeroService` доступен для `HeroesBaseComponent` 
добавив его в `providers` массив `@Component()` декоратор подкомпонента.

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="injection" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent excerpt)">

</code-example>

Когда Angular создает `HeroesBaseComponent`, он также создает новый экземпляр `HeroService` 
это видно только этому компоненту и его дочерним элементам, если таковые имеются.

Вы также можете предоставить `HeroService` для другого компонента в другом месте приложения.
Это привело бы к другому экземпляру службы, живущей в другом инжекторе.

<div class="alert is-helpful">

Примеры таких областей применения `HeroService` появляются в сопровождающем примере кода
включая `HeroBiosComponent`, `HeroOfTheMonthComponent`, и `HeroesBaseComponent`.
Каждый из этих компонентов имеет свои `HeroService` управляет собственной независимой коллекцией героев.

</div>


{@a multiple-service-instances}


{@a multiple-service-instances-sandboxing}
## Несколько сервисных экземпляров (песочница)

Иногда требуется несколько экземпляров службы на *одном уровне* иерархии компонентов.

Хорошим примером является служба, которая хранит состояние для своего экземпляра компонента-компаньона.
Вам нужен отдельный экземпляр службы для каждого компонента.
Каждый сервис имеет свое рабочее состояние, изолированное от сервиса и состояния другого компонента.
Это называется *песочница* потому что каждый экземпляр службы и компонента имеет свою собственную песочницу для воспроизведения

{@a hero-bios-component}

В этом примере `HeroBiosComponent` представляет три экземпляра `HeroBioComponent`.

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="simple" header="ap/hero-bios.component.ts">

</code-example>


каждый `HeroBioComponent` может редактировать биографию одного героя.
 `HeroBioComponent` опирается на `HeroCacheService` для извлечения, кэширования и выполнения других операций сохранения этого героя.

<code-example path="dependency-injection-in-action/src/app/hero-cache.service.ts" region="service" header="src/app/hero-cache.service.ts">

</code-example>


Три случая `HeroBioComponent` не может использовать один и тот же экземпляр `HeroCacheService`,
поскольку они будут конкурировать друг с другом, чтобы определить, какого героя следует кэшировать.

Вместо этого каждый `HeroBioComponent` получает свой *собственный* `HeroCacheService` экземпляр
по списку `HeroCacheService` в своих метаданных `providers` массив.

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="component" header="src/app/hero-bio.component.ts">

</code-example>


Родитель `HeroBiosComponent` связывает значение с `heroId`.
 `ngOnInit` передает этот идентификатор службе, которая выбирает и кэширует героя.
Добытчик для `hero` Свойство тянет кэшированного героя со службы.
Шаблон отображает это свойство с привязкой к данным.

Найдите этот пример в <live-example name="dependency-injection-in-action">живом коде </live-example>
и подтвердить, что три `HeroBioComponent` имеют собственные кэшированные данные о героях.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios.png" alt="Bios">
</div>

{@a qualify-dependency-lookup}

{@a qualify-dependency-lookup-with-parameter-decorators}
## Квалифицируйте поиск зависимостей с помощью декораторов параметров

Когда класс требует зависимости, эта зависимость добавляется в конструктор в качестве параметра.
Когда Angular необходимо создать экземпляр класса, он вызывает платформу DI для обеспечения зависимости.
По умолчанию структура DI ищет поставщика в иерархии инжекторов
начиная с локального инжектора компонента, и, если необходимо, пузырится
через инжекторное дерево, пока не достигнет корневого инжектора.

* Первый инжектор, настроенный с провайдером, предоставляет зависимость (экземпляр или значение службы) конструктору.

* Если в корневом инжекторе не найден поставщик, структура DI выдает ошибку.

Существует ряд опций для изменения поведения поиска по умолчанию с использованием _parameter decorators_
на служебные параметры конструктора класса.

{@a optional}

{@a make-a-dependency-@optional-and-limit-search-with-@host}
### Сделать зависимость `@Optional` и ограниченный поиск с `@Host` 

Зависимости могут быть зарегистрированы на любом уровне в иерархии компонентов.
Когда компонент запрашивает зависимость, Angular запускается с инжектора этого компонента
и идет вверх по дереву инжектора, пока не найдет первого подходящего поставщика.
Angular выдает ошибку, если не может найти зависимость во время этой прогулки.

В некоторых случаях вам нужно ограничить поиск или учесть отсутствующую зависимость.
Вы можете изменить поведение поиска Angular с помощью `@Host` и `@Optional` квалификация
декораторы для служебного параметра конструктора компонента.

* `@Optional` свойство decorator говорит Angular возвращать когда он не может найти зависимость.

* `@Host` свойства останавливает поиск вверх по*компоненту хоста *.
Хост-компонент обычно является компонентом, запрашивающим зависимость.
Однако, когда этот компонент проектируется в *родительский* компонент,
этот родительский компонент становится хостом. Следующий пример охватывает этот второй случай.

Эти декораторы могут использоваться по отдельности или вместе, как показано в примере.
Эта `HeroBiosAndContactsComponent` представляет собой пересмотр `HeroBiosComponent` который вы смотрели [выше](guide/dependency-injection-in-action#hero-bios-component).

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="hero-bios-and-contacts" header="src/app/hero-bios.component.ts (HeroBiosAndContactsComponent)">

</code-example>

Сосредоточиться на шаблоне

<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="template" header="dependency-injection-in-action/src/app/hero-bios.component.ts"></code-example>

Теперь есть новый `<hero-contact>` элемент между `<hero-bio>` теги.
Angular *проекты*, или *заключает*, соответствующие `HeroContactComponent` в `HeroBioComponent` посмотреть,
поместив его в `<ng-content>` слот `HeroBioComponent` шаблон.

<code-example path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="template" header="src/app/hero-bio.component.ts (template)"></code-example>

Результат показан ниже, с номером телефона героя из `HeroContactComponent` проецируется над описанием героя.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-and-content.png" alt="bio and contact">
</div>


Вот `HeroContactComponent`, который демонстрирует отборочные декораторы.

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="component" header="src/app/hero-contact.component.ts">

</code-example>

Сосредоточьтесь на параметрах конструктора.

<code-example path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="ctor-params" header="src/app/hero-contact.component.ts"></code-example>

 `@Host()` украшающая `heroCache` конструктора обеспечивает это
вы получаете ссылку на службу кэширования от родителя `HeroBioComponent`.
Angular выдает ошибку, если родителю не хватает этого сервиса, даже если компонент выше
в дереве компонентов это включено.

Второй `@Host()` украшает `loggerService` конструктора.
Единственный `LoggerService` в приложении предоставляется на `AppComponent` Уровень.
Гостья `HeroBioComponent` не имеет своего собственного `LoggerService` провайдер.

Angular выдает ошибку, если вы не украсили свойство `@Optional()`.
Когда свойство помечено как необязательное, Angular наборы `loggerService` для нуля, а остальная часть компонента адаптируется.


Вот `HeroBiosAndContactsComponent` в действии.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/hero-bios-and-contacts.png" alt="Bios with contact into">
</div>



Если вы закомментируете `@Host()` декоратор, Angular идет вверх по дереву предков инжекторов
пока он не найдет регистратор на `AppComponent` Уровень.
Логика логгера включается и герой отображает обновления
с "!!!" маркер, чтобы указать, что регистратор был найден.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/hero-bio-contact-no-host.png" alt="Without @Host">
</div>


Если вы восстановите `@Host()` декоратор и закомментируйте `@Optional`,
приложение выдает исключение, когда не может найти требуемый регистратор на уровне компонента хоста.

 `EXCEPTION: No provider for LoggerService! (HeroContactComponent -> LoggerService)` 

{@a supply-a-custom-provider-with-@inject}
### Поставляем нестандартного провайдера `@Inject` 

Использование настраиваемого поставщика позволяет предоставить конкретную реализацию для неявных зависимостей, таких как встроенные API-интерфейсы браузера. В следующем примере используется `InjectionToken` для предоставления [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)API браузера в качестве зависимости в `BrowserStorageService`.

<code-example path="dependency-injection-in-action/src/app/storage.service.ts" header="src/app/storage.service.ts">

</code-example>

 `factory` функция возвращает `localStorage`, которое прикреплено к объекту окна браузера. `Inject` decorator - это параметр конструктора, используемый для указания пользовательского поставщика зависимости. Этот пользовательский поставщик теперь может быть переопределен во время тестирования с фиктивным API `localStorage` вместо взаимодействия с реальными браузерными API.

{@a skip}

{@a modify-the-provider-search-with-@self-and-@skipself}
### Изменить поиск поставщика с `@Self` и `@SkipSelf` 

Поставщик также может ограничивать область действия инжектора через декораторы параметров конструктора. Следующий пример переопределяет `BROWSER_STORAGE` в `Component` Класс `providers ` с ` sessionStorage` API браузера . Такой же `BrowserStorageService` вводится дважды в конструктор, украшенный `@Self` и `@SkipSelf` чтобы определить, какой инжектор обрабатывает зависимость поставщика.

<code-example path="dependency-injection-in-action/src/app/storage.component.ts" header="src/app/storage.component.ts">

</code-example>

С использованием `@Self` декоратор, инжектор смотрит только на инжектор компонента для своих провайдеров. `@SkipSelf` Декоратор позволяет пропускать локальный инжектор и искать в иерархии, чтобы найти поставщика, который удовлетворяет этой зависимости. `sessionStorageService` взаимодействует с `BrowserStorageService` с использованием `sessionStorage` API браузера, в то время как `localStorageService` пропускает локальный инжектор и использует рут `BrowserStorageService` который использует `localStorage` API браузера.

{@a component-element}

{@a inject-the-components-dom-element}
## Вставить элемент DOM компонента

Хотя разработчики стремятся избежать этого, много визуальных эффектов и сторонних инструментов, таких как JQuery,
требуется доступ DOM.
В результате вам может понадобиться доступ к элементу DOM компонента.

Чтобы проиллюстрировать, вот упрощенная версия `HighlightDirective` от
[Директивы атрибутов](guide/attribute-directives)стр.

<code-example path="dependency-injection-in-action/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts">

</code-example>

Директива устанавливает цвет фона для выделения, когда пользователь наводит курсор на
Элемент DOM, к которому применяется директива.

Angular множества конструктора `el` Параметр к введенному `ElementRef`.
(An `ElementRef` - это оболочка для элемента DOM
чья `nativeElement` предоставляет элемент DOM для работы с директивой.)

В примере кода применяется директива `myHighlight` атрибут для двух `<div>` теги
сначала без значения (получая цвет по умолчанию), а затем с назначенным значением цвета.

<code-example path="dependency-injection-in-action/src/app/app.component.html" region="highlight" header="src/app/app.component.html (highlight)"></code-example>


На следующем изображении показан эффект наложения мыши на `<hero-bios-and-contacts>` тэг.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/highlight.png" alt="Highlighted bios">
</div>

{@a providers}


{@a define-dependencies-with-providers}
## Определите зависимости с поставщиками

В этом разделе показано, как написать поставщиков, которые предоставляют зависимые услуги.

Чтобы получить сервис от инжектора зависимостей, вы должны дать ему [токен](guide/glossary#token).
Angular обычно обрабатывает эту транзакцию, указывая параметр конструктора и его тип.
Тип параметра служит токеном поиска инжектора.
Angular передает этот токен инжектору и присваивает результат параметру.

Ниже приведен типичный пример.


<code-example path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="ctor" header="src/app/hero-bios.component.ts (component constructor injection)"></code-example>


Angular просит инжектор для обслуживания, связанного с `LoggerService` 
и присваивает возвращаемое значение `logger` параметр.

Если форсунка уже кэшируются экземпляр службы, связанный с маркером,
это обеспечивает тот экземпляр.
Если этого не произойдет, его нужно будет сделать с помощью провайдера, связанного с токеном.

<div class="alert is-helpful">

Если у инжектора нет провайдера для запрошенного токена, он делегирует запрос
в родительский инжектор, где процесс повторяется до тех пор, пока не останется больше инжекторов.
Если поиск не удается, инжектор выдает ошибку - если запрос не был [необязательно](guide/dependency-injection-in-action#optional).


</div>

Новый инжектор не имеет поставщиков.
Angular инициализирует созданные инжекторы с набором предпочтительных поставщиков.
Вы должны настроить провайдеров для своих собственных зависимых от приложения зависимостей.


{@a defining-providers}


{@a defining-providers}
### Определение провайдеров

Зависимость не всегда может быть создана методом по умолчанию для создания экземпляра класса.
Вы узнали о некоторых других методах в [Поставщики зависимостей](guide/dependency-injection-providers).
Последующий `HeroOfTheMonthComponent` демонстрирует многие из альтернатив и почему они вам нужны.
Это визуально просто: несколько свойств и журналы, созданные регистратором.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/hero-of-month.png" alt="Hero of the month">
</div>

Код позади него настраивает, как и где структура DI обеспечивает зависимости.
Варианты использования иллюстрируют различные способы использования [* обеспечить* литерал объекта](guide/dependency-injection-providers#provide)для связывания объекта определения с маркером DI.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="hero-of-the-month" header="hero-of-the-month.component.ts">

</code-example>

 `providers` Массив показывает, как вы можете использовать разные ключи определения провайдера;
 `useValue `, ` useClass `, ` useExisting ` или ` useFactory`.

{@a usevalue}


{@a value-providers-usevalue}
#### Значение провайдеров: `useValue` 

 `useValue` Ключ позволяет связать фиксированное значение с маркером DI.
Используйте этот метод для предоставления *констант конфигурации времени выполнения,* таких как базовые адреса веб-сайтов и флаги функций.
Вы также можете использовать провайдера значений в модульном тесте для предоставления фиктивных данных вместо службы производственных данных.

 `HeroOfTheMonthComponent` имеет двух поставщиков значений.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-value" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

* Первый обеспечивает существующий экземпляр `Hero` Класс чтобы использовать для `Hero` жетон, а не
требуя инжектор для создания нового экземпляра с `new` или использовать собственный кэшированный экземпляр.
Здесь токен - это сам класс.

* Второе указывает ресурс литеральной строки, который будет использоваться для `TITLE` токена.
 `TITLE` Маркер провайдера - это *не* класс, а вместо этого
специальный вид ключа поиска поставщика, называемый [токен инъекции](guide/dependency-injection-in-action#injection-token), представленный как
 `InjectionToken` экземпляр.

Вы можете использовать токен для любого поставщика, но это особенно важно
полезно, когда зависимость представляет собой простое значение, такое как строка, число или функция.

Значение *поставщика значения* должны быть определены, прежде чем указать его здесь.
Строка литерала заголовка доступна сразу.
 `someHero` Переменная в этом примере была установлена ​​ранее в файле, как показано ниже.
Вы не можете использовать переменную, значение которой будет определено позже.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="some-hero" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

Другие типы провайдеров могут создавать свои ценности *лениво*; то есть когда они нужны для инъекции.

{@a useclass}


{@a class-providers-useclass}
#### Класс провайдеров: `useClass` 

 `useClass` поставщика позволяет создавать и возвращать новый экземпляр указанного класса.

Вы можете использовать этот тип поставщика для замены *альтернативной реализации*
для общего класса или класса по умолчанию.
Альтернативная реализация может, например, реализовать другую стратегию
расширить класс по умолчанию или эмулировать поведение реального класса в тестовом примере.

Следующий код показывает два примера в `HeroOfTheMonthComponent`.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-class" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

Первым провайдером является *обезвоженная*, расширенная форма наиболее типичного случая, в котором
класс, который будет создан (`HeroService`) также является токеном внедрения зависимостей провайдера.
Короткая форма обычно предпочтительна; эта длинная форма делает детали явными.

Второй провайдер заменяет `DateLoggerService` для `LoggerService`.
 `LoggerService` уже зарегистрирован на `AppComponent` Уровень.
Когда этот дочерний компонент запрашивает `LoggerService`, он получает `DateLoggerService` экземпляр.

<div class="alert is-helpful">

Этот компонент и его дерево дочерних компонентов получают `DateLoggerService`.
Компоненты вне дерева продолжают получать оригинал `LoggerService`.

</div>

 `DateLoggerService` наследуется от `LoggerService` ; он добавляет текущую дату / время для каждого сообщения:

<code-example path="dependency-injection-in-action/src/app/date-logger.service.ts" region="date-logger-service" header="src/app/date-logger.service.ts"></code-example>

{@a useexisting}

{@a alias-providers-useexisting}
#### Поставщики псевдонимов: `useExisting` 

 `useExisting` провайдера позволяет сопоставить один токен с другим.
По сути, первый токен является *псевдонимом* для службы, связанной со вторым токеном
создание двух способов доступа к одному и тому же объекту службы.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

Вы можете использовать эту технику для сужения API через интерфейс псевдонимов.
В следующем примере показан псевдоним, введенный для этой цели.

Представьте себе, что `LoggerService` имеет большой API, намного больший, чем три фактических метода и свойство.
Возможно, вы захотите уменьшить эту поверхность API только до тех членов, которые вам действительно нужны.
В этом примере `MinimalLogger` [класс-интерфейс](#class-interface)уменьшает API для двух членов:


<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="src/app/minimal-logger.service.ts"></code-example>

В следующем примере `MinimalLogger` для использования в упрощенной версии `HeroOfTheMonthComponent`.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.1.ts" header="src/app/hero-of-the-month.component.ts (minimal version)"></code-example>

 `HeroOfTheMonthComponent ` конструктор ` logger` параметр набирается как `MinimalLogger`, так что только `logs` и `logInfo` Члены видны в редакторе с поддержкой TypeScript.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/minimal-logger-intellisense.png" alt="MinimalLogger restricted API">
</div>


За кулисами Angular устанавливает `logger` параметр для полного сервиса, зарегистрированного под `LoggingService`, который является `DateLoggerService` который был [предоставлен выше](guide/dependency-injection-in-action#useclass).


<div class="alert is-helpful">

Это показано на следующем рисунке, на котором показана дата регистрации.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/date-logger-entry.png" alt="DateLoggerService entry">
</div>

</div>

{@a usefactory}

{@a factory-providers-usefactory}
#### Фабрика поставщиков: `useFactory` 

 `useFactory` поставщика позволяет создать объект зависимости, вызвав функцию фабрики
как в следующем примере.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-factory" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

Инжектор обеспечивает значение зависимостей путем применения функции фабрики,
что вы предоставляете в качестве значения `useFactory` ключ.
Обратите внимание, что эта форма поставщика имеет третий ключ, `deps`, который указывает
зависимости для `useFactory` Функция.

Используйте эту технику для создания объекта зависимости с фабричной функцией
чьи входы являются комбинацией *введенных услуг* и *местного государства*.

Объект зависимости (возвращаемый фабричной функцией) обычно является экземпляром класса
но могут быть и другие вещи.
В этом примере объект зависимости - это строка имен участников, занявших второе место
на конкурс «Герой месяца».

В данном примере местное состояние - это число `2`, количество участников, которые должен показывать компонент.
Значение состояния передается в качестве аргумента `runnersUpFactory()`.
 `runnersUpFactory()` возвращает *функцию фабрики провайдера*, которая может использовать оба
переданное значение состояния и введенные услуги `Hero` и `HeroService`.


<code-example path="dependency-injection-in-action/src/app/runners-up.ts" region="factory-synopsis" header="runners-up.ts (excerpt)"></code-example>

Функция фабрики провайдера (возвращается `runnersUpFactory()` ) возвращает реальный объект зависимостей,
Строка имен.

* Функция берет выигрыш `Hero` и `HeroService` качестве аргументов.
Angular предоставляет эти аргументы из введенных значений, обозначенных
два *жетона* в `deps` массив

* Функция возвращает строку имен, в которую вводит Angular
 `runnersUp` Параметр из `HeroOfTheMonthComponent`.

<div class="alert is-helpful">

Функция извлекает героев-кандидатов из `HeroService`,
принимает `2` из них должны быть на втором месте, и возвращает их объединенные имена.
Посмотрите на <live-example name="dependency-injection-in-action"></live-example>
для полного исходного кода.

</div>

{@a tokens}

{@a provider-token-alternatives-class-interface-and-injectiontoken}
## Альтернативы токенов провайдера: интерфейс класса и InjectionToken

Внедрение Angular зависимости проще всего, когда токен провайдера является классом
это также тип возвращаемого объекта зависимости или службы.

Однако токен не обязательно должен быть классом, даже если это класс
он не должен быть того же типа, что и возвращаемый объект.
Это тема следующего раздела.
{@a class-interface}

{@a class-interface}
### Интерфейс класса

В предыдущем « *Герой месяца»* примере использовался `MinimalLogger` Класс
как знак для провайдера `LoggerService`.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts">

</code-example>

 `MinimalLogger` - абстрактный класс.

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" header="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

Абстрактный класс - это обычно базовый класс, который вы можете расширить.
В этом приложении, однако, нет класса, который наследует от `MinimalLogger`.
 `LoggerService ` и ` DateLoggerService` мог унаследовать от `MinimalLogger`,
или они могли бы реализовать это вместо этого в виде интерфейса.
Но они не сделали ни того, ни другого.
 `MinimalLogger` используется только как токен внедрения зависимостей.

Когда вы используете класс таким образом, он называется *интерфейсом класса*.

Как уже упоминалось в [провайдеров DI](guide/dependency-injection-providers#interface-not-valid-token),
интерфейс не является допустимым токеном DI, потому что это артефакт TypeScript, который не существует во время выполнения.
Используйте этот интерфейс абстрактного класса, чтобы получить строгую типизацию интерфейса
а также использовать его в качестве токена провайдера, как в обычном классе.

Интерфейс класса должен определять *только* те элементы, которые его потребители могут вызывать.
Такой сужающий интерфейс помогает отделить конкретный класс от его потребителей.


<div class="alert is-helpful">

Использование класса в качестве интерфейса дает характеристики интерфейса в реальном объекте JavaScript.
Однако, чтобы минимизировать стоимость памяти, класс не должен иметь *реализации*.
 `MinimalLogger` переносится в этот неоптимизированный, предварительно минимизированный JavaScript для функции конструктора.

<code-example path="dependency-injection-in-action/src/app/minimal-logger.service.ts" region="minimal-logger-transpiled" header="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

Обратите внимание, что у него нет участников. Он никогда не растет независимо от того, сколько участников вы добавите в класс
до тех пор, пока эти члены набраны, но не реализованы.

Посмотрите еще раз на TypeScript `MinimalLogger` Класс чтобы подтвердить, что у него нет реализации.

</div>


{@a injection-token}


{@a injectiontoken-objects}
### 'InjectionToken' объекты

Объектами зависимости могут быть простые значения, такие как даты, числа и строки, или
бесформенные объекты, такие как массивы и функции.

Такие объекты не имеют интерфейсов приложений и, следовательно, плохо представлены классом.
Они лучше представлены токеном, который является одновременно уникальным и символическим
объект JavaScript, который имеет понятное имя, но не конфликтует с ним
другой токен с таким же именем.

 `InjectionToken` имеет эти характеристики.
Вы столкнулись с ними дважды в « *Герой месяца»* примере
в *заголовка* поставщике значения и в *поставщике runnersUp* фабрики.

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="provide-injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

Вы создали `TITLE` фишка, как это:

<code-example path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="injection-token" header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts"></code-example>

Параметр type, хотя и является необязательным, передает тип зависимости разработчикам и инструментам.
Описание токена - еще одна помощь для разработчиков.


{@a di-inheritance}

{@a inject-into-a-derived-class}
## Введите в производный класс

Будьте осторожны при написании компонента, который наследуется от другого компонента.
Если базовый компонент имеет инъекционные зависимости,
Вы должны повторно предоставить и повторно внедрить их в производный класс
а затем передать их в базовый класс через конструктор.

В этом надуманном примере `SortedHeroesComponent` наследуется от `HeroesBaseComponent` 
отобразить *отсортированный* список героев.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/sorted-heroes.png" alt="Sorted Heroes">
</div>

 `HeroesBaseComponent` может стоять самостоятельно.
Это требует своего собственного экземпляра `HeroService` для получения героев
и отображает их в порядке их поступления из базы данных.

<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="heroes-base" header="src/app/sorted-heroes.component.ts (HeroesBaseComponent)">

</code-example>


<div class="alert is-helpful">

{@a keep-constructors-simple}
### Сохраняйте конструкторы простыми

Конструкторы должны делать немного больше, чем инициализировать переменные.
Это правило делает компонент безопасным для создания тестируемого компонента, не опасаясь, что он сделает что-то драматическое, например, разговор с сервером.
Вот почему вы называете `HeroService` изнутри `ngOnInit` а не конструктор.

</div>


Пользователи хотят видеть героев в алфавитном порядке.
Вместо того, чтобы изменять исходный компонент, подкласс его и создать
 `SortedHeroesComponent` который сортирует героев перед их представлением.
 `SortedHeroesComponent` позволяет базовому классу героев.

К сожалению, Angular не может ввести `HeroService` прямо в базовый класс.
Вы должны предоставить `HeroService` снова для *этого* компонента
затем передайте его базовому классу внутри конструктора.


<code-example path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="sorted-heroes" header="src/app/sorted-heroes.component.ts (SortedHeroesComponent)">

</code-example>


Теперь обратите внимание на `afterGetHeroes()` метод.
Ваш первый инстинкт мог бы создать `ngOnInit` метод в `SortedHeroesComponent` и делать сортировку там.
Но Angular называет *производный* класс `ngOnInit` *перед* вызовом базового класса `ngOnInit` 
так что вы сортируете массив героев *до их прибытия*. Это приводит к неприятной ошибке.

Переопределение базового класса `afterGetHeroes()` решает проблему.

Эти осложнения приводят к *отказу от наследования компонентов*.


{@a forwardref}

{@a break-circularities-with-a-forward-class-reference-*forwardref*}
## Разбить цикличность с помощью прямой ссылки на класс ( *forwardRef*)

Порядок объявления класса имеет значение в TypeScript.
Вы не можете обращаться непосредственно к классу, пока он не будет определен.

Обычно это не проблема, особенно если вы придерживаетесь рекомендуемого *класса для каждого файла*.
Но иногда круговые ссылки неизбежны.
Вы находитесь в затруднительном положении, когда класс «A» относится к классу «B», а «B» относится к «A».
Один из них должен быть определен первым.

Angular `forwardRef()` создает *косвенную* ссылку, которую Angular может разрешить позже.

*Родитель Finder* образец полон ссылок кругового класса, которые невозможно сломать.

Вы сталкиваетесь с этой дилеммой, когда класс делает *ссылку на себя*
так же как и `AlexComponent` в своем `providers` массив.
 `providers` Массив является свойством `@Component()` функция декоратора, которая должна
появляются *над* определением класса.

Разорвать круговую окружность с `forwardRef`.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)"></code-example>


<!--- Waiting for good examples

{@a directive-level-providers}

{@a element-level-providers}

## Element-level providers

A component is a specialization of directive, and the `@Component()` decorator inherits the `providers` property from `@Directive` . The injector is at the element level, so a provider configured with any element-level injector is available to any component, directive, or pipe attached to the same element.

Here's a live example that implements a custom form control, taking advantage of an injector that is shared by a component and a directive on the same element.

https://stackblitz.com/edit/basic-form-control

The component, `custom-control`, configures a provider for the DI token `NG_VALUE_ACCESSOR`.
In the template, the `FormControlName` directive is instantiated along with the custom component.
It can inject the `NG_VALUE_ACCESSOR` dependency because they share the same injector.
(Notice that this example also makes use of `forwardRef()` to resolve a circularity in the definitions.)

### Sharing a service among components

__NEED TO TURN THIS INTO FULL EXTERNAL EXAMPLE__

Suppose you want to share the same `HeroCacheService` among multiple components. One way to do this is to create a directive.

```
<ng-container heroCache>
  <hero-overview></hero-overview>
  <hero-details></hero-details>
</ng-container>
```

Use the `@Directive()` decorator to configure the provider for the service:

```
@Directive(providers:[HeroCacheService])

class heroCache{...}
```

Because the injectors for both the overview and details components are children of the injector created from the `heroCache` directive, they can inject things it provides.
If the `heroCache` directive provides the `HeroCacheService`, the two components end up sharing them.

If you want to show only one of them, use the directive to make sure __??of what??__.

 `<hero-overview heroCache></hero-overview>` 

 --->
