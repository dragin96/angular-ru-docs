{@a display-a-selection-list}
# Показать список выбора

На этой странице вы развернете приложение Тур героев, чтобы отобразить список героев, и
позволяют пользователям выбирать героя и отображать детали героя.


{@a create-mock-heroes}
## Создавайте насмешливых героев

Вам понадобятся герои для показа.

В конце концов вы получите их с удаленного сервера данных.
Сейчас вы создадите несколько _mock heroes_ и притворитесь, что они пришли с сервера.

Создайте файл с именем `mock-heroes.ts` в `src/app/` папка.
Определить `HEROES` постоянны как массив из десяти героев и экспортируют его.
Файл должен выглядеть следующим образом.

<code-example path="toh-pt2/src/app/mock-heroes.ts" header="src/app/mock-heroes.ts"></code-example>

{@a displaying-heroes}
## Отображение героев

Открой `HeroesComponent` Файл класса и импортировать макет `HEROES`.

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="import-heroes" header="src/app/heroes/heroes.component.ts (import HEROES)">
</code-example>

В том же файле (`HeroesComponent`), определите свойство компонента с именем `heroes` разоблачить `HEROES` массив для привязки.

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="component">
</code-example>

{@a list-heroes-with-ngfor}
### Список героев с `*ngFor`

Открой `HeroesComponent` файл шаблона и сделать следующие изменения:

* Добавить `<h2>` наверху
* Ниже добавьте неупорядоченный список HTML (`<ul>`)
* Вставьте `<li>` в `<ul>` который отображает свойства `hero`.
* Посыпать некоторые классы CSS для стиля (вы скоро добавите стили CSS).

Сделать это выглядит следующим образом :

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="list" header="heroes.component.html (heroes template)"></code-example>

Это показывает один герой. Чтобы перечислить их все, добавьте `*ngFor` к `<li>` перебирать список героев

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="li">
</code-example>

[ `* NgFor` ](guide/template-syntax#ngFor)является _repeater_ директивы Angular в.
Он повторяет элемент host для каждого элемента в списке.

Синтаксис в этом примере следующим образом :

* `<li>` является хост-элементом.
* `heroes` держит список фиктивных героев из `HeroesComponent` класс, фиктивный список героев.
* `hero` содержит текущий объект героя для каждой итерации в списке.

<div class="alert is-important">

Не забудьте звездочку ( *) перед `ngFor` . Это важная часть синтаксиса.

</div>

После обновления браузера появляется список героев.

{@a styles}

{@a style-the-heroes}
### Стиль героев

Список героев должен быть привлекательным и должен отвечать визуально, когда пользователи
наведите курсор и выберите героя из списка.

В [первом уроке](tutorial/toh-pt0#app-wide-styles)вы устанавливаете основные стили для всего приложения в `styles.css`.
В этой таблице стилей не было стилей для этого списка героев.

Вы можете добавить больше стилей к `styles.css` и продолжайте увеличивать эту таблицу стилей по мере добавления компонентов.

Вместо этого вы можете предпочесть определение частных стилей для конкретного компонента и оставить все, что нужно компоненту: код, HTML
и CSS - вместе в одном месте.

Такой подход облегчает повторное использование компонента в другом месте
и обеспечить предполагаемый внешний вид компонента, даже если глобальные стили отличаются.

Вы определяете частные стили либо встроенные в `@Component.styles` массив или
как файл (ы) таблицы стилей, идентифицированные в `@Component.styleUrls` массив.

Когда CLI сгенерировал `HeroesComponent`, он создал пустой `heroes.component.css` стилей для `HeroesComponent`
и указал на это в `@Component.styleUrls` как это.

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="metadata"
 header="src/app/heroes/heroes.component.ts (@Component)">
</code-example>

Открой `heroes.component.css` файл и вставьте в частные стили CSS для `HeroesComponent`.
Вы найдете их в [окончательный обзор кода](#final-code-review)в нижней части этого руководства.

<div class="alert is-important">

Стили и таблицы стилей, определенные в `@Component` Метаданные относятся к этому конкретному компоненту.
 `heroes.component.css` Стили применяются только к `HeroesComponent` и не влияет на внешний HTML или HTML в любом другом компоненте.

</div>

{@a master-detail}
## Мастер / Деталь

Когда пользователь щелкает герой в **главном** списке
компонент должен отображать выбранного героя **детали** внизу страницы.

В этом разделе вы узнаете о событии клика на предмете героя
и обновить детали героя.

{@a add-a-click-event-binding}
### Добавьте привязку события клика

Добавьте привязку события клика к `<li>` нравится это

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="selectedHero-click" header="heroes.component.html (template excerpt)"></code-example>

Это пример Angular [привязки событий](guide/template-syntax#event-binding)синтаксиса.

Скобки вокруг `click` сказать Angular, чтобы прослушать `<li>` element's `click` событие.
Когда пользователь нажимает на `<li>`, Angular выполняет `onSelect(hero)` выражение.


В следующем разделе определите `onSelect()` в `HeroesComponent` к
отобразить героя, который был определен в `*ngFor` выражение.


{@a add-the-click-event-handler}
### Добавьте обработчик события click

Переименовать компонент `hero` собственность `selectedHero` но не назначайте его.
При запуске приложения нет _selected hero_.

Добавьте следующее `onSelect()`, который назначает героя по шаблону
к компоненту `selectedHero`.

<code-example path="toh-pt2/src/app/heroes/heroes.component.ts" region="on-select" header="src/app/heroes/heroes.component.ts (onSelect)"></code-example>

{@a add-a-details-section}
### Добавить раздел подробностей

В настоящее время у вас есть список в шаблоне компонента. Нажать на героя в списке
и раскрыть подробности об этом герое, вам нужен раздел для подробностей рендеринга в
шаблон. Добавьте следующее к `heroes.component.html` ниже раздел списка:

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="selectedHero-details" header="heroes.component.html (selected hero details)"></code-example>

После обновления браузера приложение не работает.

Открыть инструменты для разработчиков браузера и посмотреть в консоли сообщение об ошибке, как это:

<code-example language="sh" class="code-shell">
  HeroesComponent.html:3 ERROR TypeError: Cannot read property 'name' of undefined
</code-example>

{@a what-happened}
#### Что произошло?

Когда приложение запускается, `selectedHero` is `undefined` _by дизайн_.

Обязательные выражения в шаблоне, которые ссылаются на свойства `selectedHero` выражения как `{{selectedHero.name}}` должно произойти сбой_, потому что нет выбранного героя.


{@a the-fix-hide-empty-details-with-ngif}
#### Исправление - скрыть пустые детали с помощью _*ngIf_


Компонент должен отображать информацию о выбранном герое, только если `selectedHero` существует.

Оберните детали героя HTML в `<div>`.
Добавить Angular's `*ngIf` директива к `<div>` и установить его `selectedHero`.


<div class="alert is-important">

Не забудьте звездочку ( *) перед `ngIf` . Это важная часть синтаксиса.

</div>

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="ng-if" header="src/app/heroes/heroes.component.html (*ngIf)"></code-example>

После обновления браузера список имен снова появляется.
Область сведений пуста.
Нажмите на героя в списке героев, и его детали появятся.
Приложение, похоже, снова работает.
Герои появляются в списке, а сведения о выбранном герое появляются внизу страницы.


{@a why-it-works}
#### Почему это работает

когда `selectedHero` не определено, `ngIf` удаляет детали героя из DOM. Нет `selectedHero` Hero привязки для рассмотрения.

Когда пользователь выбирает героя, `selectedHero` имеет значение и
 `ngIf` помещает детали героя в DOM.

{@a style-the-selected-hero}
### Стиль выбранного героя

Трудно определить выбранного героя в списке, когда все `<li>` Элементы похожи друг на друга.

Если пользователь нажимает кнопку «Magneta», что герой должен сделать с отличительным, но тонким цветом фона, как это:

<div class="lightbox">
  <img src='generated/images/guide/toh/heroes-list-selected.png' alt="Selected hero">
</div>

Эта _selected hero_ раскраска является работой `.selected` CSS класс в [стили, которые вы добавили ранее](#styles).
Вы просто должны применить `.selected` класс `<li>` когда пользователь щелкает по нему.

Angular [связывание классов](guide/template-syntax#class-binding)позволяет легко добавлять и удалять класс CSS.
Просто добавь `[class.some-css-class]="some-condition"` для элемента, который вы хотите.

Добавьте следующее `[class.selected]` привязка к `<li>` в `HeroesComponent` шаблон:

<code-example path="toh-pt2/src/app/heroes/heroes.component.1.html" region="class-selected" header="heroes.component.html (toggle the 'selected' CSS class)"></code-example>

Когда текущий герой строки совпадает с `selectedHero`, Angular добавляет `selected` класс CSS. Когда два героя различны, Angular удаляет класс.

Законченный `<li>` выглядит следующим образом :

<code-example path="toh-pt2/src/app/heroes/heroes.component.html" region="li" header="heroes.component.html (list item hero)"></code-example>

{@a final-code-review}

## Окончательный обзор кода

Ваше приложение должно выглядеть следующим образом <live-example></live-example>.

Вот файлы кода, обсуждаемые на этой странице, включая `HeroesComponent` стили.

<code-tabs>

  <code-pane header="src/app/mock-heroes.ts" path="toh-pt2/src/app/mock-heroes.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt2/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt2/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.css" path="toh-pt2/src/app/heroes/heroes.component.css">
  </code-pane>

</code-tabs>

{@a summary}
## Резюме

* Приложение Tour of Heroes отображает список героев в режиме Master / Detail.
* Пользователь может выбрать героя и посмотреть детали этого героя.
* Ты использовал `*ngFor` для отображения списка.
* Ты использовал `*ngIf` условно включить или исключить блок HTML.
* Вы можете переключать класс стиля CSS с помощью `class` привязка.
