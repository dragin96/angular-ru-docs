{@a create-a-feature-component}
# Создать компонент компонента

На данный момент `HeroesComponent` отображает как список героев, так и данные выбранного героя.

Хранение всех функций в одном компоненте по мере роста приложения не будет обслуживаться.
Вы захотите разделить большие компоненты на более мелкие подкомпоненты, каждый из которых ориентирован на конкретную задачу или рабочий процесс.

На этой странице вы сделаете первый шаг в этом направлении, переместив детали героя в отдельный, многократно используемый `HeroDetailComponent`.

 `HeroesComponent` представит только список героев.
 `HeroDetailComponent` представит детали выбранного героя.

{@a make-the-herodetailcomponent}
## Сделать `HeroDetailComponent`

Используйте Angular CLI для генерации нового компонента с именем `hero-detail`.

<code-example language="sh" class="code-shell">
  ng generate component hero-detail
</code-example>

Команда каркасы следующего:

* Создает каталог `src/app/hero-detail`.

Внутри этого каталога создаются четыре файла:

* Файл CSS для стилей компонентов.
* HTML-файл для шаблона компонента.
* Файл TypeScript с классом компонента с именем `HeroDetailComponent`.
* Тестовый файл для `HeroDetailComponent` класс.

Команда также добавляет `HeroDetailComponent` как объявление в `@NgModule` декоратор `src/app/app.module.ts` Файл.


{@a write-the-template}
### Написать шаблон

Вырежьте HTML-код детали героя из нижней части `HeroesComponent` Шаблон и вставьте его в сгенерированный шаблон в `HeroDetailComponent` шаблон.

Вставленный HTML относится к `selectedHero`.
Новый `HeroDetailComponent` может представлять любого героя, а не только выбранного героя.
Поэтому замените «selectedHero» на «hero» везде в шаблоне.

Когда вы закончите, `HeroDetailComponent` шаблон должен выглядеть следующим образом :

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.html" header="src/app/hero-detail/hero-detail.component.html"></code-example>

{@a add-the- @ input-hero-property}
### Добавить `@Input()` свойство героя

 `HeroDetailComponent` Шаблон привязывается к компонентам `hero` собственность
который имеет тип `Hero`.

Открой `HeroDetailComponent` класса и импортировать `Hero` символ

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts"
region="import-hero" header="src/app/hero-detail/hero-detail.component.ts (import Hero)">
</code-example>

 `hero` собственность
[Должно быть свойство _Input_](guide/template-syntax#inputs-outputs "Input and Output properties"),
аннотирован с `@Input()` декоратор,
потому что _external_ `HeroesComponent` [будет привязывать к нему](#heroes-component-template)как это.

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding">
</code-example>

Изменить `@angular/core` импорта для включения `Input` символ

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" region="import-input" header="src/app/hero-detail/hero-detail.component.ts (import Input)"></code-example>

Добавить `hero` свойство, которому предшествует `@Input()` декоратор.

<code-example path="toh-pt3/src/app/hero-detail/hero-detail.component.ts" header="src/app/hero-detail/hero-detail.component.ts" region="input-hero"></code-example>

Это единственное изменение, которое вы должны внести в `HeroDetailComponent` класс.
Там нет больше свойств. Там нет логики представления.
Этот компонент просто получает объект героя через свой `hero` свойство и отображает его.

{@a show-the-herodetailcomponent}
## Показать `HeroDetailComponent`

 `HeroesComponent` по-прежнему является основным / подробным представлением.

Он раньше отображал детали героя самостоятельно, прежде чем вырезать эту часть шаблона. Теперь он будет делегировать `HeroDetailComponent`.

Два компонента будут иметь отношения родитель / потомок.
Родитель `HeroesComponent` будет контролировать ребенка `HeroDetailComponent`
отправив ему нового героя для отображения в любое время
пользователь выбирает героя из списка.

Вы не измените `HeroesComponent` _class_, но вы измените его _template_.

{@a heroes-component-template}

{@a update-the-heroescomponent-template}
### Обновите `HeroesComponent` шаблон

 `HeroDetailComponent ` селектор ` 'app-hero-detail'`.
Добавить `<app-hero-detail>` Элемент в нижней части `HeroesComponent` шаблон, где раньше был детальный вид героя.

Привязать `HeroesComponent.selectedHero` для элемента `hero` собственности, как это.

<code-example path="toh-pt3/src/app/heroes/heroes.component.html" region="hero-detail-binding" header="heroes.component.html (HeroDetail binding)">

</code-example>

 `[hero]="selectedHero"` является Angular [привязка свойства](guide/template-syntax#property-binding).

Это _one way_ привязка данных от
 `selectedHero` свойство объекта `HeroesComponent` к `hero` свойство целевого элемента, которое отображается на `hero` собственности `HeroDetailComponent`.

Теперь, когда пользователь щелкает героя в списке, `selectedHero` меняется.
Когда `selectedHero` изменяется, _property_Binding_ обновляется `hero`
и `HeroDetailComponent` отображает нового героя.

Пересмотренный `HeroesComponent` шаблон должен выглядеть следующим образом :

<code-example path="toh-pt3/src/app/heroes/heroes.component.html"
  header="heroes.component.html"></code-example>

Браузер обновляется, и приложение снова начинает работать, как раньше.

{@a what-changed}
## Что изменилось?

Как [до того](tutorial/toh-pt2), когда пользователь нажимает на имя героя,
деталь героя появляется под списком героев.
Теперь `HeroDetailComponent` представляет эти детали вместо `HeroesComponent`.

Рефакторинг оригинала `HeroesComponent` на две компоненты урожайности преимущества, как в настоящее время и в будущем:

1. Вы упростили `HeroesComponent` счет снижения своих обязанностей.

1. Вы можете развивать `HeroDetailComponent` в редактор богатых героев
не касаясь родителя `HeroesComponent`.

1. Вы можете развивать `HeroesComponent` не касаясь подробного просмотра героя.

1. Вы можете повторно использовать `HeroDetailComponent` в шаблоне будущего компонента.

{@a final-code-review}
## Окончательный обзор кода

Вот файлы кода, обсуждаемые на этой странице, и ваше приложение должно выглядеть следующим образом <live-example></live-example>.

<code-tabs>

  <code-pane header="src/app/hero-detail/hero-detail.component.ts" path="toh-pt3/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>

  <code-pane header="src/app/hero-detail/hero-detail.component.html" path="toh-pt3/src/app/hero-detail/hero-detail.component.html">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt3/src/app/heroes/heroes.component.html">
  </code-pane>

  <code-pane header="src/app/app.module.ts" path="toh-pt3/src/app/app.module.ts">
  </code-pane>

</code-tabs>

{@a summary}
## Резюме

* Вы создали отдельный, многоразовый `HeroDetailComponent`.


* Вы использовали [привязка свойства](guide/template-syntax#property-binding)чтобы дать родителю `HeroesComponent` контроль над ребенком `HeroDetailComponent`.


* Вы использовали [ `@ Input` декоратор](guide/template-syntax#inputs-outputs)
сделать `hero` свойство доступно для привязки
внешним `HeroesComponent`.
