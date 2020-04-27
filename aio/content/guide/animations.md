{@a introduction-to-angular-animations}
# Введение в Angular анимацию

Анимация создает иллюзию движения: элементы HTML со временем меняют стиль. Хорошо продуманные анимации могут сделать ваше приложение более увлекательным и простым в использовании, но они не просто косметические. Анимация может улучшить ваше приложение и пользовательский опыт в ряде способов:

* Без анимации переходы веб-страниц могут показаться резкими и резкими.

* Движение значительно улучшает взаимодействие с пользователем, поэтому анимация дает пользователям возможность обнаружить реакцию приложения на их действия.

* Хорошие анимации интуитивно привлекают внимание пользователя там, где это необходимо.

Как правило, анимация включает в себя несколько стилей*преобразования* со временем. Элемент HTML может перемещаться, изменять цвет, увеличиваться или уменьшаться, исчезать или скользить по странице. Эти изменения могут происходить одновременно или последовательно. Вы можете контролировать время каждой трансформации.

Система анимации Angular построена на функциональности CSS, что означает, что вы можете анимировать любое свойство, которое браузер считает анимируемым. Это включает в себя позиции, размеры, преобразования, цвета, границы и многое другое. W3C поддерживает список анимируемых свойств на своей [CSS Transitions](https://www.w3.org/TR/css-transitions-1/)странице.


{@a about-this-guide}
## Об этом руководстве

В этом руководстве рассматриваются основные функции Angular анимации, с которых можно начать добавление Angular анимации в проект.

Функции, описанные в этом руководстве, а также более продвинутые функции, описанные в соответствующих руководствах по Angular анимации, демонстрируются в примере приложения, доступного как <live-example></live-example>.

{@a prerequisites}
#### Предпосылки

Руководство предполагает, что вы знакомы с построением основных Angular приложений, как описаны в следующих разделах:

* [Учебник](tutorial)
* [Обзор архитектуры](guide/architecture)


{@a getting-started}
## Начало работы

Основными Angularи модулями для анимации являются  `@angular/animations ` и ` @angular/platform-browser` . Когда вы создаете новый проект с помощью CLI, эти зависимости автоматически добавляются в ваш проект.

Чтобы начать добавление Angular-анимаций в ваш проект, импортируйте модули для анимации вместе со стандартной функциональностью Angular.

{@a step-1-enabling-the-animations-module}
### Шаг 1: Включение модуля анимации

Импортировать  `BrowserAnimationsModule`, который вводит возможности анимации в ваш корневой модуль приложения Angular.

<code-example path="animations/src/app/app.module.1.ts" header="src/app/app.module.ts" language="typescript"></code-example>

<div class="alert is-helpful">

**Примечание.** Когда вы используете CLI для создания приложения, модуль корневого приложения  `app.module.ts`  находится в  `src/app`  папка.
</div>

{@a step-2-importing-animation-functions-into-component-files}
### Шаг 2: Импорт функций анимации в файлы компонентов

Если вы планируете использовать определенные функции анимации в файлах компонентов, импортируйте эти функции из  `@angular/animations`.

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="imports" language="typescript">
</code-example>

<div class="alert is-helpful">

**Примечание.** См. [Краткое изложение доступных функций анимации](guide/animations#animation-api-summary)в конце данного руководства.
</div>

{@a step-3-adding-the-animation-metadata-property}
### Шаг 3. Добавление свойства метаданных анимации

В файле компонента добавьте свойство метаданных с именем  `animations:`  пределах  `@Component()`  декоратор. Вы помещаете триггер, который определяет анимацию внутри  `animations`  свойство метаданных.

<code-example path="animations/src/app/app.component.ts" header="src/app/app.component.ts" region="decorator" language="typescript">
</code-example>

{@a animating-a-simple-transition}
## Анимация простого перехода

Давайте оживим простой переход, который изменяет один элемент HTML из одного состояния в другое. Например, вы можете указать, что кнопка отображает либо **Открыто,** либо**Закрыто в** зависимости от последнего действия пользователя. Когда кнопка находится в  `open`  состояние, оно видимое и желтое. Когда это  `closed`  состояние, оно прозрачное и зеленое.

В HTML эти атрибуты устанавливаются с использованием обычных стилей CSS, таких как цвет и непрозрачность. В Angular используйте  `style()`  Функция для указания набора стилей CSS для использования с анимацией. Вы можете собрать набор стилей в состоянии анимации и дать этому имени имя, например:  `open`  или  `closed`.

<div class="lightbox">
  <img src="generated/images/guide/animations/open-closed.png" alt="open and closed states">
</div>

{@a animation-state-and-styles}
### Состояние и стили анимации

Используйте Angular's  `state()`  функция для определения различных состояний, вызываемых в конце каждого перехода. Эта функция принимает два аргумента: уникальное имя, например  `open`  или  `closed`  и  `style()`  функция.

Использовать  `style()`  Функция для определения набора стилей, связанных с данным именем состояния. Обратите внимание, что атрибуты стиля должны быть в [* camelCase*](guide/glossary#case-conventions).

Давайте посмотрим, как Angular's  `state()`  Функция работает с  `style⁣­(⁠)`  для установки атрибутов стиля CSS. В этом фрагменте кода для атрибута состояния одновременно задаются несколько атрибутов стиля. в  `open`  состоянии кнопка имеет высоту 200 пикселей, непрозрачность 1 и желтый цвет фона.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="state1" language="typescript">
</code-example>

в  `closed`  состояние, как показано ниже, кнопка имеет высоту 100 пикселей, непрозрачность 0,5 и зеленый цвет фона.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" region="state2" language="typescript">
</code-example>

{@a transitions-and-timing}
### Переходы и сроки

В Angular вы можете установить несколько стилей без анимации. Однако без дальнейшего уточнения кнопка мгновенно преобразуется без выцветания, усадки или другого видимого индикатора того, что происходит изменение.

Чтобы сделать изменение менее резким, нам нужно определить анимационный *переход,* чтобы указать изменения, которые происходят между одним состоянием и другим в течение определенного периода времени.  `transition()` Функция принимает два аргумента: первый аргумент принимает выражение, которое определяет направление между двумя состояниями перехода, а второй аргумент принимает один или серию  `animate()`  шаги.


Использовать  `animate()`  Функция определяет длину, задержку и замедление перехода, а также назначает функцию стиля для определения стилей во время выполнения переходов. Вы также можете использовать  `animate()`  Функция для определения  `keyframes()`  Функция для многошаговой анимации. Эти определения помещены во второй аргумент  `animate()`  функция.

{@a animation-metadata-duration-delay-and-easing}
#### Метаданные анимации: длительность, задержка и замедление

 `animate()` Функция (второй аргумент функции перехода) принимает  `timings`  и  `styles`  параметры ввода.

 `timings` Параметр принимает строку, определенную в трех частях.

> `animate ('duration delay easing')` 

Первая часть,  `duration`, обязательна. Длительность может быть выражена в миллисекундах в виде простого числа без кавычек или в секундах с кавычками и указателем времени. Например, длительность одной десятой секунды может быть выражено следующим образом :

* Как простое число, в миллисекундах:  `100` 

* В строке, в миллисекундах:  `'100ms'` 

* В строке, в секундах:  `'0.1s'` 

Второй аргумент,  `delay`, имеет тот же синтаксис, что и  `duration`  . Например:

* Подождите 100 мс, а затем запустите 200 мс: `'0.2s 100ms'` 

Третий аргумент,  `easing`, управляет тем, как анимация [ускоряется и замедляется](http://easings.net/)во время ее выполнения. Например,  `ease-in`  причинах анимации, чтобы начать медленно, и подобрать скорость, как она прогрессирует.

* Подождите 100 мс, бегите 200 мс. Используйте кривую замедления, чтобы начать быстро и медленно замедляться к точке покоя: `'0.2s 100ms ease-out'` 

* Пробег на 200 мс, без задержки. Используйте стандартную кривую, чтобы начать медленно, ускоряться в середине, а затем медленно замедляться в конце: `'0.2s ease-in-out'` 

* Начните немедленно, бегите в течение 200 мс. Используйте кривую ускорения, чтобы начать медленно и закончить на полной скорости: `'0.2s ease-in'` 

<div class="alert is-helpful">

**Примечание.** См. Раздел веб-сайта Material Design [Естественные кривые замедления](https://material.io/design/motion/speed.html#easing)для получения общей информации о кривых замедления.
</div>

Этот пример обеспечивает переход состояния из  `open`  для  `closed`  с переходом в одну секунду между состояниями.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript"
region="transition1">
</code-example>

В приведенном выше фрагменте кода  `=>`   оператор указывает однонаправленные переходы, и  `<=>` является двунаправленным. В переходе,  `animate()`  указывает, сколько времени занимает переход. В этом случае состояние меняется с  `open`  для  `closed`  занимает одну секунду, выражается здесь как  `1s`.

В этом примере добавляется переход состояния из  `closed`  состояние к  `open`  состояние с 0,5-секундной дугой анимации перехода.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript"
region="transition2">
</code-example>

<div class="alert is-helpful">

**Примечание:** некоторые дополнительные примечания по использованию стилей в  `state`  и  `transition`  функции.

* использование  `state()`  для определения стилей, которые применяются в конце каждого перехода, они сохраняются после завершения анимации.

* использование  `transition()`  для определения промежуточных стилей, которые создают иллюзию движения во время анимации.

* Когда анимации отключены,  `transition()`  Стили можно пропустить, но  `state()`  стили не могут.

* Вы можете включить несколько пар состояний в одном  `transition()`  аргумент :<br/>  `transition('on => off, off => void')`.
</div>

{@a triggering-the-animation}
### Запуск анимации

Анимация требует *триггера*, чтобы он знал, когда начать.  `trigger()` Функция собирает состояния и переходы и дает анимации имя, чтобы вы могли присоединить ее к инициирующему элементу в шаблоне HTML.

 `trigger()` Функция описывает имя свойства для отслеживания изменений. Когда происходит изменение, триггер инициирует действия, включенные в его определение. Эти действия могут быть переходами или другими функциями, как мы увидим позже.

В этом примере мы назовем триггер  `openClose`, and attach it to the  `button`  element. The trigger describes the open and closed states, and the timings for the two transitions.

<div class="lightbox">
  <img src="generated/images/guide/animations/triggering-the-animation.png" alt="triggering the animation">
</div>

<div class="alert is-helpful">

**Note:** Within each  `trigger()`  function call, an element can only be in one state at any given time. However, it's possible for multiple triggers to be active at once.
</div>

{@a defining-animations-and-attaching-them-to-the-html-template}
### Defining animations and attaching them to the HTML template

Animations are defined in the metadata of the component that controls the HTML element to be animated. Put the code that defines your animations under the  `animations:`  property within the  `@Component()`  decorator.

<code-example path="animations/src/app/open-close.component.ts" header="src/app/open-close.component.ts" language="typescript" region="component"></code-example>

When you've defined an animation trigger for a component, you can attach it to an element in that component's template by wrapping the trigger name in brackets and preceding it with an  `@`  symbol. Then, you can bind the trigger to a template expression using standard Angular property binding syntax as shown below, where  `triggerName`  is the name of the trigger, and  `expression`  evaluates to a defined animation state.

```
<div [@triggerName]="expression">...</div>;
```

The animation is executed or triggered when the expression value changes to a new state.

The following code snippet binds the trigger to the value of the  `isOpen`  property.

<code-example path="animations/src/app/open-close.component.1.html" header="src/app/open-close.component.html"
region="compare">
</code-example>

In this example, when the  `isOpen`  expression evaluates to a defined state of  `open`  or  `closed`, it notifies the trigger  `openClose`  of a state change. Then it's up to the  `openClose`  code to handle the state change and kick off a state change animation.

For elements entering or leaving a page (inserted or removed from the DOM), you can make the animations conditional. For example, use  `*ngIf`  with the animation trigger in the HTML template.

<div class="alert is-helpful">

**Note:** In the component file, set the trigger that defines the animations as the value of the  `animations:`  property in the  `@Component()` декоратор.

В файле шаблона HTML используйте имя триггера, чтобы прикрепить определенные анимации к элементу HTML для анимации.

</div>

{@a code-review}
### Обзор кода

Вот файлы кода, обсуждаемые в примере перехода.

<code-tabs>

<code-pane header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" language="typescript"
region="component">
</code-pane>

<code-pane header="src/app/open-close.component.html" path="animations/src/app/open-close.component.1.html"
region="trigger">
</code-pane>

<code-pane header="src/app/open-close.component.css" path="animations/src/app/open-close.component.css">
</code-pane>

</code-tabs>

{@a summary}
### Резюме

Вы научились добавлять анимацию к простому переходу между двумя состояниями, используя  `style()`  и  `state()`  вместе с  `animate()`  для определения времени.

Вы можете узнать о более продвинутых функциях Angular-анимации в разделе «Анимация», начиная с продвинутых методов [переход и триггеры](guide/transition-and-triggers).

{@a animation-api-summary}
{@a animations-api-summary}
## Резюме API анимаций

Функциональный API, предоставляемый  `@angular/animations`  Модуль предоставляет предметно-ориентированный язык (DSL) для создания и управления анимацией в приложениях Angular. См. [Справочник по API](api/animations)полный список и подробные сведения о синтаксисе основных функций и связанных структур данных.

<table>

<tr>
<th style="vertical-align: top">
Название функции
</th>

<th style="vertical-align: top">
Что она делает
</th>
</tr>

<tr>
<td><code>trigger()</code></td>
<td>Запускает анимацию и служит контейнером для всех других вызовов функций анимации. HTML-шаблон привязывается к <code>triggerName</code>. Используйте первый аргумент для объявления уникального имени триггера. Использует синтаксис массива. </td>
</tr>

<tr>
<td><code>style()</code></td>
<td>Определяет один или несколько стилей CSS для использования в анимации. Управляет визуальным отображением элементов HTML во время анимации. Использует синтаксис объекта. </td>
</tr>

<tr>
<td><code><a href="api/animations/state" class="code-anchor">state()</a></code></td>
<td>Создает именованный набор стилей CSS, который следует применять при успешном переходе в заданное состояние. На состояние можно затем ссылаться по имени в других анимационных функциях. </td>
</tr>

<tr>
<td><code>animate()</code></td>
<td>Определяет информацию о времени для перехода. Необязательные значения для <code>delay</code>и <code>easing</code>. Может содержать <code>style()</code>звонки внутри. </td>
</tr>

<tr>
<td><code>transition()</code></td>
<td>Определяет последовательность анимации между двумя именованными состояниями. Использует синтаксис массива. </td>
</tr>

<tr>
<td><code>keyframes()</code></td>
<td>Позволяет последовательно изменять стили в течение указанного интервала времени. Используйте внутри <code>animate()</code>. Может включать несколько <code>style()</code>звонков внутри каждого <code>keyframe()</code>. Использует синтаксис массива. </td>
</tr>

<tr>
<td><code><a href="api/animations/group" class="code-anchor">group()</a></code></td>
<td>Задает группу шагов анимации (внутренних анимаций), которые должны выполняться параллельно. Анимация продолжается только после завершения всех внутренних шагов анимации. Используется внутри <code>sequence()</code>или <code>transition().</code></td>
</tr>

<tr>
<td><code>query()</code></td>
<td>Используйте для поиска одного или нескольких внутренних элементов HTML внутри текущего элемента. </td>
</tr>

<tr>
<td><code>sequence()</code></td>
<td>Определяет список шагов анимации, которые выполняются последовательно, один за другим. </td>
</tr>

<tr>
<td><code>stagger()</code></td>
<td>Поражает время начала анимации для нескольких элементов. </td>
</tr>

<tr>
<td><code>animation()</code></td>
<td>Создает многоразовую анимацию, которую можно вызывать из другого места. Используется вместе с <code>useAnimation()</code>. </td>
</tr>

<tr>
<td><code>useAnimation()</code></td>
<td>Активирует многоразовую анимацию. Используется с <code>animation()</code>. </td>
</tr>

<tr>
<td><code>animateChild()</code></td>
<td>Позволяет запускать анимацию на дочерних компонентах в течение того же периода времени, что и родительский. </td>
</tr>

</table>

{@a more-on-angular-animations}
## Подробнее об Angular анимации

Вы также можете быть заинтересованы в следующих ситуациях :

* [Переход и триггеры](guide/transition-and-triggers)
* [Сложные анимационные последовательности](guide/complex-animation-sequences)
* [Многоразовые анимации](guide/reusable-animations)
* [Анимация перехода маршрута](guide/route-animations)

<div class="alert is-helpful">

Ознакомьтесь с этой полной анимацией [демо](http://animationsftw.in/#/)с сопровождающим [презентация](https://www.youtube.com/watch?v=JhNo3Wvj6UQ&feature=youtu.be&t=2h47m53s), показанной на конференции AngularConnect в ноябре 2017 года
</div>
