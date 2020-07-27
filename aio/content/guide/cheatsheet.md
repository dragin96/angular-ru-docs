<h1 class="no-toc">Шпаргалка </h1>

<div id="cheatsheet">
<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Изначальная загрузка</th>
<th><p><code>import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>platformBrowserDynamic().bootstrapModule</b>(AppModule);</code></td>
<td><p>Загружает приложение, используя корневой компонент из указанного <code>NgModule</code>. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>NgModules </th>
<th><p><code>import { NgModule } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code>@<b>NgModule</b>({ declarations:..., imports:...,<br> exports:..., providers:..., bootstrap:...})<br>class MyModule {}</code></td>
<td><p>Определяет модуль, который содержит компоненты, директивы, пайпы и провайдеры. </p>
</td>
</tr><tr>
<td><code><b>declarations:</b> [MyRedComponent, MyBlueComponent, MyDatePipe]</code></td>
<td><p>Список компонентов, директив и каналов, которые принадлежат этому модулю. </p>
</td>
</tr><tr>
<td><code><b>imports:</b> [BrowserModule, SomeOtherModule]</code></td>
<td><p>Список модулей для импорта в этот модуль. Все из импортированных модулей
доступно для <code>declarations</code>этого модуля. </p>
</td>
</tr><tr>
<td><code><b>exports:</b> [MyRedComponent, MyDatePipe]</code></td>
<td><p>Список компонентов, директив и каналов, видимых для модулей, которые импортируют этот модуль. </p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide:... }]</code></td>
<td><p>Список поставщиков внедрения зависимостей, видимых как для содержимого этого модуля, так и для импортеров этого модуля. </p>
</td>
</tr><tr>
<td><code><b>entryComponents:</b> [SomeComponent, OtherComponent]</code></td>
<td><p>Список компонентов, на которые нет ссылок ни в одном доступном шаблоне, например, динамически созданный из кода. </p></td>
</tr><tr>
<td><code><b>bootstrap:</b> [MyAppComponent]</code></td>
<td><p>Список компонентов для начальной загрузки, когда этот модуль загружается. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Синтаксис шаблона </th>
<th></th>
</tr>
<tr>
<td><code>&lt;input <b>[value]</b>="firstName"&gt;</code></td>
<td><p>Привязывает свойство <code>value</code>к результату выражения <code>firstName</code>. </p>
</td>
</tr><tr>
<td><code>&lt;div <b>[attr.role]</b>="myAriaRole"&gt;</code></td>
<td><p>Привязывает атрибут <code>role</code>к результату выражения <code>myAriaRole</code>. </p>
</td>
</tr><tr>
<td><code>&lt;div <b>[class.extra-sparkle]</b>="isDelightful"&gt;</code></td>
<td><p>Связывает наличие класса CSS <code>extra-sparkle</code>в элементе с правдивостью выражения <code>isDelightful</code>. </p>
</td>
</tr><tr>
<td><code>&lt;div <b>[style.width.px]</b>="mySize"&gt;</code></td>
<td><p>Привязывает свойство стиля <code>width</code>к результату выражения <code>mySize</code>в пикселях. Единицы не являются обязательными. </p>
</td>
</tr><tr>
<td><code>&lt;button <b>(click)</b>="readRainbow($event)"&gt;</code></td>
<td><p>Метод звонков<code>readRainbow</code>когда событие click вызывается для этого элемента кнопки (или его дочерних элементов) и передается в объект события. </p>
</td>
</tr><tr>
<td><code>&lt;div title="Hello <b>{{ponyName}}</b>"&gt;</code></td>
<td><p>Связывает свойство с интерполированной строкой, например, «Hello Seabiscuit». Эквивалент:
<code>&lt;div [title]="'Hello ' + ponyName"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Hello <b>{{ponyName}}</b>&lt;/p&gt;</code></td>
<td><p>Привязывает текстовое содержимое к интерполированной строке, например, «Hello Seabiscuit». </p>
</td>
</tr><tr>
<td><code>&lt;my-cmp <b>[(title)]</b>="name"&gt;</code></td>
<td><p>Устанавливает двустороннюю привязку данных. Эквивалент: <code>&lt;my-cmp [title]="name" (titleChange)="name=$event"&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;video <b>#movieplayer</b>...&gt;<br> &lt;button <b>(click)</b>="movieplayer.play()"&gt;<br>&lt;/video&gt;</code></td>
<td><p>Создает локальную переменную, <code>movieplayer</code>которая обеспечивает доступ к <code>video</code>экземпляру элемента в выражениях привязки данных и привязки событий в текущем шаблоне. </p>
</td>
</tr><tr>
<td><code>&lt;p <b>*myUnless</b>="myExpression"&gt;...&lt;/p&gt;</code></td>
<td><p><code>*</code>Символ включает текущий элемент в внедренном шаблон. Эквивалент:
<code>&lt;ng-template [myUnless]="myExpression"&gt;&lt;p&gt;...&lt;/p&gt;&lt;/ng-template&gt;</code></p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Card No.: <b>{{cardNumber | myCardNumberFormatter}}</b>&lt;/p&gt;</code></td>
<td><p>Преобразует текущее значение выражения <code>cardNumber</code>через вызываемый канал <code>myCardNumberFormatter</code>. </p>
</td>
</tr><tr>
<td><code>&lt;p&gt;Employer: <b>{{employer?.companyName}}</b>&lt;/p&gt;</code></td>
<td><p>Оператор безопасной навигации ( <code>?</code>) означает, что <code>employer</code>поле является необязательным и, если <code>undefined</code>, остальная часть выражения должна игнорироваться. </p>
</td>
</tr><tr>
<td><code>&lt;<b>svg:</b>rect x="0" y="0" width="100" height="100"/&gt;</code></td>
<td><p>Шаблону фрагмента SVG необходим <code>svg:</code>префикс для его корневого элемента для устранения неоднозначности элемента SVG из компонента HTML. </p>
</td>
</tr><tr>
<td><code>&lt;<b>svg</b>&gt;<br> &lt;rect x="0" y="0" width="100" height="100"/&gt;<br>&lt;/<b>svg</b>&gt;</code></td>
<td><p><code>&lt;svg&gt;</code>корневой элемент определяется как элемент SVG автоматически, без префикса. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Встроенные директивы </th>
<th><p><code>import { CommonModule } from '@angular/common';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;section <b>*ngIf</b>="showSection"&gt;</code></td>
<td><p>Удаляет или воссоздает часть дерева DOM на основе <code>showSection</code>выражения. </p>
</td>
</tr><tr>
<td><code>&lt;li <b>*ngFor</b>="let item of list"&gt;</code></td>
<td><p>Превращает элемент li и его содержимое в шаблон и использует его для создания представления для каждого элемента в списке. </p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngSwitch]</b>="conditionExpression"&gt;<br> &lt;ng-template <b>[<b>ngSwitchCase</b>]</b>="case1Exp"&gt;...&lt;/ng-template&gt;<br> &lt;ng-template <b>ngSwitchCase</b>="case2LiteralString"&gt;...&lt;/ng-template&gt;<br> &lt;ng-template <b>ngSwitchDefault</b>&gt;...&lt;/ng-template&gt;<br>&lt;/div&gt;</code></td>
<td><p>Условно меняет содержимое div, выбирая один из встроенных шаблонов на основе текущего значения <code>conditionExpression</code>. </p>
</td>
</tr><tr>
<td><code>&lt;div <b>[ngClass]</b>="{'active': isActive, 'disabled': isDisabled}"&gt;</code></td>
<td><p>Связывает наличие классов CSS в элементе с достоверностью связанных значений карты. Правое выражение должно возвращать {class-name: true / false} map. </p>
</td>
</tr>
<tr>
<td><code>&lt;div <b>[ngStyle]</b>="{'property': 'value'}"&gt;</code><br><code>&lt;div <b>[ngStyle]</b>="dynamicStyles()"&gt;</code></td>
<td><p>Позволяет назначать стили для элемента HTML с помощью CSS. Вы можете использовать CSS напрямую, как в первом примере, или вы можете вызвать метод из компонента. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Формы </th>
<th><p><code>import { FormsModule } from '@angular/forms';</code>
</p>
</th>
</tr>
<tr>
<td><code>&lt;input <b>[(ngModel)]</b>="userName"&gt;</code></td>
<td><p>Обеспечивает двустороннюю привязку данных, анализ и проверку для элементов управления формы. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Класс декораторов </th>
<th><p><code>import { Directive,... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Component({...})</b><br>class MyComponent() {}</code></td>
<td><p>Объявляет, что класс является компонентом, и предоставляет метаданные о компоненте. </p>
</td>
</tr><tr>
<td><code><b>@Directive({...})</b><br>class MyDirective() {}</code></td>
<td><p>Объявляет, что класс является директивой и предоставляет метаданные о директиве. </p>
</td>
</tr><tr>
<td><code><b>@Pipe({...})</b><br>class MyPipe() {}</code></td>
<td><p>Объявляет, что класс является каналом и предоставляет метаданные о канале. </p>
</td>
</tr><tr>
<td><code><b>@Injectable()</b><br>class MyService() {}</code></td>
<td><p>Объявляет, что класс может быть предоставлен и добавлен другими классами. Без этого декоратора компилятор не будет генерировать достаточно метаданных, чтобы позволить классу быть правильно созданным, когда он где-то внедряется. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Директивная конфигурация </th>
<th><p><code>@Directive({ property1: value1,... })</code>
</p>
</th>
</tr>
<tr>
<td><code><b>selector:</b> '.cool-button:not(a)'</code></td>
<td><p>Определяет селектор CSS, который идентифицирует эту директиву в шаблоне. Поддерживаемые селекторы включают в себя <code>element</code>,
<code>[attribute]</code>, <code>.class</code>и <code>:not()</code>. </p>
<p>Не поддерживает селекторы родительско-дочерних отношений. </p>
</td>
</tr><tr>
<td><code><b>providers:</b> [MyService, { provide:... }]</code></td>
<td><p>Список поставщиков внедрения зависимостей для этой директивы и ее дочерних элементов. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Конфигурация компонентов </th>
<th><p>
<code>@Component</code>продолжается <code>@Directive</code>,
поэтому <code>@Directive</code>конфигурация относится и к компонентам </p>
</th>
</tr>
<tr>
<td><code><b>moduleId:</b> module.id</code></td>
<td><p>Если установлено, <code>templateUrl</code>и <code>styleUrl</code>разрешаются относительно компонента. </p>
</td>
</tr><tr>
<td><code><b>viewProviders:</b> [MyService, { provide:... }]</code></td>
<td><p>Список поставщиков внедрения зависимостей, относящихся к представлению этого компонента. </p>
</td>
</tr><tr>
<td><code><b>template:</b> 'Hello {{name}}'<br><b>templateUrl:</b> 'my-component.html'</code></td>
<td><p>Встроенный шаблон или внешний шаблон URL вида компонента. </p>
</td>
</tr><tr>
<td><code><b>styles:</b> ['.primary {color: red}']<br><b>styleUrls:</b> ['my-component.css']</code></td>
<td><p>Список встроенных стилей CSS или URL внешних таблиц стилей для стилизации представления компонента. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Декораторы полей классов для директив и компонентов </th>
<th><p><code>import { Input,... } from '@angular/core';</code>
</p>
</th>
</tr>
<tr>
<td><code><b>@Input()</b> myProperty;</code></td>
<td><p>Объявляет свойство ввода, вы можете обновить через свойство связывания (например:
<code>&lt;my-cmp [myProperty]="someExpression"&gt;</code>). </p>
</td>
</tr><tr>
<td><code><b>@Output()</b> myEvent = new EventEmitter();</code></td>
<td><p>Объявляет выходное свойство, которое запускает события, на которые вы можете подписаться, с привязкой к событию (пример:) <code>&lt;my-cmp (myEvent)="doSomething()"&gt;</code>. </p>
</td>
</tr><tr>
<td><code><b>@HostBinding('class.valid')</b> isValid;</code></td>
<td><p>Связывает свойство элемента хоста (здесь, класс CSS <code>valid</code>) со свойством директивы / компонента ( <code>isValid</code>). </p>
</td>
</tr><tr>
<td><code><b>@HostListener('click', ['$event'])</b> onClick(e) {...}</code></td>
<td><p>Подписывается на событие элемента host ( <code>click</code>) с помощью директивы / метода компонента ( <code>onClick</code>), необязательно передавая аргумент ( <code>$event</code>). </p>
</td>
</tr><tr>
<td><code><b>@ContentChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>Привязывает первый результат запроса содержимого компонента (<code>myPredicate</code>) к свойству ( <code>myChildComponent</code>) класса. </p>
</td>
</tr><tr>
<td><code><b>@ContentChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>Связывает результаты запроса содержимого компонента ( <code>myPredicate</code>) со свойством ( <code>myChildComponents</code>) класса. </p>
</td>
</tr><tr>
<td><code><b>@ViewChild(myPredicate)</b> myChildComponent;</code></td>
<td><p>Привязывает первый результат запроса вида ( <code>myPredicate</code>) к свойству ( <code>myChildComponent</code>) класса. Недоступно для директив. </p>
</td>
</tr><tr>
<td><code><b>@ViewChildren(myPredicate)</b> myChildComponents;</code></td>
<td><p>Связывает результаты запроса вида компонента ( <code>myPredicate</code>) со свойством ( <code>myChildComponents</code>) класса. Недоступно для директив. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Директива и обнаружение изменений компонентов и хуки жизненного цикла </th>
<th><p>(реализовано как методы класса)
</p>
</th>
</tr>
<tr>
<td><code><b>constructor(myService: MyService,...)</b> {... }</code></td>
<td><p>Вызывается до любого другого хуки жизненного цикла. Используйте его для внедрения зависимостей, но избегайте здесь серьезной работы. </p>
</td>
</tr><tr>
<td><code><b>ngOnChanges(changeRecord)</b> {... }</code></td>
<td><p>Вызывается после каждого изменения входных свойств и перед обработкой содержимого или дочерних представлений. </p>
</td>
</tr><tr>
<td><code><b>ngOnInit()</b> {... }</code></td>
<td><p>Вызывается после конструктора, инициализации входных свойств и первого вызова <code>ngOnChanges</code>. </p>
</td>
</tr><tr>
<td><code><b>ngDoCheck()</b> {... }</code></td>
<td><p>Вызывается каждый раз, когда проверяются входные свойства компонента или директивы. Используйте его, чтобы расширить обнаружение изменений, выполнив пользовательскую проверку. </p>
</td>
</tr><tr>
<td><code><b>ngAfterContentInit()</b> {... }</code></td>
<td><p>Вызывается после <code>ngOnInit</code>инициализации содержимого компонента или директивы. </p>
</td>
</tr><tr>
<td><code><b>ngAfterContentChecked()</b> {... }</code></td>
<td><p>Вызывается после каждой проверки содержимого компонента или директивы. </p>
</td>
</tr><tr>
<td><code><b>ngAfterViewInit()</b> {... }</code></td>
<td><p>Вызывается после <code>ngAfterContentInit</code>инициализации представлений компонента и дочерних представлений / представления, в котором находится директива. </p>
</td>
</tr><tr>
<td><code><b>ngAfterViewChecked()</b> {... }</code></td>
<td><p>Вызывается после каждой проверки представлений компонента и дочерних представлений / представления, в котором находится директива </p>
</td>
</tr><tr>
<td><code><b>ngOnDestroy()</b> {... }</code></td>
<td><p>Вызывается один раз, прежде чем экземпляр будет уничтожен. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Конфигурация внедрения зависимости </th>
<th></th>
</tr>
<tr>
<td><code>{ <b>provide</b>: MyService, <b>useClass</b>: MyMockService }</code></td>
<td><p>Устанавливает или отменяет провайдер для <code>MyService</code>к <code>MyMockService</code>классу. </p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyService, <b>useFactory</b>: myFactory }</code></td>
<td><p>Устанавливает или отменяет провайдер для <code>MyService</code>к <code>myFactory</code>функции заводской. </p>
</td>
</tr><tr>
<td><code>{ <b>provide</b>: MyValue, <b>useValue</b>: 41 }</code></td>
<td><p>Устанавливает или переопределяет поставщика для <code>MyValue</code>значения <code>41</code>. </p>
</td>
</tr>
</tbody></table>

<table class="is-full-width is-fixed-layout">
<tbody><tr>
<th>Маршрутизация и навигация </th>
<th><p><code>import { Routes, RouterModule,... } from '@angular/router';</code>
</p>
</th>
</tr>
<tr>
<td><code>const routes: <b>Routes</b> = [<br> { path: '', component: HomeComponent },<br> { path: 'path/:routeParam', component: MyComponent },<br> { path: 'staticPath', component:... },<br> { path: '**', component:... },<br> { path: 'oldPath', redirectTo: '/staticPath' },<br> { path:..., component:..., data: { message: 'Custom' } }<br>]);<br><br>const routing = RouterModule.forRoot(routes);</code></td>
<td><p>Настраивает маршруты для приложения. Поддерживает статические, параметризованные, перенаправления и подстановочные маршруты. Также поддерживает пользовательские данные маршрута и разрешения. </p>
</td>
</tr><tr>
<td><code><br>&lt;<b>router-outlet</b>&gt;&lt;/<b>router-outlet</b>&gt;<br>&lt;<b>router-outlet</b> name="aux"&gt;&lt;/<b>router-outlet</b>&gt;<br></code></td>
<td><p>Отмечает местоположение для загрузки компонента активного маршрута. </p>
</td>
</tr><tr>
<td><code><br>&lt;a routerLink="/path"&gt;<br>&lt;a <b>[routerLink]</b>="[ '/path', routeParam ]"&gt;<br>&lt;a <b>[routerLink]</b>="[ '/path', { matrixParam: 'value' } ]"&gt;<br>&lt;a <b>[routerLink]</b>="[ '/path' ]" [queryParams]="{ page: 1 }"&gt;<br>&lt;a <b>[routerLink]</b>="[ '/path' ]" fragment="anchor"&gt;<br></code></td>
<td><p>Создает ссылку на другое представление на основе инструкции маршрута, состоящей из пути маршрута, обязательных и необязательных параметров, параметров запроса и фрагмента. Чтобы перейти к корневому маршруту, используйте <code>/</code>префикс; для дочернего маршрута используйте <code>./</code>префикс; для родного брата или родителя используйте <code>../</code>префикс. </p>
</td>
</tr><tr>
<td><code>&lt;a [routerLink]="[ '/path' ]" routerLinkActive="active"&gt;</code></td>
<td><p>Предоставленные классы добавляются к элементу, когда <code>routerLink</code>становится текущим активным маршрутом.</p>
</td>
</tr><tr>
<td><code>class <b>CanActivate</b>Guard implements <b>CanActivate</b> {<br> canActivate(<br> route: ActivatedRouteSnapshot,<br> state: RouterStateSnapshot<br>): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree {... }<br>}<br><br>{ path:..., canActivate: [<b>CanActivate</b>Guard] }</code></td>
<td><p>Интерфейс для определения класса, который маршрутизатор должен сначала вызвать, чтобы определить, должен ли он активировать этот компонент. Должен возвращать логическое | UrlTree или Observable / Promise, которое разрешается в логическое | UrlTree. </p>
</td>
</tr><tr>
<td><code>class <b>CanDeactivate</b>Guard implements <b>CanDeactivate</b>&lt;T&gt; {<br> canDeactivate(<br> component: T,<br> route: ActivatedRouteSnapshot,<br> state: RouterStateSnapshot<br>): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree {... }<br>}<br><br>{ path:..., canDeactivate: [<b>CanDeactivate</b>Guard] }</code></td>
<td><p>Интерфейс для определения класса, который маршрутизатор должен сначала вызвать, чтобы определить, следует ли деактивировать этот компонент после навигации. Должен возвращать логическое | UrlTree или Observable / Promise, которое разрешается в логическое | UrlTree. </p>
</td>
</tr><tr>
<td><code>class <b>CanActivateChild</b>Guard implements <b>CanActivateChild</b> {<br> canActivateChild(<br> route: ActivatedRouteSnapshot,<br> state: RouterStateSnapshot<br>): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree {... }<br>}<br><br>{ path:..., canActivateChild: [CanActivateGuard],<br> children:... }</code></td>
<td><p>Интерфейс для определения класса, который маршрутизатор должен сначала вызвать, чтобы определить, должен ли он активировать дочерний маршрут. Должен возвращать логическое | UrlTree или Observable / Promise, которое разрешается в логическое | UrlTree. </p>
</td>
</tr><tr>
<td><code>class <b>Resolve</b>Guard implements <b>Resolve</b>&lt;T&gt; {<br> resolve(<br> route: ActivatedRouteSnapshot,<br> state: RouterStateSnapshot<br>): Observable&lt;any&gt;|Promise&lt;any&gt;|any {... }<br>}<br><br>{ path:..., resolve: [<b>Resolve</b>Guard] }</code></td>
<td><p>Интерфейс для определения класса, который маршрутизатор должен вызвать в первую очередь для разрешения данных маршрута перед его обработкой. Должен возвращать значение или Observable / Promise, которое разрешается в значение. </p>
</td>
</tr><tr>
<td><code>class <b>CanLoad</b>Guard implements <b>CanLoad</b> {<br> canLoad(<br> route: Route<br>): Observable&lt;boolean|UrlTree&gt;|Promise&lt;boolean|UrlTree&gt;|boolean|UrlTree {... }<br>}<br><br>{ path:..., canLoad: [<b>CanLoad</b>Guard], loadChildren:... }</code></td>
<td><p>Интерфейс для определения класса, который маршрутизатор должен сначала вызвать, чтобы проверить, должен ли загружаться ленивый загруженный модуль. Должен возвращать логическое | UrlTree или Observable / Promise, которое разрешается в логическое | UrlTree. </p>
</td>
</tr>
</tbody></table>
</div>
