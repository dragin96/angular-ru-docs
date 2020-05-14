{@a getting-started-with-angular-managing-data}
# Начало работы с Angular: Управление данными

В конце [Маршрутизация](start/start-routing "Getting Started: Routing") приложение интернет-магазина имеет каталог товаров с двумя представлениями: список товаров и сведения о товаре.
Пользователи могут щелкнуть название продукта в списке, чтобы просмотреть подробности в новом представлении с отдельным URL-адресом или маршрутом.

Эта страница поможет вам путем создания корзины покупок в три этапа:

* Обновите страницу сведений о продукте, добавив кнопку «Купить», которая добавляет текущий продукт в список продуктов, которыми управляет служба корзины.
* Добавьте компонент корзины, который отображает элементы в корзине.
* Добавьте компонент доставки, который получает цены доставки для элементов в корзине, используя Angular's `HttpClient` для получения данных о доставке из `.json` файл.

{@a services}
## Сервисы

Сервисы являются неотъемлемой частью Angular приложений. В Angular сервис - это экземпляр класса, который вы можете сделать доступным для любой части вашего приложения, используя Angular [система внедрения зависимостей](guide/glossary#dependency-injection-di "dependency injection definition").

Сервисы - это место, где вы обмениваетесь данными между частями вашего приложения. Для интернет-магазина услуга корзины - это место, где вы храните данные и методы вашей корзины.

{@a create-cart-service}
{@a create-the-shopping-cart-service}
## Создать сервис корзины покупок

До этого момента пользователи могут просматривать информацию о продукте и
симулировать совместное использование и получать уведомления об изменениях продукта.
Однако они не могут покупать продукты.

В этом разделе вы добавляете кнопку «Купить» к товару
страница сведений и настройка службы корзины для хранения информации
о продуктах в корзине.

<div class="alert is-helpful">

Позже, [Формы](start/start-forms "Getting Started: Forms") часть
это руководство поможет вам получить доступ к этой услуге корзины
со страницы, где пользователь проверяет.

</div>

{@a generate-cart-service}
{@a define-a-cart-service}
### Определите сервис корзины

1. Создайте сервис корзины.

    1. Щелкните правой кнопкой мыши на `app` папку, выберите `Angular Generator` и выберите `Service` . Назовите новый сервис `cart`.

        <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.1.ts"></code-example>

    1. StackBlitz может генерировать `@Injectable()` без `{ providedIn: 'root' }` оператора как выше. Вместо этого генератор предоставляет услугу корзины в `app.module.ts` по умолчанию. Для целей
    этого урока, так или иначе работает. `@Injectable()` `{ providedIn: 'root' }` синтаксис [встряхивание дерева](/guide/dependency-injection-providers#tree-shakable-providers), что выходит за рамки данного руководства.

1. В классе `CartService`, определить свойство `items` для хранения массива текущих товаров в корзине.

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="props"></code-example>

1. Определение методов для добавления элементов в корзину, вернуть корзины товаров и очистить корзины товаров:

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="methods"></code-example>

    * `addToCart()` добавляет продукт в массив `items`.

    * `getItems()` Метод собирает элементы, добавленные пользователями в корзину, и возвращает каждый элемент с соответствующим количеством.

    * `clearCart()` возвращает пустой массив элементов.

{@a product-details-use-cart-service}
{@a use-the-cart-service}
### Воспользуйтесь услугой корзины

В этом разделе рассказывается, как воспользоваться услугой корзины, чтобы добавить товар в корзину с помощью кнопки «Купить».

1. открыто `product-details.component.ts`.

1. Настройте компонент для использования службы корзины.

    1. Импортируйте услугу корзины.

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service">
        </code-example>

    1. Добавьте услугу корзины, добавив ее в `constructor()`.

        <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="inject-cart-service">
        </code-example>

        <!--
        To do: Consider defining "inject" and describing the concept of "dependency injection"
        -->

1. Определите `addToCart()`, который добавляет текущий продукт в корзину.

 `addToCart()` метод делает следующие три вещи:
    * Получает текущий `product`.
    * Использует услугу корзины `addToCart()` для добавления товара в корзину.
    * Отображает сообщение о том, что вы добавили товар в корзину.

    <code-example path="getting-started/src/app/product-details/product-details.component.ts" header="src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

1. Обновите шаблон сведений о товаре с помощью кнопки «Купить», которая добавляет текущий товар в корзину.

    1. открыто `product-details.component.html`.

    1. Добавьте кнопку с надписью «Купить» и привяжите `click()` событие для `addToCart()` Метод:

        <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html">
        </code-example>

1. Чтобы увидеть новую кнопку «Купить», обновите приложение и нажмите на название продукта, чтобы отобразить его детали.

    <div class="lightbox">
      <img src='generated/images/guide/start/product-details-buy.png' alt="Display details for selected product with a Buy button">
    </div>

 1. Нажмите кнопку «Купить», чтобы добавить товар в сохраненный список товаров в корзине и отобразить подтверждающее сообщение.

    <div class="lightbox">
      <img src='generated/images/guide/start/buy-alert.png' alt="Display details for selected product with a Buy button">
    </div>


{@a create-the-cart-page}
## Создайте страницу корзины

На этом этапе пользователи могут добавлять товары в корзину, нажимая «Купить», но они пока не видят свою корзину.

Создание страницы корзины в два этапа:

1. Создайте компонент корзины и настройте маршрутизацию к новому компоненту. На этом этапе на странице корзины будет только текст по умолчанию.
1. Показать элементы корзины.

{@a set-up-the-component}
### Настройте компонент

Чтобы создать страницу корзины, начните с тех же шагов, которые вы сделали для создания компонента сведений о продукте и настройки маршрутизации для нового компонента.

1. Создайте компонент корзины с именем `cart`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши `app` папку, выберите `Angular Generator` и `Component`.

    <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

1. Добавьте маршрутизацию (шаблон URL) для компонента корзины.

    открыто `app.module.ts` и добавьте маршрут для компонента `CartComponent`, с `path` из `cart` :

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route">
    </code-example>

1. Обновите кнопку «Оформить заказ», чтобы она направлялась к `/cart` URL

    открыто `top-bar.component.html` и добавьте `routerLink` директива указывающая на `/cart`.

    <code-example
        header="src/app/top-bar/top-bar.component.html"
        path="getting-started/src/app/top-bar/top-bar.component.html"
        region="cart-route">
    </code-example>

1. Чтобы увидеть новый компонент корзины, нажмите кнопку «Оформить заказ». Вы можете увидеть "Корзина работает!" текст по умолчанию, и URL имеет шаблон `https://getting-started.stackblitz.io/cart`, где `getting-started.stackblitz.io` может отличаться для вашего проекта StackBlitz.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-works.png' alt="Display cart page before customizing">
    </div>

{@a display-the-cart-items}
### Показать элементы корзины

Вы можете использовать услуги для обмена данных по компонентам:

* Компонент сведений о продукте уже использует службу корзины для добавления продуктов в корзину.
* В этом разделе показано, как использовать службу корзины для отображения продуктов в корзине.


1. открыто `cart.component.ts`.

1. Настройте компонент для использования службы корзины.

    1. Импортировать `CartService` от `cart.service.ts` файл.

        <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports">
        </code-example>

    1. Введите `CartService` чтобы компонент корзины мог его использовать.

        <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="inject-cart">
        </code-example>

1. Определите `items` свойство хранить товары в корзине.

    <code-example path="getting-started/src/app/cart/cart.component.2.ts" header="src/app/cart/cart.component.ts" region="items">
    </code-example>

1. Установите элементы, используя сервис корзины `getItems()` метод. Напомним, что вы определили этот метод [когда вы генерировали `cart.service.ts`](#generate-cart-service).

    Результирующий `CartComponent` класс выглядит следующим образом :

    <code-example path="getting-started/src/app/cart/cart.component.3.ts" header="src/app/cart/cart.component.ts" region="props-services">
    </code-example>

1. Обновите шаблон с заголовком и используйте `<div>` с `*ngFor` отображения каждого элемента корзины с его названия и цены.

    Результирующий `CartComponent` шаблон выглядит следующим образом :

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices">
    </code-example>

1. Проверьте свой компонент корзины.

    1. Нажмите «Мой магазин», чтобы перейти на страницу со списком товаров.
    1. Нажмите на название продукта, чтобы отобразить его детали.
    1. Нажмите «Купить», чтобы добавить товар в корзину.
    1. Нажмите «Оформить заказ», чтобы увидеть корзину.
    1. Чтобы добавить другой продукт, нажмите «Мой магазин», чтобы вернуться к списку продуктов.

  Повторите, чтобы добавить больше товаров в корзину.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-page-full.png' alt="Cart page with products added">
    </div>


<div class="alert is-helpful">

Совет от StackBlitz: при каждом обновлении предварительного просмотра корзина очищается. Если вы внесете изменения в приложение, страница обновится, поэтому вам нужно будет снова покупать продукты, чтобы заполнить корзину.

</div>

<div class="alert is-helpful">

Для получения дополнительной информации об услугах см. [Введение в службы и внедрение зависимостей](guide/architecture-services "Architecture > Intro to Services and DI").

</div>


{@a retrieve-shipping-prices}
## Получить цены доставки
<!-- Accessing data with the HTTP client -->

Серверы часто возвращают данные в виде потока.
Потоки полезны, потому что они позволяют легко преобразовывать возвращаемые данные и вносить изменения в способ запроса этих данных.
Angular HTTP-клиент, `HttpClient` - это встроенный способ извлечения данных из внешних API и предоставления их вашему приложению в виде потока.

В этом разделе показано, как использовать HTTP-клиент для получения цен доставки из внешнего файла.

{@a predefined-shipping-data}
### Предопределенные данные доставки

Приложение, которое StackBlitz создает для этого руководства, поставляется с предопределенными данными о доставке в `assets/shipping.json`.
Используйте эти данные, чтобы добавить цены доставки для товаров в корзине.

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json">
</code-example>


{@a use-httpclient-in-the-appmodule}
### использование `HttpClient` в `AppModule`

Прежде чем вы сможете использовать HTTP-клиент Angular, вы должны настроить свое приложение на использование `HttpClientModule`.

Angular's `HttpClientModule` регистрирует поставщиков, которым ваше приложение должно использовать один экземпляр `HttpClient` всему вашему приложению.

1. открыто `app.module.ts`.

  Этот файл содержит импорт и функциональные возможности, доступные для всего приложения.

1. Импортировать `HttpClientModule` из `@angular/common/http` Пакет в верхней части файла с другими импортными. Поскольку существует ряд других импортов, этот фрагмент кода для краткости опускает их. Не забудьте оставить существующий импорт на месте.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import">
    </code-example>

1. добавлять `HttpClientModule` для `AppModule` `@NgModule()` `imports` массив для регистрации Angular's `HttpClient` Поставщики во всем мире.

    <code-example path="getting-started/src/app/app.module.ts" header="src/app/app.module.ts" region="http-client-module">
    </code-example>

{@a use-httpclient-in-the-cart-service}
### использование `HttpClient` в корзине сервиса

Теперь, когда `AppModule` импортирует `HttpClientModule`, следующим шагом является внедрение `HttpClient` в вашем сервисе, так что ваше приложение может получать данные и взаимодействовать с внешними API и ресурсами.


1. открыто `cart.service.ts`.

1. Импортировать `HttpClient` от `@angular/common/http` пакет.

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http">
    </code-example>

1. Вводят `HttpClient` в `CartService` конструктор:

    <code-example path="getting-started/src/app/cart.service.ts" header="src/app/cart.service.ts" region="inject-http">
    </code-example>


{@a define-the-get-method}
### Определите `get()` метод

Несколько компонентов могут использовать один и тот же сервис.
Далее в этом руководстве компонент доставки использует службу корзины для получения данных о доставке по HTTP из `shipping.json` файл.
Сначала определите `get()` метод

1. Продолжайте работать в `cart.service.ts`.

1. Ниже `clearCart()`, определить новый `getShippingPrices()` который использует `HttpClient` `get()` Метод для получения данных о доставке.

    <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>


<div class="alert is-helpful">

Для получения дополнительной информации об Angular's `HttpClient`, см. [HttpClient](guide/http "HttpClient guide").

</div>

{@a define-the-shipping-page}
## Определите страницу доставки

Теперь, когда ваше приложение может получать данные о доставке, создайте компонент и шаблон доставки.

1. Создать новый компонент с именем `shipping`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши `app` папку, выберите `Angular Generator ` и ` Component`.

    <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. В `app.module.ts`, добавить маршрут для доставки. Укажите `path` из `shipping` и компонент `ShippingComponent`.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

    Пока еще нет ссылки на новый компонент доставки, но вы можете увидеть его шаблон на панели предварительного просмотра, введя URL, который указывает его маршрут. URL имеет шаблон: `https://getting-started.stackblitz.io/shipping` где `getting-started.stackblitz.io` часть может отличаться для вашего проекта StackBlitz.

1. Измените компонент доставки, чтобы он использовал службу корзины для получения данных об отправке по HTTP из `shipping.json` файл.

    1. Импортируйте услугу корзины.

        <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

    1. Определить `shippingCosts` имущества.

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="props"></code-example>

    1. Внедрить услугу корзины в `ShippingComponent` конструктор:

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

    1. Установить `shippingCosts` свойство используя `getShippingPrices()` из сервиса корзины.

        <code-example path="getting-started/src/app/shipping/shipping.component.ts" header="src/app/shipping/shipping.component.ts" region="ctor"></code-example>

1. Обновите шаблон компонента доставки, чтобы отобразить типы доставки и цены, используя `async` труба:

    <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

 `async` возвращает последнее значение из потока данных и продолжает делать это в течение срока службы данного компонента. Когда Angular уничтожает этот компонент, `async` труба автоматически останавливается. Для получения подробной информации о `async` канал, см. [документация по AsyncPipe API](/api/common/AsyncPipe).

1. Добавить ссылку из страницы корзины на странице доставки:

    <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. Проверьте ваши цены доставки

    Нажмите кнопку «Оформить заказ», чтобы увидеть обновленную корзину. Помните, что при изменении приложения предварительный просмотр обновляется, что приводит к опустошению корзины.

    <div class="lightbox">
      <img src='generated/images/guide/start/cart-empty-with-shipping-prices.png' alt="Cart with link to shipping prices">
    </div>

    Нажмите на ссылку, чтобы перейти к ценам доставки.

    <div class="lightbox">
      <img src='generated/images/guide/start/shipping-prices.png' alt="Display shipping prices">
    </div>


{@a next-steps}
## Следующие шаги

Поздравляем! У вас есть приложение интернет-магазина с каталогом товаров и корзиной покупок. Вы также можете посмотреть и показать цены доставки.

Чтобы продолжить изучение Angular, выбрать один из следующих вариантов:
* [Перейдите к разделу «Формы»](start/start-forms "Getting Started: Forms") чтобы завершить приложение, добавив страницу корзины покупок и форму заказа.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment") чтобы перейти к локальной разработке или развернуть свое приложение на Firebase или на своем собственном сервере.
