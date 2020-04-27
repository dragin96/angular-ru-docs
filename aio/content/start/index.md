{@a getting-started-with-angular-your-first-app}
# Начало работы с Angular: Ваше первое приложение

Добро пожаловать в Angular!

Этот учебник знакомит вас с основами Angular, он проведет вас через простой сайт электронной коммерции с каталогом, корзиной покупок и формой оформления заказа.
Чтобы помочь вам начать работу сразу, в этом руководстве используется простое готовое приложение, которое вы можете изучить и поиграть в интерактивном режиме.

<div class="callout is-helpful">
<header>Новичок в веб-разработке?</header>


Есть много ресурсов, чтобы дополнить Angular Docs. Документы Mozilla по MDN включают в себя [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML "Learning HTML: Guides and tutorials") и [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript "JavaScript") введения.[Документы TypeScript](https://www.typescriptlang.org/docs/home.html "TypeScript documentation") включают 5-минутное руководство. Различные платформы онлайн-курсов, такие как [Udemy](http://www.udemy.com "Udemy online courses") и [Codecademy](https://www.codecademy.com/ "Codecademy online courses"), также охватывают основы веб-разработки.

</div>


{@a new-project}
{@a create-a-new-project}
## Создать новый проект

<h4>
<live-example name="getting-started-v0" noDownload>Нажмите здесь, чтобы создать готовый пример проекта в StackBlitz.</live-example>
</h4>

<div class="lightbox">
  <img src="generated/images/guide/start/new-app-all.gif" alt="Starter online store app">
</div>

* Панель предварительного просмотра справа показывает начальное состояние примера приложения Angular.
Он определяет фрейм с верхней панелью (содержащей название магазина и значок оформления заказа) и заголовок списка товаров (который будет заполняться и динамически обновляться данными из приложения).

* На панели проекта слева отображаются исходные файлы, из которых состоит приложение, включая все файлы инфраструктуры и конфигурации. Текущий выбранный файл отображается в панели редактора в середине.

Прежде чем перейти к исходной структуре, в следующем разделе показано, как заполнить HTML *шаблон* для списка продуктов, используя предоставленные образцы данных.
Это должно дать вам представление о том, как легко динамически изменять и обновлять страницу.

<div class="callout is-helpful">
<header>Советы StackBlitz</header>

* Войдите в StackBlitz, чтобы сохранить и продолжить работу.
Если у вас есть учетная запись GitHub, вы можете войти в StackBlitz
с этим аккаунтом. Для того, чтобы сохранить ваш прогресс, в первую очередь
разверните проект с помощью кнопки Fork вверху слева
тогда вы сможете сохранить свою работу в свой собственный StackBlitz
учетной записи, нажав кнопку Сохранить.
* Чтобы скопировать пример кода из этого учебника, щелкните значок
в правом верхнем углу окна примера кода, а затем вставьте
фрагмент кода из буфера обмена в StackBlitz.
* Если панель предварительного просмотра StackBlitz не показывает, что вы
ожидать, сохранить, а затем нажмите кнопку обновления.
* StackBlitz постоянно совершенствуется, так что может быть
небольшие различия в сгенерированном коде, но в приложении
поведение будет таким же.
* При создании примера приложений StackBlitz это
сопровождая учебники, StackBlitz создает стартер
файлы и макет данных для вас. Файлы, которые вы будете использовать повсюду
учебники в `src` папка StackBlitz
пример приложения.

</div>

<div class="alert is-helpful">

Если вы перейдете непосредственно к [среда онлайн-разработки StackBlitz](https://stackblitz.com/)и решите [запустить новое рабочее пространство Angular](https://stackblitz.com/fork/angular), вы получите общее приложение-заглушку, а не это [иллюстративный пример](#new-project). Как только вы познакомитесь с основными понятиями здесь, это может быть полезно для интерактивной работы во время изучения Angular.

В реальной разработке вы обычно будете использовать [Angular CLI](guide/glossary#command-line-interface-cli)мощный инструмент командной строки, который позволяет создавать и изменять приложения. Для получения дополнительной информации см. [Обзор CLI](cli).

</div>


{@a template-syntax}
## Синтаксис шаблона

Шаблонный синтаксис Angular расширяет HTML и JavaScript.
В этом разделе представлен синтаксис шаблона путем расширения области «Продукты».

<div class="alert is-helpful">

Чтобы помочь вам начать работу, следующие шаги используют предварительно определенные данные о продукте из `products.ts` файл (уже созданный в примере StackBlitz) и методы из `product-list.component.ts` файл.

</div>

1. в `product-list` папка со, откройте файл шаблона `product-list.component.html`.

1. Измените шаблон списка продуктов, чтобы отобразить список названий продуктов.

    1. Каждый продукт в списке отображается одинаково, один за другим на странице. Чтобы перебрать предварительно определенный список продуктов, поместите `*ngFor` директива на `<div>`, следующим образом :

      <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.2.html" region="ngfor">
      </code-example>

      С `*ngFor`, `<div>` повторяется для каждого продукта в списке.

      <div class="alert is-helpful">

       `*ngFor` - это «структурная директива». Структурные директивы формируют или изменяют структуру DOM, обычно добавляя, удаляя и манипулируя элементами, к которым они присоединены. Директивы со звездочкой, `*`, являются структурными директивами.

      </div>

    1. Чтобы отобразить названия продуктов, используйте синтаксис интерполяции `{{ }}` . Интерполяция отображает значение свойства в виде текста. Внутри `<div>`, добавьте `<h3>` чтобы отобразить интерполяцию свойство Имя продукта:

      <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html" region="interpolation">
      </code-example>

      Панель предварительного просмотра немедленно обновляется, чтобы отобразить название каждого продукта в списке.

      <div class="lightbox">
        <img src="generated/images/guide/start/template-syntax-product-names.png" alt="Product names added to list">
      </div>

1. Чтобы сделать каждое название продукта ссылкой на сведения о продукте, добавьте `<a>` элемент и установить его название, чтобы быть название продукта, используя свойство связывания `[ ]` Синтаксис, следующим образом :

    <code-example path="getting-started/src/app/product-list/product-list.component.2.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    На панели предварительного просмотра удерживайте указатель над продуктом
    имя, чтобы увидеть значение свойства связанного имени, которое является
    название продукта плюс слово «детали».
    интерполирование `{{ }}` позволяет вам визуализировать
    значение свойства в виде текста; привязка собственности `[ ]` позволяет вам
    используйте значение свойства в выражении шаблона.

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-anchor.png" alt="Product name anchor text is product name property">
    </div>


4. Добавьте описания продуктов. На `<p>` элемент, используйте `*ngIf` так что Angular создает только `<p>` Элемент если текущий продукт имеет описание.

    <code-example path="getting-started/src/app/product-list/product-list.component.3.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    Приложение теперь отображает название и описание каждого продукта в списке. Обратите внимание, что конечный продукт не имеет описания параграфа. Поскольку свойство описания продукта пустое, Angular не создает `<p>` элемент - включая слово «описание».

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-description.png" alt="Product descriptions added to list">
    </div>

5. Добавьте кнопку, чтобы пользователи могли поделиться продуктом с друзьями. Привязать кнопки `click` событие на `share()` метод (в `product-list.component.ts`). Привязка событий использует набор скобок, `( )`, вокруг события, как в следующем `<button>` элемент:

    <code-example path="getting-started/src/app/product-list/product-list.component.4.html" header="src/app/product-list/product-list.component.html">
    </code-example>

    Каждый продукт теперь имеет кнопку «Share»:

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-button.png" alt="Share button added for each product">
    </div>

    Проверьте кнопку «Share»:

    <div class="lightbox">
      <img src="generated/images/guide/start/template-syntax-product-share-alert.png" alt="Alert box indicating product has been shared">
    </div>

Приложение теперь имеет список продуктов и функцию обмена.
В этом процессе, вы научились использовать пять общих черт синтаксиса шаблона ANGULAR в:
* `*ngFor`
* `*ngIf`
* интерполирование `{{ }}`
* Привязка собственности `[ ]`
* Привязка к событию `( )`


<div class="alert is-helpful">

Для получения дополнительной информации о полных возможностях Angular's
Синтаксис шаблона см. [Синтаксис шаблона](guide/template-syntax "Template Syntax").

</div>


{@a components}
{@a components}
## Компоненты

*Компоненты* определяют области ответственности в пользовательском интерфейсе или пользовательском интерфейсе
что позволяет вам повторно использовать наборы функциональности пользовательского интерфейса.
Вы уже создали один с компонентом списка продуктов.

Компонент состоит из трех вещей:
* **Класс компонента** это обрабатывает данные и функциональность. В предыдущем разделе данные о продукте и `share()` Метод в классе компонента обрабатывает данные и функциональность соответственно.
* **HTML-шаблон**, определяющий пользовательский интерфейс. В предыдущем разделе HTML-шаблон списка продуктов отображал название, описание и кнопку «Поделиться» для каждого продукта.
* **Компонент-специфичные стили**, которые определяют внешний вид.
Хотя список продуктов не определяет стили, это где компонент CSS
проживает.

<!--
### Class definition

Let's take a quick look a the product list component's class definition:

1. In the `product-list` directory, open `product-list.component.ts`.

1. Notice the `@Component` decorator. This provides metadata about the component, including its templates, styles, and a selector.

    * The `selector` is used to identify the component. The selector is the name you give the Angular component when it is rendered as an HTML element on the page. By convention, Angular component selectors begin with the prefix such as `app-`, followed by the component name.

    * The template and style filename also are provided here. By convention each of the component's parts is in a separate file, all in the same directory and with the same prefix.

1. The component definition also includes an exported class, which handles functionality for the component. This is where the product list data and `Share()` method are defined.

### Composition
-->

Приложение Angular содержит дерево компонентов, в котором каждый компонент Angular имеет определенную цель и ответственность.

В настоящее время, например, приложение состоит из трех компонентов:

<div class="lightbox">
  <img src="generated/images/guide/start/app-components.png" alt="Online store with three components">
</div>

* `app-root` (оранжевая рамка) - оболочка приложения. Это первый загружаемый компонент, который является родителем всех других компонентов. Вы можете думать об этом как о базовой странице.
* `app-top-bar` (синий фон) - это название магазина и кнопка оформления заказа.
* `app-product-list` (фиолетовый ящик) - это список товаров, который вы изменили в предыдущем разделе.

Следующий раздел расширяет возможности приложения, добавляя новый компонент - оповещение о продукте - как дочерний компонент компонента списка продуктов.


<div class="alert is-helpful">

Для получения дополнительной информации о компонентах и ​​их взаимодействии с шаблонами см. [Введение в компоненты](guide/architecture-components "Architecture > Introduction to Components").

</div>


{@a input}
## Вход

В настоящее время в списке товаров отображается название и описание каждого товара.
Компонент списка продуктов также определяет `products` свойство, содержащее импортированные данные для каждого товара из `products` массив в `products.ts`.

Следующим шагом является создание новой функции оповещения, которая принимает продукт в качестве входных данных. Уведомление проверяет цену продукта и, если цена превышает 700 долларов США, отображает кнопку «Уведомить меня», которая позволяет пользователям подписываться на уведомления, когда продукт поступит в продажу.

1. Создайте новый компонент оповещений о продукте.

    1. Щелкните правой кнопкой мыши на `app` папку и использовать `Angular Generator` для генерации нового компонента с именем `product-alerts`.

        <div class="lightbox">
          <img src="generated/images/guide/start/generate-component.png" alt="StackBlitz command to generate component">
        </div>

        Генератор создает файлы стартера для всех трех частей компоненты:
        * `product-alerts.component.ts`
        * `product-alerts.component.html`
        * `product-alerts.component.css`

1. открыто `product-alerts.component.ts`.

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="as-generated"></code-example>

    1. Обратите внимание на `@Component()` декоратор. Это указывает на то, что следующий класс является компонентом. Он предоставляет метаданные о компоненте, включая его селектор, шаблоны и стили.

        * `selector` идентифицирует компонент. Селектор - это имя, которое вы даете компоненту Angular, когда он отображается в виде HTML-элемента на странице. По соглашению, Angular селекторы компонентов начинаются с префикса `app-`, сопровождаемый именем компонента.

        * Имена файлов шаблонов и стилей ссылаются на файлы HTML и CSS, которые генерирует StackBlitz.

    1. Определение компонента также экспортирует класс, `ProductAlertsComponent`, который обрабатывает функциональность для компонента.

1. Настройка оповещения о новом продукте компонента для получения продукта в качестве входных данных:

    1. Импортировать `Input` от `@angular/core`.

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="imports" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

    1. в `ProductAlertsComponent` класса, определение свойства с именем `product` с `@Input()` декоратор. `@Input()` указывает, что значение свойства передается из родительского компонента, компонента списка продуктов.

        <code-example path="getting-started/src/app/product-alerts/product-alerts.component.1.ts" region="input-decorator" header="src/app/product-alerts/product-alerts.component.ts"></code-example>

1. Определите представление для нового компонента оповещения о продукте.

    1. Открой `product-alerts.component.html` шаблон и замените абзац-заполнитель кнопкой «Уведомить меня», которая появляется, если цена продукта превышает 700 долларов США.

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.1.html"></code-example>

1. Отобразите новый компонент оповещения о продукте как дочерний элемент списка продуктов.

    1. открыто `product-list.component.html`.

    1. Чтобы включить новый компонент, используйте его селектор, `app-product-alerts`, как и элемент HTML.

    1. Передайте текущий продукт в качестве входных данных для компонента, используя привязку свойства.

        <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.5.html" region="app-product-alerts"></code-example>

Новый компонент оповещения о продукте принимает продукт в качестве входных данных из списка продуктов. При этом вводе отображается или скрывается кнопка «Уведомить меня» в зависимости от цены продукта. Цена телефона XL превышает 700 долларов, поэтому на этом продукте появляется кнопка «Уведомить меня».

<div class="lightbox">
  <img src="generated/images/guide/start/product-alert-button.png" alt="Product alert button added to products over $700">
</div>

<div class="alert is-helpful">

Смотрите [Взаимодействие компонентов](guide/component-interaction "Components & Templates > Component Interaction") для получения дополнительной информации о передаче данных от родительского к дочернему компоненту, перехвате и обработке значения родительского объекта, а также об обнаружении и воздействии на изменения значений входных свойств.

</div>


{@a output}
## Выход

Для того, чтобы сделать «Notify Me» кнопку работы, вам нужно настроить две вещи:

  - компонент оповещения о продукте, генерирующий событие, когда пользователь нажимает кнопку «Уведомить меня»
  - компонент списка продуктов, чтобы действовать на этом событии

1. открыто `product-alerts.component.ts`.

1. Импортировать `Output` и `EventEmitter` от `@angular/core` :

    <code-example header="src/app/product-alerts/product-alerts.component.ts" path="getting-started/src/app/product-alerts/product-alerts.component.ts" region="imports"></code-example>

1. В классе компонента определите свойство с именем `notify` с `@Output()` и экземпляр `EventEmitter()` . Это позволяет компоненту оповещения о продукте генерировать событие при изменении значения свойства notify.

<div class="alert is-helpful">

  Когда Angular CLI генерирует новый компонент, он включает в себя пустой конструктор, `OnInit` Интерфейс, а также `ngOnInit()`.
  Поскольку в следующем примере они не используются, для краткости они здесь опущены.

</div>

    <code-example path="getting-started/src/app/product-alerts/product-alerts.component.ts" header="src/app/product-alerts/product-alerts.component.ts" region="input-output"></code-example>

1. В шаблоне оповещения о продукте `product-alerts.component.html`, обновите кнопку «Уведомить меня» привязкой события, чтобы вызвать `notify.emit()`.

    <code-example header="src/app/product-alerts/product-alerts.component.html" path="getting-started/src/app/product-alerts/product-alerts.component.html"></code-example>

1. Затем определите поведение, которое должно происходить, когда пользователь нажимает кнопку. Напомним, что родительский компонент списка продуктов, а не компонент предупреждений о продукте, действует, когда дочерний элемент вызывает событие. В `product-list.component.ts`, определить `onNotify()`, аналогичный `share()` метод:

    <code-example header="src/app/product-list/product-list.component.ts" path="getting-started/src/app/product-list/product-list.component.ts" region="on-notify"></code-example>

1. Наконец, обновите компонент списка продуктов, чтобы получать выходные данные из компонента предупреждений продукта.

    В `product-list.component.html`, связать `app-product-alerts` Компонент (который отображает кнопку «Уведомить меня») для `onNotify()` компонента списка товаров.

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.6.html" region="on-notify"></code-example>

1. Попробуйте нажать на кнопку «Сообщить мне»:

    <div class="lightbox">
      <img src="generated/images/guide/start/product-alert-notification.png" alt="Product alert notification confirmation dialog">
    </div>


<div class="alert is-helpful">

См. [Взаимодействие компонентов](guide/component-interaction "Components & Templates > Component Interaction") для получения дополнительной информации о прослушивании событий от дочерних компонентов, чтении дочерних свойств или вызове дочерних методов, а также об использовании службы для двунаправленной связи между компонентами.

</div>


{@a next-steps}
## Следующие шаги

Поздравляем! Вы завершили свое первое приложение Angular!

У вас есть основной каталог интернет-магазина со списком товаров, кнопкой «Поделиться» и кнопкой «Сообщить мне».
Вы узнали об основах Angular: компоненты и синтаксис шаблона.
Вы также узнали, как класс компонента и шаблон взаимодействуют, и как компоненты взаимодействуют друг с другом.

Чтобы продолжить изучение Angular, выбрать один из следующих вариантов:
* [Перейдите к разделу «Маршрутизация»](start/start-routing "Getting Started: Routing") чтобы создать страницу сведений о продукте, доступ к которой можно получить, щелкнув название продукта и имеющую собственный шаблон URL.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment") перейти к локальной разработке или развернуть приложение на Firebase или на своем собственном сервере.
