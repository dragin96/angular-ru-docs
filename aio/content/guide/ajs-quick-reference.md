{@a angularjs-to-angular-concepts-quick-reference}
# AngularJS to Angular concept: краткий справочник


{@a top}


_Angular_ это имя для Angular сегодня и завтра.
_AngularJS_ - имя для всех v 1.x версий Angular.

Это руководство поможет вам перейти от AngularJS к Angular
сопоставляя синтаксис AngularJS с эквивалентным синтаксисом Angular.


**Смотрите Angular синтаксис в этом <live-example name="ajs-quick-reference"></live-example>**.

{@a template-basics}
## Основы шаблонов
Шаблоны являются частью пользовательского приложения Angular и написаны на HTML.
В следующей таблице перечислены некоторые ключевые функции шаблона AngularJS с эквивалентным синтаксисом шаблона Angular.


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>

      ### Привязки / интерполяция

      <code-example hideCopy>
        Your favorite hero is: {{vm.favoriteHero}}
      </code-example>


      В AngularJS выражение в фигурных скобках обозначает одностороннее связывание.
      Это связывает значение элемента со свойством в контроллере
      связан с этим шаблоном.

      При использовании `controller as` синтаксис
      привязка начинается с псевдонима контроллера (`vm`  или  `$ctrl`) потому что вы
      должны быть конкретными об источнике привязки.
    </td>

    <td>


      ### Привязки / интерполяция

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="interpolation"></code-example>


      В Angular шаблонное выражение в фигурных скобках по-прежнему обозначает одностороннюю привязку.
      Это связывает значение элемента со свойством компонента.
      Контекст связывания подразумевается и всегда является
      связанный компонент, поэтому он не нуждается в ссылочной переменной.

      Для получения дополнительной информации см. [Интерполяция](guide/template-syntax#interpolation)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Фильтры

      <code-example hideCopy>
        &lt;td>{{movie.title | uppercase}}&lt;/td>
      </code-example>


      Чтобы отфильтровать выходные данные в шаблонах AngularJS, используйте символ канала (|) и один или несколько фильтров.

      Этот пример фильтрует  `title`  Свойство в верхнем регистре.
    </td>

    <td>


      ### Трубы

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="uppercase"></code-example>


      В Angular вы используете похожий синтаксис с символом канала (|) для фильтрации вывода, но теперь вы называете их **каналами**.
      Многие (но не все) из встроенных фильтров AngularJS есть
      трубы встроенные в Angular.

      Для получения дополнительной информации см. [Фильтры / трубы](guide/ajs-quick-reference#filters-pipes)ниже.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Локальные переменные

      <code-example hideCopy format="">
        &lt;tr ng-repeat="movie in vm.movies">
          &lt;td>{{movie.title}}&lt;/td>
        &lt;/tr>
      </code-example>


      Вот,  `movie`  - это определенная пользователем локальная переменная.
    </td>

    <td>


      ### Входные переменные

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="local"></code-example>


      Angular имеет истинные входные переменные шаблона, которые явно определены с использованием  `let`  ключевое слово.

      Для получения дополнительной информации см. [Микросинтаксис ngFor](guide/template-syntax#microsyntax)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

</table>


{@a template-directives}
## Шаблонные директивы
AngularJS предоставляет более семидесяти встроенных директив для шаблонов.
Многие из них не нужны в Angular из-за его более способной и выразительной системы привязки.
Ниже приведены некоторые ключевые встроенные директивы AngularJS и их эквиваленты в Angular.


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### ng-app

      <code-example hideCopy>
        &lt;body ng-app="movieHunter">
      </code-example>


      Процесс запуска приложения называется **начальной загрузкой**.

      Хотя вы можете загрузить приложение AngularJS в коде
      многие приложения запускаются декларативно с  `ng-app`  Директива
      присвоив ему название модуля приложения (`movieHunter`).
    </td>

    <td>


      ### Инициализация

      <code-example hideCopy path="ajs-quick-reference/src/main.ts" header="main.ts"></code-example>
      <br>

      <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts" header="app.module.ts"></code-example>


      У Angular нет директивы для начальной загрузки.
      Чтобы запустить приложение в коде, явно загрузите корневой модуль приложения (`AppModule`)
      в  `main.ts` 
      и корневой компонент приложения (`AppComponent`) в  `app.module.ts`.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-class

      <code-example hideCopy format="">
        &lt;div ng-class="{active: isActive}">
        &lt;div ng-class="{active: isActive,
                           shazam: isImportant}">
      </code-example>


      В AngularJS,  `ng-class`  Директива включает / исключает CSS-классы
      на основе выражения. Это выражение часто является объектом управления ключ-значение с каждым
      ключ объекта, определенного как имя класса CSS, а каждое значение определяется как выражение шаблона
      который оценивается как логическое значение.

      В первом примере  `active`  класс применяется к элементу, если  `isActive`  это правда.

      Вы можете указать несколько классов, как показано во втором примере.
    </td>

    <td>


      ### ngClass

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngClass"></code-example>


      В Angular  `ngClass`  Директива работает аналогично.
      Включает / исключает классы CSS, основанные на выражении.

      В первом примере  `active`  класс применяется к элементу, если  `isActive`  это правда.

      Вы можете указать несколько классов, как показано во втором примере.

      В Angular также есть **привязка классов**, которая является хорошим способом добавления или удаления одного класса
      как показано в третьем примере.

      Для получения дополнительной информации см. [Привязка атрибутов, классов и стилей](guide/template-syntax#other-bindings)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-click

      <code-example hideCopy format="">
        &lt;button ng-click="vm.toggleImage()">
        &lt;button ng-click="vm.toggleImage($event)">
      </code-example>


      В AngularJS,  `ng-click`  Директива позволяет вам указать пользовательское поведение при нажатии на элемент.

      В первом примере, когда пользователь нажимает кнопку,  `toggleImage()`  в контроллере, на который ссылается  `vm`    `controller as` псевдоним выполняется.

      Второй пример демонстрирует прохождение в  `$event`  объект, который предоставляет подробную информацию о событии
      к контроллеру.
    </td>

    <td>


      ### Привязать к  `click`  событие

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="event-binding"></code-example>


      AngularJS основанные на событиях директивы не существуют в Angular.
      Вместо этого определите одностороннюю привязку из представления шаблона к компоненту, используя **привязку событий**.

      Для привязки события определите имя целевого события в скобках и
      укажите шаблонную инструкцию в кавычках справа от равенства. Angular тогда
      устанавливает обработчик события для целевого события. Когда событие поднято, обработчик
      выполняет оператор шаблона.

      В первом примере, когда пользователь нажимает кнопку,  `toggleImage()`  в связанном компоненте выполняется.

      Второй пример демонстрирует прохождение в  `$event`  объект, который предоставляет подробную информацию о событии
      к компоненту.

      Список событий DOM см. По адресу: https://developer.mozilla.org/en-US/docs/Web/Events.

      Для получения дополнительной информации см. [Привязка к событию](guide/template-syntax#event-binding)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-controller

      <code-example hideCopy format="">
        &lt;div ng-controller="MovieListCtrl as vm">
      </code-example>


      В AngularJS,  `ng-controller`  Директива прикрепляет контроллер к представлению.
      С использованием  `ng-controller`  (или определение контроллера как части маршрутизации) связывает
      вид на код контроллера, связанный с этим представлением.
    </td>

    <td>


      ### Компонент декоратор

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>


      В Angular шаблон больше не указывает связанный с ним контроллер.
      Скорее компонент указывает свой связанный шаблон как часть декоратора класса компонента.

      Для получения дополнительной информации см. [Обзор архитектуры](guide/architecture#components).

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-hide
      В AngularJS,  `ng-hide`  Директива показывает или скрывает связанный элемент HTML на основе
      выражение. Для получения дополнительной информации см. [Ng-show](guide/ajs-quick-reference#ng-show).
    </td>

    <td>


      ### Привязать к  `hidden`  собственность
      В Angular вы используете привязку свойств; нет встроенной *скрытия* директивы.
      Для получения дополнительной информации см. [Ng-show](guide/ajs-quick-reference#ng-show).
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-href

      <code-example hideCopy format="">
        &lt;a ng-href="{{ angularDocsUrl }}">Angular Docs&lt;/a>
      </code-example>


 `ng-href` Директива позволяет AngularJS предварительно обрабатывать  `href`  свойство так, чтобы оно
      может заменить выражение привязки на соответствующий URL перед браузером
      извлекает из этого URL.

      В AngularJS,  `ng-href`  часто используется для активации маршрута как части навигации.

      <code-example hideCopy format="">
        &lt;a ng-href="#{{ moviesHash }}">Movies&lt;/a>
      </code-example>


      Маршрутизация обрабатывается по-разному в Angular.
    </td>

    <td>


      ### Привязать к  `href`  собственности

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="href"></code-example>


      Angular использует привязку свойств; нет встроенной *href* директивы.
      Поместите элемент  `href`  Свойство в квадратных скобках и установите его в выражение шаблона в кавычках.

      Для получения дополнительной информации см. [Свойство привязки](guide/template-syntax#property-binding)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.

      В Angular,  `href`  больше не используется для маршрутизации. Маршрутизация использует  `routerLink`, как показано в следующем примере.

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="router-link"></code-example>


      Для получения дополнительной информации о маршрутизации см. [Привязка RouterLink](guide/router#router-link)
      раздел [Маршрутизация и навигация](guide/router)страницы.

    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-if

      <code-example hideCopy format="">
        &lt;table ng-if="movies.length">
      </code-example>


      В AngularJS,  `ng-if`  директива удаляет или воссоздает часть DOM,
      на основе выражения. Если выражение ложно, элемент удаляется из DOM.

      В этом примере  `<table>`  элемент удаляется из DOM, если только  `movies`  массив имеет длину больше нуля.
    </td>

    <td>


      ### *ngIf

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngIf"></code-example>


 `*ngIf` Директива в Angular работает так же, как  `ng-if`  Директива в AngularJS. Это удаляет
      или воссоздает часть DOM на основе выражения.

      В этом примере  `<table>`  элемент удаляется из DOM, если только  `movies`  Массив имеет длину.

      ( *) Перед  `ngIf`  требуется в этом примере.
      Для получения дополнительной информации см. [Структурные директивы](guide/structural-directives).
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-model

      <code-example hideCopy format="">
        &lt;input ng-model="vm.favoriteHero"/>
      </code-example>


      В AngularJS,  `ng-model`  Директива связывает элемент управления формы со свойством в контроллере, связанном с шаблоном.
      Это обеспечивает **двустороннюю привязку**, при которой любое изменение, внесенное в значение в представлении, синхронизируется с моделью, а любое изменение в модели синхронизируется со значением в представлении.
    </td>

    <td>


      ### ngModel

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngModel"></code-example>


      В Angular **двустороннее связывание** обозначается  `[()]`, описательно называемый «банан в коробке». Этот синтаксис является ярлыком для определения привязки обоих свойств (от компонента к представлению)
      и привязка событий (от представления к компоненту), тем самым обеспечивая двустороннюю привязку.

      Для получения дополнительной информации о двустороннем связывании с  `ngModel`, см. [NgModel - Двусторонняя привязка к
      элементы формы с  `[(ngModel)]`  ] (../ guide / template-syntax.html #ngModel)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-repeat

      <code-example hideCopy format="">
        &lt;tr ng-repeat="movie in vm.movies">
      </code-example>


      В AngularJS,  `ng-repeat`  Директива повторяет связанный элемент DOM
      за каждый предмет в указанной коллекции.

      В этом примере строка таблицы (`<tr>`) элемент повторяется для каждого объекта фильма в коллекции фильмов.
    </td>

    <td>


      ### *ngFor

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngFor"></code-example>


 `*ngFor` Директива в Angular похожа на  `ng-repeat`  Директива в AngularJS. Это повторяется
      связанный элемент DOM для каждого элемента в указанной коллекции.
      Точнее, получается определенный элемент (  `<tr>`  в этом примере) и его содержимое в шаблон и
      использует этот шаблон для создания представления для каждого элемента в списке.

      Обратите внимание на другие отличия синтаксиса:
      ( *) Перед  `ngFor`  требуется;
 `let` ключевое слово идентифицирует  `movie`  в качестве входной переменной;
      предлог списка  `of`, не  `in`.

      Для получения дополнительной информации см. [Структурные директивы](guide/structural-directives).
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-show

      <code-example hideCopy format="">
        &lt;h3 ng-show="vm.favoriteHero">
          Your favorite hero is: {{vm.favoriteHero}}
        &lt;/h3>
      </code-example>


      В AngularJS,  `ng-show`  Директива показывает или скрывает связанный элемент DOM на основе
      выражение.

      В этом примере  `<div>`  Элемент отображается, если  `favoriteHero`  переменная truthy.
    </td>

    <td>


      ### Привязать к  `hidden`  собственность

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="hidden"></code-example>


      Angular использует привязку свойств; нет встроенной *show* директивы.
      Для скрытия и отображения элементов, привязка к HTML  `hidden`  собственность.

      Чтобы условно отобразить элемент, поместите элемент  `hidden`  свойство в квадратных скобках и
      установить его в кавычки выражение шаблона, который вычисляется в *противоположную* от *шоу*.

      В этом примере  `<div>`  Элемент скрыт, если  `favoriteHero`  переменная не truthy.

      Для получения дополнительной информации о привязке свойства см. [Привязка свойства](guide/template-syntax#property-binding)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-src

      <code-example hideCopy format="">
        &lt;img ng-src="{{movie.imageurl}}">
      </code-example>


 `ng-src` Директива позволяет AngularJS предварительно обрабатывать  `src`  свойство так что это
      может заменить выражение привязки на соответствующий URL перед браузером
      извлекает из этого URL.
    </td>

    <td>


      ### Привязать к  `src`  свойство

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="src"></code-example>


      Angular использует привязку свойств; нет встроенной *src* директивы.
      Поместите  `src`  Свойство в квадратных скобках и установите его в выражение шаблона в кавычках.

      Для получения дополнительной информации о привязке свойства см. [Привязка свойства](guide/template-syntax#property-binding)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-style

      <code-example hideCopy format="">
        &lt;div ng-style="{color: colorPreference}">
      </code-example>


      В AngularJS,  `ng-style`  Директива в стиле устанавливает стиль CSS для элемента HTML
      на основе выражения. Это выражение часто является объектом управления ключ-значение с каждым
      ключ объекта, определенного как свойство CSS, а каждое значение определяется как выражение
      это оценивает к значению, подходящему для стиля.

      В примере  `color`  стиль установлен на текущее значение  `colorPreference`  переменная.
    </td>

    <td>


      ### ngStyle

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="ngStyle"></code-example>


      В Angular  `ngStyle`  Директива работает аналогично. Он устанавливает стиль CSS для элемента HTML на основе выражения.

      В первом примере  `color`  стиль установлен на текущее значение  `colorPreference`  переменная.

      Angular также имеет **привязку стилей**, что является хорошим способом установки единого стиля. Это показано во втором примере.

      Для получения дополнительной информации о стиле связывания см [переплет](guide/template-syntax#style-binding)секция
      [Синтаксис шаблона](guide/template-syntax).

      Для получения дополнительной информации о  `ngStyle`  директива, см. [NgStyle](guide/template-syntax#ngStyle)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### ng-switch

      <code-example hideCopy format="">
        &lt;div ng-switch="vm.favoriteHero &&
                        vm.checkMovieHero(vm.favoriteHero)">
            &lt;div ng-switch-when="true">
              Excellent choice!
            &lt;/div>
            &lt;div ng-switch-when="false">
              No movie, sorry!
            &lt;/div>
            &lt;div ng-switch-default>
              Please enter your favorite hero.
            &lt;/div>
        &lt;/div>
      </code-example>


      В AngularJS,  `ng-switch`  Директива меняет содержимое
      элемент путем выбора одного из шаблонов на основе текущего значения выражения.

      В этом примере, если  `favoriteHero`  не установлен, в шаблоне отображается «Пожалуйста, введите...».
      Если  `favoriteHero`  установлен, он проверяет героя фильма, вызывая метод контроллера.
      Если этот метод возвращает  `true`, в шаблоне отображается «Отличный выбор!».
      Если этот метод возвращает  `false`, шаблон отображает «Нет фильма, извините!».
    </td>

    <td>


      ### ngSwitch

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.html" region="ngSwitch"></code-example>


      В Angular  `ngSwitch`  Директива работает аналогично.
      Отображает элемент, чей  `*ngSwitchCase`  соответствует текущему  `ngSwitch`  выражения.

      В этом примере, если  `favoriteHero`  не установлен,  `ngSwitch`  Значение равно  `null` 
      и  `*ngSwitchDefault`  отображает «Пожалуйста, введите...».
      Если  `favoriteHero`, приложение проверяет героя фильма, вызывая метод компонента.
      Если этот метод возвращает  `true`, приложение выбирает  `*ngSwitchCase="true"`  и отображает: «Отличный выбор!»
      Если этот метод возвращает  `false`, приложение выбирает  `*ngSwitchCase="false"`  и отображает: «Нет фильма, извините!»

      ( *) Перед  `ngSwitchCase`  и  `ngSwitchDefault`  этом примере требуется.

      Для получения дополнительной информации см. [Директивы NgSwitch](guide/template-syntax#ngSwitch)
      раздел [Синтаксис шаблона](guide/template-syntax)страницы.
    </td>

  </tr>

</table>


{@a filters-pipes}



## Фильтры / трубы
Angular **каналы** обеспечивают форматирование и преобразование данных в шаблоне, аналогично AngularJS**фильтрам**.
Многие из встроенных фильтров в AngularJS имеют соответствующие каналы в Angular.
Для получения дополнительной информации о трубах см. [Трубы](guide/pipes).


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### currency

      <code-example hideCopy>
        &lt;td>{{movie.price | currency}}&lt;/td>
      </code-example>


      Форматирует число как валюту.
    </td>

    <td>


      ### currency

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="currency"></code-example>


      Angular  `currency`  труба похожа, хотя некоторые параметры изменились.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### date

      <code-example hideCopy>
        &lt;td>{{movie.releaseDate | date}}&lt;/td>
      </code-example>


      Форматирует дату в строку на основе запрошенного формата.
    </td>

    <td>


      ### date

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="date"></code-example>


      Angular  `date`  трубы похожа.

    </td>

  </tr>

  <tr style=top>

    <td>


      ### filter

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | filter: {title:listFilter}">
      </code-example>


      Выбирает поднабор элементов из определенной коллекции на основе критериев фильтра.
    </td>

    <td>


      ### none
      Из соображений производительности в Angular не существует сопоставимой трубы. Сделайте всю свою фильтрацию в компоненте. Если вам нужен один и тот же код фильтрации в нескольких шаблонах, подумайте о создании собственного канала.

    </td>

  </tr>

  <tr style=top>

    <td>


      ### json

      <code-example hideCopy>
        &lt;pre>{{movie | json}}&lt;/pre>
      </code-example>


      Преобразует объект JavaScript в строку JSON. Это полезно для отладки.
    </td>

    <td>


      ### json

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="json"></code-example>


      Angular  `json`  pipe делает то же самое.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### limitTo

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | limitTo:2:0">
      </code-example>


      Выбирает до первого параметра (2) количество предметов из коллекции
      начиная (опционально) с начального индекса (0).
    </td>

    <td>


      ### slice

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="slice"></code-example>


 `SlicePipe` делает то же самое, но *порядок параметров восстанавливается*, в соответствии
      с помощью JavaScript  `Slice`  Метод.
      Первый параметр - это начальный индекс; второй предел.
      Как и в AngularJS, кодирование этой операции внутри компонента может повысить производительность.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### lowercase

      <code-example hideCopy>
        &lt;td>{{movie.title | lowercase}}&lt;/td>
      </code-example>


      Преобразует строку в нижний регистр.
    </td>

    <td>


      ### lowercase

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="lowercase"></code-example>


      Angular  `lowercase`  труба делает то же самое.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### number

      <code-example hideCopy>
        &lt;td>{{movie.starRating | number}}&lt;/td>
      </code-example>


      Форматирует число как текст.
    </td>

    <td>


      ### number

      <code-example hideCopy path="ajs-quick-reference/src/app/app.component.html" region="number"></code-example>


      Angular  `number`  трубы похож.
      Это обеспечивает больше функциональности при определении
      десятичные разряды, как показано во втором примере выше.

      Angular также имеет  `percent`  труба, которая форматирует число как локальный процент
      как показано в третьем примере.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### orderBy

      <code-example hideCopy>
        &lt;tr ng-repeat="movie in movieList | orderBy : 'title'">
      </code-example>


      Отображает коллекцию в порядке, указанном выражением.
      В этом примере название фильма упорядочивает  `movieList`.
    </td>

    <td>


      ### none
      Из соображений производительности в Angular не существует сопоставимой трубы.
      Вместо этого используйте код компонента, чтобы упорядочить или отсортировать результаты. Если вам нужен один и тот же код заказа или сортировки в нескольких шаблонах, подумайте о создании собственного канала.

    </td>

  </tr>

</table>



{@a controllers-components}



{@a modules-controllers-components}
## Модули / контроллеры / компоненты
Как в AngularJS, так и в Angular модули помогают вам организовать приложение в единые блоки функциональности.

В AngularJS вы пишете код, который предоставляет модель и методы для представления в **контроллере**.
В Angular вы создаете **компонент**.

Поскольку большая часть кода AngularJS находится на JavaScript, код JavaScript отображается в столбце AngularJS.
Angular код показан с использованием TypeScript.


<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### IIFE

      <code-example hideCopy>
        (function () {
          ...
        }());
      </code-example>


      В AngularJS, немедленно вызванное выражение функции (или IIFE) вокруг кода контроллера
      держит его вне глобального пространства имен.

    </td>

    <td>


      ### none
      Это не выпуск в Angular, потому что модули ES 2015
      обрабатывать пространство имен для вас.

      Для получения дополнительной информации о модулях см. [Модули](guide/architecture#modules)Раздел
      [Обзор архитектуры](guide/architecture).
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Angular модули

      <code-example hideCopy>
        angular.module("movieHunter", ["ngRoute"]);
      </code-example>


      В AngularJS модуль Angular отслеживает контроллеры, сервисы и другой код.
      Второй аргумент определяет список других модулей, от которых зависит этот модуль.
    </td>

    <td>


      ### NgModules

      <code-example hideCopy path="ajs-quick-reference/src/app/app.module.1.ts"></code-example>


      NgModules, определенные с  `NgModule`  декоратор, служат той же цели:

      *  `imports` : указывает список других модулей, от которых зависит этот модуль
      *  `declaration` : отслеживает ваши компоненты, каналы и директивы.

      Для получения дополнительной информации о модулях см. [NgModules](guide/ngmodules).
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Регистрация контролера

      <code-example hideCopy>
        angular
         .module("movieHunter")
         .controller("MovieListCtrl",
                      ["movieService",
                       MovieListCtrl]);
      </code-example>


      AngularJS имеет код в каждом контроллере, который ищет соответствующий модуль Angular
      и регистрирует контроллер с этим модулем.

      Первый аргумент - это имя контроллера. Второй аргумент определяет имена строк
      все зависимости, введенные в этот контроллер, и ссылка на функцию контроллера.
    </td>

    <td>


      ### Компонент декоратор

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="component"></code-example>


      Angular добавляет декоратор к классу компонента для предоставления любых необходимых метаданных.
 `@Component` decorator объявляет, что класс является компонентом, и предоставляет метаданные о
      этот компонент, такой как его селектор (или тег) и его шаблон.

      Вот как вы связываете шаблон с логикой, которая определена в классе компонентов.

      Для получения дополнительной информации см. [Компоненты](guide/architecture#components)
      раздел [Обзор архитектуры](guide/architecture)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Функция контроллера

      <code-example hideCopy>
        function MovieListCtrl(movieService) {
        }
      </code-example>


      В AngularJS вы пишете код для модели и методов в функции контроллера.
    </td>

    <td>


      ### Компонент класса

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="class"></code-example>


      В Angular вы создаете класс компонента, который будет содержать модель данных и методы управления. Используйте машинописи <code>экспорта </code>ключевое слово, чтобы экспортировать класс так, что функциональные возможности могут быть импортированы в NgModules.

      Для получения дополнительной информации см. [Компоненты](guide/architecture#components)
      раздел [Обзор архитектуры](guide/architecture)страницы.
    </td>

  </tr>

  <tr style=top>

    <td>


      ### Зависимость от инъекций

      <code-example hideCopy>
        MovieListCtrl.$inject = ['MovieService'];
        function MovieListCtrl(movieService) {
        }
      </code-example>


      В AngularJS вы передаете любые зависимости в качестве аргументов функции контроллера.
      Этот пример внедряет  `MovieService`.

      Чтобы избежать проблем минификации, расскажите Angular явно
      что он должен внедрить экземпляр  `MovieService`  по первому параметру.
    </td>

    <td>


      ### Зависимость от инъекций

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="di"></code-example>


      В Angular вы передаете зависимости как аргументы конструктору класса компонента.
      Этот пример внедряет  `MovieService`.
      Тип TypeScript первого параметра сообщает Angular, что вводить, даже после минимизации.

      Для получения дополнительной информации см. [Внедрение зависимости](guide/architecture#dependency-injection)
      раздел [Обзор архитектуры](guide/architecture).
    </td>

  </tr>

</table>

{@a style-sheets}



## Таблицы стилей
Таблицы стилей придают вашему приложению красивый вид.
В AngularJS вы указываете таблицы стилей для всего вашего приложения.
По мере того как приложение растет со временем, стили для многих частей приложения
слияние, которое может привести к неожиданным результатам.
В Angular вы все еще можете определять таблицы стилей для всего вашего приложения. Но теперь вы можете
также инкапсулировать таблицу стилей в конкретный компонент.

<table width="100%">

  <col width="50%">

  </col>

  <col width="50%">

  </col>

  <tr>

    <th>
      AngularJS
    </th>

    <th>
      Angular
    </th>

  </tr>

  <tr style=top>

    <td>


      ### Link tag

      <code-example hideCopy>
        &lt;link href="styles.css" rel="stylesheet" />
      </code-example>


      AngularJS, использует  `link`  тег в разделе заголовка  `index.html`  файл
      определить стили для приложения.
    </td>

    <td>



      ### Конфигурация стилей
      <code-example hideCopy path="ajs-quick-reference/.angular-cli.1.json" region="styles"></code-example>

      С помощью Angular CLI вы можете настроить свои глобальные стили в  `angular.json`  файл.
      Вы можете переименовать расширение в  `.scss`  использовать sass.

      ### StyleUrls
      В Angular вы можете использовать  `styles`  или  `styleUrls`  свойство объекта  `@Component`  метаданных для определения
      таблица стилей для определенного компонента.

      <code-example hideCopy path="ajs-quick-reference/src/app/movie-list.component.ts" region="style-url"></code-example>


      Это позволяет вам установить соответствующие стили для отдельных компонентов, в которые не попадет
      другие части приложения.
    </td>

  </tr>

</table>
