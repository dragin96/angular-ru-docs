{@a lazy-loading-feature-modules}
# Ленивые загрузочные функциональные модули

{@a high-level-view}
## Высокий уровень просмотра

По умолчанию NgModules загружаются с нетерпением, а это означает, что как только приложение загружается, так же поступают все NgModules, независимо от того, нужны ли они немедленно. Для больших приложений с большим количеством маршрутов рассмотрите ленивую загрузку - шаблон проектирования, который загружает NgModules по мере необходимости. Ленивая загрузка помогает сохранить начальную
Размеры пачки меньше, что, в свою очередь, помогает уменьшить время загрузки.

Последний пример приложения с двумя загруженными модулями, описанный на этой странице, см
<live-example></live-example>,

Есть два основных шага для настройки ленивого загруженного модуля функции:

1. Создайте функциональный модуль с помощью интерфейса командной строки, используя `--route` флаг.
1. Настройте маршруты.

{@a set-up-an-app}
## Настройте приложение

Если у вас еще нет приложения, вы можете выполнить следующие шаги, чтобы
создать один с CLI. Если у вас уже есть приложение, перейдите к
[Настроить маршруты](#config-routes). Введите следующую команду
где `customer-app` это имя вашего приложения:

<code-example language="bash">
ng new customer-app --routing
</code-example>

Это создает приложение под названием `customer-app` и `--routing` флаг
генерирует файл с именем `app-routing.module.ts`, который является одним из
файлы, необходимые для настройки отложенной загрузки вашего функционального модуля.
Перейдите в проект, введя команду `cd customer-app`.

<div class="alert is-helpful">

 `--routing` требует Angular / CLI версии 8.1 или выше.
Смотрите [в курсе](guide/updating).

</div>

{@a create-a-feature-module-with-routing}
## Создать функциональный модуль с маршрутизацией

Далее вам понадобится функциональный модуль с компонентом для маршрутизации.
Чтобы сделать это, введите следующую команду в терминале, где `customers` это название функционального модуля. Путь для загрузки `customers` модули также `customers` потому что это указано с `--route` вариант:

<code-example language="bash">
ng generate module customers --route customers --module app.module
</code-example>

Это создает `customers` папка с новым загружаемым модулем `CustomersModule` определенный в `customers.module.ts` файл . Команда автоматически объявляет `CustomersComponent` внутри нового функционального модуля.

Поскольку новый модуль предназначен для загрузки с отложенным доступом, команда НЕ добавляет ссылку на новый функциональный модуль в файл корневого модуля приложения, `app.module.ts`.
Вместо этого он добавляет заявленный маршрут, `customers` к `routes` массив объявленный в модуле, указанном как `--module` опция.

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers">
</code-example>

Обратите внимание, что синтаксис с отложенной загрузкой использует `loadChildren` сопровождается функцией, которая использует встроенный в браузер `import('...')` синтаксис для динамического импорта.
Путь импорта - это относительный путь к модулю.

{@a add-another-feature-module}
### Добавьте еще один функциональный модуль

Используйте ту же команду, чтобы создать второй ленивый функциональный модуль с маршрутизацией вместе с компонентом-заглушкой.

<code-example language="bash">
ng generate module orders --route orders --module app.module
</code-example>

Это создает новую папку с именем `orders` содержащие `OrdersModule` и `OrdersRoutingModule` вместе с новым `OrdersComponent` исходные файлы.
 `orders` маршрут, указанный с помощью `--route` добавляется к `routes` массив внутри `app-routing.module.ts` файл, используя синтаксис загрузки.

<code-example
  header="src/app/app-routing.module.ts"
  path="lazy-loading-ngmodules/src/app/app-routing.module.ts"
  region="routes-customers-orders">
</code-example>

{@a set-up-the-ui}
## Настройте пользовательский интерфейс

Хотя вы можете ввести URL-адрес в адресную строку, пользовательский интерфейс навигации проще для пользователя и более распространен.
Замените стандартную разметку-заполнитель в `app.component.html` с пользовательской навигацией
так что вы можете легко перейти к вашим модулям в браузере:


<code-example path="lazy-loading-ngmodules/src/app/app.component.html" header="app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>


Чтобы увидеть приложение в браузере до сих пор, введите следующую команду в окне терминала:

<code-example language="bash">
ng serve
</code-example>

Затем перейдите к `localhost:4200` где вы должны увидеть «клиентское приложение» и три кнопки.

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300" alt="three buttons in the browser">
</div>

Эти кнопки работают, потому что CLI автоматически добавляет маршруты к функциональным модулям в `routes` массив в `app.module.ts`.

{@a config-routes}

{@a imports-and-route-configuration}
## Импорт и конфигурация маршрута

CLI автоматически добавляет каждый функциональный модуль в карту маршрутов на уровне приложения.
Завершите это, добавив маршрут по умолчанию. в `app-routing.module.ts` файл, обновите `routes` массив со следующим:

<code-example path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes" header="src/app/app-routing.module.ts"></code-example>

Первые два пути - это маршруты к `CustomersModule` и `OrdersModule`.
Последняя запись определяет маршрут по умолчанию. Пустой путь соответствует всему, что не соответствует более раннему пути.


{@a inside-the-feature-module}
### Внутри функционального модуля

Далее взгляните на `customers.module.ts` файл . Если вы используете CLI и выполняете действия, описанные на этой странице, вам не нужно ничего делать здесь.

<code-example path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module" header="src/app/customers/customers.module.ts"></code-example>

 `customers.module.ts` Файл импортирует `customers-routing.module.ts` и `customers.component.ts` Файлы . `CustomersRoutingModule` указан в `@NgModule` `imports ` массивов ` CustomersModule` доступ к собственному модулю маршрутизации. `CustomersComponent` находится в `declarations` массив, что означает `CustomersComponent` принадлежит к `CustomersModule`.


 `app-routing.module.ts` импортирует функциональный модуль, `customers.module.ts` используя динамический импорт JavaScript.

Файл определения маршрута для конкретной функции `customers-routing.module.ts` импортирует свой собственный компонент, определенный в `customers.component.ts` файл вместе с другими операторами импорта JavaScript. Затем он отображает пустой путь к `CustomersComponent`.

<code-example path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module" header="src/app/customers/customers-routing.module.ts"></code-example>

 `path` здесь установлен в пустую строку, потому что путь в `AppRoutingModule` уже установлен в `customers`, так что этот маршрут в `CustomersRoutingModule`, уже находится в пределах `customers` контекст . Каждый маршрут в этом модуле маршрутизации является дочерним маршрутом.

Модуль маршрутизации другого функционального модуля настроен аналогично.

<code-example path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail" header="src/app/orders/orders-routing.module.ts (excerpt)"></code-example>

{@a confirm-it’s-working}
## Подтвердите, что это работает

Вы можете проверить, действительно ли модуль загружается с помощью инструментов разработчика Chrome. В Chrome откройте инструменты разработчика, нажав `Cmd+Option+i` на Mac или `Ctrl+Shift+j` на ПК и перейдите на вкладку Сеть.

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600" alt="lazy loaded modules diagram">
</div>


Нажмите на кнопку Заказы или Клиенты. Если вы видите чанк, все подключено правильно, и функциональный модуль загружается с отложенным доступом. Блок должен отображаться для заказов и для клиентов, но будет появляться только один раз для каждого.


<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600" alt="lazy loaded modules diagram">
</div>


Для того, чтобы увидеть его снова, или к испытанию после работы в проекте, все ясно, нажав на круг с линией, проходящей через него в верхней левой части вкладки Сеть:

<div class="lightbox">
  <img src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200" alt="lazy loaded modules diagram">
</div>


Затем перезагрузите с `Cmd+r` или `Ctrl+r`, в зависимости от вашей платформы.

{@a forroot-and-forchild}
## `forRoot()` и `forChild()` 

Вы могли заметить, что CLI добавляет `RouterModule.forRoot(routes)` к `AppRoutingModule` `imports` массив.
Это позволяет Angular знать, что `AppRoutingModule` является модулем маршрутизации и `forRoot()` указывает, что это корневой модуль маршрутизации.
Он настраивает все маршруты, которые вы передаете ему, дает вам доступ к директивам маршрутизатора и регистрирует `Router` Сервис.
использование `forRoot()` только один раз в приложении, внутри `AppRoutingModule`.

CLI также добавляет `RouterModule.forChild(routes)` чтобы показать модули маршрутизации.
Таким образом, Angular знает, что список маршрутов отвечает только за предоставление дополнительных маршрутов и предназначен для функциональных модулей.
Ты можешь использовать `forChild()` в нескольких модулях.

 `forRoot()` заботится о *глобальной* конфигурации инжектора для маршрутизатора.
 `forChild()` не имеет конфигурации инжектора. Он использует такие директивы, как `RouterOutlet` и `RouterLink`.
Для получения дополнительной информации см. [Раздел `forRoot ()` pattern](guide/singleton-services#forRoot)руководства [Singleton Services](guide/singleton-services).

<hr>

{@a more-on-ngmodules-and-routing}
## Подробнее о модулях Ng и маршрутизации

Вы также можете быть заинтересованы в следующих ситуациях :
* [Маршрутизация и навигация](guide/router).
* [Провайдеры](guide/providers).
* [Типы функциональных модулей](guide/module-types).
* [Разделение кода на уровне маршрута в Angular](https://web.dev/route-level-code-splitting-in-angular/)
* [Стратегия предварительной загрузки маршрута в Angular](https://web.dev/route-preloading-in-angular/)
