{@a getting-started-with-angular-forms}
# Начало работы с Angular: Формы

В конце раздела [Управление данными](start/start-data "Getting Started: Managing Data") приложение интернет-магазина состоит из каталога товаров и корзины покупок.

В этом разделе рассказывается, как добавить функцию оформления заказа с помощью форм, чтобы получать информацию о пользователях.

{@a forms-in-angular}
## Формы в Angular

Формы в Angular основаны на стандартных HTML-формах, чтобы помочь вам создавать пользовательские элементы управления и облегчить процесс валидации. Angular Reactive форма состоит из двух частей: объектов, которые находятся в компоненте для хранения и управления формой, и визуализации формы, которая находится в шаблоне.

{@a define-the-checkout-form-model}
## Определение модели формы оформления заказа

Сначала настройте модель формы оформления заказа. Модель формы, определенная в классе компонентов, является источником правды для статуса формы.

1. Откройте `cart.component.ts`.

1. Angular `FormBuilder` предоставляет удобные методы для генерации элементов управления. Как и другие сервисы, которые вы использовали ранее, вам нужно импортировать и внедрить сервис, прежде чем вы сможете его использовать:

    1. Импортируйте `FormBuilder` из пакета `@angular/forms`.

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="imports">
      </code-example>

 `ReactiveFormsModule` предоставляет `FormBuilder`, который `AppModule` (в `app.module.ts`) уже импортирует.

    1. Внедрите `FormBuilder`.

      <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="inject-form-builder">
      </code-example>

1. Также в классе `CartComponent`, объявите свойство `checkoutForm` для хранения модели формы.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form">
    </code-example>

1. Чтобы сохранять имя пользователя и адрес, определите свойство `checkoutForm`, используя метод `FormBuilder` `group()`. Добавьте поля `name` и `address` между фигурными скобками `{}`
в конструкторе.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts" region="checkout-form-group"></code-example>

1. Для оформления заказа пользователям необходимо указать свое имя и адрес. Когда они отправят свой заказ, форма должна быть сброшена, и корзина должна очиститься.

    1. В `cart.component.ts`, определите метод `onSubmit()` для обработки формы. Используйте метод `CartService` `clearCart()` для очищения корзины и сброса формы после ее отправки. В реальном приложении этот метод также передает данные на внешний сервер. Весь класс компонента корзины выглядит следующим образом:

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.ts">
    </code-example>

Теперь, когда вы определили модель формы в классе компонента, вам нужна форма заказа, чтобы отразить модель в представлении.

{@a create-the-checkout-form}
## Создание формы заказа

Используйте следующие шаги, чтобы добавить форму оформления заказа внизу страницы «Cart».

1. Откройте `cart.component.html`.

1. Внизу шаблона добавьте HTML-форму для сбора информации о пользователе.

1. Используйте свойство `formGroup` тэга `form` в шаблоне для привязки `checkoutForm`. Также добавьте кнопку «Buy», чтобы отправить форму.

  <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.3.html" region="checkout-form">
  </code-example>

2. У тэга `form` используйте событие `ngSubmit` для прослушивания формы и вызова метода `onSubmit()` со значением `checkoutForm.value`.

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html (cart component template detail)" region="checkout-form-1">
  </code-example>

3. Добавьте поля ввода для `name` и `address`. Используйте аттрибут `formControlName` для привязки элементов управления `checkoutForm` `name` и `address` к их полям ввода. Конечный код компонента выглядит следующим образом:

  <code-example path="getting-started/src/app/cart/cart.component.html" header="src/app/cart/cart.component.html" region="checkout-form-2">
  </code-example>

Теперь, после добавления нескольких товаров в корзину, пользователи могут просматривать свои товары, вводить свое имя и адрес, оформлять покупку:

<div class="lightbox">
  <img src='generated/images/guide/start/cart-with-items-and-form.png' alt="Cart page with checkout form">
</div>

Чтобы проверить отправку данных формы, откройте консоль, где вы должны увидеть объект, содержащий имя и адрес, который вы отправили.

{@a next-steps}
## Следующие шаги

Поздравляем! У вас есть полное приложение интернет-магазина с каталогом товаров, корзиной для покупок и функцией оформления заказа.

[Перейти к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment"), чтобы развернуть приложение в Firebase или перейти к локальной разработке.
