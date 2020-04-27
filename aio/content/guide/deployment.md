{@a deployment}
# Развертывание

Когда вы готовы развернуть приложение Angular на удаленном сервере, у вас есть различные варианты развертывания.

{@a dev-deploy}
{@a copy-files}


{@a simple-deployment-options}
## Простые варианты развертывания

Перед полным развертыванием приложения вы можете протестировать процесс, создать конфигурацию и развернутое поведение, используя один из этих промежуточных методов.

{@a building-and-serving-from-disk}
### Сборка и подача с диска

Во время разработки вы обычно используете `ng serve` Команда для создания, просмотра и обслуживания приложения из локальной памяти, используя [webpack-dev-server](https://webpack.js.org/guides/development/#webpack-dev-server).
Когда вы будете готовы к развертыванию, вы должны использовать `ng build` Команда для сборки приложения и развертывания артефактов сборки в другом месте.

И то и другое `ng build ` и ` ng serve` очистки выходной папки перед сборкой проекта, но только `ng build` Команда записывает сгенерированные артефакты сборки в выходную папку.

<div class="alert is-helpful">

Выходная папка   `dist/project-name/` по умолчанию.
Чтобы вывести в другую папку, измените  `outputPath`  in  `angular.json`.

</div>

Когда вы приближаетесь к концу процесса разработки, обслуживание содержимого вашей выходной папки с локального веб-сервера может дать вам лучшее представление о том, как ваше приложение будет себя вести при развертывании на удаленном сервере.
Вам понадобятся два терминала, чтобы получить опыт прямой перезагрузки.

* На первом терминале запустите команду [ `ng build` ](cli/build)в*наблюдения, * режиме чтобы скомпилировать приложение в  `dist`  папка.

  <code-example language="none" class="code-shell">

   ng build --watch

  </code-example>

  Словно `ng serve` Команда, она восстанавливает выходные файлы при изменении исходных файлов.

* На втором терминале установите веб-сервер (например, [lite-server](https://github.com/johnpapa/lite-server)) и запустите его для выходной папки. Например:

  <code-example language="none" class="code-shell">

   lite-server --baseDir="dist/project-name"

  </code-example>

   Сервер автоматически перезагрузит ваш браузер при выводе новых файлов.

<div class="alert is-critical">

Этот метод предназначен только для разработки и тестирования и не является поддерживаемым или безопасным способом развертывания приложения.

</div>

{@a automatic-deployment-with-the-cli}
### Автоматическое развертывание с помощью CLI

Команда Angular CLI  `ng deploy` (представленный в версии 8.3.0) выполняет  `deploy`   [CLI builder](https://angular.io/guide/cli-builder)связанный с вашим проектом. Ряд сторонних сборщиков реализуют возможности развертывания на разных платформах. Вы можете добавить любой из них в свой проект, запустив `ng add [package name]`.

Когда вы добавляете пакет с возможностью развертывания, он автоматически обновляет конфигурацию вашего рабочего пространства (`angular.json`  файл) с  `deploy`  раздел для выбранного проекта. Затем вы можете использовать `ng deploy` Команда для развертывания этого проекта.

Например, следующая команда автоматически развертывает проект в Firebase.

<code-example language="none" class="code-shell">
ng add @angular/fire
ng deploy
</code-example>

Команда является интерактивной. В этом случае вы должны иметь или создать учетную запись Firebase и аутентифицироваться с использованием этой учетной записи. Команда предложит вам выбрать проект Firebase для развертывания

После того, как команда производит оптимальную сборку вашего приложения (эквивалентно `ng deploy --prod`), он загрузит производственные активы в Firebase.

В таблице ниже вы можете найти список пакетов, которые реализуют функциональность развертывания на разных платформах.  `deploy` Команда для каждого пакета может потребовать различных параметров командной строки. Вы можете прочитать по ссылкам, связанные с именами пакетов ниже:

| Развертывание в                                               | Пакет                                                                             |
|---------------------------------------------------------------|---------------------------------------------------------------------------------- |
| [Firebase хостинг](https://firebase.google.com/docs/hosting)  | [ `@angular/fire` ](https://npmjs.org/package/@angular/fire)                     |
| [Azure](https://azure.microsoft.com/en-us/)                   | [ `@azure/ng-deploy` ](https://npmjs.org/package/@azure/ng-deploy)               |
| [Now](https://zeit.co/now)                                    | [ `@zeit/ng-deploy` ](https://npmjs.org/package/@zeit/ng-deploy)                 |
| [Netlify](https://www.netlify.com/)                           | [ `@netlify-builder/deploy` ](https://npmjs.org/package/@netlify-builder/deploy) |
| [Страницы GitHub](https://pages.github.com/)                  | [ `angular-cli-ghpages` ](https://npmjs.org/package/angular-cli-ghpages)         |
| [NPM](https://npmjs.com/)                                     | [ `ngx-deploy-npm` ](https://npmjs.org/package/ngx-deploy-npm)                   |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3)| [ `@jefiozie/ngx-aws-deploy` ](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy)|

Если вы развертываете на автономном сервере или у вас нет разработчика для вашей любимой облачной платформы, вы можете создать конструктор, который позволит вам использовать `ng deploy`  Команда или прочитайте это руководство, чтобы узнать, как вручную развернуть ваше приложение.

{@a basic-deployment-to-a-remote-server}
### Базовое развертывание на удаленном сервере

Для простейшего развертывания создайте производственную сборку и скопируйте выходной каталог на веб-сервер.

1. Начнем с производства сборки:

  <code-example language="none" class="code-shell">

    ng build --prod

  </code-example>


2. Скопируйте _everything_ в выходную папку (  `dist/`  по умолчанию) в папку на сервере.

3. Настройте сервер для перенаправления запросов на отсутствующие файлы в  `index.html`.
Узнайте больше о перенаправлениях на стороне сервера [ниже](#fallback).

Это простейшее готовое к развертыванию развертывание вашего приложения.

{@a deploy-to-github}

{@a deploy-to-github-pages}
### Развертывание на страницах GitHub

Другой простой способ развернуть ваше приложение Angular - использовать [GitHub Pages](https://help.github.com/articles/what-is-github-pages/).

1. Вам необходимо [создать учетную запись GitHub](https://github.com/join)если у вас ее нет, а затем [создать репозиторий](https://help.github.com/articles/create-a-repo/)для вашего проекта.
Запишите имя пользователя и имя проекта в GitHub.

1. Создайте свой проект, используя имя проекта GitHub, с помощью команды Angular CLI [ `нг build` ](cli/build)и вариантов, показанных здесь:

  <code-example language="none" class="code-shell">

    ng build --prod --output-path docs --base-href /&lt;project_name&gt;/

  </code-example>

1. Когда сборка будет завершена, сделайте копию  `docs/index.html`  и назовите его  `docs/404.html`.

1. Зафиксируйте свои изменения и нажмите.

1. На странице проекта GitHub настройте его на [публикация из папки docs](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch).

Вы можете увидеть свою развернутую страницу на  `https://<user_name>.github.io/<project_name>/`.

<div class="alert is-helpful">

Проверьте [angular-cli-ghpages](https://github.com/angular-buch/angular-cli-ghpages), полнофункциональный пакет, который делает все это для вас и имеет дополнительную функциональность.

</div>

<hr>

{@a server-configuration}

{@a server-configuration}
## Конфигурация сервера

В этом разделе описываются изменения, которые вам, возможно, придется внести на сервер или в файлы, развернутые на сервере.

{@a fallback}

{@a routed-apps-must-fallback-to-index.html}
### Маршрутизированные приложения должны иметь запасной вариант к  `index.html` 

Angular-приложения являются идеальными кандидатами для работы с простым статическим HTML-сервером.
Вам не нужен серверный движок для динамического создания страниц приложения, потому что
Angular делает это на стороне клиента.

Если приложение использует Angular маршрутизатор, необходимо настроить сервер
вернуть страницу хоста приложения (`index.html`) при запросе файла, которого у него нет.

{@a deep-link}

Маршрутизируемое приложение должно поддерживать «глубокие ссылки».
_Deep link_ - это URL, который указывает путь к компоненту внутри приложения.
Например,  `http://www.mysite.com/heroes/42`  www.mysite.comheroes42 - это глубокая ссылка на страницу с описанием героя
который отображает героя с `id: 42`.

Нет проблем, когда пользователь переходит на этот URL из запущенного клиента.
Маршрутизатор Angular интерпретирует URL-адрес и маршруты к этой странице и герою.

Но нажав на ссылку в сообщении электронной почты, введите его в адресной строке браузера
или просто обновить браузер на странице сведений о герое
все эти действия обрабатываются самим браузером, _outside_ запущенным приложением.
Браузер делает прямой запрос к серверу для этого URL, минуя маршрутизатор.

Статический сервер регулярно возвращает  `index.html`  когда он получает запрос на  `http://www.mysite.com/`.
Но это отвергает  `http://www.mysite.com/heroes/42`  и возвращает `404 - Not Found` ошибка *если* это не так
настроен на возврат  `index.html`  вместо.

{@a fallback-configuration-examples}
#### Примеры резервной конфигурации

Не существует единой конфигурации, которая бы работала для каждого сервера.
В следующих разделах описываются конфигурации для некоторых из самых популярных серверов.
Список ни в коем случае не является исчерпывающим, но должен предоставить вам хорошую отправную точку.

* [Apache](https://httpd.apache.org/): добавить
[переписать правило](http://httpd.apache.org/docs/current/mod/mod_rewrite.html)в  `.htaccess`  Файл как показано
  (https://ngmilk.rocks/2015/03/09/angularjs-html5-mode-or-pretty-urls-on-apache-using-htaccess/)

  <code-example>
    RewriteEngine On
    &#35 If an existing asset or directory is requested go to it as it is
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -f [OR]
    RewriteCond %{DOCUMENT_ROOT}%{REQUEST_URI} -d
    RewriteRule ^ - [L]<br>
    &#35 If the requested resource doesn't exist, use index.html
    RewriteRule ^ /index.html
  </code-example>


* [Nginx](http://nginx.org/): использовать  `try_files`, как описано в
[Front Controller шаблон веб - приложение](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/#front-controller-pattern-web-apps),
модифицированный, чтобы служить  `index.html`  :

  ```
  try_files $uri $uri/ /index.html;
  ```

* [Ruby](https://www.ruby-lang.org/): создайте сервер Ruby с помощью ( [sinatra](http://sinatrarb.com/)) с базовым файлом Ruby, который настраивает сервер  `server.rb`  :

  ``` ruby
  require 'sinatra'

  # Folder structure
  #.
  # -- server.rb
  # -- public
  #    |-- dist
  #        |-- index.html

  get '/' do
      folderDir = settings.public_folder + '/dist'  # ng build output folder
      send_file File.join(folderDir, 'index.html')
  end
  ```


* [IIS](https://www.iis.net/): добавить правило перезаписи в  `web.config`, аналогичный показанному
[Здесь](http://stackoverflow.com/a/26152011/2116927):

  <code-example format='.' language="xml">
    &lt;system.webServer&gt;
      &lt;rewrite&gt;
        &lt;rules&gt;
          &lt;rule name="Angular Routes" stopProcessing="true"&gt;
            &lt;match url=".*" /&gt;
            &lt;conditions logicalGrouping="MatchAll"&gt;
              &lt;add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" /&gt;
              &lt;add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" /&gt;
            &lt;/conditions&gt;
            &lt;action type="Rewrite" url="/index.html" /&gt;
          &lt;/rule&gt;
        &lt;/rules&gt;
      &lt;/rewrite&gt;
    &lt;/system.webServer&gt;
  </code-example>


* [GitHub Pages](https://pages.github.com/): вы не можете
[напрямую настроить](https://github.com/isaacs/github/issues/408)
сервер страниц GitHub, но вы можете добавить страницу 404.
копия  `index.html`  в  `404.html`.
Он все равно будет использоваться в качестве ответа 404, но браузер обработает эту страницу и загрузит приложение должным образом.
Это также хорошая идея
[служить от  `docs /`  на master](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch)
и к
[создайте файл  `.nojekyll` ](https://www.bennadel.com/blog/3181-including-node-modules-and-vendors-folders-in-your-github-pages-site.htm)


* [Firebase хостинг](https://firebase.google.com/docs/hosting/): добавить
[переписать правило](https://firebase.google.com/docs/hosting/url-redirects-rewrites#section-rewrites).

  <code-example language="json">
    "rewrites": [ {
      "source": "**",
      "destination": "/index.html"
    } ]
  </code-example>

{@a cors}

{@a requesting-services-from-a-different-server-cors}
### Запрос услуг с другого сервера (CORS)

Разработчики Angular могут столкнуться с

<i>совместное использование ресурсов</i>
на сервер, отличный от собственного хост-сервера приложения.
Браузеры запрещают такие запросы, если сервер не разрешает их явно.

Клиентское приложение ничего не может сделать с этими ошибками.
Сервер должен быть настроен на прием запросов приложения.
Прочтите о том, как включить CORS для определенных серверов, по адресу
enable-cors.org.

<hr>

{@a optimize}

{@a production-optimizations}
## Оптимизация производства

 `--prod` _meta-flag_ включает следующие функции оптимизации сборки.

* [Опережающая компиляция (AOT)](guide/aot-compiler): предварительно компилирует шаблоны Angular компонентов.
* [Режим производства](#enable-prod-mode): развертывает производственную среду, которая включает _production mode_.
* Связывание: объединяет множество файлов приложений и библиотек в несколько пакетов.
* Минификация: удаляет лишние пробелы, комментарии и дополнительные токены.
* Uglification: переписывает код для использования коротких, загадочных имен переменных и функций.
* Устранение мертвого кода: удаляет модули без ссылок и много неиспользуемого кода.

Видеть[ `ng build` ](cli/build)для получения дополнительной информации о параметрах сборки CLI и о том, что они делают.


{@a enable-prod-mode}

{@a enable-runtime-production-mode}
### Включить рабочий режим производства

В дополнение к оптимизации сборки, Angular также имеет рабочий режим производства. Angular приложения работают в режиме разработки по умолчанию, как вы можете увидеть следующее сообщение на консоли браузера:

<code-example format="nocode">

  Angular is running in the development mode. Call enableProdMode() to enable the production mode.

</code-example>

Переключение в _production mode_ ускоряет его работу, отключая специальные проверки разработки, такие как циклы обнаружения двойных изменений.

При включении производственных сборок через  `--prod`  командной строки режим также включен.

{@a lazy-loading}

{@a lazy-loading}
### Ленивая загрузка

Вы можете значительно сократить время запуска, загружая только те модули приложения
обязательно должно присутствовать при запуске приложения.

Сконфигурируйте Angular Router, чтобы отложить загрузку всех других модулей (и связанного с ними кода), либо
[ожидание, пока приложение не запустится](guide/router#preloading  "Preloading")
или [_lazy loading_](guide/router#asynchronous-routing "Lazy loading")
их по требованию.

<div class="callout is-helpful">

<header>Не срочно импортируйте что-либо из загруженного с отложенным доступом модуля </header>

Если вы хотите «лениво» загрузить модуль, будьте осторожны, не импортируйте его
в файле, который нетерпеливо загружается при запуске приложения (например, в корневой  `AppModule`).
Если вы сделаете это, модуль будет загружен немедленно.

Конфигурация комплектации должна учитывать ленивую загрузку.
Поскольку модули с отложенной загрузкой не импортируются в JavaScript, упаковщики исключают их по умолчанию.
Поставщики не знают о конфигурации маршрутизатора и не могут создавать отдельные пакеты для модулей с отложенной загрузкой.
Вы должны будете создать эти пакеты вручную.

CLI работает
[Angular вперед-оф-Time Webpack Plugin](https://github.com/angular/angular-cli/tree/master/packages/ngtools/webpack)
который автоматически распознает ленивый  `NgModules`  и создает отдельные пакеты для них.

</div>

{@a measure}

{@a measure-performance}
### Мера производительности

Вы можете принимать лучшие решения о том, что оптимизировать и как, когда у вас есть четкое и точное понимание
что делает приложение медленным.
Причиной может быть не то, что вы думаете.
Вы можете тратить много времени и денег на оптимизацию чего-то, что не приносит ощутимой пользы или даже замедляет работу приложения.
Вы должны измерить реальное поведение приложения при работе в средах, которые важны для вас.



Страница Chrome DevTools Network Performance

Инструмент [WebPageTest](https://www.webpagetest.org/)- еще один хороший выбор
это также может помочь убедиться, что ваше развертывание прошло успешно.

{@a inspect-bundle}

{@a inspect-the-bundles}
### Осмотрите связки

Источник-карта-исследователь
Это отличный способ проверить сгенерированные пакеты JavaScript после производственной сборки.

устанавливать  `source-map-explorer`  :

<code-example language="none" class="code-shell">

  npm install source-map-explorer --save-dev

</code-example>

Создайте свое приложение для производства, включая исходные карты

<code-example language="none" class="code-shell">

  ng build --prod --source-map

</code-example>

Перечислите сгенерированные пакеты в  `dist/`  папка.

<code-example language="none" class="code-shell">

  ls dist/*.bundle.js

</code-example>

Запустите проводник, чтобы сгенерировать графическое представление одного из комплектов.
В следующем примере отображается график для пакета _main_.

<code-example language="none" class="code-shell">

  node_modules/.bin/source-map-explorer dist/main.*.bundle.js

</code-example>

 `source-map-explorer` анализирует исходную карту, сгенерированную в комплекте, и рисует карту всех зависимостей
показывая, какие именно классы включены в комплект.

Вот выходные данные для пакета _main_ примера приложения под названием  `cli-quickstart`.

<div class="lightbox">
  <img src="generated/images/guide/deployment/quickstart-sourcemap-explorer.png" alt="quickstart sourcemap explorer">
</div>

{@a base-tag}

{@a the-base-tag}
##  `base` тег

HTML [_<base href = "..." /> _](/guide/router)
указывает базовый путь для разрешения относительных URL-адресов к ресурсам, таким как изображения, сценарии и таблицы стилей.
Например, учитывая `<base href="/my/app/">`, браузер разрешает URL-адрес, такой как  `some/place/foo.jpg` 
в запрос к серверу для  `my/app/some/place/foo.jpg`.
Во время навигации маршрутизатор Angular использует _base href_ в качестве базового пути к файлам компонентов, шаблонов и модулей.

<div class="alert is-helpful">

Смотрите также [* APP_BASE_HREF*](api/common/APP_BASE_HREF "API: APP_BASE_HREF") альтернатива.

</div>

В разработке вы обычно запускаете сервер в папке, которая содержит  `index.html`.
Это корневая папка, и вы добавите `<base href="/">` в верхней части  `index.html`  потому что  `/`  является корнем приложения.

Но на общем или производственном сервере вы можете обслуживать приложение из подпапки.
Например, когда URL для загрузки приложения выглядит как  `http://www.mysite.com/my/app/`,
подпапка  `my/app/`  и вы должны добавить `<base href="/my/app/">` для серверной версии  `index.html`.

Когда  `base`  неверно настроен тег, приложение не загружается и отображается консоль браузера `404 - Not Found` ошибок
для отсутствующих файлов. Посмотрите, где _три_, пытались найти эти файлы и соответствующим образом скорректируйте базовый тег.

{@a differential-loading}

{@a differential-loading}
## Дифференциальная нагрузка

При создании веб-приложений вы хотите убедиться, что ваше приложение совместимо с большинством браузеров.
Несмотря на то, что JavaScript продолжает развиваться с появлением новых функций, не все браузеры обновляются с поддержкой этих новых функций в одинаковом темпе.

Код, который вы пишете в разработке с использованием TypeScript, компилируется и связывается с ES2015, синтаксисом JavaScript, который совместим с большинством браузеров.
Все современные браузеры поддерживают ES2015 и более поздние версии, но в большинстве случаев вам все равно придется учитывать пользователей, обращающихся к вашему приложению из браузера, который этого не делает.
При нацеливании на старые браузеры [полифиллы](guide/browser-support#polyfills)могут восполнить пробел, предоставляя функции, которых нет в более старых версиях JavaScript, поддерживаемых этими браузерами.

Чтобы максимизировать совместимость, вы можете отправить один пакет, включающий весь ваш скомпилированный код, а также любые полифилы, которые могут понадобиться.
Однако пользователям современных браузеров не нужно платить цену за увеличенный размер пакета, который поставляется с ненужными полифиллами.
Разностная загрузка, которая поддерживается по умолчанию в Angular CLI версии 8 и выше, решает эту проблему.

Дифференциальная загрузка - это стратегия, которая позволяет вашему веб-приложению поддерживать несколько браузеров, но загружать только тот код, который необходим браузеру. Когда включена дифференциальная загрузка (которая используется по умолчанию), CLI создает два отдельных пакета как часть развернутого приложения.

* Первый пакет содержит современный синтаксис ES2015, использует встроенную поддержку современных браузеров, поставляет меньше полифилов и приводит к меньшему размеру пакета.

* Второй пакет содержит код в старом синтаксисе ES5, а также все необходимые полифилы. Это приводит к увеличению размера пакета, но поддерживает старые браузеры.

{@a differential-builds}
### Дифференциальные сборки

При развертывании с использованием процесса сборки Angular CLI вы можете выбрать, как и когда поддерживать дифференциальную загрузку.
[ `Нг build`  CLI команда](cli/build)запрашивает конфигурацию браузера и сконфигурированной цель сборки, чтобы определить, если требуется поддержка для устаревших браузеров, и должна ли сборка произвести необходимые пакеты, используемые для дифференциальной нагрузки.

Следующие конфигурации определяют ваши требования.

* Список браузеров

 `browserslist` Файл конфигурации список включен в ваше приложение [структура проекта](guide/file-structure#application-configuration-files)и обеспечивает минимальное количество браузеров, поддерживаемых вашим приложением. Смотрите [Browserslist spec](https://github.com/browserslist/browserslist)для полной настройки параметров.

* Конфигурация TypeScript

   В файле конфигурации TypeScript  `tsconfig.json`, опция "target" в  `compilerOptions`  Раздел определяет целевую версию ECMAScript, в которую компилируется код.
   Современные браузеры изначально поддерживают ES2015, а ES5 чаще используется для поддержки устаревших браузеров.

<div class="alert is-helpful">

   Дифференциальная загрузка в настоящее время поддерживается только при использовании  `es2015`  как цель компиляции. При использовании с целями выше  `es2015`, процесс сборки выдает предупреждение.

</div>

Для сборки разработки, вывод, произведенный `ng build` проще и проще в отладке, что позволяет вам меньше полагаться на исходные карты скомпилированного кода.

Для производственной сборки ваша конфигурация определяет, какие пакеты создаются для развертывания вашего приложения.
При необходимости  `index.html`  Файл также изменяется в процессе сборки и включает теги сценариев, которые разрешают дифференциальную загрузку, как показано в следующем примере.

<code-example language="html" header="index.html">
&lt;body>
  &lt;app-root>&lt;/app-root>
  &lt;script src="runtime-es2015.js" type="module">&lt;/script>
  &lt;script src="runtime-es5.js" nomodule>&lt;/script>
  &lt;script src="polyfills-es2015.js" type="module">&lt;/script>
  &lt;script src="polyfills-es5.js" nomodule>&lt;/script>
  &lt;script src="styles-es2015.js" type="module">&lt;/script>
  &lt;script src="styles-es5.js" nomodule>&lt;/script>
  &lt;script src="vendor-es2015.js" type="module">&lt;/script>
  &lt;script src="vendor-es5.js" nomodule>&lt;/script>
  &lt;script src="main-es2015.js" type="module">&lt;/script>
  &lt;script src="main-es5.js" nomodule>&lt;/script>
&lt;/body>
</code-example>

Каждый тег сценария имеет  `type="module"`  или  `nomodule`  атрибут Браузеры с собственной поддержкой модулей ES загружают только сценарии с  `module`  атрибут типа и игнорировать сценарии с  `nomodule`  атрибут Устаревшие браузеры загружают только сценарии с  `nomodule`  атрибут и игнорируйте теги сценария с  `module`  тип который загружает модули ES.

<div class="alert is-helpful">

   Некоторые устаревшие браузеры по-прежнему загружают оба пакета, но выполняют только соответствующие сценарии на основе атрибутов, упомянутых выше. Вы можете прочитать больше о проблеме [здесь](https://github.com/philipwalton/webpack-esnext-boilerplate/issues/1).

</div>

{@a configuring-differential-loading}
### Настройка дифференциальной нагрузки

Дифференциальная загрузка поддерживается по умолчанию в версии 8 и более поздних версиях Angular CLI.
Для каждого проекта приложения в вашей рабочей области вы можете настроить способ создания сборок на основе  `browserslist`  и  `tsconfig.json`  Конфигурационные файлы в вашем проекте приложения.

Для вновь созданного приложения Angular устаревшие браузеры, такие как IE 9-11, игнорируются, а целью компиляции является ES2015.

<code-example language="none" header="browserslist">
> 0.5%
last 2 versions
Firefox ESR
not dead
not IE 9-11 # For IE 9-11 support, remove 'not'.
</code-example>

<code-example language="json" header="tsconfig.json">

{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "esnext",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  }
}

</code-example>

Конфигурация по умолчанию создает две сборки с включенной дифференциальной загрузкой.

<div class="alert is-important">

   Чтобы узнать, какие браузеры поддерживаются с конфигурацией по умолчанию, и определить, какие параметры соответствуют требованиям поддержки вашего браузера, см. [Страница совместимости списка браузеров](https://browserl.ist/?q=%3E+0.5%25%2C+last+2+versions%2C+Firefox+ESR%2C+not+dead%2C+not+IE+9-11).

</div>

 `browserslist` Конфигурация списка позволяет игнорировать браузеры без поддержки ES2015. В этом случае создается единственная сборка.

Если ваш  `browserslist`  Конфигурация включает поддержку любых устаревших браузеров, цель сборки в конфигурации TypeScript определяет, будет ли сборка поддерживать дифференциальную загрузку.

{@a configuration-table }

| список браузеров | ES цель | Результат сборки |
| -------- | -------- | -------- |
| Поддержка ES5 отключена | es2015 | Одиночная сборка, ES5 не требуется |
| Поддержка ES5 включена | es5 | Одиночная сборка с условными полифилами только для ES5 |
| Поддержка ES5 включена | es2015 | Дифференциальная нагрузка (две сборки с условными полифиллами) |


{@a opting-out-of-differential-loading}
### Отказ от дифференциальной нагрузки

Дифференциальная загрузка может быть явно отключена, если она вызывает непредвиденные проблемы, или если вам нужно ориентироваться на ES5 специально для поддержки устаревших браузеров.

Чтобы явно отключить дифференциальную нагрузку и создать сборку ES5:

- Включить  `dead`  или  `IE`  браузеры в  `browserslist`  Файл конфигурации, удалив  `not`  ключевое слово перед ними.
- Чтобы создать одну сборку ES5, установите цель в  `compilerOptions`  для  `es5`.

{@a test-and-serve}

{@a local-development-in-older-browsers}
## Локальное развитие в старых браузерах

В Angular CLI версии 8 и выше дифференциальная загрузка по умолчанию включена для `ng build` Команда.
 `ng serve `, ` ng test`, и `ng e2e` команды генерируют одну сборку ES2015, которая не может работать в старых браузерах, не поддерживающих модули, таких как IE 1 1.

Если вы хотите запускать код ES5 во время разработки, вы можете полностью отключить дифференциальную загрузку.
Однако, чтобы сохранить преимущества дифференциальной нагрузки, лучше выбрать несколько конфигураций для `ng serve `, ` ng e2e`, и `ng test`.

{@a differential-serve}

{@a configuring-serve-for-es5}
### Настройка подачи на ES5

Чтобы сделать это для `ng serve`, создайте новый файл,  `tsconfig-es5.app.json`  рядом с  `tsconfig.app.json`  со следующим содержанием.

<code-example language="json">

{
 "extends": "./tsconfig.app.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

В  `angular.json`  добавить два новых раздела конфигурации под  `build`  и  `serve`  цели, чтобы указать на новую конфигурацию TypeScript.

<code-example language="json">

"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
      ...
  },
  "configurations": {
    "production": {
        ...
    },
    "es5": {
      "tsConfig": "./tsconfig-es5.app.json"
    }
  }
},
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
      ...
  },
  "configurations": {
    "production": {
     ...
    },
    "es5": {
      "browserTarget": "&lt;app-name&gt;:build:es5"
    }
  }
},

</code-example>

Затем вы можете запустить `ng serve` Команда с этой конфигурацией. Не забудьте заменить  `<app-name>`  (в  `"<app-name>:build:es5"`) с фактическим названием приложения, как оно отображается в  `projects`  в  `angular.json`  . Например, если имя вашего приложения  `myAngularApp`  станет `"browserTarget": "myAngularApp:build:es5"`.

<code-example language="none" class="code-shell">

ng serve --configuration es5

</code-example>

{@a differential-test}

{@a configuring-the-test-command}
### Настройка тестовой команды

Создать новый файл,  `tsconfig-es5.spec.json`  рядом с  `tsconfig.spec.json`  со следующим содержанием.

<code-example language="json">

{
 "extends": "./tsconfig.spec.json",
 "compilerOptions": {
     "target": "es5"
  }
}

</code-example>

<code-example language="json">

"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
      ...
  },
  "configurations": {
    "es5": {
      "tsConfig": "./tsconfig-es5.spec.json"
    }
  }
},

</code-example>

Затем вы можете запустить тесты с этой конфигурацией

<code-example language="none" class="code-shell">

ng test --configuration es5

</code-example>

{@a configuring-the-e2e-command}
### Настройка команды e2e

Создайте [конфигурация подачи ES5](guide/deployment#configuring-serve-for-es5)как объяснено выше, и настройте конфигурацию ES5 для цели E2E.

<code-example language="json">

"e2e": {
  "builder": "@angular-devkit/build-angular:protractor",
  "options": {
      ...
  },
  "configurations": {
	  "production": {
		  ...
	  },
    "es5": {
      "devServerTarget": "&lt;app-name&gt;:serve:es5"
    }
  }
},

</code-example>

Затем вы можете запустить `ng e2e` с этой конфигурацией. Не забудьте заменить  `<app-name>`  (в  `"<app-name>:serve:es5"`) с фактическим названием приложения, которое отображается под  `projects`  в  `angular.json`  . Например, если имя вашего приложения  `myAngularApp`  станет `"devServerTarget": "myAngularApp:serve:es5"`.

<code-example language="none" class="code-shell">

ng e2e --configuration es5

</code-example>
