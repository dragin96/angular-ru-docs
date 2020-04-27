{@a getting-started-with-angular-forms}
# Начало работы с Angular: Формы

В конце [Управление данными](start/start-data "Getting Started: Managing Data") приложение интернет-магазина имеет каталог товаров и корзину покупок.

В этом разделе рассказывается, как добавить функцию проверки на основе форм, чтобы собирать информацию о пользователях как часть проверки.

{@a forms-in-angular}
## Формы в Angular

Формы в Angular основаны на стандартных HTML-формах, чтобы помочь вам создать пользовательские элементы управления и облегчить процесс проверки. Форма Angular Reactive состоит из двух частей: объектов, которые находятся в компоненте для хранения формы и управления ею, и визуализации формы, которая находится в шаблоне.

{@a define-the-checkout-form-model}
## Определите модель формы оформления заказа

Сначала настройте модель формы оформления заказа. Модель формы, определенная в классе компонентов, является источником правды для статуса формы.

1. открыто `cart.component.ts`.

1. Angular's `FormBuilder` предоставляет удобные методы для генерации элементов управления. Как и другие услуги, которые вы использовали, вам нужно импортировать и внедрить услугу, прежде чем вы можете использовать его:

    1. Импортировать `FormBuilder` от `@angular/forms` пакет.

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
      </code-example>

 `ReactiveFormsModule` предоставляет `FormBuilder`, который `AppModule` (в `app.module.ts`) уже импортирует.

    1. Введите `FormBuilder`.

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
      </code-example>

1. Все еще в `CartComponent` Класс, определите `checkoutForm` Свойство для хранения модели формы.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form">
    </code-example>

1. Чтобы собрать имя пользователя и адрес, установите `checkoutForm` Свойство с моделью формы, содержащей `name` и `address` поля, используя `FormBuilder` `group()` метод. Добавьте это между фигурными скобками, `{}`,
конструктора.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. Для оформления заказа пользователям необходимо указать свое имя и адрес. Когда они отправят свой заказ, форма должна быть сброшена, и корзина должна очиститься.

    1. В `cart.component.ts`, определить `onSubmit()` для обработки формы. Использовать `CartService` `clearCart()` для элементов корзины и сброса формы после ее отправки. В реальном приложении этот метод также передает данные на внешний сервер. Весь класс телега компонент выглядит следующим образом :

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
    </code-example>

Теперь, когда вы определили модель формы в классе компонентов, вам нужна форма проверки, чтобы отразить модель в представлении.

{@a create-the-checkout-form}
## Создайте форму заказа

Используйте следующие шаги, чтобы добавить форму оформления заказа внизу страницы «Корзина».

1. открыто `cart.component.html`.

1. Внизу шаблона добавьте HTML-форму для сбора информации о пользователе.

1. Использовать `formGroup` свойства для привязки `checkoutForm` на `form` тега в шаблоне. Также добавьте кнопку «Купить», чтобы отправить форму.

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

1. На `form` тег, используйте `ngSubmit` события для прослушивания формы и вызова `onSubmit()` с `checkoutForm` значение.

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

1. Добавить поля ввода для `name` и `address` . Использовать `formControlName` атрибута для привязки `checkoutForm` элементы управления для `name` и `address` к их полям ввода. Окончательный полный компонент выглядит следующим образом :

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

После ввода нескольких элементов в корзине, теперь пользователи могут просматривать свои элементы, введите свое имя и адрес, и представить их покупку:

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="Cart page with checkout form">
</div>

Чтобы подтвердить отправку, откройте консоль, где вы должны увидеть объект, содержащий имя и адрес, который вы отправили.

{@a next-steps}
## Следующие шаги

Поздравляем! У вас есть полное приложение интернет-магазина с каталогом товаров, корзиной для покупок и функцией оформления заказа.

[Перейти к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment") перейти к локальной разработке или развернуть приложение на Firebase или на своем собственном сервере.
