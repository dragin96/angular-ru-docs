{@a aot-metadata-errors}
# Ошибки метаданных AOT

Ниже приведены ошибки метаданных, с которыми вы можете столкнуться, с объяснениями и предлагаемыми исправлениями.

[Форма выражения не поддерживается](#expression-form-not-supported)<br>
[Ссылка на локальный (не экспортируемый) символ](#reference-to-a-local-symbol)<br>
[Только инициализированные переменные и константы](#only-initialized-variables)<br>
[Ссылка на неэкспортированный класс](#reference-to-a-non-exported-class)<br>
[Ссылка на неэкспортированную функцию](#reference-to-a-non-exported-function)<br>
[Вызовы функций не поддерживаются](#function-calls-not-supported)<br>
[Разрушенная переменная или константа не поддерживаются](#destructured-variable-not-supported)<br>
[Не удалось разрешить тип](#could-not-resolve-type)<br>
[Имя ожидается](#name-expected)<br>
[Неподдерживаемое имя члена перечисления](#unsupported-enum-member-name)<br>
[Теговые выражения шаблонов не поддерживаются](#tagged-template-expressions-not-supported)<br>
[Ожидается ссылка на символ](#symbol-reference-expected)<br>

<hr>

{@a expression-form-not-supported}
{@a expression-form-not-supported}
## Форма выражения не поддерживается

<div class="alert is-helpful">

*Компилятор обнаружил выражение, которое он не понимал при оценке метаданных Angular.*

</div>

Возможности языка вне компилятора [синтаксис ограниченного выражения](guide/aot-compiler#expression-syntax)
может произвести эту ошибку, как показано в следующем примере:

```ts
// ERROR
export class Fooish { ... }
...
const prop = typeof Fooish; // typeof is not valid in metadata
  ...
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  ...
```

Ты можешь использовать  `typeof`  и скобочные обозначения в нормальном коде приложения.
Вы просто не можете использовать эти функции в выражениях, которые определяют Angular метаданные.

Чтобы избежать этой ошибки, придерживайтесь компилятора [синтаксис ограниченного выражения](guide/aot-compiler#expression-syntax)
при написании Angular метаданных
и будьте осторожны с новыми или необычными функциями TypeScript.

<hr>

{@a reference-to-a-local-symbol}
{@a reference-to-a-local-non-exported-symbol}
## Ссылка на локальный (не экспортируемый) символ

<div class="alert is-helpful">

_Ссылка на локальный (не экспортируемый) символ «имя символа». Рассмотрите возможность экспорта символа

</div>

Компилятор обнаружил ссылку на локально определенный символ, который либо не был экспортирован, либо не был инициализирован.

Вот  `provider`  пример проблемы.

```ts
// ERROR
let foo: number; // neither exported nor initialized

@Component({
  selector: 'my-component',
  template: ...,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```
Компилятор генерирует фабрику компонентов, которая включает  `useValue`  код поставщика значения в отдельном модуле. Фабрика _That_ не может обратиться к этому исходному модулю _ для доступа к локальному (не экспортированному)  `foo`  переменная.

Вы можете решить проблему, инициализировав  `foo`.

```ts
let foo = 42; // initialized
```

Компилятор [свернет](guide/aot-compiler#code-folding)выражение в провайдере, как если бы вы написали это.

```ts
  providers: [
    { provide: Foo, useValue: 42 }
  ]
```

Кроме того, вы можете исправить это, экспортировав  `foo`  с ожиданием того, что  `foo`  будет назначен во время выполнения, когда вы на самом деле знаете его значение.

```ts
// CORRECTED
export let foo: number; // exported

@Component({
  selector: 'my-component',
  template: ...,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

Добавление  `export`  часто работает для переменных, на которые есть ссылки в метаданных, таких как  `providers`  и  `animations`  потому что компилятор может генерировать _references_ для экспортируемых переменных в этих выражениях. Ему не нужны _values_ этих переменных.

Добавление  `export`  не работает, когда компилятору нужно _актуальное значение_
для того, чтобы сгенерировать код.
Например, это не работает для  `template`  свойство.

```ts
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

Компилятору нужно значение  `template`  свойство _right сейчас_ для генерации фабрики компонентов.
Одной ссылки на переменную недостаточно.
Добавление префикса к объявлению  `export`  просто выдает новую ошибку, " [ ` Могут быть ссылки только на инициализированные переменные и константы` ](#only-initialized-variables)".

<hr>

{@a only-initialized-variables}
{@a only-initialized-variables-and-constants}
## Только инициализированные переменные и константы

<div class="alert is-helpful">

На только инициализированные переменные и константы можно ссылаться, потому что значение этой переменной требуется шаблону compiler._

</div>

Компилятор нашел ссылку на экспортированную переменную или статическое поле, которое не было инициализировано.
Требуется значение этой переменной для генерации кода.

В следующем примере пытается установить компонент  `template`  свойство к значению
экспортируемый  `someTemplate`  переменная которая объявлена, но _unassigned_.

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

Вы также получите эту ошибку, если вы импортировали  `someTemplate`  из какого-то другого модуля и не инициализировать его там.

```ts
// ERROR - not initialized there either
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

Компилятор не может дождаться времени выполнения, чтобы получить информацию о шаблоне.
Он должен статически вывести значение  `someTemplate`  переменная из исходного кода
так что он может генерировать фабрику компонентов, которая включает в себя
Инструкция по созданию элемента на основе шаблона.

Чтобы исправить эту ошибку, укажите начальное значение переменной в предложении инициализатора _в той же строке_.

```ts
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

<hr>

{@a reference-to-a-non-exported-class}
{@a reference-to-a-non-exported-class}
## Ссылка на неэкспортированный класс

<div class="alert is-helpful">

_Ссылка на неэкспортированный класс, Рассмотрите возможность экспорта класса.

</div>

Метаданные ссылаются на класс, который не был экспортирован.

Например, вы могли определить класс и использовать его в качестве маркера внедрения в массиве провайдеров
но забыл экспортировать этот класс.

```ts
// ERROR
abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```

Angular генерирует фабрику классов в отдельном модуле и тому подобное
фабрика [может получить доступ только к экспортированным классам](guide/aot-compiler#exported-symbols).
Чтобы исправить эту ошибку, экспортируйте указанный класс.

```ts
// CORRECTED
export abstract class MyStrategy { }

  ...
  providers: [
    { provide: MyStrategy, useValue: ... }
  ]
  ...
```
<hr>

{@a reference-to-a-non-exported-function}
{@a reference-to-a-non-exported-function}
## Ссылка на неэкспортированную функцию

<div class="alert is-helpful">

*Метаданные ссылались на функцию, которая не была экспортирована.*

</div>

Например, вы могли установить провайдеров  `useFactory`  для локальной функции, которую вы экспортировать.

```ts
// ERROR
function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```

Angular генерирует фабрику классов в отдельном модуле и тому подобное
фабрика [может получить доступ только к экспортированным функциям](guide/aot-compiler#exported-symbols).
Чтобы исправить эту ошибку, экспортируйте функцию.

```ts
// CORRECTED
export function myStrategy() { ... }

  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  ...
```
<hr>

{@a function-calls-not-supported}
{@a function-calls-are-not-supported}
## Вызовы функций не поддерживаются

<div class="alert is-helpful">

_Функциональные вызовы не поддерживаются. Попробуйте заменить функцию или лямбду ссылкой на экспортированную функцию

</div>

Компилятор в настоящее время не поддерживает [выражения функций или лямбда-функции](guide/aot-compiler#function-expression).
Например, вы не можете установить провайдера  `useFactory`  для анонимной функции или функции стрелки, как это.

```ts
// ERROR
  ...
  providers: [
    { provide: MyStrategy, useFactory: function() { ... } },
    { provide: OtherStrategy, useFactory: () => { ... } }
  ]
  ...
```
Вы также получаете эту ошибку, если вы вызываете функцию или метод в провайдере  `useValue`.

```ts
// ERROR
import { calculateValue } from './utilities';

  ...
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  ...
```

Чтобы исправить эту ошибку, экспортируйте функцию из модуля и обратитесь к функции в  `useFactory`  вместо этого провайдера.

```ts
// CORRECTED
import { calculateValue } from './utilities';

export function myStrategy() { ... }
export function otherStrategy() { ... }
export function someValueFactory() {
  return calculateValue();
}
  ...
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  ...
```

<hr>

{@a destructured-variable-not-supported}
{@a destructured-variable-or-constant-not-supported}
## Разрушенная переменная или константа не поддерживаются

<div class="alert is-helpful">

_Ссылка на экспортированную деструктурированную переменную или константу не поддерживается компилятором шаблона. Подумайте об упрощении, чтобы избежать разрушения

</div>

Компилятор не поддерживает ссылки на переменные, назначенные [деструктурирование](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring).

Например, вы не можете писать что - то вроде этого:

```ts
// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  ...
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  ...
```

Чтобы исправить эту ошибку, обратитесь к недеструктурированным значениям.

```ts
// CORRECTED
import { configuration } from './configuration';
  ...
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  ...
```

<hr>

{@a could-not-resolve-type}
{@a could-not-resolve-type}
## Не удалось разрешить тип

<div class="alert is-helpful">

*Компилятор обнаружил тип и не может определить, какой модуль экспортирует этот тип.*

</div>

Это может произойти, если вы ссылаетесь на окружающий тип.
Например,  `Window`  Тип - это окружающий тип, объявленный в глобальном  `.d.ts`  файл

Вы получите ошибку, если будете ссылаться на нее в конструкторе компонента
который компилятор должен статически анализировать.

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { ... }
}
```
TypeScript понимает окружающие типы, поэтому вы не импортируете их.
Компилятор Angular не понимает тип, который вы игнорируете при экспорте или импорте.

В этом случае компилятор не понимает, как внедрить что-либо с помощью  `Window`  жетон

Не ссылайтесь на окружающие типы в выражениях метаданных.

Если необходимо придать экземпляр окружающей среды типа
Вы можете замять проблему в четыре этапа:

1. Создайте токен инъекции для экземпляра окружающего типа.
1. Создайте фабричную функцию, которая возвращает этот экземпляр.
1. Добавить  `useFactory`  провайдера фабрики с этой фабричной функцией.
1. использование  `@Inject`  чтобы внедрить экземпляр.

Вот иллюстративный пример.

```ts
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  ...
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { ... }
}
```

 `Window` Тип в конструкторе больше не является проблемой для компилятора, поскольку он
использует  `@Inject(WINDOW)`  для генерации кода инъекции.

Angular делает что-то похожее с  `DOCUMENT`  Токен чтобы вы могли ввести браузер  `document`  объект (или его абстракция, в зависимости от платформы, на которой работает приложение).

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({ ... })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { ... }
}
```
<hr>

{@a name-expected}
{@a name-expected}
## Имя ожидается

<div class="alert is-helpful">

*Компилятор ожидал имя в выражении, которое он вычислял.*

</div>

Это может произойти, если вы используете число в качестве имени свойства, как в следующем примере.

```ts
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

Измените имя свойства на что-то не числовое.

```ts
// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

<hr>

{@a unsupported-enum-member-name}
{@a unsupported-enum-member-name}
## Неподдерживаемое имя члена перечисления

<div class="alert is-helpful">

*Angular не может определить значение [члена enum](https://www.typescriptlang.org/docs/handbook/enums.html)которое вы ссылаетесь в метаданных.*

</div>

Компилятор может понимать простые значения перечисления, но не сложные значения, такие как значения, полученные из вычисляемых свойств.

```ts
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

  ...
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  ...
```

Избегайте ссылок на перечисления со сложными инициализаторами или вычисленными свойствами.

<hr>

{@a tagged-template-expressions-not-supported}
{@a tagged-template-expressions-are-not-supported}
## Теговые выражения шаблонов не поддерживаются

<div class="alert is-helpful">

_Tagged шаблонные выражения не поддерживаются в метаданных._

</div>

Компилятор обнаружил JavaScript ES2015 теговое [выражение шаблона](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals)например, следующий.

```ts
// ERROR
const expression = 'funky';
const raw = String.raw `A tagged template ${expression} string` ;
 ...
 template: '<div>' + raw + '</div>'
 ...
```
[ `String.raw ()` ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw)
является функцией тега _ родной для JavaScript ES2015.

Компилятор AOT не поддерживает теговые выражения шаблонов; избегайте их в выражениях метаданных.

<hr>

{@a symbol-reference-expected}
{@a symbol-reference-expected}
## Ожидается ссылка на символ

<div class="alert is-helpful">

*Компилятор ожидал ссылку на символ в месте, указанном в сообщении об ошибке.*

</div>

Эта ошибка может возникнуть, если вы используете выражение в  `extends`  предложение класса.

<!--

Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495).

-->
