{@a observables-compared-to-other-techniques}
# Наблюдаемые по сравнению с другими методами

Вы часто можете использовать наблюдаемые вместо обещаний для доставки значений асинхронно. Аналогично, наблюдаемые могут заменить обработчики событий. Наконец, поскольку наблюдаемые предоставляют несколько значений, вы можете использовать их там, где в противном случае вы можете создавать массивы и работать с ними.

Наблюдаемые ведут себя несколько иначе, чем альтернативные методы в каждой из этих ситуаций, но предлагают некоторые существенные преимущества. Вот подробные сравнения различий.

{@a observables-compared-to-promises}
## Наблюдаемые по сравнению с обещаниями

Наблюдаемые часто сравнивают с обещаниями. Вот некоторые ключевые отличия:

* Наблюдаемые являются декларативными; расчет не начинается до подписки. Обещания выполняются немедленно при создании. Это делает наблюдаемые полезными для определения рецептов, которые можно запускать, когда вам нужен результат.

* Наблюдаемые дают много значений. Обещания дают один. Это делает наблюдаемые полезными для получения нескольких значений с течением времени.

* Наблюдаемые различают цепочку и подписку. Обещания только есть  `.then()`  предложения. Это делает наблюдаемые полезными для создания сложных рецептов преобразования, которые будут использоваться другой частью системы, без необходимости выполнения работы.

* Наблюдаемые  `subscribe()`  отвечает за обработку ошибок. Обещания подталкивают к ошибкам ребенка. Это делает наблюдаемые полезными для централизованной и предсказуемой обработки ошибок.


{@a creation-and-subscription}
### Создание и подписка

* Наблюдаемые не выполняются, пока потребитель не подпишется.  `subscribe()` выполняет определенное поведение один раз, и он может быть вызван снова. Каждая подписка имеет свои собственные вычисления. Повторная подписка вызывает пересчет значений.

  <code-example
    path="comparing-observables/src/observables.ts"
    header="src/observables.ts (observable)"
    region="observable">
  </code-example>

* Обещания выполняются сразу и только один раз. Вычисление результата начинается при создании обещания. Нет возможности возобновить работу. Все  `then`  предложения (подписки) делят то же самое вычисление.

  <code-example
    path="comparing-observables/src/promises.ts"
    header="src/promises.ts (promise)"
    region="promise">
  </code-example>

{@a chaining}
### Цепной

* Наблюдаемые различают функцию преобразования, такую ​​как карта и подписка. Только подписка активирует функцию подписчика, чтобы начать вычисление значений.

  <code-example
    path="comparing-observables/src/observables.ts"
    header="src/observables.ts (chain)"
    region="chain">
  </code-example>

* Обещания не делают различий между последними  `.then`  пункты (эквивалент подписки) и промежуточные  `.then`  предложения (эквивалентно карте).

  <code-example
    path="comparing-observables/src/promises.ts"
    header="src/promises.ts (chain)"
    region="chain">
  </code-example>

{@a cancellation}
### Отмена

* Наблюдаемые подписки отменяются. Отмена подписки удаляет слушателя от получения дальнейших значений и уведомляет функцию подписчика об отмене работы.

  <code-example
    path="comparing-observables/src/observables.ts"
    header="src/observables.ts (unsubcribe)"
    region="unsubscribe">
  </code-example>

* Обещания не подлежат отмене.

{@a error-handling}
### Обработка ошибок

* Наблюдаемые ошибки выполнения доставляются в обработчик ошибок подписчика, и подписчик автоматически отписывается от наблюдаемого.

  <code-example
    path="comparing-observables/src/observables.ts"
    header="src/observables.ts (error)"
    region="error">
  </code-example>

* Обещания подталкивают к ошибкам ребенка.

  <code-example
    path="comparing-observables/src/promises.ts"
    header="src/promises.ts (error)"
    region="error">
  </code-example>

{@a cheat-sheet}
### Шпаргалка

Следующие фрагменты кода иллюстрируют, как операции такого же типа определяются с помощью наблюдаемых и обещаний.

<table>
  <thead>
    <tr>
      <th>Операция </th>
      <th>Наблюдаемое </th>
      <th>Promise </th>
    </tr>

  <tbody>
    <tr>
      <td>Создание </td>
      <td>
        <pre>
new Observable((observer) => {
  observer.next(123);
});</pre>
      </td>
      <td>
        <pre>
new Promise((resolve, reject) => {
  resolve(123);
});</pre>
      </td>
    </tr>
    <tr>
      <td>Transform </td>
      <td><pre>obs.pipe(map((value) => value * 2));</pre></td>
      <td><pre>promise.then((value) => value * 2);</pre></td>
    </tr>
    <tr>
      <td>Подписка </td>
      <td>
        <pre>
sub = obs.subscribe((value) => {
  console.log(value)
});</pre>
      </td>
      <td>
        <pre>
promise.then((value) => {
  console.log(value);
});</pre>
      </td>
    </tr>
    <tr>
      <td>Отменить подписку </td>
      <td><pre>sub.unsubscribe();</pre></td>
      <td>Подразумевается обещание резолюции. </td>
    </tr>
  </tbody>
</table>

{@a observables-compared-to-events-api}
## Наблюдаемые по сравнению с API событий

Observables очень похожи на обработчики событий, которые используют API событий. Оба метода определяют обработчики уведомлений и используют их для обработки нескольких значений, доставленных с течением времени. Подписка на наблюдаемое эквивалентно добавлению прослушивателя событий. Одно существенное отличие состоит в том, что вы можете настроить наблюдаемое для преобразования события перед передачей события в обработчик.

Использование наблюдаемых для обработки событий и асинхронных операций может иметь преимущество большей согласованности в таких контекстах, как HTTP-запросы.

Вот несколько примеров кода, которые иллюстрируют, как один и тот же тип операции определяется с помощью наблюдаемых и API событий.

<table>
  <tr>
    <th></th>
    <th>Наблюдаемое </th>
    <th>API событий </th>
  </tr>
  <tr>
    <td>Создание и отмена </td>
    <td>
<pre>// Setup
let clicks$ = fromEvent(buttonEl, ‘click’);
// Begin listening
let subscription = clicks$
  .subscribe(e => console.log(‘Clicked’, e))
// Stop listening
subscription.unsubscribe();</pre>
   </td>
   <td>
<pre>function handler(e) {
  console.log(‘Clicked’, e);
}
// Setup & begin listening
button.addEventListener(‘click’, handler);
// Stop listening
button.removeEventListener(‘click’, handler);
</pre>
    </td>
  </tr>
  <tr>
    <td>Подписка </td>
    <td>
<pre>observable.subscribe(() => {
  // notification handlers here
});</pre>
    </td>
    <td>
<pre>element.addEventListener(eventName, (event) => {
  // notification handler here
});</pre>
    </td>
  </tr>
  <tr>
    <td>Конфигурация </td>
    <td>Прослушайте нажатия клавиш, но предоставьте поток, представляющий значение на входе.
<pre>fromEvent(inputEl, 'keydown').pipe(
  map(e => e.target.value)
);</pre>
    </td>
    <td>Не поддерживает настройку.
<pre>element.addEventListener(eventName, (event) => {
  // Cannot change the passed Event into another
  // value before it gets to the handler
});</pre>
    </td>
  </tr>
</table>


{@a observables-compared-to-arrays}
## Наблюдаемые по сравнению с массивами

Наблюдаемое производит значения с течением времени. Массив создается как статический набор значений. В некотором смысле наблюдаемые являются асинхронными, когда массивы являются синхронными. В следующих примерах ➞ подразумевает асинхронную доставку значений.

<table>
  <tr>
    <th></th>
    <th>Наблюдаемое </th>
    <th>Массив </th>
  </tr>
  <tr>
    <td>Дано </td>
    <td>
      <pre>obs: ➞1➞2➞3➞5➞7</pre>
      <pre>obsB: ➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr: [1, 2, 3, 5, 7]</pre>
      <pre>arrB: ['a', 'b', 'c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>concat()</pre></td>
    <td>
      <pre>concat(obs, obsB)</pre>
      <pre>➞1➞2➞3➞5➞7➞'a'➞'b'➞'c'</pre>
    </td>
    <td>
      <pre>arr.concat(arrB)</pre>
      <pre>[1,2,3,5,7,'a','b','c']</pre>
    </td>
  </tr>
  <tr>
    <td><pre>filter()</pre></td>
    <td>
      <pre>obs.pipe(filter((v) => v>3))</pre>
      <pre>➞5➞7</pre>
    </td>
    <td>
      <pre>arr.filter((v) => v>3)</pre>
      <pre>[5, 7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>find()</pre></td>
    <td>
      <pre>obs.pipe(find((v) => v>3))</pre>
      <pre>➞5</pre>
    </td>
    <td>
      <pre>arr.find((v) => v>3)</pre>
      <pre>5</pre>
    </td>
  </tr>
  <tr>
    <td><pre>findIndex()</pre></td>
    <td>
      <pre>obs.pipe(findIndex((v) => v>3))</pre>
      <pre>➞3</pre>
    </td>
    <td>
      <pre>arr.findIndex((v) => v>3)</pre>
      <pre>3</pre>
    </td>
  </tr>
  <tr>
    <td><pre>forEach()</pre></td>
    <td>
      <pre>obs.pipe(tap((v) => {
  console.log(v);
}))
1
2
3
5
7</pre>
    </td>
    <td>
      <pre>arr.forEach((v) => {
  console.log(v);
})
1
2
3
5
7</pre>
    </td>
  </tr>
  <tr>
    <td><pre>map()</pre></td>
    <td>
      <pre>obs.pipe(map((v) => -v))</pre>
      <pre>➞-1➞-2➞-3➞-5➞-7</pre>
    </td>
    <td>
      <pre>arr.map((v) => -v)</pre>
      <pre>[-1, -2, -3, -5, -7]</pre>
    </td>
  </tr>
  <tr>
    <td><pre>reduce()</pre></td>
    <td>
      <pre>obs.pipe(reduce((s,v)=> s+v, 0))</pre>
      <pre>➞18</pre>
    </td>
    <td>
      <pre>arr.reduce((s,v) => s+v, 0)</pre>
      <pre>18</pre>
    </td>
  </tr>
</table>
