{@a the-hero-editor}
# Редактор героев

Приложение теперь имеет основной заголовок.
Далее вы создадите новый компонент для отображения информации о герое
и поместите этот компонент в оболочку приложения.

{@a create-the-heroes-component}
## Создайте компонент героев

Используя Angular CLI, создайте новый компонент с именем `heroes`.

<code-example language="sh" class="code-shell">
  ng generate component heroes
</code-example>

CLI создает новую папку, `src/app/heroes/`, и генерирует
три файла `HeroesComponent` вместе с тестовым файлом.

 `HeroesComponent` файл класса выглядит следующим образом :

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" region="v1" header="app/heroes/heroes.component.ts (initial version)"></code-example>

Вы всегда импортируете `Component` Символ из базовой библиотеки Angular
и аннотировать класс компонента с `@Component`.

 `@Component` - это функция декоратора, которая определяет Angular метаданные для компонента.

CLI генерируется три метаданных свойства:

1. `selector` - CSS элемента компонента
1. `templateUrl` - расположение файла шаблона компонента.
1. `styleUrls` - расположение частных стилей CSS компонента.

{@a selector}

[Селекторный элемент CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Type_selectors),
 `'app-heroes'`, соответствует имени элемента HTML, который идентифицирует этот компонент в шаблоне родительского компонента.

 `ngOnInit()` - это [ловушка жизненного цикла](guide/lifecycle-hooks#oninit).
Angular звонки `ngOnInit()` вскоре после создания компонента.
Это хорошее место для размещения логики инициализации.

Всегда `export` класс компонента, чтобы вы могли `import` его в другом месте... как в `AppModule`.

{@a add-a-hero-property}
### Добавить `hero` собственность

Добавить `hero` собственность `HeroesComponent` для героя по имени «Буря Ветров».

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" region="add-hero" header="heroes.component.ts (hero property)"></code-example>

{@a show-the-hero}
### Покажи героя

Открой `heroes.component.html` файл шаблона.
Удалите текст по умолчанию, сгенерированный Angular CLI и
заменить его привязкой данных к новому `hero` собственность.

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" header="heroes.component.html" region="show-hero-1"></code-example>

{@a show-the-heroescomponent-view}
## Показать `HeroesComponent` вид

Для отображения `HeroesComponent`, необходимо добавить его в шаблон оболочки `AppComponent`.

Помни что `app-heroes` - это [селектор элементов](#selector)для `HeroesComponent`.
Так что добавьте `<app-heroes>` элемент к `AppComponent` шаблона, чуть ниже заголовка.

<code-example path="toh-pt1/src/app/app.component.html" header="src/app/app.component.html"></code-example>

Предполагая, что CLI `ng serve` Команда все еще выполняется
браузер должен обновить и отобразить как название приложения, так и имя героя.

{@a create-a-hero-interface}
## Создать интерфейс героя

Настоящий герой - это больше, чем имя.

Создать `Hero` интерфейс в своем собственном файле в `src/app` папка.
Дай это `id` и `name` свойства.

<code-example path="toh-pt1/src/app/hero.ts" header="src/app/hero.ts"></code-example>


Вернуться к `HeroesComponent` класс и импортировать `Hero` интерфейс.

Рефакторинг компонента `hero` свойство чтобы иметь тип `Hero`.
Инициализируйте это с `id` из `1` и название `Windstorm`.

Пересмотренный `HeroesComponent` файл класса должен выглядеть следующим образом :

<code-example path="toh-pt1/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts"></code-example>

Страница больше не отображается должным образом, потому что вы изменили героя с строки на объект.

{@a show-the-hero-object}
## Покажите объект героя

Обновите привязку в шаблоне, чтобы объявить имя героя
и показать оба `id` и `name` через детали макета, как это:

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" region="show-hero-2" header="heroes.component.html (HeroesComponent's template)"></code-example>

Браузер обновляет и отображает информацию о герое.

{@a format-with-the-_uppercasepipe_}
## Отформатируйте с помощью _UppercasePipe_

Изменить `hero.name` Связывание так.
<code-example path="toh-pt1/src/app/heroes/heroes.component.html" header="src/app/heroes/heroes.component.html" region="pipe">
</code-example>

Браузер обновляется, и теперь имя героя отображается заглавными буквами.

Слово `uppercase` в интерполяционной привязке
сразу после оператора трубы (|)
активирует встроенный `UppercasePipe`.

[Трубы](guide/pipes)- это хороший способ форматирования строк, сумм валют, дат и других отображаемых данных.
Angular корабли с несколькими встроенными трубами, и вы можете создать свой собственный.

{@a edit-the-hero}
## Редактировать героя

Пользователи должны иметь возможность редактировать имя героя в `<input>` текстового поля.

Текстовое поле должно как _display_ героя `name` собственности
и _update_ это свойство в качестве пользовательских типов.
Это означает, что данные передаются из класса компонента _out на экран_ и
с экрана _обратно в класс_.

Чтобы автоматизировать этот поток данных, установите двустороннюю привязку данных между `<input>` элемент формы и `hero.name` свойство.

{@a two-way-binding}
### Двухстороннее связывание

Рефакторинг области данных в `HeroesComponent` шаблон так это выглядит следующим образом :

<code-example path="toh-pt1/src/app/heroes/heroes.component.1.html" region="name-input" header="src/app/heroes/heroes.component.html (HeroesComponent's template)"></code-example>

**[(ngModel)]** - это двусторонний синтаксис привязки данных Angular.

Здесь это связывает `hero.name` свойство в текстовое поле HTML, чтобы данные могли проходить _в обоих направлениях: _ из `hero.name` свойство в текстовое поле, а из текстового поля обратно в `hero.name`.

{@a the-missing-_formsmodule_}
### Отсутствует _FormsModule_

Обратите внимание, что приложение перестало работать, когда вы добавили `[(ngModel)]`.

Чтобы увидеть ошибку, откройте инструменты разработки браузера и загляните в консоль
за сообщение вроде

<code-example language="sh" class="code-shell">
Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.
</code-example>

Хотя `ngModel` - допустимая Angular директива, по умолчанию она недоступна.

Это относится к дополнительному `FormsModule` и вы должны _opt-in_ для его использования.

{@a appmodule}
## _AppModule_

Angular должен знать, как части вашего приложения сочетаются друг с другом
и какие другие файлы и библиотеки требуются приложению.
Эта информация называется _metadata_.

Некоторые из метаданных находятся в `@Component` декораторы, которые вы добавили в классы компонентов.
Другие важные метаданные находятся в [ `@ NgModule` ](guide/ngmodules)декораторах.

Самое важное `@NgModule` Декоратор комментирует верхнего уровня **AppModule** класс.

Angular CLI сгенерировал `AppModule` Класс в `src/app/app.module.ts` когда он создал проект.
Это где вы _opt-in_ к `FormsModule`.

{@a import-_formsmodule_}
### Импортировать _FormsModule_

открыто `AppModule` (`app.module.ts`) и импортировать `FormsModule` Символ из `@angular/forms` Библиотека.

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (FormsModule symbol import)"
 region="formsmodule-js-import">
</code-example>

Затем добавьте `FormsModule` для `@NgModule` метаданные `imports` массив, который содержит список внешних модулей, что приложение нуждается.

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (@NgModule imports)"
region="ng-imports">
</code-example>

Когда браузер обновится, приложение должно снова заработать. Вы можете отредактировать имя героя и увидеть изменения, отраженные сразу в `<h2>` над текстовым полем.

{@a declare-heroescomponent}
### Declare `HeroesComponent`

Каждый компонент должен быть объявлен в _exactly one_ [NgModule](guide/ngmodules).

_You_ не объявил `HeroesComponent`.
Так почему же приложение работает?

Это сработало, потому что Angular CLI объявил `HeroesComponent` в `AppModule` когда он генерирует этот компонент.

открыто `src/app/app.module.ts` и найти `HeroesComponent` импортируется вблизи вершины.
<code-example path="toh-pt1/src/app/app.module.ts" header="src/app/app.module.ts" region="heroes-import" >
</code-example>

 `HeroesComponent` объявлен в `@NgModule.declarations` массив.
<code-example path="toh-pt1/src/app/app.module.ts" header="src/app/app.module.ts" region="declarations">
</code-example>

Обратите внимание, что `AppModule` объявляет оба компонента приложения, `AppComponent` и `HeroesComponent`.


{@a final-code-review}
## Окончательный обзор кода

Ваше приложение должно выглядеть следующим образом <live-example></live-example>. Вот файлы кода, обсуждаемые на этой странице.

<code-tabs>

  <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts"
  path="toh-pt1/src/app/app.module.ts">
  </code-pane>

  <code-pane header="src/app/app.component.ts" path="toh-pt1/src/app/app.component.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html">
  </code-pane>

  <code-pane header="src/app/hero.ts"
  path="toh-pt1/src/app/hero.ts">
  </code-pane>

</code-tabs>

{@a summary}
## Резюме

* Вы использовали CLI для создания второго `HeroesComponent`.
* Вы отобразили `HeroesComponent`, добавив его в `AppComponent` shell.
* Вы применили `UppercasePipe` для форматирования имени.
* Вы использовали двустороннее связывание данных с `ngModel` Директива.
* Вы узнали о `AppModule`.
* Вы импортировали `FormsModule` в `AppModule` чтобы Angular распознавал и применял `ngModel` Директива.
* Вы узнали о важности объявления компонентов в `AppModule`
и оценил, что CLI объявил это для вас.
