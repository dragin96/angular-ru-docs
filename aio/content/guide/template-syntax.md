{@a template-syntax}
# Синтаксис шаблона

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }
  h4 .syntax { font-size: 100%; }
</style>

Приложение Angular управляет тем, что пользователь видит и может делать, достигая этого посредством взаимодействия экземпляра класса компонента ( *компонента*) и его пользовательского шаблона.

Вы можете быть знакомы с двойственностью компонента / шаблона из своего опыта работы с моделью-видом-контроллером (MVC) или моделью-видом-видом-моделью (MVVM).
В Angular компонент играет роль контроллера / модели представления, а шаблон представляет представление.

Эта страница является полным техническим справочником по языку шаблонов Angular.
Он объясняет основные принципы языка шаблонов и описывает большую часть синтаксиса, с которым вы столкнетесь в других местах документации.

Многие фрагменты кода иллюстрируют точки и концепции, все они доступны
в <live-example title="Template Syntax Live Code"></live-example>.


{@a html}
{@a html-in-templates}
## HTML в шаблонах

HTML является языком Angular шаблона.
Почти весь синтаксис HTML является допустимым синтаксисом шаблона.
 `<script>` элемент является заметным исключением;
Это запрещено, что исключает риск атак с использованием скриптов.
На практике,  `<script>`  игнорируется, и в консоли браузера появляется предупреждение.
Смотрите [Безопасность](guide/security)страницу для деталей.

Некоторый юридический HTML не имеет большого смысла в шаблоне.
 `<html> `, ` <body> ` и ` <base>` элементы не имеют никакой полезной роли.
Практически все остальное - честная игра.

Вы можете расширить словарный запас HTML ваших шаблонов с помощью компонентов и директив, которые появляются как новые элементы и атрибуты.
В следующих разделах вы узнаете, как динамически получать и устанавливать значения DOM (Document Object Model) с помощью привязки данных.

Начните с первой формы привязки данных - интерполяции - чтобы увидеть, насколько богатым может быть шаблон HTML.

<hr/>

{@a interpolation}

{@a interpolation-and-template-expressions}
## Интерполяция и шаблонные выражения

Интерполяция позволяет включать рассчитанные строки в текст
между тегами HTML-элементов и в назначениях атрибутов. Шаблон
Выражения - это то, что вы используете для вычисления этих строк.

Интерполяция <live-example></live-example>демонстрирует все
синтаксис и фрагменты кода описаны в этом разделе.

{@a interpolation-{{...}}}
### интерполирование  `{{...}}` 

Интерполяция относится к встраиванию выражений в размеченный текст.
По умолчанию интерполяция использует в качестве разделителя двойные фигурные скобки,  `{{`  и  `}}`.

В следующем фрагменте, `{{ currentCustomer }}` является примером интерполяции.

<code-example path="interpolation/src/app/app.component.html" region="interpolation-example1" header="src/app/app.component.html"></code-example>

Текст между фигурными скобками часто является именем компонента
свойство. Angular заменяет это имя на
строковое значение соответствующего свойства компонента.

<code-example path="interpolation/src/app/app.component.html" region="component-property" header="src/app/app.component.html"></code-example>

В приведенном выше примере Angular оценивает  `title`  и  `itemImageUrl`  свойства
и заполняет пробелы, сначала отображая текст заголовка, а затем изображение.

В более общем смысле текст между фигурными скобками является **выражением шаблона**
этот Angular сначала **вычисляет,** а затем**преобразует в строку**.
Следующая интерполяция иллюстрирует точку, добавив два числа:

<code-example path="interpolation/src/app/app.component.html" region="convert-string" header="src/app/app.component.html"></code-example>

Выражение может вызывать методы компонента узла, такие как  `getVal()`  в
следующий пример:

<code-example path="interpolation/src/app/app.component.html" region="invoke-method" header="src/app/app.component.html"></code-example>

Angular вычисляет все выражения в двойных фигурных скобках
преобразует результаты выражения в строки и связывает их с соседними литеральными строками. И, наконец,
он присваивает этот составной интерполированный результат **элементу или свойству директивы**.

Вы, кажется, вставляете результат между тегами элемента и присваиваете его атрибутам.
Однако интерполяция - это специальный синтаксис, который Angular преобразует в *привязку свойства*.

<div class="alert is-helpful">

Если вы хотите использовать что-то кроме  `{{`  и  `}}`, вы можете
настроить разделитель интерполяции через
[интерполяция](api/core/Component#interpolation)
вариант в  `Component`  метаданных.

</div>

{@a template-expressions}
### Шаблонные выражения

шаблона **Выражение** создает значение и появляется внутри двойника
фигурные скобки, `{{ }}`.
Angular выполняет выражение и присваивает его свойству цели привязки;
целью может быть элемент HTML, компонент или директива.

Интерполяционные скобки в `{{1 + 1}}` окружают шаблонное выражение `1 + 1`.
В собственности обязательна
шаблонное выражение появляется в кавычках справа от  `=`  символ как в  `[property]="expression"`.

С точки зрения синтаксиса, шаблонные выражения похожи на JavaScript.
Многие выражения JavaScript являются допустимыми шаблонными выражениями, за некоторыми исключениями.

Вы не можете использовать выражения JavaScript, которые имеют или способствуют побочным эффектам
в том числе:

* Назначения (`=`, `+= `, ` -= `, ` ...`)
* Операторы, такие как  `new`, `typeof`, `instanceof`  и т
* Цепные выражения с <code>;</code>или <code>,</code>
* Операторы увеличения и уменьшения  `++`  и  `--` 
* Некоторые из операторов ES2015 +

Другие заметные отличия от синтаксиса JavaScript включают в себя:

* Нет поддержки для побитовых операторов, таких как  `|`  и  `&` 
* Новый [операторы выражения шаблона](guide/template-syntax#expression-operators), такие как  `|`, `?.`  и  `!` 


{@a expression-context}
### Контекст выражения

*Контекст выражения ,* как правило, _component_ экземпляр.
В следующих фрагментах  `recommended`  в двойных фигурных скобках и
 `itemImageUrl2` в кавычках ссылается на свойства  `AppComponent`.

<code-example path="interpolation/src/app/app.component.html" region="component-context" header="src/app/app.component.html"></code-example>

Выражение также может ссылаться на свойства контекста _template's_
такие как входные переменный шаблон
<!-- link to built-in-directives#template-input-variables -->
 `let customer` или переменная ссылки на шаблон,  `#customerInput`.
<!-- link to guide/template-ref-variables -->

<code-example path="interpolation/src/app/app.component.html" region="template-input-variable" header="src/app/app.component.html (template input variable)"></code-example>

<code-example path="interpolation/src/app/app.component.html" region="template-reference-variable" header="src/app/app.component.html (template reference variable)"></code-example>

Контекст терминов в выражении представляет собой смесь из _template variables_,
_context_ объект директивы (если он есть) и _members_ компонента.
Если вы ссылаетесь на имя, которое принадлежит к более чем одной из этих пространств имен,
имя переменной шаблона имеет приоритет, а затем имя в _context_ директивы, в
и, наконец, имена членов компонента.

В предыдущем примере представлено такое столкновение имен. Компонент имеет  `customer` 
собственность и  `*ngFor`  определяет  `customer`  переменная шаблона.

<div class="alert is-helpful">

 `customer ` в ` {{customer.name}}` 
ссылается на входную переменную шаблона, а не на свойство компонента.

Шаблонные выражения не могут ссылаться на что-либо в
глобальное пространство имен, кроме  `undefined`  . Они не могут ссылаться на
 `window ` или ` document` . Кроме того, они
не могу позвонить  `console.log()`  или  `Math.max()`  и они ограничены ссылками
члены контекста выражения.

</div>

{@a expression-guidelines}
### Руководство по выражению

При использовании выражений шаблона следовать этим правилам:

* [Простота](guide/template-syntax#simplicity)
* [Быстрое исполнение](guide/template-syntax#quick-execution)
* [Нет видимых побочных эффектов](guide/template-syntax#no-visible-side-effects)

{@a simplicity}
#### Простота

Хотя можно писать сложные шаблонные выражения, это лучше
практиковаться, чтобы избежать их.

Имя свойства или вызов метода должны быть нормой, но случайное логическое отрицание,  `!`, все в порядке.
В противном случае ограничьте приложение и бизнес-логику компонентом
где легче разрабатывать и тестировать.

{@a quick-execution}
#### Быстрое исполнение

Angular выполняет выражения шаблона после каждого цикла обнаружения изменений.
Циклы обнаружения изменений запускаются многими асинхронными действиями, такими как
разрешения обещаний, результаты HTTP, события таймера, нажатия клавиш и движения мыши.

Выражения должны заканчиваться быстро, иначе пользовательский интерфейс может затянуться, особенно на медленных устройствах.
Рассмотрим кэширование значений, когда их вычисление стоит дорого.

{@a no-visible-side-effects}
#### Нет видимых побочных эффектов

Выражение шаблона не должно изменять любое состояние приложения, кроме значения
целевое свойство.

Это правило имеет важное значение для политики Angular «однонаправленный поток данных».
Вы никогда не должны беспокоиться, что чтение значения компонента может изменить другое отображаемое значение.
Представление должно быть стабильным в течение одного прохода рендеринга.

[Идемпотентная](https://en.wikipedia.org/wiki/Idempotence)выражение является идеальным, поскольку
он не имеет побочных эффектов и улучшает характеристики обнаружения изменений Angular.
В Angular терминах идемпотентное выражение всегда возвращает
*точно так же,* пока не изменится одно из его зависимых значений.

Зависимые значения не должны изменяться в течение одного оборота цикла событий.
Если идемпотентное выражение возвращает строку или число, оно возвращает ту же строку или число при вызове дважды в строке. Если выражение возвращает объект, включая  `array`, он возвращает одну и ту же объект *ссылку на* при вызове дважды в строке.

<div class="alert is-helpful">

Есть одно исключение из этого поведения, которое относится к  `*ngFor`  .  `*ngFor`  имеет  `trackBy`  которая может справиться с неравенством объектов при итерации по ним. Смотрите [* ngFor с  `trackBy` ](guide/template-syntax#ngfor-with-trackby)для деталей.

</div>

<!-- end of Interpolation doc -->

<hr/>

{@a template-statements}

{@a template-statements}
## Шаблон заявления

Шаблонный **оператор** отвечает на**событие**, вызванное целью привязки
такой как элемент, компонент или директива.
Вы увидите заявление шаблона в [обязательном событии](guide/template-syntax#event-binding)раздела
появляются в кавычках справа от  `=`   символ как в  `(event)="statement"`.

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

Шаблон заявления *имеет побочный эффект*.
Вот и весь смысл события.
Это то, как вы обновляете состояние приложения от действий пользователя.

Реакция на события - это другая сторона «однонаправленного потока данных» Angular.
Вы можете изменить что угодно и где угодно во время этого цикла цикла событий.

Как и выражения шаблонов, шаблонов *операторы* используют язык, похожий на JavaScript.
Анализатор оператора шаблона отличается от синтаксического анализатора выражения шаблона и
специально поддерживает оба основных назначения (`=`) и цепочки выражений с <code>;</code>.

Тем не менее, некоторые JavaScript и синтаксис выражений шаблона не допускаются:

* <code>new</code>
* операторы увеличения и уменьшения,  `++`  и  `--` 
* назначение оператора, например  `+=`  и  `-=` 
* побитовые операторы, такие как  `|`  и  `&` 
* [оператор трубы](guide/template-syntax#pipe)

{@a statement-context}
### Контекст заявления

Как и с выражениями, операторы могут ссылаться только на то, что находится в контексте оператора
такой как метод обработки события экземпляра компонента.

*Контекста заявления ,* как правило, экземпляр компонента.
*DeleteHero* в  `(click)="deleteHero()"`  - метод компонента с привязкой к данным.

<code-example path="template-syntax/src/app/app.component.html" region="context-component-statement" header="src/app/app.component.html"></code-example>

Контекст оператора также может ссылаться на свойства собственного контекста шаблона.
В следующих примерах шаблон  `$event`  объект
a [входная переменная шаблона](guide/template-syntax#template-input-variable)(`let hero`)
и [ссылочная переменная шаблона](guide/template-syntax#ref-vars)(`#heroForm`)
передаются в метод обработки событий компонента.

<code-example path="template-syntax/src/app/app.component.html" region="context-var-statement" header="src/app/app.component.html"></code-example>

Имена контекста шаблона имеют приоритет над именами контекста компонента.
В  `deleteHero(hero)`  выше,  `hero`  является входной переменной шаблона
не компонент  `hero`  собственность.

{@a statement-guidelines}
### Руководство по утверждению

Шаблонные операторы не могут ссылаться на что-либо в глобальном пространстве имен. Они
не может ссылаться на  `window`  или  `document`.
Они не могут позвонить  `console.log`  или  `Math.max`.

Как и с выражениями, избегайте написания сложных шаблонных операторов.
Вызов метода или простое присвоение свойства должны быть нормой.

<hr/>

{@a binding-syntax}

{@a binding-syntax-an-overview}
## Обязательный синтаксис: обзор

Привязка данных - это механизм для координации того, что видят пользователи, в частности
со значениями данных приложения.
В то время как вы можете выдвигать значения и извлекать значения из HTML
Приложение легче писать, читать и обслуживать, если вы передадите эти задачи в среду связывания.
Вы просто объявляете привязки между источниками привязки, целевыми элементами HTML и позволяете фреймворку делать все остальное.

Для демонстрации синтаксиса и фрагментов кода в этом разделе см. <live-example name="binding-syntax">Пример синтаксиса привязки </live-example>.

Angular предоставляет много видов привязки данных. Связывающие типы могут быть сгруппированы в три категории, различающихся по направлению потока данных:

* От _source-to-view_
* От _view-to-source_
* Двусторонняя последовательность: _view-to-source-to-view_

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">






  <tr>
    <th>
      Тип
    </th>
    <th>
      Синтаксис
    </th>
    <th>
      Категория
    </th>

  </tr>
  <tr>
     <td>
      Интерполяция <br>
      Недвижимость <br>
      Атрибут <br>
      Класс <br>
      Стиль
    </td>
    <td>

      <code-example>
        {{expression}}
        [target]="expression"
        bind-target="expression"
      </code-example>

    </td>

    <td>
      В одну сторону <br>от источника данных <br>для просмотра цели
    </td>
    <tr>
      <td>
        Событие
      </td>
      <td>
        <code-example>
          (target)="statement"
          on-target="statement"
        </code-example>
      </td>

      <td>
        В одну сторону <br>от цели просмотра <br>к источнику данных
      </td>
    </tr>
    <tr>
      <td>
        Двухсторонний
      </td>
      <td>
        <code-example>
          [(target)]="expression"
          bindon-target="expression"
        </code-example>
      </td>
      <td>
        Двухсторонний
      </td>
    </tr>
  </tr>
</table>

Типы привязки, отличные от интерполяции, имеют **целевое имя** слева от знака равенства, либо окруженные пунктуацией,  `[]`  или  `()`,
или с префиксом:  `bind-`, `on-`, `bindon-`.

*Мишень* из привязки является свойством или события внутри связывания пунктуации:  `[]`, `()`  или  `[()]`.

Каждый открытый член **источника** директивы автоматически доступен для привязки.
Вам не нужно делать ничего особенного, чтобы получить доступ к члену директивы в выражении шаблона или операторе.


{@a data-binding-and-html}
### Привязка данных и HTML

В ходе обычной разработки HTML вы создаете визуальную структуру с элементами HTML и
Вы изменяете эти элементы, устанавливая атрибуты элемента с помощью строковых констант.

```html
<div class="special">Plain old HTML</div>
<img src="images/item.png">
<button disabled>Save</button>
```

С помощью привязки данных-, вы можете контролировать то, как состояние кнопки:

<code-example path="binding-syntax/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

Обратите внимание, что привязка к  `disabled`  свойство DOM элемента данной кнопки,
**не** атрибут. Это относится к привязке данных в целом. Привязка данных работает со*свойствами * элементов, компонентов и директив DOM, а не с HTML*атрибутами *.


{@a html-attribute-vs.-dom-property}
### Атрибут HTML и свойство DOM

Различие между атрибутом HTML и свойством DOM является ключом к пониманию
как работает Angular привязка **Атрибуты определяются HTML. Доступ к свойствам осуществляется из узлов DOM (объектная модель документа).**

* Некоторые атрибуты HTML имеют отображение 1: 1 на свойства; например,  `id`.

* Некоторые атрибуты HTML не имеют соответствующих свойств; например,  `aria-*`.

* Некоторые свойства DOM не имеют соответствующих атрибутов; например,  `textContent`.

Важно помнить, что *атрибут HTML* и *свойство DOM* - это разные вещи, даже если они имеют одинаковые имена.
В Angular единственная роль атрибутов HTML заключается в инициализации элемента и состояния директивы.

**Привязка шаблона работает со*свойствами * и*событиями *, а не с*атрибутами *.**

Когда вы пишете привязку данных, вы имеете дело исключительно со *свойствами DOM* и *событиями* целевого объекта.

<div class="alert is-helpful">

Это общее правило может помочь вам построить ментальную модель атрибутов и свойств DOM:
**Атрибуты инициализируют свойства DOM, а затем они завершаются.
Значения свойств могут меняться; значения атрибута не могут.**

Из этого правила есть одно исключение.
Атрибуты могут быть изменены  `setAttribute()`, который повторно инициализирует соответствующие свойства DOM.

</div>

Для получения дополнительной информации см. [Документация по интерфейсам MDN](https://developer.mozilla.org/en-US/docs/Web/API#Interfaces)которой есть документы API для всех стандартных элементов DOM и их свойств.
Сравнение [` ` атрибутов](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td)атрибутов с [` ` свойствами](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement)предоставляет полезный пример для дифференциации.
В частности, вы можете переходить от страницы атрибутов к свойствам через ссылку «Интерфейс DOM» и перемещаться по иерархии наследования до  `HTMLTableCellElement`.


{@a example-1-an-<input>}
#### Пример 1:  `<input>` 

Когда браузер рендерит `<input type="text" value="Sarah">`, он создает
соответствующий узел DOM с  `value`  свойства инициализировано как "Сара".

```html
<input type="text" value="Sarah">
```

Когда пользователь вводит "Салли" в  `<input>`, элемент DOM  `value`   *свойства* становится «Салли».
Однако, если вы посмотрите на атрибут HTML  `value`  с использованием  `input.getAttribute('value')`, вы можете видеть, что *атрибут* остается неизменным - он возвращает "Sarah".

Атрибут HTML  `value`  указывает *начальное* значение; ДОМ  `value`  свойства - это *текущая* стоимость.

Чтобы увидеть атрибуты в сравнении со свойствами DOM в работающем приложении, смотрите <live-example name="binding-syntax"></live-example>раздел «Синтаксис привязки».

{@a example-2-a-disabled-button}
#### Пример 2: отключенная кнопка

 `disabled` атрибут - другой пример. Кнопки  `disabled` 
*недвижимость* является  `false`  по умолчанию, поэтому кнопка включена.

Когда вы добавляете  `disabled`   *атрибут*, только его наличие
инициализирует кнопку  `disabled`   *недвижимости* в  `true` 
поэтому кнопка отключена.

```html
<button disabled>Test Button</button>
```

Добавление и удаление  `disabled`   *Атрибут* отключает и включает кнопку.
Тем не менее, значение *атрибута* не имеет значения,
вот почему вы не можете включить кнопку, написав `<button disabled="false">Still Disabled</button>`.

Чтобы контролировать состояние кнопки, установите  `disabled`   *свойство*,

<div class="alert is-helpful">

Хотя вы могли бы технически установить  `[attr.disabled]`  атрибута, значения отличаются тем, что привязка свойства требует логического значения, в то время как соответствующая привязка атрибута зависит от того, является ли значение  `null`  или нет. Рассмотрим следующее:

```html
<input [disabled]="condition ? true : false">
<input [attr.disabled]="condition ? 'disabled' : null">
```

Как правило, используйте привязку свойства к привязке атрибута, так как она более интуитивна (является логическим значением), имеет более короткий синтаксис и более производительный.

</div>


Чтобы увидеть  `disabled`  Пример кнопки в работающем приложении, смотрите <live-example name="binding-syntax"></live-example>синтаксис привязки. В этом примере показано, как переключить отключенное свойство из компонента.

{@a binding-types-and-targets}
## Обязательные типы и цели

**Мишень связывания данных** является то, что в DOM.
В зависимости от типа связывания, цель может быть свойство (элемент, компонент или директива),
событие (элемент, компонент или директива) или иногда имя атрибута.
В следующей таблице приведены цели для разных типов привязки.

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">






  <tr>
    <th>
      Тип
    </th>
    <th>
      Target
    </th>
    <th>
      Примеры
    </th>
  </tr>
  <tr>
    <td>
      Недвижимость
    </td>
    <td>
      Элемент собственности <br>
      Свойство компонента <br>
      Директива собственности
    </td>
    <td>
      <code>src</code>, <code>hero</code>И <code>ngClass</code>в следующем:
      <code-example path="template-syntax/src/app/app.component.html" region="property-binding-syntax-1"></code-example>
      <!-- For more information, see [Property Binding](guide/property-binding). -->
    </td>
  </tr>
  <tr>
    <td>
      Событие
    </td>
    <td>
      Элемент события <br>
      Компонентное событие <br>
      Директивное событие
    </td>
    <td>
      <code>click</code>, <code>deleteRequest</code>И <code>myClick</code>в следующем:
      <code-example path="template-syntax/src/app/app.component.html" region="event-binding-syntax-1"></code-example>
      <!-- KW--Why don't these links work in the table? -->
      <!-- <div>For more information, see [Event Binding](guide/event-binding).</div> -->
    </td>
  </tr>
  <tr>
    <td>
      Двухсторонний
    </td>
    <td>
      Событие и собственность
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="2-way-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      Атрибут
    </td>
    <td>
      Атрибут
      (исключение)
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="attribute-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      Класс
    </td>
    <td>
      <code>class</code>недвижимость
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="class-binding-syntax-1"></code-example>
    </td>
  </tr>
  <tr>
    <td>
      Стиль
    </td>
    <td>
      <code>style</code>недвижимость
    </td>
    <td>
      <code-example path="template-syntax/src/app/app.component.html" region="style-binding-syntax-1"></code-example>
    </td>
  </tr>
</table>

<!-- end of binding syntax -->

<hr/>

{@a property-binding}

{@a property-binding-[property]}
## Привязка собственности  `[property]` 

Использовать привязку свойств к _set_ свойствам целевых элементов или
директива  `@Input()`  декораторы. Для примера
демонстрируя все пункты в этом разделе, см
<live-example name="property-binding">пример привязки свойства </live-example>.

{@a one-way-in}
### Односторонний в

Привязка свойств передает значение в одном направлении
из свойства компонента в свойство целевого элемента.

Вы не можете использовать собственность
привязка к чтению или извлечению значений из целевых элементов. Точно так же вы не можете использовать
привязка свойства для вызова метода целевого элемента.
Если элемент вызывает события, вы можете прослушивать их с помощью [привязки событий](guide/template-syntax#event-binding).

Если вы должны прочитать элемент свойства целевого или вызвать один из его методов,
см. ссылку на API для [ViewChild](api/core/ViewChild)и
[ContentChild](api/core/ContentChild).

{@a examples}
### Примеры

Наиболее распространенная привязка свойства устанавливает свойство элемента для компонента
стоимость имущества. Пример есть
связывание  `src`  Свойство элемента изображения для компонента  `itemImageUrl`  свойство:

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

Вот пример привязки к  `colSpan`  свойство . Обратите внимание, что это не  `colspan`,
который является атрибутом, пишется в нижнем регистре  `s`.

<code-example path="property-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

Для получения дополнительной информации см. [MDN HTMLTableCellElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableCellElement)Документацию.

<!-- Add link when Attribute Binding updates are merged:
For more about  `colSpan`  and  `colspan`, see (Attribute Binding)[guide/template-syntax]. -->

Другой пример - отключение кнопки, когда компонент говорит, что это  `isUnchanged`  :

<code-example path="property-binding/src/app/app.component.html" region="disabled-button" header="src/app/app.component.html"></code-example>

Другой устанавливает свойство директивы:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

Еще один способ - задать свойство модели пользовательского компонента - отличный способ
для родительских и дочерних компонентов для связи:

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

{@a binding-targets}
### Обязательные цели

Свойство элемента, заключенное в квадратные скобки, идентифицирует целевое свойство.
Свойство target в следующем коде является элементом image  `src`  свойство.

<code-example path="property-binding/src/app/app.component.html" region="property-binding" header="src/app/app.component.html"></code-example>

Там также  `bind-`  Приставка альтернатива:

<code-example path="property-binding/src/app/app.component.html" region="bind-prefix" header="src/app/app.component.html"></code-example>


В большинстве случаев целевым именем является даже имя свойства
когда это кажется именем атрибута.
Так что в этом случае  `src`  это имя  `<img>`  свойство элемента.

Свойства элемента могут быть более распространенными целями
но Angular выглядит первым, чтобы увидеть, если имя является собственностью известной директивы
как это показано в следующем примере:

<code-example path="property-binding/src/app/app.component.html" region="class-binding" header="src/app/app.component.html"></code-example>

Технически Angular сопоставляет имя с директивой  `@Input()`,
одно из имен свойств, перечисленных в директиве  `inputs`  массив
или имущество, украшенное  `@Input()`.
Такие входные данные соответствуют собственным свойствам директивы.

Если имя не соответствует свойству известной директивы или элемента, Angular выдает «неизвестную директиву» ?? ошибка.

<div class="alert is-helpful">

Хотя целевым именем обычно является имя свойства
в Angular существует автоматическое сопоставление атрибута и свойства
несколько общих атрибутов. Они включают  `class`  /  `className`, `innerHtml`  /  `innerHTML`, и
 `tabindex ` / ` tabIndex`.

</div>


{@a avoid-side-effects}
### Избегайте побочных эффектов

Оценка шаблона выражения не должна иметь видимых побочных эффектов.
Сам язык выражений или способ написания шаблонных выражений
помогает в определенной степени;
Вы не можете присвоить значение чему-либо в выражении привязки свойства
и не используйте операторы увеличения и уменьшения.

Например, вы могли бы иметь выражение, которое вызывало свойство или метод, которые имели
побочные эффекты. Выражение может вызвать что-то вроде  `getFoo()`  где только ты
Знаешь что  `getFoo()`  делает. Если  `getFoo()`  что-то меняет
и вы случайно привязываетесь к этому чему-то
Angular может отображать или не отображать измененное значение. Angular может обнаружить
изменить и выбросить предупреждение об ошибке.
Рекомендуется придерживаться свойств и методов, которые возвращаются
значения и избежать побочных эффектов.

{@a return-the-proper-type}
### Верните правильный тип

Выражение шаблона должно соответствовать типу значения
что ожидает целевое свойство.
Возвращает строку, если целевое свойство ожидает строку, число, если оно
ожидает число, объект, если он ожидает объект, и так далее.

В следующем примере  `childItem`  свойство  `ItemDetailComponent` ожидает строку, которая является именно то, что вы отправляете в свойстве переплета

<code-example path="property-binding/src/app/app.component.html" region="model-property-binding" header="src/app/app.component.html"></code-example>

Вы можете подтвердить это, посмотрев в  `ItemDetailComponent`  где  `@Input`  типа устанавливается в строку:
<code-example path="property-binding/src/app/item-detail/item-detail.component.ts" region="input-type" header="src/app/item-detail/item-detail.component.ts (setting the @Input() type)"></code-example>

Как вы можете видеть здесь,  `parentItem`  in  `AppComponent`  представляет собой строку, которая  `ItemDetailComponent`  ожидает:
<code-example path="property-binding/src/app/app.component.ts" region="parent-data-type" header="src/app/app.component.ts"></code-example>

{@a passing-in-an-object}
#### Проходя в объекте

Предыдущий простой пример показал передачу в строке. Чтобы перейти в объект
синтаксис и мышление одинаковы.

В этом сценарии  `ItemListComponent`  вложен в  `AppComponent`  и  `items`  Свойство ожидает массив объектов.

<code-example path="property-binding/src/app/app.component.html" region="pass-object" header="src/app/app.component.html"></code-example>

 `items` свойство объявлено в  `ItemListComponent`  с типом  `Item`  и украшен  `@Input()`  :

<code-example path="property-binding/src/app/item-list/item-list.component.ts" region="item-input" header="src/app/item-list.component.ts"></code-example>

В этом примере приложения  `Item`  - это объект, имеющий два свойства;  `id ` и ` name`.

<code-example path="property-binding/src/app/item.ts" region="item-class" header="src/app/item.ts"></code-example>

Хотя список элементов существует в другом файле,  `mock-items.ts`, вы можете
указать другой элемент в  `app.component.ts`  так, что новый пункт будет оказывать:

<code-example path="property-binding/src/app/app.component.ts" region="pass-object" header="src/app.component.ts"></code-example>

Вы просто должны убедиться, что в этом случае вы предоставляете массив объектов, потому что это тип  `Item`  и является вложенным компонентом,  `ItemListComponent`, ожидает.

В этом примере  `AppComponent`  указывает другой  `item`  предмета
(`currentItems`) и передает его вложенным  `ItemListComponent`  .  `ItemListComponent`  был в состоянии использовать  `currentItems`  потому что это соответствует тому, что  `Item`  объекта в соответствии с  `item.ts`  .  `item.ts` Файл находится где
 `ItemListComponent` получает свое определение  `item`.

{@a remember-the-brackets}
### Помните скобки

Скобки,  `[]`, скажите Angular для оценки выражения шаблона.
Если вы опустите скобки, Angular обрабатывает строку как константу
и *инициализирует свойство цели* с этой строкой:

<code-example path="property-binding/src/app/app.component.html" region="no-evaluation" header="src/app.component.html"></code-example>


Если пропустить скобки, будет отображена строка
 `parentItem`, а не значение  `parentItem`.

{@a one-time-string-initialization}
### Однократная инициализация строки

Вы *должны* опустить скобки, когда все следующие условия:

* Свойство target принимает строковое значение.
* Строка является фиксированным значением, которое вы можете поместить непосредственно в шаблон.
* Это начальное значение никогда не меняется.

Вы обычно инициализируете атрибуты таким образом в стандартном HTML, и это работает
точно так же и для инициализации директив и свойств компонентов.
Следующий пример инициализирует  `prefix`  свойство  `StringInitComponent` для фиксированной строки
не шаблонное выражение. Angular устанавливает его и забывает об этом.

<code-example path="property-binding/src/app/app.component.html" region="string-init" header="src/app/app.component.html"></code-example>

 `[item]` Привязка, с другой стороны, остается живой привязкой к компоненту  `currentItems`  свойство.

{@a property-binding-vs.-interpolation}
### Привязка свойств против интерполяции

У вас часто есть выбор между интерполяцией и привязкой свойства.
Следующие связывающие пары делают то же самое:

<code-example path="property-binding/src/app/app.component.html" region="property-binding-interpolation" header="src/app/app.component.html"></code-example>

Интерполяция является удобной альтернативой привязке свойств в
много случаев. При отображении значений данных в виде строк, нет
техническая причина предпочесть одну форму другой, хотя удобочитаемость
стремится к интерполяции. Однако *при настройке элемента
свойство к нестроковому значению данных, вы должны использовать привязку свойства *.

{@a content-security}
### Безопасность контента

Представьте себе следующий вредоносный контент.

<code-example path="property-binding/src/app/app.component.ts" region="malicious-content" header="src/app/app.component.ts"></code-example>

В шаблоне компоненты, содержание может быть использовано с интерполяцией:

<code-example path="property-binding/src/app/app.component.html" region="malicious-interpolated" header="src/app/app.component.html"></code-example>

К счастью, привязка данных Angular находится в состоянии готовности к опасному HTML. В приведенном выше случае
HTML-код отображается как есть, а Javascript не выполняется. Angular **нет**
позволяют HTML с тегами сценария попадать в браузер, ни с интерполяцией
ни собственность обязательна.

В следующем примере, однако, Angular [дезинфицирует](guide/security#sanitization-and-security-contexts)
значения до их отображения.

<code-example path="property-binding/src/app/app.component.html" region="malicious-content" header="src/app/app.component.html"></code-example>

Интерполяция обрабатывает  `<script>`  тегов отличается от
привязка свойства, но оба подхода делают
содержание безвредно. Ниже приведен вывод браузера
из  `evilTitle`  примеры.

<code-example language="bash">
"Template <script>alert("evil never sleeps") </script> Syntax" is the interpolated evil title.
"Template alert("evil never sleeps") Syntax" is the property bound evil title.
</code-example>

<hr/>
{@a other-bindings}

{@a attribute-class-and-style-bindings}
## Привязка атрибутов, классов и стилей

Синтаксис шаблона обеспечивает специализированные односторонние привязки для сценариев, менее подходящих для привязки свойств.

Чтобы увидеть привязки атрибутов, классов и стилей в работающем приложении, смотрите <live-example name="attribute-binding"></live-example>раздел специально для этого раздела.


{@a attribute-binding}
### Привязка атрибутов

Установите значение атрибута напрямую с помощью **привязки атрибута**, Это единственное исключение из правила, согласно которому привязка устанавливает целевое свойство, и единственная привязка, которая создает и устанавливает атрибут.

Обычно, установка свойства элемента с помощью [привязки свойства](guide/template-syntax#property-binding)
предпочтительнее устанавливать атрибут со строкой. Однако иногда
не существует свойства элемента для привязки, поэтому атрибутное связывание является решением.

Рассмотрим [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)и
[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG). Они являются чисто атрибутами, не соответствуют свойствам элемента и не устанавливают свойства элемента. В этих случаях нет целевых объектов свойств для привязки.

Синтаксис привязки атрибута напоминает привязку свойства, но
вместо свойства элемента в скобках начните с префикса  `attr`,
сопровождаемый точкой (`.`) и имя атрибута.
Затем установите значение атрибута, используя выражение, которое решает на строку,
или удалите атрибут, когда выражение разрешается в  `null`.

Один из основных вариантов использования для привязки атрибутов
это набор атрибутов ARIA, как в этом примере:

<code-example path="attribute-binding/src/app/app.component.html" region="attrib-binding-aria" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

{@a colspan-and-colspan}
####  `colspan ` и ` colSpan` 

Обратите внимание на разницу между  `colspan`  атрибут и тому  `colSpan`  свойство.

Если вы написали что - то вроде этого:

<code-example language="html">
  &lt;tr&gt;&lt;td colspan="{{1 + 1}}"&gt;Three-Four&lt;/td&gt;&lt;/tr&gt;
</code-example>

Вы бы получить эту ошибку:

<code-example language="bash">
  Template parse errors:
  Can't bind to 'colspan' since it isn't a known native property
</code-example>

Как говорится в сообщении,  `<td>`  Элемент не имеет  `colspan`  собственности. Это верно
потому что  `colspan`  - это атрибут  `colSpan`, с большой буквы  `S`, это
соответствующее свойство. Интерполяция и привязка свойств могут устанавливать только *свойства*, а не атрибуты.

Вместо этого нужно использовать свойство связывания и написать это так:

<code-example path="attribute-binding/src/app/app.component.html" region="colSpan" header="src/app/app.component.html"></code-example>

</div>


<hr/>

{@a class-binding}
### Класс привязки

Вот как установить  `class`  атрибут без привязки в виде обычного HTML:

```html
<!-- standard class attribute setting -->
<div class="foo bar">Some text</div>
```

Вы также можете добавлять и удалять имена классов CSS из элемента  `class`  атрибута с **обязательным классом**.

Чтобы создать привязку одного класса, начните с префикса  `class`  за которым следует точка (`.`) и имя класса CSS (например,  `[class.foo]="hasFoo"`).
Angular добавляет класс, когда связанное выражение истинно, и удаляет класс, когда выражение ложное (за исключением  `undefined`, см. [делегирование стиля](#styling-delegation)).

Чтобы создать привязку к нескольким классам, используйте общий  `[class]`  привязка без точки (например,  `[class]="classExpr"`).
Выражение может быть строкой имен классов, разделенных пробелами, или вы можете отформатировать ее как объект с именами классов в качестве ключей и выражениями правдивости / ложности в качестве значений.
С форматом объекта Angular добавит класс, только если его связанное значение истинно.

Важно отметить, что с любым объектоподобным выражением (  `object`, `Array`, `Map`, `Set`  и т. Д.), Идентификатор объекта должен измениться для обновления списка классов.
Обновление свойства без изменения идентичности объекта не будет иметь никакого эффекта.

Если существует несколько привязок к одному и тому же имени класса, конфликты разрешаются с помощью [приоритет стиля](#styling-precedence).

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">








  <tr>
    <th>
      Тип привязки
    </th>
    <th>
      Синтаксис
    </th>
    <th>
      Тип входа
    </th>
    <th>
      Пример входных значений
    </th>
  </tr>
  <tr>
    <td>Связывание одного класса </td>
    <td><code>[class.foo]="hasFoo"</code></td>
    <td><code>boolean | undefined | null</code></td>
    <td><code>true</code>, <code>false</code></td>
  </tr>
  <tr>
    <td rowspan=3>Мультиклассовая привязка </td>
    <td rowspan=3><code>[class]="classExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"my-class-1 my-class-2 my-class-3"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: boolean | undefined | null}</code></td>
    <td><code>{foo: true, bar: false}</code></td>
  </tr>
  <tr>
    <td><code>Array</code>< <code>string</code>> </td>
    <td><code>['foo', 'bar']</code></td>
  </tr>
</table>


[NgClass](#ngclass)директива может быть использована в качестве альтернативы, чтобы направить  `[class]`  привязки.
Однако, используя приведенный выше синтаксис привязки классов без  `NgClass`  предпочтительнее, потому что из-за улучшений в связывании классов в Angular,  `NgClass`  больше не обеспечивает значительную ценность и может в конечном итоге быть удалена в будущем.


<hr/>

{@a style-binding}
### Стиль привязки

Вот как установить  `style`  атрибут без привязки в виде обычного HTML:

```html
<!-- standard style attribute setting -->
<div style="color: blue">Some text</div>
```

Вы также можете динамически устанавливать стили с помощью **привязки стилей**.

Чтобы создать единую привязку стиля, начните с префикса  `style`  за которым следует точка (`.`) и имя свойства стиля CSS (например,  `[style.width]="width"`).
Свойству будет присвоено значение связанного выражения, которое обычно является строкой.
При желании вы можете добавить расширение модуля, как  `em`  или  `%`, для которого требуется тип числа.

<div class="alert is-helpful">

Обратите внимание, что имя свойства _style может быть записано в любом из них
[тире](guide/glossary#dash-case), как показано выше, или
[camelCase](guide/glossary#camelcase), такой как  `fontSize`.

</div>

Если есть несколько стилей, которые вы хотите переключить, вы можете привязать к  `[style]`  свойство напрямую без точки (например,  `[style]="styleExpr"`).
Выражение прилагается к  `[style]`  привязка чаще всего представляет собой строковый список стилей, например `"width: 100px; height: 100px;"`,

Вы также можете отформатировать выражение как объект с именами стилей в качестве ключей и значениями стилей в качестве значений, например `{width: '100px', height: '100px'}`.
Важно отметить, что с любым объектоподобным выражением (  `object`, `Array`, `Map`, `Set`  и т. Д.), Идентификатор объекта должен измениться для обновления списка классов.
Обновление свойства без изменения идентичности объекта не будет иметь никакого эффекта.

Если имеется несколько привязок к одному и тому же свойству стиля, конфликты разрешаются с помощью [правила приоритета стиля](#styling-precedence).

<style>
  td, th {vertical-align: top}
</style>

<table width="100%">








  <tr>
    <th>
      Тип привязки
    </th>
    <th>
      Синтаксис
    </th>
    <th>
      Тип входа
    </th>
    <th>
      Пример входных значений
    </th>
  </tr>
  <tr>
    <td>Единый стиль привязки </td>
    <td><code>[style.width]="width"</code></td>
    <td><code>string | undefined | null</code></td>
    <td><code>"100px"</code></td>
  </tr>
  <tr>
  <tr>
    <td>Единый стиль привязки с единицами </td>
    <td><code>[style.width.px]="width"</code></td>
    <td><code>number | undefined | null</code></td>
    <td><code>100</code></td>
  </tr>
    <tr>
    <td rowspan=3>Мульти-стиль привязки </td>
    <td rowspan=3><code>[style]="styleExpr"</code></td>
    <td><code>string</code></td>
    <td><code>"width: 100px; height: 100px"</code></td>
  </tr>
  <tr>
    <td><code>{[key: string]: string | undefined | null}</code></td>
    <td><code>{width: '100px', height: '100px'}</code></td>
  </tr>
  <tr>
    <td><code>Array</code>< <code>string</code>> </td>
    <td><code>['width', '100px']</code></td>
  </tr>
</table>

[NgStyle](#ngstyle)директива может быть использована в качестве альтернативы, чтобы направить  `[style]`  привязки.
Однако, используя приведенный выше синтаксис привязки стиля без  `NgStyle`  является предпочтительным, потому что из-за улучшений в привязке стилей в Angular,  `NgStyle`  больше не обеспечивает значительную ценность и может в конечном итоге быть удален в будущем.


<hr/>

{@a styling-precedence}
{@a styling-precedence}
### Приоритет стиля

Один элемент HTML может иметь свой список классов CSS и значения стилей, привязанные к нескольким источникам (например, привязки хоста из нескольких директив).

При наличии нескольких привязок к одному и тому же имени класса или свойству стиля Angular использует набор правил приоритета для разрешения конфликтов и определения, какие классы или стили в конечном итоге применяются к элементу.

<div class="alert is-helpful">
<h4>Приоритет стиля (от высшего к низшему) </h4>

1. Шаблонные привязки
    1. Свойство привязки (например,  `<div [class.foo]="hasFoo"> ` или ` <div [style.color]="color">`)
    1. Привязка карты (например, `<div [class]="classExpr"> ` или ` <div [style]="styleExpr">`)
    1. Статическое значение (например, `<div class="foo"> ` или ` <div style="color: blue">`)
1. Директивные привязки хоста
    1. Свойство привязки (например, `host: {'[class.foo]': 'hasFoo'} ` или ` host: {'[style.color]': 'color'}`)
    1. Привязка карты (например, `host: {'[class]': 'classExpr'} ` или ` host: {'[style]': 'styleExpr'}`)
    1. Статическое значение (например, `host: {'class': 'foo'} ` или ` host: {'style': 'color: blue'}`)
1. Привязки хостов компонентов
    1. Свойство привязки (например, `host: {'[class.foo]': 'hasFoo'} ` или ` host: {'[style.color]': 'color'}`)
    1. Привязка карты (например, `host: {'[class]': 'classExpr'} ` или ` host: {'[style]': 'styleExpr'}`)
    1. Статическое значение (например, `host: {'class': 'foo'} ` или ` host: {'style': 'color: blue'}`)

</div>

Чем конкретнее привязка класса или стиля, тем выше его приоритет.

Привязка к определенному классу (например,  `[class.foo]`) будет иметь приоритет над общим  `[class]`  привязка и привязка к определенному стилю (например,  `[style.bar]`) будет иметь приоритет над общим  `[style]`  обязательна.

<code-example path="attribute-binding/src/app/app.component.html" region="basic-specificity" header="src/app/app.component.html"></code-example>

Правила специфичности также применяются, когда речь идет о привязках, которые происходят из разных источников.
Элемент может иметь привязки в шаблоне, в котором он объявлен, из привязок хоста в соответствующих директивах и из привязок хоста в соответствующих компонентах.

Привязки шаблонов являются наиболее конкретными, поскольку они применяются к элементу напрямую и исключительно, поэтому они имеют наивысший приоритет.

Привязки хостов директив считаются менее конкретными, поскольку директивы могут использоваться в нескольких местах, поэтому они имеют более низкий приоритет, чем привязки шаблонов.

Директивы часто улучшают поведение компонентов, поэтому привязки хостов от компонентов имеют наименьший приоритет.

<code-example path="attribute-binding/src/app/app.component.html" region="source-specificity" header="src/app/app.component.html"></code-example>

Кроме того, привязки имеют приоритет над статическими атрибутами.

В следующем случае  `class`  и  `[class]`  имеют сходную специфику, но  `[class]`  Привязка будет иметь приоритет, потому что она динамическая.

<code-example path="attribute-binding/src/app/app.component.html" region="dynamic-priority" header="src/app/app.component.html"></code-example>

{@a styling-delegation}
{@a delegating-to-styles-with-lower-precedence}
### Делегирование стилей с более низким приоритетом

Для стилей с более высоким приоритетом можно «делегировать» стили с более низким приоритетом, используя  `undefined`  значения.
Принимая во внимание, что установка свойства стиля  `null`  гарантирует, что стиль будет удален, установив его  `undefined`  приведет к тому, что Angular вернется к следующему наивысшему приоритету, привязанному к этому стилю.

Например, рассмотрим следующий шаблон:

<code-example path="attribute-binding/src/app/app.component.html" region="style-delegation" header="src/app/app.component.html"></code-example>

Представь, что  `dirWithHostBinding`  директива и  `comp-with-host-binding`  Компонент имеет  `[style.width]`  привязка хоста.
В этом случае, если  `dirWithHostBinding`  устанавливает свою привязку к  `undefined`, `width`  свойство будет возвращаться к значению  `comp-with-host-binding`  хоста к.
Однако если  `dirWithHostBinding`  устанавливает свою привязку к  `null`, `width`  Свойство будет полностью удалено.


{@a event-binding}

{@a event-binding-event}
## Привязка к событию  `(event)` 

Привязка событий позволяет прослушивать определенные события, такие как
нажатия клавиш, движения мыши, щелчки и касания. Для примера
демонстрируя все пункты в этом разделе, см. <live-example name="event-binding">пример привязки события </live-example>.

Синтаксис привязки Angular событий состоит из **целевого события** имени
в скобках слева от знака равенства и кавычки
Шаблон заявления справа.
Следующая привязка событий прослушивает события нажатия кнопки, вызывая
компоненты  `onSave()`  метод всякий раз, когда происходит щелчок:

<div class="lightbox">
  <img src='generated/images/guide/template-syntax/syntax-diagram.svg' alt="Syntax diagram">
</div>

{@a target-event}
### Целевое событие

Как и выше, целью является событие нажатия кнопки.

<code-example path="event-binding/src/app/app.component.html" region="event-binding-1" header="src/app/app.component.html"></code-example>

В качестве альтернативы используйте  `on-`  префикс, известный как каноническая форма:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-2" header="src/app/app.component.html"></code-example>

События элемента могут быть более распространенными целями, но Angular сначала смотрит, соответствует ли имя свойству события
известная директива, как это происходит в следующем примере:

<code-example path="event-binding/src/app/app.component.html" region="custom-directive" header="src/app/app.component.html"></code-example>

Если имя не совпадает событие элемента или выход свойство известной директивы
Angular сообщает «неизвестную директиву» ?? ошибка.


{@a *$event*-and-event-handling-statements}
### *$ event* и операторы обработки событий

В привязке события Angular устанавливает обработчик события для целевого события.

Когда событие вызывается, обработчик выполняет оператор шаблона.
Шаблонный оператор обычно включает получателя, который выполняет действие
в ответ на событие, например, сохранение значения из элемента управления HTML
в модель.

Привязка передает информацию о событии. Эта информация может включать значения данных, такие как объект события, строка или число с именем  `$event`.

Целевое событие определяет форму  `$event`  объекта.
Если целевое событие является собственным событием элемента DOM, то  `$event`  является
[DOM - объект события](https://developer.mozilla.org/en-US/docs/Web/Events),
с такими свойствами, как  `target`  и  `target.value`.

Рассмотрим следующий пример:

<code-example path="event-binding/src/app/app.component.html" region="event-binding-3" header="src/app/app.component.html"></code-example>

Этот код устанавливает  `<input>`    `value` свойства путем привязки к  `name`  собственности.
Чтобы прослушать изменения значения, код привязывается к  `input` 
событие  `<input>`  элемент.
Когда пользователь вносит изменения,  `input`  событие возникает, и привязка выполняется
оператор в контексте, который включает в себя объект события DOM,  `$event`.

Чтобы обновить  `name`  свойство, измененный текст извлекается по пути  `$event.target.value`.

Если событие относится к директиве - вспомните эти компоненты
директивы  `$event`  имеет любую форму, создаваемую директивой.


{@a custom-events-with-eventemitter}
### Пользовательские события с  `EventEmitter` 

Директивы обычно вызывают пользовательские события с Angular [EventEmitter](api/core/EventEmitter).
Директива создает  `EventEmitter`  и выставляет его как свойство.
Директива призывает  `EventEmitter.emit(payload)`  для запуска события, передавая полезную нагрузку сообщения, которая может быть чем угодно.
Родительские директивы прослушивают событие, связываясь с этим свойством и получая доступ к полезной нагрузке через  `$event`  объекта.

Рассмотрим  `ItemDetailComponent`  который представляет информацию об элементе и отвечает на действия пользователя.
Хотя  `ItemDetailComponent`  имеет кнопку удаления, он не знает, как удалить героя. Он может вызывать только событие, сообщающее о запросе пользователя на удаление.

Вот соответствующие выдержки из этого  `ItemDetailComponent`  :


<code-example path="event-binding/src/app/item-detail/item-detail.component.html" header="src/app/item-detail/item-detail.component.html (template)" region="line-through"></code-example>

<code-example path="event-binding/src/app/item-detail/item-detail.component.ts" header="src/app/item-detail/item-detail.component.ts (deleteRequest)" region="deleteRequest"></code-example>


Компонент определяет  `deleteRequest`  свойство которое возвращает  `EventEmitter`.
Когда пользователь нажимает *удалить*, компонент вызывает  `delete()`  метод
говоря  `EventEmitter`  испустить  `Item`  предмета.

Теперь представьте себе родительский компонент хостинга, который привязывается к  `deleteRequest`  событие
из  `ItemDetailComponent`.

<code-example path="event-binding/src/app/app.component.html" header="src/app/app.component.html (event-binding-to-component)" region="event-binding-to-component"></code-example>

Когда  `deleteRequest`  Событие происходит, Angular вызывает родительский компонент
 `deleteItem()`, передающий *элемент для удаления* (испускаемый  `ItemDetail`)
в  `$event`  Переменная.

{@a template-statements-have-side-effects}
### Шаблон заявления имеет побочные эффекты

Хотя [шаблонные выражения](guide/template-syntax#template-expressions)не должны иметь [побочные эффекты](guide/template-syntax#avoid-side-effects), шаблон
заявления обычно делают.  `deleteItem()` имеет
побочный эффект: удаляет элемент.

Удаление элемента обновляет модель и, в зависимости от вашего кода, запускает
другие изменения, включая запросы и сохранение на удаленном сервере.
Эти изменения распространяются через систему и в конечном итоге отображаются в этом и других представлениях.


<hr/>

{@a two-way}

{@a two-way-binding-[...]}
## Двухстороннее связывание  `[(...)]` 

Двусторонняя привязка дает вашему приложению возможность обмениваться данными между классом компонента и
его шаблон.

Для демонстрации синтаксиса и фрагментов кода в этом разделе см. <live-example name="two-way-binding">Пример двустороннего связывания </live-example>.

{@a basics-of-two-way-binding}
### Основы двусторонней привязки

Двустороннее связывание делает две вещи:

1. Устанавливает конкретное свойство элемента.
1. Прослушивает событие изменения элемента.

Для этой цели Angular предлагает специальный синтаксис _двухсторонней привязки данных_,  `[()]`.
 `[()]` Синтаксис объединяет скобки
привязки собственности,  `[]`, с круглыми скобками привязки события,  `()`.

<div class="callout is-important">

<header>
  [()] = банан в коробке
</header>

Визуализируйте *банан в коробке,* чтобы помнить, что скобки идут _inside_ скобки.

</div>

 `[()]` Синтаксис легко продемонстрировать, когда элемент имеет настраиваемое значение
свойство называется  `x`  и соответствующее событие с именем  `xChange`.
Вот  `SizerComponent`  который соответствует этому шаблону.
Оно имеет  `size`  свойство значения и компаньон  `sizeChange`  событие:

<code-example path="two-way-binding/src/app/sizer/sizer.component.ts" header="src/app/sizer.component.ts"></code-example>

<code-example path="two-way-binding/src/app/sizer/sizer.component.html" header="src/app/sizer.component.html"></code-example>

Начальный  `size`  является входным значением из привязки свойства.
Нажатие на кнопки увеличивает или уменьшает  `size`, в пределах
минимальное / максимальное значение ограничения
а затем поднимает или испускает  `sizeChange`  событие с установленным размером.

Вот пример, в котором  `AppComponent.fontSizePx`  является двусторонней привязкой к  `SizerComponent`  :

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-1)" region="two-way-1"></code-example>

 `AppComponent.fontSizePx` устанавливает начальный  `SizerComponent.size`  Значение.

<code-example path="two-way-binding/src/app/app.component.ts" header="src/app/app.component.ts" region="font-size"></code-example>

Нажатие на кнопки обновляет  `AppComponent.fontSizePx`  через двустороннюю привязку.
Пересмотренный  `AppComponent.fontSizePx`  значение течет через к _style_ связывания
сделать отображаемый текст больше или меньше.

Синтаксис двусторонней привязки на самом деле является просто синтаксическим сахаром для привязки _property_ и привязки _event_.
Angular десугары  `SizerComponent`  связывание в этом:

<code-example path="two-way-binding/src/app/app.component.html" header="src/app/app.component.html (two-way-2)" region="two-way-2"></code-example>

 `$event` Переменная содержит полезную нагрузку  `SizerComponent.sizeChange`  Событие.
Angular присваивает  `$event`  значение  `AppComponent.fontSizePx`  когда пользователь нажимает кнопки.

{@a two-way-binding-in-forms}
### Двухстороннее связывание в формах

Синтаксис двустороннего связывания - это большое удобство по сравнению с
отдельные привязки свойств и событий. Было бы удобно
использовать двустороннее связывание с такими элементами HTML-формы, как  `<input>`  и
 `<select>` . Однако ни один нативный элемент HTML не следует за  `x` 
значение и  `xChange`  события.

Подробнее о том, как использовать двустороннюю привязку в формах, см
Angular [НгМодель](guide/template-syntax#ngModel).

<hr/>

{@a directives}

{@a built-in-directives}
## Встроенные директивы

Angular предлагает два вида встроенных директив: attribute
директивы и структурные директивы. В этом сегменте рассматриваются некоторые из наиболее распространенных встроенных директив
классифицируется как [директивы _attribute_](guide/template-syntax#attribute-directives)или [директивы _structural_](guide/template-syntax#structural-directives)и имеет собственный <live-example name="built-in-directives">пример встроенных директив</live-example>,

Для получения более подробной информации, в том числе о том, как создавать свои собственные пользовательские директивы, см. [Директивы атрибутов](guide/attribute-directives)и [Структурные директивы](guide/structural-directives).

<hr/>

{@a attribute-directives}

{@a built-in-attribute-directives}
### Встроенные атрибуты директив

Директивы атрибутов слушают и изменяют поведение
другие элементы HTML, атрибуты, свойства и компоненты.
Вы обычно применяете их к элементам, как если бы они были атрибутами HTML, отсюда и название.

Многие NgModules, такие как [  `RouterModule`  ](guide/router "Routing and Navigation")
и [  `FormsModule`  ](guide/forms "Forms") определяют свои собственные директивы атрибутов.
Большинство директив общего атрибута следующим образом :

* [  `NgClass`  ](guide/template-syntax#ngClass)добавляет и удаляет набор классов CSS.
* [  `NgStyle`  ](guide/template-syntax#ngStyle)добавляет и удаляет набор стилей HTML.
* [  `NgModel`  ](guide/template-syntax#ngModel)добавляет двустороннюю привязку данных к элементу формы HTML.

<hr/>

{@a ngClass}

{@a ngclass}
###  `NgClass` 

Добавить или удалить несколько классов CSS одновременно с  `ngClass`.

<code-example path="built-in-directives/src/app/app.component.html" region="special-div" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Чтобы добавить или удалить *отдельный* класс, используйте [связывание классов](guide/template-syntax#class-binding)а не  `NgClass`.

</div>

Рассмотрим  `setCurrentClasses()`  компонент, метод, который задает свойство компонента
 `currentClasses`, с объектом, который добавляет или удаляет три класса на основе
 `true ` / ` false` состояние трех других свойств компонента. Каждый ключ объекта является именем класса CSS; его ценность  `true`  если класс должен быть добавлен
 `false` если она должна быть удалена.

<code-example path="built-in-directives/src/app/app.component.ts" region="setClasses" header="src/app/app.component.ts"></code-example>

Добавление  `ngClass`  свойства к  `currentClasses`  устанавливает классы элемента соответственно:

<code-example path="built-in-directives/src/app/app.component.html" region="NgClass-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Помните, что в этой ситуации вы бы позвонили  `setCurrentClasses()`,
как изначально, так и при изменении зависимых свойств.

</div>

<hr/>

{@a ngStyle}

{@a ngstyle}
###  `NgStyle` 

использование  `NgStyle`  для одновременной и динамической установки множества встроенных стилей в зависимости от состояния компонента.

{@a without-ngstyle}
#### Без  `NgStyle` 

Для контекста рассмотрите возможность установки *единственного* значения стиля с [привязка стиля](guide/template-syntax#style-binding), без  `NgStyle`.

<code-example path="built-in-directives/src/app/app.component.html" region="without-ng-style" header="src/app/app.component.html"></code-example>

Однако, чтобы установить *много* встроенных стилей одновременно, используйте  `NgStyle`  Директива.

Следующее является  `setCurrentStyles()`  Метод который устанавливает компонент
свойство,  `currentStyles`, с объектом, который определяет три стиля
на основе состояния трех других свойств компонентов:

<code-example path="built-in-directives/src/app/app.component.ts" region="setStyles" header="src/app/app.component.ts"></code-example>

Добавление  `ngStyle`  свойства к  `currentStyles`  задает стили элемента соответственно:

<code-example path="built-in-directives/src/app/app.component.html" region="NgStyle-2" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Не забудьте позвонить  `setCurrentStyles()`, как изначально, так и при изменении зависимых свойств.

</div>


<hr/>

{@a ngModel}

{@a [ngmodel]-two-way-binding}
###  `[(ngModel)]` : двусторонняя привязка

 `NgModel` Директива позволяет отображать свойство данных и
обновить это свойство, когда пользователь вносит изменения. Вот пример:

<code-example path="built-in-directives/src/app/app.component.html" header="src/app/app.component.html (NgModel example)" region="NgModel-1"></code-example>


{@a import-formsmodule-to-use-ngmodel}
#### Импортировать  `FormsModule`  для использования  `ngModel` 

Перед использованием  `ngModel`  директива в двусторонней привязке данных
Вы должны импортировать  `FormsModule`  и добавить его в NgModule  `imports`  список.
Узнайте больше о  `FormsModule`  и  `ngModel`  в [Формы](guide/forms#ngModel).

Не забудьте импортировать  `FormsModule`  сделать  `[(ngModel)]`  доступны в следующем:

<code-example path="built-in-directives/src/app/app.module.ts" header="src/app/app.module.ts (FormsModule import)" region="import-forms-module"></code-example>


Вы можете достичь того же результата с отдельными привязками к
 `<input>` элементы   `value` имущества и  `input`  событие:

<code-example path="built-in-directives/src/app/app.component.html" region="without-NgModel" header="src/app/app.component.html"></code-example>

Чтобы упростить синтаксис,  `ngModel`  Директива скрывает детали за  `ngModel`  вход и  `ngModelChange`  выходные свойства:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModelChange" header="src/app/app.component.html"></code-example>

 `ngModel` данных устанавливает свойство value элемента и  `ngModelChange`  события
слушает изменения в значении элемента.

{@a ngmodel-and-value-accessors}
####  `NgModel` и значение аксессоров

Детали специфичны для каждого вида элементов и, следовательно,  `NgModel`  Директива работает только для элемента
поддерживается [ControlValueAccessor](api/forms/ControlValueAccessor)
который адаптирует элемент к этому протоколу.
Angular предоставляет средства *доступа значениям* к для всех основных элементов формы HTML и для
[Формы](guide/forms)руководство показывает, как привязать к ним.

Вы не можете подать заявку  `[(ngModel)]`  для нативного элемента или элемента
сторонний пользовательский компонент, пока не напишете подходящее значение аксессора. Для получения дополнительной информации см
документация по API [DefaultValueAccessor](https://angular.io/api/forms/DefaultValueAccessor).

Вам не нужен метод доступа к значениям для компонента Angular
вы пишете, потому что вы можете назвать значение и свойства события
в соответствии с базовым Angular [синтаксис двустороннего связывания](guide/template-syntax#two-way)
и пропустить  `NgModel`  целом.
 `sizer` в
[Двухсторонний Binding](guide/template-syntax#two-way)раздела является примером этой методики.

отдельный  `ngModel`  являются улучшением по сравнению с привязкой к
свойства элемента, но вы можете упростить привязку с помощью
одно объявление с использованием  `[(ngModel)]`  Синтаксис:

<code-example path="built-in-directives/src/app/app.component.html" region="NgModel-1" header="src/app/app.component.html"></code-example>

Эта  `[(ngModel)]`  может только _set_ привязанное к данным свойство.
Если вам нужно сделать что-то большее, вы можете написать расширенную форму;
например, следующее меняет  `<input>`  значение в верхний регистр:

<code-example path="built-in-directives/src/app/app.component.html" region="uppercase" header="src/app/app.component.html"></code-example>

Вот все изменения в действии, включая заглавные версии:

<div class="lightbox">
  <img src='generated/images/guide/built-in-directives/ng-model-anim.gif' alt="NgModel variations">
</div>

<hr/>

{@a structural-directives}

{@a built-in-structural-directives}
## Встроенные _структурные_ директивы

Структурные директивы отвечают за макет HTML.
Они формируют или изменяют структуру DOM, обычно добавляя, удаляя и манипулируя
элементы хоста, к которым они прикреплены.

Этот раздел представляет собой введение в общую встроенных структурных директивах:

* [  `NgIf`  ](guide/template-syntax#ngIf)условно создает или уничтожает подпредставления из шаблона.
* [  `NgFor`  ](guide/template-syntax#ngFor)повторять узел для каждого элемента в списке.
* [  `NgSwitch`  ](guide/template-syntax#ngSwitch)- набор директив, которые переключаются между альтернативными представлениями.

<div class="alert is-helpful">

Глубокие детали структурных директив описаны в
[Структурные директивы](guide/structural-directives)руководство
которая объясняет следующее:

* Почему ты
[ставьте перед именем директивы звездочку (\ *)](guide/structural-directives#the-asterisk--prefix).
* Используя [``](guide/structural-directives#ngcontainer "<ng-container>")
группировать элементы, когда для директивы нет подходящего хост-элемента.
* Как написать свою собственную структурную директиву.
* Это вы можете применить только [одна структурная директива](guide/structural-directives#one-per-element "one per host element") к элементу.

</div>

<hr/>

{@a ngIf}

{@a ngif}
### NgIf

Вы можете добавить или удалить элемент из DOM, применив  `NgIf`  директива
хост-элемент.
Привязать директиву к условному выражению, как  `isActive`  в этом примере.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Не забудьте звездочку (`*`) перед  `ngIf`  . Для получения дополнительной информации
на звездочку см [префикс звездочка (*)](guide/structural-directives#the-asterisk--prefix)раздел
[Структурные директивы](guide/structural-directives).

</div>

Когда  `isActive`  Выражение возвращает истинное значение,  `NgIf`  добавляет
 `ItemDetailComponent` для DOM.
Когда выражение ложное,  `NgIf`  удаляет  `ItemDetailComponent` 
из DOM, уничтожая этот компонент и все его подкомпоненты.


{@a show/hide-vs.-ngif}
#### Показать / скрыть против  `NgIf` 

Сокрытие элемента отличается от удаления его  `NgIf`.
Для сравнения в следующем примере показано, как управлять
видимость элемента с
[класс](guide/template-syntax#class-binding)или [стиль](guide/template-syntax#style-binding)привязки.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-3" header="src/app/app.component.html"></code-example>

Когда вы скрываете элемент, этот элемент и все его потомки остаются в DOM.
Все компоненты для этих элементов остаются в памяти и
Angular может продолжать проверять наличие изменений.
Вы могли бы удерживать значительные вычислительные ресурсы и снижать производительность
без необходимости.

 `NgIf` работает по-другому. когда  `NgIf`  есть  `false`, Angular удаляет элемент и его потомков из DOM.
Это уничтожает их компоненты, освобождая ресурсы, которые
приводит к лучшему пользовательскому опыту.

Если вы прячете большие деревья компонентов, подумайте  `NgIf`  как больше
эффективная альтернатива показу / сокрытию.

<div class="alert is-helpful">

Для получения дополнительной информации о  `NgIf`  и  `ngIfElse`, см. [документация API о NgIf](api/common/NgIf).

</div>

{@a guard-against-null}
#### Остерегайтесь нуля

Еще одно преимущество  `ngIf`  вы можете использовать его для защиты от нуля. Показать / скрыть
лучше всего подходит для очень простых случаев использования, поэтому, когда вам нужна охрана, выберите вместо  `ngIf`  . Angular выдаст ошибку, если вложенное выражение попытается получить доступ к свойству  `null`.

Следующее показывает  `NgIf`  охранять двух  `<div>`  s.
 `currentCustomer` имя отображается только при наличии  `currentCustomer`.
 `nullCustomer` не будет отображаться, пока он  `null`.

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2" header="src/app/app.component.html"></code-example>

<code-example path="built-in-directives/src/app/app.component.html" region="NgIf-2b" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Смотрите также
[Безопасный оператор навигации](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?.)«) ниже.

</div>
<hr/>

{@a ngFor}
{@a ngfor}
###  `NgFor` 

 `NgFor` - это директива повторителя - способ представления списка элементов.
Вы определяете блок HTML, который определяет, как должен отображаться отдельный элемент
а затем вы говорите Angular использовать этот блок в качестве шаблона для рендеринга каждого элемента в списке.
Текст, присвоенный  `*ngFor`  - это инструкция, которая управляет процессом повторителя.

Следующий пример показывает  `NgFor`  применяется к простой  `<div>`  . (Не забудьте звездочку (  `*`) перед  `ngFor`  .)

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

Не забудьте звездочку (`*`) перед  `ngFor`  . Для получения дополнительной информации
на звездочку см [префикс звездочка (*)](guide/structural-directives#the-asterisk--prefix)раздел
[Структурные директивы](guide/structural-directives).

</div>

Вы также можете подать  `NgFor`  для компонента, как в следующем примере.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-2" header="src/app/app.component.html"></code-example>

{@a microsyntax}

<div class="callout is-critical">
<header>*Для микросинтаксиса </header>

Строка, присвоенная  `*ngFor`  не является [шаблонное выражение](guide/template-syntax#template-expressions). Скорее
это *микросинтаксис*- маленький собственный язык, который интерпретирует Angular.
Строка `"let item of items"` средств:

> *Возьмите каждый предмет в  `items`  массив, храните его в локальном  `item`  переменная зацикливания и
сделать его доступным для шаблонного HTML для каждой итерации.*

Angular переводит эту инструкцию в  `<ng-template>`  вокруг элемента хоста
затем использует этот шаблон несколько раз, чтобы создать новый набор элементов и привязок для каждого  `item` 
в списке.
Для получения дополнительной информации о микросинтаксисе см. [Структурные директивы](guide/structural-directives#microsyntax)Руководство.

</div>


{@a template-input-variable}

{@a template-input-variables}

#### Шаблон входных переменных

 `let` ключевое слово раньше  `item`  создает входную переменную шаблона с именем  `item`.
 `ngFor` Директива перебирает  `items`  массив возвращаемый родительским компонентом  `items`  недвижимости
и устанавливает  `item`  для текущего элемента из массива во время каждой итерации.

Ссылка  `item`  пределах  `ngFor`  элемента хоста
а также внутри его потомков для доступа к свойствам элемента.
В следующем примере ссылки  `item`  первым в интерполяции
а затем переходит в привязку к  `item`  собственность  `<app-item-detail>`  компонент.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-1-2" header="src/app/app.component.html"></code-example>

Для получения дополнительной информации о входных переменных шаблона см
[Структурные директивы](guide/structural-directives#template-input-variable).

{@a ngfor-with-index}
####  `*ngFor ` с ` index` 

 `index` свойство  `NgFor` контекста директивы
возвращает нулевой индекс элемента в каждой итерации.
Вы можете захватить  `index`  во входной переменной шаблона и использовать его в шаблоне.

Следующий пример фиксирует  `index`  в переменной с именем  `i`  и отображает его с именем элемента.

<code-example path="built-in-directives/src/app/app.component.html" region="NgFor-3" header="src/app/app.component.html"></code-example>

<div class="alert is-helpful">

 `NgFor ` реализуется ` NgForOf` Директива . Узнайте больше о другом  `NgForOf`  контекста такие как  `last`, `even`,
и  `odd`  в [ссылка на API NgForOf](api/common/NgForOf).

</div>

{@a trackBy}
{@a ngfor-with-trackby}
#### *ngFor с  `trackBy` 

Если вы используете  `NgFor`  больших списков небольшое изменение одного элемента, например удаление или добавление элемента, может вызвать каскад манипуляций DOM. Например, повторный запрос к серверу может сбросить список со всеми новыми объектами элементов, даже если эти элементы ранее отображались. В этом случае Angular видит только новый список новых ссылок на объекты и не имеет другого выбора, кроме как заменить старые элементы DOM всеми новыми элементами DOM.

Вы можете сделать это более эффективным с  `trackBy`.
Добавьте метод к компоненту, который возвращает значение  `NgFor`  должен отслеживать.
В этом случае это значение героя  `id`  . Если  `id`  уже предоставлен
Angular отслеживает это и не перезапрашивает сервер для того же  `id`.

<code-example path="built-in-directives/src/app/app.component.ts" region="trackByItems" header="src/app/app.component.ts"></code-example>

В выражении микросинтаксиса установите  `trackBy`  к  `trackByItems()`.

<code-example path="built-in-directives/src/app/app.component.html" region="trackBy" header="src/app/app.component.html"></code-example>

Вот иллюстрация  `trackBy`  эффект.
«Сбросить элементы» создает новые элементы с тем же  `item.id`  s.
«Изменить идентификаторы» создает новые элементы с новыми  `item.id`  s.

* С нет  `trackBy`, обе кнопки запускают полную замену элемента DOM.
* С  `trackBy`, только меняя  `id`  запускает замену элемента.

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngfor-trackby.gif" alt="Animation of trackBy">
</div>


<div class="alert is-helpful">

Встроенные директивы используют только публичные API; то есть
они не имеют специального доступа к каким-либо частным API, к которым другие директивы не могут получить доступ.

</div>

<hr/>

{@a ngSwitch}
{@a the-ngswitch-directives}
##  `NgSwitch` Директивы

NgSwitch похож на JavaScript  `switch`  заявление.
Он отображает один элемент из нескольких возможных элементов в зависимости от состояния переключателя.
Angular помещает в DOM только выбранный элемент.
<!-- API Flagged -->
 `NgSwitch` на самом деле это набор из трех, взаимодействующих директив:
 `NgSwitch `, ` NgSwitchCase ` и ` NgSwitchDefault` как в следующем примере.

 <code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch" header="src/app/app.component.html"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/built-in-directives/ngswitch.gif" alt="Animation of NgSwitch">
</div>

 `NgSwitch` - это директива контроллера. Свяжите это с выражением, которое возвращает
*значение переключателя*, например,  `feature`  . Хотя  `feature`  Значение в этом
Например, строка представляет собой значение переключателя любого типа.

**Связываются с  `[ngSwitch]` **. Вы получите ошибку, если попытаетесь установить  `*ngSwitch`  потому что
 `NgSwitch` - это *атрибута* директива, а не *структурная* директива.
Вместо непосредственного прикосновения к DOM, он меняет поведение своих сопутствующих директив.

**Связываются с  `*ngSwitchCase`  и  `*ngSwitchDefault` **.
 `NgSwitchCase ` и ` NgSwitchDefault` Директивы являются _структурными_ директивами
потому что они добавляют или удаляют элементы из DOM.

*  `NgSwitchCase` добавляет свой элемент в DOM, когда его связанное значение равно значению переключателя, и удаляет его
его значение привязки, когда оно не равно значению переключателя.

*  `NgSwitchDefault` добавляет свой элемент в DOM, когда не выбрано  `NgSwitchCase`.

Директивы switch особенно полезны для добавления и удаления *элементов компонента*.
Этот пример переключается между четырьмя  `item`  компоненты определенные в  `item-switch.components.ts`  Файл.
Каждый компонент имеет  `item`   [входное свойство](guide/template-syntax#inputs-outputs "Input property")
который связан с  `currentItem`  родительского компонента.

Директивы switch также работают с собственными элементами и веб-компонентами.
Например, вы можете заменить  `<app-best-item>`  случай переключения со следующим.

<code-example path="built-in-directives/src/app/app.component.html" region="NgSwitch-div" header="src/app/app.component.html"></code-example>

<hr/>

{@a template-reference-variable}

{@a template-reference-variables--var-}

{@a ref-vars}

{@a ref-var}

{@a template-reference-variables-var}
## Шаблонные ссылочные переменные (`#var`)

**Опорный шаблон переменная** часто является ссылка на DOM элемент внутри шаблона.
Он также может ссылаться на директиву (которая содержит компонент), элемент [TemplateRef](api/core/TemplateRef)или <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components" title="MDN: Web Components">веб-компонент </a>.

Для демонстрации синтаксиса и фрагментов кода в этом разделе см. <live-example name="template-reference-variables">Пример шаблона справочных переменных </live-example>.


Используйте хэш-символ ( #) для объявления ссылочной переменной.
Следующая ссылочная переменная,  `#phone`, объявляет  `phone`  переменная на  `<input>`  элемент.

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-var" header="src/app/app.component.html"></code-example>

Вы можете ссылаться на переменную ссылки на шаблон в любом месте шаблона компонента.
Здесь  `<button>`  далее вниз по шаблону относится к  `phone`  переменная.

<code-example path="template-reference-variables/src/app/app.component.html" region="ref-phone" header="src/app/app.component.html"></code-example>

<h3 class="no-toc">Как ссылочная переменная получает свое значение </h3>

В большинстве случаев Angular устанавливает значение ссылочной переменной для элемента, для которого она объявлена.
В предыдущем примере  `phone`  относится к номеру телефона  `<input>`.
Обработчик нажатия кнопки пропускает  `<input>`  значение для компонента  `callPhone()`.

 `NgForm` Директива может изменить это поведение и установить значение в другое значение. В следующем примере переменная ссылки на шаблон  `itemForm`, появляется три раза в отдельности
по HTML.

<code-example path="template-reference-variables/src/app/app.component.html" region="ngForm" header="src/app/hero-form.component.html"></code-example>

Ссылочное значение itemForm без значения атрибута ngForm будет
[HTMLFormElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement).
Однако существует разница между Компонентом и Директивой в том, что  `Component` 
будут ссылаться без указания значения атрибута и  `Directive`  не будет
изменить неявную ссылку (то есть элемент).



Однако с  `NgForm`, `itemForm`  является ссылкой на [NgForm](api/forms/NgForm "API: NgForm")
директива с возможностью отслеживать значение и действительность каждого элемента управления в форме.

Родной  `<form>`  элемент не имеет  `form`  собственности, но  `NgForm`  Директива, которая позволяет отключить кнопку отправки
если  `itemForm.form.valid`  является недействительным и передает все дерево управления формой
к родительскому компоненту  `onSubmit()`.

<h3 class="no-toc">Замечания по ссылочной переменной шаблона </h3>

Переменная _reference_ шаблона (`#phone`) отличается от шаблона _input_ variable (`let phone`) такой как в [ `* ngFor` ](guide/template-syntax#template-input-variable).
Смотрите [_Structural Directives_](guide/structural-directives#template-input-variable)для получения дополнительной информации.

Область действия ссылочной переменной - весь шаблон. Поэтому не определяйте одно и то же имя переменной более одного раза в одном и том же шаблоне, так как значение времени выполнения будет непредсказуемым.

{@a alternative-syntax}
#### Альтернативный синтаксис

Вы можете использовать  `ref-`  Приставка альтернатива  `#`.
Этот пример объявляет  `fax`  переменная как  `ref-fax`  вместо  `#fax`.


<code-example path="template-reference-variables/src/app/app.component.html" region="ref-fax" header="src/app/app.component.html"></code-example>


<hr/>

{@a inputs-outputs}

{@a input-and-output-properties}
##  `@Input() ` и ` @Output()` свойства

 `@Input() ` и ` @Output()` позволяет Angular обмениваться данными между родительским контекстом
и дочерние директивы или компоненты.  `@Input()` доступно для записи
в то время как  `@Output()`  можно наблюдать.

Рассмотрим этот пример ребенка / родительских отношений:

```html
<parent-component>
  <child-component></child-component>
</parent-component>

```

Здесь  `<child-component>`  Селектор или дочерняя директива встроены
в пределах  `<parent-component>`, который служит дочерним контекстом.

 `@Input() ` и ` @Output()` действует как
API или интерфейс прикладного программирования ребенка
Компонент в том, что они позволяют ребенку
общаться с родителем. Думать о  `@Input()`  и  `@Output()`  как порты
или дверные проемы—  `@Input()`  - это вход в компонент, разрешающий данные
течь в то время как  `@Output()`  - это дверной проем компонента, позволяющий
дочерний компонент для отправки данных.

Этот раздел о  `@Input()`  и  `@Output()`  имеет свои <live-example name="inputs-outputs"></live-example>. Выделите следующие подразделы
ключевые моменты в примере приложения.

<div class="alert is-helpful">

{@a @input-and-output-are-independent}
####  `@Input() ` и ` @Output()` независимы

Хоть  `@Input()`  и  `@Output()`  часто появляются вместе в приложениях, которые вы можете использовать
их отдельно. Если вложенный
Компонент таков, что ему нужно только отправить данные своему родителю, вы бы этого не сделали
нужен  `@Input()`, только  `@Output()`  . Обратное также верно в том случае, если
ребенку нужно только получить данные от родителя, вам нужно только  `@Input()`.

</div>

{@a input}

{@a how-to-use-input}
## Как пользоваться  `@Input()` 

Использовать  `@Input()`  в дочернем компоненте или директиве, чтобы сообщить Angular
что свойство в этом компоненте может получить свое значение от своего родительского компонента.
Это помогает помнить, что поток данных с точки зрения
дочерний компонент. Так что  `@Input()`  позволяет вводить данные _into_
дочерний компонент из родительского компонента.


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input.svg" alt="Input data flow diagram">
</div>

Для иллюстрации использования  `@Input()`, редактировать эти части вашего приложения:

* Класс и шаблон дочернего компонента
* Класс родительского компонента и шаблон


{@a in-the-child}
### У ребенка

Чтобы использовать  `@Input()`  в классе дочерних компонентов, первый импорт
 `Input` а затем украсьте свойство  `@Input()`  :

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.ts" region="use-input" header="src/app/item-detail/item-detail.component.ts"></code-example>


В этом случае,  `@Input()`  украшает свойство <code class="no-auto-link">item</code>, которое имеет
тип  `string`, однако,  `@Input()`  могут иметь любой тип, например
 `number `, ` string `, ` boolean ` или ` object` . Значение для  `item`  будет получен из родительского компонента, который рассматривается в следующем разделе.

Далее в шаблоне компонента ребенка, добавьте следующее:

<code-example path="inputs-outputs/src/app/item-detail/item-detail.component.html" region="property-in-template" header="src/app/item-detail/item-detail.component.html"></code-example>



{@a in-the-parent}
### В родительском

Следующим шагом является привязка свойства в шаблоне родительского компонента.
В этом примере шаблон родительского компонента  `app.component.html`.

Во-первых, используйте селектор ребенка, здесь  `<app-item-detail>`, как директива внутри
шаблон родительского компонента. Затем используйте [свойство привязки](guide/template-syntax#property-binding)
привязать свойство ребенка к свойству родителя.

<code-example path="inputs-outputs/src/app/app.component.html" region="input-parent" header="src/app/app.component.html"></code-example>

Далее в классе родительского компонента  `app.component.ts`, значение для  `currentItem`  :

<code-example path="inputs-outputs/src/app/app.component.ts" region="parent-property" header="src/app/app.component.ts"></code-example>

С  `@Input()`, Angular передает значение для  `currentItem`  для ребенка, чтобы  `item`  отображается, как  `Television`.

Следующая диаграмма показывает эту структуру:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-diagram-target-source.svg" alt="Property binding diagram">
</div>

Цель в квадратных скобках,  `[]`, это свойство, которое вы украшаете
с  `@Input()`  в дочернем компоненте. Обязательный источник, часть
справа от знака равенства находятся данные этого родителя
Компонент переходит к вложенному компоненту.

Ключевым моментом является то, что при привязке к свойству дочернего компонента в родительском компоненте, то есть к чему
в квадратных скобках - вы должны
украсить имущество  `@Input()`  в дочернем компоненте.

<div class="alert is-helpful">

{@a onchanges-and-input}
####  `OnChanges ` и ` @Input()` 

Следить за изменениями на  `@Input()`, используйте
 `OnChanges`, один из Angular [хуков жизненного цикла](guide/lifecycle-hooks#onchanges).
 `OnChanges` специально разработан для работы со свойствами, которые имеют
 `@Input()` декоратор. См. Раздел [  `OnChanges`  ](guide/lifecycle-hooks#onchanges)руководства [Lifecycle Hooks](guide/lifecycle-hooks)для получения более подробной информации и примеров.

</div>

{@a output}

{@a how-to-use-output}
## Как пользоваться  `@Output()` 

Использовать  `@Output()`  в дочернем компоненте или директиве, из которого можно передавать данные
ребенок _out_ к родителю.

 `@Output()` обычно следует инициализировать в Angular [  `EventEmitter`  ](api/core/EventEmitter)со значениями, вытекающими из компонента как [события](#event-binding).


<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/output.svg" alt="Output diagram">
</div>

Так же, как с  `@Input()`, вы можете использовать  `@Output()` 
на свойстве дочернего компонента, но его тип должен быть
 `EventEmitter`.

 `@Output()` помечает свойство в дочернем компоненте как дверной проем
через которые данные могут передаваться от ребенка к родителю.
Затем дочерний компонент должен инициировать событие
Родитель знает, что что-то изменилось. Чтобы поднять событие
 `@Output()` работает рука об руку с  `EventEmitter`,
который является классом в  `@angular/core`  это ты
использовать для создания пользовательских событий.

Когда вы используете  `@Output()`, редактировать эти части вашего приложения:

* Класс и шаблон дочернего компонента
* Класс родительского компонента и шаблон


В следующем примере показано, как настроить  `@Output()`  у ребенка
компонент, который толкает данные, которые вы вводите в HTML  `<input>`  в массив в
родительский компонент.

<div class="alert is-helpful">

HTML-элемент  `<input>`  и Angular декоратор  `@Input()` 
разные. Эта документация о связи компонентов в Angular, поскольку она относится к  `@Input()`  и  `@Output()`  . Для получения дополнительной информации об элементе HTML  `<input>`  см. [Рекомендация W3C](https://www.w3.org/TR/html5/sec-forms.html#the-input-element).

</div>

{@a in-the-child}
### У ребенка

Этот пример показывает  `<input>`  где пользователь может ввести значение и нажмите  `<button>`  которая вызывает событие.  `EventEmitter` Затем передает данные в родительский компонент.

Во-первых, обязательно импортировать  `Output`  и  `EventEmitter` 
в классе компоненты ребенка:

```js
import { Output, EventEmitter } from '@angular/core';

```

Далее, еще в ребенке, украсить свойство с  `@Output()`  в классе компонентов.
Следующий пример  `@Output()`  вызывается  `newItemEvent`  и его тип
 `EventEmitter`, что означает, что это событие.


<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output" header="src/app/item-output/item-output.component.ts"></code-example>

Различные части вышеуказанной декларации являются следующими:

*  `@Output()` - функция декоратора, помечающая свойство как способ передачи данных от дочернего к родительскому
*  `newItemEvent` - имя  `@Output()` 
*  `EventEmitter<string> ` - ` @Output()` «сек Тип
*  `new EventEmitter<string>()` - сообщает Angular для создания нового генератора событий, и что данные, которые он генерирует, имеют тип string. Тип может быть любого типа, например  `number`, `boolean`  и так далее. Для получения дополнительной информации о  `EventEmitter`, см. [Документация по API EventEmitter](api/core/EventEmitter).

Затем создайте  `addNewItem()`  метод в том же классе компонентов:

<code-example path="inputs-outputs/src/app/item-output/item-output.component.ts" region="item-output-class" header="src/app/item-output/item-output.component.ts"></code-example>

 `addNewItem() ` использует ` @Output() `, ` newItemEvent`,
вызвать событие, в котором оно выдает значение пользователю
вводит в  `<input>`  . Другими словами, когда
пользователь нажимает кнопку добавления в пользовательском интерфейсе, ребенок сообщает родителю
о событии и передает эти данные родителю.

{@a in-the-childs-template}
#### В детском шаблоне

Шаблон ребенка имеет два элемента управления. Первый HTML  `<input>`  с
[ссылочная переменная шаблона](guide/template-syntax#ref-var),  `#newItem`,
где пользователь вводит имя элемента. Что бы ни печатал пользователь
в  `<input>`  сохраняется в  `#newItem`  переменная.

<code-example path="inputs-outputs/src/app/item-output/item-output.component.html" region="child-output" header="src/app/item-output/item-output.component.html"></code-example>

Второй элемент  `<button>` 
с [привязка события](guide/template-syntax#event-binding). Вы знаете это
привязка события, потому что часть слева равна
знак в скобках,  `(click)`.

 `(click)` событие привязано к  `addNewItem()`  в классе дочернего компонента, который
принимает в качестве аргумента независимо от значения  `#newItem`  есть.

Теперь дочерний компонент имеет  `@Output()` 
для отправки данных родителю и способ вызова события.
Следующий шаг в родителя.

{@a in-the-parent}
### В родительском

В этом примере родительский компонент  `AppComponent`, но вы можете использовать
любой компонент, в котором вы могли бы вкладывать ребенка.

 `AppComponent` в этом примере показывает список  `items` 
в массиве и метод для добавления дополнительных элементов в массив.

<code-example path="inputs-outputs/src/app/app.component.ts" region="add-new-item" header="src/app/app.component.ts"></code-example>

 `addItem()` принимает аргумент в форме строки
а затем толкает или добавляет эту строку в  `items`  массив.

{@a in-the-parents-template}
#### В родительском шаблоне

Затем в шаблоне родителя свяжите родительский шаблон
метод к событию ребенка. Поставьте дочерний селектор, здесь  `<app-item-output>`,
внутри родительского компонента
шаблон,  `app.component.html`.

<code-example path="inputs-outputs/src/app/app.component.html" region="output-parent" header="src/app/app.component.html"></code-example>

Привязка события,  `(newItemEvent)='addItem($event)'`, рассказывает
Angular, чтобы связать событие у ребенка,  `newItemEvent`, to
метод в родительском,  `addItem()`, и это событие, которое ребенок
уведомляет родителя о том, чтобы быть аргументом  `addItem()`.
Другими словами, именно здесь происходит фактическая передача данных.
 `$event` содержит данные, которые пользователь вводит в  `<input>` 
в дочернем шаблоне пользовательского интерфейса.

Теперь, чтобы увидеть  `@Output()`  работает, добавьте следующую строку в шаблон родителя:

```html
  <ul>
    <li *ngFor="let item of items">{{item}}</li>
  </ul>
  ```

 `*ngFor` перебирает элементы в  `items`  массив . Когда вы вводите значение в детской  `<input>`  и нажмите кнопку, дочерний элемент генерирует событие, а родительский  `addItem()`  значение в  `items`  массив и он отображает в списке.


{@a input-and-output-together}
##  `@Input() ` и ` @Output()`  вместе

Ты можешь использовать  `@Input()`  и  `@Output()`  на той же компоненте ребенка, как в следующем:

<code-example path="inputs-outputs/src/app/app.component.html" region="together" header="src/app/app.component.html"></code-example>

Цель,  `item`, который является  `@Input()`  в классе дочернего компонента, получает свое значение из свойства родителя,  `currentItem`  . Когда вы нажимаете «Удалить», дочерний компонент вызывает событие,  `deleteRequest`, который является аргументом для родителя  `crossOffItem()`.

Следующая диаграмма  `@Input()`  и  `@Output()`  на то же самое
ребенок компонент и показывает различные части каждого:

<div class="lightbox">
  <img src="generated/images/guide/inputs-outputs/input-output-diagram.svg" alt="Input/Output diagram">
</div>

Как показано на схеме, используйте входы и выходы вместе так же, как и их использование отдельно. Здесь дочерний селектор  `<app-input-output>`  с  `item`  и  `deleteRequest`  существо  `@Input()`  и  `@Output()` 
свойства в классе дочернего компонента. Недвижимость  `currentItem`  и метод  `crossOffItem()`  оба находятся в классе родительского компонента.

Комбинировать привязки свойств и событий, используя банан в коробке
синтаксис,  `[()]`, см. [Двухстороннее связывание](guide/template-syntax#two-way).

Подробнее о том, как они работают, см. В предыдущих разделах [Вход](guide/template-syntax#input)и [Выход](guide/template-syntax#output). Чтобы увидеть его в действии, см. <live-example name="inputs-outputs">Пример входов и выходов </live-example>.

{@a input-and-output-declarations}
##  `@Input() ` и ` @Output()` декларации

Вместо использования  `@Input()`  и  `@Output()`  декораторы
Чтобы объявить входы и выходы, вы можете определить
члены в  `inputs`  и  `outputs`  массивы
Директивы о метаданных, как в этом примере:

<code-example path="inputs-outputs/src/app/in-the-metadata/in-the-metadata.component.ts" region="metadata" header="src/app/in-the-metadata/in-the-metadata.component.ts"></code-example>

При объявлении  `inputs`  и  `outputs`  в  `@Directive`  и  `@Component` 
метаданные возможны, лучше использовать  `@Input()`  и  `@Output()` 
класс декораторов вместо этого, следующим образом :

<code-example path="inputs-outputs/src/app/input-output/input-output.component.ts" region="input-output" header="src/app/input-output/input-output.component.ts"></code-example>

См [Украсьте входные и выходные свойства](guide/styleguide#decorate-input-and-output-properties)секции
[Руководство по стилю](guide/styleguide)для деталей.



<div class="alert is-helpful">

Если вы получаете ошибку разбора шаблона при попытке использовать входы или выходы, но вы знаете, что
свойства действительно существуют, проверьте дважды
что ваши свойства помечены  `@Input()`  /  `@Output()`  или что вы объявили
их в  `inputs`  /  `outputs`  массива:

<code-example language="bash">
Uncaught Error: Template parse errors:
Can't bind to 'item' since it isn't a known property of 'app-item-detail'
</code-example>

</div>

{@a aliasing-io}

{@a aliasing-inputs-and-outputs}
## Сглаживание входов и выходов

Иногда публичное имя свойства ввода / вывода должно отличаться от внутреннего имени. Хотя это лучшая практика, чтобы избежать этой ситуации, Angular делает
предложить решение.

{@a aliasing-in-the-metadata}
### Псевдоним в метаданных

Псевдонимы ввода и вывода в метаданных с использованием двоеточия (`:`) Строка
имя директивы свойства на левом и публичном псевдониме справа:

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias" header="src/app/aliasing/aliasing.component.ts"></code-example>


{@a aliasing-with-the-@input/@output-decorator}
### Алиасинг с  `@Input()`  /  `@Output()`  декоратор

Вы можете указать псевдоним для имени свойства, передав псевдоним в  `@Input()`  /  `@Output()`  декоратор. Внутреннее имя остается как обычно.

<code-example path="inputs-outputs/src/app/aliasing/aliasing.component.ts" region="alias-input-output" header="src/app/aliasing/aliasing.component.ts"></code-example>


<hr/>

{@a expression-operators}

{@a template-expression-operators}
## Операторы шаблонных выражений

Язык шаблонных выражений Angular использует подмножество синтаксиса JavaScript, дополненное несколькими специальными операторами
для конкретных сценариев. Следующие разделы посвящены три из этих операторов:

* [труба](guide/template-syntax#pipe)
* [оператор безопасной навигации](guide/template-syntax#safe-navigation-operator)
* [ненулевой оператор утверждения](guide/template-syntax#non-null-assertion-operator)

{@a pipe}

{@a the-pipe-operator}
### Трубный оператор (`|`)

Результат выражения может потребовать некоторого преобразования, прежде чем вы будете готовы использовать его в привязке.
Например, вы можете отобразить число в виде валюты, изменить текст в верхний регистр или отфильтровать список и отсортировать его.

Каналы - это простые функции, которые принимают входное значение и возвращают преобразованное значение.
Их легко применять в выражениях шаблонов, используя оператор pipe (`|`)

<code-example path="template-expression-operators/src/app/app.component.html" region="uppercase-pipe" header="src/app/app.component.html"></code-example>

Оператор канала передает результат выражения слева функции функции справа.

Вы можете приковать выражения через несколько труб:

<code-example path="template-expression-operators/src/app/app.component.html" region="pipe-chain" header="src/app/app.component.html"></code-example>

И вы можете также [применить параметры](guide/pipes#parameterizing-a-pipe)к трубе:

<code-example path="template-expression-operators/src/app/app.component.html" region="date-pipe" header="src/app/app.component.html"></code-example>

 `json` трубы особенно полезно для отладки привязок:

<code-example path="template-expression-operators/src/app/app.component.html" region="json-pipe" header="src/app/app.component.html"></code-example>

Сгенерированный будет выглядеть примерно так:

<code-example language="json">
  { "name": "Telephone",
    "manufactureDate": "1980-02-25T05:00:00.000Z",
    "price": 98 }
</code-example>

<div class="alert is-helpful">

Трубный оператор имеет более высокий приоритет, чем троичный оператор (`?:`)
что значит `a ? b : c | x` анализируется как `a ? b : (c | x)`.
Тем не менее по ряду причин
оператор трубы не может использоваться без скобок в первом и втором операндах  `?:`.
Хорошей практикой является использование скобок и в третьем операнде.

</div>


<hr/>

{@a safe-navigation-operator}

{@a the-safe-navigation-operator-and-null-property-paths}
### Оператор безопасной навигации (`?`) и нулевые пути к свойствам

Angular оператор безопасной навигации,  `?`  охраняет против  `null`  и  `undefined` 
значения в путях свойств. Здесь он защищает от сбоя рендеринга вида, если  `item`  является  `null`.

<code-example path="template-expression-operators/src/app/app.component.html" region="safe" header="src/app/app.component.html"></code-example>

Если  `item`  является  `null`, представление по-прежнему отображается, но отображаемое значение пустое; Вы видите только «Имя элемента:», и ничего после него.

Рассмотрим следующий пример с  `nullItem`.

<code-example language="html">
  The null item name is {{nullItem.name}}
</code-example>

Так как нет безопасного оператора навигации и  `nullItem`  is  `null`, JavaScript и Angular бросили бы  `null`  ссылка ошибка и нарушить процесс рендеринга Angular:

<code-example language="bash">
  TypeError: Cannot read property 'name' of null.
</code-example>

Иногда, однако,  `null`  значения в свойстве
путь может быть в порядке при определенных обстоятельствах
особенно когда значение начинается с нуля, но данные поступают в конце концов.

С оператором безопасной навигации,  `?`, Angular прекращает вычислять выражение, когда оно попадает в первый  `null`  значение и отображает представление без ошибок.

Он отлично работает с длинными путями свойств, такими как  `a?.b?.c?.d`.


<hr/>

{@a non-null-assertion-operator}

{@a the-non-null-assertion-operator-}
### Оператор ненулевого утверждения (`!`)

Начиная с Typescript 2.0, вы можете применить [строгую проверку нуля](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html "Strict null checking in TypeScript") с помощью  `--strictNullChecks`  флаг. Затем TypeScript гарантирует, что ни одна переменная не была непреднамеренно  `null`  или  `undefined`.

В этом режиме типизированные переменные запрещают  `null`  и  `undefined`  по умолчанию . Проверка типов выдает ошибку, если вы оставляете переменную неназначенной или пытаетесь назначить  `null`  или  `undefined`  для переменной, тип которой запрещен  `null`  и  `undefined`.

Средство проверки типов также выдает ошибку, если не может определить, будет ли переменная  `null`  или  `undefined`  во время выполнения. Вы говорите, что средство проверки типов не выдает ошибку, применяя постфикс
[ненулевой оператор утверждения,!](http://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator "Non-null assertion operator").

Оператор Angular ненулевого утверждения,  `!`, служит той же цели в
Angular шаблон. Например, вы можете утверждать, что  `item`  свойства также определены.

<code-example path="template-expression-operators/src/app/app.component.html" region="non-null" header="src/app/app.component.html"></code-example>

Когда Angular компилятор превращает ваш шаблон в машинописном код,
это мешает TypeScript сообщать, что  `item.color`  может быть  `null`  или  `undefined`.

В отличие от [_safe навигации operator_](guide/template-syntax#safe-navigation-operator "Safe navigation operator (?)«),
Оператор утверждения ненулевого не остерегаться  `null`  или  `undefined`.
Скорее, он говорит контролеру типов TypeScript приостановить строгий  `null`  проверяет определенное выражение свойства.

Оператор ненулевого утверждения,  `!`, является необязательным, за исключением того, что вы должны использовать его при включении строгих нулевых проверок.

<a href="#top-of-page">вернуться к началу </a>

<hr/>

{@a built-in-template-functions}

## Встроенные функции шаблона

{@a any-type-cast-function}

{@a the-$any-type-cast-function}
###  `$any()` Функция приведения типа

Иногда выражение привязки вызывает ошибку типа во время [компиляция AOT](guide/aot-compiler)и невозможно полностью определить тип.
Чтобы отключить ошибку, вы можете использовать  `$any()`  Функция для приведения
выражение в [ `типа any` ](http://www.typescriptlang.org/docs/handbook/basic-types.html#any)как показано в следующем примере:

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-1" header="src/app/app.component.html"></code-example>

Когда Angular компилятор превращает этот шаблон в машинописном код,
это мешает TypeScript сообщать, что  `bestByDate`  не является членом  `item` 
объект, когда он запускает проверку типа в шаблоне.

 `$any()` Функция приведения также работает с  `this`  разрешает доступ к необъявленным членам
компонент.

<code-example path="built-in-template-functions/src/app/app.component.html" region="any-type-cast-function-2" header="src/app/app.component.html"></code-example>

 `$any()` Функция приведения работает в любом месте в выражении привязки, где допустим вызов метода.

{@a svg-in-templates}
## SVG в шаблонах

Можно использовать SVG в качестве допустимых шаблонов в Angular. Весь синтаксис шаблона ниже
применимо как к SVG, так и к HTML. Узнайте больше в SVG [1.1](https://www.w3.org/TR/SVG11/)и
[2.0](https://www.w3.org/TR/SVG2/)технические характеристики.

Почему вы используете SVG в качестве шаблона, а не просто добавляете его в качестве изображения в свое приложение?

Когда вы используете SVG в качестве шаблона, вы можете использовать директивы и привязки, как в HTML
шаблоны. Это означает, что вы сможете динамически генерировать интерактивную графику.

Обратитесь к образцу коду ниже для примера синтаксиса:

<code-example path="template-syntax/src/app/svg.component.ts" header="src/app/svg.component.ts"></code-example>

Добавьте следующий код к вашему  `svg.component.svg`  файл:

<code-example path="template-syntax/src/app/svg.component.svg" header="src/app/svg.component.svg"></code-example>

Здесь вы можете увидеть использование  `click()`  привязка события и синтаксис привязки свойства
(`[attr.fill]="fillColor"`).
