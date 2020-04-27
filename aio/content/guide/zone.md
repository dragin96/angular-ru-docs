{@a ngzone}
# NgZone

Зона - это контекст выполнения, который сохраняется в асинхронных задачах. Вы можете думать об этом как [локальное хранилище потоков](http://en.wikipedia.org/wiki/Thread-local_storage)для виртуальных машин JavaScript.
В этом руководстве описывается, как использовать NgZone от Angular для автоматического обнаружения изменений в компоненте для обновления HTML.

{@a fundamentals-of-change-detection}
## Основы обнаружения изменений

Чтобы понять преимущества `NgZone`, важно иметь четкое представление о том, что такое обнаружение изменений и как оно работает.

{@a displaying-and-updating-data-in-angular}
### Отображение и обновление данных в Angular

В Angular вы можете [отображать данные](guide/displaying-data), связывая элементы управления в шаблоне HTML со свойствами компонента Angular.

<code-example path="displaying-data/src/app/app.component.1.ts" header="src/app/app.component.ts"></code-example>

Кроме того, вы можете привязать события DOM к методу Angular компонента. В таких методах вы также можете обновить свойство компонента Angular, которое обновляет соответствующие данные, отображаемые в шаблоне.

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" header="src/app/click-me.component.ts"></code-example>

В обоих приведенных выше примерах код компонента обновляет только свойство компонента.
Тем не менее, HTML также обновляется автоматически.
В этом руководстве описывается, как и когда Angular отображает HTML на основе данных из компонента Angular.


{@a detecting-changes-with-plain-javascript}
### Обнаружение изменений с простым JavaScript

Чтобы уточнить, как обнаруживаются изменения и обновляются значения, рассмотрим следующий код, написанный на простом JavaScript.

```javascript
<html>
  <div id="dataDiv"></div>
  <button id="btn">updateData<btn>
  <canvas id="canvas"><canvas>
  <script>
    let value = 'initialValue';
    // initial rendering
    detectChange();

    function renderHTML() {
      document.getElementById('dataDiv').innerText = value;
    }

    function detectChange() {
      const currentValue = document.getElementById('dataDiv').innerText;
      if (currentValue !== value) {
        renderHTML();
      }
    }

    // example 1: update data inside button click event handler
    document.getElementById('btn').addEventListener('click', () => {
      // update value
      value = 'button update value';
      // call detectChange manually
      detectChange();
    });

    // example 2: Http Request
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function() {
      // get response from server
      value = this.responseText;
      // call detectChange manually
      detectChange();
    });
    xhr.open('GET', serverUrl);
    xhr.send();

    // example 3: setTimeout
    setTimeout(() => {
      // update value inside setTimeout callback
      value = 'timeout update value';
      // call detectChange manually
      detectChange();
    }, 100);

    // example 4: Promise.then
    Promise.resolve('promise resolved a value').then((v) => {
      // update value inside Promise thenCallback
      value = v;
      // call detectChange manually
      detectChange();
    }, 100);

    // example 5: some other asynchronous APIs
    document.getElementById('canvas').toBlob(blob => {
      // update value when blob data is created from the canvas
      value = `value updated by canvas, size is ${blog.size}` ;
      // call detectChange manually
      detectChange();
    });
  </script>
</html>
```

После того, как вы обновите данные, вам нужно позвонить `detectChange()` вручную, чтобы проверить, изменились ли данные.
Если данные изменились, вы отображаете HTML-код для отображения обновленных данных.

В Angular этот шаг не нужен. Всякий раз, когда вы обновляете данные, ваш HTML обновляется автоматически.

{@a when-apps-update-html}
### Когда приложения обновляют HTML

Чтобы понять, как работает обнаружение изменений, сначала подумайте, когда приложению необходимо обновить HTML. Как правило, обновления происходят по одной из следующих причин:

1. Инициализация компонентов. Например, при начальной загрузке приложения Angular Angular загружает компонент начальной загрузки и запускает [ApplicationRef.tick ()](api/core/ApplicationRef#tick)вызвать обнаружение изменений и просмотр рендеринга. Так же, как и в [отображение данных](guide/displaying-data)образца, то `AppComponent` является компонентом начальной загрузки. Этот компонент имеет свойства `title` и `myHero`, которое приложение отображает в HTML.

2. Слушатель событий. Прослушиватель событий DOM может обновлять данные в угловом компоненте, а также запускать обнаружение изменений, как в следующем примере.

<code-example path="user-input/src/app/click-me.component.ts" region="click-me-component" header="src/app/click-me.component.ts"></code-example>

3. Http Data Request. Вы также можете получить данные с сервера через запрос Http. Например:

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';
  serverUrl = 'SERVER_URL';
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.httpClient.get(this.serverUrl).subscribe(response => {
      // user does not need to trigger change detection manually
      this.data = response.data;
    });
  }
}
```

4. MacroTasks, такие как `setTimeout()` / `setInterval()` . Вы также можете обновить данные в функции обратного вызова `macroTask` такой как `setTimeout()` . Например:

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    setTimeout(() => {
      // user does not need to trigger change detection manually
      this.data = 'value updated';
    });
  }
}
```

5. MicroTask, такой как `Promise.then()` . Другие асинхронные API возвращают объект Promise (например, `fetch`), так что `then()` Функция обратного вызова также может обновлять данные. Например:

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{data}}</div>';
})
export class AppComponent implements OnInit {
  data = 'initial value';

  ngOnInit() {
    Promise.resolve(1).then(v => {
      // user does not need to trigger change detection manually
      this.data = v;
    });
  }
}
```

6. Другие асинхронные операции. В дополнение к `addEventListener()` / `setTimeout()` / `Promise.then()`, есть другие операции, которые могут обновлять данные асинхронно. Некоторые примеры включают `WebSocket.onmessage()` и `Canvas.toBlob()`.

Предыдущий список содержит наиболее распространенные сценарии, в которых приложение может изменить данные. Angular прогоны изменяют обнаружение всякий раз, когда обнаруживает, что данные могли измениться.
Результатом обнаружения изменений является то, что DOM обновляется новыми данными. Angular обнаруживает изменения по-разному. Для инициализации компонента Angular вызовы изменяют обнаружение явно. Для [асинхронных операций](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous)Angular использует Зону для обнаружения изменений в местах, где данные могли измениться, и автоматически запускает обнаружение изменений.


{@a zones-and-execution-contexts}
## Зоны и контексты исполнения

Зона обеспечивает контекст выполнения, который сохраняется в асинхронных задачах. [Контекст выполнения](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)- это абстрактное понятие, которое содержит информацию о среде в текущем исполняемом коде. Рассмотрим следующий пример.

```javascript
const callback = function() {
  console.log('setTimeout callback context is', this);
}

const ctx1 = {
  name: 'ctx1'
};
const ctx2 = {
  name: 'ctx2'
};

const func = function() {
  console.log('caller context is', this);
  setTimeout(callback);
}

func.apply(ctx1);
func.apply(ctx2);
```

Значение `this` в обратном вызове `setTimeout` может отличаться в зависимости от того, когда `setTimeout` называется.
Таким образом, вы можете потерять контекст в асинхронных операциях.

Зона предоставляет новый контекст зоны, отличный от `this` контекст зоны, который сохраняется в асинхронных операциях.
В следующем примере новый контекст зоны называется `zoneThis`.

```javascript
zone.run(() => {
  // now you are in a zone
  expect(zoneThis).toBe(zone);
  setTimeout(function() {
    // the zoneThis context will be the same zone
    // when the setTimeout is scheduled
    expect(zoneThis).toBe(zone);
  });
});
```

Этот новый контекст, `zoneThis`, может быть из `setTimeout()` Функция обратного вызова, и этот контекст тот же, когда `setTimeout()` запланирован.
Чтобы получить контекст, вы можете позвонить [ `Zone.current` ](https://github.com/angular/angular/blob/master/packages/zone.js/lib/zone.ts).

{@a zones-and-async-lifecycle-hooks}
## Зоны и асинхронные крюки жизненного цикла

Zone.js может создавать контексты, которые сохраняются в асинхронных операциях, а также предоставлять хуки жизненного цикла для асинхронных операций.

```javascript
const zone = Zone.current.fork({
  name: 'zone',
  onScheduleTask: function(delegate, curr, target, task) {
    console.log('new task is scheduled: ', task.type, task.source);
    return delegate.scheduleTask(target, task);
  },
  onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
    console.log('task will be invoked', task.type, task.source);
    return delegate.invokeTask(target, task, applyThis, applyArgs);
  },
  onHasTask: function(delegate, curr, target, hasTaskState) {
    console.log('task state changed in the zone', hasTaskState);
    return delegate.hasTask(target, hasTaskState);
  },
  onInvoke: function(delegate, curr, target, callback, applyThis, applyArgs) {
    console.log('the callback will be invoked', callback);
    return delegate.invoke(target, callback, applyThis, applyArgs);
  }
});
zone.run(() => {
  setTimeout(() => {
    console.log('timeout callback is invoked.');
  });
});
```

Приведенный выше пример создает зону с несколькими хуками.

 `onXXXTask` срабатывают при изменении статуса задачи.
Концепция Zone Task очень похожа на концепцию Javascript VM Task.
- `macroTask` : такой как `setTimeout()`.
- `microTask` : такая как `Promise.then()`.
- `eventTask` : такой как `element.addEventListener()`.

Эти хуки вызвать при следующих обстоятельствах:

- `onScheduleTask` : срабатывает при планировании новой асинхронной задачи, например при вызове `setTimeout()`.
- `onInvokeTask` : срабатывает, когда собирается выполняться асинхронная задача, например, когда выполняется обратный вызов `setTimeout()` собирается выполнить.
- `onHasTask` : срабатывает, когда состояние задачи одного типа внутри зоны изменяется со стабильного на нестабильный или с нестабильного на стабильный. Статус стабильный означает, что в Зоне нет задач, а нестабильный означает, что в зоне запланирована новая задача.
- `onInvoke` : срабатывает, когда синхронная функция будет выполняться в зоне.

С этими крючками, `Zone` может отслеживать состояние всех синхронных и асинхронных операций внутри зоны.

Приведенный выше пример возвращает следующий вывод.

```
the callback will be invoked () => {
  setTimeout(() => {
    console.log('timeout callback is invoked.');
  });
}
new task is scheduled: macroTask setTimeout
task state changed in the zone { microTask: false,
  macroTask: true,
  eventTask: false,
  change: 'macroTask' }
task will be invoked macroTask setTimeout
timeout callback is invoked.
task state changed in the zone { microTask: false,
  macroTask: false,
  eventTask: false,
  change: 'macroTask' }
```

Все функции Zone предоставляются библиотекой [zone.js](https://github.com/angular/angular/tree/master/packages/zone.js/README.md).
Эта библиотека реализует эти функции путем перехвата асинхронных API-интерфейсов с помощью патч-апов.
Патч-обезьяна - это метод добавления или изменения поведения функции по умолчанию во время выполнения без изменения исходного кода.

{@a ngzone}
## NgZone

В то время как Zone.js может отслеживать все состояния синхронных и асинхронных операций, Angular дополнительно предоставляет сервис под названием NgZone.
Этот сервис создает зону с именем `angular` для автоматического обнаружения изменений триггера, если выполняются следующие условия:

1. Когда выполняется синхронная или асинхронная функция.
1. Когда нет `microTask` запланирована.

{@a ngzone-run/runoutsideofangular}
### NgZone `run()` / `runOutsideOfAngular()` 

 `Zone` обрабатывает большинство асинхронных API, таких как `setTimeout()`, `Promise.then()` и `addEventListener()`.
Полный список см. В документе [Зональный модуль](https://github.com/angular/angular/blob/master/packages/zone.js/MODULE.md).
Поэтому в этих асинхронных API вам не нужно вручную запускать обнаружение изменений.

Есть еще некоторые сторонние API, которые Zone не обрабатывает.
В этих случаях служба NgZone предоставляет [ `run ()` ](api/core/NgZone#run)метод который позволяет вам выполнять функцию внутри Angular зоны.
Эта функция и все асинхронные операции в этой функции автоматически инициируют обнаружение изменений в нужное время.

```typescript
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // New async API is not handled by Zone, so you need to
    // use ngZone.run() to make the asynchronous operation in the angular zone
    // and trigger change detection automatically.
    this.ngZone.run(() => {
      someNewAsyncAPI(() => {
        // update the data of the component
      });
    });
  }
}
```

По умолчанию все асинхронные операции находятся внутри Angular зоны, что автоматически инициирует обнаружение изменений.
Другой распространенный случай - когда вы не хотите запускать обнаружение изменений.
В этой ситуации вы можете использовать другой метод NgZone: [runOutsideAngular ()](api/core/NgZone#runoutsideangular).

```typescript
export class AppComponent implements OnInit {
  constructor(private ngZone: NgZone) {}
  ngOnInit() {
    // You know no data will be updated,
    // so you don't want to trigger change detection in this
    // specified operation. Instead, call ngZone.runOutsideAngular()
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // update component data
        // but don't trigger change detection.
      });
    });
  }
}
```

{@a setting-up-zone.js}
### Настройка Zone.js

Чтобы Zone.js был доступен в Angular, вам необходимо импортировать пакет zone.js.
Если вы используете Angular CLI, этот шаг выполняется автоматически, и вы увидите следующую строку в `src/polyfills.ts` :

```typescript
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/dist/zone'; // Included with Angular CLI.
```

Перед импортом `zone.js` пакет, вы можете установить следующие конфигурации:

- Вы можете отключить некоторые асинхронные исправления API для повышения производительности.
Например, вы можете отключить `requestAnimationFrame()` патч обезьяны, поэтому обратный вызов `requestAnimationFrame()` не будет запускать обнаружение изменений.
Это полезно, если в вашем приложении обратный вызов `requestAnimationFrame()` не будет обновлять какие-либо данные.
- Вы можете указать, что определенные события DOM не будут проходить внутри Angular зоны; например, чтобы предотвратить `mousemove` или `scroll` событие для запуска обнаружения изменений.

Есть несколько других настроек, которые вы можете изменить.
Чтобы внести эти изменения, вам нужно создать `zone-flags.ts` файл, такой как следующий.

```typescript
 (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 (window as any).__zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
```

Далее импорт `zone-flags` перед импортом `zone` в `polyfills.ts`.

```typescript
/***************************************************************************************************
 * Zone JS is required by default for Angular.
 */
import `./zone-flags` ;
import 'zone.js/dist/zone'; // Included with Angular CLI.
```

Для получения дополнительной информации о том, что вы можете настроить, см. [Документацию zone.js](https://github.com/angular/angular/tree/master/packages/zone.js).

{@a noopzone}
### NoopZone

 `Zone` помогает Angular знать, когда запускать обнаружение изменений, и позволяет разработчикам сосредоточиться на разработке приложений.
По умолчанию, `Zone` загружена и работает без дополнительной настройки. Тем не менее, вы не должны использовать `Zone` чтобы заставить работать Angular, вместо этого выбрав самостоятельно запускать обнаружение изменений.

<div class="alert is-helpful">

<h4>Отключение <code>Zone</code></h4>

**Если вы отключите `Zone`, вам нужно будет самостоятельно инициировать обнаружение изменений в правильное время, что требует всесторонних знаний об обнаружении изменений**.

</div>

Удалять `zone.js`, внесите следующие изменения.

1. Удалить `zone.js` импорт из `polyfills.ts`.

  ```typescript
  /***************************************************************************************************
   * Zone JS is required by default for Angular itself.
   */
  // import 'zone.js/dist/zone'; // Included with Angular CLI.
  ```

2. Бутстрап Angular с `noop zone ` в ` src/main.ts`.

  ```typescript
  platformBrowserDynamic().bootstrapModule(AppModule, {ngZone: 'noop'})
    .catch(err => console.error(err));
  ```
