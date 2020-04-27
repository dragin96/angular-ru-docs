{@a component-interaction}
# Взаимодействие компонентов

{@a top}

Эта кулинарная книга содержит рецепты общих сценариев взаимодействия компонентов
в котором два или более компонентов обмениваются информацией.
{@a toc}

<!--

# Contents

* [Pass data from parent to child with input binding](guide/component-interaction#parent-to-child)
* [Intercept input property changes with a setter](guide/component-interaction#parent-to-child-setter)
* [Intercept input property changes with `ngOnChanges()` ](guide/component-interaction#parent-to-child-on-changes)
* [Parent calls an `@ViewChild()` ](guide/component-interaction#parent-to-view-child)
* [Parent and children communicate via a service](guide/component-interaction#bidirectional-service)

-->

**Увидеть<live-example name="component-interaction">**,

{@a parent-to-child}

{@a pass-data-from-parent-to-child-with-input-binding}
## Передача данных от родителя к потомку с привязкой ввода

 `HeroChildComponent` имеет два ***входных свойства***,
как правило, украшен [@Input украшения](guide/template-syntax#inputs-outputs).


<code-example path="component-interaction/src/app/hero-child.component.ts" header="component-interaction/src/app/hero-child.component.ts">

</code-example>



Секунда `@Input` псевдоним имени свойства дочернего компонента `masterName` as `'master'`.

 `HeroParentComponent ` ребенка ` HeroChildComponent ` внутри ` *ngFor` повторителя
привязывая его `master` свойство строки для ребенка `master` псевдоним
и каждая итерация `hero` пример ребенку `hero` собственность.


<code-example path="component-interaction/src/app/hero-parent.component.ts" header="component-interaction/src/app/hero-parent.component.ts">

</code-example>



Работает приложение отображает три героя:


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/parent-to-child.png" alt="Parent-to-child">
</div>



<h3 class="no-toc">Проверьте это </h3>

Е2Е тест, чтобы все дети были экземпляры и отображаются, как и ожидалось:


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)

{@a parent-to-child-setter}

{@a intercept-input-property-changes-with-a-setter}
## Перехватывать изменения входных свойств с помощью установщика

Используйте установщик входного свойства, чтобы перехватить и воздействовать на значение от родителя.

Сеттер из `name` входного свойства в дочернем элементе `NameChildComponent` 
удаляет пробелы из имени и заменяет пустое значение текстом по умолчанию.


<code-example path="component-interaction/src/app/name-child.component.ts" header="component-interaction/src/app/name-child.component.ts">

</code-example>



Вот `NameParentComponent` демонстрирует изменения имен, включая имя со всеми пробелами:


<code-example path="component-interaction/src/app/name-parent.component.ts" header="component-interaction/src/app/name-parent.component.ts">

</code-example>



<div class="lightbox">
  <img src="generated/images/guide/component-interaction/setter.png" alt="Parent-to-child-setter">
</div>



<h3 class="no-toc">Проверьте это </h3>

E2E тесты проверяют входную собственность сеттера с пустыми и не пустыми именами:


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-setter" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)

{@a parent-to-child-on-changes}

{@a intercept-input-property-changes-with-*ngonchanges*}
## Перехватывать изменения входных свойств с помощью *ngOnChanges ()*

Обнаруживать и воздействовать на изменения значений входных свойств с помощью `ngOnChanges() ` метода ` OnChanges` жизненного цикла.

<div class="alert is-helpful">



Вы можете предпочесть этот подход установщику свойств при просмотре нескольких взаимодействующих входных свойств.

Узнать о `ngOnChanges()` в [Хуки жизненного цикла](guide/lifecycle-hooks)главе.

</div>



Эта `VersionChildComponent` обнаруживает изменения в `major` и `minor` входные свойства и компонует сообщение журнала отчеты этих изменений:


<code-example path="component-interaction/src/app/version-child.component.ts" header="component-interaction/src/app/version-child.component.ts">

</code-example>



 `VersionParentComponent ` предоставляет ` minor ` и ` major` значения и привязывает кнопки к методам, которые их изменяют.


<code-example path="component-interaction/src/app/version-parent.component.ts" header="component-interaction/src/app/version-parent.component.ts">

</code-example>



Вот вывод из последовательности кнопок толкания:


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/parent-to-child-on-changes.gif" alt="Parent-to-child-onchanges">
</div>



<h3 class="no-toc">Проверьте это </h3>

Проверьте, что ***оба*** входных свойства установлены изначально, и что нажатия кнопки запускаются
ожидаемый `ngOnChanges` вызовов и значение:


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="parent-to-child-onchanges" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)

{@a child-to-parent}

{@a parent-listens-for-child-event}
## Родитель прислушивается к дочернему событию

Дочерний компонент предоставляет `EventEmitter` Свойство с которым оно `emits` события, когда что-то происходит.
Родитель связывается с этим свойством события и реагирует на эти события.

Ребенок `EventEmitter` свойства является ***выходным свойством***,
  как правило, украшен [@Output украшение](guide/template-syntax#inputs-outputs)
  как видно из этого `VoterComponent` :


<code-example path="component-interaction/src/app/voter.component.ts" header="component-interaction/src/app/voter.component.ts">

</code-example>



Нажатие на кнопку запускает эмиссию `true` или `false`, логическая *полезная нагрузка*.

Родитель `VoteTakerComponent` связывает обработчик событий с именем `onVoted()` который отвечает на дочернее событие
полезная нагрузка `$event` и обновляет счетчик.


<code-example path="component-interaction/src/app/votetaker.component.ts" header="component-interaction/src/app/votetaker.component.ts">

</code-example>



Каркас передает аргумент события, представленный `$event` - в метод обработчика
и метод обрабатывает его:


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/child-to-parent.gif" alt="Child-to-parent">
</div>



<h3 class="no-toc">Проверьте это </h3>

Проверьте, что нажав на *СОГЛАСНЫ* и не *согласные* кнопки обновить соответствующие счетчики:


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="child-to-parent" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)



{@a parent-interacts-with-child-via-*local-variable*}
## Родитель взаимодействует с ребенком через *локальную переменную*

Родительский компонент не может использовать привязку данных для чтения дочерних свойств.
или вызвать дочерние методы. Вы можете сделать оба
путем создания ссылочной переменной шаблона для дочернего элемента
а затем сослаться на эту переменную *в родительском шаблоне*
как видно в следующем примере.

{@a countdown-timer-example}
Ниже ребенок `CountdownTimerComponent` который многократно отсчитывает до нуля и запускает ракету.
Оно имеет `start` и `stop` методы, которые управляют часами, и это отображает
сообщение о состоянии отсчета в своем собственном шаблоне.

<code-example path="component-interaction/src/app/countdown-timer.component.ts" header="component-interaction/src/app/countdown-timer.component.ts">

</code-example>



 `CountdownLocalVarParentComponent` что хосты компонент таймер следующим образом :


<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="lv" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



Родительский компонент не может привязывать данные к дочернему
 `start ` и ` stop` методы, ни его `seconds` свойство.

Вы можете разместить локальную переменную, `#timer`, на теге `<countdown-timer>` представляющий дочерний компонент.
Это дает вам ссылку на дочерний компонент и возможность доступа
*любые его свойства или методы* из родительского шаблона.

Этот пример связывает родительские кнопки с дочерними `start` и `stop` и
использует интерполяцию для отображения `seconds` свойство.

Здесь мы видим, как родитель и ребенок работают вместе.


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/countdown-timer-anim.gif" alt="countdown timer">
</div>



{@a countdown-tests}


<h3 class="no-toc">Проверьте это </h3>

Проверьте, что секунды отображаются в родительском шаблоне
сопоставьте секунды, отображаемые в сообщении о состоянии ребенка.
Тест также, что при нажатии на *Stop* кнопки останавливает таймер обратного отсчета:


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="countdown-timer-tests" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)

{@a parent-to-view-child}

{@a parent-calls-an-@viewchild}
## Родитель вызывает _@ ViewChild () _

*Локальная переменная* подход является простой и легкой. Но это ограничено, потому что
Родительско-дочернее соединение должно быть полностью выполнено в родительском шаблоне.
Сам родительский компонент *не* имеет доступа к дочернему.

Вы не можете использовать *локальную переменную* технику, если экземпляр родительского компонента *класса*
должен читать или записывать значения дочерних компонентов или должен вызывать методы дочерних компонентов.

Когда родительский компонент *класс* требует такого рода доступ
***инъекционные*** дочерний компонент в родительский как*ViewChild *.

Следующий пример иллюстрирует эту технику с тем же
[Таймер обратного отсчета](guide/component-interaction#countdown-timer-example)пример.
Ни его внешний вид, ни его поведение не изменится.
Дочерний [элемент CountdownTimerComponent](guide/component-interaction#countdown-timer-example)тоже самое.

<div class="alert is-helpful">



Переход от *локальной переменной* к *ViewChild* технике
исключительно для демонстрации.

</div>



Вот родитель, `CountdownViewChildParentComponent` :

<code-example path="component-interaction/src/app/countdown-parent.component.ts" region="vc" header="component-interaction/src/app/countdown-parent.component.ts">

</code-example>



Требуется немного больше работы, чтобы получить дочернее представление в родительского компонента *класс*.

Во-первых, вы должны импортировать ссылки на `ViewChild` декоратор и `AfterViewInit` жизненного цикла.

Далее вводите ребенку `CountdownTimerComponent` в частном `timerComponent` свойство
через `@ViewChild` свойство украшения.

 `#timer` переменная ушла из метаданных компонента.
Вместо этого свяжите кнопки с собственным родительским компонентом `start` и `stop` методы и
представить тикающие секунды в интерполяции вокруг родительского компонента `seconds` метод.

Эти методы напрямую обращаются к внедренному компоненту таймера.

 `ngAfterViewInit()` жизненного цикла - важная проблема.
Компонент таймера не доступен, пока *после* Angular дисплеев родительского вида.
Так это отображает `0` секунд изначально.

Тогда Angular вызывает `ngAfterViewInit` жизненного цикла когда уже *слишком поздно*
обновить отображение родительского представления секунд отсчета.
Правило однонаправленного потока данных Angular предотвращает обновление родительского представления
в том же цикле. Приложение должно *подождать один ход,* прежде чем оно сможет отображать секунды.

использование `setTimeout()` чтобы подождать один тик, а затем пересмотреть `seconds()` метод так
что он принимает будущие значения от компонента таймера.

<h3 class="no-toc">Проверьте это </h3>

Используйте [те же тесты таймера обратного отсчета](guide/component-interaction#countdown-tests)что и раньше.

[Вернуться к началу](guide/component-interaction#top)

{@a bidirectional-service}

{@a parent-and-children-communicate-via-a-service}
## Родитель и дети общаются через службу

Родительский компонент и его дочерние элементы совместно используют службу, интерфейс которой обеспечивает двунаправленную связь
*в семье*.

Область действия экземпляра службы - родительский компонент и его дочерние элементы.
Компоненты вне этого поддерева компонентов не имеют доступа к сервису или их связи.

Эта `MissionService` соединяет `MissionControlComponent` для нескольких `AstronautComponent` детей.


<code-example path="component-interaction/src/app/mission.service.ts" header="component-interaction/src/app/mission.service.ts">

</code-example>



 `MissionControlComponent` обеспечивает экземпляр службы, которой он делится со своими
(сквозь `providers` метаданных массивов) и впрыскивает этот экземпляр в себя через конструктор:


<code-example path="component-interaction/src/app/missioncontrol.component.ts" header="component-interaction/src/app/missioncontrol.component.ts">

</code-example>



 `AstronautComponent` также внедряет сервис в своем конструкторе.
каждый `AstronautComponent` - дитя `MissionControlComponent` поэтому и получает экземпляр службы своего родителя:


<code-example path="component-interaction/src/app/astronaut.component.ts" header="component-interaction/src/app/astronaut.component.ts">

</code-example>



<div class="alert is-helpful">



Обратите внимание, что этот пример фиксирует `subscription` и `unsubscribe()` когда `AstronautComponent` уничтожен.
Это шаг защиты от утечки памяти. Там нет фактического риска в этом приложении, потому что
время жизни `AstronautComponent` - это то же самое, что и время жизни самого приложения.
Это *не* всегда верно в более сложных приложениях.

Вы не добавляете эту охрану к `MissionControlComponent` потому что, как родитель,
он контролирует время жизни `MissionService`.

</div>



Журнал *истории* показывает, что сообщения перемещаются в обоих направлениях
родитель `MissionControlComponent` и `AstronautComponent` детей
облегчается обслуживание:


<div class="lightbox">
  <img src="generated/images/guide/component-interaction/bidirectional-service.gif" alt="bidirectional-service">
</div>



<h3 class="no-toc">Проверьте это </h3>

Тесты нажимают на кнопки обоих родителей `MissionControlComponent` и `AstronautComponent` детей
и убедитесь, что история соответствует ожиданиям


<code-example path="component-interaction/e2e/src/app.e2e-spec.ts" region="bidirectional-service" header="component-interaction/e2e/src/app.e2e-spec.ts">

</code-example>



[Вернуться к началу](guide/component-interaction#top)
