{@a getting-started-with-angular-routing}
# Начало работы с Angular: Маршрутизация

В конце [первой части](start "Getting Started: Your First App") наш интернет-магазин имеет базовый каталог товаров.
Приложение не имеет переменных состояния или навигации.
Существует один URL, и этот URL всегда отображает страницу «My Store» со списком продуктов и их описанием.

В этом руководстве показано, как использовать Angular маршрутизатор для отображения информации о продукте на отдельных страницах, каждая со своим URL-адресом.

Angular [маршрутизатор](guide/glossary#router "Router definition") позволяет отображать различные компоненты и данные пользователю в зависимости от того, где пользователь находится в приложении.
Маршрутизатор делает переход от одного вида к следующему, когда пользователь совершает следующие действия:

* Ввод URL-адреса в адресной строке для перехода на соответствующую страницу.
* Нажатие на ссылку на странице, чтобы перейти на новую.
* Нажатие кнопок браузера «назад» и «вперед», что позволяет перемещаться назад и вперед по истории браузера.


{@a registering-a-route}
## Регистрация маршрута

Приложение уже настроено на использование Angular маршрутизатора для перехода к компоненту списка продуктов, который вы изменили ранее. В этом разделе показано, как определить маршрут для отображения детальной информации о продукте.

1. Создайте новый компонент детальной информации о продукте. Дайте компоненту название `product-details`.

    Напоминание: в списке файлов щелкните правой кнопкой мыши по папке `app`, выберите `Angular Generator ` затем ` Component`.

2. В `app.module.ts`, добавьте маршрут для информации о продукте, со значение свойства `path` - `products/:productId` и `ProductDetailsComponent` для `component`.

    <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="product-details-route">
    </code-example>

    Маршрут связывает один или несколько URL-путей с компонентом.

3. Директива настраивает шаблон компонента, чтобы определить, когда пользователь перемещается по маршруту или URL-адресу. Когда пользователь нажимает на название продукта, приложение отображает информацию об этом продукте.

    1. Откройте `product-list.component.html`.

    2. Обновите директиву `*ngFor` для присваивания каждого индекса в массиве `products` к переменной `productId` при переборе списка.

    3. Добавьте привязку `routerLink` к названию продукта.

    <code-example header="src/app/product-list/product-list.component.html" path="getting-started/src/app/product-list/product-list.component.html" region="router-link">
    </code-example>

      Директива RouterLink дает маршрутизатору контроль над элементом привязки. В этом случае маршрут или URL-адрес содержит один фиксированный сегмент, `/products`, в то время как последний сегмент является переменным, вставляя свойство `id` текущего продукта. Например, URL для продукта с `id` 1 будет похож на `https://getting-started-myfork.stackblitz.io/products/1`.

4. Протестируйте роутер, нажав на название продукта. Приложение отображает компонент информации о продукте, который в настоящее время всегда говорит, что «product-details works!»

    Обратите внимание, что URL в окне предварительного просмотра изменяется. Последний сегмент `products/#` где `#` - номер маршрута, по которому вы щелкнули.

    <div class="lightbox">
      <img src="generated/images/guide/start/product-details-works.png" alt="Product details page with updated URL">
    </div>



{@a using-route-information}
## Использование информации о маршруте

Компонент детальной информации о продукте обрабатывает отображение каждого продукта. Angular Router отображает компоненты на основе URL-адреса браузера и заданных вами маршрутов. В этом разделе показано, как использовать Angular маршрутизатор для объединения данных `products` и информации о маршруте для отображения детальной информации для каждого продукта.

1. Откройте `product-details.component.ts`

2. Организуйте использование данных о продукте из внешнего файла.

    1. Импортируйте `ActivatedRoute` из пакета `@angular/router` и массив `products` из `../products`.

        <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.1.ts" region="imports">
        </code-example>

    2. Определите свойство `product` и введите `ActivatedRoute` в конструктор, добавив его в качестве аргумента в скобках конструктора.

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

Теперь, когда пользователи нажимают на название в списке продуктов, маршрутизатор переходит к нему по отдельному URL-адресу продукта, заменяет компонент списка продуктов на компонент информации о продукте и отображает информацию о продукте.

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
ом.
вис для управления данными корзины и использовать HTTP для извлечения внешних данных о ценах доставки.
* [Перейдите к разделу «Развертывание»](start/start-deployment "Getting Started: Deployment"), чтобы развернуть приложение в Firebase или перейти к локальной разработке.
