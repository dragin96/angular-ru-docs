{@a dependency-injection-in-angular}
# Внедрение зависимостей в Angular

Внедрение зависимостей (DI) - важный шаблон проектирования приложения.
Angular имеет собственную структуру DI, которая обычно
используется в разработке Angular приложений для повышения их эффективности и модульности.

Зависимости - это сервисы или объекты, которые нужны классу для выполнения своих функций.
DI - это шаблон кодирования, в котором класс запрашивает зависимости от внешних источников, а не создает их сам.

В Angular инфраструктура DI предоставляет объявленные зависимости классу при создании экземпляра этого класса. В этом руководстве объясняется, как DI работает в Angular, и как использовать его, чтобы сделать ваши приложения гибкими, эффективными и надежными, а также тестируемыми и обслуживаемыми.

<div class="alert is-helpful">

Вы можете запустить <live-example></live-example>пример приложения, которое сопровождает это руководство.

</div>

Начните с просмотра этой упрощенной версии функции _heroes_
из [Тур героев](tutorial/). Эта простая версия не использует DI; мы пройдем через преобразование, чтобы сделать это.

<code-tabs>
  <code-pane header="src/app/heroes/heroes.component.ts" path="dependency-injection/src/app/heroes/heroes.component.1.ts" region="v1">
  </code-pane>

  <code-pane header="src/app/heroes/hero-list.component.ts" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.ts" path="dependency-injection/src/app/heroes/hero.ts">
  </code-pane>

  <code-pane header="src/app/heroes/mock-heroes.ts" path="dependency-injection/src/app/heroes/mock-heroes.ts">
  </code-pane>

</code-tabs>

 `HeroesComponent` - это компонент героев высшего уровня.
Его единственная цель - показать `HeroListComponent`, который отображает список имен героев.

Эта версия `HeroListComponent` получает героев из `HEROES` массив, коллекция в памяти
определяется в отдельном `mock-heroes` файл.

<code-example header="src/app/heroes/hero-list.component.ts (class)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts" region="class">
</code-example>

Этот подход работает для создания прототипов, но не является надежным или обслуживаемым.
Как только вы пытаетесь проверить этот компонент или получить герой от удаленного сервера,
Вы должны изменить реализацию `HeroesListComponent` и
заменить каждое использование `HEROES` издеваются над данными.


{@a create-and-register-an-injectable-service}
## Создать и зарегистрировать инъекционный сервис

Инфраструктура DI позволяет предоставлять данные компоненту из класса _service_ для инъекций, определенного в его собственном файле. Чтобы продемонстрировать, мы создадим класс службы для инъекций, который предоставляет список героев, и зарегистрируем этот класс в качестве поставщика этой службы.

<div class="alert is-helpful">

Наличие нескольких классов в одном файле может сбить с толку. Обычно мы рекомендуем определять компоненты и службы в отдельных файлах.

Если вы комбинируют компонент и службы в том же файле,
важно сначала определить службу, а затем компонент. Если вы определяете компонент перед службой, вы получаете ошибку нулевой ссылки во время выполнения.

Сначала можно определить компонент с помощью `forwardRef()` как описано в этом [сообщение в блоге](http://blog.thoughtram.io/angular/2015/09/03/forward-references-in-angular-2.html).

Вы также можете использовать прямые ссылки для разрыва циклических зависимостей.
Смотрите пример в [DI Cookbook](guide/dependency-injection-in-action#forwardref).

</div>

{@a create-an-injectable-service-class}
### Создайте инъекционный класс обслуживания

[Angular CLI](cli)может сгенерировать новый `HeroService` класс в `src/app/heroes` Папка с этой командой.

<code-example language="sh" class="code-shell">
ng generate service heroes/hero
</code-example>

Команда создает следующее `HeroService` скелет.

<code-example path="dependency-injection/src/app/heroes/hero.service.0.ts" header="src/app/heroes/hero.service.ts (CLI-generated)">
</code-example>

 `@Injectable()` является неотъемлемой каждого определения сервиса Angular. Остальная часть класса была написана, чтобы выставить `getHeroes` Метод который возвращает те же данные, что и раньше. (Реальное приложение, вероятно, получило бы свои данные асинхронно с удаленного сервера, но мы проигнорируем это, чтобы сосредоточиться на механике внедрения службы.)

<code-example path="dependency-injection/src/app/heroes/hero.service.3.ts" header="src/app/heroes/hero.service.ts">
</code-example>


{@a injector-config}
{@a bootstrap}

{@a configure-an-injector-with-a-service-provider}
### Настройте инжектор с поставщиком услуг

Созданный нами класс предоставляет сервис. `@Injectable()` помечает его как сервис
это может быть внедрено, но Angular фактически не может внедрить его где-либо, пока вы не настроите
Angular [инжектор зависимости](guide/glossary#injector)с [поставщиком](guide/glossary#provider)этой услуги.

Инжектор отвечает за создание сервисных экземпляров и внедрение их в такие классы, как `HeroListComponent`.
Вы редко создаете Angular инжектор самостоятельно. Angular создает инжекторы для вас при запуске приложения, начиная с _root injector_, который он создает во время [процесса начальной загрузки](guide/bootstrapping).

Поставщик сообщает инжектору _как создать сервис_.
Вы должны настроить инжектор с поставщиком, прежде чем этот инжектор сможет создать сервис (или предоставить любой другой вид зависимости).

Поставщик может быть сам класс обслуживания, так что инжектор может использовать `new` чтобы создать экземпляр.
Вы также можете определить несколько классов для предоставления одного и того же сервиса различными способами
и настроить разные инжекторы с разными провайдерами.

<div class="alert is-helpful">

Инжекторы наследуются, что означает, что если данная инжектор не может разрешить зависимость,
он просит родительский инжектор разрешить его.
Компонент может получать сервис от своего собственного инжектора
от инжекторов составляющих его предков
от инжектора его родительского NgModule, или от `root` инжектор.

* Узнайте больше о [различные виды поставщиков](guide/dependency-injection-providers).

* Узнайте больше о том, как [иерархия инжекторов](guide/hierarchical-dependency-injection)работает.

</div>

Вы можете настроить инжекторы с поставщиками на различных уровнях вашего приложения, установив значение метаданных в одном из трех мест:

* в `@Injectable()` для самой службы.

* в `@NgModule()` для модуля NgModule.

* в `@Component()` декоратор для компонента.

 `@Injectable() ` имеет ` providedIn` опция метаданных, в которой вы можете указать поставщика оформленного класса обслуживания с помощью `root` инжектор или с инжектором для конкретного модуля NgModule.

 `@NgModule() ` и ` @Component() ` имеют ` providers` опция метаданных, где вы можете настроить провайдеров для инжекторов уровня NgModule или на уровне компонентов.

<div class="alert is-helpful">

Компоненты являются директивами, а `providers` опция унаследована от `@Directive()` . Вы также можете настроить провайдеров для директив и каналов на том же уровне, что и компонент.

Узнайте больше о [где настроить провайдеров](guide/hierarchical-dependency-injection).

</div>

{@a injector-config}
{@a bootstrap}

{@a injecting-services}
## Инъекционные услуги

Для того чтобы `HeroListComponent` чтобы получить героев из `HeroService`, нужно попросить `HeroService` нужно вводить, а не создавать свой `HeroService` с `new`.

Вы можете указать Angular вводить зависимость в конструкторе компонента, указав **параметр конструктора с типом зависимости**. Вот `HeroListComponent` конструктор, запрашивая `HeroService` для инъекций.

<code-example header="src/app/heroes/hero-list.component (constructor signature)" path="dependency-injection/src/app/heroes/hero-list.component.ts"
region="ctor-signature">
</code-example>

Конечно, `HeroListComponent` должен что-то делать с введенным `HeroService`.
Вот пересмотренный компонент, использующий внедренный сервис, рядом с предыдущей версией для сравнения.

<code-tabs>
  <code-pane header="hero-list.component (with DI)" path="dependency-injection/src/app/heroes/hero-list.component.2.ts">
  </code-pane>

  <code-pane header="hero-list.component (without DI)" path="dependency-injection/src/app/heroes/hero-list.component.1.ts">
  </code-pane>
</code-tabs>

 `HeroService` должен быть предоставлен в некоторых родительских инжекторах. Код в `HeroListComponent` не зависит от того, где `HeroService` приходит из.
Если вы решили предоставить `HeroService` в `AppModule`, `HeroListComponent` не будет меняться.

{@a singleton-services}
{@a component-child-injectors}

{@a injector-hierarchy-and-service-instances}
### Инжекторная иерархия и сервисные экземпляры

Услуги являются одиночными в пределах объема инжектора. То есть существует не более одного экземпляра службы в данном инжекторе.

Для приложения есть только один корневой инжектор. обеспечение `UserService` на `root` или `AppModule` Уровень означает, что он зарегистрирован в корневом инжекторе. Есть только один `UserService` во всем приложении и каждом классе, который внедряет `UserService` получает этот экземпляр службы _unless_ вы настраиваете другого поставщика с _child injector_.

Angular DI имеет [иерархическую систему инъекций](guide/hierarchical-dependency-injection), что означает, что вложенные инжекторы могут создавать свои собственные экземпляры сервисов.
Angular регулярно создает вложенные инжекторы. Всякий раз, когда Angular создает новый экземпляр компонента, который имеет `providers` указанные в `@Component()`, он также создает новый _child инжектор_ для этого экземпляра.
Точно так же, когда новый NgModule загружается в режиме ожидания, Angular может создать для него инжектор со своими собственными провайдерами.

Дочерние модули и инжекторы компонентов независимы друг от друга и создают свои собственные отдельные экземпляры предоставляемых сервисов. Когда Angular уничтожает NgModule или экземпляр компонента, он также уничтожает этот инжектор и экземпляры сервиса этого инжектора.

Благодаря [наследованию инжектора зависимостей](guide/hierarchical-dependency-injection),
вы все еще можете внедрить сервисы для приложений в эти компоненты.
Инжектор компонента является потомком инжектора его родительского компонента и наследуется от всех инжекторов-предков вплоть до _root_-инжектора приложения. Angular может внедрить услугу, предоставляемую любым инжектором в этой линии.

Например, Angular может вводить `HeroListComponent` с обоими `HeroService` предоставляется в `HeroComponent` и `UserService` предоставляется в `AppModule`.

{@a testing-the-component}

{@a testing-components-with-dependencies}
## Тестирование компонентов с зависимостями

Разработка класса с внедрением зависимостей облегчает его тестирование.
Перечисление зависимостей в качестве параметров конструктора может быть всем, что вам нужно для эффективного тестирования частей приложения.

Например, вы можете создать новый `HeroListComponent` с фиктивным сервисом, которым вы можете манипулировать
под тестом.

<code-example path="dependency-injection/src/app/test.component.ts" region="spec" header="src/app/test.component.ts"></code-example>

<div class="alert is-helpful">

Узнайте больше в руководстве [Тестирование](guide/testing).

</div>

{@a service-needs-service}

{@a services-that-need-other-services}
## Услуги, которые нуждаются в других услугах

Сервисы могут иметь свои собственные зависимости. `HeroService` очень прост и не имеет собственных зависимостей. Предположим, однако, что вы хотите, чтобы он сообщал о своей деятельности через службу регистрации. Вы можете применить тот же *конструктор инъекции* шаблон,
добавив конструктор, который принимает `Logger` Параметр.

Вот пересмотренный `HeroService` который вводит `Logger`, рядом с предыдущим сервисом для сравнения.

<code-tabs>

  <code-pane header="src/app/heroes/hero.service (v2)" path="dependency-injection/src/app/heroes/hero.service.2.ts">
  </code-pane>

  <code-pane header="src/app/heroes/hero.service (v1)" path="dependency-injection/src/app/heroes/hero.service.1.ts">
  </code-pane>

  <code-pane header="src/app/logger.service"
  path="dependency-injection/src/app/logger.service.ts">
  </code-pane>

</code-tabs>

Конструктор запрашивает внедренный экземпляр `Logger` и хранит его в частном поле под названием `logger` . `getHeroes()` регистрирует сообщение, когда его просят выбрать героев.

Обратите внимание, что `Logger` Служба также имеет `@Injectable()`, даже если он не нуждается в собственных зависимостях. На самом деле, `@Injectable()` декоратор **требуется для всех услуг**.

Когда Angular создает класс, конструктор которого имеет параметры, он ищет метаданные типа и внедрения для этих параметров, чтобы он мог внедрить правильный сервис.
Если Angular не может найти эту информацию о параметре, он выдает ошибку.
Angular может найти информацию только о параметрах _Если класс имеет декоратор некоторого вида_.
 `@Injectable()` является стандартным декоратором для классов обслуживания.

<div class="alert is-helpful">

Требование декоратора наложено TypeScript. TypeScript обычно отбрасывает информацию о типе параметра, когда он [переносит](guide/glossary#transpile)код в JavaScript. TypeScript сохраняет эту информацию, если у класса есть декоратор и `emitDecoratorMetadata` компилятора установлена `true` в TypeScript `tsconfig.json` конфигурации . CLI настраивает `tsconfig.json` с `emitDecoratorMetadata: true`.

Это означает, что вы несете ответственность за `@Injectable()` для ваших классов обслуживания.

</div>

{@a token}

{@a injection-token}

{@a dependency-injection-tokens}
### Токены инъекции зависимостей

Когда вы настраиваете инжектор с провайдером, вы связываете этого провайдера с [токеном DI](guide/glossary#di-token).
Инжектор поддерживает внутреннюю карту *токена-провайдера*, на которую он ссылается при запросе зависимости. Токен является ключом к карте.

В простых примерах значение зависимости является *экземпляром*, и
класса *тип* служит своим собственным ключом поиска.
Здесь вы получаете `HeroService` непосредственно от инжектора, поставляя `HeroService` как токен:

<code-example path="dependency-injection/src/app/injector.component.ts" region="get-hero-service" header="src/app/injector.component.ts"></code-example>

Поведение аналогично, когда вы пишете конструктор, который требует вставленной зависимости на основе классов.
Когда вы определяете параметр конструктора с `HeroService` класса
Angular знает, как внедрить сервис, связанный с этим `HeroService` класс лексем:

<code-example path="dependency-injection/src/app/heroes/hero-list.component.ts" region="ctor-signature" header="src/app/heroes/hero-list.component.ts">
</code-example>

Многие значения зависимостей предоставляются классами, но не все. Расширенный *предоставленный* объект позволяет связывать различные типы поставщиков с токеном DI.

* Узнайте больше о [различные виды поставщиков](guide/dependency-injection-providers).

{@a optional}

{@a optional-dependencies}
### Необязательные зависимости

 `HeroService` *требует* регистратор, но что, если он может обойтись без
один?

Когда компонент или служба объявляет зависимость, конструктор класса принимает эту зависимость в качестве параметра.
Вы можете сказать Angular, что зависимость необязательна, аннотируя
параметр конструктора с `@Optional()`.

<code-example path="dependency-injection/src/app/providers.component.ts" region="import-optional">
</code-example>

<code-example path="dependency-injection/src/app/providers.component.ts" region="provider-10-ctor"></code-example>

Когда используешь `@Optional()`, ваш код должен быть подготовлен для нулевого значения. Если ты
не регистрируйте регистратор нигде, инжектор устанавливает
ценность `logger` в ноль.

<div class="alert is-helpful">

 `@Inject() ` и ` @Optional()` - это _параметры параметров. Они изменяют способ, которым структура DI обеспечивает зависимость, путем аннотирования параметра зависимости в конструкторе класса, который требует зависимости.

Узнайте больше о декораторах параметров в [Инъекторы иерархической зависимости](guide/hierarchical-dependency-injection).

</div>

{@a summary}
## Резюме

Вы узнали основы внедрения Angular зависимости на этой странице.
Вы можете зарегистрировать различные виды поставщиков
и вы знаете, как запросить внедренный объект (например, услугу)
добавление параметра в конструктор.

Погружение глубже в возможности и расширенные функции системы Угловое DI в следующих страницах:

* Узнайте больше о вложенных инжекторах в
[Иерархическая Dependency Injection](guide/hierarchical-dependency-injection).

* Узнайте больше о [токены DI и провайдеры](guide/dependency-injection-providers).

* [Dependency Injection in Action](guide/dependency-injection-in-action)- это кулинарная книга для некоторых интересных вещей, которые вы можете делать с DI.
