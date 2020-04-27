{@a observables-in-angular}
# Наблюдаемые в Angular

Angular использует наблюдаемые в качестве интерфейса для обработки множества распространенных асинхронных операций. Например:

* Вы можете определить [пользовательские события](guide/template-syntax#custom-events-with-eventemitter)которые отправляют наблюдаемые выходные данные от дочернего к родительскому компоненту.
* Модуль HTTP использует наблюдаемые для обработки запросов и ответов AJAX.
* Модули Маршрутизатор и Формы используют наблюдаемые для прослушивания и реагирования на события, вводимые пользователем.

{@a transmitting-data-between-components}
## Передача данных между компонентами

Angular обеспечивает  `EventEmitter`  Класс который используется при публикации значений из компонента через [декоратор  `@Output ()` ](guide/template-syntax#how-to-use-output).
 `EventEmitter` расширяет [RxJS  `Subject` ](https://rxjs.dev/api/index/class/Subject), добавляя  `emit()`  Метод поэтому он может отправлять произвольные значения.
Когда вы звоните  `emit()`, передает переданное значение  `next()`  Метод любого подписанного наблюдателя.

Хороший пример использования можно найти в [EventEmitter](https://angular.io/api/core/EventEmitter)документации . Вот пример компонент, который прослушивает открытые и закрытые мероприятия:

 `<zippy (open)="onOpen($event)" (close)="onClose($event)"></zippy>` 

Вот определение компонента:

<code-example path="observables-in-angular/src/main.ts" header="EventEmitter" region="eventemitter"></code-example>

## HTTP
Angular's  `HttpClient`  возвращает наблюдаемые из вызовов метода HTTP. Например,  `http.get(‘/api’)`  возвращает наблюдаемое. Это дает несколько преимуществ по сравнению с обещанием на основе HTTP API:

* Наблюдаемые объекты не изменяют ответ сервера (как это может происходить через цепочку).  `.then()`  вызывает обещания). Вместо этого вы можете использовать ряд операторов для преобразования значений по мере необходимости.
* HTTP-запросы можно отменить через  `unsubscribe()`  метод.
* Запросы могут быть настроены для получения обновлений событий прогресса.
* Неудачные запросы могут быть легко повторены.

{@a async-pipe}
## Асинхронная труба

[AsyncPipe](https://angular.io/api/common/AsyncPipe)присоединяется к наблюдаемому или обещанию и возвращают последнее значение оно испускается. Когда выдается новое значение, труба отмечает компонент, который необходимо проверить на наличие изменений.

Следующий пример связывает  `time`  наблюдаемое с точки зрения компонента. Наблюдаемая постоянно обновляет представление с текущим временем.

<code-example path="observables-in-angular/src/main.ts" header="Using async pipe" region="pipe"></code-example>

## Router

[  `Router.events`  ](https://angular.io/api/router/Router#events)предоставляет события в виде наблюдаемых. Вы можете использовать  `filter()`  Оператор из RxJS ищет интересующие события и подписывается на них, чтобы принимать решения на основе последовательности событий в процессе навигации. Вот пример:

<code-example path="observables-in-angular/src/main.ts" header="Router events" region="router"></code-example>

[ActivatedRoute](https://angular.io/api/router/ActivatedRoute)является впрыскивается маршрутизатор сервис, который использует наблюдаемыми, чтобы получить информацию о пути и параметров маршрута. Например,  `ActivatedRoute.url`  содержит наблюдаемую информацию, которая сообщает путь к маршруту или пути. Вот пример:

<code-example path="observables-in-angular/src/main.ts" header="ActivatedRoute" region="activated_route"></code-example>

{@a reactive-forms}
## Реактивные формы

Реактивные формы имеют свойства, которые используют наблюдаемые для мониторинга значений элементов управления формы. В [  `FormControl`  ](https://angular.io/api/forms/FormControl)свойства  `valueChanges`  и  `statusChanges`  содержит наблюдаемые, которые вызывают события изменения. Подписка на наблюдаемое свойство управления формой - это способ запуска логики приложения в классе компонента. Например:

<code-example path="observables-in-angular/src/main.ts" header="Reactive forms" region="forms"></code-example>
