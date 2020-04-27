{@a dynamic-component-loader}
# Динамический компонентный загрузчик

Шаблоны компонентов не всегда фиксированы. Приложению может потребоваться загрузить новые компоненты во время выполнения.

Эта кулинарная книга показывает, как использовать `ComponentFactoryResolver` для динамического добавления компонентов.

Смотрите <live-example name="dynamic-component-loader"></live-example>
кода в этой кулинарной книге.

{@a dynamic-loading}

{@a dynamic-component-loading}
## Динамическая загрузка компонентов

В следующем примере показано, как создать динамический рекламный баннер.

Агентство Hero планирует рекламную кампанию с несколькими разными
объявления, повторяющиеся через баннер. Добавлены новые рекламные компоненты
часто несколькими разными командами. Это делает это непрактичным
использовать шаблон со статической структурой компонентов.

Вместо этого вам нужен способ загрузить новый компонент без исправления
ссылка на компонент в шаблоне рекламного баннера.

Angular поставляется с собственным API для динамической загрузки компонентов.


{@a directive}

{@a the-anchor-directive}
## Якорная директива

Прежде чем вы сможете добавить компоненты, вы должны определить опорную точку
сказать Angular, куда вставить компоненты.

Рекламный баннер использует вспомогательную директиву под названием `AdDirective` для
пометьте действительные точки вставки в шаблоне.


<code-example path="dynamic-component-loader/src/app/ad.directive.ts" header="src/app/ad.directive.ts"></code-example>



 `AdDirective ` вводит ` ViewContainerRef` чтобы получить доступ к представлению
контейнер элемента, в котором будет размещен динамически добавленный компонент.

в `@Directive` decorator, обратите внимание на имя селектора, `ad-host` ;
это то, что вы используете для применения директивы к элементу.
В следующем разделе показано, как это сделать.

{@a loading-components}

{@a loading-components}
## Загрузка компонентов

Большая часть реализации рекламного баннера находится в `ad-banner.component.ts`.
Для простоты в этом примере HTML находится в `@Component` 
декоратора `template` свойство в виде строки шаблона.

 `<ng-template>` элементе вы применяете только что созданную директиву.
Чтобы применить `AdDirective`, отозвать селектор из `ad.directive.ts`,
 `ad-host` . Примените это к `<ng-template>` без квадратных скобок. Теперь Angular знает
где динамически загружать компоненты.


<code-example path="dynamic-component-loader/src/app/ad-banner.component.ts" region="ad-host" header="src/app/ad-banner.component.ts (template)"></code-example>



 `<ng-template>` Элемент - хороший выбор для динамических компонентов
потому что это не оказывает никакого дополнительного вывода.


{@a resolving-components}


{@a resolving-components}
## Разрешающие компоненты

Присмотритесь к методам в `ad-banner.component.ts`.

 `AdBannerComponent` принимает массив `AdItem` Объекты качестве входных данных
который в конечном итоге исходит от `AdService` . `AdItem` Объекты указывают
тип компонента для загрузки и любые данные для привязки к
составная часть. `AdService` возвращает фактические объявления, составляющие рекламную кампанию.

Передача массива компонентов `AdBannerComponent` позволяет для
динамический список объявлений без статических элементов в шаблоне.

С этими `getAds()`, `AdBannerComponent` циклически перебирает массив `AdItems` 
и загружает новый компонент каждые 3 секунды, вызывая `loadComponent()`.


<code-example path="dynamic-component-loader/src/app/ad-banner.component.ts" region="class" header="src/app/ad-banner.component.ts (excerpt)"></code-example>



 `loadComponent()` делает здесь большую работу.
Сделай это шаг за шагом. Во-первых, он выбирает рекламу.


<div class="alert is-helpful">



**Как _loadComponent () _ выбирает объявление**

 `loadComponent()` выбирает объявление с использованием математических вычислений.

Во-первых, он устанавливает `currentAdIndex`, взяв все что угодно
в настоящее время плюс один, деля это на длину `AdItem` Массив, и
используя _remainder_ в качестве нового `currentAdIndex` значение . Затем он использует это
значение для выбора `adItem` из массива.


</div>



После `loadComponent()` выбирает объявление, оно использует `ComponentFactoryResolver` 
разрешить `ComponentFactory` для каждого конкретного компонента.
 `ComponentFactory` Затем создает экземпляр каждого компонента.

Далее вы нацеливаетесь на `viewContainerRef` это
существует на этом конкретном экземпляре компонента. Откуда ты это знаешь
этот конкретный экземпляр? Потому что это относится к `adHost` и `adHost` это
Директива, которую вы установили ранее, чтобы сообщить Angular, куда вставлять динамические компоненты.

Как вы помните, `AdDirective` вводит `ViewContainerRef` в его конструктор.
Вот как директива обращается к элементу, который вы хотите использовать для размещения динамического компонента.

Чтобы добавить компонент в шаблон, вы звоните `createComponent()` на `ViewContainerRef`.

 `createComponent()` возвращает ссылку на загруженный компонент.
Используйте эту ссылку для взаимодействия с компонентом, присваивая его свойствам или вызывая его методы.


{@a selector-references}


{@a selector-references}
#### Селекторные ссылки

Как правило, Angular компилятор генерирует `ComponentFactory` 
для любого компонента, указанного в шаблоне. Тем не менее, есть
нет ссылок селектора в шаблонах для
динамически загружаемые компоненты, так как они загружаются во время выполнения.

Для того, чтобы гарантировать, что компилятор все еще создает завод,
добавить динамически загруженные компоненты в `NgModule` «s `entryComponents` массив:

<code-example path="dynamic-component-loader/src/app/app.module.ts" region="entry-components" header="src/app/app.module.ts (entry components)"></code-example>



{@a common-interface}


{@a the-adcomponent-interface}
## Интерфейс _AdComponent_

В рекламном баннере все компоненты реализуют общий `AdComponent` Интерфейс для
стандартизировать API для передачи данных компонентам.

Вот два примера компонентов и `AdComponent` интерфейс для справки:


<code-tabs>

  <code-pane header="hero-job-ad.component.ts" path="dynamic-component-loader/src/app/hero-job-ad.component.ts">

  </code-pane>

  <code-pane header="hero-profile.component.ts" path="dynamic-component-loader/src/app/hero-profile.component.ts">

  </code-pane>

  <code-pane header="ad.component.ts" path="dynamic-component-loader/src/app/ad.component.ts">

  </code-pane>

</code-tabs>



{@a final-ad-baner}


{@a final-ad-banner}
## Финальный рекламный баннер
Окончательный рекламный баннер выглядит следующим образом :

<div class="lightbox">
  <img src="generated/images/guide/dynamic-component-loader/ads-example.gif" alt="Ads">
</div>

Смотрите <live-example name="dynamic-component-loader"></live-example>.
