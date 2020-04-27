{@a add-in-app-navigation-with-routing}
# Добавить в приложение навигации с маршрутизацией

Есть новые требования к Туру Героев приложения:

* Добавить *панель инструментов *.
* Добавьте возможность перемещаться между представлениями *Heroes* и *Dashboard*.
* Когда пользователи щелкают имя героя в любом представлении, переходите к подробному представлению выбранного героя.
* Когда пользователи нажимают на *глубокую ссылку * в электронном письме, открывают детальный вид для конкретного героя.

Когда вы закончите, пользователи будут иметь возможность перемещаться приложения, как это:

<div class="lightbox">
  <img src='generated/images/guide/toh/nav-diagram.png' alt="View navigations">
</div>

{@a add-the-approutingmodule}
## Добавить `AppRoutingModule`

В Angular рекомендуется загружать и настраивать маршрутизатор в отдельном модуле верхнего уровня
который предназначен для маршрутизации и импортируется рутом `AppModule`.

По соглашению, имя класса модуля `AppRoutingModule` и он принадлежит в `app-routing.module.ts` в `src/app` папка.

Используйте CLI для его генерации.

<code-example language="sh" class="code-shell">
  ng generate module app-routing --flat --module=app
</code-example>

<div class="alert is-helpful">

 `--flat` помещает файл в `src/app` вместо собственной папки. <br>
 `--module=app` указывает CLI зарегистрировать его в `imports` массив `AppModule`.
</div>

Сгенерированный файл выглядит следующим образом :

<code-example path="toh-pt5/src/app/app-routing.module.0.ts" header="src/app/app-routing.module.ts (generated)">
</code-example>

Замените его следующим:

<code-example path="toh-pt5/src/app/app-routing.module.1.ts" header="src/app/app-routing.module.ts (updated)">
</code-example>

Первый, `AppRoutingModule` импорт `RouterModule` и `Routes` чтобы приложение могло иметь функции маршрутизации. Следующий импорт, `HeroesComponent`, даст маршрутизатору куда-нибудь идти, когда вы настроите маршруты.

Обратите внимание, что `CommonModule` ссылки и `declarations` массивы не нужны, поэтому нет
длинная часть `AppRoutingModule` . Следующие разделы объясняют остальную часть `AppRoutingModule` более подробно.


{@a routes}
### Маршруты

Следующая часть файла - то, где вы настраиваете свои маршруты.
*Маршруты* указывают маршрутизатору, какой вид отображать, когда пользователь щелкает ссылку или
вставляет URL в адресную строку браузера.

поскольку `AppRoutingModule` уже импортирует `HeroesComponent`, вы можете использовать его в `routes` массив:

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts"
  region="heroes-route">
</code-example>

Типичный Angular `Route` имеет два свойства:

* `path` : строка, которая соответствует URL в адресной строке браузера.
* `component` : компонент, который маршрутизатор должен создать при переходе к этому маршруту.

Это говорит маршрутизатору сопоставить этот URL с `path: 'heroes'`
и отобразить `HeroesComponent` когда URL-это что-то вроде `localhost:4200/heroes`.

{@a routermodule.forroot}
### `RouterModule.forRoot()`

 `@NgModule` Метаданные инициализируют маршрутизатор и запускают прослушивание изменений местоположения браузера.

Следующая строка добавляет `RouterModule` для `AppRoutingModule` `imports` массив и
настраивает его с `routes` в один шаг по телефону
 `RouterModule.forRoot()` :

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts" region="ngmodule-imports">
</code-example>

<div class="alert is-helpful">

  Метод называется `forRoot()` потому что вы настраиваете маршрутизатор на корневом уровне приложения.
 `forRoot()` предоставляет поставщиков услуг и директивы, необходимые для маршрутизации
  и выполняет начальную навигацию на основе текущего URL браузера.

</div>

Следующий, `AppRoutingModule` экспорт `RouterModule` поэтому он будет доступен во всем приложении.

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts (exports array)" region="export-routermodule">
</code-example>

{@a add-routeroutlet}
## добавлять `RouterOutlet`

Открой `AppComponent` шаблон и заменить `<app-heroes>` элемент с `<router-outlet>` элемент.

<code-example path="toh-pt5/src/app/app.component.html" region="outlet" header="src/app/app.component.html (router-outlet)">
</code-example>

 `AppComponent` Шаблон больше не нужен `<app-heroes>` потому что приложение будет отображать только `HeroesComponent` когда пользователь переходит на него.

 `<router-outlet>` сообщает маршрутизатору, где отображать маршрутизированные представления.

<div class="alert is-helpful">

 `RouterOutlet` - это одна из директив маршрутизатора, которая стала доступной для `AppComponent`
потому что `AppModule` импорт `AppRoutingModule` который экспортировал `RouterModule` . `ng generate` Команда вы запускали в начале этого урока, добавила этот импорт из-за `--module=app` флаг. Если вы создали вручную `app-routing.module.ts` или использовать инструмент, отличный от CLI, для этого вам нужно будет импортировать `AppRoutingModule` в `app.module.ts` и добавьте его в `imports` массив `NgModule`.

</div>

{@a try-it}
#### Попробуй это

Вы все еще должны работать с этой командой CLI.

<code-example language="sh" class="code-shell">
  ng serve
</code-example>

Браузер должен обновить и отобразить название приложения, но не список героев.

Посмотрите на адресную строку браузера.
URL заканчивается `/`,
Путь к маршруту `HeroesComponent` является `/heroes`.

Append `/heroes` по URL в адресной строке браузера.
Вы должны увидеть знакомых героев мастер / детальный вид.

{@a routerlink}

{@a add-a-navigation-link-routerlink}
## Добавить навигационную ссылку (`routerLink`)

В идеале, пользователи должны иметь возможность щелкнуть ссылку для навигации
чем вставить URL-адрес маршрута в адресную строку.

Добавить `<nav>` элемент, и в том, что якорь элемент, который, при нажатии
запускает навигацию к `HeroesComponent`.
Пересмотренный `AppComponent` внешний вид шаблона, как это:

<code-example path="toh-pt5/src/app/app.component.html" region="heroes" header="src/app/app.component.html (heroes RouterLink)">
</code-example>

A [атрибут routerLink](#routerlink)установлен в `"/heroes"`,
строка, которой маршрутизатор соответствует маршрут к `HeroesComponent`.
 `routerLink` - это селектор для [директива `RouterLink` ](/api/router/RouterLink)
это превращает щелчки пользователя в навигацию маршрутизатора.
Это еще одна из публичных директив в `RouterModule`.

Браузер обновляет и отображает название приложения и ссылку на героев
но не список героев.

Нажмите на ссылку.
Адресная строка обновляется до `/heroes` и список героев появляется.

<div class="alert is-helpful">

Сделайте эту и будущие навигационные ссылки лучше, добавив частные стили CSS в `app.component.css`
как указано в [окончательный обзор кода](#appcomponent)ниже.

</div>


{@a add-a-dashboard-view}
## Добавить вид на панель инструментов

Маршрутизация имеет больше смысла, когда есть несколько представлений.
Пока что вид только на героев.

Добавить `DashboardComponent` помощью интерфейса командной строки

<code-example language="sh" class="code-shell">
  ng generate component dashboard
</code-example>

CLI генерирует файлы для `DashboardComponent` и объявляет его в `AppModule`.

Заменить содержимое файла по умолчанию в этих трех файлов следующим образом :

<code-tabs>
  <code-pane
    header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.1.html">
  </code-pane>

  <code-pane
    header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane
    header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

_Template_ представляет сетку ссылок на имена героев.

* `*ngFor` ретранслятор создает столько ссылок, сколько в компоненте `heroes` массив.
* Ссылки оформлены в виде цветных блоков `dashboard.component.css`.
* Ссылки пока никуда не ходят, но [скоро будут](#hero-details).

_Class_ похож на `HeroesComponent` класс.
* Это определяет `heroes` свойство массива.
* Конструктор ожидает, что Angular введет `HeroService` в частном `heroService` свойство.
* `ngOnInit()` вызовы жизненного цикла `getHeroes()`.

Эта `getHeroes()` возвращает нарезанный список героев в позициях 1 и 5, возвращая только четырех главных героев (2-го, 3-го, 4-го и 5-го).

<code-example path="toh-pt5/src/app/dashboard/dashboard.component.ts" header="src/app/dashboard/dashboard.component.ts" region="getHeroes">
</code-example>

{@a add-the-dashboard-route}
### Добавьте маршрутную панель

Для перехода к панели мониторинга маршрутизатору необходим соответствующий маршрут.

Импортировать `DashboardComponent` в `AppRoutingModule`.

<code-example path="toh-pt5/src/app/app-routing.module.ts" region="import-dashboard" header="src/app/app-routing.module.ts (import DashboardComponent)">
</code-example>

Добавить маршрут к `AppRoutingModule.routes` Массив который соответствует пути к `DashboardComponent`.

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts" region="dashboard-route">
</code-example>

{@a add-a-default-route}
### Добавить маршрут по умолчанию

Когда приложение запускается, адресная строка браузера указывает на корень веб-сайта.
Это не соответствует ни одному существующему маршруту, поэтому маршрутизатор никуда не перемещается.
Пространство под `<router-outlet>` пуста.

Чтобы приложение автоматически переходило на панель мониторинга, добавьте следующее
маршрут к `AppRoutingModule.Routes` Массив.

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts" region="redirect-route">
</code-example>

Этот маршрут перенаправляет URL, который полностью соответствует пустому пути к маршруту, путь которого `'/dashboard'`.

После обновления браузера маршрутизатор загружает `DashboardComponent`
и адресная строка браузера показывает `/dashboard` URL.

{@a add-dashboard-link-to-the-shell}
### Добавить ссылку на панель инструментов в оболочку

Пользователь должен иметь возможность перемещаться вперед и назад между
 `DashboardComponent ` и ` HeroesComponent`, нажав на ссылку в
область навигации в верхней части страницы.

Добавьте навигационную ссылку панели инструментов в `AppComponent` оболочки, чуть выше *Heroes* ссылки.

<code-example path="toh-pt5/src/app/app.component.html" header="src/app/app.component.html">
</code-example>

После обновления браузера вы можете свободно перемещаться между двумя представлениями, нажимая на ссылки.

{@a hero-details}
{@a navigating-to-hero-details}
## Переход к деталям героя

 `HeroDetailsComponent` отображает детали выбранного героя.
На данный момент `HeroDetailsComponent` виден только в нижней части `HeroesComponent`

Пользователь должен иметь возможность добраться до этих деталей тремя способами.

1. Нажав на героя в приборной панели.
1. Нажав на героя в списке героев.
1. Вставив URL-адрес «глубокая ссылка» в адресную строку браузера, который идентифицирует героя для отображения.

В этом разделе вы включите навигацию к `HeroDetailsComponent`
и освободить его от `HeroesComponent`.

{@a delete-hero-details-from-heroescomponent}
### Удалить _hero details_ from `HeroesComponent`

Когда пользователь щелкает элемент героя в `HeroesComponent`,
приложение должно перейти к `HeroDetailComponent`,
замена представления списка героев подробным представлением героя.
Представление списка героев больше не должно отображать детали героя, как сейчас.

Открой `HeroesComponent` шаблон (`heroes/heroes.component.html`) и
удалить `<app-hero-detail>` Элемент снизу.

Нажатие на предмет героя теперь ничего не делает.
Вы [исправление, в скором времени](#heroes-component-links)после включения маршрутизации в `HeroDetailComponent`.

{@a add-a-hero-detail-route}
### Добавить _hero detail_ маршрут

URL как `~/detail/11` будет хорошим URL для к представлению *Hero Detail * героя, чей `id` является `11`.

открыто `AppRoutingModule` и импорт `HeroDetailComponent`.

<code-example path="toh-pt5/src/app/app-routing.module.ts" region="import-herodetail" header="src/app/app-routing.module.ts (import HeroDetailComponent)">
</code-example>

Затем добавьте _parameterized_ маршрут к `AppRoutingModule.routes` Массив который соответствует шаблону пути к представлению _hero detail_.

<code-example path="toh-pt5/src/app/app-routing.module.ts" header="src/app/app-routing.module.ts" region="detail-route">
</code-example>

Двоеточие (:) в `path` указывает на то, что `:id` является заполнителем для конкретного героя `id`.

На данный момент все маршруты приложений на месте.

<code-example path="toh-pt5/src/app/app-routing.module.ts" region="routes" header="src/app/app-routing.module.ts (all routes)">
</code-example>

{@a dashboardcomponent-hero-links}
### `DashboardComponent` героя ссылок

 `DashboardComponent` Ссылки героя в данный момент ничего не делают.

Теперь, когда маршрутизатор имеет маршрут к `HeroDetailComponent`,
исправьте ссылки героя на приборной панели для навигации по маршруту _parameterized_ на приборной панели.

<code-example
  path="toh-pt5/src/app/dashboard/dashboard.component.html"
  region="click"
  header="src/app/dashboard/dashboard.component.html (hero links)">
</code-example>

Вы используете Angular [интерполяционная привязка](guide/template-syntax#interpolation)внутри `*ngFor` повторителя
вставить текущую итерацию `hero.id` в каждом
[ `routerLink` ](#routerlink).

{@a heroes-component-links}
{@a heroescomponent-hero-links}
### `HeroesComponent` ссылки героя

Предметы героя в `HeroesComponent` являются `<li>` элементы, чьи события клика
привязаны к компоненту `onSelect()`.

<code-example path="toh-pt4/src/app/heroes/heroes.component.html" region="list" header="src/app/heroes/heroes.component.html (list with onSelect)">
</code-example>

Раздеть `<li>` вернулся только к своей `*ngFor`,
обернуть значок и имя в элементе привязки (`<a>`)
и добавить `routerLink` для привязки этого
такой же, как в шаблоне панели инструментов

<code-example path="toh-pt5/src/app/heroes/heroes.component.html" region="list" header="src/app/heroes/heroes.component.html (list with links)">
</code-example>

Вам придется исправить частную таблицу стилей (`heroes.component.css`) сделать
список выглядит так же, как и раньше.
Пересмотренные стили находятся в [окончательный обзор кода](#heroescomponent)в нижней части этого руководства.

{@a remove-dead-code-optional}
#### Удалить мертвый код (необязательно)

В то время как `HeroesComponent` Класс все еще работает
 `onSelect() ` и ` selectedHero` свойство больше не используется.

Приятно привести в порядок, и вы будете благодарны себе позже.
Вот класс после удаления мертвого кода.

<code-example path="toh-pt5/src/app/heroes/heroes.component.ts" region="class" header="src/app/heroes/heroes.component.ts (cleaned up)">
</code-example>

{@a routable-herodetailcomponent}
## Routable `HeroDetailComponent`

Ранее родитель `HeroesComponent` установить `HeroDetailComponent.hero`
собственность и `HeroDetailComponent` отображает героя.

 `HeroesComponent` больше не делает этого.
Теперь маршрутизатор создает `HeroDetailComponent` в ответ на URL-адрес, такой как `~/detail/11`.

 `HeroDetailComponent` нужен новый способ получить героя для отображения.
В этом разделе описывается следующее:

* Получить маршрут, который создал его
* Извлечь `id` с маршрута
* Получить героя с этим `id` с сервера через `HeroService`

Добавьте следующий импорт:

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="added-imports" header="src/app/hero-detail/hero-detail.component.ts">
</code-example>

{@a hero-detail-ctor}

Введите `ActivatedRoute`, `HeroService` и `Location` Услуги
в конструктор, сохраняя их значение в частных областях:

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" header="src/app/hero-detail/hero-detail.component.ts" region="ctor">
</code-example>

[ `ActivatedRoute` ](api/router/ActivatedRoute)содержит информацию о маршруте к этому экземпляру `HeroDetailComponent`.
Этот компонент заинтересован в параметрах маршрута, извлеченных из URL.
Параметр "id" является `id` героя для отображения.

[ `HeroService` ](tutorial/toh-pt4)получает данные героя с удаленного сервера
и этот компонент будет использовать его для отображения героя.

[ `Location` ](api/common/Location)является радиально - сервис для взаимодействия с браузером.
Вы будете использовать его [позже](#goback)чтобы вернуться назад к представлению, которое здесь находилось.

{@a extract-the-id-route-parameter}
### Извлечь `id` параметр маршрута

в `ngOnInit()` [хук жизненного цикла](guide/lifecycle-hooks#oninit)
вызов `getHero()` и определите его следующим образом.

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" header="src/app/hero-detail/hero-detail.component.ts" region="ngOnInit">
</code-example>

 `route.snapshot` - это статическое изображение информации о маршруте вскоре после создания компонента.

 `paramMap` - это словарь значений параметров маршрута, извлеченных из URL.
 `"id"` ключ возвращает `id` героя, чтобы получить.

Параметры маршрута всегда являются строками.
Оператор JavaScript (+) преобразует строку в число
какой герой `id` должен быть.

Браузер обновляется, и приложение вылетает с ошибкой компилятора.
 `HeroService` не имеет `getHero()`.
Добавьте это сейчас.

{@a add-heroservice.gethero}
### добавлять `HeroService.getHero()`

открыто `HeroService` и добавьте следующее `getHero()` с `id` после `getHeroes()` Метод:

<code-example path="toh-pt5/src/app/hero.service.ts" region="getHero" header="src/app/hero.service.ts (getHero)">
</code-example>

<div class="alert is-important">

Обратите внимание на обратные пометки (& #96;), которые определяют JavaScript
[_template literal_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)для встраивания `id`.
</div>

Как [ `getHeroes ()` ](tutorial/toh-pt4#observable-heroservice),
 `getHero()` имеет асинхронную подпись.
Возвращает _mock hero_ как `Observable`, используя RxJS `of()` функции.

Вы сможете повторно реализовать `getHero()` как настоящий `Http` запрос
без необходимости менять `HeroDetailComponent` который вызывает его.

{@a try-it}
#### Попробуй это

Браузер обновляется, и приложение снова работает.
Вы можете щелкнуть героя на панели инструментов или в списке героев и перейти к подробному представлению этого героя.

Если вы вставите `localhost:4200/detail/11` в адресной строке браузера
роутер переходит к подробному виду героя с `id: 11`, «Доктор Ницца».

{@a goback}

{@a find-the-way-back}
### Найди обратный путь

Нажав кнопку назад браузера,
Вы можете вернуться к списку героев или к панели инструментов
в зависимости от того, который отправил вас в подробный вид.

Было бы неплохо иметь кнопку на `HeroDetail` вид, который может сделать это.

Добавьте *возврата назад * кнопку к нижней части шаблона компонента и привяжите его
к компоненту `goBack()`.

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.html" region="back-button" header="src/app/hero-detail/hero-detail.component.html (back button)">
</code-example>

Добавить `goBack()` _method_ к классу компонента, который перемещается назад на один шаг
в стеке истории браузера
с использованием `Location` Сервис который вы [вводили ранее](#hero-detail-ctor).

<code-example path="toh-pt5/src/app/hero-detail/hero-detail.component.ts" region="goBack" header="src/app/hero-detail/hero-detail.component.ts (goBack)">

</code-example>


Обновите браузер и начните нажимать.
Пользователи могут перемещаться по приложению, от приборной панели до деталей героя и обратно
от списка героев до мини-деталей, подробностей о героях и снова к героям.

{@a final-code-review}
## Окончательный обзор кода

Вот файлы кода, обсуждаемые на этой странице, и ваше приложение должно выглядеть следующим образом <live-example></live-example>.

{@a approutingmodule}
{@a appmodule}
{@a approutingmodule-appmodule-and-heroservice}
#### `AppRoutingModule `, ` AppModule ` и ` HeroService`

<code-tabs>
  <code-pane
    header="src/app/app-routing.module.ts"
    path="toh-pt5/src/app/app-routing.module.ts">
  </code-pane>
  <code-pane
    header="src/app/app.module.ts"
    path="toh-pt5/src/app/app.module.ts">
  </code-pane>
  <code-pane
    header="src/app/hero.service.ts"
    path="toh-pt5/src/app/hero.service.ts">
  </code-pane>
</code-tabs>

{@a appcomponent}
{@a appcomponent}
#### `AppComponent`

<code-tabs>
  <code-pane
    header="src/app/app.component.html"
    path="toh-pt5/src/app/app.component.html">
  </code-pane>

  <code-pane
    header="src/app/app.component.css"
    path="toh-pt5/src/app/app.component.css">
  </code-pane>
</code-tabs>

{@a dashboardcomponent}
{@a dashboardcomponent}
#### `DashboardComponent`

<code-tabs>
  <code-pane
    header="src/app/dashboard/dashboard.component.html" path="toh-pt5/src/app/dashboard/dashboard.component.html">
  </code-pane>

  <code-pane
    header="src/app/dashboard/dashboard.component.ts" path="toh-pt5/src/app/dashboard/dashboard.component.ts">
  </code-pane>

  <code-pane
    header="src/app/dashboard/dashboard.component.css" path="toh-pt5/src/app/dashboard/dashboard.component.css">
  </code-pane>
</code-tabs>

{@a heroescomponent}
{@a heroescomponent}
#### `HeroesComponent`

<code-tabs>
  <code-pane
    header="src/app/heroes/heroes.component.html" path="toh-pt5/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane
    header="src/app/heroes/heroes.component.ts"
    path="toh-pt5/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane
    header="src/app/heroes/heroes.component.css"
    path="toh-pt5/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

{@a herodetailcomponent}
{@a herodetailcomponent}
#### `HeroDetailComponent`

<code-tabs>
  <code-pane
    header="src/app/hero-detail/hero-detail.component.html" path="toh-pt5/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane
    header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt5/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane
    header="src/app/hero-detail/hero-detail.component.css" path="toh-pt5/src/app/hero-detail/hero-detail.component.css">
  </code-pane>
</code-tabs>

{@a summary}
## Резюме

* Вы добавили Angular маршрутизатор для навигации между различными компонентами.
* Вы перевернули `AppComponent` в оболочку навигации с `<a>` ссылки и `<router-outlet>`.
* Вы настроили маршрутизатор в `AppRoutingModule`
* Вы определили простые маршруты, маршрут перенаправления и параметризованный маршрут.
* Вы использовали `routerLink` Директива в элементах привязки.
* Вы преобразовали тесно связанный основной / подробный вид в перенаправленный подробный вид.
* Вы использовали параметры связи маршрутизатора, чтобы перейти к подробному представлению выбранного героя.
* Вы поделились `HeroService` среди нескольких компонентов.
