{@a getting-started-with-angular-routing}
# Начало работы с Angular: Маршрутизация

В конце [первой части](start "Getting Started: Your First App") наш интернет-магазин имеет базовый каталог товаров.
Приложение не имеет переменных состояния или навигации.
Существует один URL, и этот URL всегда отображает страницу «My Store» со списком продуктов и их описанием.

В этом руководстве показано, как использовать Angular маршрутизатор для отображения сведений о продукте на отдельных страницах, каждая со своим URL-адресом.

Angular [маршрутизатор](guide/glossary#router "Router definition") позволяет отображать различные компоненты и данные пользователю в зависимости от того, где пользователь находится в приложении.
Маршрутизатор делает переход от одного вида к следующему, когда пользователь совершает следующие действия:

* Ввод URL-адреса в адресной строке для перехода на соответствующую страницу.
* Нажатие на ссылку на странице, чтобы перейти на новую.
* Нажатие кнопок браузера «назад» и «вперед», что позволяет перемещаться назад и вперед по истории браузера.


{@a registering-a-route}
## Регистрация маршрута

Приложение уже настроено на использование Angular маршрутизатора для перехода к компоненту списка продуктов, который вы изменили ранее. В этом разделе показано, как определить маршрут для отображения отдельных сведений о продукте.

1. Создайте новый компонент для сведений о продукте. Дайте компоненту название `product-details`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши по папке `app`, выберите `Angular Generator ` и ` Component`.

1. В `app.module.ts`, добавьте маршрут для сведений о продукте, со значение свойства `path` - `products/:productId` и `ProductDetailsComponent` для `component`.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route">
    </code-example>

    Маршрут связывает один или несколько URL-путей с компонентом.

1. Директива настраивает шаблон компонента, чтобы определить, как пользователь перемещается по маршруту или URL-адресу. Когда пользователь нажимает на название продукта, приложение отображает сведения об этом продукте.

    1. Откройте `product-list.component.html`.

    1. Обновите директиву `*ngFor` для присваивания каждого индекса в массиве `products` к переменной `productId` при переборе списка.

    1. Добавьте привязку `routerLink` к названию продукта.

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link">
    </code-example>

      Директива RouterLink дает маршрутизатору контроль над элементом привязки. В этом случае маршрут или URL-адрес содержит один фиксированный сегмент, `/products`, в то время как последний сегмент является переменным, вставляя свойство `id` текущего продукта. Например, URL для продукта с `id` 1 будет похож на `https://getting-started-myfork.stackblitz.io/products/1`.

1. Протестируйте роутер, нажав на название продукта. Приложение отображает компонент сведений о продукте, который в настоящее время всегда говорит, что «product-details works!»

    Обратите внимание, что URL в окне предварительного просмотра изменяется. Последний сегмент `products/#` где `#` - номер маршрута, по которому вы щелкнули.

    <div class="lightbox">
      <img src="generated/images/guide/start/product-details-works.png" alt="Product details page with updated URL">
    </div>



{@a using-route-information}
## Использование информации о маршруте

Компонент сведений о продукте обрабатывает отображение каждого продукта. Angular Router отображает компоненты на основе URL-адреса браузера и заданных вами маршрутов. В этом разделе показано, как использовать Angular маршрутизатор для объединения данных `products` и информации о маршруте для отображения конкретных сведений для каждого продукта.

1. Откройте `product-details.component.ts`

1. Организуйте использование данных о продукте из внешнего файла.

    1. Импортируйте `ActivatedRoute` из пакета `@angular/router` и массив `products` из `../products`.

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports">
        </code-example>

    1. Определите свойство `product` и введите `ActivatedRoute` в конструктор, добавив его в качестве аргумента в скобках конструктора.

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="props-methods">
        </code-example>

 `ActivatedRoute` специфичен для каждого маршрутизируемого компонента, который загружает Angular маршрутизатор. Содержит информацию о
        маршруте, его параметры и дополнительные данные, связанные с маршрутом.

        Вводя `ActivatedRoute`, вы настраиваете компонент для использования сервиса. Хотя в этой части руководства «Начало работы с Angular» кратко используется этот синтаксис, на странице [Управление данными](start/start-data "Getting Started: Managing Data") сервисы рассматриваются более подробно.


1. В `ngOnInit()`, подпишитесь на параметры маршрута и получите продукт на основе `productId`.

    <code-example path="getting-started/src/app/product-details/product-details.component.1.ts" header="src/app/product-details/product-details.component.ts" region="get-product">
    </code-example>

    Параметры маршрута соответствуют переменным пути, которые вы определяете в маршруте. URL, который соответствует маршруту, предоставляет `productId` . Angular использует `productId` для отображения подробной информации о каждом уникальном продукте.

1. Обновите шаблон для отображения информации о продукте внутри `*ngIf`.

    <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html" region="details">
    </code-example>

Теперь, когда пользователи нажимают на название в списке продуктов, маршрутизатор переходит к нему по отдельному URL-адресу продукта, заменяет компонент списка продуктов для компонента сведений о продукте и отображает сведения о продукте.

<div class="lightbox">
  <img src="generated/images/guide/start/product-details-routed.png" alt="Product details page with updated URL and full details displayed">
</div>



<div class="alert is-helpful">

Для получения дополнительной информации о маршрутизаторе Angular см. [Маршрутизация и навигация](guide/router "Routing & Navigation").

</div>


{@a next-steps}
## Следующие шаги

Поздравляем! Вы интегрировали маршрутизацию в свой интернет-магазин.

* Продукты связаны со страницей списка продуктов с отдельными продуктами.
* Пользователи могут щелкнуть по названиб продукта в списке, чтобы просмотреть подробности в новом представлении с отдельным URL-адресом / маршрутом.

Чтобы продолжить изучение Angular, выбрать один из следующих вариантов:
* [Перейдите к разделу «Управление данными»](start/start-data "Getting Started: Managing Data"), чтобы добавить функцию корзины покупок, использовать сервис для управления данными корзины и использовать HTTP для извлечения внешних данных о ценах доставки.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment"), чтобы развернуть приложение в Firebase или перейти к локальной разработке.
