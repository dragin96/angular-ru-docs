{@a attribute-directives}
# Атрибут директивы

**Атрибут** директива изменяет внешний вид или поведение DOM элемента.

Попробуйте <live-example title="Attribute Directive example"></live-example>.

{@a directive-overview}

{@a directives-overview}
## Обзор директив

Есть три вида директив в Angular:

1. Компоненты - директивы с шаблоном.
1. Структурные директивы - измените макет DOM, добавляя и удаляя элементы DOM.
1. Директивы атрибутов - изменяют внешний вид или поведение элемента, компонента или другой директивы.

*Составные части* являются наиболее распространенными из трех директив.
Вы впервые увидели компонент в руководстве [Приступая к работе](start "Getting Started with Angular").

*Структурные директивы* меняют структуру представления.
Два примера [NgFor](guide/template-syntax#ngFor)и [NgIf](guide/template-syntax#ngIf).
Узнайте о них в руководстве [Структурные директивы](guide/structural-directives).

*Директивы атрибутов* используются в качестве атрибутов элементов.
Встроенная [NgStyle](guide/template-syntax#ngStyle)директива в
[Синтаксис шаблона](guide/template-syntax), например
Можно изменить несколько стилей элемента одновременно.

{@a build-a-simple-attribute-directive}
## Создайте простую директиву атрибута

Директива атрибута минимально требует создания класса контроллера с аннотацией
 `@Directive`, который определяет селектор, который идентифицирует
атрибут.
Класс контроллера реализует желаемое поведение директивы.

Эта страница демонстрирует создание простого атрибута _appHighlight_
директива для установки цвета фона элемента
когда пользователь наводит курсор на этот элемент. Вы можете применить это следующим образом :

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (applied)" region="applied"></code-example>

{@a write-directive}

Обратите внимание, что директивы _не поддерживают_ пространства имен.

<code-example path="attribute-directives/src/app/app.component.avoid.html" header="src/app/app.component.avoid.html (unsupported)" region="unsupported"></code-example>

{@a write-the-directive-code}
### Напишите код директивы

Создайте файл класса директивы в окне терминала с помощью команды CLI [ `ng generate directive` ](cli/generate).

<code-example language="sh" class="code-shell">
ng generate directive highlight
</code-example>

CLI создает `src/app/highlight.directive.ts`, соответствующий тестовый файл `src/app/highlight.directive.spec.ts` и _declares_ класс директивы в корне `AppModule`.

<div class="alert is-helpful">

_Directives_ должен быть объявлен в [Angular модули](guide/ngmodules)же, как _components_.

</div >

Сгенерированный `src/app/highlight.directive.ts` выглядит следующим образом :

<code-example path="attribute-directives/src/app/highlight.directive.0.ts" header="src/app/highlight.directive.ts"></code-example>

Импортированный `Directive` символ обеспечивает Angular `@Directive` декоратор.

 `@Directive` одиночной конфигурации декоратора определяет директиву
[Селектор атрибутов CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors), `[appHighlight]`.

Это скобки (`[]`) которые делают его селектором атрибутов.
Angular находит каждый элемент в шаблоне, который имеет атрибут с именем `appHighlight` и применяет логику этой директивы к этому элементу.

Шаблон _attribute selector_ объясняет название этого вида директивы.

<div class="alert is-helpful">

{@a why-not-highlight}
#### Почему бы не «выделить»?

Хотя *highlight* будет более лаконичным селектором, чем *appHighlight,* и он будет работать
Лучшая практика заключается в том, чтобы префикс имен селектора, чтобы обеспечить
они не конфликтуют со стандартными атрибутами HTML.
Это также снижает риск столкновения со сторонними именами директив.
CLI добавил `app` префикс для вас.

Убедитесь, что вы ставите **не** префикс `highlight` название директивы с помощью** `ng`** потому что
этот префикс зарезервирован для Angular, и его использование может привести к ошибкам, которые трудно диагностировать.

</div>

После `@Directive` Метаданные поставляются с классом контроллера директивы
называется `HighlightDirective`, который содержит (в настоящее время пустую) логику для директивы.
Экспорт `HighlightDirective` делает директиву доступной.

Теперь отредактируйте сгенерированный `src/app/highlight.directive.ts` выглядеть следующим образом :

<code-example path="attribute-directives/src/app/highlight.directive.1.ts" header="src/app/highlight.directive.ts"></code-example>

 `import` операторе указывается дополнительный `ElementRef` символ с Angular `core` библиотеки:

Вы используете `ElementRef` в конструкторе директивы
к [инъекционный](guide/dependency-injection)ссылка на DOM элемент хоста,
элемент, к которому вы применили `appHighlight`.

 `ElementRef` предоставляет прямой доступ к элементу DOM хоста
через его `nativeElement`.

Эта первая реализация устанавливает цвет фона элемента хоста на желтый.

{@a apply-directive}

{@a apply-the-attribute-directive}
## Примените директиву атрибута

Чтобы использовать новый `HighlightDirective`, добавить абзац (`<p>`) элемент шаблона корня `AppComponent` и применять директиву в качестве атрибута.

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html" region="applied"></code-example>

Теперь запустите приложение, чтобы увидеть `HighlightDirective` в действии.


<code-example language="sh" class="code-shell">
ng serve
</code-example>

Подводя итог, Angular нашел `appHighlight` на **хосте** `<p>` элемент.
Он создал экземпляр `HighlightDirective` класс и
вставил ссылку на `<p>` элемент в конструктор директивы
который устанавливает `<p>` Стиль фона элемента к желтому.

{@a respond-to-user}

{@a respond-to-user-initiated-events}
## Реагировать на инициируемые пользователем события

В настоящее время, `appHighlight` просто устанавливает цвет элемента.
Директива может быть более динамичной.
Он может обнаружить, когда пользователь подключается к элементу или выходит из него
и ответьте, установив или очистив цвет выделения.

Начните с добавления `HostListener` к списку импортируемых символов.

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (imports)" region="imports"></code-example>

Затем добавьте два обработчика событий, которые реагируют, когда мышь входит или выходит
каждый украшен `HostListener` декоратор.

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (mouse-methods)" region="mouse-methods"></code-example>

 `@HostListener` Декоратор позволяет подписаться на события DOM
элемент, который содержит директиву атрибута, `<p>` в этом случае.

<div class="alert is-helpful">

Конечно, вы можете получить доступ к DOM со стандартным JavaScript и подключить прослушиватели событий вручную.
Есть по крайней мере три проблемы _that_ подхода:

1. Вы должны правильно написать слушателям.
1. Код должен *отсоединять* слушателя, когда директива уничтожена, чтобы избежать утечек памяти.
1. Общение с DOM API напрямую не является лучшей практикой.

</div>

Обработчики делегируют вспомогательный метод, который устанавливает цвет элемента DOM хоста, `el`.

Вспомогательный метод, `highlight`, был извлечен из конструктора.
Пересмотренный конструктор просто объявляет внедренный `el: ElementRef`.

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (constructor)" region="ctor"></code-example>

Вот обновленная директива полностью:

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts"></code-example>

Запустите приложение и убедитесь, что цвет фона появляется, когда
указатель находится над элементом абзаца и исчезает при его перемещении.

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-anim.gif" alt="Second Highlight">
</div>

{@a bindings}

{@a передать-значения-в-директиву-с-an- @ input-data-binding}
## Передайте значения в директиву с привязкой данных _@ Input_

В настоящее время основной цвет жестко запрограммирован в директиве. Это негибко.
В этом разделе вы даете разработчику возможность установить цвет выделения при применении директивы.

Начните с добавления `Input` в список символов, импортированных из `@angular/core`.
<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (imports)" region="imports"></code-example>

Добавить `highlightColor` свойство директивы класса, как это:

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (highlightColor)" region="color"></code-example>

{@a input}

{@a привязка-к-ан- @ input-property}
### Связывание со свойством _@ Input_

Обратите внимание на `@Input` декоратор. Он добавляет метаданные в класс, который делает директиву `highlightColor` свойство доступно для привязки.

Это называется *входным* свойством, потому что данные вытекают из выражения привязки _into_ директива.
Без этих входных метаданных Angular отклоняет привязку; см. [ниже](guide/attribute-directives#why-input "Why add @Input?") для получения дополнительной информации об этом.

Попробуйте, добавив следующие изменения директивы, обязательные для `AppComponent` шаблон:

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (excerpt)" region="color-1"></code-example>

Добавить `color` свойство к `AppComponent`.

<code-example path="attribute-directives/src/app/app.component.1.ts" header="src/app/app.component.ts (class)" region="class"></code-example>

Позвольте этому управлять цветом выделения с привязкой свойства.

<code-example path="attribute-directives/src/app/app.component.1.html" header="src/app/app.component.html (excerpt)" region="color-2"></code-example>

Это хорошо, но было бы неплохо одновременно применить директиву и установить цвет в том же атрибуте, как этот.

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

 `[appHighlight]` атрибута применяет директиву подсветки к `<p>` элемент
и устанавливает цвет выделения директивы с привязкой свойства.
Вы повторно используете селектор атрибута директивы (`[appHighlight]`), чтобы сделать обе работы.
Это четкий, компактный синтаксис.

Вам придется переименовать директиву `highlightColor` свойство для `appHighlight` потому что теперь это имя привязки свойства цвета.

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (renamed to match directive selector)" region="color-2"></code-example>

Это неприятно. Слово, `appHighlight`, это ужасное имя свойства, и оно не передает намерения свойства.

{@a input-alias}

{@a bind-to-an- @ input-alias}
### Привязать к псевдониму _@ Input_

К счастью, вы можете назвать свойство директивы как угодно _and_ **_alias it_** для целей привязки.

Восстановите исходное имя свойства и укажите селектор в качестве псевдонима в аргументе для `@Input`.

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (color property with alias)" region="color"></code-example>

Внутри директивы свойство известно как `highlightColor`.
_Outside_ директива, где вы связываете ее, она известна как `appHighlight`.

Вы получаете лучшее из обоих миров: имя свойства вы хотите и переплета синтаксис вы хотите:

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

Теперь, когда вы связываетесь через псевдоним с `highlightColor`, измените `onMouseEnter()` для использования этого свойства.
Если кто-то не хочет связываться с `appHighlight` выделите хост - элемент в красном цвете:

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (mouse enter)" region="mouse-enter"></code-example>

Вот последняя версия директивы класса.

<code-example path="attribute-directives/src/app/highlight.directive.3.ts" header="src/app/highlight.directive.ts (excerpt)"></code-example>

{@a write-a-harness-to-try-it}
## Напишите жгут, чтобы попробовать это

Может быть трудно представить, как эта директива на самом деле работает.
В этом разделе вы включите `AppComponent` в жгут, что
позволяет выбрать цвет подсветки с помощью переключателя и связать свой выбор цвета с директивой.

Обновление <code>app.component.html </code>следующим образом :

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (v2)" region="v2"></code-example>

Пересмотреть `AppComponent.color` чтобы он не имел начального значения.

<code-example path="attribute-directives/src/app/app.component.ts" header="src/app/app.component.ts (class)" region="class"></code-example>

Вот жгут и директива в действии.

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-v2-anim.gif" alt="Highlight v.2">
</div>

{@a second-property}

{@a bind-to-a-second-property}
## Привязать ко второму свойству

Эта директива выделения имеет одно настраиваемое свойство. В реальном приложении может потребоваться больше.

На данный момент цвет по умолчанию - цвет, который преобладает до
пользователь выбирает выделенный цвет - он жестко закодирован как «красный».
Позвольте разработчику шаблона установить цвет по умолчанию.

Добавьте второе **ввода** свойство в `HighlightDirective` называется `defaultColor` :

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (defaultColor)" region="defaultColor"></code-example>

Пересмотреть директиву `onMouseEnter` чтобы сначала попытаться выделить `highlightColor`,
затем с `defaultColor` и возвращается к «красному», если оба свойства не определены.

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (mouse-enter)" region="mouse-enter"></code-example>

Как вы связываете со вторым свойством, когда вы уже связываете с `appHighlight` атрибута ?

Как и в случае с компонентами, вы можете добавить столько привязок свойств директив, сколько вам нужно, выстроив их в шаблоне.
Разработчик должен иметь возможность написать следующий шаблон HTML для привязки к `AppComponent.color` 
и вернуться к «фиолетовому» в качестве цвета по умолчанию.

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (defaultColor)" region="defaultColor"></code-example>

Angular знает, что `defaultColor` привязка принадлежит `HighlightDirective` 
потому что вы сделали это _public_ с `@Input` декоратор.

Вот как должна работать подвеска, когда вы закончили писать код.

<div class="lightbox">
  <img src="generated/images/guide/attribute-directives/highlight-directive-final-anim.gif" alt="Final Highlight">
</div>

{@a summary}
## Резюме

Эта страница покрыта как:

* [Создайте директиву** атрибута**](guide/attribute-directives#write-directive)которая изменяет поведение элемента.
* [Примените директиву](guide/attribute-directives#apply-directive)к элементу в шаблоне.
* [Отвечать на** события**](guide/attribute-directives#respond-to-user)которые изменяют поведение директивы.
* [** Привязать** значения к директиве](guide/attribute-directives#bindings).

Окончательный исходный код следующим образом :

<code-tabs>
  <code-pane header="app/app.component.ts" path="attribute-directives/src/app/app.component.ts"></code-pane>
  <code-pane header="app/app.component.html" path="attribute-directives/src/app/app.component.html"></code-pane>
  <code-pane header="app/highlight.directive.ts" path="attribute-directives/src/app/highlight.directive.ts"></code-pane>
  <code-pane header="app/app.module.ts" path="attribute-directives/src/app/app.module.ts"></code-pane>
  <code-pane header="main.ts" path="attribute-directives/src/main.ts"></code-pane>
  <code-pane header="index.html" path="attribute-directives/src/index.html"></code-pane>
</code-tabs>



Вы также можете испытать и скачать <live-example title="Attribute Directive example"></live-example>.

{@a why-input}

{@a appendix-why-add- @ input}
### Приложение: зачем добавлять _@ Input_?

В этой демонстрации `highlightColor` Свойство является ***ввода*** свойством
 `HighlightDirective` . Вы уже видели это применяется без псевдонима:

<code-example path="attribute-directives/src/app/highlight.directive.2.ts" header="src/app/highlight.directive.ts (color)" region="color"></code-example>

Вы видели его с псевдонимом:

<code-example path="attribute-directives/src/app/highlight.directive.ts" header="src/app/highlight.directive.ts (color)" region="color"></code-example>

В любом случае, `@Input` Декоратор сообщает Angular, что это свойство есть
_public_ и доступен для привязки родительским компонентом.
Без `@Input`, Angular отказывается привязываться к собственности.

Вы связали шаблон HTML со свойствами компонента ранее и никогда не использовали `@Input`.
Чем отличается?

Разница заключается в доверии.
Angular рассматривает шаблон компонента как _belonging_ для компонента.
Компонент и его шаблон доверяют друг другу неявно.
Следовательно, собственный шаблон компонента может связываться со свойством _any_ этого компонента
с или без `@Input` декоратор.

Но компонент или директива не должны слепо доверять другим компонентам и директивам.
Свойства компонента или директивы по умолчанию скрыты от привязки.
Они _private_ с точки зрения Angular привязки.
Когда украшен `@Input` decorator, свойство становится _public_ с точки зрения Angular привязки.
Только тогда он может быть связан каким-либо другим компонентом или директивой.

Вы можете сказать, если `@Input` необходим положением имени свойства в привязке.

* Когда оно появляется в шаблонном выражении***справа*** от равенства (=)
  он принадлежит компоненту шаблона и не требует `@Input` декоратор.

* Когда он появляется в**квадратных скобках** ([])**слева** от равенства (=)
  свойство принадлежит некоторому другому компоненту или директиве;
  это свойство должно быть украшено `@Input` декоратор.

Теперь применить это рассуждение к следующему примеру:

<code-example path="attribute-directives/src/app/app.component.html" header="src/app/app.component.html (color)" region="color"></code-example>

* `color` Свойство в выражении справа принадлежит компоненту шаблона.
  Шаблон и его компонент доверяют друг другу.
 `color` свойство не требует `@Input` декоратор.

* `appHighlight` слева относится к свойству _aliased_ `HighlightDirective`,
  не является свойством компонента шаблона. Есть проблемы с доверием.
  Следовательно, свойство директивы должно нести `@Input` декоратор.
