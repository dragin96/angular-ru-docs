{@a add-services}
# Добавление сервисов

Тур Героев `HeroesComponent` в настоящее время получает и отображает фейковые данные.

После рефакторинга в этом уроке, `HeroesComponent` станет чище и сосредоточится на поддержке читабельности.
Также будет проще проводить модульное тестирование с помощью mock сервиса.

{@a why-services}
## Почему сервисы

Компоненты не должны извлекать или сохранять данные напрямую, и они, конечно, не должны сознательно представлять фейковые данные.
Они должны сосредоточиться на представлении данных и делегировать доступ к данным службе.

В этом уроке вы создадите `HeroService` который все классы приложений могут использовать для получения героев.
Вместо того, чтобы создавать этот сервис при помощи [ключевого слова `new`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new),
вы будете использовать [* внедрение зависимостей *](guide/dependency-injection) на Angular, что бы получить доступ к сервису через конструктор `HeroesComponent`.

Сервисы - отличный способ обмениваться информацией между классами, которые не знают о существовании друг друга.
Вы создадите `MessageService` и внедрите его в двух местах.

1. В HeroService, который использует сервис для отправки сообщения.
2. В MessagesComponent, который отображает это сообщение, а также отображает идентификатор
когда пользователь нажимает на героя.


{@a create-the-heroservice}
## Создание `HeroService`

Используя Angular CLI, создайте сервис под названием `hero`.

<code-example language="sh" class="code-shell">
  ng generate service hero
</code-example>

Команда генерирует скелет `HeroService` класс в `src/app/hero.service.ts` следующим образом :

<code-example path="toh-pt4/src/app/hero.service.1.ts" region="new"
 header="src/app/hero.service.ts (new service)"></code-example>


{@a @ injectable-services}
### `@Injectable()` услуги

Обратите внимание, что новый сервис импортирует Angular `Injectable` символ и выделяет
класс при помощи `@Injectable()` декоратора. Это помечает класс как участвующего в системе внедрения _dependency. Класс `HeroService` будет предоставлять внедряемый сервис, и он также может иметь свои собственные внедренные зависимости.
У него пока нет никаких зависимостей, но [это скоро будет](#inject-message-service).

 `@Injectable()` принимает объект метаданных для службы так же, как и `@Component()` делал это для ваших классов компонентов.

{@a get-hero-data}
### Получение данных о герое

 `HeroService` может получать данные о героях из любого места - веб-службы, локального хранилища или mock-источника данных.

Удаление доступа к данным из компонентов означает, что вы можете в любое время изменить свое решение о реализации, не касаясь каких-либо компонентов.
Они не знают, как работает сервис.

Реализация в этом учебном пособии будет продолжать использовать mock-героев.

Импорт `Hero` и `HEROES`.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="import-heroes">
</code-example>

Добавление `getHeroes` метода для возврата _mock heroes_.

<code-example path="toh-pt4/src/app/hero.service.1.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

{@a provide}
{@a provide-the-heroservice}
## Предоставление `HeroService`

Вы должны сделать `HeroService` доступным для системы внедрения зависимостей
прежде чем Angular сможет _внедрить_ его в `HeroesComponent` путем регистрации _провайдера_. Провайдер - это то, что может создать или предоставить сервис; в нашем случае он создает `HeroService` класс для предоставления сервиса.

Чтобы убедиться, что `HeroService` может предоставить этот сервис, зарегистрируем его
с _injector_, который является объектом, который отвечает за выбор
и внедрение провайдера там, где это требуется приложению.

По умолчанию команда Angular CLI `ng generate service` регистрирует поставщика вместе с _root injector_ для вашего сервиса, включая метаданные провайдера, то есть строка `providedIn: 'root' ` в ` @Injectable()` декораторе.

```
@Injectable({
  providedIn: 'root',
})
```

Когда вы предоставляете сервис на root-уровне, Angular создает один общий экземпляр `HeroService` и внедряет в любой класс, который просит об этом.
Регистрация провайдера в `@Injectable` метаданных также позволяет Angular оптимизировать приложение, удалив службу, если она, в конце концов, не будет использоваться.

<div class="alert is-helpful">

Чтобы узнать больше о провайдерах см [Раздел о провайдерах](guide/providers).
Чтобы узнать больше об injectors, см. [Руководство по внедрению зависимости](guide/dependency-injection).

</div>

 `HeroService` готов к использованию в `HeroesComponent`.

<div class="alert is-important">

Это временный пример кода, который позволит вам предоставить и использовать `HeroService` . На данный момент код будет отличаться от `HeroService` на [«окончательной стадии»](#final-code-review).

</div>


{@a update-heroescomponent}
## Обновление `HeroesComponent`

Откройте `HeroesComponent` файл класса.

Удалите `HEROES` import, потому что вам это больше не понадобится.
Импортируйте вместо этого `HeroService`.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts (import HeroService)" region="hero-service-import">
</code-example>

Замените определение свойства `heroes` на простое объявление.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="heroes">
</code-example>

{@a inject}

{@a inject-the-heroservice}
### Внедрение `HeroService`

Добавьте приватный параметр `heroService` типа `HeroService` в конструктор.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="ctor">
</code-example>

Параметр одновременно определяется как приватное свойство `heroService` и как инъекция зависимости `HeroService`.

Когда Angular создает `HeroesComponent`, то система [внедрения зависимости](guide/dependency-injection)
устанавливает параметр `heroService`  для еденичного (singleton) экземпляра `HeroService`.

{@a add-getheroes}
### Добавление `getHeroes()`

Создайте функцию для извлечения героев из сервиса.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="getHeroes">
</code-example>

{@a oninit}

{@a call-it-in-ngoninit}
### Ёе вызов в `ngOnInit()`

Пока ты можешь вызвать `getHeroes()` в конструкторе, это не лучшая практика.

Зарезервируйте конструктор для простой инициализации, такой как привязка параметров конструктора к свойствам.
Конструктор не должен ничего делать.
Конечно, он не должен вызывать функцию, которая отправляет HTTP-запросы на удаленный сервер, как это сделала бы _настоящая_ служба данных.

Вместо этого вызовите `getHeroes()` внутри [хука жизненного цикла * * ngOnInit *](guide/lifecycle-hooks)и
предоставь возможность Angular вызвать `ngOnInit()` в соответствующее время _после_ создания экземпляра `HeroesComponent`.

<code-example path="toh-pt4/src/app/heroes/heroes.component.ts" header="src/app/heroes/heroes.component.ts" region="ng-on-init">
</code-example>

{@a see-it-run}
### Запусти и проверь

После обновления браузера приложение должно работать как прежде,
показывая список героев и подробное описание героя при нажатии на имя героя.

{@a observable-data}
## Observable data

 Метод `HeroService.getHeroes()` имеет _синхронную сигнатуру_,
что подразумевает, что `HeroService` может возвращать героев синхронно.
 `HeroesComponent ` пользуется результатом метода ` getHeroes()` 
как будто герои возвращаются синхронно.

<code-example path="toh-pt4/src/app/heroes/heroes.component.1.ts" header="src/app/heroes/heroes.component.ts" region="get-heroes">
</code-example>

Это не сработает в реальном приложении.
Вам это сходит с рук сейчас, потому что сервис в настоящее время возвращает _mock-героев_.
Но скоро приложение будет загружать героев с удаленного сервера,
что по своей сути является _асинхронной_ операцией.

 `HeroService` должен ждать ответ с сервера,
 `getHeroes()` не может сразу вернуть результат с героями,
и браузер не будет блокировать, пока сервис ожидает.

 `HeroService.getHeroes()` должен иметь некоторую _асинхронную подпись_.

В этом уроке `HeroService.getHeroes()` вернет `Observable`
потому что он в конечном итоге будет использовать Angular метод `HttpClient.get` для выбора героев
и [ `HttpClient.get ()` возвращает `Observable` ](guide/http).

{@a observable-heroservice}
### Observable `HeroService`

 `Observable` является одним из ключевых классов в [библиотеке RxJS](http://reactivex.io/rxjs/).

В [последнем туториале по HTTP](tutorial/toh-pt6), вы узнаете, что Angular методы `HttpClient`  возвращают RxJS `Observable`.
В этом руководстве вы будете симулировать получение данных с сервера с помощью RxJS функции `of()`.

Откройте `HeroService` файл и импортируйте `Observable` и `of` из RxJS.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts (Observable imports)" region="import-observable">
</code-example>

Замените метод `getHeroes()` на следующее:

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes-1"></code-example>

 `of(HEROES) ` возвращает ` Observable<Hero[]>` который производит _одно значение_, массив mock-героев.

<div class="alert is-helpful">

В [туториале по HTTP](tutorial/toh-pt6) вы вызываете `HttpClient.get<Hero[]>()` который также возвращает `Observable<Hero[]>` который производит _одно значение_, массив героев из тела HTTP-ответа.

</div>

{@a subscribe-in-heroescomponent}
### Подписка в `HeroesComponent`

 Метод `HeroService.getHeroes` использовался для возврата `Hero[]`.
Теперь он возвращает `Observable<Hero[]>`.

Это вносит изменения в `HeroesComponent`.

Найдите метод `getHeroes` и замените его следующим кодом
(показан рядом с предыдущей версией для сравнения)

<code-tabs>

  <code-pane header="heroes.component.ts (Observable)"
    path="toh-pt4/src/app/heroes/heroes.component.ts" region="getHeroes">
  </code-pane>

  <code-pane header="heroes.component.ts (Original)"
    path="toh-pt4/src/app/heroes/heroes.component.1.ts" region="getHeroes">
  </code-pane>

</code-tabs>

 `Observable.subscribe()` является критическим отличием.

Предыдущая версия присваивает массив героев свойству компонента `heroes`.
Присваивание происходит _синхронно_, как если бы сервер мог вернуть героев мгновенно
или браузер мог бы заморозить интерфейс, ожидая ответа сервера.

Это не будет работать, когда `HeroService` делает фактические запросы на удаленный сервер.

Новая версия ждет `Observable` возвращает множество героев - которые
может вернуться или сейчас или через несколько минут.
 Метод `subscribe()` передает излучаемый массив в обратный вызов
который присваивается свойству `heroes`.

Этот асинхронный подход будет работать когда
 `HeroService` запрашивает героев с сервера.

{@a show-messages}
## Отображение сообщений

В этом разделе приведены инструкции по следующему:

* добавление `MessagesComponent`, отображающего сообщения приложения в нижней части экрана
* создание инъекций во всем приложении `MessageService` для отправки сообщений, которые будут отображены
* внедрение `MessageService` в `HeroService`
* отображение сообщения, когда `HeroService` успешно извлекает героев

{@a create-messagescomponent}
### Создайте `MessagesComponent`

Используйте CLI для создания `MessagesComponent`.

<code-example language="sh" class="code-shell">
  ng generate component messages
</code-example>

CLI создает файлы компонентов в папке `src/app/messages` и объявит `MessagesComponent` в `AppModule`.

Измените шаблон `AppComponent` для отображения сгенерированного `MessagesComponent`.

<code-example
  header = "src/app/app.component.html"
  path="toh-pt4/src/app/app.component.html">
</code-example>

Вы должны увидеть абзац по умолчанию от `MessagesComponent` внизу страницы.

{@a create-the-messageservice}
### Создание `MessageService`

Используйте CLI для создания `MessageService` в `src/app`.

<code-example language="sh" class="code-shell">
  ng generate service message
</code-example>

Откройте `MessageService` и замените его содержимое на следующее.

<code-example header = "src/app/message.service.ts" path="toh-pt4/src/app/message.service.ts">
</code-example>

Сервис предостявляет свой кеш `messages` и два метода: метод `add()`  для добавления сообщение в кеш, а другой метод `clear()` - для очистки кеша.

{@a inject-message-service}
{@a inject-it-into-the-heroservice}
### Внедрение его в `HeroService`

В сервисе `HeroService` импортируйте `MessageService`.

<code-example
  header = "src/app/hero.service.ts (import MessageService)"
  path="toh-pt4/src/app/hero.service.ts" region="import-message-service">
</code-example>

Измените конструктор с параметром, который объявляет приватное свойство `messageService`.
Angular внедрит синглтон сервис `MessageService` в это свойство
когда создаст `HeroService`.

<code-example
  path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor">
</code-example>

<div class="alert is-helpful">

Это типичный « *service-in-service* сценарий»:
Вы внедряете `MessageService` в `HeroService` который внедряется в `HeroesComponent`.

</div>

{@a send-a-message-from-heroservice}
### Отправка сообщения из `HeroService`

Измените метод `getHeroes()` для отправки сообщения при получении героев.

<code-example path="toh-pt4/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes">
</code-example>

{@a display-the-message-from-heroservice}
### отображение сообщения от `HeroService`

 `MessagesComponent` должен отображать все сообщения
включая сообщение, отправленное `HeroService` когда он запрашивает героев.

Откройте `MessagesComponent` и импортируйте `MessageService`.

<code-example header="src/app/messages/messages.component.ts (import MessageService)" path="toh-pt4/src/app/messages/messages.component.ts" region="import-message-service">
</code-example>

Измените конструктор с параметром, который объявляет **пебличное** свойство `messageService`.
Angular будет внедрять синглтон `MessageService` в это свойство
когда создает `MessagesComponent`.

<code-example path="toh-pt4/src/app/messages/messages.component.ts" header="src/app/messages/messages.component.ts" region="ctor">
</code-example>

 Свойство `messageService` **должно быть публичным, ** потому что мы собираеемся связаться с ним в шаблоне.

<div class="alert is-important">

Angular связывается только с _публичными_ свойствами компонента.

</div>

{@a bind-to-the-messageservice}
### Связывание с `MessageService`

Замените CLI-сгенерированный шаблон `MessagesComponent` на следующий.

<code-example
  header = "src/app/messages/messages.component.html"
  path="toh-pt4/src/app/messages/messages.component.html">
</code-example>

Этот шаблон привязывается непосредственно к свойству `messageService`.

* `*ngIf` отображает область сообщений, только если есть сообщения для показа.


* `*ngFor` представляет список сообщений в повторяющихся `<div>` элементах.


* [Привязка событий](guide/template-syntax#event-binding) Angular связывает событие нажатия кнопки
с методом `MessageService.clear()`.

Сообщения будут выглядеть лучше, когда вы добавите собственные стили CSS в `messages.component.css`
как указано в одном из [«окончательных обзоров кода»](#final-code-review) во вкладках ниже.

{@a add-additional-messages-to-hero-service}
## Добавление дополнительных сообщений в сервис героя

В следующем примере показано, как отправлять и отображать сообщение при каждом нажатии пользователем на
героя, отображая историю выборов пользователя. Это будет полезно, когда вы доберетесь до
следующего раздела [Маршрутизация](tutorial/toh-pt5).

<code-example header="src/app/heroes/heroes.component.ts"
path="toh-pt4/src/app/heroes/heroes.component.ts">
</code-example>

Браузер обновится, и на странице отобразится список героев.
Обновите браузер, чтобы увидеть список героев, и прокрутите вниз, чтобы увидеть
сообщения от HeroService. Каждый раз, когда вы нажимаете на героя, появляется новое сообщение для сохранения
выбора. Используйте кнопку «очистить», чтобы очистить историю сообщений.

{@a final-code-review}

{@a final-code-review}
## Окончательный обзор кода

Вот файлы кода, обсуждаемые на этой странице, и ваше приложение должно выглядеть следующим образом: <live-example></live-example>.

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

* Вы изменили доступ к данным в классе `HeroService`.
* Вы зарегистрировали `HeroService` как _провайдер_ его службы на root-уровне, так что он может быть внедрен в любом месте приложения.
* Вы использовали [Angular Dependecy Injection](guide/dependency-injection) чтобы внедрить его в компонент.
* Вы дали `HeroService`асинхронный метод _get data_.
* Вы изучили `Observable` и библиотека RxJS _Observable_.
* Вы использовали RxJS `of()` чтобы вернуть Observable из mock-героев (`Observable<Hero[]>`).
* Компонент жизненного цикла `ngOnInit` вызывает метод `HeroService`, а не конструктор.
* Вы создали `MessageService` для слабосвязанной связи между классами.
* `HeroService` внедренный в компонент, создается с другим внедренным сервисом
  `MessageService`.
