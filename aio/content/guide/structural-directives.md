{@a structural-directives}
# Структурные директивы

<style>
  h4 {font-size: 17px !important; text-transform: none !important;}
  .syntax { font-family: Consolas, 'Lucida Sans', Courier, sans-serif; color: black; font-size: 85%; }

</style>



В этом руководстве рассказывается, как Angular манипулирует DOM **структурными директивами** и
как вы можете написать свои собственные структурные директивы, чтобы сделать то же самое.

Попробуйте <live-example></live-example>.


{@a definition}



{@a what-are-structural-directives}
## Каковы структурные директивы?

Структурные директивы отвечают за макет HTML.
Они формируют или изменяют структуру DOM _, обычно добавляя, удаляя или манипулируя
элементы.

Как и в случае с другими директивами, вы применяете структурную директиву к элементу _host_.
Затем директива делает то, что должна делать с этим элементом хоста и его потомками.

Структурные директивы легко распознать.
Звездочка ( *) предшествует имени атрибута директивы, как в этом примере.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif)" region="ngif"></code-example>



Нет скобок. Нет скобок. Только  `*ngIf`  установлено в строку.

Из этого руководства вы узнаете, что [звездочка (*) - это условное обозначение](guide/structural-directives#asterisk)
и строка является [_microsyntax_](guide/structural-directives#microsyntax)а не обычным
[шаблонное выражение](guide/template-syntax#template-expressions).
Angular Desugars это обозначение в размеченной  `<ng-template>`  который окружает
элемент host и его потомки.
Каждая структурная директива делает что-то свое с этим шаблоном.

Три из общих, встроенных в структурном directives- [NgIf](guide/template-syntax#ngIf),
[NgFor](guide/template-syntax#ngFor)и [NgSwitch ...](guide/template-syntax#ngSwitch)- есть
описано в руководстве [_Template Syntax_](guide/template-syntax)и встречается в примерах по всей документации Angular.
Вот пример из них в качестве шаблона:


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (built-in)" region="built-in"></code-example>



Это руководство не повторяет, как их использовать. Но это объясняет, как они работают
и как [написать свою](guide/structural-directives#unless)структурную директиву.


<div class="callout is-helpful">



<header>
  Директивное правописание
</header>



В этом руководстве вы увидите директиву, записанную как в _UpperCamelCase_, так и в _lowerCamelCase_.
Вы уже видели  `NgIf`  и  `ngIf`.
Есть причина.  `NgIf`  ссылается на директиву _class_;
 `ngIf` ссылается на _attribute name_ директивы.

Директива _class_ записана в _UpperCamelCase_ (`NgIf`).
_Attribute name_ директивы пишется в _lowerCamelCase_ (`ngIf`).
Руководство ссылается на директиву _class_, когда говорит о ее свойствах и о том, что делает директива.
Руководство ссылается на _attribute name_ при описании как
вы применяете директиву к элементу в шаблоне HTML.


</div>



<div class="alert is-helpful">



Есть два других вида Angular директив, широко описаны в другом месте:
(1) компоненты и (2) атрибутные директивы.

*Компонент* управляет область HTML в виде нативного HTML элемента.
Технически это директива с шаблоном.

[* Атрибут* директива](guide/attribute-directives)изменяет внешний вид или поведение
элемента, компонента или другой директивы.
Например, встроенная [  `NgStyle`  ](guide/template-syntax#ngStyle)директива
изменяет несколько стилей элемента одновременно.

Вы можете применить много директив _attribute_ к одному элементу хоста.
Вы можете [только применить одну](guide/structural-directives#one-per-element)директиву _structural_ к элементу хоста.


</div>



{@a ngIf}



{@a ngif-case-study}
## NgIf тематическое исследование

 `NgIf` - это самая простая структурная директива и самая простая для понимания.
Он принимает логическое выражение и заставляет весь кусок DOM появляться или исчезать.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-true)" region="ngif-true"></code-example>



 `ngIf` Директива не скрывает элементы с помощью CSS. Он добавляет и удаляет их физически из DOM.
Подтвердите этот факт, используя инструменты разработчика браузера для проверки DOM.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/element-not-in-dom.png' alt="ngIf=false element not in DOM">
</div>



Верхний абзац находится в DOM. Внизу, заброшенный абзац нет;
на его месте комментарий о «привязках» (подробнее об этом [позже](guide/structural-directives#asterisk)).

Когда условие ложно,  `NgIf`  удаляет его хозяина элемент из DOM,
отсоединяет его от событий DOM (вложений, которые он сделал)
отсоединяет компонент от обнаружения Angular изменений и уничтожает его.
Узлы компонента и DOM могут быть собраны мусором и освободить память.

{@a why-*remove*-rather-than-*hide*}
### Зачем *удалять,* а не *скрывать*?

Директива может скрыть нежелательный абзац, установив его  `display`  стиль  `none`.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (display-none)" region="display-none"></code-example>



Пока невидимый, элемент остается в DOM.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/element-display-in-dom.png' alt="hidden element still in DOM">
</div>



Разница между сокрытием и удалением не имеет значения для простого абзаца.
Имеет значение, когда элемент хоста подключен к ресурсоемкому компоненту.
Поведение такого компонента продолжается даже тогда, когда оно скрыто.
Компонент остается подключенным к своему элементу DOM. Он продолжает слушать события.
Angular продолжает проверять изменения, которые могут повлиять на привязки данных.
Что бы ни делал компонент, он продолжает делать.

Несмотря на то, что этот компонент и невидимые компоненты невидимы, они связывают ресурсы.
Производительность и нагрузка на память могут быть значительными, скорость отклика может ухудшиться, и пользователь ничего не видит.

С положительной стороны, показ элемента снова быстро.
Предыдущее состояние компонента сохраняется и готово к отображению.
Компонент не инициализируется повторно - операция, которая может быть дорогой.
Так что скрываться и показывать иногда бывает правильно.

Но в отсутствие веской причины держать их рядом
Ваше предпочтение должно состоять в том, чтобы удалить элементы DOM, которые пользователь не может видеть
и восстановить неиспользованные ресурсы со структурной директивой, такой как  `NgIf`.

**Эти же соображения применимы к любой структурной директиве, встроенной или настраиваемой.**
Прежде чем применять структурную директиву, вы можете на минуту остановиться
рассмотреть последствия добавления и удаления элементов, а также создания и уничтожения компонентов.


{@a asterisk}



{@a the-asterisk--prefix}
## Звездочка (*) префикс

Конечно, вы заметили asterisk (*) префикс к имени директивы
и задавался вопросом, зачем это нужно и для чего это нужно.

Вот  `*ngIf`  отображается имя героя, если  `hero`  существует.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (asterisk)" region="asterisk"></code-example>



Звездочка - это «синтаксический сахар» для чего-то более сложного.
Внутри Angular переводит  `*ngIf`  _attribute_ в  `<ng-template>`  _element_, обернутый вокруг элемента host, вот так.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-template)" region="ngif-template"></code-example>



*  `*ngIf` директива перенесена в  `<ng-template>`  элемент где он стал привязкой свойства,  `[ngIf]`.
* Остаток от  `<div>`, включая атрибут class, перемещен внутри  `<ng-template>`  элемент.

Первая форма фактически не отображается, в DOM попадает только готовый продукт.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/hero-div-in-dom.png' alt="hero div in DOM">
</div>



Angular расход  `<ng-template>`  Содержимое во время его фактического отображения и
заменил  `<ng-template>`  с диагностическим комментарием.

[  `NgFor`  ](guide/structural-directives#ngFor)и [ ` NgSwitch ... ` ](guide/structural-directives#ngSwitch)директивы по той же схеме.


{@a ngFor}



{@a inside-ngfor}
## Внутри _*ngFor_

Angular трансформация  `*ngFor`  аналогичным образом из asterisk (*синтаксиса) в  `<ng-template>`  _element_.

Вот полнофункциональное приложение  `NgFor`, написанные в обоих направлениях:


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (inside-ngfor)" region="inside-ngfor"></code-example>



Это явно сложнее, чем  `ngIf`  и правильно.
 `NgFor` Директива имеет больше возможностей, как обязательных, так и необязательных, чем  `NgIf`  показано в этом руководстве.
Как минимум  `NgFor`  нужна циклическая переменная (`let hero`) и список (`heroes`).

Вы включаете эти функции в строке, назначенной  `ngFor`, который вы пишете в Angular's [микросинтаксис](guide/structural-directives#microsyntax).


<div class="alert is-helpful">



Все _вне_  `ngFor`  строка остается с элементом host
(`<div>`) как он движется внутри  `<ng-template>`.
В этом примере  `[ngClass]="odd"`  пребывание на  `<div>`.


</div>



{@a microsyntax}


## Микросинтаксис

Микросинтаксис Angular позволяет вам сконфигурировать директиву в виде удобной компактной строки.
Синтаксический анализатор microsyntax преобразует эту строку в атрибуты  `<ng-template>`  :

*  `let` ключевое слово объявляет [переменную ввода _template_](guide/structural-directives#template-input-variable)
что вы ссылаетесь в шаблоне. Входные переменные в этом примере  `hero`, `i`  и  `odd`.
Парсер переводит `let hero `, ` let i`, и `let odd` в переменных с именем
 `let-hero `, ` let-i`, и  `let-odd`.

* Заголовок синтаксического анализатора microsyntax регистрирует все директивы и ставит перед ними префиксы
имя атрибута, например  `ngFor`  . Например,  `ngFor`  входных свойств
 `of ` и ` trackBy`, стать  `ngForOf`  и  `ngForTrackBy`  соответственно.
Вот как директива узнает, что список  `heroes`  и функция отслеживания  `trackById`.

* Как  `NgFor`  Директива проходит по списку, она устанавливает и сбрасывает свойства своего собственного объекта _context_.
Эти свойства могут включать, но не ограничиваются,  `index`, `odd`, а особая собственность
названный  `$implicit`.

*  `let-i ` и ` let-odd` переменные были определены как `let i=index ` и ` let odd=odd`.
Angular устанавливает их в текущее значение контекста  `index`  и  `odd`  свойства.

* Свойство context для  `let-hero`  не указан.
Предполагаемый источник неявный.
Angular комплекты  `let-hero`  значение контекста  `$implicit`  свойство
который  `NgFor`  инициализирован с героем для текущей итерации.

* [ `Руководство API NgFor` ](api/common/NgForOf "API: NgFor")
описывает дополнительные  `NgFor`  свойства директивы и свойства контекста.

*  `NgForOf` Директива реализует  `NgFor`  . Узнайте больше о дополнительных  `NgForOf`  директивы и свойства контекста в [ссылка на API NgForOf](api/common/NgForOf).

{@a writing-your-own-structural-directives}
### Написание собственных структурных директив

Эти механизмы микросинтаксиса также доступны вам, когда вы пишете свои собственные структурные директивы.
Например, микросинтаксис в Angular позволяет писать `<div *ngFor="let item of items">{{item}}</div>` 
вместо того `<ng-template ngFor let-item [ngForOf]="items"><div>{{item}}</div></ng-template>`.
В следующих разделах содержится подробная информация об ограничениях, грамматике,
и перевод микросинтаксиса.

{@a constraints}
### Ограничения

Microsyntax должны отвечать следующим требованиям:

- Он должен быть известен заранее, чтобы IDE могли его проанализировать, не зная семантики директивы или того, какие директивы присутствуют.
- Он должен преобразовываться в атрибуты ключ-значение в DOM.

{@a grammar}
### Грамматика

Когда вы пишете свои собственные структурные директивы, используйте следующую грамматику:

```
*:prefix="(:let | :expression) (';' | ',')? (:let | :as | :keyExp)*"
```

В следующих таблицах описана каждая часть грамматики микросинтаксиса.

<!-- What should I put in the table headers? -->

<table>
  <tr>
    <th></th>
    <th></th>
  </tr>
  <tr>
    <td><code>prefix</code></td>
    <td>Ключ атрибута HTML </td>
  </tr>
  <tr>
    <td><code>key</code></td>
    <td>Ключ атрибута HTML </td>
  </tr>
  <tr>
    <td><code>local</code></td>
    <td>имя локальной переменной, используемой в шаблоне </td>
  </tr>
  <tr>
    <td><code>export</code></td>
    <td>значение экспортируется директивой под заданным именем </td>
  </tr>
  <tr>
    <td><code>expression</code></td>
    <td>Стандартное Angular выражение </td>
  </tr>
</table>

<!-- The items in this table seem different. Is there another name for how we should describe them? -->
<table>
  <tr>
    <th></th>
  </tr>
  <tr>
    <td colspan="3"><code>keyExp = :key ":"? :expression ("as" :local)? ";"? </code></td>
  </tr>
  <tr>
    <td colspan="3"><code>let = "let" :local "=" :export ";"?</code></td>
  </tr>
  <tr>
    <td colspan="3"><code>as = :export "as" :local ";"?</code></td>
  </tr>
</table>


{@a translation}
### Перевод

Microsyntax переводится в нормальный синтаксис связывания следующим образом :

<!-- What to put in the table headers below? Are these correct?-->
<table>
  <tr>
    <th>Микросинтаксис </th>
    <th>Перевод </th>
  </tr>
  <tr>
    <td><code>prefix</code>и голый <code>expression</code></td>
    <td><code>[prefix]="expression"</code></td>
  </tr>
  <tr>
    <td><code>keyExp</code></td>
    <td><code>[prefixKey] "expression"
    (let-prefixKey="export") </code>
    <br />
    Обратите внимание, что <code>prefix</code>
    добавлен в <code>key</code>
    </td>
  </tr>
  <tr>
    <td><code>let</code></td>
    <td><code>let-local="export"</code></td>
  </tr>
</table>

{@a microsyntax-examples}
### Примеры микросинтаксиса

В следующей таблице показано, как Angular desugars микросинтаксис.

<table>
  <tr>
    <th>Микросинтаксис </th>
    <th>Desugared </th>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3]"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngFor="let item of [1,2,3] as items; trackBy: myTrack; index as i"</code></td>
    <td><code>&lt;ng-template ngFor let-item [ngForOf]="[1,2,3]" let-items="ngForOf" [ngForTrackBy]="myTrack" let-i="index"&gt;</code>
    </td>
  </tr>
  <tr>
    <td><code>*ngIf="exp"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp"&gt;</code></td>
  </tr>
  <tr>
    <td><code>*ngIf="exp as value"</code></td>
    <td><code>&lt;ng-template [ngIf]="exp" let-value="ngIf"&gt;</code></td>
  </tr>
</table>

Изучая
[исходный код для  `NgIf` ](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_if.ts "Source: NgIf")
и [  `NgForOf`  ](https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts "Source: NgForOf")
это отличный способ узнать больше.


{@a template-input-variable}


{@a template-input-variables}


{@a template-input-variable}
## Шаблон входной переменной

Входная переменная _template_ - это переменная, значение которой вы можете ссылаться на _within_ отдельного экземпляра шаблона.
В этом примере есть несколько таких переменных:  `hero`, `i`  и  `odd`.
Всем предшествует ключевое слово  `let`.

Входная переменная _template_ является **_не_** такой же, как
[Шаблон переменной _reference_](guide/template-syntax#ref-vars),
ни _семантически_, ни _синтаксически_.

Вы объявляете переменную шаблона _input_, используя  `let`  ключевое слово (`let hero`).
Область действия переменной ограничена одним экземпляром повторяющегося шаблона.
Вы можете снова использовать то же имя переменной в определении других структурных директив.

Вы объявляете переменную _reference_ шаблона, добавляя к имени переменной префикс  `#`  (`#var`)
Переменная _reference_ ссылается на связанный с ней элемент, компонент или директиву.
Это может быть доступно _anywhere_ в шаблоне _entire_.

Имена переменных шаблонов _input_ и _reference_ имеют свои собственные пространства имен.  `hero ` в ` let hero` никогда не бывает прежним
переменная как  `hero`  объявлен  `#hero`.


{@a one-per-element}


{@a one-structural-directive-per-host-element}
## Одна структурная директива на элемент хоста

Когда-нибудь вам захочется повторить блок HTML, но только когда определенное условие выполнено.
Вы будете _try_ поставить оба  `*ngFor`  и  `*ngIf`  на том же элементе хоста.
Angular не позволит вам. Вы можете применить только одну _structural_ директиву к элементу.

Причина простота. Структурные директивы могут делать сложные вещи с элементом host и его потомками.
Когда две директивы претендуют на один и тот же хост-элемент, какая из них имеет приоритет?
Который должен идти первым,  `NgIf`  или  `NgFor`  ? Может ли  `NgIf`  отменить эффект  `NgFor`  ?
Если это так (и похоже, что так и должно быть), как Angular должен обобщать возможность отмены для других структурных директив?

На эти вопросы нет простых ответов. Запрещение нескольких структурных директив делает их спорными.
Для этого варианта использования есть простое решение:  `*ngIf`  на элементе контейнера, который оборачивает  `*ngFor`  элемент.
Один или оба элемента могут быть [  `ng-container`  ](guide/structural-directives#ngcontainer)поэтому вам не нужно вводить дополнительные уровни HTML.


{@a ngSwitch}



{@a inside-ngswitch-directives}
## Внутри _NgSwitch_ директив

Angular _NgSwitch_ на самом деле представляет собой набор взаимодействующих директив:  `NgSwitch`, `NgSwitchCase`  и  `NgSwitchDefault`.

Вот пример.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngswitch)" region="ngswitch"></code-example>



Значение переключателя присвоено  `NgSwitch`  (`hero.emotion`) определяет какой
(если есть) отображаются случаи переключения.

 `NgSwitch` Сам не является структурной директивой.
Это директива _attribute_, которая управляет поведением двух других директив switch.
Вот почему ты пишешь  `[ngSwitch]`, никогда  `*ngSwitch`.

 `NgSwitchCase ` и ` NgSwitchDefault` _are_ структурные директивы.
Вы присоединяете их к элементам, используя asterisk (*префикс).
 `NgSwitchCase` отображает свой хост-элемент, когда его значение соответствует значению переключателя.
 `NgSwitchDefault` отображает свой хост-элемент, когда нет родного брата  `NgSwitchCase`  соответствует значению переключателя.


<div class="alert is-helpful">



Элемент, к которому вы применяете директиву, является ее элементом _host_.
 `<happy-hero>` - элемент хозяина для счастливого  `*ngSwitchCase`.
 `<unknown-hero>` является основным элементом для  `*ngSwitchDefault`.


</div>



Как и в случае с другими структурными директивами,  `NgSwitchCase`  и  `NgSwitchDefault` 
может быть выведен в  `<ng-template>`  Форма элемента.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngswitch-template)" region="ngswitch-template"></code-example>



{@a prefer-asterisk}


{@a prefer-the-asterisk--syntax}
## Предпочитаю звездочки (*синтаксис).

звездочки (*Синтаксис) более понятен, чем десагаред.
Используйте [<ng-container>](guide/structural-directives#ng-container)когда нет ни одного элемента
разместить директиву.

В то время как редко хороший повод, чтобы применить структурную директиву шаблона _attribute_ или _element_ формы
все еще важно знать, что Angular создает  `<ng-template>`  и понять, как он работает.
Вы будете ссылаться на  `<ng-template>`  когда вы [напишите свою собственную структурную директиву](guide/structural-directives#unless).


{@a template}


{@a the-ng-template}
## The *&lt;ng-template&gt;*

<Ng-template> - это Angular элемент для рендеринга HTML.
Он никогда не отображается напрямую.
На самом деле, перед рендерингом представления, Angular _replaces_ the  `<ng-template>`  и его содержимое с комментарием.

Если нет структурной директивы, и вы просто заключаете некоторые элементы в  `<ng-template>`,
эти элементы исчезают.
Это судьба середины "Бедро!" в фразе «Бедро! Бедро! Ура!».


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (template-tag)" region="template-tag"></code-example>



Angular стирает середину «Hip!», Оставляя приветствие чуть менее восторженным.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/template-rendering.png' alt="template tag rendering">
</div>



Структурная директива ставит  `<ng-template>`  для работы
как вы увидите, когда вы [напишите свою собственную структурную директиву](guide/structural-directives#unless).


{@a ngcontainer}


{@a ng-container}



{@a group-sibling-elements-with-&ltng-container}
## Сгруппируйте одноуровневые элементы с помощью <ng-container>

Часто есть элемент _root_, который может и должен содержать структурную директиву.
Элемент списка (`<li>`) является типичным хост-элементом  `NgFor`  репитера.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngfor-li)" region="ngfor-li"></code-example>



Если элемент host отсутствует, вы обычно можете обернуть содержимое в собственный элемент контейнера HTML
такой как  `<div>`  и приложите директиву к этой оболочке.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif)" region="ngif"></code-example>



Представляем другой элемент контейнера - обычно  `<span>`  или  `<div>`  - к
Группировка элементов под одним _root_ обычно безвредна.
_ Обычно ... но не всегда.

Элемент группировки может нарушить внешний вид шаблона из-за стилей CSS
не ожидайте и не приспособьте новый макет.
Например, предположим, что у вас есть следующий макет абзаца.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-span)" region="ngif-span"></code-example>



У вас также есть правило стиля CSS, которое применяется к  `<span>`  пределах  `<p>`  aragraph.


<code-example path="structural-directives/src/app/app.component.css" header="src/app/app.component.css (p-span)" region="p-span"></code-example>



Построенный абзац выглядит странно.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/bad-paragraph.png' alt="spanned paragraph with bad style">
</div>



 `p span` Стиль, предназначенный для использования в других местах, был непреднамеренно применен здесь.

Другая проблема: некоторые элементы HTML требуют, чтобы все непосредственные потомки были определенного типа.
Например,  `<select>`  элемент требует  `<option>`  детей.
Вы не можете обернуть _options_ в условном  `<div>`  или  `<span>`.

Когда вы попробуете это


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (select-span)" region="select-span"></code-example>



раскрывающийся список пуст.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/bad-select.png' alt="spanned options don't work">
</div>



Браузер не будет отображать  `<option>`  пределах  `<span>`.

{@a ng-container-to-the-rescue}
### <ng-container> на помощь

Angular  `<ng-container>`  - это группирующий элемент, который не влияет на стили или макет
потому что Angular не помещает его в DOM_.

Вот снова условный абзац, на этот раз используя  `<ng-container>`.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (ngif-ngcontainer)" region="ngif-ngcontainer"></code-example>



Это делает правильно.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/good-paragraph.png' alt="ngcontainer paragraph with proper style">
</div>



Теперь условно исключить _select_  `<option>`  с  `<ng-container>`.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (select-ngcontainer)" region="select-ngcontainer"></code-example>



Раскрывающийся список работает правильно.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/select-ngcontainer-anim.gif' alt="ngcontainer options work properly">
</div>

<div class="alert is-helpful">

**Примечание.** Помните, что директива ngModel определена как часть Angular FormsModule, и вам необходимо включить FormsModule в раздел import: [...] метаданных модуля Angular, в котором вы хотите его использовать.

</div>


 `<ng-container>` - это синтаксический элемент, распознаваемый анализатором Angular.
Это не директива, компонент, класс или интерфейс.
Это больше похоже на фигурные скобки в JavaScript  `if`  -блок:


<code-example language="javascript">
  if (someCondition) {
    statement1;
    statement2;
    statement3;
  }

</code-example>



Без этих скобок JavaScript будет выполнять только первый оператор
когда вы собираетесь условно выполнить их все как один блок.
 `<ng-container>` удовлетворяет аналогичную потребность в шаблонах Angular.


{@a unless}



{@a write-a-structural-directive}
## Написать структурную директиву

В этом разделе вы пишете  `UnlessDirective`  структурная директива
это противоположно  `NgIf`.
 `NgIf` отображает содержимое шаблона, когда условие  `true`.
 `UnlessDirective` отображает содержимое, когда условие ***ложно***.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless-1)" region="appUnless-1"></code-example>



Создание директивы похоже на создание компонента.

* Импортировать  `Directive`  декоратор (вместо  `Component`  декоратор).

* Импортировать  `Input`, `TemplateRef`  и  `ViewContainerRef`  Символы ; они понадобятся вам для _any_ структурной директивы.

* Примените декоратор к директивному классу.

* Установите CSS*селектор атрибута, * который идентифицирует директиву при применении к элементу в шаблоне.

Вот как вы можете начать:


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (skeleton)" region="skeleton"></code-example>



_Selector_ директивы обычно является директивы **именем атрибута** в квадратных скобках,  `[appUnless]`.
Скобки определяют CSS
<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors" title="MDN: Attribute selectors">Селектор атрибутов </a>.

Директива _attribute name_ должна быть записана в _lowerCamelCase_ и начинаться с префикса.
Не использовать  `ng`  . Этот префикс принадлежит Angular.
Выберите что-то короткое, что подходит вам или вашей компании.
В этом примере префикс  `app`.


Имя _class_ директивы оканчивается на  `Directive`  согласно [руководство по стилю](guide/styleguide#02-03 "Angular Style Guide").
Собственные директивы Angular этого не делают.

{@a templateref-and-viewcontainerref}
### _TemplateRef_ и _ViewContainerRef_

Простая структурная директива, подобная этой, создает
[_embedded view_](api/core/EmbeddedViewRef "API: EmbeddedViewRef")
из Angular  `<ng-template>`  и вставляет это представление в
[_view container_](api/core/ViewContainerRef "API: ViewContainerRef")
рядом с оригиналом директивы  `<p>`  хост-элемент.

Вы приобретете  `<ng-template>`  Содержимое с
[  `TemplateRef`  ](api/core/TemplateRef "API: TemplateRef")
и получить доступ к _view контейнеру через
[  `ViewContainerRef`  ](api/core/ViewContainerRef "API: ViewContainerRef").

Вы вводите оба в конструктор директивы как частные переменные класса.


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (ctor)" region="ctor"></code-example>



{@a the-appunless-property}
### Свойство _appUnless_

Потребитель директивы ожидает связать истинное / ложное условие с `[appUnless]`.
Это означает, что директива нуждается в `appUnless` недвижимость, украшенная `@Input`


<div class="alert is-helpful">



Читать о `@Input` в [_Template Syntax_](guide/template-syntax#inputs-outputs)руководство.


</div>



<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (set)" region="set"></code-example>



Angular набор `appUnless` всякий раз, когда значение условия изменяется.
Поскольку `appUnless` работает, ему нужен установщик.

* Если условие falsy и вид не был создан ранее,
скажите _view container_, чтобы создать _embedded view_ из шаблона.

* Если условие truthy и в данный момент отображается вид,
очистить контейнер, который также уничтожает вид.

Никто не читает `appUnless` поэтому оно не нуждается в геттере.

Заполненная директива код выглядит следующим образом :


<code-example path="structural-directives/src/app/unless.directive.ts" header="src/app/unless.directive.ts (excerpt)" region="no-docs"></code-example>



Добавьте эту директиву к `declarations` массив модуля AppModule.

Затем создайте HTML, чтобы попробовать.


<code-example path="structural-directives/src/app/app.component.html" header="src/app/app.component.html (appUnless)" region="appUnless"></code-example>



Когда `condition` ложное, появляется верхний (A) абзац, а нижний (B) абзац исчезает.
Когда `condition` верно, верхний абзац (A) удаляется, а нижний (B) абзац появляется.


<div class="lightbox">
  <img src='generated/images/guide/structural-directives/unless-anim.gif' alt="UnlessDirective in action">
</div>



{@a summary}



## Резюме

Вы можете попробовать и загрузить исходный код этого руководства в <live-example></live-example>.

Вот источник из `src/app/` папка.


<code-tabs>

  <code-pane header="app.component.ts" path="structural-directives/src/app/app.component.ts">

  </code-pane>

  <code-pane header="app.component.html" path="structural-directives/src/app/app.component.html">

  </code-pane>

  <code-pane header="app.component.css" path="structural-directives/src/app/app.component.css">

  </code-pane>

  <code-pane header="app.module.ts" path="structural-directives/src/app/app.module.ts">

  </code-pane>

  <code-pane header="hero.ts" path="structural-directives/src/app/hero.ts">

  </code-pane>

  <code-pane header="hero-switch.components.ts" path="structural-directives/src/app/hero-switch.components.ts">

  </code-pane>

  <code-pane header="unless.directive.ts" path="structural-directives/src/app/unless.directive.ts">

  </code-pane>

</code-tabs>



Вы узнали

* что структурные директивы манипулируют макетом HTML.
* использовать [``](guide/structural-directives#ngcontainer)как группирующий элемент, когда нет подходящего хост-элемента.
* что Angular десугары [звездочка (*) синтаксис](guide/structural-directives#asterisk)в `<ng-template>`.
* как это работает для `NgIf`, `NgFor` и `NgSwitch` встроенные директивы.
* о [_microsyntax_](guide/structural-directives#microsyntax)который расширяется в [``](guide/structural-directives#template).
* написать [пользовательскую структурную директиву](guide/structural-directives#unless), `UnlessDirective`.
