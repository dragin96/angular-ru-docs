{@a feature-modules}
# Функциональные модули

Функциональные модули - это NgModules для организации кода.

Для окончательного примера приложения с функциональным модулем, который описан на этой странице
увидеть <live-example></live-example>.

<hr>

По мере роста вашего приложения вы можете упорядочить код, соответствующий определенной функции.
Это помогает применять четкие границы для функций. С функциональными модулями
Вы можете сохранить код, связанный с определенной функцией или функцией
отдельно от другого кода. Разграничение ваших областей
Приложение помогает в сотрудничестве между разработчиками и командами, разделяя
директивы и управление размером корневого модуля.


{@a feature-modules-vs.-root-modules}
## Функциональные модули против корневых модулей

Функциональный модуль - это лучшая практика организации, в отличие от концепции базового Angular API. Функциональный модуль обеспечивает целостный набор функций, ориентированных на
конкретные потребности приложения, такие как рабочий процесс пользователя, маршрутизация или формы.
Хотя вы можете делать все внутри корневого модуля, функциональные модули
поможет вам разделить приложение на целевые области. Функциональный модуль
сотрудничает с корневым модулем и с другими модулями через
предоставляемые услуги и компоненты, директивы и др
трубы, которые он разделяет.

{@a how-to-make-a-feature-module}
## Как сделать функциональный модуль

Предполагая, что у вас уже есть приложение, которое вы создали с помощью [Angular CLI](cli), создайте функцию
модуль с помощью CLI, введя следующую команду в
корневой каталог проекта. замещать  `CustomerDashboard`  с
Название вашего модуля. Можно опустить суффикс «Модуль» от имени, потому что CLI присоединяет его:

```sh
ng generate module CustomerDashboard

```


Это заставляет CLI создавать папку с именем  `customer-dashboard`  с файлом внутри  `customer-dashboard.module.ts`  со следующим содержанием:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class CustomerDashboardModule { }
```

Структура модуля NgModule одинакова, будь то корневой модуль или функциональный модуль. В генерируемом модуле CLI есть два оператора импорта JavaScript в верхней части файла: первый импорт  `NgModule`, который, как и корневой модуль, позволяет вам использовать  `@NgModule`  decorator; второй импорт  `CommonModule`, который вносит много общих директив, таких как  `ngIf`  и  `ngFor`  . Импорт функциональных модулей  `CommonModule`  вместо  `BrowserModule`, который импортируется только один раз в корневой модуль.  `CommonModule`  содержит только информацию для общих директив, таких как  `ngIf`  и  `ngFor`  которые необходимы в большинстве шаблонов, тогда как  `BrowserModule`  настраивает приложение Angular для браузера, что необходимо сделать только один раз.

 `declarations` Массив доступен для добавления объявлений, которые
это компоненты, директивы и трубы, которые принадлежат исключительно этому конкретному модулю. Чтобы добавить компонент, введите следующую команду в командной строке, где  `customer-dashboard`  - это каталог, в котором CLI сгенерировал функциональный модуль и  `CustomerDashboard`  это имя компонента:

```sh
ng generate component customer-dashboard/CustomerDashboard

```

Это создаст папку для нового компонента в папке на панели пользователя и обновит функциональный модуль с помощью  `CustomerDashboardComponent`  информация:


<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="customer-dashboard-component" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



 `CustomerDashboardComponent` теперь находится в списке импорта JavaScript в верхней части и добавлен в  `declarations`  Массив, который позволяет Angular связать этот новый компонент с этим функциональным модулем.

{@a importing-a-feature-module}
## Импорт функционального модуля

Чтобы включить функциональный модуль в ваше приложение, вы должны позволить корневому модулю,  `app.module.ts`, знать об этом. Обратите внимание на  `CustomerDashboardModule`  экспорта в нижней части  `customer-dashboard.module.ts`  . Это выставляет это так, чтобы другие модули могли добраться до него. Чтобы импортировать его в  `AppModule`, добавьте его в импорт в  `app.module.ts`  и к  `imports`  массива:

<code-example path="feature-modules/src/app/app.module.ts" region="app-module" header="src/app/app.module.ts"></code-example>


Теперь  `AppModule`  знает о функциональном модуле. Если бы вы добавили каких-либо поставщиков услуг в функциональный модуль,  `AppModule`  будет знать о них тоже, как и любые другие функциональные модули. Тем не менее, NgModules не выставляют свои компоненты.


{@a rendering-a-feature-module’s-component-template}
## Визуализация шаблона компонента функционального модуля

Когда CLI сгенерировал  `CustomerDashboardComponent`  для функционального модуля, он включает в себя шаблон,  `customer-dashboard.component.html`  со следующей разметкой:

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html" region="feature-template" header="src/app/customer-dashboard/customer-dashboard/customer-dashboard.component.html"></code-example>


Чтобы увидеть этот HTML в  `AppComponent`, вы должны сначала экспортировать  `CustomerDashboardComponent`  в  `CustomerDashboardModule`  . В  `customer-dashboard.module.ts`, прямо под  `declarations`  массив, добавить  `exports`  массив, содержащий  `CustomerDashboardComponent`  :

<code-example path="feature-modules/src/app/customer-dashboard/customer-dashboard.module.ts" region="component-exports" header="src/app/customer-dashboard/customer-dashboard.module.ts"></code-example>



Далее в  `AppComponent`, `app.component.html`, добавьте тег  `<app-customer-dashboard>`  :

<code-example path="feature-modules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>


Теперь, в дополнение к заголовку, который отображается по умолчанию,  `CustomerDashboardComponent`  шаблон делает тоже:

<div class="lightbox">
  <img src="generated/images/guide/feature-modules/feature-module.png" alt="feature module component">
</div>

<hr />

{@a more-on-ngmodules}
## Больше на NgModules

Вы также можете быть заинтересованы в следующих ситуациях :
* [Ленивые загрузочные модули с Angular маршрутизатором](guide/lazy-loading-ngmodules).
* [Провайдеры](guide/providers).
* [Типы функциональных модулей](guide/module-types).
