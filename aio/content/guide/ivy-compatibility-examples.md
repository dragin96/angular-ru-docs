{@a ivy-compatibility-examples}
# Примеры совместимости Ivy

Это приложение предназначено для предоставления дополнительной информации об изменениях Ivy. Во многих из этих примеров перечислены сообщения об ошибках, которые вы можете увидеть, поэтому поиск по сообщениям об ошибках может быть хорошей идеей при отладке.

<div class="alert is-critical">
ПРИМЕЧАНИЕ. Большинство из этих проблем затрагивает небольшой процент приложений, которые сталкиваются с необычными или редкими случаями.
</div>


{@a content-children-descendants}
{@a @contentchildren-queries-only-match-direct-children-by-default}
## По умолчанию запросы @ContentChildren соответствуют прямым дочерним элементам


{@a basic-example-of-change}
### Основной пример изменения

Допустим компонент (`Comp`) имеет `@ContentChildren` Запрос для `'foo'` :

```html
<comp>
    <div>
         <div #foo></div> <!-- matches in old runtime, not in new runtime -->
    </div>
</comp>
```

В предыдущей среде выполнения `<div>` с `#foo` будет соответствовать.
С Айви, это `<div>` не совпадает, потому что он не является прямым потомком `<comp>`.


{@a background}
### Фон

По умолчанию, `@ContentChildren` Запросы имеют `descendants` флаг установлен в `false`.

В предыдущем механизме рендеринга «потомки» ссылались на «директивы потомков».
Элемент может быть совпадением, если между элементом и запрашивающей директивой нет других директив.
Это имело смысл для директив с вложенными вкладками, где нежелательно совпадать с вложенными директивами вкладок.
Тем не менее, это вызвало удивительное поведение для пользователей, потому что добавление несвязанной директивы, такой как `ngClass` для элемента оболочки может сделать недействительными результаты запроса.

Например, с запросом контента и шаблоном ниже, последние два `Tab` директивы не будут матчи:

```
@ContentChildren(Tab, {descendants: false}) tabs: QueryList<Tab>
```

```
<tab-list>
  <div>
    <tab> One </tab> <!-- match (nested in element) -->
  </div>
  <tab> <!-- match (top level) -->
    <tab> A </tab> <!-- not a match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <tab> Two </tab> <!-- not a match (nested in ngClass) -->
  </div>
</tab-list>
```

Кроме того, различия между предикатами типа и строки были тонкими и иногда неясными.
Например, если вы замените предикат типа выше на `'foo'` строка сказуемое, матчи изменить:

```
@ContentChildren('foo', {descendants: false}) foos: QueryList<ElementRef>
```

```
<tab-list>
  <div>
    <div #foo> One </div> <!-- match (nested in element) -->
  </div>
  <tab #foo> <!-- match (top level) -->
    <div #foo> A </div> <!-- match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <div #foo> Two </div> <!-- match (nested in ngClass) -->
  </div>
</tab-list>
```

Поскольку предыдущее поведение было непоследовательным и удивительным для пользователей, мы не хотели воспроизводить его в Ivy.
Вместо этого мы упростили ментальную модель, так что «потомки» относятся только к вложению DOM.
Любой элемент DOM между запрашивающим компонентом и потенциальным соответствием аннулирует это соответствие.
Предикаты типа и строковые предикаты также имеют идентичное поведение сопоставления.

Поведение Ivy для директивы / строковых предикатов
```
<tab-list>
  <div>
    <tab> One </tab> <!-- not a match (nested in element) -->
  </div>
  <tab> <!-- match (top level) -->
    <tab> A </tab> <!-- not a match (nested in tab) -->
  </tab>
  <div [ngClass]="classes">
    <tab> Two </tab> <!-- not a match (nested in div) -->
  </div>
</tab-list>
```


{@a example-of-error}
### Пример ошибки

Отображаемое сообщение об ошибке будет зависеть от того, как конкретный запрос контента используется в коде приложения.
Часто возникает ошибка, когда свойство ссылается на результат запроса контента (который теперь `undefined`).

Например, если компонент устанавливает результаты запроса содержимого в свойстве, `foos`, `foos.first.bar` бы бросить ошибку:

```
Uncaught TypeError: Cannot read property 'bar' of undefined
```

Если вы видите такую ​​ошибку, и `undefined` свойство относится к результату `@ContentChildren` Запрос, вполне может быть вызван этим изменением.


{@a recommended-fix}
### Рекомендуемое исправление

Вы можете добавить `descendants: true` флаг чтобы игнорировать элементы оболочки или удалять сами элементы оболочки.

Вариант 1:
```
@ContentChildren('foo', {descendants: true}) foos: QueryList<ElementRef>;
```

Вариант 2:
```
<comp>
   <div #foo></div> <!-- matches in both old runtime and new runtime -->
</comp>
```

{@a undecorated-classes}
{@a all-classes-that-use-angular-di-must-have-an-angular-class-level-decorator}
## Все классы, которые используют Angular DI, должны иметь декоратор уровня Angular


{@a basic-example-of-change}
### Базовый пример изменения:

В предыдущем рендеринге, следующий будет работать:

```
export class DataService {
  constructor(@Inject('CONFIG') public config: DataConfig) {}
}

@Injectable()
export class AppService extends DataService {...}
```

В Ivy выдает ошибку, потому что `DataService` использует внедрение зависимостей Angular, но отсутствует `@Injectable` декоратор.

Следующее также будет работать в предыдущем движке рендеринга, но в Ivy потребуется `@Directive` декоратор, поскольку он использует DI:

```
export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

@Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}
```

То же самое верно, если ваш класс директивы расширяет декорированную директиву, но не имеет собственного декоратора.

Если вы используете CLI, есть две автоматические миграции, которые должны перенести ваш код для вас ( [этот](guide/migration-injectable)и [этот](guide/migration-undecorated-classes)).
Однако, когда вы добавляете новый код в версии 9, вы можете столкнуться с этой разницей.

{@a background}
### Фон

Когда у класса есть Angular декоратор, такой как `@Injectable` или `@Directive`, Angular-компилятор генерирует дополнительный код для поддержки внедрения зависимостей в конструктор вашего класса.
При использовании наследования Ivy нужен родительский класс и дочерний класс, чтобы применить декоратор для генерации правильного кода.
В противном случае, когда декоратор отсутствует в родительском классе, подкласс унаследует конструктор от класса, для которого компилятор не сгенерировал специальную информацию конструктора, и у Angular не будет информации о зависимостях, необходимой для его правильного создания.

В предыдущем механизме рендеринга компилятор обладал глобальными знаниями, поэтому в некоторых случаях (например, в режиме AOT или при наличии определенных флагов внедрения) он мог искать недостающие данные.
Однако компилятор Ivy обрабатывает каждый класс отдельно.
Это означает, что компиляция потенциально может быть быстрее (и открывает основу для оптимизации и дальнейшего развития функций), но компилятор не может автоматически выводить ту же информацию, что и раньше.

Добавление правильного декоратора явно предоставляет эту информацию.

{@a example-of-error}
### Пример ошибки

В режиме JIT, рамка выбросит следующее сообщение об ошибке:

```
ERROR: This constructor is not compatible with Angular Dependency Injection because its dependency at index X of the parameter list is invalid.
This can happen if the dependency type is a primitive like a string or if an ancestor of this class is missing an Angular decorator.

Please check that 1) the type for the parameter at index X is correct and 2) the correct Angular decorators are defined for this class and its ancestors.
```

В режиме AOT, вы увидите что - то вроде:

```
X inherits its constructor from Y, but the latter does not have an Angular decorator of its own.
Dependency injection will not be able to resolve the parameters of Y's constructor. Either add a
@Directive decorator to Y, or add an explicit constructor to X.
```

В некоторых случаях структура может быть не в состоянии обнаружить отсутствующий декоратор.
В этих случаях вы обычно видите ошибку времени выполнения, возникающую при попытке доступа к свойству по отсутствующей зависимости.
Если зависимость была `foo`, вы увидите ошибку при доступе к чему-то вроде `foo.bar` :

```
Uncaught TypeError: Cannot read property 'bar' of undefined
```

Если вы видите такую ​​ошибку, и `undefined` значение относится к чему-то, что должно было быть введено, возможно, это изменение.

{@a recommended-fix}
### Рекомендуемое исправление

- Добавить `@Injectable` декоратор для всего, что вы планируете предоставить или внедрить.

```
@Injectable()
export class DataService {
  constructor(@Inject('CONFIG') public config: DataConfig) {}
}

@Injectable()
export class AppService extends DataService {...}
```

- Добавьте [селекторный декоратор `@ Directive` ](guide/migration-undecorated-classes#what-does-it-mean-to-have-a-directive-decorator-with-no-metadata-inside-of-it)к любому классу, который расширяет директиву, или к любому классу, от которого наследуется директива.

```
@Directive() // selectorless, so it's not usable directly
export class BaseMenu {
  constructor(private vcr: ViewContainerRef) {}
}

@Directive({selector: '[settingsMenu]'})
export class SettingsMenu extends BaseMenu {}
```

{@a select-value-binding}
{@a cannot-bind-to-value-property-of-<select>-with-*ngfor}
## Невозможно привязать к `value` свойства `<select>` с помощью `*ngFor` 


{@a basic-example-of-change-}
### Основной пример изменения


```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

Во время выполнения View Engine приведенный выше код установит начальное значение `<select>` как ожидалось.
В Ivy начальное значение не будет установлено вообще в этом случае.


{@a background}
### Фон

До Ivy привязки входных директив всегда выполнялись на их собственном проходе обнаружения изменений до обработки любых привязок DOM.
Это деталь реализации, которая поддержала случай использования в вопросе:

```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

Это сработало, потому что `*ngFor` будет проверен первым, во время прохода привязки ввода директивы, и, таким образом, сначала создаст параметры.
Затем запускается проход привязки DOM, который проверяет `value` привязки.
В это время он сможет сопоставить значение с одним из существующих параметров и установить значение `<select>` элемент в DOM, чтобы отобразить эту опцию.

В Ivy привязки проверяются в том порядке, в котором они определены в шаблоне, независимо от того, являются ли они привязками директивных входов или привязками DOM.
Это изменение упрощает обнаружение изменений в целях отладки, поскольку привязки будут проверяться в порядке глубины, как объявлено в шаблоне.

В этом случае это означает, что `value` привязка будет проверена перед `*ngFor` проверяется, так как он объявлен выше `*ngFor` в шаблоне.
Следовательно, значение `<select>` Элемент будет установлен до того, как будут созданы какие-либо параметры, и он не сможет соответствовать и отобразить правильный параметр в DOM.

{@a example-of-error}
### Пример ошибки

Там нет ошибки, но `<select>` не будет правильного начального значения, отображаемого в DOM.


{@a recommended-fix}
### Рекомендуемое исправление

Чтобы решить эту проблему, мы рекомендуем привязать к `selected` свойство на `<option>` вместо `value` на `<select>`.

*До*
```html
<select [value]="someValue">
  <option *ngFor="let option of options" [value]="option"> {{ option }} <option>
</select>
```

*После*
```html
<select>
  <option *ngFor="let option of options" [value]="option" [selected]="someValue == option">
    {{ option }}
  <option>
</select>
```