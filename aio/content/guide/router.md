{@a routing-and-navigation}
# Маршрутизация и навигация

Angular** `Router`** обеспечивает навигацию от одного [вид](guide/glossary#view)к другому
как пользователи выполняют задачи приложения.

Это руководство охватывает основные функции маршрутизатора, иллюстрируя их по мере развития
небольшого приложения, которое вы можете <live-example>запустить вживую в браузере </live-example>.

<!-- style for all tables on this page -->
<style>
  td, th {vertical-align: top}
</style>


{@a overview}
## Обзор

Браузер привычная модель приложения навигации:

* Введите URL-адрес в адресной строке, и браузер перейдет на соответствующую страницу.
* Нажмите на ссылку на странице, и браузер перейдет на новую страницу.
* Нажмите кнопки браузера «назад» и «вперед», и браузер начнет навигацию
  назад и вперед по истории страниц, которые вы видели.

Angular `Router` («роутер») позаимствовал у этой модели.
Он может интерпретировать URL браузера как инструкцию для перехода к сгенерированному клиентом представлению.
Он может передавать необязательные параметры вспомогательному компоненту представления, который помогает ему решить, какой конкретный контент представить.
Вы можете привязать маршрутизатор к ссылкам на странице, и он перейдет к
соответствующий вид приложения, когда пользователь нажимает на ссылку.
Вы можете перемещаться императивно, когда пользователь нажимает на кнопку, выбирает из выпадающего,
или в ответ на какой-то другой стимул из любого источника. И роутер регистрирует активность
в журнале истории браузера, так что кнопки назад и вперед работают также.

{@a basics}


{@a the-basics}
## Основы

Это руководство проходит по этапам, обозначенным вехами, начиная с простого двухстраничного
и построение модульного многоуровневого дизайна с дочерними маршрутами.

Введение в некоторые основные концепции маршрутизатора поможет вам сориентироваться в следующих деталях.


{@a basics-base-href}


{@a *&ltbase-href>*}
### *<база href>*

Большинство приложений маршрутизации должны добавить `<base>` элемент к `index.html` как первый дочерний элемент в `<head>` метка
рассказать маршрутизатору, как составлять навигационные URL.

Если `app` Папка является корнем приложения, как и для примера приложения
установить `href` Значение *точности* как показано здесь.


<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>



{@a basics-router-imports}


{@a router-imports}
### Маршрутизатор импортный

Angular Router - это дополнительная служба, которая представляет конкретный вид компонента для данного URL.
Это не часть Angular ядра. Он находится в своем собственном библиотечном пакете, `@angular/router`.
Импортируйте из него то, что вам нужно, как из любого другого пакета Angular.


<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (import)" region="import-router"></code-example>



<div class="alert is-helpful">



Вы узнаете о дополнительных возможностях в [подробности ниже](#browser-url-styles).


</div>



{@a basics-config}


{@a configuration}
### Конфигурация

Направленное приложение Angular имеет один единственный экземпляр* `Router`* Сервис.
Когда URL-адрес браузера изменяется, этот маршрутизатор ищет соответствующий `Route` 
из которого он может определить компонент для отображения.

Маршрутизатор не имеет маршрутов, пока вы не настроите его.
В следующем примере создается пять определений маршрута, настраивается маршрутизатор через `RouterModule.forRoot()` метод,
и добавляет результат к `AppModule` 's `imports` массив.


<code-example path="router/src/app/app.module.0.ts" header="src/app/app.module.ts (excerpt)"></code-example>



{@a example-config}


 `appRoutes` массив *маршрутов* описывает, как перемещаться.
Передайте это `RouterModule.forRoot()` в модуле `imports` для настройки роутера.

каждый `Route` сопоставляет URL `path` к компоненту.
В _path_ нет ни одной ведущей косой черты.
Маршрутизатор анализирует и создает окончательный URL для вас
позволяя использовать как относительные, так и абсолютные пути при навигации между представлениями приложения.

 `:id` во втором маршруте является токеном для параметра маршрута. В URL, таком как `/hero/42`, "42"
это значение `id` параметр . Соответствующий `HeroDetailComponent` 
будет использовать это значение, чтобы найти и представить героя, чей `id` 42
Вы узнаете больше о параметрах маршрута позже в этом руководстве.

 `data` Свойство на третьем маршруте - это место для хранения произвольных данных, связанных с
этот конкретный маршрут. Свойство данных доступно в пределах каждого активированного маршрута. Используйте его для хранения
такие элементы, как заголовки страниц, текстовые крошки и другие доступные только для чтения _статические_ данные.
Вы будете использовать [решите проблему](#resolve-guard)для получения _dynamic_ данных позже в руководстве.

**Пустой путь** в четвертом маршруте представляет собой путь по умолчанию для приложения,
место для перехода, когда путь в URL-адресе пуст, как это обычно бывает в начале.
Этот маршрут по умолчанию перенаправляет на маршрут для `/heroes` URL и, следовательно, будет отображать `HeroesListComponent`.

 `**` путь в последнем маршруте является**подстановочным знаком**. Маршрутизатор выберет этот маршрут
если запрошенный URL не совпадает ни с одним путем для маршрутов, определенных ранее в конфигурации.
Это полезно для отображения страницы «404 - Не найдено» или для перенаправления на другой маршрут.

**Порядок маршрутов в конфигурации имеет значение,** и это от замысла. Маршрутизатор использует выигрыш**первого матча**
стратегия при сопоставлении маршрутов, поэтому более конкретные маршруты должны быть размещены над менее конкретными маршрутами.
В приведенной выше конфигурации сначала отображаются маршруты со статическим путем, а затем - пустой путь
это соответствует маршруту по умолчанию.
Маршрут с подстановочными знаками стоит последним, потому что он соответствует _every URL_ и должен быть выбран _only_, если другие маршруты не совпадают первыми.

Если вам нужно увидеть, какие события происходят в течение жизненного цикла навигации, есть **enableTracing** опция как часть конфигурации маршрутизатора по умолчанию. Это выводит каждое событие маршрутизатора, которое имело место в течение каждого жизненного цикла навигации, на консоль браузера. Это должно использоваться только для целей _debugging_. Вы установили `enableTracing: true` опция в объекте, переданном в качестве второго аргумента `RouterModule.forRoot()`.

{@a basics-router-outlet}


{@a router-outlet}
### Маршрутизатор на выходе

 `RouterOutlet` - это директива из библиотеки маршрутизатора, которая используется как компонент.
Он действует как заполнитель, который отмечает место в шаблоне, где должен маршрутизатор
отобразить компоненты для этой розетки.


<code-example language="html">
  &lt;router-outlet>&lt;/router-outlet>
  &lt;!-- Routed components go here -->

</code-example>

Учитывая приведенную выше конфигурацию, когда URL браузера для этого приложения становится `/heroes`,
маршрутизатор сопоставляет этот URL с путем к маршруту `/heroes` и отображает `HeroListComponent` 
в качестве элемента родного брата к `RouterOutlet` который вы поместили в шаблон хост-компонента.

{@a basics-router-links}
{@a router-link}


{@a router-links}
### Маршрутизатор ссылок

Теперь у вас есть настроенные маршруты и место для их рендеринга, но
как ты ориентируешься? URL может быть получен непосредственно из адресной строки браузера.
Но большую часть времени вы перемещаетесь в результате некоторых действий пользователя, таких как нажатие кнопки
якорный тег.

Рассмотрим следующий шаблон:


<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

 `RouterLink` Директивы для тегов привязки предоставляют маршрутизатору контроль над этими элементами.
Навигационные пути фиксированы, поэтому вы можете назначить строку `routerLink` (одноразовая привязка).

Если бы навигационный путь был более динамичным, вы могли бы связать это с выражением шаблона
вернул массив параметров ссылки маршрута (массив _link параметров_).
Маршрутизатор разрешает этот массив в полный URL-адрес.


{@a router-link-active}


{@a active-router-links}
### Активные ссылки роутера

 `RouterLinkActive` Директива переключает классы CSS для активных `RouterLink` на основе текущего `RouterState`.

На каждом теге привязки вы видите [привязку свойства](guide/template-syntax#property-binding)к `RouterLinkActive` Директива которая выглядит как `routerLinkActive="..."`.

Выражение шаблона справа от равенства (=) содержит разделенную пробелами строку классов CSS
что Маршрутизатор добавит, когда эта ссылка активна (и удалит, когда ссылка не активна). Вы установили `RouterLinkActive` 
директива к строке классов, таких как `[routerLinkActive]="'active fluffy'"` или привязать его к компоненту
свойство, которое возвращает такую ​​строку.

Активные ссылки на маршруты каскадно проходят через каждый уровень дерева маршрутов, поэтому родительские и дочерние ссылки на маршрутизаторы могут быть активными одновременно. Чтобы переопределить это поведение, вы можете привязать к `[routerLinkActiveOptions]` привязка ввода с `{ exact: true }` выражение. Используя `{ exact: true }`, данный `RouterLink` будет активен только в том случае, если его URL точно соответствует текущему URL.


{@a basics-router-state}


{@a router-state}
### Состояние роутера

После завершения каждого успешного жизненного цикла навигации маршрутизатор строит дерево `ActivatedRoute` объекты
которые составляют текущее состояние маршрутизатора. Вы можете получить доступ к текущему `RouterState` из любой точки
приложение с использованием `Router` сервис `routerState`.

каждый `ActivatedRoute` в `RouterState` предоставляет методы для перемещения вверх и вниз по дереву маршрутов
получать информацию из маршрутов родителей, детей и братьев и сестер.

{@a activated-route}


{@a activated-route}
### Активированный маршрут

Путь и параметры маршрута доступны через внедренную службу маршрутизатора, которая называется
[ActivatedRoute](api/router/ActivatedRoute).
Она имеет много полезной информации, в том числе:

<table>
  <tr>
    <th>
      Недвижимость
    </th>

    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td>
      <code>url</code>
    </td>
    <td>

 `Observable` путь (ы) маршрута, представленный в виде массива строк для каждой части пути маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>data</code>
    </td>
    <td>

 `Observable` который содержит `data` объект предоставленный для маршрута. Также содержит любые разрешенные значения из [решите](#resolve-guard).

    </td>
  </tr>

  <tr>
    <td>
      <code>paramMap</code>
    </td>
    <td>

 `Observable` который содержит [карту](api/router/ParamMap)обязательных и [необязательных параметров](#optional-route-parameters)специфичных для маршрута. Карта поддерживает извлечение одного и нескольких значений из одного параметра.

    </td>
  </tr>

  <tr>
    <td>
      <code>queryParamMap</code>
    </td>
    <td>

 `Observable` который содержит [карту](api/router/ParamMap)из [параметров запроса](#query-parameters)доступной для всех маршрутов.
    Карта поддерживает извлечение одного и нескольких значений из параметра запроса.

    </td>
  </tr>

  <tr>
    <td>
      <code>fragment</code>
    </td>
    <td>

 `Observable` URL [фрагмент](#fragment)доступен для всех маршрутов.

    </td>
  </tr>

  <tr>
    <td>
      <code>outlet</code>
    </td>
    <td>

    Имя `RouterOutlet` используется для визуализации маршрута. Для неназванной розетки имя розетки _primary_.

    </td>
  </tr>

  <tr>
    <td>
      <code>routeConfig</code>
    </td>
    <td>

    Конфигурация маршрута, используемая для маршрута, который содержит исходный путь.

    </td>
  </tr>

    <tr>
    <td>
      <code>parent</code>
    </td>
    <td>

    Родитель маршрута `ActivatedRoute` когда этот маршрут является [дочерним маршрутом](#child-routing-component).

    </td>
  </tr>

  <tr>
    <td>
      <code>firstChild</code>
    </td>
    <td>

    Содержит первый `ActivatedRoute` в списке дочерних маршрутов этого маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>children</code>
    </td>
    <td>

    Содержит все [дочерние маршруты](#child-routing-component)активированные по текущему маршруту.

    </td>
  </tr>
</table>

<div class="alert is-helpful">

Два старых свойства все еще доступны. Они менее способны чем их замены, обескуражены и могут быть устаревшими в будущей версии Angular.

** `params`**—An `Observable` который содержит обязательные и [необязательные параметры](#optional-route-parameters)специфичные для маршрута. использование `paramMap` вместо этого.

** `queryParams`**-An `Observable` который содержит [параметры запроса](#query-parameters)доступные для всех маршрутов.
использование `queryParamMap` вместо этого.

</div>

{@a router-events}
### Маршрутизатор событий

Во время каждой навигации `Router` генерирует события навигации через `Router.events` недвижимость. Эти события варьируются от момента начала и окончания навигации до многих промежуточных точек. Полный список событий навигации отображается в таблице ниже.

<table>
  <tr>
    <th>
      Маршрутизатор событий
    </th>

    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td>
      <code>NavigationStart</code>
    </td>
    <td>

[Событие](api/router/NavigationStart)срабатывает, когда навигация начинается.

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadStart</code>
    </td>
    <td>

[Событие](api/router/RouteConfigLoadStart)срабатывает перед `Router` 
      [ленивая загрузка](#asynchronous-routing)конфигурация маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>RouteConfigLoadEnd</code>
    </td>
    <td>

[Событие](api/router/RouteConfigLoadEnd)срабатывает после маршрута было ленивым загружено.

    </td>
  </tr>

  <tr>
    <td>
      <code>RoutesRecognized</code>
    </td>
    <td>

[Событие](api/router/RoutesRecognized)срабатывает, когда маршрутизатор анализирует URL и маршруты распознаются.

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckStart</code>
    </td>
    <td>

[Событие](api/router/GuardsCheckStart)срабатывает, когда маршрутизатор начинает Стражники фазы маршрутизации.

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationStart</code>
    </td>
    <td>

[Событие](api/router/ChildActivationStart)срабатывает, когда маршрутизатор начинает активируя ребенок маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationStart</code>
    </td>
    <td>

[Событие](api/router/ActivationStart)срабатывает, когда маршрутизатор начинает активацию маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>GuardsCheckEnd</code>
    </td>
    <td>

[Событие](api/router/GuardsCheckEnd)срабатывает, когда маршрутизатор завершает фазу гвардейской успешно маршрутизации.

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveStart</code>
    </td>
    <td>

[Событие](api/router/ResolveStart)срабатывает, когда маршрутизатор начинает фазу Resolve маршрутизации.

    </td>
  </tr>

  <tr>
    <td>
      <code>ResolveEnd</code>
    </td>
    <td>

[Событие](api/router/ResolveEnd)срабатывает, когда маршрутизатор завершает фазу Resolve маршрутизации успешно.

    </td>
  </tr>

  <tr>
    <td>
      <code>ChildActivationEnd</code>
    </td>
    <td>

[Событие](api/router/ChildActivationEnd)срабатывает, когда маршрутизатор завершает активируя ребенок маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>ActivationEnd</code>
    </td>
    <td>

[Событие](api/router/ActivationStart)срабатывает, когда маршрутизатор завершает активацию маршрута.

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationEnd</code>
    </td>
    <td>

[Событие](api/router/NavigationEnd)успешно срабатывает, когда навигация заканчивается.

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationCancel</code>
    </td>
    <td>

[Событие](api/router/NavigationCancel)срабатывает, когда навигация будет отменена.
      Это может произойти, когда [Route Guard](#guards)возвращает ложь во время навигации
      или перенаправляет, возвращая `UrlTree`.

    </td>
  </tr>

  <tr>
    <td>
      <code>NavigationError</code>
    </td>
    <td>

[Событие](api/router/NavigationError)срабатывает при навигации выходит из строя из -за непредвиденной ошибки.

    </td>
  </tr>

  <tr>
    <td>
      <code>Scroll</code>
    </td>
    <td>

[Событие](api/router/Scroll)которое представляет собой событие прокрутки.

    </td>
  </tr>
</table>

Эти события записываются на консоль, когда `enableTracing` также включена. Пример фильтрации событий навигации маршрутизатора см. В разделе [раздел маршрутизатора](guide/observables-in-angular#router)руководства [Observables in Angular](guide/observables-in-angular).

{@a basics-summary}


{@a summary}
### Резюме

В приложении настроен роутер.
Компонент оболочки имеет `RouterOutlet` где он может отображать представления, созданные маршрутизатором.
Оно имеет `RouterLink` пользователям переходить по маршрутизатору.

Вот ключ `Router` термины и их значения:

<table>

  <tr>

    <th>
      Маршрутизатор Part
    </th>

    <th>
      Значение
    </th>

  </tr>

  <tr>

    <td>
      <code>Router</code>
    </td>

    <td>
      Отображает компонент приложения для активного URL.
      Управляет навигацией от одного компонента к другому.
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterModule</code>
    </td>

    <td>
      Отдельный модуль NgModule, который предоставляет необходимые поставщики услуг
      и директивы для навигации по представлениям приложений.
    </td>

  </tr>

  <tr>

    <td>
      <code>Routes</code>
    </td>

    <td>
      Определяет массив маршрутов, каждый из которых отображает URL-путь к компоненту.
    </td>

  </tr>

  <tr>

    <td>
      <code>Route</code>
    </td>

    <td>
      Определяет, как маршрутизатор должен перейти к компоненту на основе шаблона URL.
      Большинство маршрутов состоят из пути и типа компонента.
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterOutlet</code>
    </td>

    <td>
      Директива ( <code>&lt;router-outlet></code>), которая отмечает, где маршрутизатор отображает представление.
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLink</code>
    </td>

    <td>
      Директива для привязки кликабельного элемента HTML к
      маршрут. Нажав на элемент с помощью <code>routerLink</code>директивы
      это связано со <i>строкой </i>или <i>массивом параметров ссылки, </i>запускает навигацию.
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterLinkActive</code>
    </td>

    <td>
      Директива для добавления / удаления классов из элемента HTML, когда связанный
      <code>routerLink</code>содержащийся внутри или внутри элемента становится активным / неактивным.
    </td>

  </tr>

  <tr>

    <td>
      <code>ActivatedRoute</code>
    </td>

    <td>
      Служба, предоставляемая каждому компоненту маршрута, который содержит конкретный маршрут
      такая информация, как параметры маршрута, статические данные, данные разрешения, глобальные параметры запроса и глобальный фрагмент.
    </td>

  </tr>

  <tr>

    <td>
      <code>RouterState</code>
    </td>

    <td>
      Текущее состояние маршрутизатора, включая дерево активированных в данный момент
      маршруты вместе с удобными методами обхода дерева маршрутов.
    </td>

  </tr>

  <tr>

    <td>
      <b><i>Массив параметров ссылок </i></b>
    </td>

    <td>
      Массив, который маршрутизатор интерпретирует как инструкцию маршрутизации.
      Вы можете привязать этот массив к <code>RouterLink</code>или передать массив в качестве аргумента
<code>Router.navigate</code>метод.
    </td>

  </tr>

  <tr>

    <td>
      <b><i>Компонент маршрутизации </i></b>
    </td>

    <td>
      Angular компонент с элементом, <code>RouterOutlet</code>который отображает представления, основанные на навигации маршрутизатора.
    </td>

  </tr>

</table>




{@a sample-app-intro}


{@a the-sample-application}
## Пример приложения

Это руководство описывает разработку многостраничного примера приложения с маршрутизацией.
По пути, он выдвигает на первый план проектных решений и описывает основные функции маршрутизатора, такие как:

* Организация функций приложения в модули.
* Переход к компоненту (*Герои * ссылаются на «Список Heroes»).
* Включая параметр маршрута (прохождение героя `id` при маршрутизации на «Hero Detail»).
* Детские маршруты (у*Кризисного центра * есть свои маршруты).
* `CanActivate` guard (проверка доступа к маршруту).
* `CanActivateChild` guard (проверка доступа к дочернему маршруту).
* `CanDeactivate` guard (запросить разрешение на отмену несохраненных изменений).
* `Resolve` охрану (предварительная выборка данных маршрута).
* Ленивая загрузка функциональных модулей.
* `CanLoad` guard (проверьте перед загрузкой ресурсов функционального модуля).

Руководство представляет собой последовательность этапов, как если бы вы шаг за шагом создавали приложение.
Но это не учебное пособие, в нем подробно рассматриваются детали построения приложения Angular
которые более подробно описаны в других документах.

Полный исходный код окончательной версии приложения можно увидеть и загрузить с <live-example></live-example>.


{@a the-sample-application-in-action}
### Пример приложения в действии

Представьте себе приложение, которое помогает _Hero Employment Agency_ вести свой бизнес.
Герои нуждаются в работе, и агентство находит кризисы для их разрешения.

Приложение состоит из трех основных функциональных областей:

1. *Кризисный центр* для поддержания списка кризисов для присвоения героев.
1. *Герои* область для ведения списка героев, используемых агентством.
1. *Администратор* область для управления списком кризисов и героев.

Попробуйте, нажав на этот <live-example title="Hero Employment Agency Live Example">пример живой ссылки </live-example>.

Как только приложение прогреется, вы увидите ряд кнопок навигации
и *Герои* вид со своим списком героев.


<div class="lightbox">
  <img src='generated/images/guide/router/hero-list.png' alt="Hero List">
</div>



Выберите одного героя, и приложение выведет вас на экран редактирования героя.

<div class="lightbox">
  <img src='generated/images/guide/router/hero-detail.png' alt="Crisis Center Detail">
</div>



Измените имя.
Нажмите кнопку «Назад», и приложение вернется в список героев, в котором отображается измененное имя героя.
Обратите внимание, что изменение имени вступило в силу немедленно.

Если бы вы нажали кнопку назад браузера вместо кнопки «Назад»,
приложение вернуло бы вас в список героев.
Angular навигация приложения обновляет историю браузера, как и обычная веб-навигация.

Теперь нажмите на *Crisis Center, чтобы* ссылку увидеть список текущих кризисов.


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-list.png' alt="Crisis Center List">
</div>



Выберите кризис, и приложение выведет вас на экран редактирования кризиса.
_Crisis Detail_ появляется в дочернем компоненте на той же странице, под списком.

Измените название кризиса.
Обратите внимание, что соответствующее имя в списке кризисных ситуаций _не_ изменяется.


<div class="lightbox">
  <img src='generated/images/guide/router/crisis-center-detail.png' alt="Crisis Center Detail">
</div>



В отличие от *героя Detail*, который обновляет по мере ввода
*Кризисная деталь* Изменения носят временный характер до тех пор, пока вы не сохраните или не отмените их нажатием кнопок «Сохранить» или «Отмена».
Обе кнопки возвращаются к *Кризисному центру* и его списку кризисов.

***Не нажимайте ни одну кнопку еще***.
Вместо этого нажмите кнопку браузера назад или ссылку «Герои».

Вверх появляется диалоговое окно.


<div class="lightbox">
  <img src='generated/images/guide/router/confirm-dialog.png' alt="Confirm Dialog">
</div>



Вы можете сказать «ОК» и потерять свои изменения или нажать «Отмена» и продолжить редактирование.

За этим поведением стоит роутер `CanDeactivate` охрану.
Охранник дает вам возможность очистить или спросить разрешения пользователя перед тем, как отойти от текущего вида.

 `Admin ` и ` Login` Кнопки иллюстрируют другие возможности маршрутизатора, которые будут рассмотрены позже в руководстве.
Это короткое вступление покажет.

Перейдите к первому этапу применения.

{@a getting-started}

{@a milestone-1-getting-started}
## Веха 1: Начало работы

Начните с простой версии приложения, которая перемещается между двумя пустыми представлениями.


<div class="lightbox">
  <img src='generated/images/guide/router/router-1-anim.gif' alt="App in action">
</div>

{@a import}

Создайте пример приложения для прохождения.

<code-example language="none" class="code-shell">
  ng new angular-router-sample
</code-example>

{@a define-routes}
### Определить маршруты

Маршрутизатор должен быть настроен со списком определений маршрутов.

Каждое определение переводится в [маршрутный](api/router/Route)объект, который имеет две вещи: a
 `path`, сегмент пути URL для этого маршрута; и
 `component`, компонент, связанный с этим маршрутом.

Маршрутизатор использует свой реестр определений при изменении URL браузера
или когда код приложения указывает маршрутизатору перемещаться по пути маршрута.

Проще говоря, можно сказать, что это из первого маршрута:

* Когда URL-адрес браузера изменяется в соответствии с сегментом пути `/crisis-center`, then
the router activates an instance of the `CrisisListComponent` and displays its view.

* When the application requests navigation to the path `/crisis-center`, the router
activates an instance of `CrisisListComponent`, displays its view, and updates the
browser's address location and history with the URL for that path.

The first configuration defines an array of two routes with simple paths leading to the
 `CrisisListComponent` and `HeroListComponent` . Generate the `CrisisList` and `HeroList` components.

<code-example language="none" class="code-shell">
  ng generate component crisis-list
</code-example>

<code-example language="none" class="code-shell">
  ng generate component hero-list
</code-example>

Replace the contents of each component with the sample HTML below.

<code-tabs>

  <code-pane header="src/app/crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="src/app/hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html" region="template">

  </code-pane>

</code-tabs>

{@a register-router-and-routes}
### Register Router and Routes

In order to use the Router, you must first register the `RouterModule` from the `@angular/router` package. Define an array of routes, `appRoutes`, and pass them to the `RouterModule.forRoot()` method. It returns a module, containing the configured `Router` service provider, plus other providers that the routing library requires. Once the application is bootstrapped, the `Router` performs the initial navigation based on the current browser URL.

<div class="alert is-important">

  **Note:** The `RouterModule.forRoot` method is a pattern used to register application-wide providers. Read more about application-wide providers in the [Singleton services](guide/singleton-services#forRoot-router) guide.

</div>


<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (first-config)" region="first-config"></code-example>

<div class="alert is-helpful">

Adding the configured `RouterModule` to the `AppModule` is sufficient for simple route configurations. As the application grows, you'll want to [refactor the routing configuration](#refactor-the-routing-configuration-into-a-routing-module) into a separate file and create a **[Routing Module](#routing-module)**, a special type of `Service Module` dedicated to the purpose of routing in feature modules.

</div>

Registering the `RouterModule.forRoot()` in the `AppModule` imports makes the `Router` service available everywhere in the application.

{@a shell}


{@a add-the-router-outlet}
### Add the Router Outlet

The root `AppComponent` - это оболочка приложения. У него есть заголовок, панель навигации с двумя ссылками и выход маршрутизатора, где маршрутизатор меняет компоненты на странице и за ее пределами. Вот что вы получаете:


<div class="lightbox">
  <img src='generated/images/guide/router/shell-and-outlet.png' alt="Shell">
</div>

Розетка маршрутизатора служит заполнителем, когда маршрутизируемые компоненты будут отображаться под ним.

{@a shell-template}

Соответствующий компонент шаблон выглядит следующим образом :

<code-example path="router/src/app/app.component.1.html" header="src/app/app.component.html"></code-example>

{@a wildcard}

{@a define-a-wildcard-route}
### Определите подстановочный маршрут

Вы уже создали два маршрута в приложении, один для `/crisis-center` и другой `/heroes` . Любой другой URL заставляет маршрутизатор выдавать ошибку и завершать работу приложения.

Добавьте **символ** маршрутный для перехвата недействительных URL-адресов и обработайте их изящно.
Маршрут _wildcard_ имеет путь, состоящий из двух звездочек. Это соответствует _every_ URL.
Маршрутизатор выберет _this_ route, если он не может соответствовать маршруту ранее в конфигурации.
Маршрут подстановочного знака может перейти к пользовательскому компоненту «404 Not Found» или [перенаправить](#redirect)на существующий маршрут.


<div class="alert is-helpful">

Маршрутизатор выбирает маршрут с помощью [_first match wins_](#example-config)стратегии.
Маршрутные символы являются наименее конкретными маршрутами в конфигурации маршрута.
Убедитесь, что это _last_ route в конфигурации.

</div>

Чтобы проверить эту функцию, добавьте кнопку с `RouterLink` к `HeroListComponent` шаблон и установить ссылку на `"/sidekicks"`.

<code-example path="router/src/app/hero-list/hero-list.component.1.html" header="src/app/hero-list/hero-list.component.html (excerpt)"></code-example>

Приложение не будет работать, если пользователь нажмет эту кнопку, потому что вы не определили `"/sidekicks"` пока нет.

Вместо добавления `"/sidekicks"` маршрут, определить `wildcard` вместо этого маршрут, и он должен перейти к простому `PageNotFoundComponent`.

<code-example path="router/src/app/app.module.1.ts" header="src/app/app.module.ts (wildcard)" region="wildcard"></code-example>

Создать `PageNotFoundComponent` для отображения, когда пользователи посещают недействительные URL-адреса.

<code-example language="none" class="code-shell">
  ng generate component page-not-found
</code-example>

<code-example path="router/src/app/page-not-found/page-not-found.component.html" header="src/app/page-not-found.component.html (404 component)"></code-example>

Теперь, когда пользователь посещает `/sidekicks` или любой другой недействительный URL, браузер отображает «Страница не найдена».
Адресная строка браузера продолжает указывать на неверный URL.

{@a redirect}

{@a set-up-redirects}
### Настройте перенаправления

При запуске приложения, начальный URL в строке браузера что - то вроде:

<code-example>
  localhost:4200
</code-example>

Это не соответствует ни одному из конкретных настроенных маршрутов, что означает
маршрутизатор переходит на маршрутный символ и отображает `PageNotFoundComponent`.

Приложению требуется **маршрут умолчанию** по к действительной странице.
Страницей по умолчанию для этого приложения является список героев.
Приложение должно перемещаться туда, как если бы пользователь нажал на ссылку «Герои» или вставил `localhost:4200/heroes` в адресную строку.

Предпочтительным решением является добавление `redirect` маршрут, который переводит начальный относительный URL (`''`)
на нужный путь по умолчанию (`/heroes`). В адресной строке браузера отображается `.../heroes` как если бы вы переместились туда напрямую.

Добавьте маршрут по умолчанию где-нибудь над маршрутом подстановки.
Это чуть выше подстановочного маршрута в следующем отрывке, показывая полный `appRoutes` для этого этапа.


<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts (appRoutes)" region="appRoutes"></code-example>


Маршрут перенаправления требует `pathMatch` сообщает маршрутизатору, как сопоставить URL-адрес с путем маршрута.
Маршрутизатор выдает ошибку, если вы этого не сделаете.
В этом приложении маршрутизатор должен выбрать маршрут до `HeroListComponent` только тогда, когда *весь URL* совпадает `''`,
так установите `pathMatch` значение для `'full'`.


<div class="alert is-helpful">


Технически, `pathMatch = 'full'` приводит к попаданию в маршрут, когда *оставшиеся*несопоставленные сегменты URL совпадают `''`,
В этом примере перенаправление находится на маршруте верхнего уровня, поэтому *оставшийся* URL-адрес и *весь* URL-адрес - это одно и то же.

Другой возможный `pathMatch` значение равно `'prefix'` который сообщает маршрутизатор
чтобы сопоставить маршрут перенаправления, когда *оставшийся* URL-адрес ***начинается*** с пути _prefix_ маршрута перенаправления.

Не делай этого здесь.
Если `pathMatch` значение было `'prefix'` _every_ URL будет соответствовать `''`,

Попробуйте установить его `'prefix'` затем нажмите `Go to sidekicks` кнопке
Помните, что это неверный URL, и вы должны увидеть страницу «Страница не найдена».
Вместо этого вы все еще на странице "Герои".
Введите неверный URL в адресную строку браузера.
Вы мгновенно перенаправлены на `/heroes`.
_Every_ URL, хороший или плохой, который попадает в _this_ определение маршрута
будет спичка

Маршрут по умолчанию должен быть перенаправлен на `HeroListComponent` _only_, когда _entire_ URL-адрес `''`,
Не забудьте восстановить перенаправление на `pathMatch = 'full'`.

Узнайте больше у Виктора Савкина
[пост на перенаправлениях](http://vsavkin.tumblr.com/post/146722301646/angular-router-empty-paths-componentless-routes).


</div>


{@a basics-wrap-up}
### Основы подведения итогов

У вас есть очень простое навигационное приложение, которое может переключаться между двумя представлениями
когда пользователь нажимает на ссылку.

Вы узнали, как сделать следующее:

* Загрузите библиотеку маршрутизатора.
* Добавьте навигационную панель в шаблон оболочки с тегами привязки, `routerLink` и `routerLinkActive` директивы.
* Добавить `router-outlet` к шаблону оболочки, где будут отображаться представления.
* Настройте модуль маршрутизатора с `RouterModule.forRoot()`.
* Настройте маршрутизатор для составления URL-адресов браузера HTML5.
* обрабатывать недопустимые маршруты с `wildcard` маршрут.
* перейти к маршруту по умолчанию, когда приложение запускается с пустым путем.

Структура АРР, стартер выглядит следующим образом :

<div class='filetree'>

  <div class='file'>
    angular-router-sample
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
          кризис-лист
        </div>

        <div class='children'>

          <div class='file'>

            кризис-list.component.css

          </div>

          <div class='file'>

            кризис-list.component.html

          </div>

          <div class='file'>

            кризис-list.component.ts

          </div>

        </div>

        <div class='file'>
          список героев
        </div>

        <div class='children'>

          <div class='file'>

            hero-list.component.css

          </div>

          <div class='file'>

            hero-list.component.html

          </div>

          <div class='file'>

            hero-list.component.ts

          </div>

        </div>

        <div class='file'>
          страница не найдена
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>

        </div>

        <div class='file'>
          app.component.css
        </div>

        <div class='file'>
          app.component.html
        </div>

        <div class='file'>
          app.component.ts
        </div>

        <div class='file'>
          app.module.ts
        </div>

      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>



Вот файлы, обсуждаемые на этом этапе.


<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.1.html">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.1.ts">

  </code-pane>

  <code-pane header="hero-list/hero-list.component.html" path="router/src/app/hero-list/hero-list.component.1.html">

  </code-pane>

  <code-pane header="crisis-list/crisis-list.component.html" path="router/src/app/crisis-list/crisis-list.component.1.html">

  </code-pane>

  <code-pane header="page-not-found/page-not-found.component.html" path="router/src/app/page-not-found/page-not-found.component.html">

  </code-pane>

  <code-pane header="index.html" path="router/src/index.html">

  </code-pane>

</code-tabs>


{@a routing-module}

{@a milestone-2-*routing-module*}
## Веха 2: *Модуль маршрутизации*

В начальной конфигурации маршрута вы предоставили простую настройку с двумя используемыми маршрутами
настроить приложение для маршрутизации. Это прекрасно для простой маршрутизации.
Как приложение растет, и вы используете больше `Router` функции, такие как охрана,
резольверы и дочернюю маршрутизацию, вы, естественно, захотите реорганизовать конфигурацию маршрутизации в свой собственный файл.
Мы рекомендуем переместить информацию о маршрутизации в специальный модуль, называемый модулем *маршрутизации*.

**Модуль маршрутизации** имеет несколько характеристик:

* Отделяет проблемы маршрутизации от других проблем приложения.
* Предоставляет модуль для замены или удаления при тестировании приложения.
* Обеспечивает известное местоположение для поставщиков услуг маршрутизации, включая охранников и распознавателей.
* Разве**не** объявлять компоненты.

{@a integrate-routing}

{@a integrate-routing-with-your-app}
### Интегрируйте маршрутизацию с вашим приложением

Пример приложения маршрутизации не включает маршрутизацию по умолчанию.
Когда вы используете [Angular CLI](cli)для создания проекта, который будет использовать маршрутизацию, установите `--routing` для проекта или приложения и для каждого модуля NgModule.
Когда вы создаете или инициализируете новый проект (используя команду CLI [ `ng new` ](cli/new)) или новое приложение (используя команду [ ` ng generate app` ](cli/generate)), укажите `--routing` опция . Это говорит CLI включить `@angular/router` npm package и создайте файл с именем `app-routing.module.ts`.
Затем вы можете использовать маршрутизацию в любом NgModule, который вы добавляете в проект или приложение.

Например, следующая команда создает модуль NgModule, который может использовать маршрутизацию.

```sh
ng generate module my-module --routing
```

Это создает отдельный файл с именем `my-module-routing.module.ts` для хранения маршрутов NgModule.
Файл содержит пустой `Routes` объект, который вы можете заполнить маршрутами к различным компонентам и NgModules.

{@a routing-refactor}


{@a refactor-the-routing-configuration-into-a-routing-module}
### Рефакторинг конфигурации маршрутизации в _routing module_

Создать `AppRouting` Модуль в `/app` папка для хранения конфигурации маршрутизации.

<code-example language="none" class="code-shell">
  ng generate module app-routing --module app --flat
</code-example>

Импортировать `CrisisListComponent`, `HeroListComponent` и `PageNotFoundComponent` символы
так же, как вы сделали в `app.module.ts` . Затем переместите `Router` импортный
и настройка маршрутизации, в том числе `RouterModule.forRoot()`, в этот модуль маршрутизации.

Реэкспорт Angular `RouterModule`, добавив его в модуль `exports` массив.
Реэкспортируя `RouterModule` здесь компоненты объявлены в `AppModule` будет иметь доступ к директивам маршрутизатора, таким как `RouterLink` и `RouterOutlet`.

После этих шагов файл должен выглядеть следующим образом.

<code-example path="router/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts"></code-example>

Затем обновите `app.module.ts` файл, удаление `RouterModule.forRoot` в
 `imports` массив.

<code-example path="router/src/app/app.module.2.ts" header="src/app/app.module.ts"></code-example>



<div class="alert is-helpful">



Далее в этом руководстве вы создадите [несколько модулей маршрутизации](#heroes-functionality)и обнаружите это
Вы должны импортировать эти модули маршрутизации [в правильном порядке](#routing-module-order).


</div>



Приложение продолжает работать точно так же, и вы можете использовать `AppRoutingModule` as
центральное место для поддержки будущей конфигурации маршрутизации.


{@a why-routing-module}


{@a do-you-need-a-routing-module}
### Вам нужен _Routing Module_?

_Routing Module_ *заменяет* конфигурацию маршрутизации в корневом или функциональном модуле.
_Either_ настроить маршруты в модуле маршрутизации _or_ внутри самого модуля, но не в обоих.

Модуль маршрутизации - это выбор дизайна, значение которого наиболее очевидно при сложной конфигурации
и включает в себя специализированные службы охраны и распознавания.
Это может показаться излишним, когда фактическая конфигурация очень проста.

Некоторые разработчики пропускают модуль маршрутизации (например, `AppRoutingModule`), когда конфигурация проста и
объединить конфигурацию маршрутизации непосредственно в сопутствующий модуль (например, `AppModule`).

Выберите один или другой шаблон и следуйте этому шаблону последовательно.

Большинство разработчиков всегда должны реализовывать модуль маршрутизации для обеспечения согласованности.
Он сохраняет код чистым, когда конфигурация становится сложной.
Это облегчает тестирование функционального модуля.
Его существование обращает внимание на тот факт, что модуль маршрутизируется.
Именно здесь разработчики ожидают найти и расширить конфигурацию маршрутизации.

{@a heroes-feature}

{@a milestone-3-heroes-feature}
## Веха 3: Герои

Вы видели, как ориентироваться с помощью `RouterLink` Директива.
Теперь вы узнаете следующее:

* Организовать приложение и маршруты в области*функций * с помощью модулей.
* Обязательно переходите от одного компонента к другому.
* Передайте необходимую и дополнительную информацию в параметрах маршрута.

В этом примере воссоздается функция героев в эпизоде ​​«Услуги»
[Тур Героев учебника](tutorial/toh-pt4 "Tour of Heroes: Services"),
и вы будете копировать большую часть кода
из <live-example name="toh-pt4" title="Tour of Heroes: Services example code"></live-example>.

Вот как пользователь будет испытывать эту версию приложения:


<div class="lightbox">
  <img src='generated/images/guide/router/router-2-anim.gif' alt="App in action">
</div>



Типичное приложение имеет несколько *функциональных областей*,
каждый посвящен определенной деловой цели.

Хотя вы можете продолжать добавлять файлы в `src/app/` папка
это нереально и в конечном итоге не подлежит ремонту.
Большинство разработчиков предпочитают помещать каждую область функций в отдельную папку.

Вы собираетесь разбить приложение на различные *функциональные модули*, каждый со своими проблемами.
Затем вы импортируете в основной модуль и перемещаетесь между ними.


{@a heroes-functionality}


{@a add-heroes-functionality}
### Добавить функциональность героев

Выполните следующие действия:

* Создать `HeroesModule` с маршрутизацией в папке heroes и зарегистрируй ее с `AppModule` . Здесь вы будете осуществлять управление*героями *.

<code-example language="none" class="code-shell">
  ng generate module heroes/heroes --module app --flat --routing
</code-example>

* Переместить заполнитель `hero-list` папка которая находится в `app` в `heroes` папка.
* Скопируйте содержимое `heroes/heroes.component.html` от
<live-example name="toh-pt4" title="Tour of Heroes: Services example code">учебник «Услуги» </live-example>в `hero-list.component.html` шаблон.

  * Переписать `<h2>` до `<h2>HEROES</h2>`.
  * Удалить `<app-hero-detail>` Компонент в нижней части шаблона.

* Скопируйте содержимое `heroes/heroes.component.css` из живого примера в `hero-list.component.css` файл.
* Скопируйте содержимое `heroes/heroes.component.ts` из живого примера в `hero-list.component.ts` файл.

  * Измените имя класса компонента на `HeroListComponent`.
  * Изменить `selector` для `app-hero-list`.

<div class="alert is-helpful">

   Селекторы **не требуются** для _routed компоненты_, поскольку компоненты динамически вставляются при визуализации страницы, но они полезны для идентификации и нацеливания их в дереве элементов HTML.

</div>

* Скопируйте `hero-detail` папка с, `hero.ts`, `hero.service.ts` и `mock-heroes.ts` файлы в `heroes` подпапки.
* Скопируйте `message.service.ts` в `src/app` папка.
* Обновите относительный путь импорта до `message.service` в `hero.service.ts` файл.

Далее вы обновите `HeroesModule` метаданные.

  * Импортируйте и добавьте `HeroDetailComponent` и `HeroListComponent` к `declarations` массив в `HeroesModule`.

<code-example path="router/src/app/heroes/heroes.module.ts" header="src/app/heroes/heroes.module.ts"></code-example>



Когда вы закончите, вы будете иметь эти *управления героем* файлы:


<div class='filetree'>

  <div class='file'>
    src / app / heroes
  </div>

  <div class='children'>

    <div class='file'>
      герой-деталь
    </div>

      <div class='children'>

        <div class='file'>
          hero-detail.component.css
        </div>

        <div class='file'>
          hero-detail.component.html
        </div>

        <div class='file'>
          hero-detail.component.ts
        </div>

      </div>

    <div class='file'>
      список героев
    </div>

      <div class='children'>

        <div class='file'>
          hero-list.component.css
        </div>

        <div class='file'>
          hero-list.component.html
        </div>

        <div class='file'>
          hero-list.component.ts
        </div>

      </div>

    <div class='file'>
      hero.service.ts
    </div>

    <div class='file'>
      герой.ц
    </div>

    <div class='file'>
      heroes-routing.module.ts
    </div>

    <div class='file'>
      heroes.module.ts
    </div>

    <div class='file'>
      макетный heroes.ts
    </div>

    </div>




  </div>

</div>



{@a hero-routing-requirements}


{@a *hero*-feature-routing-requirements}
#### *героя* Требования к маршрутизации

Функция героев имеет два взаимодействующих компонента: список героев и детали героя.
Представление списка является самодостаточным; вы переходите к нему, он получает список героев и отображает их.

Подробный вид отличается. Отображает конкретного героя. Он не может знать, какого героя показать самому.
Эта информация должна поступать извне.

Когда пользователь выбирает героя из списка, приложение должно перейти к подробному виду
и покажи этого героя.
Вы сообщаете подробное представление о том, какого героя отображать, включая идентификатор выбранного героя в URL маршрута.

Импортируйте компоненты героя из их новых мест в `src/app/heroes/` папке определите маршруты двух героев.

Теперь, когда у вас есть маршруты для `Heroes` Модуль, зарегистрируйте их в `Router` через
 `RouterModule` _almost_, как вы сделали в `AppRoutingModule`.

Есть небольшая, но критическая разница.
в `AppRoutingModule`, вы использовали статический** `RouterModule.forRoot()`** метод для регистрации маршрутов и поставщиков услуг уровня приложений.
В функциональном модуле вы используете статический** `forChild`** метод.


<div class="alert is-helpful">



Только звонок `RouterModule.forRoot()` в корне `AppRoutingModule` 
(или `AppModule` если вы регистрируете маршруты приложений верхнего уровня).
В любом другом модуле вы должны вызвать** `RouterModule.forChild`** метод для регистрации дополнительных маршрутов.

</div>

Обновленный `HeroesRoutingModule` выглядит следующим образом :


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts"></code-example>



<div class="alert is-helpful">


Попробуйте предоставить каждому функциональному модулю свой собственный файл конфигурации маршрута.
Может показаться, что излишнее раннее раннее раннее простое использование маршрутов.
Но маршруты имеют тенденцию к усложнению, а согласованность шаблонов со временем окупается.


</div>


{@a remove-duplicate-hero-routes}


{@a remove-duplicate-hero-routes}
#### Удалить повторяющиеся маршруты героев

Маршруты героев в настоящее время определены в двух местах: в `HeroesRoutingModule`,
посредством `HeroesModule`, а в `AppRoutingModule`.

Маршруты, предоставляемые функциональными модулями, объединяются маршрутизатором в маршруты их импортированных модулей.
Это позволяет продолжить определение маршрутов функционального модуля без изменения конфигурации основного маршрута.

Удалить `HeroListComponent` импорта и `/heroes` путь из `app-routing.module.ts`.

**Оставьте маршрут по умолчанию и групповые маршруты!**
Это проблемы на верхнем уровне самого приложения.


<code-example path="router/src/app/app-routing.module.2.ts" header="src/app/app-routing.module.ts (v2)"></code-example>



{@a merge-hero-routes}


{@a remove-heroes-declarations}
#### Удалить объявления героев

Удалить `HeroListComponent` от `AppModule` 's `declarations` потому что теперь это обеспечивается `HeroesModule` . Вы можете развивать функцию героя с большим количеством компонентов и различных маршрутов. Это ключевое преимущество создания отдельного модуля для каждой области функций.

После этих шагов `AppModule` должен выглядеть следующим образом :


<code-example path="router/src/app/app.module.3.ts" header="src/app/app.module.ts" region="remove-heroes"></code-example>



{@a routing-module-order}


{@a module-import-order-matters}
### Порядок импорта модуля имеет значение

Посмотрите на модуль `imports` массив. Обратите внимание, что `AppRoutingModule` - _last_.
Самое главное, это приходит _after_ `HeroesModule`.

<code-example path="router/src/app/app.module.3.ts" region="module-imports" header="src/app/app.module.ts (module-imports)"></code-example>



Порядок конфигурации маршрута имеет значение.
Маршрутизатор принимает первый маршрут, который соответствует пути запроса навигации.

Когда все маршруты были в одном `AppRoutingModule`,
Вы ставите по умолчанию и [подстановочные знаки](#wildcard)маршруты последними, после `/heroes` маршрут
чтобы у роутера был шанс сопоставить URL с `/heroes` путь _before_
нажатием на групповой маршрут и переходом к «Страница не найдена».

Маршруты больше не в одном файле.
Они распределены по двум модулям, `AppRoutingModule` и `HeroesRoutingModule`.

Каждый модуль маршрутизации дополняет конфигурацию маршрута в порядке импорта.
Если вы перечислите `AppRoutingModule`, маршрутный символ будет зарегистрирован
_before_ герой маршрутов.
Маршрут с подстановочными символами, который совпадает с URL-адресом _every_, перехватит попытку перейти к маршруту героя.


<div class="alert is-helpful">



Поменяйте местами модули маршрутизации и убедитесь сами
щелчок ссылки героев приводит к «Страница не найдена».
Узнайте о проверке конфигурации маршрутизатора
[ниже](#inspect-config "Inspect the router config").


</div>

{@a route-parameters}
### Параметры маршрута

{@a route-def-with-parameter}


{@a route-definition-with-a-parameter}
#### Определение маршрута с параметром

Вернуться к `HeroesRoutingModule` и посмотрите определения маршрутов.
Маршрут к `HeroDetailComponent` имеет поворот.


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (excerpt)" region="hero-detail-route"></code-example>



Обратите внимание на `:id` токен в пути. Это создает слот в пути для **параметра маршрута**.
В этом случае маршрутизатор вставит `id` героя в этот слот.

Если вы скажете маршрутизатор, чтобы перейти к компоненту детализации и отображению «Magneta»,
Вы ожидаете героя идентификатор появится в URL браузера, как это:


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



Если пользователь вводит этот URL в адресную строку браузера, маршрутизатор должен распознать
шаблон и перейти к тому же «Магнете» в подробном виде.


<div class="callout is-helpful">



<header>
  Параметр маршрута: Обязательный или необязательный?
</header>



Встраивание токена параметра маршрута, `:id`,
в пути определения маршрута хороший выбор для этого сценария
поскольку `id` будет *необходим* самым `HeroDetailComponent` и потому
Значение `15` в пути четко отличает маршрут от "Магнета" от
маршрут для какого-то другого героя.


</div>


{@a route-parameters}


{@a setting-the-route-parameters-in-the-list-view}
#### Настройка параметров маршрута в виде списка

После перехода к `HeroDetailComponent`, вы ожидаете увидеть детали выбранного героя.
Вам нужно *две* части информации: путь к компоненту и героя `id`.

Соответственно, массив _link параметров имеет *два* элемента: путь _path_и параметр _route_, который указывает
 `id` выбранного героя.


<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>



Маршрутизатор сочиняет URL назначения из массива, как это:
 `localhost:4200/hero/15`.



<div class="alert is-helpful">



Как работает цель `HeroDetailComponent` узнать об этом `id` ?
Не анализируйте URL. Пусть роутер это сделает.

Маршрутизатор извлекает параметр маршрута (`id:15`) из URL и предоставляет его
 `HeroDetailComponent ` через ` ActivatedRoute` service.


</div>

{@a activated-route}

{@a activated-route-in-action}
### _Активированный маршрут_ в действии

Импортировать `Router`, `ActivatedRoute` и `ParamMap` из пакета маршрутизатора.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (activated route)" region="imports"></code-example>



Импортировать `switchMap` оператор потому что он понадобится вам позже для обработки `Observable` параметры маршрута.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (switchMap operator import)" region="rxjs-operator-import"></code-example>



{@a hero-detail-ctor}


Как обычно, вы пишете конструктор, который просит Angular добавить сервисы
что компонент требует и ссылаться на них как частные переменные.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (constructor)" region="ctor"></code-example>

Позже, в `ngOnInit` Метод, вы используете `ActivatedRoute` Сервис для получения параметров для маршрута
вытащить героя `id` из параметров и получить героя для отображения.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit)" region="ngOnInit"></code-example>

 `paramMap` Обработка немного сложнее. Когда карта меняется, вы `get()` 
 `id` Параметр из измененных параметров.

Затем вы говорите `HeroService` чтобы получить героя с этим `id` и вернуть результат `HeroService`.

Вы можете подумать об использовании RxJS `map` оператор.
Но `HeroService` возвращает `Observable<Hero>`.
Таким образом, вы сгладить `Observable` с `switchMap` оператор.

 `switchMap` Оператор также отменяет предыдущие запросы в полете. Если пользователь переходит на этот маршрут
с новым `id` то время как `HeroService` все еще старый `id`, `switchMap` отбрасывает этот старый запрос и возвращает героя для нового `id`.

Наблюдаемый `Subscription` будет обрабатываться `AsyncPipe` и компоненты `hero` свойство будет (пере) установлено с найденным героем.

{@a parammap-api}
#### _ParamMap_ API

 `ParamMap` API вдохновлен [интерфейс URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams). Это обеспечивает методы
обрабатывать доступ к параметрам для обоих параметров маршрута (`paramMap`) и параметры запроса (`queryParamMap`).

<table>
  <tr>
    <th>
      Член
    </th>

    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td>
      <code>has(name)</code>
    </td>
    <td>

    Возвращает `true` если имя параметра указано в карте параметров.

    </td>
  </tr>

  <tr>
    <td>
      <code>get(name)</code>
    </td>
    <td>

    Возвращает значение имени параметра (a `string`), если присутствует, или `null` если имя параметра отсутствует на карте. Возвращает элемент _first_, если значение параметра фактически является массивом значений.

    </td>
  </tr>

  <tr>
    <td>
      <code>getAll(name)</code>
    </td>
    <td>

    Возвращает `string array` значения имени параметра, если он найден, или пустой `array` если значение имени параметра отсутствует на карте. использование `getAll` когда один параметр может иметь несколько значений.

    </td>
  </tr>

  <tr>
    <td>
      <code>keys</code>
    </td>
    <td>

    Возвращает `string array` всех имен параметров на карте.

    </td>
  </tr>
</table>

{@a reuse}

{@a observable-<i>parammap</i>-and-component-reuse}
#### Наблюдаемый <i>paramMap </i>и повторное использование компонента

В этом примере вы извлекаете карту параметров маршрута из `Observable`.
Это подразумевает, что карта параметров маршрута может изменяться в течение времени жизни этого компонента.

Они могли бы. По умолчанию маршрутизатор повторно использует экземпляр компонента, когда он переходит к тому же типу компонента
не посещая другой компонент сначала. Параметры маршрута могут меняться каждый раз.

Предположим, что панель навигации родительского компонента имеет кнопки «вперед» и «назад»
что пролистал список героев.
Каждый щелчок обязательно переходил к `HeroDetailComponent` со следующим или предыдущим `id`.

Вы не хотите, чтобы маршрутизатор удалил текущий `HeroDetailComponent` из DOM только для повторного создания его для следующего `id`.
Это может быть заметно неприятно.
Лучше просто повторно использовать тот же экземпляр компонента и обновить параметр.

К сожалению, `ngOnInit` вызывается только один раз для каждого экземпляра компонента.
Вам нужен способ определить, когда параметры маршрута изменяются с _в одном и том же экземпляре_.
Наблюдаемый `paramMap` прекрасно справляется с этим.


<div class="alert is-helpful">



При подписке на наблюдаемое в компоненте вы почти всегда соглашаетесь отменить подписку, когда компонент уничтожен.

Есть несколько исключительных наблюдаемых, где это не обязательно.
 `ActivatedRoute` наблюдаемые являются одним из исключений.

 `ActivatedRoute` и его наблюдаемые изолированы от `Router` Сам.
 `Router` уничтожает маршрутизируемый компонент, когда он больше не нужен и внедрен `ActivatedRoute` умирает вместе с ним.

Не стесняйтесь отписаться в любом случае. Это безвредно и никогда не бывает плохой практикой.


</div>



{@a snapshot}


{@a snapshot-the-no-observable-alternative}
#### _Snapshot_: _no-observable_ альтернатива
_Это приложение не будет повторно использовать `HeroDetailComponent`.
Пользователь всегда возвращается в список героев, чтобы выбрать другого героя для просмотра.
Нет способа перейти от одной детали героя к другой детали героя
без посещения компонента списка между ними.
Поэтому роутер создает новый `HeroDetailComponent` каждый раз.

Когда вы точно знаете, что `HeroDetailComponent` экземпляр будет *никогда, никогда, никогда*
использовать повторно, вы можете упростить код со *снимком*.

 `route.snapshot` предоставляет начальное значение карты параметров маршрута.
Вы можете получить доступ к параметрам напрямую, не подписываясь и не добавляя наблюдаемые операторы.
Гораздо проще писать и читать


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.2.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (ngOnInit snapshot)" region="snapshot"></code-example>



<div class="alert is-helpful">



**Помните:** с помощью этой техники вы получите только значение _initial_ карты параметров.
Палка с наблюдаемым `paramMap` если есть даже шанс, что маршрутизатор
может повторно использовать компонент.
Этот образец остается с наблюдаемым `paramMap` Стратегия всякий случай.


</div>



{@a nav-to-list}


{@a navigating-back-to-the-list-component}
### Переход обратно к списку компонентов

 `HeroDetailComponent` имеет кнопку "Назад", привязанную к его `gotoHeroes` метод который перемещается обязательно
назад к `HeroListComponent`.

Роутер `navigate` Метод принимает те же одноэлементные _link параметры array_
что вы можете привязать к `[routerLink]` директива.
Он содержит путь к `HeroListComponent` _:


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (excerpt)" region="gotoHeroes"></code-example>


{@a optional-route-parameters}

{@a route-parameters-required-or-optional}
#### Параметры маршрута: Обязательно или необязательно?

Используйте [* параметры маршрута*](#route-parameters)чтобы указать *требуемое* значение параметра *в* URL-адресе маршрута
как вы делаете при переходе к `HeroDetailComponent` для того, чтобы увидеть героя с *идентификатором* 15:


<code-example format="nocode">
  localhost:4200/hero/15

</code-example>



Вы также можете добавить *дополнительную* информацию в запрос маршрута.
Например, при возврате в список hero-detail.component.ts из подробного представления hero
было бы неплохо, если бы просматриваемый герой был предварительно выбран в списке.


<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected hero">
</div>



Вы реализуете эту функцию в одно мгновение, включая просмотренных героев. `id` 
в URL-адресе в качестве необязательного параметра при возврате из `HeroDetailComponent`.

Дополнительная информация принимает другие формы. Критерии поиска часто слабо структурированы, например, `name='wind*'`.
Несколько значений являются общими `after='12/31/2015' & before='1/1/2017'` - нет
определенный порядок- `before='1/1/2017' & after='12/31/2015'` - в
разнообразие форматов `during='currentYear'`.

Эти типы параметров не легко вписываются в URL- *путь*. Даже если бы вы могли определить подходящую схему токена URL
это значительно усложняет сопоставление с шаблоном, необходимое для перевода входящего URL-адреса в именованный маршрут.

Дополнительные параметры являются идеальным средством передачи произвольно сложной информации во время навигации.
Необязательные параметры не участвуют в сопоставлении с образцом и обеспечивают гибкость выражения.

Маршрутизатор поддерживает навигацию с дополнительными параметрами, а также с необходимыми параметрами маршрута.
Определите _optional_ параметры в отдельном объекте _after_ вы определяете необходимые параметры маршрута.

В общем, предпочитайте *обязательный параметр маршрута,* когда
значение является обязательным (например, если необходимо отличить один маршрут от другого);
предпочитайте *необязательный параметр,* когда значение является необязательным, сложным и / или многомерным.


{@a optionally-selecting}


{@a heroes-list-optionally-selecting-a-hero}
#### Список героев: выбор героя

При переходе к `HeroDetailComponent` вы указали _required_ `id` героя для редактирования в
*параметр маршрута* и сделал его вторым элементом [_link параметры array_](#link-parameters-array).


<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (link-parameters-array)" region="link-parameters-array"></code-example>



В роутер встроен `id` Значение в URL навигации, потому что вы его определили
в качестве параметра маршрута с `:id` токен-заполнитель в маршруте `path` :


<code-example path="router/src/app/heroes/heroes-routing.module.1.ts" header="src/app/heroes/heroes-routing.module.ts (hero-detail-route)" region="hero-detail-route"></code-example>



Когда пользователь нажимает кнопку «Назад», `HeroDetailComponent` другой массив _link параметров
который он использует, чтобы вернуться к `HeroListComponent`.


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.1.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (gotoHeroes)" region="gotoHeroes"></code-example>



В этом массиве отсутствует параметр маршрута, поскольку у вас не было причин отправлять информацию `HeroListComponent`.

Теперь у вас есть причина. Вы хотите отправить идентификатор текущего героя с запросом навигации, чтобы
 `HeroListComponent` может выделить этого героя в своем списке.
Это отличная особенность; список будет отображаться очень хорошо без него.

Отправить `id` объекта, который содержит _optional_ `id` параметр.
Для демонстрации, есть дополнительный параметр барахла (`foo`) в объекте, который `HeroListComponent` следует игнорировать.
Вот пересмотренные навигации заявление:


<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts" header="src/app/heroes/hero-detail/hero-detail.component.ts (go to heroes)" region="gotoHeroes"></code-example>



Приложение все еще работает. Нажатие «назад» возвращает к просмотру списка героев.

Посмотрите на адресную строку браузера.


Это должно выглядеть примерно так, в зависимости от того, где вы запустите его:


<code-example language="bash">
  localhost:4200/heroes;id=15;foo=foo

</code-example>



 `id` значение появляется в URL как (`;id=15;foo=foo`), а не в пути URL.
Путь для маршрута "Героев" не имеет `:id` токен.

Необязательные параметры маршрута не разделяются знаком «?» и "&", как они будут в строке запроса URL.
Они **разделены точкой с запятой ";"**
Это *матричная URL* нотация - то, чего вы раньше не видели.


<div class="alert is-helpful">



*Матричная URL* нотация - это идея, впервые представленная
в предложении [1996 г.](http://www.w3.org/DesignIssues/MatrixURIs.html)основателя сети Тима Бернерса-Ли.

Хотя матричная запись никогда не превращалась в стандарт HTML, это законно и
это стало популярным среди браузерных систем маршрутизации как способ изолировать параметры
принадлежность к родительскому и дочернему маршрутам. Маршрутизатор такой системы и обеспечивает
поддержка матричной записи в браузерах.

Синтаксис может показаться вам странным, но пользователи вряд ли заметят или позаботятся
до тех пор, пока URL можно отправить по электронной почте и вставить в адресную строку браузера
как это можно.

</div>



{@a route-parameters-activated-route}


{@a route-parameters-in-the-*activatedroute*-service}
### Параметры маршрута в *ActivatedRoute* сервисе

Список героев не изменился. Строка героя не выделена.


<div class="alert is-helpful">



<live-example></live-example> *Ли* выделить выбранный
строка, потому что она демонстрирует конечное состояние приложения, которое включает в себя шаги, которые вы *собираетесь* охватить.
На данный момент это руководство описывает положение дел *до* этих шагов.

</div>



 `HeroListComponent` вообще не ожидает никаких параметров и не знает, что с ними делать.
Вы можете изменить это.

Ранее при навигации из `HeroListComponent` к `HeroDetailComponent`,
вы подписались на карту параметров маршрута `Observable` и сделал его доступным для `HeroDetailComponent` 
в `ActivatedRoute` service.
Вы внедрили эту службу в конструктор `HeroDetailComponent`.

На этот раз вы будете двигаться в противоположном направлении, от `HeroDetailComponent` к `HeroListComponent`.

Сначала вы расширяете оператор импорта маршрутизатора, чтобы включить `ActivatedRoute` символ службы:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (import)" region="import-router"></code-example>



Импортировать `switchMap` оператор для выполнения операции на `Observable` карта параметров маршрута.


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (rxjs imports)" region="rxjs-imports"></code-example>



Затем вы вводите `ActivatedRoute` в `HeroListComponent` конструктор.


<code-example path="router/src/app/heroes/hero-list/hero-list.component.ts" header="src/app/heroes/hero-list/hero-list.component.ts (constructor and ngOnInit)" region="ctor"></code-example>



 `ActivatedRoute.paramMap` Свойство является `Observable` карта параметров маршрута. `paramMap` испускает новую карту значений, которая включает `id` 
когда пользователь переходит к компоненту. В `ngOnInit` вы подписываетесь на эти значения, установите `selectedId` и получить героев.


Обновите шаблон с помощью [привязка класса](guide/template-syntax#class-binding).
Привязка добавляет `selected` класс CSS, когда сравнение возвращает `true` и удаляет его, когда `false`.
Ищите это в повторном `<li>` тег, как показано здесь:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.html" header="src/app/heroes/hero-list/hero-list.component.html"></code-example>

Добавьте несколько стилей, которые будут применяться при выборе элемента списка.

<code-example path="router/src/app/heroes/hero-list/hero-list.component.css" region="selected" header="src/app/heroes/hero-list/hero-list.component.css"></code-example>



Когда пользователь из Перемещение по списку героев к герою «Magneta» и обратно, «Magneta» Выбирается:

<div class="lightbox">
  <img src='generated/images/guide/router/selected-hero.png' alt="Selected List">
</div>



Необязательный `foo` Параметр маршрута безвреден и продолжает игнорироваться.

{@a adding-routable-animations}
### Добавление маршрутизируемой анимации

{@a route-animation}


{@a adding-animations-to-the-routed-component}
#### Добавление анимации в перенаправленный компонент
Функциональный модуль для героев почти готов, но что за функция без плавных переходов?

В этом разделе показано, как добавить некоторые [анимации](guide/animations)к `HeroDetailComponent`.

Сначала импортируйте `BrowserAnimationsModule` и добавьте его в `imports` массива:

<code-example path="router/src/app/app.module.ts" header="src/app/app.module.ts (animations-module)" region="animations-module"></code-example>

Затем добавьте `data` объект для маршрутов для `HeroListComponent` и `HeroDetailComponent` . Переходы основаны на `states` и вы будете использовать `animation` данные из маршрута для обеспечения именованной анимации `state` для переходов.

<code-example path="router/src/app/heroes/heroes-routing.module.2.ts" header="src/app/heroes/heroes-routing.module.ts (animation data)"></code-example>


Создать `animations.ts` Файл в корне `src/app/` папка . Содержание выглядеть следующим образом :

<code-example path="router/src/app/animations.ts" header="src/app/animations.ts (excerpt)"></code-example>


Этот файл выполняет следующие действия :

* Импортирует символы анимации, которые создают триггеры анимации, управляют состоянием и управляют переходами между состояниями.

* Экспортирует константу с именем `slideInAnimation` установлен на триггер анимации с именем* `routeAnimation`*;

* Определяет один*переход * при переключении назад и вперед от `heroes` и `hero` направляет, чтобы облегчить компонент в левой части экрана, когда он входит в представление приложения (`:enter`), другой для анимации компонента справа при выходе из представления приложения (`:leave`).

Вы также можете создать больше переходов для других маршрутов. Этого триггера достаточно для текущего этапа.

Вернуться в `AppComponent`, импортировать `RouterOutlet` Маркер от `@angular/router` пакет и `slideInAnimation` from
 `'./animations.ts`.

Добавить `animations` массив в `@Component` Метаданные, которые содержат `slideInAnimation`.

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (animations)" region="animation-imports"></code-example>

Для того, чтобы использовать маршрутизируемые анимации, вам нужно обернуть `RouterOutlet` внутри элемента. Вы будете
использовать `@routeAnimation` Триггер и привязать его к элементу.

Для `@routeAnimation` в ключевые состояния отключены, вам нужно предоставить `data` из `ActivatedRoute` . `RouterOutlet` выставлен как `outlet` переменная шаблона, поэтому вы привязываете ссылку на розетку маршрутизатора. Переменная `routerOutlet` - идеальный выбор.

<code-example path="router/src/app/app.component.2.html" header="src/app/app.component.html (router outlet)"></code-example>

 `@routeAnimation` привязано к `getAnimationData` с предоставленным `routerOutlet`, поэтому вам нужно определить эту функцию в `AppComponent` . `getAnimationData` Функция возвращает свойство анимации из `data` предоставленные через `ActivatedRoute` . `animation` свойство соответствует `transition` имена вы использовали в `slideInAnimation` определен в `animations.ts`.

<code-example path="router/src/app/app.component.2.ts" header="src/app/app.component.ts (router outlet)" region="function-binding"></code-example>

При переключении между двумя маршрутами `HeroDetailComponent` и `HeroListComponent` будет облегчен слева при маршрутизации и вправо при навигации.



{@a milestone-3-wrap-up}


{@a milestone-3-wrap-up}
### Веха 3 завершение

Вы узнали, как сделать следующее:

* Организуйте приложение в области*функций *.
* Обязательно переходите от одного компонента к другому.
* Передайте информацию в параметрах маршрута и подпишитесь на них в компоненте.
* Импортируйте область функций NgModule в `AppModule`.
* Применение маршрутизируемой анимации на основе страницы.

После этих изменений, структура папок выглядит следующим образом :


<div class='filetree'>

  <div class='file'>
    angular-router-sample
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
          кризис-лист
        </div>

          <div class='children'>

            <div class='file'>
              кризис-list.component.css
            </div>

            <div class='file'>
              кризис-list.component.html
            </div>

            <div class='file'>
              кризис-list.component.ts
            </div>

          </div>

        <div class='file'>
          герои
        </div>

        <div class='children'>

          <div class='file'>
            герой-деталь
          </div>

            <div class='children'>

              <div class='file'>
                hero-detail.component.css
              </div>

              <div class='file'>
                hero-detail.component.html
              </div>

              <div class='file'>
                hero-detail.component.ts
              </div>

            </div>

          <div class='file'>
            список героев
          </div>

            <div class='children'>

              <div class='file'>
                hero-list.component.css
              </div>

              <div class='file'>
                hero-list.component.html
              </div>

              <div class='file'>
                hero-list.component.ts
              </div>

            </div>

          <div class='file'>
            hero.service.ts
          </div>

          <div class='file'>
            герой.ц
          </div>

          <div class='file'>
            heroes-routing.module.ts
          </div>

          <div class='file'>
            heroes.module.ts
          </div>

          <div class='file'>
            mock-heroes.ts
          </div>

        </div>

        <div class='file'>
          страница не найдена
        </div>

        <div class='children'>

          <div class='file'>

            page-not-found.component.css

          </div>

          <div class='file'>

            page-not-found.component.html

          </div>

          <div class='file'>

            page-not-found.component.ts

          </div>

        </div>

      </div>

      <div class='file'>
        animations.ts
      </div>

      <div class='file'>
        app.component.css
      </div>

      <div class='file'>
        app.component.html
      </div>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

      <div class='file'>
        app-routing.module.ts
      </div>

      <div class='file'>
        main.ts
      </div>

      <div class='file'>
        message.service.ts
      </div>

      <div class='file'>
        index.html
      </div>

      <div class='file'>
        styles.css
      </div>

      <div class='file'>
        tsconfig.json
      </div>

    </div>

    <div class='file'>
      node_modules ...
    </div>

    <div class='file'>
      package.json
    </div>

  </div>

</div>

Вот соответствующие файлы для этой версии примера приложения.

<code-tabs>

  <code-pane header="animations.ts" path="router/src/app/animations.ts">

  </code-pane>

  <code-pane header="app.component.html" path="router/src/app/app.component.2.html">

  </code-pane>

  <code-pane header="app.component.ts" path="router/src/app/app.component.2.ts">

  </code-pane>

  <code-pane header="app.module.ts" path="router/src/app/app.module.3.ts">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.2.ts" region="milestone3">

  </code-pane>

  <code-pane header="hero-list.component.css" path="router/src/app/heroes/hero-list/hero-list.component.css">

  </code-pane>

  <code-pane header="hero-list.component.html" path="router/src/app/heroes/hero-list/hero-list.component.html">

  </code-pane>

  <code-pane header="hero-list.component.ts" path="router/src/app/heroes/hero-list/hero-list.component.ts">

  </code-pane>

  <code-pane header="hero-detail.component.html" path="router/src/app/heroes/hero-detail/hero-detail.component.html">

  </code-pane>

  <code-pane header="hero-detail.component.ts" path="router/src/app/heroes/hero-detail/hero-detail.component.3.ts">

  </code-pane>

  <code-pane header="hero.service.ts" path="router/src/app/heroes/hero.service.ts">

  </code-pane>

  <code-pane header="heroes.module.ts" path="router/src/app/heroes/heroes.module.ts">

  </code-pane>

  <code-pane header="heroes-routing.module.ts" path="router/src/app/heroes/heroes-routing.module.2.ts">

  </code-pane>

  <code-pane header="message.service.ts" path="router/src/app/message.service.ts">

  </code-pane>

</code-tabs>



{@a milestone-4}



{@a milestone-4-crisis-center-feature}
## Milestone 4: Кризис особенность центра

Пришло время добавить реальные функции в текущий кризисный центр приложения.

Начните имитирующие функции героев:

* Создать `crisis-center` подпапка в `src/app` папка.
* Скопируйте файлы и папки из `app/heroes` в новый `crisis-center` папка.
* В новых файлах поменяйте каждое упоминание «герой» на «кризис», а «героев» на «кризисы».
* Переименуйте файлы NgModule в `crisis-center.module.ts` и `crisis-center-routing.module.ts`.

Вы будете использовать ложные кризисы вместо насмешливых героев


<code-example path="router/src/app/crisis-center/mock-crises.ts" header="src/app/crisis-center/mock-crises.ts"></code-example>


Получившийся кризисный центр является основой для введения новой концепции - **маршрутизации детей**.
Вы можете оставить *героев* в их текущем состоянии, в отличие от *кризисного центра*
и решить позже, если различия стоят.


<div class="alert is-helpful">



В соответствии с
<a href="https://blog.8thlight.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html" title="Separation of Concerns">*Разделение интересов* принципа </a>,
изменения в *кризисный центр* не повлияет на `AppModule` или
компонент любой другой функции.

</div>



{@a crisis-child-routes}


{@a a-crisis-center-with-child-routes}
### Кризисный центр с детскими маршрутами

В этом разделе показано, как организовать кризисный центр
в соответствии со следующем рекомендуемым шаблоном для Angular приложений:

* Каждая область функций находится в отдельной папке.
* Каждая функция имеет свой собственный Angular модуль.
* Каждая область имеет свой собственный корневой компонент.
* Каждый корневой компонент области имеет свой собственный выход маршрутизатора и дочерние маршруты.
* Маршруты области объектов редко (если вообще) пересекаются с маршрутами других объектов.

Если ваше приложение было много функциональных областей, то приложение компонент деревьев может выглядеть следующим образом :


<div class="lightbox">
  <img src='generated/images/guide/router/component-tree.png' alt="Component Tree">
</div>



{@a child-routing-component}


### Дочерний компонент маршрутизации

Создать `CrisisCenter` Компонент в `crisis-center` папки:

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center
</code-example>

Обновление шаблона компонента, чтобы выглядеть следующим образом :

<code-example path="router/src/app/crisis-center/crisis-center/crisis-center.component.html" header="src/app/crisis-center/crisis-center/crisis-center.component.html"></code-example>

 `CrisisCenterComponent` имеет следующие общие черты с `AppComponent` :

* Это*корень * зоны кризисного центра
как только `AppComponent` является корнем всего приложения.
* Это*оболочка * для области управления кризисными ситуациями
так же, как `AppComponent` - это оболочка для управления рабочим процессом высокого уровня.

Как и большинство снарядов, `CrisisCenterComponent` Класс очень прост, даже проще, чем `AppComponent` :
у него нет бизнес-логики, а его шаблон не имеет ссылок, только заголовок и
 `<router-outlet>` для детского компонента кризисного центра.


{@a child-route-config}


{@a child-route-configuration}
### Конфигурация дочернего маршрута

В качестве главной страницы для функции «Кризисный центр» создайте `CrisisCenterHome` Компонент в `crisis-center` папка.

<code-example language="none" class="code-shell">
  ng generate component crisis-center/crisis-center-home
</code-example>

Обновите шаблон с приветственным сообщением `Crisis Center`.

<code-example path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html" header="src/app/crisis-center/crisis-center-home/crisis-center-home.component.html"></code-example>

Обновите `crisis-center-routing.module.ts` вы переименовали после копирования из `heroes-routing.module.ts` файл.
На этот раз вы определяете **дочерние маршруты** *в* родительском `crisis-center` маршрут.

<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (Routes)" region="routes"></code-example>


Обратите внимание, что родитель `crisis-center` Маршрут имеет `children` собственность
с одним маршрутом, содержащим `CrisisListComponent` . `CrisisListComponent` маршрут
также имеет `children` массив с двумя маршрутами.

Эти два маршрута ведут к дочерним компонентам кризисного центра
 `CrisisCenterHomeComponent ` и ` CrisisDetailComponent`, соответственно.

Существуют *важные различия* в том, как маршрутизатор обрабатывает эти маршруты детей.

Маршрутизатор отображает компоненты этих маршрутов в `RouterOutlet` 
из `CrisisCenterComponent`, не в `RouterOutlet` из `AppComponent` shell.

 `CrisisListComponent` содержит список кризисов и `RouterOutlet` to
отобразить `Crisis Center Home ` и ` Crisis Detail` маршрута.

 `Crisis Detail` маршрута - дитя `Crisis List` . Маршрутизатор [повторно использует компоненты](#reuse)
по умолчанию, поэтому `Crisis Detail` Компонент будет использоваться повторно при выборе различных кризисов.
Напротив, обратно в `Hero Detail` Маршрут [компонент был воссоздан](#snapshot-the-no-observable-alternative)каждый раз, когда вы выбираете другого героя из списка героев.

На верхнем уровне, пути, которые начинаются с `/` обратитесь к корню приложения.
Но дочерние маршруты *расширяют* путь родительского маршрута.
С каждым шагом вниз по дереву маршрутов
Вы добавляете косую черту, за которой следует путь к маршруту, если только путь не _empty_

Примените эту логику к навигации внутри кризисного центра, для которого родительский путь `/crisis-center`.

* Для перехода к `CrisisCenterHomeComponent`, полный URL-адрес `/crisis-center` (`/crisis-center` + `''` + `''`).

* Для перехода к `CrisisDetailComponent` для кризиса с `id=2`, полный URL является
 `/crisis-center/2 ` (` /crisis-center ` + ` ''` + `'/2'`)

Абсолютный URL для последнего примера, включая `localhost` происхождение, есть

<code-example>
  localhost:4200/crisis-center/2

</code-example>



Вот полный `crisis-center-routing.module.ts` Файл с его импортом.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.1.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (excerpt)"></code-example>



{@a import-crisis-module}


{@a import-crisis-center-module-into-the-*appmodule*-routes}
### Импортировать модуль кризисного центра в *AppModule* маршруты

Как с `HeroesModule`, вы должны добавить `CrisisCenterModule` для `imports` массив `AppModule` 
_перед `AppRoutingModule` :

<code-tabs>

  <code-pane path="router/src/app/crisis-center/crisis-center.module.ts"header="src/app/crisis-center/crisis-center.module.ts">

  </code-pane>

  <code-pane path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (import CrisisCenterModule)" region="crisis-center-module">

  </code-pane>

</code-tabs>

Удалить первоначальный маршрут кризисного центра из `app-routing.module.ts`.
Функциональные маршруты теперь предоставляются `HeroesModule` и `CrisisCenter` Модули.

 `app-routing.module.ts` файле хранятся маршруты приложений верхнего уровня, такие как маршруты по умолчанию и групповые маршруты.


<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (v3)" region="v3"></code-example>




{@a relative-navigation}


### Относительная навигация

Создавая функцию кризисного центра, вы перешли к
маршрут детализации кризиса, используя **абсолютный путь,** который начинается с _slash_.

Маршрутизатор сопоставляет такие _absolute_ пути с маршрутами, начиная с верхней части конфигурации маршрута.

Вы можете продолжать использовать такие абсолютные пути для навигации внутри *Кризисного центра*
особенность, но это закрепляет ссылки на родительскую структуру маршрутизации.
Если вы изменили родителя `/crisis-center` Путь к, вам придется изменить массив параметров ссылки.

Вы можете освободить ссылки от этой зависимости, определив пути **относительно** текущего сегмента URL.
Навигация _ внутри области объекта остается неизменной, даже если вы измените путь родительского маршрута к объекту.

Вот пример:


<div class="alert is-helpful">



Маршрутизатор поддерживает каталоги, как синтаксис в течение _link параметров list_, чтобы помочь имя маршрута поиск:

 `./` или же `no leading slash` отсутствует относительно текущего уровня.

 `../` чтобы подняться на один уровень вверх по маршруту.

Вы можете комбинировать относительный синтаксис навигации с путем предка.
Если вам нужно перейти на маршрут родного брата, вы можете использовать `../<sibling>` конвенция подняться
один уровень, затем вверх и вниз по пути родного брата.


</div>



Для навигации по относительному пути с помощью `Router.navigate` Метод, вы должны предоставить `ActivatedRoute` 
дать маршрутизатору информацию о том, где вы находитесь в текущем дереве маршрутов.

После _link параметров array_, добавьте объект с `relativeTo` свойство, установленное в `ActivatedRoute`.
Затем маршрутизатор вычисляет целевой URL на основе местоположения активного маршрута.


<div class="alert is-helpful">



**Всегда** указывайте полный путь _absolute_ при вызове маршрутизатора `navigateByUrl` метод.


</div>



{@a nav-to-crisis}


{@a navigate-to-crisis-list-with-a-relative-url}
### Перейдите к списку кризисов с относительным URL

Вы уже ввели `ActivatedRoute` что вам нужно составить относительный путь навигации.

При использовании `RouterLink` для навигации вместо `Router` Служба, вы бы использовали _same_
массив параметров ссылки, но вы не предоставите объекту `relativeTo` свойство.
 `ActivatedRoute` подразумевается в `RouterLink` Директива.


Обновите `gotoCrises` метод из `CrisisDetailComponent` для возврата к *кризисных центров* списку с использованием относительной навигации по пути.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (relative navigation)" region="gotoCrises-navigate"></code-example>


Обратите внимание, что путь идет вверх по уровню, используя `../` синтаксис.
Если текущий кризис `id` является `3`, в результате путь к списку кризисов `/crisis-center/;id=3;foo=foo`.


{@a named-outlets}



{@a displaying-multiple-routes-in-named-outlets}
### Отображение нескольких маршрутов в именованных точках

Вы решаете дать пользователям возможность связаться с кризисным центром.
Когда пользователь нажимает кнопку «Контакт», вы хотите отобразить сообщение во всплывающем окне.

Всплывающее окно должно оставаться открытым даже при переключении между страницами в приложении, пока пользователь не закроет его
отправив сообщение или отменив.
Очевидно, что вы не можете поместить всплывающее окно в ту же розетку, что и другие страницы.

До сих пор вы определили один выход и вложили дочерние маршруты
под этим выходом группировать маршруты вместе.
Маршрутизатор поддерживает только один первичный выход _unname_ для каждого шаблона.

Шаблон также может иметь любое количество _named_ выходов.
Каждая названная торговая точка имеет свой набор маршрутов со своими компонентами.
Несколько торговых точек могут отображать разный контент, определяемый разными маршрутами, все одновременно.

Добавьте розетку с именем «всплывающее» в `AppComponent`, прямо под неназванной розеткой.


<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (outlets)" region="outlets"></code-example>



Вот куда пойдет всплывающее окно, как только вы научитесь направлять на него всплывающий компонент.


{@a secondary-routes}


#### Вторичные маршруты

Именованные точки являются целью _secondary route_.

Вторичные маршруты выглядят как основные маршруты, и вы настраиваете их таким же образом.
Они отличаются по нескольким ключевым аспектам.

* Они независимы друг от друга.
* Они работают в сочетании с другими маршрутами.
* Они отображаются в названных торговых точках.

Создайте новый компонент для составления сообщения.

<code-example language="none" class="code-shell">
  ng generate component compose-message
</code-example>

Он отображает простую форму с заголовком, в поле ввода для сообщения,
и две кнопки «Отправить» и «Отмена».


<div class="lightbox">
  <img src='generated/images/guide/router/contact-popup.png' alt="Contact popup">
</div>



Вот компонент, его шаблон и стили:


<code-tabs>

  <code-pane header="src/app/compose-message/compose-message.component.css" path="router/src/app/compose-message/compose-message.component.css">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.html" path="router/src/app/compose-message/compose-message.component.html">

  </code-pane>

  <code-pane header="src/app/compose-message/compose-message.component.ts" path="router/src/app/compose-message/compose-message.component.ts">

  </code-pane>

</code-tabs>



Он выглядит примерно так же, как и любой другой компонент, который вы видели в этом руководстве.
Есть два примечательных различия.

Обратите внимание, что `send()` Метод имитирует задержку, подождав секунду, прежде чем «отправить» сообщение и закрыть всплывающее окно.

 `closePopup()` закрывает всплывающее окно путем к всплывающему окну с `null`.
Эта особенность раскрыта [ниже](#clear-secondary-routes).


{@a add-secondary-route}


{@a add-a-secondary-route}
#### Добавьте дополнительный маршрут

Открой `AppRoutingModule` и добавьте новый `compose` маршрут к `appRoutes`.

<code-example path="router/src/app/app-routing.module.3.ts" header="src/app/app-routing.module.ts (compose route)" region="compose"></code-example>



 `path ` и ` component` Свойства должны быть знакомы.
Там новая собственность, `outlet`, установленный на `'popup'`.
Этот маршрут теперь предназначен для всплывающих окон и `ComposeMessageComponent` будет отображаться там.

Пользователю нужен способ открыть всплывающее окно.
Открой `AppComponent` и добавьте ссылку «Контакт».

<code-example path="router/src/app/app.component.4.html" header="src/app/app.component.html (contact-link)" region="contact-link"></code-example>



Хотя `compose` маршрут прикреплен к «всплывающему» выходу, этого недостаточно для подключения маршрута к `RouterLink` Директива.
Вы должны указать именованный выход в массиве параметров _link и связать его с `RouterLink` с привязкой свойства.

_Link параметры array_ содержит объект с одним `outlets` недвижимости, стоимость которой
другой объект, обозначенный одним (или несколькими) именами розеток.
В этом случае есть только свойство выхода «всплывающее», и его значением является другой массив _link параметров, который определяет `compose` маршрут.

По сути, вы говорите: _ когда пользователь нажимает эту ссылку, отобразите компонент, связанный с `compose` маршрут в `popup` окно


<div class="alert is-helpful">



Эта `outlets` объект внутри внешнего объекта был совершенно ненужным
когда был только один маршрут и один выход без названия.

Маршрутизатор предполагал, что ваша спецификация маршрута нацелена на первичный выход _unonym_
и создал эти объекты для вас.

Маршрутизация на именованный выход показала, ранее скрытый маршрутизатор истину:
Вы можете выбрать несколько торговых точек с несколькими маршрутами в одном `RouterLink` Директива.

Вы на самом деле не делаете это здесь.
Но чтобы нацелиться на именованный выход, вы должны использовать более богатый, более подробный синтаксис.


</div>



{@a secondary-route-navigation}


{@a secondary-route-navigation-merging-routes-during-navigation}
#### Вторичный маршрут навигации: объединение маршрутов во время навигации
Перейдите в _Crisis Center_ и нажмите «Контакт».
Вы должны увидеть что-то вроде следующего URL в адресной строке браузера.


<code-example>
  http://.../crisis-center(popup:compose)

</code-example>



Интересная часть URL следует за `...` :

* `crisis-center` является основной навигацией.
* Круглые скобки окружают вторичный маршрут.
* Вторичный маршрут состоит из названия точки (`popup`), `colon` разделитель и дополнительный маршрут (`compose`)

Нажмите на ссылку _Heroes_ и снова посмотрите на URL.


<code-example>
  http://.../heroes(popup:compose)
</code-example>



Основная навигационная часть изменилась; вторичный маршрут такой же.

Маршрутизатор отслеживает две отдельные ветви в дереве навигации и генерирует представление этого дерева в URL.

Вы можете добавить еще много точек и маршрутов на верхнем уровне и во вложенных уровнях, создавая дерево навигации с множеством ветвей.
Маршрутизатор сгенерирует URL, чтобы пойти с ним.

Вы можете указать маршрутизатору перемещаться по всему дереву сразу, заполнив `outlets` упомянутые выше.
Затем передайте этот объект внутри массива _link параметров в `router.navigate` Метод.

Экспериментируйте с этими возможностями на досуге.



{@a clear-secondary-routes}


{@a clearing-secondary-routes}
#### Расчистка вторичных маршрутов
Как вы узнали, компонент в розетке сохраняется до тех пор, пока вы не перейдете к новому компоненту.
Вторичные магазины ничем не отличаются в этом отношении.

Каждая вторичная розетка имеет свою собственную навигацию, независимую от навигации, ведущей в первичную розетку.
Изменение текущего маршрута, отображаемого в первичной розетке, не влияет на всплывающую розетку.
Вот почему всплывающее окно остается видимым, когда вы перемещаетесь среди кризисов и героев.

Нажатие кнопок «отправить» или «отменить» _действует_ очистить всплывающее окно.
Чтобы увидеть, как, посмотрите на `closePopup()` метод снова:

<code-example path="router/src/app/compose-message/compose-message.component.ts" header="src/app/compose-message/compose-message.component.ts (closePopup)" region="closePopup"></code-example>



Он обязательно перемещается с `Router.navigate()`, передающий в [массив параметров ссылки](#link-parameters-array).

Как массив, связанный с _Contact_ `RouterLink` в `AppComponent`,
этот включает в себя объект с `outlets` собственности.
 `outlets` Значение свойства - это еще один объект с именами розеток для ключей.
Единственная названная торговая точка `'popup'`.

На этот раз значение `'popup'` является `null` . Это не маршрут, но это законная ценность.
Настройка всплывающего окна `RouterOutlet` to `null` очищает розетку и удаляет
вторичный всплывающий маршрут от текущего URL.

{@a guards}

{@a milestone-5-route-guards}
## Веха 5: Маршрутная охрана

На данный момент *любой* пользователь может перемещаться в *любом месте* приложения в *любое время*.
Это не всегда правильно.

* Возможно, пользователь не авторизован для перехода к целевому компоненту.
* Может быть, пользователь должен войти (*аутентифицироваться *) в первую очередь.
* Может быть, вам следует получить некоторые данные, прежде чем отобразить целевой компонент.
* Вы можете сохранить ожидающие изменения перед выходом из компонента.
* Вы можете спросить пользователя, можно ли отменить ожидающие изменения, а не сохранить их.

Вы добавляете _guards_ в конфигурацию маршрута для обработки этих сценариев.

Возвращаемое значение охранника контролирует поведение маршрутизатора:

* Если он вернется `true`, процесс навигации продолжается.
* Если он вернется `false`, процесс навигации останавливается, и пользователь остается на месте.
* Если он возвращает `UrlTree`, текущая навигация отменяется, и новая навигация инициируется `UrlTree` вернулся.


<div class="alert is-helpful">

**Примечание** . Охранник также может указать маршрутизатору перемещаться в другом месте, эффективно отменяя текущую навигацию. Когда
делая это внутри охранника, охранник должен вернуться `false` ;

</div>

Охранник *может* вернуть свой логический ответ синхронно.
Но во многих случаях охранник не может дать ответ синхронно.
Охранник может задать пользователю вопрос, сохранить изменения на сервере или получить свежие данные.
Это все асинхронные операции.

Соответственно, охранник маршрутизации может вернуть `Observable<boolean>` или `Promise<boolean>` и
маршрутизатор будет ждать, пока наблюдаемое не разрешит `true` или `false`.

<div class="alert is-critical">

**Примечание** . Наблюдаемая информация, предоставляемая маршрутизатору, также должна быть завершена. Если наблюдаемое не завершено, навигация не будет продолжена.

</div>

Маршрутизатор поддерживает несколько интерфейсов сторожевых:

* [ `CanActivate` ](api/router/CanActivate)чтобы обеспечить навигацию*к * маршруту.

* [ `CanActivateChild` переход](api/router/CanActivateChild)чтобы обеспечить*к * дочернему маршруту.

* [ `CanDeactivate` ](api/router/CanDeactivate)посредничать навигации*далеко * от текущего маршрута.

* [ `Resolve` ](api/router/Resolve)чтобы выполнить поиск данных*перед * маршрута активацией маршрута.

* [ `CanLoad` ](api/router/CanLoad)чтобы обеспечить навигацию*к * функциональному модулю, загруженному _asynchronously_.


Вы можете иметь несколько охранников на каждом уровне иерархии маршрутизации.
Маршрутизатор проверяет `CanDeactivate` и `CanActivateChild` защищает от самого глубокого дочернего маршрута до вершины.
Затем он проверяет `CanActivate` охранников сверху вниз до самого глубокого дочернего маршрута. Если функциональный модуль
загружается асинхронно, `CanLoad` Guard проверяется перед загрузкой модуля.
Если _любой_ охранник возвращает ложь, в ожидании охранников, которые не завершены, будут отменены,
и вся навигация отменяется.

Есть несколько примеров в следующих нескольких разделах.


{@a can-activate-guard}


{@a canactivate-requiring-authentication}
### _CanActivate_: требуется аутентификация

Приложения часто ограничивают доступ к функциональной области в зависимости от того, кем является пользователь.
Вы можете разрешить доступ только аутентифицированным пользователям или пользователям с определенной ролью.
Вы можете заблокировать или ограничить доступ, пока учетная запись пользователя не будет активирована.

  `CanActivate` guard - инструмент для управления этими бизнес-правилами навигации.

{@a add-an-admin-feature-module}
#### Добавьте функциональный модуль администратора

В следующем разделе вы расширите кризисный центр новыми *административными* функциями.
Эти функции еще не определены.
Но вы можете начать с добавления нового функционального модуля с именем `AdminModule`.

Создать `admin` папка с файлом функционального модуля и файлом конфигурации маршрутизации.

<code-example language="none" class="code-shell">
  ng generate module admin --routing
</code-example>

Затем создайте вспомогательные компоненты.

<code-example language="none" class="code-shell">
  ng generate component admin/admin-dashboard
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/admin
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-crises
</code-example>

<code-example language="none" class="code-shell">
  ng generate component admin/manage-heroes
</code-example>

Структура администратор особенности файл выглядит следующим образом :


<div class='filetree'>

  <div class='file'>
    src / app / admin
  </div>

  <div class='children'>

    <div class='file'>
      админ
    </div>

      <div class='children'>

        <div class='file'>
          admin.component.css
        </div>

        <div class='file'>
          admin.component.html
        </div>

        <div class='file'>
          admin.component.ts
        </div>

      </div>

    <div class='file'>
      админ-панель
    </div>

      <div class='children'>

        <div class='file'>
          admin-dashboard.component.css
        </div>

        <div class='file'>
          admin-dashboard.component.html
        </div>

        <div class='file'>
          admin-dashboard.component.ts
        </div>

      </div>

    <div class='file'>
      управления-кризисов
    </div>

      <div class='children'>

        <div class='file'>
          manage-crises.component.css
        </div>

        <div class='file'>
          manage-crises.component.html
        </div>

        <div class='file'>
          manage-crises.component.ts
        </div>

      </div>

    <div class='file'>
      Управляй героями
    </div>

      <div class='children'>

        <div class='file'>
          manage-heroes.component.css
        </div>

        <div class='file'>
          manage-heroes.component.html
        </div>

        <div class='file'>
          manage-heroes.component.ts
        </div>

      </div>

    <div class='file'>
      admin.module.ts
    </div>

    <div class='file'>
      admin-routing.module.ts
    </div>

  </div>

</div>



Функциональный модуль администратора содержит `AdminComponent` используется для маршрутизации внутри
функциональный модуль, панель инструментов маршрута и два незавершенных компонента для управления кризисами и героями.


<code-tabs>

  <code-pane header="src/app/admin/admin/admin.component.html" path="router/src/app/admin/admin/admin.component.html">

  </code-pane>

  <code-pane header="src/app/admin/admin-dashboard/admin-dashboard.component.html" path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.html">

  </code-pane>

  <code-pane header="src/app/admin/admin.module.ts" path="router/src/app/admin/admin.module.ts">

  </code-pane>

  <code-pane header="src/app/admin/manage-crises/manage-crises.component.html" path="router/src/app/admin/manage-crises/manage-crises.component.html">

  </code-pane>

  <code-pane header="src/app/admin/manage-heroes/manage-heroes.component.html" path="router/src/app/admin/manage-heroes/manage-heroes.component.html">

  </code-pane>

</code-tabs>



<div class="alert is-helpful">



Хотя панель администратора `RouterLink` содержит только относительную косую черту без дополнительного сегмента URL
считается совпадением с любым маршрутом в области функций администратора. Вы хотите только `Dashboard` Ссылка на должна быть активной, когда пользователь посещает этот маршрут. Добавление дополнительной привязки к `Dashboard` маршрутизатора Link, `[routerLinkActiveOptions]="{ exact: true }"`, помечает `./` ссылка активна, когда пользователь переходит к `/admin` URL а не при переходе к любому из дочерних маршрутов.


</div>


{@a component-less-route}


{@a component-less-route-grouping-routes-without-a-component}
##### Маршрут без компонентов: группировка маршрутов без компонента

Начальная конфигурация администратора маршрутизации:


<code-example path="router/src/app/admin/admin-routing.module.1.ts" header="src/app/admin/admin-routing.module.ts (admin routing)" region="admin-routes"></code-example>

Глядя на детский маршрут под `AdminComponent`, есть `path` и `children` 
свойство, но оно не использует `component`.
Вы не ошиблись в конфигурации.
Вы определили маршрут _component-less_.

Цель состоит в том, чтобы сгруппировать `Crisis Center` управления маршрутами под `admin` путь
Вам не нужен компонент, чтобы сделать это.
Маршрут _component-less_ облегчает [караул детей маршрутов](#can-activate-child-guard).


Затем импортируйте `AdminModule` в `app.module.ts` и добавьте его в `imports` массив
зарегистрировать маршруты администратора.


<code-example path="router/src/app/app.module.4.ts" header="src/app/app.module.ts (admin module)" region="admin-module"></code-example>



Добавить ссылку «Администратор» к `AppComponent` Оболочка чтобы пользователи могли получить к этой функции.


<code-example path="router/src/app/app.component.5.html" header="src/app/app.component.html (template)"></code-example>



{@a guard-admin-feature}


{@a guard-the-admin-feature}
#### Защитите функцию администратора

В настоящее время каждый маршрут внутри *кризисного центра* открыт для всех.
Новая *администратора* функция должна быть доступна только для аутентифицированных пользователей.

Вы можете скрыть ссылку, пока пользователь не войдет в систему. Но это сложно и сложно поддерживать.

Вместо этого вы напишите `canActivate()` метод для перенаправления анонимных пользователей в
страницу входа, когда они пытаются войти в админку.

Это охранник общего назначения - вы можете представить себе другие функции
которые требуют аутентифицированных пользователей - поэтому вы генерируете
 `AuthGuard ` в ` auth` папка.

<code-example language="none" class="code-shell">
  ng generate guard auth/auth
</code-example>

На данный момент вам интересно посмотреть, как работают охранники, поэтому первая версия ничего не дает.
Он просто входит в консоль и `returns` истинное немедленно, что позволяет продолжить навигацию:


<code-example path="router/src/app/auth/auth.guard.1.ts" header="src/app/auth/auth.guard.ts (excerpt)"></code-example>



Далее откройте `admin-routing.module.ts `, импортировать `AuthGuard` Класс, и
обновить маршрут администратора с `canActivate` охраны имущества, которое ссылается на нее:


<code-example path="router/src/app/admin/admin-routing.module.2.ts" header="src/app/admin/admin-routing.module.ts (guarded admin route)" region="admin-route"></code-example>



Функция администратора теперь защищена охранником, хотя защищена слабо.


{@a teach-auth}


{@a teach-authguard-to-authenticate}
#### Научите *AuthGuard* аутентификации

Сделать `AuthGuard` как минимум притворяется, что аутентифицируется.

 `AuthGuard` должен вызвать прикладную службу, которая может войти в систему пользователя и сохранить информацию о текущем пользователе. Создать новый `AuthService` в `auth` папки:

<code-example language="none" class="code-shell">
  ng generate service auth/auth
</code-example>

Обновите `AuthService` войти в систему пользователя:

<code-example path="router/src/app/auth/auth.service.ts" header="src/app/auth/auth.service.ts (excerpt)"></code-example>



Хотя он на самом деле не входит в систему, он имеет то, что вам нужно для этого обсуждения.
Имеет `isLoggedIn` Флаг чтобы сказать вам, аутентифицирован ли пользователь.
это `login` Метод имитирует вызов API внешней службы, возвращая
Наблюдаемое, которое разрешается успешно после короткой паузы.
 `redirectUrl` Свойство хранит URL-адрес, к которому пользователь хотел получить доступ, чтобы вы могли перейти к нему после аутентификации.

<div class="alert is-helpful">

Для простоты этот пример перенаправляет неаутентифицированных пользователей на `/admin`.

</div>

Пересмотреть `AuthGuard` чтобы назвать это.


<code-example path="router/src/app/auth/auth.guard.2.ts" header="src/app/auth/auth.guard.ts (v2)"></code-example>



Обратите внимание, что вы *впрыснуть* `AuthService ` и ` Router` в конструкторе.
Вы не предоставили `AuthService` пока нет, но приятно знать, что вы можете добавить полезные сервисы в охрану маршрутизации.

Этот охранник возвращает синхронный логический результат.
Если пользователь вошел в систему, он возвращает true и навигация продолжается.

 `ActivatedRouteSnapshot` содержит _future_ маршрут, который будет активирован, и `RouterStateSnapshot` 
содержит _future_ `RouterState` приложения, если вы пройдете через охранную проверку.

Если пользователь не вошел в систему, вы сохраняете предпринятый URL-адрес, с которого пришел пользователь, используя `RouterStateSnapshot.url` и
попросите маршрутизатор перейти на страницу входа - страницу, которую вы еще не создали.
Эта вторичная навигация автоматически отменяет текущую навигацию; `checkLogin()` возвращает
 `false` просто чтобы быть ясно об этом.


{@a add-login-component}


{@a add-the-*logincomponent*}
#### Добавьте *LoginComponent*

Ты нуждаешься в `LoginComponent` для пользователя, чтобы войти в приложение. После входа вы будете перенаправлены
на сохраненный URL-адрес, если он доступен, или используйте URL-адрес по умолчанию.
В этом компоненте или в способе его подключения к конфигурации маршрутизатора нет ничего нового.

<code-example language="none" class="code-shell">
  ng generate component auth/login
</code-example>

Зарегистрировать `/login` маршрут в `auth/auth-routing.module.ts` . В `app.module.ts`, импортируйте и добавьте `AuthModule` для `AppModule` импортирует.


<code-tabs>

  <code-pane header="src/app/app.module.ts" path="router/src/app/app.module.ts" region="auth">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.html" path="router/src/app/auth/login/login.component.html">

  </code-pane>

  <code-pane header="src/app/auth/login/login.component.ts" path="router/src/app/auth/login/login.component.1.ts">

  </code-pane>

  <code-pane header="src/app/auth/auth.module.ts" path="router/src/app/auth/auth.module.ts">

  </code-pane>

</code-tabs>


{@a can-activate-child-guard}


{@a canactivatechild-guarding-child-routes}
### _CanActivateChild_: защита дочерних маршрутов

Вы также можете защитить дочерние маршруты с помощью `CanActivateChild` guard.
 `CanActivateChild` guard похож на `CanActivate` охрану.
Основное отличие состоит в том, что он запускается перед тем, как активируется любой дочерний маршрут.

Вы защитили модуль администратора от несанкционированного доступа.
Вы также должны защищать дочерние маршруты _в модуле функции.

Расширить `AuthGuard` для защиты при навигации между `admin` маршруты.
открыто `auth.guard.ts` и добавить `CanActivateChild` Интерфейс для импортированных токенов из пакета маршрутизатора.

Далее реализуем `canActivateChild()` который принимает те же аргументы, что и `canActivate()` Метод:
 `ActivatedRouteSnapshot ` и ` RouterStateSnapshot`.
 `canActivateChild()` может вернуть `Observable<boolean>` или `Promise<boolean>` для
асинхронные проверки и `boolean` для проверки синхронизации.
Этот возвращает `boolean` :


<code-example path="router/src/app/auth/auth.guard.3.ts" header="src/app/auth/auth.guard.ts (excerpt)" region="can-activate-child"></code-example>



Добавить то же самое `AuthGuard` для `component-less` административный маршрут без для защиты всех других дочерних маршрутов одновременно
вместо добавления `AuthGuard` на каждый маршрут индивидуально.


<code-example path="router/src/app/admin/admin-routing.module.3.ts" header="src/app/admin/admin-routing.module.ts (excerpt)" region="can-activate-child"></code-example>



{@a can-deactivate-guard}


{@a candeactivate-handling-unsaved-changes}
### _CanDeactivate_: обработка несохраненных изменений
Вернувшись в рабочий процесс «Герои», приложение сразу же принимает все изменения героя, не задумываясь и не проверяя их.

В реальном мире вам, возможно, придется накопить изменения пользователей.
Возможно, вам придется проверить через поля.
Возможно, вам придется проверить на сервере.
Возможно, вам придется хранить изменения в состоянии ожидания, пока пользователь не подтвердит их *как группу* или
отменяет и отменяет все изменения.

Что вы делаете с несанкционированными, несохраненными изменениями, когда пользователь уходит?
Вы не можете просто уйти и рискнуть потерять изменения пользователя; это был бы ужасный опыт.

Лучше сделать паузу и позволить пользователю решить, что делать.
Если пользователь отменит, вы останетесь на месте и разрешите больше изменений.
Если пользователь одобряет, приложение может сохранить.

Вы все еще можете отложить навигацию до тех пор, пока сохранение не удастся.
Если вы позволите пользователю сразу перейти к следующему экрану и
сохранение должно было завершиться неудачно (возможно, данные считаются недействительными), вы потеряете контекст ошибки.

Вы не можете заблокировать во время ожидания сервера - это невозможно в браузере.
Вам нужно остановить навигацию, пока вы асинхронно ждете сервера
вернуться со своим ответом.

Вам нужно `CanDeactivate` охрану.

{@a cancel-save}


{@a cancel-and-save}
#### Отмени и сохрани

Пример приложения не общается с сервером.
К счастью, у вас есть другой способ продемонстрировать ловушку асинхронного маршрутизатора.

Пользователи обновляют информацию о кризисах в `CrisisDetailComponent`.
в отличие от `HeroDetailComponent`, пользовательские изменения не обновляют сущность кризиса немедленно.
Вместо этого приложение обновляет объект, когда пользователь нажимает *Сохранить* кнопку и
отменяет изменения, когда пользователь нажимает *Отмена»* кнопку «.

Обе кнопки возвращаются к списку кризисов после сохранения или отмены.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (cancel and save methods)" region="cancel-save"></code-example>



Что делать, если пользователь пытается уйти без сохранения или отмены?
Пользователь может нажать кнопку «Назад» браузера или щелкнуть ссылку «Герои».
Оба действия вызывают навигацию.
Должно ли приложение сохранять или отменять автоматически?

Эта демонстрация не делает ни того, ни другого. Вместо этого он просит пользователя сделать этот выбор явно
в диалоговом окне подтверждения, которое *ожидает пользователя асинхронно
ответ *.

<div class="alert is-helpful">



Вы можете дождаться ответа пользователя с синхронным, блокирующим кодом.
Приложение будет более отзывчивым и может выполнять другую работу
ожидание ответа пользователя асинхронно. Ожидание пользователя асинхронно
это как ожидание сервера асинхронно.

</div>



Создать `Dialog` Служба для обработки подтверждения пользователя.

<code-example language="none" class="code-shell">
  ng generate service dialog
</code-example>

Добавить `confirm()` метод к `DialogService` чтобы предложить пользователю подтвердить свои намерения. `window.confirm` является _blocking_ действие, которое отображает модальное диалоговое окно и ожидает взаимодействия с пользователем.

<code-example path="router/src/app/dialog.service.ts" header="src/app/dialog.service.ts"></code-example>

Возвращает `Observable` который *решает,* когда пользователь в конечном счете решает, что делать: либо
отменить изменения и уйти (`true`) или сохранить ожидающие изменения и остаться в редакторе кризисов (`false`)


{@a CanDeactivate}


Создайте _guard_, который проверяет наличие `canDeactivate()` в компоненте - любой компонент.

<code-example language="none" class="code-shell">
  ng generate guard can-deactivate
</code-example>

 `CrisisDetailComponent` будет иметь этот метод.
Но охранник не должен знать это.
Охранник не должен знать детали метода деактивации какого-либо компонента.
Нужно только обнаружить, что компонент имеет `canDeactivate()` и вызовите его.
Такой подход делает охрану многоразовым.


<code-example path="router/src/app/can-deactivate.guard.ts" header="src/app/can-deactivate.guard.ts"></code-example>



Кроме того, вы могли бы сделать для конкретного компонента `CanDeactivate` охрану для `CrisisDetailComponent`.
 `canDeactivate()` предоставляет вам текущий
экземпляр `component`, текущий `ActivatedRoute`,
и `RouterStateSnapshot` на случай, если вам нужен доступ
некоторая внешняя информация. Это было бы полезно, если вы только
хотел использовать эту охрану для этого компонента и нужно было получить
свойства компонента или подтвердите, должен ли маршрутизатор разрешить навигацию от него.


<code-example path="router/src/app/can-deactivate.guard.1.ts" header="src/app/can-deactivate.guard.ts (component-specific)"></code-example>



Оглядываясь назад на `CrisisDetailComponent`, он реализует рабочий процесс подтверждения несохраненных изменений.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (excerpt)" region="canDeactivate"></code-example>



Обратите внимание, что `canDeactivate()` метод *может* возвращать синхронно;
это возвращается `true` сразу, если нет кризиса или нет ожидающих изменений.
Но это также может вернуть `Promise` или `Observable` и маршрутизатор будет ждать этого
разрешить истину (навигация) или ложь (оставаться на месте).


Добавить `Guard` к кризису подробно маршрут в `crisis-center-routing.module.ts` с использованием `canDeactivate` свойство массива.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.3.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (can deactivate guard)"></code-example>


Теперь вы предоставили пользователю защиту от несохраненных изменений.
{@a Resolve}

{@a resolve-guard}


{@a resolve-pre-fetching-component-data}
### _Resolve_: предварительная выборка данных компонента

в `Hero Detail ` и ` Crisis Detail`, приложение ожидало, пока маршрут не будет активирован, чтобы выбрать соответствующего героя или кризис.

Это сработало хорошо, но есть лучший способ.
Если вы использовали API реального мира, перед возвратом отображаемых данных с сервера может возникнуть некоторая задержка.
Вы не хотите отображать пустой компонент во время ожидания данных.

Желательно предварительно извлечь данные с сервера, чтобы он был готов
момент, когда маршрут активирован. Это также позволяет обрабатывать ошибки перед маршрутизацией к компоненту.
Нет смысла переходить к деталям кризиса для `id`, который не имеет записи.
Было бы лучше отправить пользователя обратно в `Crisis List` который показывает только действительные кризисные центры.

Таким образом, вы хотите отложить рендеринг компонента до тех пор, пока не будут получены все необходимые данные.

Вам нужен *решатель*.


{@a fetch-before-navigating}


{@a fetch-data-before-navigating}
#### Получить данные перед навигацией

На данный момент `CrisisDetailComponent` извлекает выбранный кризис.
Если кризис не обнаружен, он возвращается к представлению списка кризисов.

Опыт может быть лучше, если все это было обработано в первую очередь, до того, как маршрут активирован.
 `CrisisDetailResolver` может получить `Crisis` или уйти, если `Crisis` не существует
_before_ активация маршрута и создание `CrisisDetailComponent`.

Создать `CrisisDetailResolver` службы в `Crisis Center` особенности площадь.

<code-example language="none" class="code-shell">
  ng generate service crisis-center/crisis-detail-resolver
</code-example>


<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.1.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts (generated)"></code-example>



Возьмите соответствующие части логики поиска кризисов в `CrisisDetailComponent.ngOnInit` 
и переместить их в `CrisisDetailResolverService`.
Импортировать `Crisis` модель, `CrisisService`, а также `Router` 
так что вы можете перейти в другое место, если вы не можете получить кризис.

Будь явным Реализовать `Resolve` интерфейс с типом `Crisis`.

Введите `CrisisService` и `Router` и реализовать `resolve()` Метод.
Этот метод может вернуть `Promise`, `Observable` или синхронное возвращаемое значение.

 `CrisisService.getCrisis` Метод возвращает наблюдаемое, чтобы предотвратить загрузку маршрута, пока не будут данные.
 `Router` требуют заметного `complete`, то есть он испустил все
его ценностей. Вы используете `take` оператор с аргументом `1` чтобы убедиться, что
Observable завершается после извлечения первого значения из Observable, возвращаемого объектом
 `getCrisis` метод.

Если он не возвращает действительный `Crisis`, вернуть пустое `Observable`, отменяя предыдущую навигацию в полете к `CrisisDetailComponent` и переместите пользователя обратно к `CrisisListComponent` . Обновленные распознаватель услуг выглядит следующим образом :

<code-example path="router/src/app/crisis-center/crisis-detail-resolver.service.ts" header="src/app/crisis-center/crisis-detail-resolver.service.ts"></code-example>

Импортируйте этот преобразователь в `crisis-center-routing.module.ts` 
и добавить `resolve` объект в `CrisisDetailComponent` маршрута.


<code-example path="router/src/app/crisis-center/crisis-center-routing.module.4.ts" header="src/app/crisis-center/crisis-center-routing.module.ts (resolver)"></code-example>



 `CrisisDetailComponent` больше не должен кризис.
Обновите `CrisisDetailComponent` чтобы получить кризис от `ActivatedRoute.data.crisis` Вместо этого свойство ;
вот где вы сказали, что это должно быть, когда вы заново настроили маршрут.
Это будет там, когда `CrisisDetailComponent` попросить об этом.


<code-example path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts" header="src/app/crisis-center/crisis-detail/crisis-detail.component.ts (ngOnInit v2)" region="ngOnInit"></code-example>



**Две критические точки**

1. Роутер `Resolve` интерфейс необязательно.
 `CrisisDetailResolverService` не наследуется от базового класса.
Маршрутизатор ищет этот метод и вызывает его, если найден.

1. Положитесь на маршрутизатор для вызова распознавателя.
Не беспокойтесь обо всех способах навигации пользователя.
Это работа роутера. Напишите этот класс и позвольте роутеру взять его оттуда.

Соответствующий *кризисного центра* код для этого этапа следует.


<code-tabs>

  <code-pane header="app.component.html" path="router/src/app/app.component.html">

  </code-pane>

  <code-pane header="crisis-center-home.component.html" path="router/src/app/crisis-center/crisis-center-home/crisis-center-home.component.html">

  </code-pane>

  <code-pane header="crisis-center.component.html" path="router/src/app/crisis-center/crisis-center/crisis-center.component.html">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.4.ts">

  </code-pane>

  <code-pane header="crisis-list.component.html" path="router/src/app/crisis-center/crisis-list/crisis-list.component.html">

  </code-pane>

  <code-pane header="crisis-list.component.ts" path="router/src/app/crisis-center/crisis-list/crisis-list.component.ts">

  </code-pane>

  <code-pane header="crisis-detail.component.html" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.html">

  </code-pane>

  <code-pane header="crisis-detail.component.ts" path="router/src/app/crisis-center/crisis-detail/crisis-detail.component.ts">

  </code-pane>

  <code-pane header="crisis-detail-resolver.service.ts" path="router/src/app/crisis-center/crisis-detail-resolver.service.ts">

  </code-pane>

  <code-pane header="crisis.service.ts" path="router/src/app/crisis-center/crisis.service.ts">

  </code-pane>

  <code-pane header="dialog.service.ts" path="router/src/app/dialog.service.ts">

  </code-pane>

</code-tabs>

Гвардейская

<code-tabs>

  <code-pane header="auth.guard.ts" path="router/src/app/auth/auth.guard.3.ts">

  </code-pane>

  <code-pane header="can-deactivate.guard.ts" path="router/src/app/can-deactivate.guard.ts">

  </code-pane>

</code-tabs>



{@a query-parameters}


{@a fragment}


{@a query-parameters-and-fragments}
### Параметры запроса и фрагменты

В [параметры маршрута](#optional-route-parameters)примере вы имели дело только с параметрами, относящимися к
маршрут, но что, если вы хотите, чтобы дополнительные параметры были доступны для всех маршрутов?
Это где параметры запроса вступают в игру.

[Фрагменты](https://en.wikipedia.org/wiki/Fragment_identifier)ссылаются на определенные элементы на странице
идентифицируется с `id` атрибут.

Обновите `AuthGuard` чтобы обеспечить `session_id` запрос, который останется после перехода на другой маршрут.

Добавить `anchor` элемент, чтобы вы могли перейти к определенной точке на странице.

Добавить `NavigationExtras` объект в `router.navigate()` метод, который перемещает вас к `/login` маршрут.


<code-example path="router/src/app/auth/auth.guard.4.ts" header="src/app/auth/auth.guard.ts (v3)"></code-example>



Вы также можете сохранить параметры запроса и фрагменты в разных навигациях, не предоставляя их
снова при навигации. в `LoginComponent`, вы добавите *объект* как
Второй аргумент в `router.navigateUrl()` функция
и предоставить `queryParamsHandling` и `preserveFragment` для передачи текущих параметров запроса
и фрагмент к следующему маршруту.


<code-example path="router/src/app/auth/login/login.component.ts" header="src/app/auth/login/login.component.ts (preserve)" region="preserve"></code-example>

<div class="alert is-helpful">


 `queryParamsHandling` также обеспечивает `merge` опция, которая сохранит и объединит текущие параметры запроса с любыми предоставленными параметрами запроса
при навигации.


</div>



Когда вы *войдете в панели администратора* маршрут после входа в систему, вы обновите его для обработки
параметры запроса и фрагмент.


<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.1.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (v2)"></code-example>



*Параметры запроса* и *фрагменты* также доступны через `ActivatedRoute` service.
Как и *параметры маршрута*, параметры и фрагменты запроса предоставляются в виде `Observable`.
Обновленный *Crisis Admin* компонент обеспечивает `Observable` непосредственно в шаблон, используя `AsyncPipe`.


Теперь вы можете нажать на *администратора* кнопку, которая приведет вас к в *входу систему*
страница с предоставленным `queryParamMap` и `fragment` . После того, как вы нажмете кнопку входа, обратите внимание
вы были перенаправлены на `Admin Dashboard` Страница с параметрами и фрагментом запроса в адресной строке.

Вы можете использовать эти постоянные биты информации для вещей, которые должны быть предоставлены на разных страницах, например
токены аутентификации или идентификаторы сессии.


<div class="alert is-helpful">



 `query params ` и ` fragment` также может быть сохранен с использованием `RouterLink` с
 `queryParamsHandling ` и ` preserveFragment` привязки соответственно.


</div>


{@a asynchronous-routing}

{@a milestone-6-asynchronous-routing}
## Веха 6: асинхронная маршрутизация

По мере того как вы работали над этапами, приложение, естественно, стало больше.
По мере того как вы продолжаете создавать функциональные области, общий размер приложения будет продолжать расти.
В какой-то момент вы достигнете переломного момента, когда приложение загружается очень долго.

Как вы боретесь с этой проблемой? С асинхронной маршрутизацией, которая загружает функциональные модули _lazily_, по запросу.
Ленивая загрузка имеет несколько преимуществ.

* Вы можете загружать области функций только по запросу пользователя.
* Вы можете ускорить время загрузки для пользователей, которые посещают только определенные области приложения.
* Вы можете продолжить расширение областей отложенной загрузки, не увеличивая размер начального пакета загрузки.

Ты уже часть пути туда.
Организуя приложение в модули: `AppModule`,
 `HeroesModule `, ` AdminModule ` и ` CrisisCenterModule` - вы
есть естественные кандидаты на ленивую загрузку.

Некоторые модули, такие как `AppModule`, должен быть загружен с самого начала.
Но другие могут и должны быть лениво загружены.
 `AdminModule`, необходим нескольким авторизованным пользователям
вы должны загружать его только по запросу нужных людей.


{@a lazy-loading-route-config}


{@a lazy-loading-route-configuration}
### Ленивая загрузка конфигурации маршрута

Изменить `admin` **путь** в `admin-routing.module.ts` из `'admin'` на пустую строку, `''`, пустой путь.

 `Router` поддерживает *пустого пути* маршруты ;
используйте их для группировки маршрутов без добавления дополнительных сегментов пути к URL.
Пользователи по-прежнему будут посещать `/admin` и `AdminComponent` прежнему служит *компонентом маршрутизации,* содержащим дочерние маршруты.

Открой `AppRoutingModule` и добавьте новый `admin` маршрут к своему `appRoutes` массив.

Дать ему `loadChildren` свойство вместо `children` собственность.
 `loadChildren` принимает функцию, которая возвращает обещание с использованием встроенного в браузер синтаксиса для отложенной загрузки кода с использованием динамического импорта `import('...')`.
Путь - это местоположение `AdminModule` (относительно корня приложения).
После того, как код запрошен и загружен, `Promise` разрешает объект, который содержит `NgModule`, в этом случае `AdminModule`.

<code-example path="router/src/app/app-routing.module.5.ts" region="admin-1" header="app-routing.module.ts (load children)"></code-example>

<div class="alert is-important">

*Примечание*. При использовании абсолютных путей `NgModule` файла должно начинаться с `src/app` для правильного разрешения. Для обычая [путь отображения с абсолютными путями](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping), то `baseUrl` и `paths` свойства в проекте `tsconfig.json` должен быть настроен.

</div>


Когда маршрутизатор переходит на этот маршрут, он использует `loadChildren` строка для динамической загрузки `AdminModule`.
Затем он добавляет `AdminModule` направляет к своей текущей конфигурации маршрута.
Наконец, он загружает запрошенный маршрут к компоненту администратора назначения.

Ленивая загрузка и переконфигурация происходят только один раз, когда маршрут _first_ запрошен;
модуль и маршруты доступны сразу для последующих запросов.


<div class="alert is-helpful">



Angular предоставляет встроенный загрузчик модулей, который поддерживает SystemJS для асинхронной загрузки модулей. Если бы вы были
используя другой инструмент связывания, такой как Webpack, вы бы использовали механизм Webpack для асинхронной загрузки модулей.


</div>



Сделайте последний шаг и отсоедините набор функций администратора от основного приложения.
Корень `AppModule` должен ни загружать, ни ссылаться на `AdminModule` или его файлы.

В `app.module.ts`, удалите `AdminModule` оператор импорта из верхней части файла
и удалите `AdminModule` из NgModule `imports` массив.


{@a can-load-guard}


{@a canload-guard-guarding-unauthorized-loading-of-feature-modules}
### _CanLoad_ Guard: защита от несанкционированной загрузки функциональных модулей

Вы уже защищаете `AdminModule` с `CanActivate` guard, который предотвращает неавторизованных пользователей
доступ к области функций администратора.
Он перенаправляет на страницу входа, если пользователь не авторизован.

Но маршрутизатор все еще загружает `AdminModule` даже если пользователь не может посетить ни один из его компонентов.
В идеале вы должны загрузить только `AdminModule` если пользователь вошел в систему

Добавить** `CanLoad`** Guard, который загружает только `AdminModule` после того, как пользователь вошел в систему и попытается получить доступ к функциональной области администратора.

Существующий `AuthGuard` уже имеет основную логику в
его `checkLogin()` для поддержки `CanLoad` guard.

открыто `auth.guard.ts`.
Импортировать `CanLoad` Интерфейс от `@angular/router`.
Добавьте это к `AuthGuard` Класс `implements` список.
Затем реализовать `canLoad()` следующим образом :


<code-example path="router/src/app/auth/auth.guard.ts" header="src/app/auth/auth.guard.ts (CanLoad guard)" region="canLoad"></code-example>



Маршрутизатор устанавливает `canLoad()` метода `route` параметр до целевого URL назначения.
 `checkLogin()` перенаправляет на этот URL после входа пользователя в систему

Теперь импортируйте `AuthGuard` в `AppRoutingModule` и добавьте `AuthGuard` для `canLoad` 
свойство массива для `admin` маршрут.
Заполненные администратора маршрут выглядит следующим образом :


<code-example path="router/src/app/app-routing.module.5.ts" region="admin" header="app-routing.module.ts (lazy admin route)"></code-example>



{@a preloading}


{@a preloading-background-loading-of-feature-areas}
### Предварительная загрузка: фоновая загрузка характерных областей
Вы узнали, как загружать модули по требованию.
Вы также можете загружать модули асинхронно с помощью _preloading_.

Это может показаться тем, что приложение делало все это время. Не совсем.
 `AppModule` загружается при запуске приложения; это _eager_ загрузка.
Теперь `AdminModule` загружается только тогда, когда пользователь нажимает на ссылку; это _lazy_ загрузка.

_Preloading_ это что-то среднее.
Рассмотрим _Crisis Center_.
Это не первый взгляд, который видит пользователь.
По умолчанию _Heroes_ являются первым представлением.
Для наименьшей начальной полезной нагрузки и самого быстрого времени запуска
Вы должны с нетерпением загрузить `AppModule` и `HeroesModule`.

Вы можете лениво загрузить _Crisis Center_.
Но вы почти уверены, что пользователь посетит _Crisis Center_ через несколько минут после запуска приложения.
В идеале приложение должно запускаться только с `AppModule` и `HeroesModule` загружен
а затем, почти сразу, загрузить `CrisisCenterModule` в фоновом режиме.
К тому времени, когда пользователь перейдет к _Crisis Center_, его модуль будет загружен и готов к работе.

Это _preloading_.


{@a how-preloading}


{@a how-preloading-works}
#### Как работает предварительная загрузка

После каждой _successful_ навигации маршрутизатор ищет в своей конфигурации выгруженный модуль, который он может предварительно загрузить.
Будет ли он предварительно загружать модуль и какие модули он предварительно загружает, зависит от *стратегии предварительной загрузки*.

 `Router` предлагает две поджимать стратегии из коробки:

* Нет предварительной загрузки вообще, что по умолчанию. Ленивые функциональные области по-прежнему загружаются по требованию.
* Предварительная загрузка всех загруженных функциональных областей.

Из коробки маршрутизатор никогда не загружает предварительно или загружает каждый модуль отложенной загрузки.
 `Router` также поддерживает [пользовательские стратегии предварительной загрузки](#custom-preloading)для
прекрасный контроль над тем, какие модули предварительно и когда.

В следующем разделе вы обновите `CrisisCenterModule` загружать лениво
по умолчанию и использовать `PreloadAllModules` стратегия
загрузить его (и _все остальные_ лениво загруженные модули) как можно скорее.


{@a lazy-load-crisis-center}


{@a lazy-load-the-crisis-center}
#### Ленивая загрузка _crisis center_

Обновите конфигурацию маршрута, чтобы лениво загрузить `CrisisCenterModule`.
Выполните те же шаги, которые вы использовали для настройки `AdminModule` для ленивой загрузки.

1. Изменить `crisis-center` путь в `CrisisCenterRoutingModule` для пустой строки.

1. Добавить `crisis-center` маршрут из до `AppRoutingModule`.

1. Установить `loadChildren` строка для загрузки `CrisisCenterModule`.

1. Удалить все упоминания о `CrisisCenterModule` от `app.module.ts`.


Вот обновленные модули _before позволяет preload_:


<code-tabs>

  <code-pane header="app.module.ts" path="router/src/app/app.module.ts" region="preload">

  </code-pane>

  <code-pane header="app-routing.module.ts" path="router/src/app/app-routing.module.6.ts" region="preload-v1">

  </code-pane>

  <code-pane header="crisis-center-routing.module.ts" path="router/src/app/crisis-center/crisis-center-routing.module.ts">

  </code-pane>

</code-tabs>



Вы можете попробовать это сейчас и подтвердить, что `CrisisCenterModule` загружается после нажатия кнопки «Кризисный центр».

Чтобы включить предварительную загрузку всех лениво загруженных модулей, импортируйте `PreloadAllModules` из пакета Angular маршрутизатора.

Второй аргумент в `RouterModule.forRoot()` принимает объект для дополнительных параметров конфигурации.
 `preloadingStrategy` является одним из таких вариантов.
Добавить `PreloadAllModules` токен для `forRoot()` называют:

<code-example path="router/src/app/app-routing.module.6.ts" header="src/app/app-routing.module.ts (preload all)" region="forRoot"></code-example>



Это говорит `Router` Предварительный загрузчик чтобы немедленно загрузить _все_ ленивые загруженные маршруты (маршруты с `loadChildren` свойство).

Когда вы посещаете `http://localhost:4200`, `/heroes` маршрут загружается сразу после запуска
и маршрутизатор начинает загружать `CrisisCenterModule` сразу после `HeroesModule` загружается.

Удивительно, но `AdminModule` делает _не_ предварительной загрузки. Что-то блокирует это.


{@a preload-canload}


{@a canload-blocks-preload}
#### CanLoad блокирует предварительную загрузку

 `PreloadAllModules` Стратегия не загружает области функций, защищенные защитой [CanLoad](#can-load-guard).
Это по замыслу.

Вы добавили `CanLoad` охранник к маршруту в `AdminModule` несколько шагов назад
блокировать загрузку этого модуля, пока пользователь не авторизован.
Это `CanLoad` имеет приоритет над стратегией предварительной загрузки.

Если вы хотите, чтобы предварительно загрузить модуль _AND_ защититься от несанкционированного доступа,
бросить `canLoad()` метод охраны и полагаться на [canActivate ()](#can-activate-guard)только охранник.


{@a custom-preloading}


{@a custom-preloading-strategy}
### Пользовательская стратегия предварительной загрузки

Предварительная загрузка всех лениво загруженных модулей хорошо работает во многих ситуациях
но это не всегда правильный выбор, особенно на мобильных устройствах и при соединениях с низкой пропускной способностью.
Вы можете выбрать предварительную загрузку только определенных функциональных модулей на основе пользовательских метрик и других деловых и технических факторов.

Вы можете управлять тем, что и как предварительно загружает маршрутизатор, используя собственную стратегию предварительной загрузки.

В этом разделе вы добавите пользовательскую стратегию, которая _только_ предварительно загружает маршруты, чьи `data.preload` Флаг установлен в `true`.
Напомним, что вы можете добавить что-нибудь к `data` свойство маршрута.

Установить `data.preload` Флаг в `crisis-center` маршрут в `AppRoutingModule`.


<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (route data preload)" region="preload-v2"></code-example>

Создать новый `SelectivePreloadingStrategy` служба.

<code-example language="none" class="code-shell">
  ng generate service selective-preloading-strategy
</code-example>


<code-example path="router/src/app/selective-preloading-strategy.service.ts" header="src/app/selective-preloading-strategy.service.ts (excerpt)"></code-example>



 `SelectivePreloadingStrategyService ` реализует ` PreloadingStrategy`, который имеет один метод, `preload`.

Маршрутизатор вызывает `preload` метод с двумя аргументами:

1. Маршрут для рассмотрения.
1. Функция загрузчика, которая может загружать маршрутизируемый модуль асинхронно.

Реализация `preload` должна вернуть `Observable`.
Если маршрут должен предварительно загружаться, он возвращает наблюдаемую информацию, возвращаемую вызовом функции загрузчика.
Если маршрут не должен предварительно загружаться, он возвращает `Observable` из `null`.

В этом примере `preload` Метод загружает маршрут, если маршрут `data.preload` флаг truthy.

Это также имеет побочный эффект.
 `SelectivePreloadingStrategyService ` регистрирует ` path` выбранного маршрута в его общедоступной `preloadedModules` массив.

Вскоре вы продлите `AdminDashboardComponent` для внедрения этого сервиса и отображения его `preloadedModules` массив.

Но сначала внесите несколько изменений в `AppRoutingModule`.

1. Импортировать `SelectivePreloadingStrategyService` в `AppRoutingModule`.
1. Заменить `PreloadAllModules` стратегия в вызове `forRoot()` с этим `SelectivePreloadingStrategyService`.
1. Добавить `SelectivePreloadingStrategyService` Стратегия для `AppRoutingModule` провайдеров чтобы его можно было
в другом месте в приложении.

Теперь отредактируйте `AdminDashboardComponent` для отображения журнала предварительно загруженных маршрутов.

1. Импортировать `SelectivePreloadingStrategyService`.
1. Вставьте его в конструктор приборной панели.
1. Обновите шаблон для отображения сервиса стратегии `preloadedModules` массив.

Когда вы закончите, это выглядит так.


<code-example path="router/src/app/admin/admin-dashboard/admin-dashboard.component.ts" header="src/app/admin/admin-dashboard/admin-dashboard.component.ts (preloaded modules)"></code-example>



Как только приложение загрузит начальный маршрут, `CrisisCenterModule` предварительно загружен.
Проверьте это, войдя в `Admin` Область функций и отмечая, что `crisis-center` занесен в список `Preloaded Modules`.
Он также зарегистрирован в консоли браузера.


{@a redirect-advanced}

{@a migrating-urls-with-redirects}
## Перенос URL-адресов с помощью перенаправлений

Вы настроили маршруты для навигации по вашему приложению. Вы использовали навигацию обязательно и декларативно для множества различных маршрутов. Но, как и в любом приложении, требования меняются со временем. Вы установили ссылки и навигацию для `/heroes` и `/hero/:id` из `HeroListComponent` и `HeroDetailComponent` Компоненты . Если было требование, что ссылки на `heroes` становятся `superheroes`, вы все еще хотите, чтобы предыдущие URL-адреса перемещались правильно. Вы также не хотите идти и обновлять каждую ссылку в вашем приложении, поэтому перенаправления делают рефакторинг маршрутов тривиальным.


{@a url-refactor}

{@a changing-/heroes-to-/superheroes}
### Смена / героев на / супергероев

Давайте возьмем `Hero` прокладывает маршруты и переносит их на новые URL. `Router` проверяет перенаправления в вашей конфигурации перед навигацией, поэтому каждое перенаправление запускается при необходимости. Чтобы поддержать это изменение, вы добавите перенаправления со старых маршрутов на новые маршруты в `heroes-routing.module`.

<code-example path="router/src/app/heroes/heroes-routing.module.ts" header="src/app/heroes/heroes-routing.module.ts (heroes redirects)"></code-example>


Вы заметите два разных типа перенаправлений. Первое изменение от `/heroes ` в ` /superheroes` без параметров. Это прямое перенаправление, в отличие от изменения `/hero/:id` для `/superhero/:id`, который включает в себя `:id` параметра маршрута. Перенаправления маршрутизатора также используют мощное сопоставление с образцом, поэтому `Router` проверяет URL и заменяет параметры маршрута в `path` с их соответствующим назначением. Ранее вы перешли на URL-адрес, такой как `/hero/15` с параметром маршрута `id` из `15`.

<div class="alert is-helpful">

 `Router` также поддерживает [параметры запроса](#query-parameters)и [фрагмент](#fragment)при использовании перенаправлений.

* При использовании абсолютных перенаправлений `Router` будет использовать параметры запроса и фрагмент из redirectTo в конфигурации маршрута.
* При использовании относительных перенаправлений `Router` использует параметры запроса и фрагмент из исходного URL.

</div>

Перед обновлением `app-routing.module.ts`, вам нужно учитывать важное правило. В настоящее время наш пустой путь перенаправляет на `/heroes`, которые перенаправляют на `/superheroes` . Это не будет работать и по замыслу `Router` обрабатывает перенаправления один раз на каждом уровне конфигурации маршрутизации. Это предотвращает цепочку перенаправлений, что может привести к бесконечным циклам перенаправления.

Поэтому вместо этого вы обновите пустой путь в `app-routing.module.ts` для перенаправления на `/superheroes`.

<code-example path="router/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (superheroes redirect)"></code-example>

 `RouterLink` не привязаны к конфигурации маршрута, поэтому вам необходимо обновить соответствующие ссылки на маршрутизаторы, чтобы они оставались активными, когда активен новый маршрут. Вы обновите `app.component.ts` Шаблон для `/heroes` роутеры ссылка.

<code-example path="router/src/app/app.component.html" header="src/app/app.component.html (superheroes active routerLink)"></code-example>

Обновите `goToHeroes()` в `hero-detail.component.ts` чтобы вернуться к `/superheroes` с дополнительными параметрами маршрута.

<code-example path="router/src/app/heroes/hero-detail/hero-detail.component.ts" region="redirect" header="src/app/heroes/hero-detail/hero-detail.component.ts (goToHeroes)"></code-example>

С настройкой перенаправления все предыдущие маршруты теперь указывают на их новые места назначения, и оба URL-адреса все еще функционируют, как предполагалось.


{@a inspect-config}



{@a inspect-the-routers-configuration}
## Проверьте конфигурацию маршрутизатора

Вы приложили много усилий для настройки маршрутизатора в нескольких файлах модуля маршрутизации
и были осторожны, чтобы перечислить их [в правильном порядке](#routing-module-order).
Маршруты действительно оцениваются, как вы запланировали?
Как маршрутизатор действительно настроен?

Вы можете в любое время проверить текущую конфигурацию маршрутизатора, введя его и
изучая его `config` свойство.
Например, обновить `AppModule` следующим образом и посмотрите в окне консоли браузера
чтобы увидеть готовую конфигурацию маршрута.

<code-example path="router/src/app/app.module.7.ts" header="src/app/app.module.ts (inspect the router config)" region="inspect-config"></code-example>


{@a final-app}


{@a wrap-up-and-final-app}
## Завершение и окончательное приложение

В этом руководстве вы рассмотрели много вопросов, и приложение слишком велико для перепечатки.
Пожалуйста, посетите <live-example title="Router Sample in Stackblitz"></live-example>
где вы можете скачать окончательный исходный код.


{@a appendices}



{@a appendices}
## Приложения

Баланс этого руководства представляет собой набор приложений, которые
разработайте некоторые из пунктов, которые вы кратко рассмотрели выше.

Материал приложения не является обязательным. Продолжение чтения для любопытных.


{@a link-parameters-array}



{@a appendix-link-parameters-array}
### Приложение: массив параметров ссылок

Массив параметров линии связи имеет следующие компоненты для маршрутизатора навигации:

* *Путь* маршрута к компоненту назначения.
* Обязательные и дополнительные параметры маршрута, которые входят в URL-адрес маршрута.

Вы можете связать `RouterLink` директива такого массива, как это:


<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (h-anchor)" region="h-anchor"></code-example>



Вы написали массив два элемента при указании параметра маршрута, как это:


<code-example path="router/src/app/heroes/hero-list/hero-list.component.1.html" header="src/app/heroes/hero-list/hero-list.component.html (nav-to-detail)" region="nav-to-detail"></code-example>



Вы можете предоставить дополнительные параметры маршрута в объекте, как это:


<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-query-params)" region="cc-query-params"></code-example>



Эти три примера охватывают необходимость приложения с маршрутизацией на одном уровне.
В тот момент, когда вы добавляете дочерний маршрутизатор, такой как кризисный центр, вы создаете новые возможности массива ссылок.

Напомним, что вы указали дочерний маршрут по умолчанию для кризисного центра, так что это просто `RouterLink` в порядке.


<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (cc-anchor-w-default)" region="cc-anchor-w-default"></code-example>



Разобрать это.

* Первый элемент в массиве идентифицирует родительский маршрут (`/crisis-center`).
* Для этого родительского маршрута нет параметров, так что вы покончили с ним.
* Для дочернего маршрута нет значения по умолчанию, поэтому вам нужно выбрать его.
* Вы переходите к `CrisisListComponent`, чей путь маршрута `/`, но вам не нужно явно добавлять косую черту.
* Вуаля! `['/crisis-center']`.

Сделайте шаг вперед. Рассмотрим следующую ссылку маршрутизатора
передвигается от корня приложения вниз к *кризису Dragon*:


<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (Dragon-anchor)" region="Dragon-anchor"></code-example>



* Первый элемент в массиве идентифицирует родительский маршрут (`/crisis-center`).
* Для этого родительского маршрута нет параметров, так что вы покончили с ним.
* Второй элемент идентифицирует детали маршрута ребенка о конкретном кризисе (`/:id`)
* Подробности дочернего маршрута требуют `id` параметр маршрута.
* Вы добавили `id` из*кризиса Dragon в * качестве второго элемента в массиве (`1`)
* Полученный путь `/crisis-center/1`.


Если вы хотите, вы можете переопределить `AppComponent` шаблон с *Кризисного центра* маршрутов исключительно:


<code-example path="router/src/app/app.component.3.ts" header="src/app/app.component.ts (template)" region="template"></code-example>



В итоге вы можете писать приложения с одним, двумя или более уровнями маршрутизации.
Массив параметров соединения предоставляет гибкость для представления любой глубины маршрутизации и
любая допустимая последовательность путей маршрутов, (обязательные) параметры маршрутизатора и (необязательные) объекты параметров маршрута.


{@a browser-url-styles}


{@a location-strategy}



{@a appendix-locationstrategy-and-browser-url-styles}
### Приложение: *LocationStrategy* и стили браузера URL

Когда маршрутизатор переходит к новому представлению компонента, он обновляет местоположение и историю браузера
с URL для этого представления.
Это строго локальный URL. Браузер не должен отправлять этот URL на сервер
и не должен перезагрузить страницу.

Поддержка современных браузеров HTML5
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState </a>,
метод, который изменяет местоположение и историю браузера, не вызывая запрос страницы сервера.
Маршрутизатор может составить «естественный» URL, который неотличим от
тот, который иначе потребовал бы загрузки страницы.

Вот *кризисный центр* URL в этом "HTML5 PushState" стиле:


<code-example format="nocode">
  localhost:3002/crisis-center/

</code-example>



Старые браузеры отправляют запросы страниц на сервер при изменении URL-адреса местоположения
_unless_ изменение происходит после " #" (называется "хеш").
Маршрутизаторы могут использовать это исключение, составляя маршрут в приложении
URL с хешами. Вот «хэш-URL», который направляет в *кризисный центр*.


<code-example format="nocode">
  localhost:3002/src/#/crisis-center/

</code-example>



Маршрутизатор поддерживает оба стиля с двумя `LocationStrategy` провайдеры:

1. `PathLocationStrategy` - умолчанию «HTML5 pushState».
1. `HashLocationStrategy` - "хэш-URL".

 `RouterModule.forRoot() ` устанавливает ` LocationStrategy ` Стратегия ` PathLocationStrategy`,
делая это стратегией по умолчанию.
Вы можете переключиться на `HashLocationStrategy` с переопределением во время процесса начальной загрузки, если вы предпочитаете это.


<div class="alert is-helpful">



Узнайте о поставщиках и процессе начальной загрузки в
[Руководство по внедрению зависимостей](guide/dependency-injection#bootstrap).


</div>



{@a which-strategy-is-best}
#### Какая стратегия лучше?

Вы должны выбрать стратегию, и вам нужно сделать правильный звонок в начале проекта.
Это будет нелегко изменить позже, когда приложение будет запущено
и есть много ссылок на URL приложений в дикой природе.

Почти все проекты Angular должны использовать стиль HTML5 по умолчанию.
Он создает URL-адреса, которые легче понять пользователям.
И это сохраняет возможность сделать _server-side рендеринга_ позже.

Рендеринг критических страниц на сервере - это метод, который можно значительно улучшить
воспринимается отзывчивость при первой загрузке приложения.
Приложение, которое в противном случае заняло бы десять или более секунд для запуска
может быть отображено на сервере и доставлено на устройство пользователя
менее чем за секунду.

Этот параметр доступен только в том случае, если URL-адреса приложений выглядят как обычные веб-URL
без хешей (#) в центре.

Придерживайтесь по умолчанию, если у вас нет веских причин для
прибегать к хеш-маршрутам.


#### The *&lt;base href>*

Маршрутизатор использует браузер
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="HTML5 browser history push-state">history.pushState </a>
для навигации. Благодаря `pushState`, вы можете сделать так, чтобы URL-пути в приложении выглядели так, как вы хотите
смотри, например `localhost:4200/crisis-center` . URL в приложении могут быть неотличимы от URL сервера.

Современные браузеры HTML5 были первыми, кто поддержал `pushState` поэтому многие люди называют эти URL-адреса
URL в стиле HTML5.


<div class="alert is-helpful">



Навигация в стиле HTML5 является маршрутизатором по умолчанию.
В [LocationStrategy и стилей браузера URL](#browser-url-styles)Приложение,
Узнайте, почему предпочтительным является стиль HTML5, как настроить его поведение и как переключиться на
более старый hash (#стиль), если необходимо.


</div>



Вы должны **добавить
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">элемент <base href> </a>**
к приложению `index.html` для `pushState` роутинг для работы.
Браузер использует `<base href>` значение для префикса *относительных* URL при ссылках
CSS-файлы, сценарии и изображения.

Добавить `<base>` элемент сразу после `<head>` метка.
Если `app` Папка является корнем приложения, как и для этого приложения
установить `href` значение в** `index.html`** *точно так,* как показано здесь.


<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>

#### HTML5 URLs and the *&lt;base href>*

Пока роутер использует
<a href="https://developer.mozilla.org/en-US/docs/Web/API/History_API#Adding_and_modifying_history_entries" title="Browser history push-state">HTML5 pushState </a>
стиль по умолчанию, вы *должны* настроить эту стратегию с **базовым HREF**.

Предпочтительным способом настройки стратегии является добавление
<a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base" title="base href">элемент <base href> </a>
тег в `<head>` из `index.html`.


<code-example path="router/src/index.html" header="src/index.html (base-href)" region="base-href"></code-example>



Без этого тега браузер не сможет загружать ресурсы
(изображения, CSS, скрипты) при «глубоких ссылках» в приложение.
Плохие вещи могут случиться, когда кто-то вставляет ссылку на приложение в
в адресной строке браузера или нажимает на такую ​​ссылку в письме.

Некоторые разработчики могут не иметь возможности добавить `<base>` элемент, возможно, потому что они не имеют
доступ к `<head>` или `index.html`.

Эти разработчики могут по- прежнему использовать HTML5 URL, приняв два мер по исправлению положения :

1. Укажите для маршрутизатора соответствующее значение [APP_BASE_HREF] [].
1. Используйте _root URLs_ для всех веб-ресурсов: CSS, изображений, скриптов и шаблонов HTML-файлов.

{@a hashlocationstrategy}

#### *HashLocationStrategy*

Вы можете пойти в школу с `HashLocationStrategy` by
предоставляя `useHash: true` в объекте в качестве второго аргумента `RouterModule.forRoot()` 
в `AppModule`.


<code-example path="router/src/app/app.module.6.ts" header="src/app/app.module.ts (hash URL strategy)"></code-example>
