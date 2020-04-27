{@a browser-support}
# Поддержка браузера

Angular поддерживает самые последние браузеры. Это включает в себя следующие версии конкретные:

<table>

  <tr>

<th>
      Browser
</th>

<th>
      Поддерживаемые версии
</th>

  </tr>

  <tr>

    <td>
      Хром
    </td>

    <td>
      последний
    </td>
  </tr>

  <tr>

    <td>
      Firefox
    </td>

    <td>
      последний
    </td>
  </tr>

  <tr>

    <td>
      Edge
    </td>

    <td>
      2 самые последние основные версии
    </td>
  </tr>
  <tr>
    <td>
      IE
    </td>
    <td>
      11, 10, 9 (режим «совместимости просмотра» не поддерживается)
    </td>
  </tr>
 <tr>
   <tr>
    <td>
      IE Mobile
    </td>
    <td>
      11
    </td>
  </tr>
 <tr>
    <td>
      Safari
    </td>

    <td>
      2 самые последние основные версии
    </td>
  </tr>
  <tr>
    <td>
      IOS
    </td>

    <td>
      2 самые последние основные версии
    </td>
  </tr>
  <tr>
    <td>
      Android
    </td>

    <td>
      Х (10,0), Пирог (9,0), Орео (8,0), Нуга (7,0)
    </td>
  </tr>

</table>

<div class="alert is-helpful">

Процесс непрерывной интеграции Angular запускает модульные тесты инфраструктуры во всех этих браузерах для каждого запроса на извлечение
используя <a href="https://saucelabs.com/">SauceLabs </a>и
<a href="https://www.browserstack.com">Browserstack </a>.

</div>

{@a polyfills}
## Полифиллы

Angular построен по последним стандартам веб-платформы.
Ориентация на такой широкий спектр браузеров является сложной задачей, поскольку они не поддерживают все функции современных браузеров.
Вы компенсируете загрузку сценариев polyfill («polyfills») для браузеров, которые вы должны поддерживать.
[Таблица ниже](#polyfill-libs)идентифицирует большинство polyfills вам может понадобиться.

<div class="alert is-important">

Предлагаемые полифилы - те, которые выполняют полные Angular приложения.
Вам могут понадобиться дополнительные полифиллы для поддержки функций, не включенных в этот список.
Обратите внимание, что полифиллы не могут волшебным образом преобразовать старый, медленный браузер в современный, быстрый.

</div>

В Angular CLI версии 8 и выше приложения создаются с использованием *дифференциальной загрузки*, стратегии, в которой CLI создает два отдельных пакета как часть развернутого приложения.

* Первый пакет содержит современный синтаксис ES2015, использует встроенную поддержку современных браузеров, поставляет меньше полифилов и приводит к меньшему размеру пакета.

* Второй пакет содержит код в старом синтаксисе ES5, а также все необходимые полифилы. Это приводит к увеличению размера пакета, но поддерживает старые браузеры.

Эта стратегия позволяет вам продолжать создавать ваше веб-приложение для поддержки нескольких браузеров, но загружать только тот код, который необходим браузеру.
Для получения дополнительной информации о том, как это работает, см. [Дифференциальная загрузка](guide/deployment#differential-loading)в [Руководство по развертыванию](guide/deployment).

{@a enabling-polyfills-with-cli-projects}
## Включение полизаполнения в проектах CLI

[Angular CLI](cli)обеспечивает поддержку polyfills.
Если вы не используете CLI для создания своих проектов, см. [Инструкции по Polyfill для пользователей, не являющихся пользователями CLI](#non-cli).

Когда вы создаете проект с  `ng new` команда, а  `src/polyfills.ts`  конфигурации создается как часть вашей папки проекта.
Этот файл включает в себя обязательные и многие дополнительные полифилы в виде JavaScript  `import`  заявления.

* Пакеты npm для [_mandatory_ polyfills](#polyfill-libs)(такие как  `zone.js`) устанавливаются автоматически при создании проекта с `ng new` и соответствующие им  `import`  операторы уже включены в  `src/polyfills.ts`  конфигурации.

* Если вам нужно _optional_ polyfill, вы должны установить его пакет npm, затем раскомментировать или создать соответствующий оператор импорта в  `src/polyfills.ts`  конфигурации.

Например, если вам нужен опциональный [веб-анимация полифилл](http://caniuse.com/#feat=web-animation), вы можете установить его с  `npm`, используя следующую команду (или  `yarn`  эквивалент)

<code-example language="sh" class="code-shell">
  # install the optional web animations polyfill
  npm install --save web-animations-js
</code-example>

Затем вы можете добавить оператор импорта в  `src/polyfills.ts`  Файл.
Для многих polyfills, вы можете просто откомментировать соответствующие  `import`  оператор в файле, как в следующем примере.

<code-example header="src/polyfills.ts">
  /**
  * Required to support Web Animations  `@angular/platform-browser/animations`.
  * Needed for: All but Chrome, Firefox and Opera. http://caniuse.com/#feat=web-animation
  **/
  import 'web-animations-js';  // Run  `npm install --save web-animations-js`.
</code-example>

Если нужного вам полифилла еще нет  `polyfills.ts`  файл, добавьте  `import`  заявления вручную.


{@a polyfill-libs}

{@a mandatory-polyfills}
### Обязательные полифилы
Это polyfills необходимый для запуска приложения на угловое каждый поддерживаемый браузере:

<table>

  <tr style="vertical-align: top">

    <th>
      Браузеры (настольные и мобильные)
    </th>

    <th>
      Полифилы Обязательные
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>
      Chrome, Firefox, край, <br>
      Safari, Android, IE 10+
    </td>

    <td>

      [ES2015](guide/browser-support#core-es6)

    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>
      IE 9
    </td>

    <td>

      ES2015 <br>[classList](guide/browser-support#classlist)

    </td>

  </tr>

</table>


{@a optional-browser-features-to-polyfill}
### Дополнительные функции браузера для заполнения

Для некоторых функций Angular могут потребоваться дополнительные полифилы.

<table>

  <tr style="vertical-align: top">

    <th>
      Особенность
    </th>

    <th>
      Полифилл
    </th>

    <th style="width: 50%">
       Браузеры (настольные и мобильные)
    </th>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [AnimationBuilder](api/animations/AnimationBuilder).
      (Стандартная поддержка анимации не требует polyfills.)

    </td>

    <td>

      [Веб-анимация](guide/browser-support#web-animations)

    </td>

    <td>
      <p>Если используется AnimationBuilder, включает очистку
      поддержка IE / Edge и Safari.
      (Chrome и Firefox поддерживают это изначально). </p>
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

       [NgClass](api/common/NgClass)на элементах SVG
    </td>

    <td>

      [classList](guide/browser-support#classlist)

    </td>

    <td>
      IE 10, IE 11
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Http](guide/http)при отправке и получении двоичных данных
    </td>

    <td>

      [Типизированный массив](guide/browser-support#typedarray)<br>

      [Blob](guide/browser-support#blob)<br>

      [FormData](guide/browser-support#formdata)

    </td>

    <td>
      IE 9
    </td>

  </tr>

  <tr style="vertical-align: top">

    <td>

      [Роутер](guide/router)при использовании
      [маршрутизация на основе хеша](guide/router#appendix-locationstrategy-and-browser-url-styles)
    </td>

    <td>

      [ES7 / массив](guide/browser-support#core-es7-array)

    </td>

    <td>
      IE 11
    </td>

  </tr>

</table>



{@a suggested-polyfills}
### Предлагаемые полифилы

Следующие polyfills используются, чтобы проверить саму структуру. Они являются хорошей отправной точкой для приложения.


<table>

  <tr>

    <th>
      Полифилл
    </th>

    <th>
      Лицензия
    </th>

    <th>
      Размер*
    </th>

  </tr>

  <tr>

    <td>

      <a id='core-es7-array' href="https://github.com/zloirock/core-js/tree/v2/fn/array">ES7 / массив </a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0,1 КБ
    </td>

  </tr>

  <tr>

    <td>

      <a id='core-es6' href="https://github.com/zloirock/core-js">ES2015 </a>

    </td>

    <td>
      MIT
    </td>

    <td>
      27,4 КБ
    </td>

  </tr>

  <tr>

    <td>

      <a id='classlist' href="https://github.com/eligrey/classList.js">classList </a>

    </td>

    <td>
      Общественное достояние
    </td>

    <td>
      1 КБ
    </td>

  </tr>

  <tr>

    <td>

      <a id='intl' href="https://github.com/andyearnshaw/Intl.js">Intl </a>

    </td>

    <td>
      Лицензия MIT / Unicode
    </td>

    <td>
      13,5 КБ
    </td>

  </tr>

  <tr>

    <td>

       <a id='web-animations' href="https://github.com/web-animations/web-animations-js">Веб-анимация </a>

    </td>

    <td>
      Апач
    </td>

    <td>
      14,8 КБ
    </td>

  </tr>

  <tr>

    <td>

      <a id='typedarray' href="https://github.com/inexorabletash/polyfill/blob/master/typedarray.js">Типизированный Массив </a>

    </td>

    <td>
      MIT
    </td>

    <td>
      4 КБ
    </td>

  </tr>

  <tr>

    <td>

       <a id='blob' href="https://github.com/eligrey/Blob.js">Blob </a>

    </td>

    <td>
      MIT
    </td>

    <td>
      1.3 КБ
    </td>

  </tr>

  <tr>

    <td>

       <a id='formdata' href="https://github.com/francois2metz/html5-formdata">FormData </a>

    </td>

    <td>
      MIT
    </td>

    <td>
      0,4 КБ
    </td>

  </tr>

</table>


\ * Цифры для сокращенного и сжатого кода
вычисляется с помощью <a href="http://closure-compiler.appspot.com/home">компилятора замыкания </a>.

{@a non-cli}

{@a polyfills-for-non-cli-users}
## Polyfills для пользователей без CLI

Если вы не используете CLI, добавьте сценарии polyfill непосредственно на веб-страницу хоста (`index.html`).

Например:

<code-example header="src/index.html" language="html">
  &lt;!-- pre-zone polyfills -->
  &lt;script src="node_modules/core-js/client/shim.min.js">&lt;/script>
  &lt;script src="node_modules/web-animations-js/web-animations.min.js">&lt;/script>
  &lt;script>
    /**
     * you can configure some zone flags which can disable zone interception for some
     * asynchronous activities to improve startup performance - use these options only
     * if you know what you are doing as it could result in hard to trace down bugs..
     */
    // __Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
    // __Zone_disable_on_property = true; // disable patch onProperty such as onclick
    // __zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames

    /*
     * in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
     * with the following flag, it will bypass  `zone.js`  patch for IE/Edge
     */
    // __Zone_enable_cross_context_check = true;
  &lt;/script>
  &lt;!-- zone.js required by Angular -->
  &lt;script src="node_modules/zone.js/dist/zone.js">&lt;/script>

  &lt;!-- application polyfills -->
</code-example>
