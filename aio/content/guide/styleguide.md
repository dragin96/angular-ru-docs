{@a angular-coding-style-guide}
# Angular руководство по стилю кодирования

Ищете авторитетное руководство по угловому синтаксису, соглашениям и структуре приложения?
Шаг прямо в!
Это руководство по стилю представляет предпочтительные соглашения и, что важно, объясняет почему.

{@a toc}

{@a style-vocabulary}
## Словарный стиль

Каждое руководство описывает либо хорошую, либо плохую практику, и все они имеют последовательную презентацию.

Формулировка каждого руководства указывает, насколько сильна рекомендация.

<div class="s-rule do">

**Делать** это то, что всегда должно следовать.
_Всегда_ может быть слишком сильным словом.
Руководящие принципы, которые буквально всегда должны соблюдаться, крайне редки.
С другой стороны, вам нужен действительно необычный случай для ломать *Do* руководство.

</div>

<div class="s-rule consider">

**Рассмотрим** рекомендации, как правило, следует соблюдать.
Если вы полностью понимаете смысл, лежащий в основе данного руководства, и у вас есть веская причина для отклонения, сделайте это. Пожалуйста, старайтесь быть последовательным.

</div>

<div class="s-rule avoid">

**Избегать** указывает на то, что вы почти никогда не должны делать. Примеры кода, которых следует*избегать, * имеют безошибочный красный заголовок.

</div>

<div class="s-why">

**Почему?** дает основания для следования предыдущим рекомендациям.

</div>

{@a file-structure-conventions}
## Соглашения о структуре файлов

В некоторых примерах кода отображается файл, содержащий один или несколько сопутствующих файлов с одинаковыми именами.
Например,  `hero.component.ts`  и  `hero.component.html`.

Руководство использует ярлык  `hero.component.ts|html|css|spec`  для представления этих различных файлов. Использование этого ярлыка делает файловые структуры этого руководства более удобными для чтения и более краткими.


{@a single-responsibility}

{@a single-responsibility}
## Единственная ответственность

Применить
<a href="https://wikipedia.org/wiki/Single_responsibility_principle"><i>принцип единой ответственности </i>(SRP) </a>
для всех компонентов, услуг и других символов.
Это помогает сделать приложение более чистым, легким для чтения и обслуживания и более тестируемым.

{@a 01-01}

{@a rule-of-one}
### Правило Одного

{@a style-01-01}
#### Стиль 01-01

<div class="s-rule do">

**Делать** определите одну вещь, такую ​​как служба или компонент, для файла.


</div>



<div class="s-rule consider">



**Рассмотрим** ограничение файлов до 400 строк кода.


</div>



<div class="s-why">



**Почему?** Один компонент на файл упрощает чтение, обслуживание и предотвращение
столкновения с командами в системе контроля версий.


</div>



<div class="s-why">



**Почему?** Один компонент на файл позволяет избежать скрытых ошибок, которые часто возникают при объединении компонентов в файле, где они могут совместно использовать переменные, создавать нежелательные замыкания или нежелательную связь с зависимостями.


</div>



<div class="s-why-last">



**Почему?** Отдельный компонент может быть экспортом по умолчанию для его файла, что облегчает отложенную загрузку с маршрутизатором.

</div>



Ключ состоит в том, чтобы сделать код более пригодным для повторного использования, более легким для чтения и менее подверженным ошибкам.

Следующий *негативный* пример определяет  `AppComponent`, загружает приложение
определяет  `Hero`  моделирует объект и загружает героев с сервера все в один файл.
*Не делай этого*.


<code-example path="styleguide/src/01-01/app/heroes/hero.component.avoid.ts" header="app/heroes/hero.component.ts">

</code-example>



Лучше перераспределить компонент и его
поддержка классов в свои собственные, выделенные файлы.


<code-tabs>

  <code-pane header="main.ts" path="styleguide/src/01-01/main.ts">

  </code-pane>

  <code-pane header="app/app.module.ts" path="styleguide/src/01-01/app/app.module.ts">

  </code-pane>

  <code-pane header="app/app.component.ts" path="styleguide/src/01-01/app/app.component.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/01-01/app/heroes/heroes.component.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/hero.service.ts" path="styleguide/src/01-01/app/heroes/shared/hero.service.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/hero.model.ts" path="styleguide/src/01-01/app/heroes/shared/hero.model.ts">

  </code-pane>

  <code-pane header="app/heroes/shared/mock-heroes.ts" path="styleguide/src/01-01/app/heroes/shared/mock-heroes.ts">

  </code-pane>

</code-tabs>



По мере роста приложения это правило становится еще более важным.
<a href="#toc">Вернуться к началу </a>


{@a 01-02}

{@a small-functions}
### Маленькие функции

{@a style-01-02}
#### Стиль 01-02


<div class="s-rule do">



**Do** определяют малые функции


</div>



<div class="s-rule consider">



**Рассмотрим** ограничение не более 75 строк.


</div>



<div class="s-why">



**Почему?** Маленькие функции легче тестировать, особенно когда они выполняют одну функцию и служат одной цели.


</div>



<div class="s-why">



**Почему?** Небольшие функции способствуют повторному использованию.


</div>



<div class="s-why">



**Почему?** Маленькие функции легче читать.


</div>



<div class="s-why">



**Почему?** Небольшие функции легче поддерживать.


</div>



<div class="s-why-last">



**Почему?** Небольшие функции помогают избежать скрытых ошибок, которые идут с большими функциями, которые совместно используют переменные с внешней областью, создают нежелательные замыкания или нежелательное соединение с зависимостями.


</div>

<a href="#toc">Вернуться к началу </a>


{@a naming}
## Нейминг

Соглашения об именах чрезвычайно важны для удобства обслуживания и читабельности. В этом руководстве рекомендуются соглашения об именах для имени файла и имени символа.



{@a 02-01}

{@a general-naming-guidelines}
### Общие правила именования

{@a style-02-01}
#### Стиль 02-01


<div class="s-rule do">



**Do** использовать согласованные имена для всех символов.


</div>



<div class="s-rule do">



**Как** следовать шаблону, который описывает функцию этого символа, то его тип. Рекомендуемый шаблон  `feature.type.ts`.


</div>



<div class="s-why">



**Почему?** Соглашения об именах помогают обеспечить наглядный способ поиска контента. Согласованность в рамках проекта имеет жизненно важное значение. Согласованность с командой важна. Согласованность всей компании обеспечивает огромную эффективность.


</div>



<div class="s-why">



**Почему?** Соглашения об именах должны просто помочь быстрее найти нужный код и сделать его более понятным.


</div>



<div class="s-why-last">



**Почему?** Названия папок и файлов должны четко отражать их намерения. Например,  `app/heroes/hero-list.component.ts`  может содержать компонент, который управляет списком героев.


</div>

<a href="#toc">Вернуться к началу </a>


{@a 02-02}

{@a separate-file-names-with-dots-and-dashes}
### Разделяйте имена файлов точками и тире

{@a style-02-02}
#### Стиль 02-02


<div class="s-rule do">



**Есть ли** использование дефис для разделения слов в описательном имени.


</div>



<div class="s-rule do">



**Как** использовать точки, чтобы отделить описательное название от типа.


</div>



<div class="s-rule do">



**Как** использовать последовательные имена типов для всех компонентов следуя схему, которая описывает функцию компоненты, то его типа. Рекомендуемый шаблон  `feature.type.ts`.


</div>



<div class="s-rule do">



**Как** использовать обычные имена типов, включая  `.service`, `.component`, `.pipe`, `.module`, и  `.directive`.
Придумайте дополнительные имена типов, если нужно, но старайтесь не создавать слишком много.


</div>



<div class="s-why">



**Почему?** Имена типов обеспечивают согласованный способ быстро определить, что находится в файле.


</div>



<div class="s-why">



**Почему?** Имена типов облегчают поиск определенного типа файла с помощью редактора или методов нечеткого поиска в IDE.


</div>



<div class="s-why">



**Почему?** Несокращенные имена типов, такие как  `.service` описательный и однозначный.
Сокращения, такие как  `.srv`, `.svc`, и  `.serv`  может сбивать с толку.


</div>



<div class="s-why-last">



**Почему?** Имена типов обеспечивают сопоставление с образцом для любых автоматизированных задач.


</div>

<a href="#toc">Вернуться к началу </a>


{@a 02-03}

{@a symbols-and-file-names}
### Символы и имена файлов

{@a style-02-03}
#### Стиль 02-03


<div class="s-rule do">



**Do** использовать согласованные имена для всех активов, им то, что они представляют.


</div>



<div class="s-rule do">



**Как** использовать верхний регистр верблюжьего для имен классов.


</div>



<div class="s-rule do">



**Сопоставьте** имя символа с именем файла.


</div>



<div class="s-rule do">



**Добавьте** имя символа с обычным суффиксом (например,  `Component`,
 `Directive `, ` Module `, ` Pipe`, или  `Service`  ) для вещи такого типа.


</div>



<div class="s-rule do">



**Как** дать имя файла обычный суффикс (например,  `.component.ts`, `.directive.ts`,
 `.module.ts `, ` .pipe.ts ` или ` .service.ts` ) для файла этого типа.

</div>



<div class="s-why">



**Почему?** Последовательные соглашения позволяют легко быстро определить
и справочные активы разных типов.


</div>



<table width="100%">









  <tr>

    <th>
      Символ Название
    </th>

    <th>
      Имя файла
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class AppComponent { }
      </code-example>

    </td>

    <td>


      app.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroesComponent { }
      </code-example>

    </td>

    <td>


      heroes.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroListComponent { }
      </code-example>

    </td>

    <td>


      hero-list.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Component({ ... })
        export class HeroDetailComponent { }
      </code-example>

    </td>

    <td>


      hero-detail.component.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Directive({ ... })
        export class ValidationDirective { }
      </code-example>

    </td>

    <td>


      validation.directive.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppModule
      </code-example>

    </td>

    <td>


      app.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'initCaps' })
        export class InitCapsPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      init-caps.pipe.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class UserProfileService { }
      </code-example>

    </td>

    <td>


      user-profile.service.ts
    </td>

  </tr>

</table>



<a href="#toc">Вернуться к началу </a>


{@a 02-04}

{@a service-names}
### Сервисные имена

{@a style-02-04}
#### Стиль 02-04

<div class="s-rule do">



**Do** использовать согласованные имена для всех служб имени их функции.


</div>



<div class="s-rule do">



**Сделать** суффикс имени класса обслуживания с  `Service`.
Например, что-то, что получает данные или герои
следует назвать  `DataService`  или  `HeroService`.

Несколько терминов однозначно являются услугами. Они типично
указать агентство, оканчиваясь на "-er". Вы можете предпочесть имя
сервис, который регистрирует сообщения  `Logger`  а не  `LoggerService`.
Решите, является ли это исключение приемлемым в вашем проекте.
Как всегда, стремиться к последовательности.


</div>



<div class="s-why">



**Почему?** Обеспечивает последовательный способ быстрой идентификации и справочных услуг.


</div>



<div class="s-why">



**Почему?** Очистить названия сервисов, такие как  `Logger`  не требуется суффикс.


</div>



<div class="s-why-last">



**Почему?** Сервисные имена, такие как  `Credit`  являются существительными и требуют суффикса и должны быть названы суффиксом, когда не очевидно, является ли это службой или чем-то еще.


</div>



<table width="100%">









  <tr>

    <th>
      Символ Название
    </th>

    <th>
      Имя файла
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class HeroDataService { }
      </code-example>

    </td>

    <td>


      герой-data.service.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class CreditService { }
      </code-example>

    </td>

    <td>


      credit.service.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Injectable()
        export class Logger { }
      </code-example>

    </td>

    <td>


      logger.service.ts
    </td>

  </tr>

</table>

<a href="#toc">Вернуться к началу </a>

{@a 02-05}

{@a bootstrapping}
### Самонастройки

{@a style-02-05}
#### Стиль 02-05


<div class="s-rule do">

**У** пут самонастройки и платформы логики приложения в файл с именем  `main.ts`.

</div>

<div class="s-rule do">

**Do** включает обработку ошибок в логике самонастройки.

</div>

<div class="s-rule avoid">

**Избегайте использования** логики приложения  `main.ts`  . Вместо этого рассмотрите возможность размещения его в компоненте или услуге.

</div>

<div class="s-why">

**Почему?** Следует последовательному соглашению для логики запуска приложения.

</div>

<div class="s-why-last">

**Почему?** Следует знакомому соглашению от других технологических платформ.

</div>


<code-example path="styleguide/src/02-05/main.ts" header="main.ts">

</code-example>

<a href="#toc">Вернуться к началу </a>

{@a 05-02}

{@a component-selectors}
### Селекторы компонентов

{@a style-05-02}
#### Стиль 05-02

<div class="s-rule do">

**Делать** используйте _dashed-case_ или _kebab-case_ для именования селекторов элементов компонентов.

</div>

<div class="s-why-last">

**Почему?** Сохраняет имена элементов в соответствии со спецификацией для [пользовательских элементов](https://www.w3.org/TR/custom-elements/).

</div>

<code-example path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>

<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-02/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-02/app/app.component.html">

  </code-pane>

</code-tabs>

<a href="#toc">Вернуться к началу </a>

{@a 02-07}

{@a component-custom-prefix}
### Пользовательский префикс компонента

{@a style-02-07}
#### Стиль 02-07


<div class="s-rule do">

**Есть ли** использовать дефис, значение селектора в нижнем регистре элемента; например,  `admin-users`.

</div>

<div class="s-rule do">

**Как** использовать пользовательский префикс для выбора компонентов.
Например, префикс  `toh`  представляет **T**нашей**O**ф**H**eroes и приставки  `admin`  представляет область функций администратора.

</div>

<div class="s-rule do">

**Есть ли** использовать префикс, который идентифицирует области объектов или самого приложения.

</div>

<div class="s-why">

**Почему?** Предотвращает конфликты имен элементов с компонентами в других приложениях и с собственными элементами HTML.

</div>

<div class="s-why">

**Почему?** Упрощает продвижение и совместное использование компонента в других приложениях.

</div>

<div class="s-why-last">

**Почему?** Компоненты легко идентифицировать в DOM.

</div>

<code-example path="styleguide/src/02-07/app/heroes/hero.component.avoid.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/users/users.component.avoid.ts" region="example" header="app/users/users.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/heroes/hero.component.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>

<code-example path="styleguide/src/02-07/app/users/users.component.ts" region="example" header="app/users/users.component.ts">

</code-example>

<a href="#toc">Вернуться к началу </a>


{@a 02-06}

{@a directive-selectors}
### Директивные селекторы

{@a style-02-06}
#### Стиль 02-06

<div class="s-rule do">

**Do** использовать нижний верблюжий корпус для обозначения селекторов директив.

</div>

<div class="s-why">

**Почему?** Сохраняет имена свойств, определенных в директивах, которые связаны с представлением, в соответствии с именами атрибутов.

</div>

<div class="s-why-last">

**Почему?** Анализатор Angular HTML чувствителен к регистру и распознает нижний регистр верблюда.

</div>



<a href="#toc">Вернуться к началу </a>

{@a 02-08}

{@a directive-custom-prefix}
### Директива пользовательского префикса

{@a style-02-08}
#### Стиль 02-08

<div class="s-rule do">



**Как** использовать собственный префикс для выбора директив (например, префикс  `toh`  от**Т**наша**ö**F**H**eroes).


</div>



<div class="s-rule do">



**Как** пишутся без элементов селекторов в нижнем регистре верблюда, если селектор не предназначен, чтобы соответствовать родной атрибуту HTML.


</div>



<div class="s-why">



**Почему?** Предотвращает конфликты имен.


</div>



<div class="s-why-last">



**Почему?** Директивы легко идентифицируются.


</div>



<code-example path="styleguide/src/02-08/app/shared/validate.directive.avoid.ts" region="example" header="app/shared/validate.directive.ts">

</code-example>





<code-example path="styleguide/src/02-08/app/shared/validate.directive.ts" region="example" header="app/shared/validate.directive.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a 02-09}

{@a pipe-names}
### Названия труб

{@a style-02-09}
#### Стиль 02-09

<div class="s-rule do">



**Do** использовать согласованные имена для всех труб, названных в честь их особенности.
Имя класса канала следует использовать [UpperCamelCase](guide/glossary#case-types)
(общее соглашение для имен классов)
и соответствующий  `name` Строка должна использовать *lowerCamelCase*.
 `name` Строка не может использовать дефисы ("случай тире" или "случай шашлыка").


</div>



<div class="s-why-last">



**Почему?** Обеспечивает последовательный способ быстрой идентификации и ссылки на трубы.


</div>



<table width="100%">









  <tr>

    <th>
      Символ Название
    </th>

    <th>
      Имя файла
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'ellipsis' })
        export class EllipsisPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      ellipsis.pipe.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @Pipe({ name: 'initCaps' })
        export class InitCapsPipe implements PipeTransform { }
      </code-example>

    </td>

    <td>


      init-caps.pipe.ts
    </td>

  </tr>

</table>



<a href="#toc">Вернуться к началу </a>


{@a 02-10}

{@a unit-test-file-names}
### Имена файлов модульного теста

{@a style-02-10}
#### Стиль 02-10

<div class="s-rule do">



**Назовите** файлы спецификации теста так же, как компонент, который они тестируют.


</div>



<div class="s-rule do">



**Назовите** файлы спецификации теста с суффиксом  `.spec`.


</div>



<div class="s-why">



**Почему?** Обеспечивает последовательный способ быстрой идентификации тестов.


</div>



<div class="s-why-last">



**Почему?** Обеспечивает сопоставление с образцом для [кармы](http://karma-runner.github.io/)или других участников теста.


</div>





<table width="100%">









  <tr>

    <th>
      Тип теста
    </th>

    <th>
      Имена файлов
    </th>

  </tr>

  <tr style=top>

    <td>


      Компоненты
    </td>

    <td>


      heroes.component.spec.ts

      hero-list.component.spec.ts

      hero-detail.component.spec.ts
    </td>

  </tr>

  <tr style=top>

    <td>


      Услуги
    </td>

    <td>


      logger.service.spec.ts

      hero.service.spec.ts

      filter-text.service.spec.ts
    </td>

  </tr>

  <tr style=top>

    <td>


      Трубы
    </td>

    <td>


      ellipsis.pipe.spec.ts

      init-caps.pipe.spec.ts
    </td>

  </tr>

</table>



<a href="#toc">Вернуться к началу </a>


{@a 02-11}

{@a end-to-end-e2e-test-file-names}
### _End-to-End_ (E2E) тестовые имена файлов

{@a style-02-11}
#### Стиль 02-11

<div class="s-rule do">



**Назовите** файлы спецификации сквозного теста после функции, которую они тестируют, с суффиксом  `.e2e-spec`.


</div>



<div class="s-why">



**Почему?** Обеспечивает согласованный способ быстрой идентификации сквозных тестов.


</div>



<div class="s-why-last">



**Почему?** Обеспечивает сопоставление с образцом для участников тестирования и автоматизации сборки.


</div>







<table width="100%">









  <tr>

    <th>
      Тип теста
    </th>

    <th>
      Имена файлов
    </th>

  </tr>

  <tr style=top>

    <td>


      Сквозные тесты
    </td>

    <td>


      app.e2e-spec.ts

      heroes.e2e-spec.ts
    </td>

  </tr>

</table>



<a href="#toc">Вернуться к началу </a>

{@a 02-12}

{@a angular-ngmodule-names}
### Angular имена _NgModule_

{@a style-02-12}
#### Стиль 02-12


<div class="s-rule do">



**Добавьте** имя символа с суффиксом  `Module`.


</div>



<div class="s-rule do">



**Как** дать имя файла в  `.module.ts`  Расширение.


</div>



<div class="s-rule do">



**Назовите** модуль после имени функции и папки, в которой он находится


</div>



<div class="s-why">



**Почему?** Обеспечивает согласованный способ быстрой идентификации и ссылки на модули.


</div>



<div class="s-why">



**Почему?** Верхний случай с верблюдом является обычным для идентификации объектов, которые могут быть созданы с помощью конструктора.


</div>



<div class="s-why-last">



**Почему?** Легко идентифицирует модуль как корень одноименной функции.


</div>



<div class="s-rule do">



**Сделать** суффикс имени класса _RoutingModule_ с  `RoutingModule`.


</div>



<div class="s-rule do">



**Есть ли** конец имени файла в _RoutingModule_ с  `-routing.module.ts`.


</div>



<div class="s-why-last">



**Почему?**  `RoutingModule` - это модуль, предназначенный исключительно для настройки Angular маршрутизатора.
Согласованное соглашение между классами и именами файлов позволяет легко находить и проверять эти модули.

</div>



<table width="100%">









  <tr>

    <th>
      Символ Название
    </th>

    <th>
      Имя файла
    </th>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppModule { }
      </code-example>

    </td>

    <td>


      app.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class HeroesModule { }
      </code-example>

    </td>

    <td>


      heroes.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class VillainsModule { }
      </code-example>

    </td>

    <td>


      villains.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class AppRoutingModule { }
      </code-example>

    </td>

    <td>


      app-routing.module.ts
    </td>

  </tr>

  <tr style=top>

    <td>

      <code-example hideCopy class="no-box">
        @NgModule({ ... })
        export class HeroesRoutingModule { }
      </code-example>

    </td>

    <td>


      heroes-routing.module.ts
    </td>

  </tr>

</table>


<a href="#toc">Вернуться к началу </a>


{@a application-structure-and-ngmodules}
## Структура приложения и NgModules

Имейте краткосрочный взгляд на реализацию и долгосрочное видение. Начните с малого, но имейте в виду, где приложение движется в будущем.

Весь код приложения находится в папке с именем  `src`.
Все функциональные области находятся в отдельной папке с собственным NgModule.

Весь контент - один актив на файл. Каждый компонент, сервис и канал находятся в своем собственном файле.
Все скрипты сторонних поставщиков хранятся в другой папке, а не в  `src`  папка.
Вы не написали их, и вы не хотите, чтобы они загромождали  `src`.
Используйте соглашения об именах файлов в этом руководстве.
<a href="#toc">Вернуться к началу </a>

{@a 04-01}

{@a lift}
### _LIFT_

{@a style-04-01}
#### Стиль 04-01


<div class="s-rule do">



**Есть ли** структурировать приложение такое, что вы можете**L**код ocate быстро
**Я с**первого взгляда опишу код
сохраните структуру **F**lattest, которую вы можете, и
**Т**гу, чтобы быть сухим.


</div>



<div class="s-rule do">



**Do** определяет структуру, чтобы следовать этим четырех основных принципов, перечисленных в порядке важности.


</div>



<div class="s-why-last">



**Почему?** LIFT обеспечивает согласованную структуру, которая хорошо масштабируется, является модульной и облегчает повышение эффективности разработки за счет быстрого поиска кода.
Для подтверждения своей интуиции о конкретной структуре, спросите:
_Могу ли я быстро открыть и начать работу со всеми соответствующими файлами для этой функции_?


</div>

<a href="#toc">Вернуться к началу </a>

{@a 04-02}

{@a locate}
### разместить

{@a style-04-02}
#### Стиль 04-02


<div class="s-rule do">



**Делайте** поиск кода интуитивно понятным, простым и быстрым.


</div>



<div class="s-why-last">



**Почему?** Для эффективной работы вы должны быть в состоянии быстро найти файлы
особенно когда вы не знаете (или не помните) файл _names_.
Хранение связанных файлов рядом друг с другом в интуитивно понятном месте экономит время.
Описательная структура папок имеет огромное значение для вас и людей, которые следуют за вами.


</div>

<a href="#toc">Вернуться к началу </a>

{@a 04-03}

{@a identify}
### Определить

{@a style-04-03}
#### Стиль 04-03


<div class="s-rule do">



**Назовите** файл так, чтобы вы сразу знали, что он содержит и представляет.


</div>



<div class="s-rule do">



**Будьте** понятны с именами файлов и сохраняйте содержимое файла только для одного компонента.


</div>



<div class="s-rule avoid">



**Избегайте** файлы с несколькими компонентами, несколькими службами или смесью.


</div>



<div class="s-why-last">



**Почему?** Тратьте меньше времени на поиски кода и повышайте эффективность.
Длинные имена файлов намного лучше, чем сокращенные, но короткие имена.


</div>



<div class="alert is-helpful">



Может быть выгодно отклоняться от правила _one-thing-per-file_ когда
у вас есть набор небольших тесно связанных функций, которые лучше обнаруживаются и понимаются
в одном файле, чем в нескольких файлах. Остерегайтесь этой лазейки.


</div>

<a href="#toc">Вернуться к началу </a>


{@a 04-04}

{@a flat}
### Flat

{@a style-04-04}
#### Стиль 04-04

<div class="s-rule do">



**Как** сохранить плоскую структуру папок как можно дольше.


</div>



<div class="s-rule consider">



**Рассмотрите возможность** создания подпапок, когда папка достигает семи или более файлов.


</div>



<div class="s-rule consider">



**Рассмотрите возможность** настройки среды IDE, чтобы скрыть отвлекающие, не относящиеся к делу файлы, такие как сгенерированные  `.js`  и  `.js.map`  файлы.


</div>



<div class="s-why-last">



**Почему?** Никто не хочет искать файл по семи уровням папок.
Плоская структура легко сканируется.

С другой стороны,
<a href="https://en.wikipedia.org/wiki/The_Magical_Number_Seven,_Plus_or_Minus_Two">психологи верят </a>
что люди начинают бороться, когда количество соседних интересных вещей превышает девять.
Поэтому, когда в папке содержится десять или более файлов, возможно, пора создавать подпапки.

Основывайте свое решение на своем уровне комфорта.
Используйте более плоскую структуру, пока не будет очевидной ценности для создания новой папки.


</div>

<a href="#toc">Вернуться к началу </a>


{@a 04-05}

{@a t-dry-try-to-be-dry}
### _T-DRY_ (постарайтесь быть _DRY_)

{@a style-04-05}
#### Стиль 04-05

<div class="s-rule do">



**Как** быть DRY (не повторяться).


</div>



<div class="s-rule avoid">



**Старайтесь не** быть настолько СУХИМ, что жертвуете читабельностью.


</div>



<div class="s-why-last">



**Почему?** Быть СУХИМым важно, но не важно, если оно жертвует другими элементами ЛИФТА.
Вот почему это называется _T-DRY_.
Например, излишне называть шаблон  `hero-view.component.html`  потому что
с  `.html`  Расширение, это, очевидно, представление.
Но если что-то неочевидно или отходит от условностей, то изложите это.


</div>

<a href="#toc">Вернуться к началу </a>


{@a 04-06}

{@a overall-structural-guidelines}
### Общие структурные рекомендации

{@a style-04-06}
#### Стиль 04-06

<div class="s-rule do">



**Как** начать с малого, но имейте в виду, когда приложение движется вниз по дороге.


</div>



<div class="s-rule do">



**Делать** иметь краткосрочный взгляд на реализацию и долгосрочное видение.


</div>



<div class="s-rule do">



**Do** поставить все кода приложения в папку с именем  `src`.


</div>



<div class="s-rule consider">



**Рассмотрите возможность** создания папки для компонента, когда у него есть несколько сопровождающих файлов (`.ts`, `.html`, `.css`  и  `.spec`).


</div>



<div class="s-why">



**Почему?** Помогает сохранять структуру приложения небольшой и простой в обслуживании на ранних стадиях, а также легко развиваться по мере роста приложения.


</div>



<div class="s-why-last">



**Почему?** Компоненты часто имеют четыре файла (например,  `*.html`, `*.css`, `*.ts`  и  `*.spec.ts`) и может быстро загромождать папку.


</div>



{@a file-tree}


Вот послушная папки и файлы структура:


<div class='filetree'>

  <div class='file'>
    <корень проекта>
  </div>

  <div class='children'>

    <div class='file'>
      ЦСИ
    </div>

    <div class='children'>

      <div class='file'>
        приложение
      </div>

      <div class='children'>

        <div class='file'>
          ядро
        </div>

        <div class='children'>

          <div class='file'>
            exception.service.ts | spec.ts
          </div>

          <div class='file'>
            пользовательский profile.service.ts | spec.ts
          </div>

        </div>

        <div class='file'>
          герои
        </div>

        <div class='children'>

          <div class='file'>
            герой
          </div>

          <div class='children'>

            <div class='file'>
              hero.component.ts | HTML | CSS | spec.ts
            </div>

          </div>

          <div class='file'>
            список героев
          </div>

          <div class='children'>

            <div class='file'>
              герой-list.component.ts | HTML | CSS | spec.ts
            </div>

          </div>

          <div class='file'>
            общий
          </div>

          <div class='children'>

            <div class='file'>
              герой-button.component.ts | HTML | CSS | spec.ts
            </div>

            <div class='file'>
              hero.model.ts
            </div>

            <div class='file'>
              hero.service.ts | spec.ts
            </div>

          </div>

          <div class='file'>
            heroes.component.ts | HTML | CSS | spec.ts
          </div>

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>

        </div>

        <div class='file'>
          поделился
        </div>

        <div class='children'>

          <div class='file'>
            shared.module.ts
          </div>

          <div class='file'>
            Инициализационные-caps.pipe.ts | spec.ts
          </div>

          <div class='file'>
            фильтр-text.component.ts | spec.ts
          </div>

          <div class='file'>
            фильтр-text.service.ts | spec.ts
          </div>

        </div>

        <div class='file'>
          злодеи
        </div>

        <div class='children'>

          <div class='file'>
            злодей
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            список злодеев
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            поделился
          </div>

          <div class='children'>

            <div class='file'>
              ...
            </div>

          </div>

          <div class='file'>
            villains.component.ts | HTML | CSS | spec.ts
          </div>

          <div class='file'>
            villains.module.ts
          </div>

          <div class='file'>
            злодеи-routing.module.ts
          </div>

        </div>

        <div class='file'>
          app.component.ts | HTML | CSS | spec.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

        <div class='file'>
          app-routing.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        ...
      </div>

    </div>

    <div class='file'>
      node_modules / ...
    </div>

    <div class='file'>
      ...
    </div>

  </div>

</div>





<div class="alert is-helpful">



В то время как компоненты в выделенных папках широко предпочтены
Другой вариант для небольших приложений - оставить компоненты плоскими (не в отдельной папке).
Это добавляет до четырех файлов в существующую папку, но также уменьшает вложенность папки.
Что бы вы ни выбрали, будьте последовательны.


</div>

<a href="#toc">Вернуться к началу </a>

{@a 04-07}

{@a folders-by-feature-structure}
### Структура _Folders-by-feature_

{@a style-04-07}
#### Стиль 04-07


<div class="s-rule do">

**Делать** создавать папки, названные для области функций, которую они представляют.

</div>

<div class="s-why">

**Почему?** Разработчик может найти код и определить, что представляет собой каждый файл
с одного взгляда. Структура настолько плоская, насколько это возможно, и в ней нет повторяющихся или избыточных имен.

</div>

<div class="s-why">

**Почему?** Руководства LIFT все покрыты.

</div>

<div class="s-why">

**Почему?** Помогает уменьшить загромождение приложения путем организации
содержание и поддержание их в соответствие с руководящими принципами LIFT.

</div>

<div class="s-why">

**Почему?** При наличии большого количества файлов, например 10+,
найти их проще с последовательной структурой папок
и сложнее в плоской конструкции.

</div>

<div class="s-rule do">

**Как** создать NgModule для каждой области функций.

</div>

<div class="s-why">

**Почему?** NgModules упрощают загрузку маршрутизируемых функций.

</div>

<div class="s-why-last">

**Почему?** Модули Ng облегчают изоляцию, тестирование и повторное использование функций.

</div>

<div>

  Для получения дополнительной информации обратитесь к <a href="#file-tree">этому примеру с папкой и структурой файла. </a>

</div>

<a href="#toc">Вернуться к началу

</a>


{@a 04-08}

{@a app-root-module}
### Приложение _root module_

{@a style-04-08}
#### Стиль 04-08

<div class="s-rule do">



**Есть ли** создать NgModule в корневой папке приложения,
например, в  `/src/app`.


</div>



<div class="s-why">



**Почему?** Каждое приложение требует как минимум один корневой NgModule.


</div>



<div class="s-rule consider">



**Подумайте над** названием корневого модуля  `app.module.ts`.


</div>



<div class="s-why-last">



**Почему?** Облегчает поиск и идентификацию корневого модуля.


</div>



<code-example path="styleguide/src/04-08/app/app.module.ts" region="example" header="app/app.module.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a 04-09}

{@a feature-modules}
### Функциональные модули

{@a style-04-09}
#### Стиль 04-09


<div class="s-rule do">



**Есть ли** создать NgModule для всех различных функций в приложении;
например,  `Heroes`  Особенность.


</div>



<div class="s-rule do">



**Поместите** функциональный модуль в ту же именованную папку, что и область функций;
например, в  `app/heroes`.


</div>



<div class="s-rule do">



**Есть ли** имя файла модуль особенности, отражающее имя области признака
и папка; например,  `app/heroes/heroes.module.ts`.


</div>



<div class="s-rule do">



**Есть ли** имя символа модуля особенности, отражающее имя функции
область, папка и файл; например,  `app/heroes/heroes.module.ts`  определяет  `HeroesModule`.


</div>



<div class="s-why">



**Почему?** Функциональный модуль может показывать или скрывать свою реализацию от других модулей.


</div>



<div class="s-why">



**Почему?** Функциональный модуль идентифицирует отдельные наборы связанных компонентов, которые составляют функциональную область.


</div>



<div class="s-why">



**Почему?** Функциональный модуль может быть легко направлен как охотно, так и лениво.


</div>



<div class="s-why">



**Почему?** Функциональный модуль определяет четкие границы между конкретными функциями и другими функциями приложения.


</div>



<div class="s-why">



**Почему?** Функциональный модуль помогает уточнить и упростить распределение обязанностей по разработке для разных групп.


</div>



<div class="s-why-last">



**Почему?** Функциональный модуль может быть легко изолирован для тестирования.


</div>

<a href="#toc">Вернуться к началу </a>

{@a 04-10}

{@a shared-feature-module}
### Общий функциональный модуль

{@a style-04-10}
#### Стиль 04-10


<div class="s-rule do">



**Как** создать модуль функции с именем  `SharedModule`  в  `shared`  папка;
например,  `app/shared/shared.module.ts`  определяет  `SharedModule`.


</div>



<div class="s-rule do">



**Есть ли** DECLARE компоненты, директива и трубы в общем модуле, когда те
элементы будут использоваться повторно и на них будут ссылаться компоненты, объявленные в других функциональных модулях.


</div>



<div class="s-rule consider">



**Попробуйте** использовать имя SharedModule, когда содержимое общего ресурса
на модуль ссылаются по всему приложению.


</div>



<div class="s-rule avoid">



**Рассмотрим** _не_ предоставление услуг в общих модулях. Услуги обычно есть
синглтоны, которые предоставляются один раз для всего приложения или
в конкретном функциональном модуле. Однако есть исключения. Например, в следующем примере кода обратите внимание, что  `SharedModule`  предоставляет  `FilterTextService`  . Это приемлемо здесь, потому что сервис не имеет состояния, то есть на потребителей сервиса новые экземпляры не влияют.


</div>



<div class="s-rule do">



**Как** импортировать все модули, необходимые для активов в  `SharedModule`  ;
например,  `CommonModule`  и  `FormsModule`.


</div>



<div class="s-why">



**Почему?**  `SharedModule` будет содержать компоненты, директивы и каналы
это может нуждаться в функциях из другого общего модуля; например
 `ngFor ` in ` CommonModule`.


</div>



<div class="s-rule do">



**Есть ли** декларировать все компоненты, директивы, и трубы в  `SharedModule`.


</div>



<div class="s-rule do">



**Как** экспортировать все символы из  `SharedModule`  который нужно использовать другим функциональным модулям.


</div>



<div class="s-why">



**Почему?**  `SharedModule` существует, чтобы сделать часто используемые компоненты, директивы и каналы доступными для использования в шаблонах компонентов во многих других модулях.


</div>



<div class="s-rule avoid">



**Старайтесь не** указывать единого поставщика для всего приложения в  `SharedModule`  . Преднамеренные синглтоны в порядке. Береги себя.


</div>



<div class="s-why">



**Почему?** Ленивый загруженный функциональный модуль, который импортирует этот общий модуль, создаст собственную копию службы и, вероятно, приведет к нежелательным результатам.


</div>



<div class="s-why-last">



**Почему?** Вы не хотите, чтобы у каждого модуля был свой отдельный экземпляр одноэлементных сервисов.
Однако существует реальная опасность того, что это произойдет, если  `SharedModule`  предоставляет сервис.


</div>



<div class='filetree'>

  <div class='file'>
    ЦСИ
  </div>

  <div class='children'>

    <div class='file'>
      приложение
    </div>

    <div class='children'>

      <div class='file'>
        поделился
      </div>

      <div class='children'>

        <div class='file'>
          shared.module.ts
        </div>

        <div class='file'>
          Инициализационные-caps.pipe.ts | spec.ts
        </div>

        <div class='file'>
          фильтр-text.component.ts | spec.ts
        </div>

        <div class='file'>
          фильтр-text.service.ts | spec.ts
        </div>

      </div>

      <div class='file'>
        app.component.ts | HTML | CSS | spec.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

      <div class='file'>
        app-routing.module.ts
      </div>

    </div>

    <div class='file'>
      main.ts
    </div>

    <div class='file'>
      index.html
    </div>

  </div>

  <div class='file'>
    ...
  </div>

</div>





<code-tabs>

  <code-pane header="app/shared/shared.module.ts" path="styleguide/src/04-10/app/shared/shared.module.ts">

  </code-pane>

  <code-pane header="app/shared/init-caps.pipe.ts" path="styleguide/src/04-10/app/shared/init-caps.pipe.ts">

  </code-pane>

  <code-pane header="app/shared/filter-text/filter-text.component.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.component.ts">

  </code-pane>

  <code-pane header="app/shared/filter-text/filter-text.service.ts" path="styleguide/src/04-10/app/shared/filter-text/filter-text.service.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/04-10/app/heroes/heroes.component.ts">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/04-10/app/heroes/heroes.component.html">

  </code-pane>

</code-tabs>




<a href="#toc">Вернуться к началу </a>

{@a 04-11}

{@a lazy-loaded-folders}
### Ленивые загруженные папки

{@a style-04-11}
#### Стиль 04-11

Отдельная функция приложения или рабочий процесс могут быть *отложены* или *загружены по требованию,* а не при запуске приложения.


<div class="s-rule do">

**Do** поместить содержимое ленивых нагруженных функций в*ленивой загруженной папке *.
Типичная *папка с отложенной загрузкой* содержит *компонент маршрутизации*, его дочерние компоненты и связанные с ними ресурсы и модули.

</div>

<div class="s-why-last">

**Почему?** Папка позволяет легко идентифицировать и изолировать содержимое функции.

</div>

<a href="#toc">Вернуться к началу </a>

{@a 04-12}

{@a never-directly-import-lazy-loaded-folders}
### Никогда не импортируйте напрямую загруженные папки

{@a style-04-12}
#### Стиль 04-12


<div class="s-rule avoid">

**Избегайте** позволяя модулям в дочерних и родительских папках напрямую импортировать модуль в режиме*отложенной загрузки *.

</div>

<div class="s-why-last">

**Почему?** Непосредственный импорт и использование модуля загрузит его немедленно, когда предполагается загрузить его по требованию.

</div>

<a href="#toc">Вернуться к началу </a>

{@a components}
## Компоненты

{@a 05-03}

{@a components-as-elements}
### Компоненты как элементы

{@a style-05-03}
#### Стиль 05-03

<div class="s-rule do">

**Подумайте над тем, чтобы** дать компонентам селектор _element_, а не селекторы _attribute_ или _class_.

</div>

<div class="s-why">

**Почему?** Компоненты имеют шаблоны, содержащие HTML и необязательный синтаксис шаблонов Angular.
Они отображают контент.
Разработчики размещают компоненты на странице так же, как исходные элементы HTML и веб-компоненты.

</div>

<div class="s-why-last">

**Почему?** Проще распознать, что символ является компонентом, посмотрев html шаблона.

</div>

<div class="alert is-helpful">

Есть несколько случаев, когда вы даете компоненту атрибут, например, когда вы хотите дополнить встроенный элемент. Например, [Материал Дизайн](https://material.angular.io/components/button/overview) использует эту технику с  `<button mat-button>` . Однако вы не будете использовать эту технику на пользовательском элементе.

</div>

<code-example path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/hero-button/hero-button.component.ts">

</code-example>

<code-example path="styleguide/src/05-03/app/app.component.avoid.html" header="app/app.component.html">

</code-example>

<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-03/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-03/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">Вернуться к началу </a>

{@a 05-04}

{@a extract-templates-and-styles-to-their-own-files}
### Извлекайте шаблоны и стили в свои файлы

{@a style-05-04}
#### Стиль 05-04


<div class="s-rule do">

**Делать** Извлекать шаблоны и стили в отдельный файл, когда более 3 строк.

</div>



<div class="s-rule do">

**Есть ли** имя файла шаблона  `[component-name].component.html`, где [имя-компонента] - это имя компонента.

</div>

<div class="s-rule do">



**Назовите** файл стиля  `[component-name].component.css`, где [имя-компонента] - это имя компонента.


</div>



<div class="s-rule do">



**Выполните** указание _component-relative_ URL - адреса, с префиксом  `./`,


</div>



<div class="s-why">



**Почему?** Большие встроенные шаблоны и стили скрывают назначение и реализацию компонента, снижая удобочитаемость и удобство обслуживания.


</div>



<div class="s-why">



**Почему?** В большинстве редакторов синтаксические подсказки и фрагменты кода недоступны при разработке встроенных шаблонов и стилей.
Angular TypeScript Language Service (готовится к выпуску) обещает преодолеть этот недостаток для шаблонов HTML
в тех редакторах, которые его поддерживают; это не поможет со стилями CSS.


</div>



<div class="s-why">



**Почему?** Относительный _компонентный URL-адрес не требует изменений при перемещении файлов компонентов, если они остаются вместе.


</div>



<div class="s-why-last">



**Почему?**  `./` префикс - это стандартный синтаксис для относительных URL; не зависит от текущей способности Angular обойтись без этого префикса.



</div>



<code-example path="styleguide/src/05-04/app/heroes/heroes.component.avoid.ts" region="example" header="app/heroes/heroes.component.ts">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/heroes.component.ts" path="styleguide/src/05-04/app/heroes/heroes.component.ts" region="example">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.html" path="styleguide/src/05-04/app/heroes/heroes.component.html">

  </code-pane>

  <code-pane header="app/heroes/heroes.component.css" path="styleguide/src/05-04/app/heroes/heroes.component.css">

  </code-pane>

</code-tabs>



<a href="#toc">Вернуться к началу </a>

{@a 05-12}

{@a decorate-input-and-output-properties}
### Украсьте свойства _input_ и _output_

{@a style-05-12}
#### Стиль 05-12


<div class="s-rule do">



**Как** использовать  `@Input()`  и  `@Output()`  класса вместо  `inputs`  и  `outputs`  свойства
 `@Directive ` и ` @Component` метаданные:


</div>



<div class="s-rule consider">



**Рассмотреть вопрос о** размещении  `@Input()`  или  `@Output()`  в той же строке, что и свойство, которое оно украшает.


</div>



<div class="s-why">



**Почему?** Легче и удобочитаемее определить, какие свойства в классе являются входными или выходными.


</div>



<div class="s-why">



**Почему?** Если вам когда-либо понадобится переименовать свойство или имя события, связанного с
 `@Input() ` или ` @Output()`, вы можете изменить его в одном месте.


</div>



<div class="s-why">



**Почему?** Объявление метаданных, приложенное к директиве, короче и, следовательно, более читабельно.


</div>



<div class="s-why-last">



**Почему?** Помещение декоратора в одну строку _usually_ делает для более короткого кода и все еще легко идентифицирует свойство как вход или выход.
Поместите его в строку выше, когда это будет более читабельным.


</div>



<code-example path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/05-12/app/heroes/shared/hero-button/hero-button.component.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a 05-13}

{@a avoid-aliasing-inputs-and-outputs}
### Избегайте псевдонимов _inputs_ и _outputs_

{@a style-05-13}
#### Стиль 05-13


<div class="s-rule avoid">



**Избегайте** псевдонимов _input_ и _output_, кроме случаев, когда это служит важной цели.


</div>



<div class="s-why">



**Почему?** Два имени для одного и того же свойства (одно частное, одно публичное) по своей сути сбивают с толку.


</div>



<div class="s-why-last">



**Почему?** Вы должны использовать псевдоним, когда директива имя также _input_ собственность,
и имя директивы не описывает свойство.


</div>



<code-example path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/05-13/app/app.component.avoid.html" header="app/app.component.html">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/shared/hero-button/hero-button.component.ts" path="styleguide/src/05-13/app/heroes/shared/hero-button/hero-button.component.ts" region="example">

  </code-pane>

  <code-pane header="app/heroes/shared/hero-button/hero-highlight.directive.ts" path="styleguide/src/05-13/app/heroes/shared/hero-highlight.directive.ts">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-13/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">Вернуться к началу </a>

{@a 05-14}

{@a member-sequence}
### Последовательность членов

{@a style-05-14}
#### Стиль 05-14


<div class="s-rule do">



**Размещайте** свойства сверху, а затем методы.


</div>



<div class="s-rule do">



**Поместите** частных членов после открытых членов в алфавитном порядке.


</div>



<div class="s-why-last">



**Почему?** Размещение членов в последовательной последовательности позволяет легко читать и
помогает мгновенно определить, какие элементы компонента служат какой цели.


</div>



<code-example path="styleguide/src/05-14/app/shared/toast/toast.component.avoid.ts" region="example" header="app/shared/toast/toast.component.ts">

</code-example>





<code-example path="styleguide/src/05-14/app/shared/toast/toast.component.ts" region="example" header="app/shared/toast/toast.component.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>

{@a 05-15}

{@a delegate-complex-component-logic-to-services}
### Делегировать сложную компонентную логику сервисам

{@a style-05-15}
#### Стиль 05-15


<div class="s-rule do">



**Есть ли** предел логики в компоненте только, что требуется для просмотра. Вся остальная логика должна быть делегирована сервисам.


</div>



<div class="s-rule do">



**Как** переместить многоразовую логику услуги и держать компоненты просты и направлено на их прямое назначении.


</div>



<div class="s-why">



**Почему?** Логика может быть повторно использована несколькими компонентами, если она размещена внутри службы и доступна через функцию.


</div>



<div class="s-why">



**Почему?** Логика в сервисе может быть легче изолирована в модульном тесте, в то время как логика вызова в компоненте может быть легко смоделирована.


</div>



<div class="s-why">



**Почему?** Удаляет зависимости и скрывает детали реализации от компонента.


</div>



<div class="s-why-last">



**Почему?** Делает компонент тонким, аккуратным и сфокусированным.


</div>



<code-example path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.avoid.ts" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>





<code-example path="styleguide/src/05-15/app/heroes/hero-list/hero-list.component.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>

{@a 05-16}

{@a dont-prefix-output-properties}
### Не добавляйте префикс _output_ свойств

{@a style-05-16}
#### Стиль 05-16


<div class="s-rule do">



**Называйте** события без префикса  `on`.


</div>



<div class="s-rule do">



**Делать** имена методов обработчиков событий с префиксом  `on`  следует имя события.


</div>



<div class="s-why">



**Почему?** Это согласуется со встроенными событиями, такими как нажатия кнопок.


</div>



<div class="s-why-last">



**Почему?** Angular допускает [альтернативный синтаксис](guide/template-syntax#binding-syntax)  `on-*` . Если само событие было префиксом  `on`  этом приведет к  `on-onEvent`  привязки.


</div>



<code-example path="styleguide/src/05-16/app/heroes/hero.component.avoid.ts" region="example" header="app/heroes/hero.component.ts">

</code-example>





<code-example path="styleguide/src/05-16/app/app.component.avoid.html" header="app/app.component.html">

</code-example>





<code-tabs>

  <code-pane header="app/heroes/hero.component.ts" path="styleguide/src/05-16/app/heroes/hero.component.ts" region="example">

  </code-pane>

  <code-pane header="app/app.component.html" path="styleguide/src/05-16/app/app.component.html">

  </code-pane>

</code-tabs>



<a href="#toc">Вернуться к началу </a>

{@a 05-17}

{@a put-presentation-logic-in-the-component-class}
### Поместите логику представления в класс компонента

{@a style-05-17}
#### Стиль 05-17


<div class="s-rule do">



**Do** поместить логику представления в классе компоненты, а не в шаблоне.


</div>



<div class="s-why">



**Почему?** Логика будет содержаться в одном месте (класс компонента), а не распространяться в двух местах.


</div>



<div class="s-why-last">



**Почему?** Хранение логики представления компонента в классе вместо шаблона улучшает тестируемость, ремонтопригодность и возможность повторного использования.


</div>



<code-example path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.avoid.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>





<code-example path="styleguide/src/05-17/app/heroes/hero-list/hero-list.component.ts" region="example" header="app/heroes/hero-list/hero-list.component.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a directives}
## Директивы

{@a 06-01}

{@a use-directives-to-enhance-an-element}
### Используйте директивы для улучшения элемента

{@a style-06-01}
#### Стиль 06-01


<div class="s-rule do">



**Есть** указания атрибутов использования, когда у вас есть логик представления без шаблона.


</div>



<div class="s-why">



**Почему?** У директив атрибута нет связанного шаблона.


</div>



<div class="s-why-last">



**Почему?** К элементу может быть применено более одной директивы атрибута.


</div>



<code-example path="styleguide/src/06-01/app/shared/highlight.directive.ts" region="example" header="app/shared/highlight.directive.ts">

</code-example>





<code-example path="styleguide/src/06-01/app/app.component.html" header="app/app.component.html">

</code-example>



<a href="#toc">Вернуться к началу </a>

{@a 06-03}

{@a hostlistener/hostbinding-decorators-versus-host-metadata}
### _HostListener _ / _HostBinding_ декораторы против _host_ метаданных

{@a style-06-03}
#### Стиль 06-03


<div class="s-rule consider">



**Рассмотреть вопрос о** предпочтении  `@HostListener`  и  `@HostBinding`  к
 `host` свойство  `@Directive ` и ` @Component` декораторов.


</div>



<div class="s-rule do">



**Будьте** последовательны в своем выборе.


</div>



<div class="s-why-last">



**Почему?** Свойство, связанное с  `@HostBinding`  или метод, связанный с  `@HostListener` 
может быть изменено только в одном месте - в классе директивы.
Если вы используете  `host`  свойство метаданных, вы должны изменить оба объявления свойства / метода в
класс директивы и метаданные в декораторе, связанные с директивой.


</div>



<code-example path="styleguide/src/06-03/app/shared/validator.directive.ts" header="app/shared/validator.directive.ts">

</code-example>



Сравните с менее предпочтительным  `host`  альтернатива метаданных.


<div class="s-why-last">



**Почему?**  `host` метаданные - это только один термин, который нужно запомнить, и он не требует дополнительного импорта ES.


</div>



<code-example path="styleguide/src/06-03/app/shared/validator2.directive.ts" header="app/shared/validator2.directive.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a services}
## Услуги

{@a 07-01}

{@a services-are-singletons}
### Услуги одиночные

{@a style-07-01}
#### Стиль 07-01


<div class="s-rule do">



**Есть ли** услуги использования в качестве одиночек в пределах одного инжектора. Используйте их для обмена данными и функциональностью.


</div>



<div class="s-why">



**Почему?** Сервисы идеально подходят для обмена методами в функциональной области или в приложении.


</div>



<div class="s-why-last">



**Почему?** Сервисы идеально подходят для обмена данными в оперативной памяти.


</div>



<code-example path="styleguide/src/07-01/app/heroes/shared/hero.service.ts" region="example" header="app/heroes/shared/hero.service.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>

{@a 07-02}

{@a single-responsibility}
### Единственная ответственность

{@a style-07-02}
#### Стиль 07-02


<div class="s-rule do">



**Создавайте** сервисы с единственной ответственностью, которая инкапсулирована их контекстом.


</div>



<div class="s-rule do">



**Как** создать новую услугу, как только сервис начинает превышать эту особую цель.


</div>



<div class="s-why">



**Почему?** Когда служба имеет несколько обязанностей, это становится трудно проверить.


</div>



<div class="s-why-last">



**Почему?** Когда служба имеет несколько обязанностей, каждый компонент или служба, которая внедряет ее, теперь несет вес их всех.


</div>

<a href="#toc">Вернуться к началу </a>

{@a 07-03}

{@a providing-a-service}
### Предоставление услуги

{@a style-07-03}
#### Стиль 07-03


<div class="s-rule do">



**Есть ли** предоставлять услуги с приложением корневого инжектора в  `@Injectable`  декоратор сервиса.


</div>



<div class="s-why">



**Почему?** Angular инжектор является иерархическим.


</div>



<div class="s-why">



**Почему?** Когда вы предоставляете сервис корневому инжектору, этот экземпляр сервиса является общим и доступным для каждого класса, который нуждается в сервисе. Это идеально, когда служба разделяет методы или состояние.



</div>



<div class="s-why">



**Почему?** Когда вы регистрируете услугу в  `@Injectable` декоратор сервиса, инструменты оптимизации, такие как те, которые используются в [Angular CLI](cli)производственных сборках могут выполнять встряхивание дерева и удалять сервисы, которые не используются вашим приложением.

</div>



<div class="s-why-last">



**Почему?** Это не идеально, когда два разных компонента нуждаются в разных экземплярах службы. В этом сценарии было бы лучше предоставлять услугу на уровне компонента, который нуждается в новом и отдельном экземпляре.


</div>

<code-example path="dependency-injection/src/app/tree-shaking/service.ts" header="src/app/treeshaking/service.ts"></code-example>




<a href="#toc">Вернуться к началу </a>

{@a 07-04}

{@a use-the-@injectable-class-decorator}
### Используйте декоратор класса @Injectable ()

{@a style-07-04}
#### Стиль 07-04


<div class="s-rule do">



**Как** использовать  `@Injectable()`  класса вместо  `@Inject`  параметров при использовании типов в качестве токенов для зависимостей сервиса.


</div>



<div class="s-why">



**Почему?** Механизм Angular Dependency Injection (DI) разрешает собственный сервис
зависимости, основанные на объявленных типах параметров конструктора этого сервиса.


</div>



<div class="s-why-last">



**Почему?** Когда служба принимает только зависимости, связанные с токенами типа,  `@Injectable()`  гораздо менее многословен по сравнению с использованием  `@Inject()`  для каждого отдельного параметра конструктора.


</div>



<code-example path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.avoid.ts" region="example" header="app/heroes/shared/hero-arena.service.ts">

</code-example>





<code-example path="styleguide/src/07-04/app/heroes/shared/hero-arena.service.ts" region="example" header="app/heroes/shared/hero-arena.service.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a data-services}
## Службы данных

{@a 08-01}

{@a talk-to-the-server-through-a-service}
### Поговорите с сервером через сервис

{@a style-08-01}
#### Стиль 08-01


<div class="s-rule do">



**Делать** логика рефакторинга для выполнения операций с данными и взаимодействия с данными для службы.


</div>



<div class="s-rule do">



**Сделайте** службы данных ответственными за вызовы XHR, локальное хранилище, сохранение в памяти или любые другие операции с данными.


</div>



<div class="s-why">



**Почему?** Компонент несет ответственность за представление и сбор информации для просмотра. Его не должно волновать, как он получает данные, просто он знает, кого просить об этом. Разделение служб данных перемещает логику того, как доставить его в службу данных, и позволяет компоненту быть более простым и более сфокусированным на представлении.


</div>



<div class="s-why">



**Почему?** Это облегчает тестирование (ложное или реальное) вызовов данных при тестировании компонента, который использует службу данных.


</div>



<div class="s-why-last">



**Почему?** Детали управления данными, такие как заголовки, методы HTTP,
Кэширование, обработка ошибок и логика повторных попыток не имеют отношения к компонентам
и другие потребители данных.

Служба данных инкапсулирует эти детали. Проще развить это
детали внутри сервиса, не влияющие на его потребителей. И это
проще протестировать потребителей с помощью имитационных реализаций сервиса.


</div>

<a href="#toc">Вернуться к началу </a>


{@a lifecycle-hooks}
## Крючки жизненного цикла

Используйте ловушки жизненного цикла, чтобы использовать важные события, предоставляемые Angular.

<a href="#toc">Вернуться к началу</a>

{@a 09-01}

{@a implement-lifecycle-hook-interfaces}
### Реализация интерфейсов ловушек жизненного цикла

{@a style-09-01}
#### Стиль 09-01


<div class="s-rule do">



**Как** реализовать интерфейсы жизненного цикла крючков.


</div>



<div class="s-why-last">



**Почему?** Интерфейсы жизненного цикла предписывают типизированный метод
подписи. Используйте эти подписи, чтобы пометить орфографические и синтаксические ошибки.


</div>



<code-example path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.avoid.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>





<code-example path="styleguide/src/09-01/app/heroes/shared/hero-button/hero-button.component.ts" region="example" header="app/heroes/shared/hero-button/hero-button.component.ts">

</code-example>



<a href="#toc">Вернуться к началу </a>


{@a appendix}
## Приложение

Полезные инструменты и советы по Angular.

<a href="#toc">Вернуться к началу </a>

{@a A-01}

{@a codelyzer}
### Codelyzer

{@a style-a-01}
#### Стиль А-01


<div class="s-rule do">



**Ли** использование [codelyzer](https://www.npmjs.com/package/codelyzer)чтобы следовать этому руководству.


</div>



<div class="s-rule consider">



**Рассмотрите возможность** корректировки правил в codelyzer в соответствии с вашими потребностями.


</div>

<a href="#toc">Вернуться к началу </a>

{@a A-02}

{@a file-templates-and-snippets}
### Шаблоны файлов и фрагменты

{@a style-a-02}
#### Стиль А-02


<div class="s-rule do">



**Есть** шаблоны использования файлов или фрагменты, чтобы помочь последующих последовательных стилей и моделей. Вот шаблоны и / или фрагменты для некоторых редакторов веб-разработки и IDE.


</div>



<div class="s-rule consider">

**Рассмотрите возможность** использования [фрагменты](https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2)для [кода Visual Studio](https://code.visualstudio.com/)которые следуют этим стилям и рекомендациям.

<a href="https://marketplace.visualstudio.com/items?itemName=johnpapa.Angular2">
  <img src="generated/images/guide/styleguide/use-extension.gif" alt="Use Extension">
</a>

**Подумайте об** использовании [фрагментов](https://atom.io/packages/angular-2-typescript-snippets)для [Atom](https://atom.io/)которые следуют этим стилям и рекомендациям.

**Подумайте об** использовании [фрагментов](https://github.com/orizens/sublime-angular2-snippets)для [Sublime Text](http://www.sublimetext.com/)которые следуют этим стилям и рекомендациям.

**Попробуйте** использовать [фрагменты](https://github.com/mhartington/vim-angular2-snippets)для [Vim](http://www.vim.org/)которые следуют этим стилям и рекомендациям.


</div>

<a href="#toc">Вернуться к началу </a>
