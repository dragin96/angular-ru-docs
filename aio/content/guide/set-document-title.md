{@a top}

{@a set-the-document-title}
# Установите заголовок документа

Ваше приложение должно быть способно заставить строку заголовка браузера говорить то, что вы хотите.
Эта кулинарная книга объясняет, как это сделать.

Смотрите <live-example name="set-document-title"></live-example>.

{@a the-problem-with-*&lttitle&gt*}
## Проблема с *<title>*

Очевидный подход - привязать свойство компонента к HTML  `<title>`  как это:

<code-example format=''>
  &lt;title&gt;{{This_Does_Not_Work}}&lt;/title&gt;
</code-example>

Извините, но это не сработает.
Корневой компонент приложения - это элемент, содержащийся в  `<body>`  тег.
HTML  `<title>`  в документе  `<head>`, вне тела, что делает его недоступным для привязки данных Angular.

Вы можете взять браузер  `document`  объект и установить заголовок вручную.
Это грязно и подрывает ваши шансы когда-нибудь запустить приложение вне браузера.

<div class="alert is-helpful">

  Запуск вашего приложения вне браузера означает, что вы можете использовать преимущества на стороне сервера
  предварительный рендеринг для почти мгновенного времени рендеринга первого приложения и для SEO. Это означает, что вы можете убежать от
  внутри веб-работника, чтобы улучшить отзывчивость вашего приложения с помощью нескольких потоков. И это
  означает, что вы можете запустить свое приложение в Electron.js или Windows Universal, чтобы доставить его на рабочий стол.

</div>

{@a use-the-title-service}
## Использовать  `Title`  сервис

К счастью, Angular устраняет разрыв, предоставляя  `Title`  сервис как часть *платформы Browser*.
Служба [Title](api/platform-browser/Title)- это простой класс, который предоставляет API
для получения и установки текущего заголовка HTML документа:

*  `getTitle() : string` получает заголовок текущего HTML-документа.
*  `setTitle(newTitle : string)` устанавливает заголовок текущего HTML-документа.

Вы можете ввести  `Title`  сервис в корень  `AppComponent`  и выставить привязываемый  `setTitle`  метод, который называет его:


<code-example path="set-document-title/src/app/app.component.ts" region="class" header="src/app/app.component.ts (class)"></code-example>

Свяжите этот метод с тремя тегами привязки и вуаля!

<div class="lightbox">
  <img src="generated/images/guide/set-document-title/set-title-anim.gif" alt="Set title">
</div>

Вот полное решение:

<code-tabs>
  <code-pane header="src/main.ts" path="set-document-title/src/main.ts"></code-pane>
  <code-pane header="src/app/app.module.ts" path="set-document-title/src/app/app.module.ts"></code-pane>
  <code-pane header="src/app/app.component.ts" path="set-document-title/src/app/app.component.ts"></code-pane>
</code-tabs>

{@a why-provide-the-title-service-in-bootstrap}
## Зачем предоставлять  `Title`  сервис в  `bootstrap` 

Как правило, вы хотите предоставлять услуги для всего приложения в корневом компоненте приложения,  `AppComponent`.

Эта кулинарная книга рекомендует регистрировать службу заголовков во время начальной загрузки
место, которое вы резервируете для настройки среды исполнения Angular.

Это именно то, что вы делаете.
 `Title` сервис является частью Angular *браузерной платформы*.
Если вы самонастройка приложения в другую платформу,
вам придется предоставить другой  `Title`  сервис, который понимает
концепция «заголовка документа» для этой конкретной платформы.
В идеале само приложение не знает и не заботится о среде выполнения.
