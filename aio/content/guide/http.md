{@a httpclient}
# HttpClient

Большинство интерфейсных приложений взаимодействуют с серверными службами по протоколу HTTP. Современные браузеры поддерживают два разных API для выполнения HTTP-запросов: `XMLHttpRequest` Интерфейс и `fetch()` API.

 `HttpClient ` в ` @angular/common/http` предлагает упрощенный клиентский API-интерфейс HTTP для приложений Angular
который опирается на `XMLHttpRequest` Интерфейс предоставляется браузерами.
Дополнительные преимущества `HttpClient` включает функции тестируемости, типизированные объекты запросов и ответов, перехват запросов и ответов, `Observable` apis и оптимизированная обработка ошибок.

Вы можете запустить то, <live-example></live-example>что сопровождает это руководство.

<div class="alert is-helpful">

Пример приложения не требует сервера данных.
Это опирается на
[Angular _in-памяти веб-api_](https://github.com/angular/in-memory-web-api/blob/master/README.md),
который заменяет модуль _HttpClient_ `HttpBackend`.
Служба замены имитирует поведение REST-подобного сервера.

Посмотрите на `AppModule` _imports_, чтобы увидеть, как он настроен.

</div>

{@a setup}
## Настройка

Прежде чем вы сможете использовать `HttpClient`, вам нужно импортировать Angular `HttpClientModule`.
Большинство приложений делают это в корне `AppModule`.

<code-example
  path="http/src/app/app.module.ts"
  region="sketch"
  header="app/app.module.ts (excerpt)">
</code-example>

Импортировав `HttpClientModule` в `AppModule`, вы можете ввести `HttpClient` 
в класс приложения, как показано в следующем `ConfigService`.

<code-example
  path="http/src/app/config/config.service.ts"
  region="proto"
  header="app/config/config.service.ts (excerpt)">
</code-example>

{@a requesting-data-from-server}
## Запрос данных с сервера

Приложения часто запрашивают данные JSON с сервера.
Например, приложению может потребоваться файл конфигурации на сервере, `config.json`,
который определяет URL ресурсов.

<code-example
  path="http/src/assets/config.json"
  header="assets/config.json">
</code-example>

 `ConfigService` извлекает этот файл с `get()` метод на `HttpClient`.

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_1"
  header="app/config/config.service.ts (getConfig v.1)">
</code-example>

Компонент, такой как `ConfigComponent`, внедряет `ConfigService` и звонки
 `getConfig` сервиса.

<code-example
  path="http/src/app/config/config.component.ts"
  region="v1"
  header="app/config/config.component.ts (showConfig v.1)">
</code-example>

Поскольку метод службы возвращает `Observable` данные конфигурации
Компонент **подписывается** на возвращаемое значение метода.
Обратный вызов подписки копирует поля данных в компонент `config` объект
который привязан к данным в шаблоне компонента для отображения.

<div class="callout is-helpful">
 <header>Зачем писать сервис? </header>

Этот пример настолько прост, что заманчиво написать `Http.get()` внутри
Сам компонент и пропустить сервис.
Однако на практике доступ к данным редко остается таким простым.
Обычно вам нужно постобработать данные, добавить обработку ошибок и, возможно, некоторую логику повторных попыток
справиться с прерывистой связью.

Компонент быстро становится загроможденным мелочами доступа к данным.
Компонент становится все труднее понять, труднее тестировать, и логика доступа к данным не может быть повторно использована или стандартизирована.

Вот почему рекомендуется отделять представление данных от доступа к данным
инкапсуляция доступа к данным в отдельном сервисе и делегирование этому сервису в
компонент, даже в таких простых случаях, как этот.
</div>

{@a requesting-a-typed-response}
### Запрос печатного ответа

Вы можете структурировать свой `HttpClient` для объявления типа объекта ответа, чтобы сделать использование вывода более простым и более очевидным.
Указание типа ответа действует как утверждение типа во время компиляции.

Чтобы указать тип объекта ответа, сначала определите интерфейс с необходимыми свойствами.
(Используйте интерфейс, а не класс; ответ не может быть автоматически преобразован в экземпляр класса.)

<code-example
  path="http/src/app/config/config.service.ts"
  region="config-interface">
</code-example>

Далее укажите этот интерфейс как `HttpClient.get()` типа вызова в службе.

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_2"
  header="app/config/config.service.ts (getConfig v.2)">
</code-example>

<div class="alert is-helpful">

Когда вы передаете интерфейс в качестве параметра типа `HttpClient.get()`, используйте RxJS `map` оператор для преобразования данных ответа в соответствии с требованиями пользовательского интерфейса. Затем вы можете передать преобразованные данные в [асинхронный канал](api/common/AsyncPipe).

</div>

Обратный вызов в обновленном методе компонента получает типизированный объект данных, который является
проще и безопаснее потреблять

<code-example
  path="http/src/app/config/config.component.ts"
  region="v2"
  header="app/config/config.component.ts (showConfig v.2)">
</code-example>

<div class="alert is-important">

Указание типа ответа - это объявление TypeScript, что он должен ожидать, что ваш ответ будет иметь заданный тип.
Это проверка во время сборки и не гарантирует, что сервер действительно ответит объектом этого типа. Это зависит от сервера, чтобы гарантировать, что тип, указанный серверным API, возвращен.

</div>

Чтобы получить доступ к свойствам, которые определены в интерфейсе, вы должны явно преобразовать Объект, полученный из JSON, в требуемый тип ответа.
Например, следующее `subscribe` обратный звонок получает `data` как объект, а затем приведите их к типу для доступа к свойствам.

<code-example>
   .subscribe(data => this.config = {
    heroesUrl: (data as any).heroesUrl,
    textfile: (data as any).textfile,
   });
</code-example>


{@a reading-the-full-response}
### Читая полный ответ

Тело ответа не возвращает все данные, которые вам могут понадобиться. Иногда серверы возвращают специальные заголовки или коды состояния, чтобы указать определенные условия, важные для рабочего процесса приложения.

сказать `HttpClient` что вы хотите полный ответ с `observe` вариант:

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfigResponse">
</code-example>

Сейчас `HttpClient.get()` возвращает `Observable` типа `HttpResponse` а не только данные JSON.

Компоненты `showConfigResponse()` метод отображает заголовки ответа, а также конфигурации:

<code-example
  path="http/src/app/config/config.component.ts"
  region="showConfigResponse"
  header="app/config/config.component.ts (showConfigResponse)"
 >
</code-example>

Как видите, объект ответа имеет `body` свойство правильного типа.

{@a making-a-jsonp-request}
### Создание запроса JSONP

Приложения могут использовать `HttpClient` для выполнения [JSONP](https://en.wikipedia.org/wiki/JSONP)запросов между доменами, когда сервер не поддерживает [протокол CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Angular запросы JSONP возвращают `Observable`.
Следуйте шаблону для подписки на наблюдаемые и используйте RxJS `map` оператор для преобразования ответа перед использованием [асинхронный канал](api/common/AsyncPipe)для управления результатами.

В Angular используйте JSONP, включив `HttpClientJsonpModule` в `NgModule` импорт.
В следующем примере `searchHeroes()` использует запрос JSONP для запроса героев, имена которых содержат поисковый термин.

```ts
/* GET heroes whose name contains search term*/
searchHeroes(term: string): Observable {
  term = term.trim();

  let heroesURL = `${this.heroesURL}?${term}` ;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
};
```

Этот запрос проходит `heroesURL` в качестве первого параметра и имя функции обратного вызова в качестве второго параметра.
Ответ обернут в функцию обратного вызова, которая берет наблюдаемые значения, возвращаемые методом JSONP, и передает их через обработчик ошибок.

{@a requesting-non-json-data}
### Запрос данных не в формате JSON

Не все API возвращают данные JSON.
В следующем примере `DownloaderService` Метод читает текстовый файл с сервера и записывает содержимое файла перед возвратом этого содержимого вызывающей стороне как `Observable<string>`.

<code-example
  path="http/src/app/downloader/downloader.service.ts"
  region="getTextFile"
  header="app/downloader/downloader.service.ts (getTextFile)" linenums="false">
</code-example>

 `HttpClient.get()` возвращает строку, а не JSON по умолчанию из-за `responseType` опция.

RxJS `tap` оператор (как в «wiretap») позволяет коду проверять как успешные, так и ошибочные значения, проходящие через наблюдаемые, не нарушая их.

 `download()` метод в `DownloaderComponent` инициирует запрос, подписавшись на метод обслуживания.

<code-example
  path="http/src/app/downloader/downloader.component.ts"
  region="download"
  header="app/downloader/downloader.component.ts (download)" linenums="false">
</code-example>

{@a error-handling}
## Обработка ошибок

Что произойдет, если запрос не будет выполнен на сервере или если плохое сетевое соединение не позволяет ему достичь сервера? `HttpClient` вернет объект _error_ вместо успешного ответа.

Вы можете обработать компонент, добавив второй обратный вызов в `.subscribe()` :

<code-example
  path="http/src/app/config/config.component.ts"
  region="v3"
  header="app/config/config.component.ts (showConfig v.3 with error handling)"
 >
</code-example>

Конечно, это хорошая идея, чтобы дать пользователю некоторую обратную связь, когда доступ к данным не удается.
Но отображение необработанного объекта ошибки, возвращенного `HttpClient` далеко не лучший способ сделать это.

{@a error-details}
{@a getting-error-details}
### Получение информации об ошибке

Обнаружение того, что произошла ошибка, это одно.
Интерпретация этой ошибки и составление удобного для пользователя ответа немного сложнее.

Могут возникнуть два типа ошибок. Серверная часть сервера может отклонить запрос, вернув HTTP-ответ с кодом состояния, например 404 или 500. Это ошибка _responses_.

Или что-то может пойти не так на стороне клиента, например, сетевая ошибка, которая мешает успешному завершению запроса, или исключение, выданное в операторе RxJS. Эти ошибки создают JavaScript `ErrorEvent` Объекты.

 `HttpClient` фиксирует оба вида ошибок в своем `HttpErrorResponse` и вы можете проверить этот ответ, чтобы выяснить, что на самом деле произошло.

Осмотр ошибки, интерпретация и разрешение является то, что вы хотите сделать в _service_,
не в _component_.

Вы могли бы сначала разработать обработчик ошибок, как этот:

<code-example
  path="http/src/app/config/config.service.ts"
  region="handleError"
  header="app/config/config.service.ts (handleError)">
</code-example>

Обратите внимание, что этот обработчик возвращает RxJS [ErrorObservable](#rxjs)с удобным сообщением об ошибке.
Потребители сервиса ожидают, что сервисные методы вернут `Observable` какой - то,
даже «плохой».

Теперь вы берете `Observables` возвращаемые `HttpClient` методы
и _pipe их через_ к обработчику ошибок.

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig_3"
  header="app/config/config.service.ts (getConfig v.3 with error handler)">
</code-example>

{@a retrying}
### Повторная попытка

Иногда ошибка временная и исчезнет автоматически, если вы попытаетесь снова.
Например, сбои в работе сети распространены в мобильных сценариях и пытаются снова
может дать успешный результат.

[Библиотека RxJS](#rxjs)предлагает несколько операторов _retry_, которые стоит изучить.
Самое простое называется `retry()` и он автоматически повторно подписывается на сбой `Observable` указанное количество раз. _Повторная подписка_ на результат `HttpClient` метода HTTP-запроса.

_Pipe_ это на `HttpClient` метода перед обработчиком ошибок.

<code-example
  path="http/src/app/config/config.service.ts"
  region="getConfig"
  header="app/config/config.service.ts (getConfig with retry)">
</code-example>

{@a rxjs}
{@a observables-and-operators}
## Наблюдаемые и операторы

Предыдущие разделы этого руководства относились к RxJS `Observables` и операторы, такие как `catchError` и `retry`.
По мере продолжения ниже вы встретите больше артефактов RxJS.

[RxJS](http://reactivex.io/rxjs/)- это библиотека для составления асинхронного и обратного вызова кода
в функциональном, реактивном стиле.
Многие Angular API, в том числе `HttpClient`, производить и потреблять RxJS `Observables`.

Сам RxJS выходит за рамки этого руководства. Вы найдете много учебных ресурсов в Интернете.
Хотя вы можете обойтись с минимумом знаний RxJS, вы захотите со временем развивать свои навыки RxJS, чтобы использовать `HttpClient` эффективно.

Если вы следуете этим фрагментам кода, обратите внимание, что вы должны импортировать наблюдаемые и операторные символы RxJS, которые появляются в этих фрагментах. Эти `ConfigService` Импорт является типичным.

<code-example
  path="http/src/app/config/config.service.ts"
  region="rxjs-imports"
  header="app/config/config.service.ts (RxJS imports)">
</code-example>

{@a http-headers}
## Заголовки HTTP

Многие серверы требуют дополнительных заголовков для операций сохранения.
Например, им может потребоваться заголовок «Content-Type» для явного объявления типа MIME тела запроса; или серверу может потребоваться токен авторизации.

{@a adding-headers}
### Добавление заголовков

 `HeroesService` определяет такие заголовки в `httpOptions` Объект который будет передан
каждому `HttpClient` метод сохранения.

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="http-options"
  header="app/heroes/heroes.service.ts (httpOptions)">
</code-example>

{@a updating-headers}
### Обновление заголовков

Вы не можете напрямую изменять существующие заголовки в предыдущих опциях
объект, потому что экземпляры `HttpHeaders` Класс является неизменным.

Использовать `set()` Вместо этого используйте метод, чтобы вернуть клон текущего экземпляра с примененными новыми изменениями.

Вот как вы можете обновить заголовок авторизации (после истечения срока действия старого токена) перед выполнением следующего запроса.

<code-example
  path="http/src/app/heroes/heroes.service.ts"
   region="update-headers" linenums="false">
</code-example>

{@a sending-data-to-the-server}
## Отправка данных на сервер

В дополнение к извлечению данных с сервера, `HttpClient` поддерживает мутирующие запросы, то есть отправку данных на сервер с помощью других методов HTTP, таких как PUT, POST и DELETE.

Пример приложения для этого руководства включает в себя упрощенную версию примера «Тур героев»
который выбирает героев и позволяет пользователям добавлять, удалять и обновлять их.

В следующих разделах приведены выдержки из методов образца `HeroesService`.

{@a making-a-post-request}
### Создание POST-запроса

Приложения часто отправляют данные на сервер. Они отправляют при отправке формы.
В следующем примере `HeroesService` сообщения при добавлении героя в базу данных.

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="addHero"
  header="app/heroes/heroes.service.ts (addHero)">
</code-example>

 `HttpClient.post()` похож на `get()` в том смысле, что у него есть параметр типа
(вы ожидаете, что сервер вернет нового героя)
и он берет URL ресурса.

Требуется еще два параметра:

1. `hero` - данные для POST в теле запроса.
1. `httpOptions` - параметры метода, которые в данном случае [укажите необходимые заголовки](#adding-headers).

Конечно, он ловит ошибки почти таким же образом [описано выше](#error-details).

 `HeroesComponent` инициирует фактическую операцию POST, подписавшись на
 `Observable` возвращается этим методом обслуживания.

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="add-hero-subscribe"
  header="app/heroes/heroes.component.ts (addHero)">
</code-example>

Когда сервер успешно отвечает вновь добавленным героем, компонент добавляет
этот герой на показ `heroes` список.

{@a making-a-delete-request}
### Делать запрос УДАЛИТЬ

Это приложение удаляет героя с `HttpClient.delete` Метод путем передачи идентификатора героя
в URL запроса.

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="deleteHero"
  header="app/heroes/heroes.service.ts (deleteHero)">
</code-example>

 `HeroesComponent` инициирует фактическую операцию УДАЛИТЬ, подписавшись на
 `Observable` возвращается этим методом обслуживания.

<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-subscribe"
  header="app/heroes/heroes.component.ts (deleteHero)">
</code-example>

Компонент не ожидает результата от операции удаления, поэтому он подписывается без обратного вызова. Даже если вы не используете результат, вы все равно должны подписаться. Вызов `subscribe()` Метод _executes_ наблюдаемого, который инициирует запрос DELETE.

<div class="alert is-important">

Вы должны вызвать _subscribe () _ или ничего не происходит. Просто звоню `HeroesService.deleteHero()` **не инициирует запрос DELETE.**

</div>


<code-example
  path="http/src/app/heroes/heroes.component.ts"
  region="delete-hero-no-subscribe">
</code-example>

{@a always-subscribe}
**Всегда _subscribe_!**

 `HttpClient` Метод не начинает свой HTTP-запрос, пока вы не `subscribe()` на наблюдаемое, возвращаемое этим методом. Это верно для _все_ `HttpClient` _methods_.

<div class="alert is-helpful">

В [ `AsyncPipe` ](api/common/AsyncPipe)выписывает (и отписывается) для вас автоматически.

</div>

Все наблюдаемые вернулись из `HttpClient` метода _cold_ конструкции.
Выполнение HTTP-запроса _deferred_, что позволяет вам расширить
наблюдаемый с дополнительными операциями, такими как `tap ` и ` catchError` прежде чем что-то действительно произойдет.

призвание `subscribe(...)` запускает выполнение наблюдаемых и причин
 `HttpClient` для создания и отправки HTTP-запроса на сервер.

Вы можете думать об этих наблюдаемых как _blueprints_ для фактических запросов HTTP.

<div class="alert is-helpful">

На самом деле, каждый `subscribe()` инициирует отдельное, независимое выполнение наблюдаемого.
Подписка дважды приводит к двум запросам HTTP.

```javascript
const req = http.get<Heroes>('/api/heroes');
// 0 requests made - .subscribe() not called.
req.subscribe();
// 1 request made.
req.subscribe();
// 2 requests made.
```
</div>

{@a making-a-put-request}
### Делать запрос PUT

Приложение отправит запрос PUT, чтобы полностью заменить ресурс обновленными данными.
Последующий `HeroesService` такой же, как пример POST.

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="updateHero"
  header="app/heroes/heroes.service.ts (updateHero)">
</code-example>

По причинам [объясненным выше](#always-subscribe)вызывающая сторона ( `HeroesComponent.update()` в этом случае) должен `subscribe()` на наблюдаемое возвращается из `HttpClient.put()` 
для того, чтобы инициировать запрос.

{@a advanced-usage}
## Расширенное использование

Мы обсудили основные функции HTTP в `@angular/common/http`, но иногда вам нужно делать больше, чем просто запрашивать и возвращать данные.

{@a intercepting-requests-and-responses }
{@a http-interceptors}
### HTTP перехватчики

_HTTP Перехват_ является основной функцией `@angular/common/http`.
При перехвате вы объявляете _interceptors_, которые проверяют и преобразуют HTTP-запросы от вашего приложения к серверу.
Те же перехватчики могут также проверять и преобразовывать ответы сервера по пути обратно в приложение.
Несколько перехватчиков образуют цепочку обработчиков запросов / ответов _forward-and-backward_.

Перехватчики могут выполнять различные _implicit_ задачи, от проверки подлинности до регистрации обычным, стандартным способом для каждого HTTP-запроса / ответа.

Без перехвата разработчики должны будут выполнять эти задачи явным образом
для каждого `HttpClient` метода.

{@a write-an-interceptor}
#### Написать перехватчик

Чтобы реализовать перехватчик, объявите класс, который реализует `intercept()` метод `HttpInterceptor` Интерфейс.

Вот делать-ничего _noop_ перехватчик, который просто передает запрос через не прикасаясь к нему:
<code-example
  path="http/src/app/http-interceptors/noop-interceptor.ts"
  header="app/http-interceptors/noop-interceptor.ts">
</code-example>

 `intercept` метод превращает запрос в `Observable` который в конечном счете возвращает ответ HTTP.
В этом смысле каждый перехватчик полностью способен обрабатывать запрос самостоятельно.

Большинство перехватчиков проверяют запрос на входе и направляют (возможно, измененный) запрос `handle()` метод `next` объект, который реализует [ `HttpHandler` ](api/common/http/HttpHandler)интерфейс.

```javascript
export abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
```

подобно `intercept()`, `handle()` Метод преобразует HTTP-запрос в `Observable` из [ `HttpEvents` ](#httpevents)которые в конечном счете, включают в себя ответ сервера. `intercept()` Метод может проверить это и изменить его, прежде чем вернуть вызывающему.

Этот _no-op_ перехватчик просто вызывает `next.handle()` с исходным запросом и возвращает наблюдаемое, ничего не делая.

{@a the-next-object}
#### _Next_ объект

 `next` объект представляет следующий перехватчик в цепочке перехватчиков.
Финал `next` в цепочке является `HttpClient` обработчик который отправляет запрос на сервер и получает ответ от сервера.


Большинство перехватчиков звонят `next.handle()` чтобы запрос проходил через следующий перехватчик и, в конце концов, обработчик бэкэнда.
Перехватчик _could_ пропустить вызов `next.handle()` цепь и [возвращает свой собственный `Observable` ](#caching)с искусственным ответом сервера.

Это общий шаблон промежуточного программного обеспечения, встречающийся в таких средах, как Express.js.

{@a provide-the-interceptor}
#### Обеспечить перехватчик

 `NoopInterceptor` - это сервис, управляемый системой Angular [внедрение зависимостей (DI)](guide/dependency-injection).
Как и другие сервисы, вы должны предоставить класс-перехватчик, прежде чем приложение сможет его использовать.

Поскольку перехватчики являются (необязательными) зависимостями `HttpClient` обслуживание,
Вы должны предоставить их в том же инжекторе (или родителе инжектора), который обеспечивает `HttpClient`.
Перехватчики, предоставляемые _after_ DI создает `HttpClient` игнорируются.

Это приложение обеспечивает `HttpClient` в корневом инжекторе приложения, как побочный эффект импорта `HttpClientModule` в `AppModule`.
Вы должны предоставить перехватчики в `AppModule` также.

После импорта `HTTP_INTERCEPTORS` токен инъекции от `@angular/common/http`,
написать `NoopInterceptor` провайдер, как это:

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="noop-provider">
</code-example>

Обратите внимание `multi: true` вариант.
Эта обязательная настройка сообщает Angular, что `HTTP_INTERCEPTORS` - это токен для _multiprovider_
который вводит массив значений, а не одно значение.

Вы можете добавить этого провайдера непосредственно в массив провайдеров `AppModule`.
Тем не менее, это довольно многословно, и есть хороший шанс, что
Вы создадите больше перехватчиков и предоставите их таким же образом.
Вы также должны заплатить [пристальное внимание к заказу](#interceptor-order)
в котором вы предоставляете эти перехватчики.

Подумайте о создании файла "бочек", который собирает всех провайдеров-перехватчиков в `httpInterceptorProviders` массив, начиная с этого первого, `NoopInterceptor`.

<code-example
  path="http/src/app/http-interceptors/index.ts"
  region="interceptor-providers"
  header="app/http-interceptors/index.ts">
</code-example>

Затем импортируйте и добавьте его в `AppModule` _providers array_ как это:

<code-example
  path="http/src/app/app.module.ts"
  region="interceptor-providers"
  header="app/app.module.ts (interceptor providers)">
</code-example>

По мере создания новых перехватчиков добавляйте их в `httpInterceptorProviders` массив и
вам не придется возвращаться к `AppModule`.

<div class="alert is-helpful">

В полном примере кода есть еще много перехватчиков.

</div>

{@a interceptor-order}
#### Заказ перехватчика

Angular применяет перехватчики в том порядке, в котором вы их предоставляете.
Если вы предоставите перехватчики _A_, то _B_, затем _C_, запросы будут поступать в _A-> B-> C_ и
ответы будут вытекать _C-> B-> A_.

Вы не можете изменить порядок или удалить перехватчики позже.
Если вам нужно динамически включать и отключать перехватчик, вам придется встроить эту возможность в сам перехватчик.

{@a httpevents}
#### _HttpEvents_

Вы могли ожидать `intercept()` и `handle()` методы для возврата наблюдаемых `HttpResponse<any>` как большинство `HttpClient` Методы делают.

Вместо этого они возвращают наблюдаемые `HttpEvent<any>`.

Это потому, что перехватчики работают на более низком уровне, чем те, `HttpClient` методы. Один HTTP-запрос может генерировать несколько _events_, включая события загрузки и выгрузки. `HttpResponse` Сам класс самом деле является событием, тип которого `HttpEventType.Response`.

Многие перехватчики имеют дело только с исходящим запросом и просто возвращают поток событий из `next.handle()` без изменения.

Но перехватчики, которые проверяют и модифицируют ответ от `next.handle()` 
увидим все эти события.
Ваш перехватчик должен возвратить _every событие нетронутым_, если у него нет веской причины сделать иначе.

{@a immutability}
#### Неизменность

Хотя перехватчики могут изменять запросы и ответы
 `HttpRequest ` и ` HttpResponse` Свойства экземпляра `readonly`,
делая их в значительной степени неизменными.

Они являются неизменными по уважительной причине: приложение может повторить запрос несколько раз, прежде чем он будет выполнен успешно, что означает, что цепочка перехватчиков может повторно обработать один и тот же запрос несколько раз.
Если перехватчик может изменить исходный объект запроса, повторная попытка будет начинаться с измененного запроса, а не с исходного. Неизменность гарантирует, что перехватчики видят один и тот же запрос для каждой попытки.

TypeScript помешает вам настроить `HttpRequest` чтения свойств.

```javascript
  // Typescript disallows the following assignment because req.url is readonly
  req.url = req.url.replace('http://', 'https://');
```
Чтобы изменить запрос, сначала клонируйте его и измените клон, прежде чем передать его `next.handle()`.
Вы можете клонировать и изменить запрос за один шаг, как в этом примере.

<code-example
  path="http/src/app/http-interceptors/ensure-https-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/ensure-https-interceptor.ts (excerpt)">
</code-example>

 `clone()` Аргумент hash метода позволяет изменять определенные свойства запроса при копировании других.

{@a the-request-body}
##### Тело запроса

 `readonly` охранник назначения не могут предотвратить глубокие обновления и, в частности,
это не может помешать вам изменить свойство объекта тела запроса.

```javascript
  req.body.name = req.body.name.trim(); // bad idea!
```

Если вы должны мутировать тело запроса, скопируйте его первым, измените копию,
 `clone()` запрос и установите тело клона с новым телом, как в следующем примере.

<code-example
  path="http/src/app/http-interceptors/trim-name-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/trim-name-interceptor.ts (excerpt)">
</code-example>

{@a clearing-the-request-body}
##### Очистка тела запроса

Иногда вам нужно очистить тело запроса, а не заменить его.
Если вы установите клонированное тело запроса в `undefined`, Angular предполагает, что вы собираетесь оставить тело как есть.
Это не то, что вы хотите.
Если вы установите клонированное тело запроса в `null`, Angular знает, что вы намерены очистить тело запроса.

```javascript
  newReq = req.clone({ ... }); // body not mentioned => preserve original body
  newReq = req.clone({ body: undefined }); // preserve original body
  newReq = req.clone({ body: null }); // clear the body
```

{@a set-default-headers}
#### Установить заголовки по умолчанию

Приложения часто используют перехватчик для установки заголовков по умолчанию для исходящих запросов.

Образец приложения имеет `AuthService` который создает токен авторизации.
Вот ее `AuthInterceptor` который внедряет этот сервис для получения токена и
добавляет заголовок авторизации с этим маркером для каждого исходящего запроса:

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  header="app/http-interceptors/auth-interceptor.ts">
</code-example>

Практика клонирования запроса для установки новых заголовков настолько распространена, что
есть `setHeaders` ярлык для этого:

<code-example
  path="http/src/app/http-interceptors/auth-interceptor.ts"
  region="set-header-shortcut">
</code-example>

Перехватчик, которая изменяет заголовки могут быть использованы для ряда различных операций, в том числе:

* Аутентификация / авторизация
* Кеширование поведения; например, `If-Modified-Since` 
* XSRF защита

{@a logging}
#### Logging

Поскольку перехватчики могут обрабатывать запрос и ответ _together_, они могут делать такие вещи, как время и журнал
вся операция HTTP.

Рассмотрим следующее `LoggingInterceptor`, который фиксирует время запроса
время ответа и записывает результат с истекшим временем
с введенным `MessageService`.

<code-example
  path="http/src/app/http-interceptors/logging-interceptor.ts"
  region="excerpt"
  header="app/http-interceptors/logging-interceptor.ts)">
</code-example>

RxJS `tap` оператор фиксирует, был ли запрос успешным или нет.
RxJS `finalize` Оператор вызывается, когда наблюдаемый ответ либо ошибается, либо завершается (что он должен)
и сообщает результат `MessageService`.

ни `tap` ни `finalize` коснитесь значений наблюдаемого потока, возвращаемого вызывающей стороне.

{@a caching}
#### Кэширование

Перехватчики могут обрабатывать запросы самостоятельно, без пересылки `next.handle()`.

Например, вы можете решить кэшировать определенные запросы и ответы для повышения производительности.
Вы можете делегировать кэширование перехватчику, не нарушая существующие службы данных.

 `CachingInterceptor` демонстрирует этот подход.

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="v1"
  header="app/http-interceptors/caching-interceptor.ts)">
</code-example>

 `isCachable()` определяет, является ли запрос кэшируемым.
В этом примере кэшируются только запросы GET к API поиска пакетов npm.

Если запрос не кэшируется, перехватчик просто перенаправляет запрос
к следующему обработчику в цепочке.

Если в кэше найден кэшируемый запрос, перехватчик возвращает `of()` _observable_ с
кэшированный ответ, минуя `next` обработчик (и все остальные перехватчики в нисходящем направлении).

Если кэшируемый запрос не находится в кеше, код вызывает `sendRequest`.

{@a send-request}
<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="send-request">
</code-example>

 `sendRequest` Функция создает [клон запроса](#immutability)без заголовков
потому что npm api запрещает их.

Он направляет этот запрос `next.handle()` который в конечном итоге вызывает сервер и
возвращает ответ сервера.

Обратите внимание, как `sendRequest` _ответ_ по пути обратно в приложение.
Это _pipes_ ответ через `tap()` оператор
чей обратный вызов добавляет ответ в кэш.

Первоначальный ответ остается нетронутым обратно через цепочку перехватчиков
в приложение звонящего.

Услуги передачи данных, такие как `PackageSearchService`, не знают этого
некоторые из их `HttpClient` фактически возвращают кэшированные ответы.

{@a cache-refresh}
{@a return-a-multi-valued-observable}
#### Вернуть многозначный _Observable_

 `HttpClient.get()` обычно возвращает _observable_
либо выдает данные, либо ошибку.
Некоторые люди описывают это как "_one and done_" наблюдаемый.

Но перехватчик может изменить это на _observable_, который излучает более одного раза.

Пересмотренная версия `CachingInterceptor` необязательно возвращает _observable_ это
немедленно отправляет кэшированный ответ, в любом случае отправляет запрос в веб-API NPM
и испускает снова позже с обновленными результатами поиска.

<code-example
  path="http/src/app/http-interceptors/caching-interceptor.ts"
  region="intercept-refresh">
</code-example>

_Cache-то-refresh_ вариант срабатывает при наличии **обычая `x-refresh` header**.

<div class="alert is-helpful">

Флажок на `PackageSearchComponent` переключает `withRefresh` Флаг с
что является одним из аргументов `PackageSearchService.search()`.
Это `search()` Метод создает пользовательский `x-refresh` header
и добавляет его в запрос перед звонком `HttpClient.get()`.

</div>

Пересмотренный `CachingInterceptor` устанавливает запрос к серверу
есть ли значение в кэше или нет,
используя тот же `sendRequest()` описан [выше](#send-request).
 `results$` observable сделают запрос при подписке.

Если нет кэшированного значения, перехватчик возвращает `results$`.

Если есть кэшированное значение, код _pipes_ на кэшированный ответ
 `results$`, производя воссозданные наблюдаемым, что излучает в два раза,
сначала кэшированный ответ (и сразу), а затем позже
по ответу с сервера.
Подписчики видят последовательность _two_ ответов.

{@a configuring-the-request}
### Настройка запроса

Другие аспекты исходящего запроса могут быть настроены через объект параметров
передан в качестве последнего аргумента `HttpClient` метод.

В [Добавление заголовков](#adding-headers), то `HeroesService` устанавливает заголовки по умолчанию
передача объекта параметров (`httpOptions`) к его методам сохранения.
Вы можете сделать больше.

{@a url-query-strings}
#### Строки запроса URL

В этом разделе вы увидите, как использовать `HttpParams` Класс для добавления строк запроса URL в ваш `HttpRequest`.

Последующий `searchHeroes` Метод запрашивает героев, имена которых содержат поисковый запрос.
Начните с импорта `HttpParams` Класс.

<code-example hideCopy language="typescript">
import {HttpParams} from "@angular/common/http";
</code-example>

<code-example
  path="http/src/app/heroes/heroes.service.ts"
  region="searchHeroes" linenums="false">
</code-example>

Если есть критерий поиска, код создает объект параметров с параметром поиска в HTML-кодировке.
Если бы термин был «foo», URL запроса GET был бы `api/heroes?name=foo`.

 `HttpParams` являются неизменяемыми, поэтому вам придется сохранить возвращаемое значение `.set()` Метод для обновления параметров.

{@a use-fromstring-to-create-httpparams}
#### использование `fromString` для создания HttpParams

Вы также можете создавать параметры HTTP непосредственно из строки запроса, используя `fromString` переменной:

<code-example hideCopy language="typescript">
const params = new HttpParams({fromString: 'name=foo'});
</code-example>

{@a debouncing-requests}
### Отмена запросов

Образец включает функцию поиска пакета _npm.

Когда пользователь вводит имя в поле поиска, `PackageSearchComponent` отправляет
поисковый запрос для пакета с таким именем в веб-API NPM.

Вот Уместно отрывок из шаблона:

<code-example
  path="http/src/app/package-search/package-search.component.html"
  region="search"
  header="app/package-search/package-search.component.html (search)">
</code-example>

 `keyup` Привязка события отправляет каждое нажатие клавиши на компонент `search()` метод.

Отправка запроса на каждое нажатие клавиши может быть дорогой.
Лучше подождать, пока пользователь перестанет печатать, а затем отправить запрос.
Это легко реализовать с помощью операторов RxJS, как показано в этом отрывке.

<code-example
  path="http/src/app/package-search/package-search.component.ts"
  region="debounce"
  header="app/package-search/package-search.component.ts (excerpt)">
</code-example>

 `searchText$` - это последовательность значений окна поиска, поступающих от пользователя.
Это определяется как RxJS `Subject`, что означает, что это многоадресная рассылка `Observable` 
который также может выдавать значения для себя, вызывая `next(value)`,
как это происходит в `search()` метод.

Вместо того, чтобы пересылать каждый `searchText` значение непосредственно для введенного `PackageSearchService`,
код в `ngOnInit()` _pipes_ поиск значений через три оператора:

1. `debounceTime(500)` - ждать, пока пользователь прекратит печатать (в нашем случае 1/2 секунды).

2. `distinctUntilChanged()` - дождаться изменения текста поиска.

3. `switchMap()` - отправить поисковый запрос в сервис.

Наборы кодов `packages$` к этой перекомпоновке `Observable` результаты поиска.
Шаблон подписывается на `packages$` с [Пакет AsyncPipe](api/common/AsyncPipe)
и отображает результаты поиска по мере их поступления.

Значение поиска достигает службы только в том случае, если это новое значение и пользователь прекратил печатать.

<div class="alert is-helpful">

 `withRefresh` поясняется [ниже](#cache-refresh).

</div>

{@a switchmap}
#### _switchMap () _

 `switchMap()` имеет три важных характеристики.

1. Он принимает аргумент функции, который возвращает `Observable`.
 `PackageSearchService.search ` возвращает ` Observable`, как и другие методы обслуживания данных.

2. Если запрос на предыдущий поиск еще _in-flight_ (например, когда сетевое соединение плохое),
он отменяет этот запрос и отправляет новый.

3. Он возвращает сервисные ответы в исходном порядке запроса, даже если
сервер возвращает их не в порядке.

<div class="alert is-helpful">

Если вы думаете, что вы будете повторно использовать эту дребезгу логику
рассмотреть возможность перемещения его в функцию полезности или в `PackageSearchService` Сам.

</div>

{@a listening-to-progress-events}
### Прослушивание событий прогресса

Иногда приложения передают большие объемы данных, и эти передачи могут занимать много времени.
Загрузка файлов является типичным примером.
Предоставьте пользователям лучший опыт, предоставляя отзывы о ходе таких переводов.

Чтобы сделать запрос с включенными событиями прогресса, вы можете создать экземпляр `HttpRequest` 
с `reportProgress` true, чтобы включить отслеживание событий прогресса.

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-request"
  header="app/uploader/uploader.service.ts (upload request)">
</code-example>

<div class="alert is-important">

Каждое событие прогресса вызывает обнаружение изменений, поэтому включайте их, только если вы действительно хотите сообщить о прогрессе в пользовательском интерфейсе.

При использовании [ `HttpClient # request ()` ](api/common/http/HttpClient#request)с методом HTTP настройте с помощью
[ `наблюдай: 'события'` ](api/common/http/HttpClient#request)чтобы увидеть все события, включая ход переводов.

</div>

Затем передайте этот объект запроса `HttpClient.request()` метод, который
возвращает `Observable` из `HttpEvents`, один и то же событие, обрабатываемые перехватчики:

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="upload-body"
  header="app/uploader/uploader.service.ts (upload body)">
</code-example>

 `getEventMessage` Метод интерпретирует каждый тип `HttpEvent` в потоке событий.

<code-example
  path="http/src/app/uploader/uploader.service.ts"
  region="getEventMessage"
  header="app/uploader/uploader.service.ts (getEventMessage)">
</code-example>

<div class="alert is-helpful">

Пример приложения для этого руководства не имеет сервера, который принимает загруженные файлы.
 `UploadInterceptor ` в ` app/http-interceptors/upload-interceptor.ts` 
перехватывает и закачивает запросы на загрузку
возвращая наблюдаемую из смоделированных событий.

</div>

{@a security-xsrf-protection}
## Безопасность: защита XSRF

[Подделка межсайтовых запросов (XSRF или CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery)- это метод атаки, с помощью которого злоумышленник может обманным путем обмануть аутентифицированного пользователя, выполняя действия на вашем сайте.
 `HttpClient` поддерживает [общий механизм](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-Header_Token)используемый для предотвращения атак XSRF.
При выполнении HTTP-запросов по умолчанию перехватчик считывает токен из файла cookie. `XSRF-TOKEN` и устанавливает его как заголовок HTTP, `X-XSRF-TOKEN`.
Поскольку только код, выполняемый в вашем домене, может считывать cookie, бэкэнд может быть уверен, что HTTP-запрос поступил от вашего клиентского приложения, а не от злоумышленника.

По умолчанию перехватчик отправляет этот заголовок на все изменяющиеся запросы (такие как POST)
на относительные URL, но не на запросы GET / HEAD или на запросы с абсолютным URL.

Чтобы воспользоваться этим преимуществом, вашему серверу необходимо установить токен в файле cookie для чтения в JavaScript, который называется `XSRF-TOKEN` либо при загрузке страницы, либо при первом запросе GET.
При последующих запросах сервер может проверить, что файл cookie соответствует `X-XSRF-TOKEN` HTTP-заголовок, поэтому убедитесь, что только код, запущенный в вашем домене, мог отправить запрос.
Токен должен быть уникальным для каждого пользователя и должен проверяться сервером; это мешает клиенту создавать свои собственные токены.
Установите для токена дайджест файла cookie аутентификации вашего сайта с солью для дополнительной безопасности.

Чтобы избежать конфликтов в средах, где несколько приложений Angular совместно используют один домен или поддомен, присвойте каждому приложению уникальное имя файла cookie.

<div class="alert is-important">

* `HttpClient` поддерживает только клиентскую половину схемы защиты XSRF.*
Ваш бэкэнд-сервис должен быть настроен так, чтобы устанавливать cookie для вашей страницы и проверять это
заголовок присутствует во всех приемлемых запросах.
Если нет, защита Angular по умолчанию будет неэффективной.

</div>

{@a configuring-custom-cookie/header-names}
### Настройка пользовательских имен файлов cookie / заголовков

Если ваша служба бэкенда использует разные имена для маркеров печенья XSRF или заголовка,
использование `HttpClientXsrfModule.withOptions()` для переопределения значений по умолчанию.

<code-example
  path="http/src/app/app.module.ts"
  region="xsrf">
</code-example>

{@a testing-http-requests}
## Тестирование HTTP-запросов

Как и для любой внешней зависимости, вы должны смоделировать бэкэнд HTTP, чтобы ваши тесты могли имитировать взаимодействие с удаленным сервером.
 `@angular/common/http/testing` Библиотека упрощает настройку подобного макета.

HTTP-библиотека Angular предназначена для тестирования, при котором приложение выполняет код и сначала выполняет запросы.
Затем тест ожидает, что определенные запросы были или не были сделаны
выполняет утверждения против этих запросов
и, наконец, предоставляет ответы путем «сброса» каждого ожидаемого запроса.

В конце тесты могут проверить, что приложение не отправило неожиданные запросы.

<div class="alert is-helpful">

Вы можете запустить <live-example stackblitz="specs">эти примеры тестов </live-example>
в живой среде кодирования.

Тесты, описанные в этом руководстве, находятся в `src/testing/http-client.spec.ts`.
Есть также тесты службы данных приложения, которые вызывают `HttpClient` в
 `src/app/heroes/heroes.service.spec.ts`.

</div>

{@a setup}
### Настройка

Чтобы начать тестирование звонков на `HttpClient`,
импортировать `HttpClientTestingModule` и контроллера, `HttpTestingController`,
наряду с другими символами ваши тесты требуют.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="imports"
  header="app/testing/http-client.spec.ts (imports)">
</code-example>

Затем добавьте `HttpClientTestingModule` для `TestBed` и продолжить
настройка _сервис-под-тест_.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="setup"
  header="app/testing/http-client.spec.ts(setup)">
</code-example>

Теперь запросы, сделанные в ходе ваших тестов, будут попадать в тестовый бэкэнд вместо обычного бэкэнда.

Эта настройка также вызывает `TestBed.inject()` для внедрения `HttpClient` и издевательский контроллер
поэтому на них можно ссылаться во время испытаний.

{@a expecting-and-answering-requests}
### Ожидая и отвечая на запросы

Теперь вы можете написать тест, который ожидает выполнения запроса GET и предоставляет ложный ответ.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="get-test"
  header="app/testing/http-client.spec.ts(httpClient.get)">
</code-example>

Последний шаг, проверка того, что ни один запрос не остался невыполненным, он достаточно распространен, чтобы вы могли поместить его в `afterEach()`:

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="afterEach">
</code-example>

{@a custom-request-expectations}
#### Пользовательский запрос ожиданий

Если сопоставления по URL недостаточно, можно реализовать собственную функцию сопоставления.
Например, вы могли бы искать для исходящего запроса, который имеет заголовок авторизации:

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="predicate">
</code-example>

Как и в предыдущем `expectOne()`,
тест завершится неудачей, если 0 или 2+ запросов удовлетворяют этому предикату.

{@a handling-more-than-one-request}
#### Обработка более одного запроса

Если вам нужно ответить на повторяющиеся запросы в вашем тесте, используйте `match()` API вместо `expectOne()`.
Он принимает те же аргументы, но возвращает массив совпадающих запросов.
После возвращения эти запросы удаляются из будущего соответствия и
Вы несете ответственность за их очистку и проверку.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="multi-request">
</code-example>

{@a testing-for-errors}
### Тестирование на ошибки

Вы должны проверить защиту приложения от неудачных HTTP-запросов.

Вызов `request.flush()` с сообщением об ошибке, как показано в следующем примере.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="404">
</code-example>

Кроме того, вы можете позвонить `request.error()` с `ErrorEvent`.

<code-example
  path="http/src/testing/http-client.spec.ts"
  region="network-error">
</code-example>
