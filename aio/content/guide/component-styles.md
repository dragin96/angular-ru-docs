{@a component-styles}
# Стили компонентов

Angular приложения оформлены со стандартным CSS. Это означает, что вы можете подать заявку
все, что вы знаете о таблицах стилей CSS, селекторах, правилах и медиазапросах
непосредственно к Angular приложениям.

Кроме того, Angular может связывать *стили компонентов*
с компонентами, обеспечивающими более модульный дизайн, чем обычные таблицы стилей.

На этой странице описано, как загрузить и применить эти стили компонентов.

Вы можете запустить <live-example></live-example>в Stackblitz и скачать код оттуда.

{@a using-component-styles}
## Использование стилей компонентов

Для каждого компонента Angular, который вы пишете, вы можете определить не только HTML-шаблон
но также стили CSS, которые идут с этим шаблоном
указав любые селекторы, правила и медиа-запросы, которые вам нужны.

Один из способов сделать это - установить  `styles`  свойство в метаданных компонента.
 `styles` Свойство принимает массив строк, содержащих код CSS.
Обычно вы даете ему одну строку, как показано в следующем примере:

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts"></code-example>

{@a style-scope}
## Стильная сфера

<div class="alert is-critical">

Стили, указанные в  `@Component`  Метаданные компонента _применить только внутри шаблона этого компонента_.

</div>

Они не наследуются ни компонентами, вложенными в шаблон, ни содержимым, проецируемым в компонент.

В этом примере  `h1`  Стиль применяется только к  `HeroAppComponent`,
не вложенным  `HeroMainComponent`  ни для  `<h1>`  теги в любом другом месте приложения.

Это ограничение объема является ***модульным элементом стиля***.

* Вы можете использовать имена классов CSS и селекторы, которые имеют наибольшее значение в контексте каждого компонента.


* Имена классов и селекторы являются локальными для компонента и не конфликтуют с
  классы и селекторы, используемые в других местах приложения.


* Изменения стилей в другом месте приложения не влияют на стили компонента.


* Вы можете совместно найти CSS код каждого компонента с машинописи и HTML код компонента
  что приводит к аккуратной и аккуратной структуре проекта.


* Вы можете изменить или удалить компонентный код CSS без поиска через
  Целое приложение, чтобы найти, где еще используется код.

{@a special-selectors}

{@a special-selectors}
## Специальные селекторы

У стилей компонентов есть несколько специальных *селекторов* из мира теневого DOM стиля
(описано на [CSS Scoping Module Level 1](https://www.w3.org/TR/css-scoping-1)странице на сайте
[W3C](https://www.w3.org)).
В следующих разделах описываются эти селекторы.

{@a host}
### :host

Использовать  `:host`  селектор псевдо-класс для целевых стилей в элементе, что *хосты* компонент (в отличие от
ориентированных на элементы *внутри* шаблона компонента).


<code-example path="component-styles/src/app/hero-details.component.css" region="host" header="src/app/hero-details.component.css"></code-example>

 `:host` Селектор является единственным способом нацеливания на элемент хоста. Вы не можете достичь
Хост-элемент внутри компонента с другими селекторами, потому что он не является частью
собственный шаблон компонента. Элемент host находится в шаблоне родительского компонента.

Используйте *функциональную форму* для условного применения стилей хоста
в том числе другой селектор в скобках после  `:host`.

Следующий пример снова нацелен на элемент host, но только когда он также имеет  `active`  класс CSS.

<code-example path="component-styles/src/app/hero-details.component.css" region="hostfunction" header="src/app/hero-details.component.css"></code-example>

{@a host-context}
### : хост-контекст

Иногда полезно применять стили, основанные на каком-либо условии, *вне* поля зрения компонента.
Например, класс CSS-темы может быть применен к документу  `<body>`  элемент, и
исходя из этого, вы хотите изменить внешний вид вашего компонента.

Использовать  `:host-context()`  селектор псевдокласса, который работает так же, как и функция
форма  `:host()`  .  `:host-context()` селектор выглядит для класса CSS в любом предке элемента компонента хозяина,
до корня документа.  `:host-context()` Селектор полезен в сочетании с другим селектором.

В следующем примере применяется  `background-color`  стиль для всех  `<h2>`  Элементы *внутри* компонента, только
если некоторый элемент-предок имеет класс CSS  `theme-light`.

<code-example path="component-styles/src/app/hero-details.component.css" region="hostcontext" header="src/app/hero-details.component.css"></code-example>

{@a deprecated-deep--and-ng-deep}
### (deprecated)  `/deep/`, `>>>`, и  `::ng-deep` 

Стили компонентов обычно применяются только к HTML в собственном шаблоне компонента.

Применяя  `::ng-deep`  Псевдокласс для любого правила CSS полностью отключает инкапсуляцию вида
это правило. Любой стиль с  `::ng-deep`  применяется становится глобальным стилем. Для того, чтобы охватить указанный стиль
к текущему компоненту и всем его потомкам, обязательно включите  `:host`  селектор раньше
 `::ng-deep` . Если  `::ng-deep`  комбинатор используется без  `:host`  селектор псевдокласса, стиль
может кровоточить в другие компоненты.

Следующий пример нацелен на все  `<h3>`  элементы, от основного элемента вниз
через этот компонент для всех его дочерних элементов в DOM.

<code-example path="component-styles/src/app/hero-details.component.css" region="deep" header="src/app/hero-details.component.css"></code-example>

 `/deep/` комбинатор также имеет псевдонимы  `>>>`, и  `::ng-deep`.

<div class="alert is-important">

использование  `/deep/`, `>>>`   и  `::ng-deep` только с *эмулированной* инкапсуляцией вида.
Эмуляция является стандартной и наиболее часто используемой инкапсуляцией представления. Для получения дополнительной информации см
[Контроль инкапсуляции вида](guide/component-styles#view-encapsulation).

</div>

<div class="alert is-important">

Пронзающий теневой комбинатор устаревших и [поддержка удаляется из основных браузеров](https://www.chromestatus.com/features/6750456638341120)и инструменты.
Таким образом, мы планируем отказаться от поддержки в Angular (для всех 3  `/deep/`, `>>>`   и  `::ng-deep`).
До тех пор  `::ng-deep`  следует предпочитать для более широкой совместимости с инструментами.

</div>

{@a loading-styles}

{@a loading-component-styles}
## Загрузка стилей компонентов

Есть несколько способов добавления стилей к компоненту:

* Установив  `styles`  или  `styleUrls`  метаданные.
* Встроенный в шаблон HTML.
* С CSS-импортом.

Изложенные ранее правила определения области действия применяются к каждому из этих шаблонов загрузки.

{@a styles-in-component-metadata}
### Стили в метаданных компонента

Вы можете добавить  `styles`  свойство массива для  `@Component`  декоратор.

Каждая строка в массиве определяет некоторый CSS для этого компонента.

<code-example path="component-styles/src/app/hero-app.component.ts" header="src/app/hero-app.component.ts (CSS inline)">
</code-example>

<div class="alert is-critical">

Напоминание: эти стили применяются только к этому компоненту.
Они не наследуются ни компонентами, вложенными в шаблон, ни содержимым, проецируемым в компонент.

</div>

Команда Angular CLI [ `ng generate component` ](cli/generate)определяет пустой  `styles`  массив при создании компонента с  `--inline-style`.

<code-example language="sh" class="code-shell">
ng generate component hero-app --inline-style
</code-example>

{@a style-files-in-component-metadata}
### Файлы стилей в метаданных компонента

Вы можете загрузить стили из внешних файлов CSS, добавив  `styleUrls`  свойство
к компоненту  `@Component`  декоратор:

<code-tabs>
  <code-pane header="src/app/hero-app.component.ts (CSS in file)" path="component-styles/src/app/hero-app.component.1.ts"></code-pane>
  <code-pane header="src/app/hero-app.component.css" path="component-styles/src/app/hero-app.component.css"></code-pane>
</code-tabs>

<div class="alert is-critical">

Напоминание: стили в файле стиля применяются только к этому компоненту.
Они не наследуются ни компонентами, вложенными в шаблон, ни содержимым, проецируемым в компонент.

</div>

<div class="alert is-helpful">

  Вы можете указать более одного файла стилей или даже комбинацию  `styles`  и  `styleUrls`.

</div>

Когда вы используете команду Angular CLI [ `ng generate component ` ](cli/generate)без ` --inline-style` flag, он создает пустой файл стилей для вас и ссылается на этот файл в сгенерированном компоненте  `styleUrls`.

<code-example language="sh" class="code-shell">
ng generate component hero-app
</code-example>

{@a template-inline-styles}
### Шаблон встроенных стилей

Вы можете вставлять стили CSS непосредственно в шаблон HTML, помещая их
внутри  `<style>`  теги.

<code-example path="component-styles/src/app/hero-controls.component.ts" region="inlinestyles" header="src/app/hero-controls.component.ts">
</code-example>

{@a template-link-tags}
### Теги ссылки на шаблоны

Вы также можете написать  `<link>`  теги в HTML-шаблон компонента.

<code-example path="component-styles/src/app/hero-team.component.ts" region="stylelink" header="src/app/hero-team.component.ts">
</code-example>

<div class="alert is-critical">

При сборке с CLI обязательно включите связанный файл стиля среди ресурсов, которые будут скопированы на сервер, как описано в [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-asset-configuration).
<!-- 2018-10-16: The link above is still the best source for this information. -->

После включения CLI будет включать таблицу стилей, независимо от того, является ли URL-адрес href тега ссылки относительно корня приложения или файла компонента.

</div>

{@a css-@imports}
### CSS @imports

Вы также можете импортировать файлы CSS в файлы CSS, используя стандартный CSS  `@import`  правило.
Подробнее см. [ `@ Import` ](https://developer.mozilla.org/en/docs/Web/CSS/@import)
на сайте [MDN](https://developer.mozilla.org).

В этом случае URL относится к файлу CSS, в который вы импортируете.

<code-example path="component-styles/src/app/hero-details.component.css" region="import" header="src/app/hero-details.component.css (excerpt)">
</code-example>

{@a external-and-global-style-files}
### Внешние и глобальные файлы стилей

При сборке с CLI необходимо настроить  `angular.json`  для включения всех внешних ресурсов, включая внешние файлы стилей.

Зарегистрируйте **глобальные** файлы стилей в  `styles`  раздел который по умолчанию предварительно настроен с глобальным  `styles.css`  файл.

Смотрите [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-global-styles)чтобы узнать больше.
<!-- 2018-10-16: The link above is still the best source for this information. -->


{@a non-css-style-files}
### Файлы стилей без CSS

Если вы строите с CLI,
Вы можете написать файлы стилей в [sass](http://sass-lang.com/), [less](http://lesscss.org/)или [stylus](http://stylus-lang.com/)и указать эти файлы в  `@Component.styleUrls`  Метаданные с соответствующими расширениями (`.scss`, `.less`, `.styl`), как показано в следующем примере:

<code-example>
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
...
</code-example>

Процесс сборки CLI запускает соответствующий препроцессор CSS.

При создании файла компонента с `ng generate component` CLI выдает пустой файл стилей CSS (`.css`) по умолчанию.
Вы можете настроить CLI по умолчанию для вашего предпочтительного препроцессора CSS
как объяснено в [CLI wiki](https://github.com/angular/angular-cli/wiki/stories-css-preprocessors
"CSS Preprocessor integration").
<!-- 2018-10-16: The link above is still the best source for this information. -->


<div class="alert is-important">

Строки стиля добавлены в  `@Component.styles`  Массив _должен быть написан на CSS_, потому что CLI не может применить препроцессор к встроенным стилям.

</div>

{@a view-encapsulation}

{@a view-encapsulation}
## Посмотреть инкапсуляцию

Как обсуждалось ранее, стили CSS компонента инкапсулированы в представление компонента и не делают этого
влияет на остальную часть приложения.

Чтобы контролировать, как эта инкапсуляция происходит на *per
На компонента * основе вы можете установить*режим инкапсуляции представления * в метаданных компонента.
Выберите один из следующих режимов:

*  `ShadowDom` представления использует собственную реализацию DOM браузера (см
  [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  На сайте [MDN](https://developer.mozilla.org))
  присоединить теневой DOM к элементу хоста компонента, а затем поместить компонент
  посмотреть в этой тени DOM. Стили компонента включены в теневой DOM.

*  `Native` вид инкапсуляция используется в настоящее время устаревшего версии собственной реализации теневой DOM браузера - [узнать об изменениях](https://hayato.io/2016/shadowdomv1/).

*  `Emulated` инкапсуляция представлений (по умолчанию) эмулирует поведение теневого DOM путем предварительной обработки
  (и переименование) кода CSS для эффективного размещения CSS в представлении компонента.
  Подробнее см. [Проверка сгенерированного CSS](guide/component-styles#inspect-generated-css)ниже.

*  `None` означает, что Angular не просматривает инкапсуляцию.
  Angular добавляет CSS к глобальным стилям.
  Обсуждаемые ранее правила определения границ, изоляции и защиты не применяются.
  По сути, это то же самое, что и вставка стилей компонента в HTML.

Чтобы установить режим инкапсуляции компонентов, используйте  `encapsulation`  свойство в компоненте метаданных:

<code-example path="component-styles/src/app/quest-summary.component.ts" region="encapsulation.native" header="src/app/quest-summary.component.ts"></code-example>

 `ShadowDom` вида работает только в браузерах, которые имеют встроенную поддержку
для теневой DOM (см [Shadow DOM v1](https://caniuse.com/#feat=shadowdomv1)на
[использование Can I](http://caniuse.com)сайт). Поддержка все еще ограничена
вот почему  `Emulated`  инкапсуляция представления является режимом по умолчанию и рекомендуется
в большинстве случаев.

{@a inspect-generated-css}

{@a inspecting-generated-css}
## Проверка сгенерированного CSS

При использовании эмуляции представления эмуляции, Angular препроцессирует
все стили компонентов, чтобы они приближались к стандартным теневым правилам CSS.

В DOM запущенного приложения Angular с эмулированным представлением
Инкапсуляция включена, каждый элемент DOM имеет некоторые дополнительные атрибуты
прилагается к нему:

<code-example format="">
  &lt;hero-details _nghost-pmm-5>
    &lt;h2 _ngcontent-pmm-5>Mister Fantastic&lt;/h2>
    &lt;hero-team _ngcontent-pmm-5 _nghost-pmm-6>
      &lt;h3 _ngcontent-pmm-6>Team&lt;/h3>
    &lt;/hero-team>
  &lt;/hero-detail>

</code-example>

Есть два вида генерируемых атрибутов:

* Элемент, который будет теневым DOM-хостом в собственной инкапсуляции, имеет
  генерироваться  `_nghost`  . Обычно это относится к элементам хоста компонента.
* Элемент в представлении компонента имеет  `_ngcontent`  атрибут
который идентифицирует эмулируемому теневому DOM хоста, к которому принадлежит этот элемент.

Точные значения этих атрибутов не важны. Они автоматически
генерируется и вы никогда не ссылаетесь на них в коде приложения. Но они нацелены
сгенерированными стилями компонентов, которые находятся в  `<head>`  часть DOM:

<code-example format="">
  [_nghost-pmm-5] {
    display: block;
    border: 1px solid black;
  }

  h3[_ngcontent-pmm-6] {
    background-color: white;
    border: 1px solid #777;
  }
</code-example>

Эти стили постобработаны, так что каждый селектор дополнен
с  `_nghost`  или  `_ngcontent`  атрибут селекторов.
Эти дополнительные селекторы включают правила определения объема, описанные на этой странице.
