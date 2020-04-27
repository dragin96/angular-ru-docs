{@a get-data-from-a-server}
# Получить данные с сервера

В этом руководстве вы добавите следующие функции сохранения данных с помощью
Angular's `HttpClient`.

* `HeroService` получает данные о героях с помощью HTTP-запросов.
* Пользователи могут добавлять, редактировать и удалять героев и сохранять эти изменения по HTTP.
* Пользователи могут искать героев по имени.

Когда вы закончите с этой страницей, приложение должно выглядеть следующим образом <live-example></live-example>.

{@a enable-http-services}
## Включить службы HTTP

 `HttpClient` - это механизм Angular для связи с удаленным сервером по HTTP.

Сделать `HttpClient` доступен везде в приложении в два этапа. Сначала добавьте его в корень `AppModule` путем его импорта:

<code-example path="toh-pt6/src/app/app.module.ts" region="import-http-client" header="src/app/app.module.ts (HttpClientModule import)">
</code-example>

Далее, еще в `AppModule`, добавить `HttpClient` для `imports` массива:

<code-example path="toh-pt6/src/app/app.module.ts" region="import-httpclientmodule" header="src/app/app.module.ts (imports array excerpt)">
</code-example>


{@a simulate-a-data-server}
## Имитация сервера данных

Этот учебный пример имитирует связь с удаленным сервером данных с помощью
[В-памяти Web API](https://github.com/angular/in-memory-web-api "In-memory Web API") модуль.

После установки модуля приложение будет отправлять запросы и получать ответы от `HttpClient`
не зная, что *Web API In-памяти * перехватывает эти запросы,
применяя их к хранилищу данных в памяти и возвращая смоделированные ответы.

Используя веб-API в памяти, вам не нужно настраивать сервер, чтобы узнать о `HttpClient`.

<div class="alert is-important">

**Важно:** модуль веб-API в памяти не имеет ничего общего с HTTP в Angular.

Если вы просто читаете этот учебник, чтобы узнать о `HttpClient`, вы можете [пропустить](#import-heroes)этот шаг.
Если вы пишете код вместе с этим руководством, оставайтесь здесь и добавьте веб-API в памяти прямо сейчас.

</div>

Установите пакет Web API В-память из НПХ с помощью следующей команды:

<code-example language="sh" class="code-shell">
  npm install angular-in-memory-web-api --save
</code-example>

в `AppModule`, импортировать `HttpClientInMemoryWebApiModule` и `InMemoryDataService` Класс
который вы создадите в данный момент.

<code-example path="toh-pt6/src/app/app.module.ts" region="import-in-mem-stuff" header="src/app/app.module.ts (In-memory Web API imports)">
</code-example>

После `HttpClientModule`, добавьте `HttpClientInMemoryWebApiModule`
к `AppModule` `imports` массив и настраивает его `InMemoryDataService`.

<code-example path="toh-pt6/src/app/app.module.ts" header="src/app/app.module.ts (imports array excerpt)" region="in-mem-web-api-imports">
</code-example>

 `forRoot()` конфигурации принимает `InMemoryDataService` Класс
который заполняет базу данных в памяти.

Создать класс `src/app/in-memory-data.service.ts` с помощью следующей команды:

<code-example language="sh" class="code-shell">
  ng generate service InMemoryData
</code-example>

Заменить содержимое по умолчанию `in-memory-data.service.ts` сводится к следующему:

<code-example path="toh-pt6/src/app/in-memory-data.service.ts" region="init" header="src/app/in-memory-data.service.ts"></code-example>

 `in-memory-data.service.ts` файл заменяет `mock-heroes.ts`, который теперь безопасно удалить.

Когда сервер будет готов, вы отключите встроенный веб-API в памяти, и запросы приложения будут переданы на сервер.


{@a import-heroes}
{@a heroes-and-http}
## Герои и HTTP

в `HeroService`, импорт `HttpClient` и `HttpHeaders` :

<code-example path="toh-pt6/src/app/hero.service.ts" region="import-httpclient" header="src/app/hero.service.ts (import HTTP symbols)">
</code-example>

Все еще в `HeroService`, вводить `HttpClient` в конструктор в частном свойстве под названием `http`.

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="ctor" >
</code-example>

Обратите внимание, что вы продолжаете вводить `MessageService` но так как вы будете вызывать его так часто, оберните его `log()` метод:

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="log" >
</code-example>

Определите `heroesUrl` формы `:base/:collectionName` с адресом ресурса героев на сервере.
Вот `base` - это ресурс, к которому отправляются запросы
и `collectionName` - объект данных героев в `in-memory-data-service.ts`.

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="heroesUrl" >
</code-example>

{@a get-heroes-with-httpclient}
### Получить героев с `HttpClient`

Электрический ток `HeroService.getHeroes()`
использует RxJS `of()` функция, чтобы вернуть массив фиктивных героев
как `Observable<Hero[]>`.

<code-example path="toh-pt4/src/app/hero.service.ts" region="getHeroes-1" header="src/app/hero.service.ts (getHeroes with RxJs 'of()')">
</code-example>

Преобразовать этот метод для использования `HttpClient` следующим образом :

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes-1">
</code-example>

Обновите браузер. Данные героя должны успешно загружаться из
макет сервера.

Вы поменялись местами `of()` для `http.get()` и приложение продолжает работать без каких-либо других изменений
потому что обе функции возвращают `Observable<Hero[]>`.

{@a httpclient-methods-return-one-value}
### `HttpClient` Методы возвращают одно значение

Все `HttpClient` Методы возвращают RxJS `Observable` чего-то.

HTTP является протоколом запроса / ответа.
Вы делаете запрос, он возвращает один ответ.

В общем случае наблюдаемое _can_ может возвращать несколько значений с течением времени.
Наблюдаемый от `HttpClient` всегда выдает одно значение, а затем завершается, никогда не отправляя снова.

Этот конкретный `HttpClient.get()` вызов возвращает `Observable<Hero[]>` ; то есть, "наблюдаемый массив героев". На практике он вернет только один массив героев.

{@a httpclient.get-return-response-data}
### `HttpClient.get()` возвращает данные ответа

 `HttpClient.get()` возвращает тело ответа в виде нетипизированного объекта JSON по умолчанию.
Применяя необязательный спецификатор типа, `<Hero[]>`, добавляет возможности TypeScript, которые уменьшают ошибки во время компиляции.

API данных сервера определяет форму данных JSON.
API данных _Tour of Heroes_ возвращает данные о героях в виде массива.

<div class="alert is-helpful">

Другие API могут скрывать данные, которые вы хотите внутри объекта.
Возможно, вам придется выкопать эти данные, обрабатывая `Observable` результат
с RxJS `map()` оператор.

Хотя здесь это не обсуждается, есть пример `map()` в `getHeroNo404()`
метод включен в пример исходного кода.

</div>

{@a error-handling}
### Обработка ошибок

Все идет не так, особенно когда вы получаете данные с удаленного сервера.
 `HeroService.getHeroes()` должен отлавливать ошибки и делать что-то подходящее.

Чтобы поймать ошибки, вы **"труба" видимый ** результат от `http.get()` через RxJS `catchError()` оператор.

Импортировать `catchError` символ из `rxjs/operators`, наряду с некоторыми другими операторами, которые понадобятся вам позже.

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="import-rxjs-operators">
</code-example>

Теперь расширим наблюдаемый результат с помощью `pipe()` метод и
дать ему `catchError()` оператор.

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHeroes-2" header="src/app/hero.service.ts">
</code-example>

 `catchError()` оператор перехватывает** `Observable` что не удалось **.
Он передает ошибку обработчику ошибок, который может делать то, что он хочет с ошибкой.

Последующий `handleError()` сообщает об ошибке, а затем возвращает
безобидный результат, так что приложение продолжает работать.

{@a handleerror}
#### `handleError`

Последующий `handleError()` будет многим `HeroService` Методы
поэтому он обобщен для удовлетворения их различных потребностей.

Вместо непосредственной обработки ошибки она возвращает функцию обработчика ошибок в `catchError` что это
настроил как имя операции, которая не удалась, так и безопасное возвращаемое значение.

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="handleError">
</code-example>

После сообщения об ошибке на консоль, обработчик создает
удобное сообщение и возвращает безопасное значение в приложение, чтобы приложение могло продолжать работать.

Поскольку каждый метод службы возвращает различный вид `Observable` результат
 `handleError()` принимает параметр типа, чтобы он мог возвращать безопасное значение в качестве типа, приложением.

{@a tap-into-the-observable}
### Нажмите на наблюдаемую

 `HeroService` Методы **подключатся** к потоку наблюдаемых значений
и отправьте сообщение через `log()`, к области сообщений внизу страницы.

Они сделают это с RxJS `tap()` оператор
который смотрит на наблюдаемые значения, что-то делает с этими значениями
и передает их вместе.
 `tap()` вызов не касается самих значений.

Вот окончательная версия `getHeroes()` с `tap()` который регистрирует операцию.

<code-example path="toh-pt6/src/app/hero.service.ts" header="src/app/hero.service.ts" region="getHeroes" >
</code-example>

{@a get-hero-by-id}
### Получить героя по идентификатору

Большинство веб-API поддерживают запрос _get by id_ в форме `:baseURL/:id`.

Здесь _base URL_ является `heroesURL` определенный в разделе [Герои и HTTP](tutorial/toh-pt6#heroes-and-http)(`api/heroes`) и _id_ есть
номер героя, которого вы хотите получить. Например, `api/heroes/11`.

Обновите `HeroService` `getHero()` метод со следующим, чтобы сделать этот запрос:

<code-example path="toh-pt6/src/app/hero.service.ts" region="getHero" header="src/app/hero.service.ts"></code-example>

Есть три существенных отличия от `getHeroes()` :

* `getHero()` создает URL запроса с идентификатором нужного героя.
* Сервер должен отвечать одним героем, а не набором героев.
* `getHero() ` возвращает ` Observable<Hero>` («наблюдаемый объектов героя»)
а не наблюдаемый герой _arrays_.

{@a update-heroes}
## Обновите героев

Отредактируйте имя героя в подробном представлении героя.
По мере ввода имя героя обновляет заголовок вверху страницы.
Но когда вы нажимаете «кнопку возврата», изменения теряются.

Если вы хотите, чтобы изменения сохранялись, вы должны написать их обратно
сервер.

В конце подробного шаблона героя добавьте кнопку сохранения с `click` событие
привязка, которая вызывает новый метод компонента с именем `save()`.

<code-example path="toh-pt6/src/app/hero-detail/hero-detail.component.html" region="save" header="src/app/hero-detail/hero-detail.component.html (save)"></code-example>

в `HeroDetail` компонента, добавьте следующее `save()` Метод, который сохраняет изменения имени героя с помощью сервиса hero
 `updateHero()` и затем возвращается к предыдущему представлению.

<code-example path="toh-pt6/src/app/hero-detail/hero-detail.component.ts" region="save" header="src/app/hero-detail/hero-detail.component.ts (save)"></code-example>

{@a add-heroservice.updatehero}
#### добавлять `HeroService.updateHero()`

Общая структура `updateHero()` аналогичен методу of
 `getHeroes()`, но он использует `http.put()` чтобы сохранить измененного героя
на сервере. Добавьте следующее к `HeroService`.

<code-example path="toh-pt6/src/app/hero.service.ts" region="updateHero" header="src/app/hero.service.ts (update)">
</code-example>

 `HttpClient.put()` метод принимает три параметра:
* URL
* данные для обновления (модифицированный герой в данном случае)
* варианты

URL не изменился. Веб-API героев знает, какого героя нужно обновить, посмотрев на героя. `id`.

Веб-API героев ожидает специальный заголовок в HTTP-запросах на сохранение.
Этот заголовок находится в `httpOptions` константа определенная в `HeroService` . Добавьте следующее к `HeroService` класс.

<code-example path="toh-pt6/src/app/hero.service.ts" region="http-options" header="src/app/hero.service.ts">
</code-example>

Обновите браузер, измените имя героя и сохраните изменения. `save()`
метод в `HeroDetailComponent` переходит к предыдущему представлению.
Теперь герой появляется в списке с измененным именем.


{@a add-a-new-hero}
## Добавь нового героя

Чтобы добавить героя, этому приложению нужно только имя героя. Вы можете использовать `<input>`
элемент в сочетании с кнопкой добавления.

Вставьте следующее в `HeroesComponent` шаблон, сразу после
заголовок:

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" region="add" header="src/app/heroes/heroes.component.html (add)"></code-example>

В ответ на событие щелчка вызовите обработчик щелчка компонента, `add()`, а затем
очистите поле ввода, чтобы оно было готово для другого имени. Добавьте следующее к
 `HeroesComponent` класс:

<code-example path="toh-pt6/src/app/heroes/heroes.component.ts" region="add" header="src/app/heroes/heroes.component.ts (add)"></code-example>

Когда данное имя не пустое, обработчик создает `Hero` подобный объект
от имени (это только отсутствует `id`) и передает его в службы `addHero()`.

когда `addHero()` успешно сохраняет, `subscribe()` обратный вызов
получает нового героя и толкает его в `heroes` список для отображения.

Добавьте следующее `addHero()` для `HeroService` класс.

<code-example path="toh-pt6/src/app/hero.service.ts" region="addHero" header="src/app/hero.service.ts (addHero)"></code-example>

 `addHero()` отличается от `updateHero()` двумя способами:

* Это вызывает `HttpClient.post()` вместо `put()`.
* Ожидается, что сервер сгенерирует идентификатор для нового героя
который он возвращает в `Observable<Hero>` для звонящего.

Обновите браузер и добавьте героев.

{@a delete-a-hero}
## Удалить героя

Каждый герой в списке героев должен иметь кнопку удаления.

Добавьте следующий элемент кнопки в `HeroesComponent` шаблон, после героя
имя в повторном `<li>` элемент.

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" header="src/app/heroes/heroes.component.html" region="delete"></code-example>

HTML для списка героев должен выглядеть следующим образом :

<code-example path="toh-pt6/src/app/heroes/heroes.component.html" region="list" header="src/app/heroes/heroes.component.html (list of heroes)"></code-example>

Чтобы поместить кнопку удаления в правом вступления героя,
добавить немного CSS в `heroes.component.css` . Вы найдете этот CSS
в [окончательный код проверки](#heroescomponent)ниже.

Добавить `delete()` обработчик для класса компонента.

<code-example path="toh-pt6/src/app/heroes/heroes.component.ts" region="delete" header="src/app/heroes/heroes.component.ts (delete)"></code-example>

Хотя компонент делегирует удаление героя `HeroService`,
он остается ответственным за обновление своего собственного списка героев.
Компоненты `delete()` метод немедленно удаляет _hero-к-Delete_ из этого списка
предвидя, что `HeroService` будет успешным на сервере.

Для компонента нет ничего общего с `Observable` возвращено
 `heroService.delete()` **но он все равно должен подписаться **.

<div class="alert is-important">

  Если вы пренебрегаете `subscribe()`, сервис не будет отправлять запрос на удаление на сервер.
  Как правило, `Observable` _не делает ничего_, пока что-то не подпишется.

  Подтвердите это для себя, временно удалив `subscribe()`,
  нажмите «Панель инструментов», затем нажмите «Герои».
  Вы снова увидите полный список героев.

</div>

Затем добавьте `deleteHero()` для `HeroService` как это.

<code-example path="toh-pt6/src/app/hero.service.ts" region="deleteHero" header="src/app/hero.service.ts (delete)"></code-example>

Обратите внимание на следующие ключевые моменты:

* `deleteHero() ` звонки ` HttpClient.delete()`.
* URL является URL ресурса героев плюс `id` героя для удаления.
* Вы не отправляете данные как вы `put()` и `post()`.
* Вы все еще отправляете `httpOptions`.

Обновите браузер и попробуйте новую функцию удаления.

{@a search-by-name}
## Поиск по имени

В этом последнем упражнении вы научитесь связывать `Observable` операторы вместе
так что вы можете минимизировать количество подобных HTTP-запросов
и экономно использовать пропускную способность сети.

Вы добавите функцию поиска героев на панель инструментов.
Как пользователь вводит имя в поле поиска
Вы будете повторять HTTP-запросы для героев, отфильтрованных по этому имени.
Ваша цель состоит в том, чтобы выдавать столько запросов, сколько необходимо.

{@a heroservice.searchheroes}
#### `HeroService.searchHeroes()`

Начните с добавления `searchHeroes()` для `HeroService`.

<code-example path="toh-pt6/src/app/hero.service.ts" region="searchHeroes" header="src/app/hero.service.ts">
</code-example>

Метод немедленно возвращается с пустым массивом, если поискового термина нет.
В остальном это очень похоже `getHeroes()`, единственное существенное отличие заключается в
URL, который включает строку запроса с поисковым термином.

{@a add-search-to-the-dashboard}
### Добавить поиск в панель инструментов

Открой `DashboardComponent` шаблон и
добавить элемент поиска героя, `<app-hero-search>`, внизу разметки.

<code-example path="toh-pt6/src/app/dashboard/dashboard.component.html" header="src/app/dashboard/dashboard.component.html"></code-example>

Этот шаблон очень похож на `*ngFor` повторителя в `HeroesComponent` шаблон.

Чтобы это работало, следующим шагом является добавление компонента с селектором, который соответствует `<app-hero-search>`.


{@a create-herosearchcomponent}
### Создайте `HeroSearchComponent`

Создать `HeroSearchComponent` с CLI.

<code-example language="sh" class="code-shell">
  ng generate component hero-search
</code-example>

CLI генерирует три `HeroSearchComponent` файлы и добавляет компонент в `AppModule` Объявления.

Заменить сгенерированный `HeroSearchComponent` шаблон с `<input>` и список соответствующих результатов поиска, как показано ниже.

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html"></code-example>

Добавить частные стили CSS в `hero-search.component.css`
как указано в [окончательный обзор кода](#herosearchcomponent)ниже.

Когда пользователь вводит в поле поиска, привязка события ввода вызывает
составные части `search()` Метод с новым значением окна поиска.

{@a asyncpipe}

{@a asyncpipe}
### `AsyncPipe`

 `*ngFor` повторяет объекты героя. Обратите внимание, что `*ngFor` списка `heroes$`, а не `heroes` . `$` это соглашение, которое указывает `heroes$` это `Observable`, а не массив.


<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html" region="async"></code-example>

поскольку `*ngFor` ничего не может сделать с `Observable`, используйте
символ трубы (`|`) с последующим `async` . Это идентифицирует Angular's `AsyncPipe` и подписывается на `Observable` автоматически, поэтому вам не придется
сделать это в классе компонентов.

{@a edit-the-herosearchcomponent-class}
### Изменить `HeroSearchComponent` класс

Заменить сгенерированный `HeroSearchComponent` класс и метаданные следующим образом.

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts"></code-example>

Обратите внимание на объявление `heroes$` как `Observable` :

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="heroes-stream">
</code-example>

Вы установите его в [ `ngOnInit ()` ](#search-pipe).
Прежде чем сделать это, сосредоточиться на определении `searchTerms`.

{@a the-searchterms-rxjs-subject}
### `searchTerms` RxJS тема

 `searchTerms` является RxJS `Subject`.

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="searchTerms"></code-example>

 `Subject` является одновременно источником наблюдаемых значений и `Observable` сам.
Вы можете подписаться на `Subject` как вы бы любой `Observable`.

Вы также можете вставить значения в это `Observable`, называя его `next(value)` метод
как `search()` метод делает.

Привязка события к текстовому полю `input` событие вызывает `search()` метод.

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.html" header="src/app/hero-search/hero-search.component.html" region="input"></code-example>

Каждый раз, когда пользователь вводит текстовое поле, привязка вызывает `search()` со значением текстового поля, «поисковый термин».
 `searchTerms ` становится ` Observable` испускающий устойчивый поток поисковых терминов.

{@a search-pipe}

{@a chaining-rxjs-operators}
### Связывание операторов RxJS

Передача нового поискового запроса непосредственно в `searchHeroes()` после каждого нажатия клавиши пользователем будет создавать чрезмерное количество HTTP-запросов
налогообложение ресурсов сервера и прожиг через тарифные планы.

Вместо этого `ngOnInit()` метод труб в `searchTerms` наблюдаемые через последовательность операторов RxJS, которые уменьшают количество вызовов к `searchHeroes()`,
в конечном итоге возвращает наблюдаемые своевременные результаты поиска героя (каждый `Hero[]`).

Вот более внимательный взгляд на код.

<code-example path="toh-pt6/src/app/hero-search/hero-search.component.ts" header="src/app/hero-search/hero-search.component.ts" region="search">
</code-example>

Каждый оператор работает следующим образом :

* `debounceTime(300)` ожидает, пока поток новых строковых событий не остановится на 300 миллисекунд
перед прохождением по последней строке. Вы никогда не будете делать запросы чаще, чем 300 мс.

* `distinctUntilChanged()` гарантирует, что запрос будет отправлен, только если текст фильтра изменился.

* `switchMap()` вызывает службу поиска для каждого поискового запроса, который проходит через `debounce()` и `distinctUntilChanged()`.
Он отменяет и отбрасывает предыдущие наблюдаемые результаты поиска, возвращая только последнюю наблюдаемую службу поиска.


<div class="alert is-helpful">

  С [оператор switchMap](http://www.learnrxjs.io/operators/transformation/switchmap.html),
  каждое соответствующее ключевое событие может вызвать `HttpClient.get()` метода.
  Даже с паузой в 300 мс между запросами у вас может быть несколько HTTP-запросов в полете
  и они могут не вернуться в отправленном порядке.

   `switchMap()` сохраняет исходный порядок запросов, возвращая только наблюдаемое из самого последнего вызова метода HTTP.
  Результаты предыдущих звонков отменяются и отбрасываются.

  Обратите внимание, что отмена предыдущего `searchHeroes()` Наблюдаемый
  фактически не прерывает ожидающий HTTP-запрос.
  Нежелательные результаты просто отбрасываются, прежде чем они достигнут кода вашего приложения.

</div>

Помните, что компонент _class_ не подписывается на `heroes$` _observable_.
Это работа [ `AsyncPipe` ](#asyncpipe)в шаблоне.

{@a try-it}
#### Попробуй это

Запустите приложение еще раз. В *панели инструментов *введите текст в поле поиска.
Если вы введете персонажей, которые соответствуют любым существующим именам героев, вы увидите что-то вроде этого.

<div class="lightbox">
  <img src='generated/images/guide/toh/toh-hero-search.png' alt="Hero Search Component">
</div>

{@a final-code-review}
## Окончательный обзор кода

Ваше приложение должно выглядеть следующим образом <live-example></live-example>.

Вот файлы кода, обсуждаемые на этой странице (все в `src/app/` папка).

{@a heroservice}
{@a inmemorydataservice}
{@a appmodule}
{@a heroservice-inmemorydataservice-appmodule}
#### `HeroService `, ` InMemoryDataService `, ` AppModule`

<code-tabs>
  <code-pane
    header="hero.service.ts"
    path="toh-pt6/src/app/hero.service.ts">
  </code-pane>
  <code-pane
    header="in-memory-data.service.ts"
    path="toh-pt6/src/app/in-memory-data.service.ts">
  </code-pane>
  <code-pane
    header="app.module.ts"
    path="toh-pt6/src/app/app.module.ts">
  </code-pane>
</code-tabs>

{@a heroescomponent}
{@a heroescomponent}
#### `HeroesComponent`

<code-tabs>
  <code-pane
    header="heroes/heroes.component.html"
    path="toh-pt6/src/app/heroes/heroes.component.html">
  </code-pane>
  <code-pane
    header="heroes/heroes.component.ts"
    path="toh-pt6/src/app/heroes/heroes.component.ts">
  </code-pane>
  <code-pane
    header="heroes/heroes.component.css"
    path="toh-pt6/src/app/heroes/heroes.component.css">
  </code-pane>
</code-tabs>

{@a herodetailcomponent}
{@a herodetailcomponent}
#### `HeroDetailComponent`

<code-tabs>
  <code-pane
    header="hero-detail/hero-detail.component.html"
    path="toh-pt6/src/app/hero-detail/hero-detail.component.html">
  </code-pane>
  <code-pane
    header="hero-detail/hero-detail.component.ts"
    path="toh-pt6/src/app/hero-detail/hero-detail.component.ts">
  </code-pane>
</code-tabs>

{@a dashboardcomponent}
{@a dashboardcomponent}
#### `DashboardComponent`

<code-tabs>
  <code-pane
    header="src/app/dashboard/dashboard.component.html"
    path="toh-pt6/src/app/dashboard/dashboard.component.html">
  </code-pane>
</code-tabs>

{@a herosearchcomponent}
{@a herosearchcomponent}
#### `HeroSearchComponent`

<code-tabs>
  <code-pane
    header="hero-search/hero-search.component.html"
    path="toh-pt6/src/app/hero-search/hero-search.component.html">
  </code-pane>
  <code-pane
    header="hero-search/hero-search.component.ts"
    path="toh-pt6/src/app/hero-search/hero-search.component.ts">
  </code-pane>
  <code-pane
    header="hero-search/hero-search.component.css"
    path="toh-pt6/src/app/hero-search/hero-search.component.css">
  </code-pane>
</code-tabs>

{@a summary}
## Резюме

Вы в конце своего путешествия, и вы многого достигли.
* Вы добавили необходимые зависимости для использования HTTP в приложении.
* Вы рефакторинг `HeroService` для загрузки героев из веб-API.
* Вы продлили `HeroService` для поддержки `post()`, `put()` и `delete()` методы.
* Вы обновили компоненты, чтобы позволить добавлять, редактировать и удалять героев.
* Вы настроили веб-API в памяти.
* Вы узнали, как использовать наблюдаемые.

На этом учебное пособие «Тур героев» завершено.
Вы готовы узнать больше о разработке Angular в разделе основы
начиная с руководства [Архитектура](guide/architecture "Architecture").
