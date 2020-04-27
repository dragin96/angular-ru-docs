{@a add-services}
# Добавить услуги

Тур Героев `HeroesComponent` в настоящее время получает и отображает поддельные данные.

После рефакторинга в этом уроке, `HeroesComponent` будет скудным и сосредоточится на поддержке вида.
Также будет проще провести модульное тестирование с помощью фиктивного сервиса.

{@a why-services}
## Почему услуги

Компоненты не должны извлекать или сохранять данные напрямую, и они, конечно, не должны сознательно представлять поддельные данные.
Они должны сосредоточиться на представлении данных и делегировать доступ к данным службе.

В этом уроке вы создадите `HeroService` который все классы приложений могут использовать для получения героев.
Вместо того, чтобы создать эту услугу с [ `new` ключевым словом](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new),
вы будете полагаться на Angular [* внедрение зависимостей *](guide/dependency-injection)
ввести его в `HeroesComponent` конструктор.

Сервисы - отличный способ обмениваться информацией между классами, которые не знают друг друга.
Вы создадите `MessageService` и внедрить его в двух местах.

1. Внедрить в HeroService, который использует сервис для отправки сообщения.
2. Вставьте в MessagesComponent, который отображает это сообщение, а также отображает идентификатор
когда пользователь нажимает на героя.


{@a create-the-heroservice}
## Создать `HeroService`

Используя Angular CLI, создайте сервис под названием `hero`.

<code-example language="sh" class="code-shell">
  ng generate service hero
</code-example>

Команда генерирует скелет `HeroService` класс в `src/app/hero.service.ts` следующим образом :

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="new"
 header="src/app/hero.service.ts (new service)"></code-example>


{@a @ injectable-services}
### `@Injectable()` услуги

Обратите внимание, что новый сервис импортирует Angular `Injectable` символ и аннотации
класс с `@Injectable()` декоратор. Это помечает класс как участвующий в системе внедрения _dependency. `HeroService` Класс будет предоставлять инъекционную услугу, и он также может иметь свои собственные внедренные зависимости.
У него пока нет никаких зависимостей, но [это скоро будет](#inject-message-service).

 `@Injectable()` принимает объект метаданных для службы так же, как `@Component()` сделал для ваших классов компонентов.

{@a get-hero-data}
### Получить данные героя

 `HeroService` может получать данные о героях из любого места - веб-службы, локального хранилища или фиктивного источника данных.

Удаление доступа к данным из компонентов означает, что вы можете в любое время изменить свое решение о реализации, не касаясь каких-либо компонентов.
Они не знают, как работает сервис.

Реализация в этом учебном пособии будет продолжать выпускать героев.

Импортировать `Hero` и `HEROES`.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="import-heroes">
</code-example>

Добавить `getHeroes` Метод для возврата _mock heroes_.

<code-example path="toh-pt4/src/app/hero.service.1.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

{@a provide}
{@a provide-the-heroservice}
## Предоставить `HeroService`

Вы должны сделать `HeroService` доступен для системы внедрения зависимостей
прежде чем Angular сможет _inject_ его в `HeroesComponent` путем регистрации _provider_. Поставщик - это то, что может создать или предоставить услугу; в этом случае он создает `HeroService` Класс для предоставления услуги.

Чтобы убедиться, что `HeroService` может предоставить эту услугу, зарегистрировать ее
с _injector_, который является объектом, который отвечает за выбор
и добавление провайдера там, где это требуется приложению.

По умолчанию команда Angular CLI `ng generate service` регистрирует поставщика с помощью _root injector_ для вашей службы, включая метаданные поставщика, то есть `providedIn: 'root' ` в ` @Injectable()` декоратор.

```
@Injectable({
  providedIn: 'root',
})
```

Когда вы предоставляете сервис на корневом уровне, Angular создает один общий экземпляр `HeroService` и внедряет в любой класс, который просит об этом.
Регистрация провайдера в `@Injectable` Метаданные также позволяют Angular оптимизировать приложение, удалив службу, если она, в конце концов, не будет использоваться.

<div class="alert is-helpful">

Чтобы узнать больше о поставщиках см [Providers раздел](guide/providers).
Чтобы узнать больше об инжекторах, см. [Руководство по внедрению зависимости](guide/dependency-injection).

</div>

 `HeroService` готов подключиться к `HeroesComponent`.

<div class="alert is-important">

Это временный пример кода, который позволит вам предоставить и использовать `HeroService` . На данный момент код будет отличаться от `HeroService` в [«окончательный обзор кода»](#final-code-review).

</div>


{@a update-heroescomponent}
## Обновить `HeroesComponent`

Открой `HeroesComponent` Файл класса.

Удалить `HEROES` import, потому что вам это больше не понадобится.
Импортировать `HeroService` вместо этого.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts (import HeroService)" region="hero-service-import">
</code-example>

Заменить определение `heroes` собственность с простой декларацией.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="heroes">
</code-example>

{@a inject}

{@a inject-the-heroservice}
### Введите `HeroService`

Добавить личное `heroService` Параметр типа `HeroService` для конструктора.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="ctor">
</code-example>

Параметр одновременно определяет приватный `heroService` свойство и определяет его как `HeroService` сайт инъекции.

Когда Angular создает `HeroesComponent`, то [инъекция зависимости](guide/dependency-injection)система
устанавливает `heroService` Параметр для экземпляра `HeroService`.

{@a add-getheroes}
### добавлять `getHeroes()`

Создайте функцию для извлечения героев из сервиса.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="getHeroes">
</code-example>

{@a oninit}

{@a call-it-in-ngoninit}
### Позвони в `ngOnInit()`

Пока ты можешь позвонить `getHeroes()` в конструкторе, это не лучшая практика.

Зарезервируйте конструктор для простой инициализации, такой как привязка параметров конструктора к свойствам.
Конструктор не должен ничего делать.
Конечно, он не должен вызывать функцию, которая отправляет HTTP-запросы на удаленный сервер, как это сделала бы _real_ служба данных.

Вместо этого позвоните `getHeroes()` внутри [хука жизненного цикла * * ngOnInit *](guide/lifecycle-hooks)и
давай Angular звонить `ngOnInit()` в соответствующее время _after_ создание `HeroesComponent` экземпляр.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="ng-on-init">
</code-example>

{@a see-it-run}
### Смотри, беги

После обновления браузера приложение должно работать как прежде
показ списка героев и подробный вид героя при нажатии на имя героя.

{@a observable-data}
## Наблюдаемые данные

 `HeroService.getHeroes()` метод имеет _synchronous signature_,
что подразумевает, что `HeroService` может героев синхронно.
 `HeroesComponent ` потребляет ` getHeroes()` результат
как будто герои могут быть выбраны синхронно.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="get-heroes">
</code-example>

Это не будет работать в реальном приложении.
Вам это сходит с рук сейчас, потому что сервис в настоящее время возвращает _mock heroes_.
Но скоро приложение будет загружать героев с удаленного сервера
которая по своей сути _asynchronous_ операция.

 `HeroService` должен ждать ответа сервера
 `getHeroes()` не может сразу вернуться с данным героем,
и браузер не будет блокировать, пока служба ожидает.

 `HeroService.getHeroes()` должен иметь некоторую _синхронную подпись_.

В этом уроке `HeroService.getHeroes()` вернет `Observable`
потому что он в конечном итоге будет использовать Angular `HttpClient.get` метод для выбора героев
и [ `HttpClient.get ()` возвращает `Observable` ](guide/http).

{@a observable-heroservice}
### наблюдаемый `HeroService`

 `Observable` является одним из ключевых классов в [библиотека RxJS](http://reactivex.io/rxjs/).

В [позже учебник по HTTP](tutorial/toh-pt6), вы узнаете, что Angular - х `HttpClient` методы возвращают RxJS `Observable` с.
В этом руководстве вы будете симулировать получение данных с сервера с помощью RxJS `of()` функции.

Открой `HeroService` файл и импортировать `Observable` и `of` символов из RxJS.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts (Observable imports)" region="import-observable">
</code-example>

Заменить `getHeroes()` метод со следующим:

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes-1"></code-example>

 `of(HEROES) ` возвращает ` Observable<Hero[]>` который испускает _a одно значение_, массив имитирующих героев.

<div class="alert is-helpful">

В [учебник по HTTP](tutorial/toh-pt6)вы позвоните `HttpClient.get<Hero[]>()` который также возвращает `Observable<Hero[]>` который испускает _a одно значение_, массив героев из тела HTTP-ответа.

</div>

{@a subscribe-in-heroescomponent}
### Подписаться на `HeroesComponent`

 `HeroService.getHeroes` метод, используемый для возврата `Hero[]`.
Теперь он возвращает `Observable<Hero[]>`.

Вы должны приспособиться к этой разнице в `HeroesComponent`.

Найди `getHeroes` метод и замените его следующим кодом
(показанный рядом с предыдущей версией для сравнения)

<code-tabs>

  <code-pane header="heroes.component.ts (Observable)"
    path="toh-pt4/src/app/heroes/heroes.component.ts" region="getHeroes">
  </code-pane>

  <code-pane header="heroes.component.ts (Original)"
    path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes">
  </code-pane>

</code-tabs>

 `Observable.subscribe()` является критическим отличием.

Предыдущая версия назначает массив героев для компонента `heroes` собственность.
Назначение происходит _синхронно_, как если бы сервер мог вернуть героев мгновенно
или браузер может заморозить интерфейс, ожидая ответа сервера.

Это не будет работать, когда `HeroService` фактически делает запросы удаленного сервера.

Новая версия ждет `Observable` испускать множество героев - которые
может произойти сейчас или через несколько минут.
 `subscribe()` метод передает излучаемый массив в обратный вызов
который устанавливает компонент `heroes` собственность.

Этот асинхронный подход будет работать когда
 `HeroService` запрашивает героев с сервера.

{@a show-messages}
## Показать сообщения

В этом разделе приведены инструкции по следующему:

* добавив `MessagesComponent`, отображающий сообщения приложения в нижней части экрана
* создание инъекций, для всего приложения `MessageService` для отправки сообщений для отображения
* инъекционных `MessageService` в `HeroService`
* отображение сообщения, когда `HeroService` успешно выбирает героев

{@a create-messagescomponent}
### Создайте `MessagesComponent`

Используйте CLI для создания `MessagesComponent`.

<code-example language="sh" class="code-shell">
  ng generate component messages
</code-example>

CLI создает файлы компонентов в `src/app/messages` папку и объявляет `MessagesComponent` в `AppModule`.

Изменить `AppComponent` Шаблон для отображения сгенерированного `MessagesComponent`.

<code-example
  header = "src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
</code-example>

Вы должны увидеть абзац по умолчанию от `MessagesComponent` внизу страницы.

{@a create-the-messageservice}
### Создать `MessageService`

Используйте CLI для создания `MessageService` в `src/app`.

<code-example language="sh" class="code-shell">
  ng generate service message
</code-example>

открыто `MessageService` и замените его содержимое следующим.

<code-example header = "src/app/message.service.ts" path="toh-pt4/src/app/message.service.ts">
</code-example>

Сервис выставляет свой кеш `messages` и два метода: от одного до `add()` сообщение в кеш, а другое в `clear()` кеш.

{@a inject-message-service}
{@a inject-it-into-the-heroservice}
### Введите его в `HeroService`

В `HeroService`, импортировать `MessageService`.

<code-example
  header = "src/app/hero.service.ts (import MessageService)"
  path="toh-pt4/src/app/hero.service.ts" region="import-message-service">
</code-example>

Измените конструктор с параметром, который объявляет приватный `messageService` свойство.
Angular будет вводить синглтон `MessageService` в это свойство
когда это создает `HeroService`.

<code-example
  path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor">
</code-example>

<div class="alert is-helpful">

Это типичный « *сервис в обслуживании *сценарий»:
Вы вводите `MessageService` в `HeroService` который вводится в `HeroesComponent`.

</div>

{@a send-a-message-from-heroservice}
### Отправить сообщение от `HeroService`

Изменить `getHeroes()` для отправки сообщения при получении героев.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

{@a display-the-message-from-heroservice}
### Показать сообщение от `HeroService`

 `MessagesComponent` должны отображать все сообщения
включая сообщение, отправленное `HeroService` когда он выбирает героев.

открыто `MessagesComponent` и импортировать `MessageService`.

<code-example header="src/app/messages/messages.component.ts (import MessageService)" path="toh-pt4/src/app/messages/messages.component.ts" region="import-message-service">
</code-example>

Измените конструктор с параметром, который объявляет **открытый** `messageService` свойство.
Angular будет вводить синглтон `MessageService` в это свойство
когда это создает `MessagesComponent`.

<code-example path="toh-pt4/src/app/messages/messages.component.ts" header="src/app/messages/messages.component.ts" region="ctor">
</code-example>

 `messageService` собственность **должна быть открытой, ** потому что вы собираетесь связывать с ним в шаблоне.

<div class="alert is-important">

Angular привязывает только свойства _public_ компонента.

</div>

{@a bind-to-the-messageservice}
### Привязать к `MessageService`

Замените CLI-сгенерированный `MessagesComponent` Шаблон Компонент со следующим.

<code-example
  header = "src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
</code-example>

Этот шаблон привязывается непосредственно к компоненту `messageService`.

* `*ngIf` отображает область сообщений, только если есть сообщения для показа.


* `*ngFor` представляет список сообщений в повторных `<div>` элементы.


* Angular [привязка события](guide/template-syntax#event-binding)связывает событие нажатия кнопки
в `MessageService.clear()`.

Сообщения будут выглядеть лучше, когда вы добавите частные стили CSS в `messages.component.css`
как указано в одной из [«окончательная проверка кода»](#final-code-review)вкладок ниже.

{@a add-additional-messages-to-hero-service}
## Добавьте дополнительные сообщения в сервис героя

В следующем примере показано, как отправлять и отображать сообщение при каждом нажатии пользователем
герой, показывающий историю выборов пользователя. Это будет полезно, когда вы доберетесь до
следующий раздел [Маршрутизация](tutorial/toh-pt5).

<code-example header="src/app/heroes/heroes.component.ts"
path="toh-pt4/src/app/heroes/heroes.component.ts">
</code-example>

Браузер обновится, и на странице отобразится список героев.
Обновите браузер, чтобы увидеть список героев, и прокрутите вниз, чтобы увидеть
сообщения от HeroService. Каждый раз, когда вы нажимаете на героя, появляется новое сообщение для записи
выбор. Используйте кнопку «очистить», чтобы очистить историю сообщений.

{@a final-code-review}

{@a final-code-review}
## Окончательный обзор кода

Вот файлы кода, обсуждаемые на этой странице, и ваше приложение должно выглядеть следующим образом <live-example></live-example>.

<code-tabs>

  <code-pane header="src/app/hero.service.ts"
  path="toh-pt4/src/app/hero.service.ts">
  </code-pane>

  <code-pane header="src/app/message.service.ts"
  path="toh-pt4/src/app/message.service.ts">
  </code-pane>

  <code-pane header="src/app/heroes/heroes.component.ts"
  path="toh-pt4/src/app/heroes/heroes.component.ts">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.ts"
  path="toh-pt4/src/app/messages/messages.component.ts">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
  </code-pane>

  <code-pane header="src/app/messages/messages.component.css"
  path="toh-pt4/src/app/messages/messages.component.css">
  </code-pane>

  <code-pane header="src/app/app.module.ts"
  path="toh-pt4/src/app/app.module.ts">
  </code-pane>

  <code-pane header="src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
  </code-pane>

</code-tabs>

{@a summary}
## Резюме

* Вы изменили доступ к данным `HeroService` класс.
* Вы зарегистрировали `HeroService` как _provider_ его службы на корневом уровне, так что он может быть введен в любом месте приложения.
* Вы использовали [Внедрение Angular зависимости](guide/dependency-injection)чтобы внедрить его в компонент.
* Вы дали `HeroService` _get data_ метод асинхронной подписи.
* Вы обнаружили `Observable` и библиотека RxJS _Observable_.
* Вы использовали RxJS `of()` чтобы вернуть наблюдаемое из насмешливых героев (`Observable<Hero[]>`).
* Компоненты `ngOnInit` жизненного цикла вызывает `HeroService` Метод, а не конструктор.
* Вы создали `MessageService` для слабосвязанной связи между классами.
* `HeroService` в компонент, создается с другим внедренным сервисом
  `MessageService`.
