{@a getting-started-with-angular-managing-data}
# Начало работы с Angular: Управление данными

В конце предыдущего раздела [Маршрутизация](start/start-routing "Getting Started: Routing"), приложение интернет-магазина состоит из каталога товаров с двумя представлениями: список товаров и информация о товаре.
Пользователи могут щелкнуть по названию товара в списке, чтобы просмотреть подробности в новом представлении с отдельным URL-адресом или маршрутом.

В этом разделе вы добавите корзину покупок в три этапа:

* Обновите страницу информации о товаре, добавив кнопку «Buy», которая добавляет текущий товар в список товаров, которыми управляет сервис корзины.
* Добавите компонент корзины, который отображает товары в корзине.
* Добавите компонент доставки, который получает стоимость доставки для товаров в корзине, используя Angular сервис `HttpClient` для получения данных о доставке из `.json` файла.

{@a services}
## Сервисы

Сервисы являются неотъемлемой частью Angular приложений. В Angular, сервис - это экземпляр класса, который вы можете сделать доступным для любой части вашего приложения, используя [систему внедрения зависимостей](guide/glossary#dependency-injection-di "dependency injection definition") Angular.

Сервисы - это место, где вы обмениваетесь данными между частями вашего приложения. Для интернет-магазина сервис корзины - это место, где вы храните данные и методы вашей корзины.

{@a create-cart-service}
{@a create-the-shopping-cart-service}
## Создание сервиса корзины покупок

До этого момента пользователи могли просматривать информацию о товаре,
симулировать функционал "Поделиться товаром" и получать уведомления об изменениях товара.
Но они не могли покупать товары.

В этом разделе вы добавите кнопку «Buy» к товару
на странице информации о товаре и настроите сервис корзины для хранения информации
о товарах в корзине.

<div class="alert is-helpful">

Позже, раздел руководства [Использование форм для ввода данных пользователем](start/start-forms "Getting Started: Forms") поможет вам получить доступ к этому сервису корзины из представления, где пользователь оформляет заказ.

</div>

{@a generate-cart-service}
{@a define-a-cart-service}
### Определение сервиса корзины

1. Создайте сервис корзины.

    1. Щелкните правой кнопкой мыши по папке `app`, выберите `Angular Generator`, затем `Service` . Назовите новый сервис `cart`.

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    2. StackBlitz может генерировать `@Injectable()` без `{ providedIn: 'root' }` оператора как выше. Вместо этого генератор по умолчанию импортирует сервис корзины в `app.module.ts`. Для целей
    этого урока, так или иначе работает. Синтаксис `@Injectable()` `{ providedIn: 'root' }` касается понятия [tree shaking](/guide/dependency-injection-providers#tree-shakable-providers), что выходит за рамки данного руководства.

2. В классе `CartService`, определите свойство `items` для хранения массива текущих товаров в корзине.

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="props"></code-example>

3. Определите методы для добавления товаров в корзину, получения товаров в корзине и очистки корзины:

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="methods"></code-example>

    * `addToCart()` добавляет товар в массив `items`.

    * `getItems()` получает товары, добавленные пользователями в корзину, и возвращает каждый товар с соответствующим количеством.

    * `clearCart()` возвращает пустой массив.

{@a product-details-use-cart-service}
{@a use-the-cart-service}
### Использование сервиса корзины

В этом разделе рассказывается, как воспользоваться сервисом корзины, чтобы добавить товар в корзину с помощью кнопки «Buy».

1. Откройте `product-details.component.ts`.

1. Настройте компонент для использования сервиса корзины.

    1. Импортируйте сервис корзины.

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    2. Добавьте сервис корзины в `constructor()`.

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!--
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

2. Определите `addToCart()`, который добавляет текущий товар в корзину.

 Метод `addToCart()` делает следующие три вещи:
    * Получает текущий `product`.
    * Использует метод корзины `addToCart()` для добавления товара в корзину.
    * Отображает сообщение о том, что товар добавлен в корзину.

    <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

3. Обновите шаблон информации о товаре с помощью кнопки «Buy», которая добавляет текущий товар в корзину.

    1. Откройте `product-details.component.html`.

    2. Добавьте кнопку с текстом «Buy» и привяжите событие `click()` к методу `addToCart()`:

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>

4. Чтобы увидеть новую кнопку «Buy», обновите приложение и нажмите на название товара, чтобы отобразить его информацию.

    <div class="lightbox">
      <img src='generated/images/guide/start/product-details-buy.png' alt="Display details for selected product with a Buy button">
    </div>

 1. Нажмите кнопку «Buy», чтобы добавить товар в сохраненный список товаров в корзине и отобразить подтверждающее сообщение.

    <div class="lightbox">
      <img src='generated/images/guide/start/buy-alert.png' alt="Display details for selected product with a Buy button">
    </div>


{@a create-the-cart-page}
## Создание страницы корзины

На этом этапе пользователи могут добавлять товары в корзину, нажимая «Buy», но они пока не видят свою корзину.

Создайте страницу корзины в два этапа:

1. Создайте компонент корзины и настройте маршрутизацию к новому компоненту. На этом этапе на странице корзины будет только текст по умолчанию.
1. Покажите элементы корзины.

{@a set-up-the-component}
### Настройте компонент

Чтобы создать страницу корзины, начните с тех же шагов, которые вы сделали для создания компонента информации о товаре и настройки маршрутизации для нового компонента.

1. Создайте компонент корзины с именем `cart`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши по папке `app`, выберите `Angular Generator`, затем `Component`.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. Добавьте маршрутизацию (шаблон URL) для компонента корзины.

    Откройте `app.module.ts` и добавьте маршрут для компонента `CartComponent`, со значением свойства `path` - `cart` :

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

2. Обновите кнопку «Checkout», чтобы она направляла к URL `/cart`

    Откройте `top-bar.component.html` и добавьте директиву `routerLink` со значением `/cart`.

    <code-example
        header="src/app/top-bar/top-bar.component.html"
        path="getting-started/src/app/top-bar/top-bar.component.html"
        region="cart-route">
    </code-example>

3. Чтобы увидеть новый компонент корзины, нажмите кнопку «Checkout». Вы увидите текст по умолчанию "cart works!", и то, что URL имеет шаблон `https://getting-started.stackblitz.io/cart`, где `getting-started.stackblitz.io` может отличаться для вашего проекта StackBlitz.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-works.png' alt="Display cart page before customizing">
    </div>

{@a display-the-cart-items}
### Отображение товаров корзины

Вы можете использовать сервис для обмена данных между компонентами:

* Компонент информации о товаре уже использует сервис корзины для добавления товаров в корзину.
* В этом разделе показано, как использовать сервис корзины для отображения товаров в корзине.


1. Откройте `cart.component.ts`.

1. Настройте компонент для использования сервиса корзины.

    1. Импортируйте `CartService` из файла `cart.service.ts`.

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. Добавьте `CartService` в конструктор, чтобы компонент корзины мог его использовать.

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="inject-cart">
        </code-example>

1. Определите свойство `items` для хранения товары в корзине.

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="items">
    </code-example>

1. Установите этому свойству значение, используя метод сервиса корзины `getItems()`. Напомним, что вы определили этот метод [когда создавали `cart.service.ts`](#generate-cart-service).

    В итоге, класс `CartComponent` выглядит следующим образом :

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" header="src/app/cart/cart.component.ts" region="props-services">
    </code-example>

1. Обновите шаблон, добавьте заголовок и используйте `<div>` с `*ngFor` для отображения каждого элемента корзины с его названием и ценой.

    В итоге, класс `CartComponent` выглядит следующим образом :

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. Проверьте свой компонент корзины.

    1. Нажмите «My Store», чтобы перейти на страницу со списком товаров.
    1. Нажмите на название товара, чтобы отобразить его детальную информацию.
    1. Нажмите «Buy», чтобы добавить товар в корзину.
    1. Нажмите «Checkout», чтобы увидеть корзину.
    1. Чтобы добавить другой товар, нажмите «My Store», чтобы вернуться к списку товаров.

  Повторите, чтобы добавить больше товаров в корзину.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-page-full.png' alt="Cart page with products added">
    </div>


<div class="alert is-helpful">

Совет от StackBlitz: при каждом обновлении предварительного просмотра, корзина очищается. Если вы внесете изменения в приложение, страница обновится, поэтому вам нужно будет снова покупать товары, чтобы заполнить корзину.

</div>

<div class="alert is-helpful">

Для получения дополнительной информации о сервисах см. [Введение в службы и внедрение зависимостей](guide/architecture-services "Architecture > Intro to Services and DI").

</div>


{@a retrieve-shipping-prices}
## Получение стоимости доставки
<!-- Accessing data with the HTTP client -->

Серверы часто возвращают данные в виде потока.
Потоки полезны, потому что они позволяют легко преобразовывать возвращаемые данные и вносить изменения в способ запроса этих данных.
Angular HTTP-клиент, `HttpClient` - это встроенный способ извлечения данных из внешних API и предоставления их вашему приложению в виде потока.

В этом разделе показано, как использовать HTTP-клиент для получения стоимости доставки из внешнего файла.

{@a predefined-shipping-data}
### Предопределенные данные доставки

Приложение, которое StackBlitz создает для этого руководства, поставляется с предопределенными данными о доставке в `assets/shipping.json`.
Используйте эти данные, чтобы добавить стоимость доставки для товаров в корзине.

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


{@a use-httpclient-in-the-appmodule}
### Использование `HttpClient` в `AppModule`

Прежде чем вы сможете использовать HTTP-клиент Angular, вы должны настроить свое приложение на использование `HttpClientModule`.

Angular's `HttpClientModule` должен использовать единственный экземпляр `HttpClient` по всему вашему приложению.

1. Откройте `app.module.ts`.

  Этот файл содержит импорт и функциональность, доступные для всего приложения.

2. Импортируйте `HttpClientModule` из пакета `@angular/common/http` в верхней части файла вместе с другими импортными. Поскольку существует ряд других импортов, этот фрагмент кода для краткости опускает их. Не забудьте оставить существующие импорты на месте.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

3. Добавьте `HttpClientModule` в `AppModule` `@NgModule()` в массив `imports`, для глобальной регистрации Angular's `HttpClient`.

    <code-example path="getting-started/src/app/app.module.ts" header="src/app/app.module.ts" region="http-client-module">
    </code-example>

{@a use-httpclient-in-the-cart-service}
### Использование `HttpClient` в корзине сервиса

Теперь, когда `AppModule` импортирует `HttpClientModule`, следующим шагом является внедрение `HttpClient` в вашем сервисе, так что ваше приложение сможет получать данные и взаимодействовать с внешними API и ресурсами.


1. Откройте `cart.service.ts`.

1. Импортируйте `HttpClient` из пакета `@angular/common/http`.

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

2. Добавьте `HttpClient` в конструктор `CartService`:

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="inject-http">
    </code-example>


{@a define-the-get-method}
### Определите `get()` метод

Несколько компонентов могут использовать один и тот же сервис.
Далее в этом руководстве компонент доставки использует сервис корзины для получения данных о доставке по HTTP из файла `shipping.json`.
Сначала определите `get()` метод

1. Продолжайте работать в `cart.service.ts`.

2. Ниже `clearCart()`, определите новый метод `getShippingPrices()` который использует метод `get()` из `HttpClient` для получения данных о доставке.

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

Для получения дополнительной информации об Angular's `HttpClient`, см. [HttpClient](guide/http "HttpClient guide").

</div>

{@a define-the-shipping-page}
## Определение страницы доставки

Теперь, когда ваше приложение может получать данные о доставке, создайте компонент и шаблон доставки.

1. Создайте новый компонент с именем `shipping`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши по папке `app`, выберите `Angular Generator `, затем ` Component`.

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. В `app.module.ts`, добавьте маршрут для компонента доставки. Укажите значение свойства `path` - `shipping` и `component` - `ShippingComponent`.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    Пока еще нет ссылки на новый компонент доставки, но вы можете увидеть его шаблон на панели предварительного просмотра, введя URL, который указывает его маршрут. URL имеет шаблон: `https://getting-started.stackblitz.io/shipping` где `getting-started.stackblitz.io` может отличаться для вашего проекта StackBlitz.

1. Измените компонент доставки, чтобы он использовал сервис корзины для получения данных об отправке по HTTP из файла `shipping.json`.

    1. Импортируйте сервис корзины.

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. Определите свойство `shippingCosts` .

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. Добавьте сервис корзины в конструктор `ShippingComponent`:

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. Установите значение свойства `shippingCosts`, используя метод `getShippingPrices()` из сервиса корзины.

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. Обновите шаблон компонента доставки. Чтобы отобразить типы доставки и стоимость, используйте `async` пайп:

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

 `async` возвращает последнее значение из потока данных и продолжает делать это в течение срока службы данного компонента. Когда Angular уничтожает этот компонент, `async` пайп автоматически останавливается. Для получения подробной информации об `async` пайпе, см. [документация по AsyncPipe API](/api/common/AsyncPipe).

1. Добавьте ссылку со страницы корзины на страницу доставки:

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. Проверьте ваш компонент

    Нажмите кнопку «Checkout», чтобы увидеть обновленную корзину. Помните, что при изменении приложения предварительный просмотр обновляется, что приводит к очищению корзины.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="Cart with link to shipping prices">
    </div>

    Нажмите на ссылку, чтобы перейти к стоимости доставки.

    <div class="lightbox">
      <img src='generated/images/guide/start/shipping-prices.png' alt="Display shipping prices">
    </div>


{@a next-steps}
## Следующие шаги

Поздравляем! У вас есть приложение интернет-магазина с каталогом товаров и корзиной покупок. Вы также можете найти и показать стоимость доставки.

Чтобы продолжить изучение Angular, выберите один из следующих вариантов:
* [Перейдите к разделу «Формы»](start/start-forms "Getting Started: Forms"), чтобы завершить приложение, добавив страницу корзины покупок и форму заказа.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment"), чтобы развернуть приложение в Firebase или перейти к локальной разработке.
