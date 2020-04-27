{@a reusable-animations}
# Многоразовые анимации

{@a prerequisites}
#### Предпосылки

Базовое понимание следующих понятий:

* [Введение в Angular анимацию](guide/animations)
* [Переход и триггеры](guide/transition-and-triggers)

<hr>

Интерфейс [AnimationOptions](https://angular.io/api/animations/AnimationOptions)в Angular-анимациях позволяет создавать анимации, которые можно повторно использовать в различных компонентах.

{@a creating-reusable-animations}
## Создание многоразовых анимаций

Чтобы создать многоразовую анимацию, используйте [ `animation ()` ](https://angular.io/api/animations/animation) способ определить анимацию в отдельном  `.ts` файл и объявить это определение анимации как  `const`  переменная экспорта. Затем вы можете импортировать и повторно использовать эту анимацию в любом из компонентов приложения, используя [ `useAnimation ()` ](https://angular.io/api/animations/useAnimation)API.

<code-example path="animations/src/app/animations.ts" header="src/app/animations.ts" region="reusable" language="typescript"></code-example>

В приведенном фрагменте кода,  `transAnimation`  делается многоразовым, объявляя его как переменную экспорта.

<div class="alert is-helpful">

**Примечание:**  `height `, ` opacity `, ` backgroundColor ` и ` time` входы заменяются во время выполнения.
</div>

Вы можете импортировать многоразовые  `transAnimation`  переменная в вашем классе компонентов и повторно использовать ее, используя  `useAnimation()`  как показано ниже.

<code-example path="animations/src/app/open-close.component.3.ts" header="src/app/open-close.component.ts" region="reusable" language="typescript"></code-example>

{@a more-on-angular-animations}
## Подробнее об Angular анимации

Вы также можете быть заинтересованы в следующих ситуациях :

* [Введение в Angular анимацию](guide/animations)
* [Переход и триггеры](guide/transition-and-triggers)
* [Сложные анимационные последовательности](guide/complex-animation-sequences)
* [Анимация перехода маршрута](guide/route-animations)
