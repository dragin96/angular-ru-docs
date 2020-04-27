{@a workspace-npm-dependencies}
# Зависимости рабочей области от npm

Angular Framework, Angular CLI и компоненты, используемые приложениями Angular, упаковываются как [пакеты npm](https://docs.npmjs.com/getting-started/what-is-npm "What is npm?") и распространяются через [реестр npm](https://docs.npmjs.com/).

Вы можете загрузить и установить эти пакеты npm с помощью [CLI-клиент npm](https://docs.npmjs.com/cli/install), который устанавливается и запускается как [Node.js®](https://nodejs.org "Nodejs.org") приложение. По умолчанию Angular CLI использует клиент npm.

Кроме того, вы можете использовать [клиент пряжи](https://yarnpkg.com/)для загрузки и установки пакетов npm.


<div class="alert is-helpful">

См. [Настройка локальной среды](guide/setup-local "Setting up for Local Development") для получения информации о необходимых версиях и установке  `Node.js`  и  `npm`.

Если на вашем компьютере уже запущены проекты, использующие другие версии Node.js и npm, рассмотрите возможность использования [nvm](https://github.com/creationix/nvm)для управления несколькими версиями Node.js и npm.

</div>


{@a package.json}
##  `package.json` 

И то и другое  `npm`  и  `yarn`  устанавливает пакеты, указанные в [  `package.json`  ](https://docs.npmjs.com/files/package.json)файле.

Команда CLI `ng new ` создает ` package.json` файл при создании нового рабочего пространства.
Эта  `package.json`  используется всеми проектами в рабочей области, включая начальный проект приложения, который создается CLI при создании рабочей области.

Изначально это  `package.json`  входит _a начальный набор пакетов_, некоторые из которых требуются Angular, а другие поддерживают общие сценарии приложений.
Вы добавляете пакеты в  `package.json`  мере развития вашего приложения.
Вы можете даже удалить некоторые.

 `package.json` организованы в две группы пакетов:

* [Зависимости](guide/npm-packages#dependencies)необходимы для*запуска * приложений.
* [DevDependencies](guide/npm-packages#dev-dependencies)необходимы только для*разработки * приложений.

<div class="alert is-helpful">

**Разработчики библиотеки:** по умолчанию команда CLI [ `ng generate library ` ](cli/generate)создает ` package.json` для новой библиотеки. Это  `package.json`  используется при публикации библиотеки в npm.
Для получения дополнительной информации см. Вики-страницу CLI [Поддержка библиотек](https://github.com/angular/angular-cli/wiki/stories-create-library).
</div>


{@a dependencies}
{@a dependencies}
## Зависимости

Пакеты, перечисленные в  `dependencies`  раздел  `package.json` необходимы для *запуска* приложений.

 `dependencies` раздел  `package.json` содержит:

* [** Angular пакеты**](#angular-packages): Angular сердечник и дополнительные модули; имена их пакетов начинаются  `@angular/`.

* [** Пакеты поддержки**](#support-packages): сторонние библиотеки, которые должны присутствовать для запуска приложений Angular.

* [** Пакеты Polyfill**](#polyfills): Polyfill закрывает пробелы в реализации JavaScript в браузере.

Чтобы добавить новую зависимость, используйте команду [ `ng add` ](cli/add).

{@a angular-packages}
{@a angular-packages}
### Angular пакеты

Следующие Angular пакеты включены в качестве зависимостей по умолчанию  `package.json`  файл для новой рабочей области Angular.
Полный список пакетов Angular см. В разделе [ссылка на API](http://angular.io/api?type=package).

Название пакета | Описание
----------------------------------------   | --------------------------------------------------
[** @ Angular / анимации**](api/animations)| Библиотека анимаций Angular позволяет легко определять и применять эффекты анимации, такие как переходы страниц и списков. Для получения дополнительной информации см. [Руководство по анимации](guide/animations).
[** @ Angular / общий**](api/common)| Обычно необходимые услуги, каналы и директивы, предоставляемые командой Angular. [  `HttpClientModule`  ](api/common/http/HttpClientModule)также здесь, в [ ` @ угловом / общие / http` ](api/common/http)вложенной. Для получения дополнительной информации см. [Руководство HttpClient](guide/http).
**@ Angular / компилятор** | Шаблонный компилятор Angular. Он понимает шаблоны и может преобразовать их в код, который заставляет приложение работать и отображать. Обычно вы не взаимодействуете с компилятором напрямую; скорее, вы используете это косвенно через  `platform-browser-dynamic`  когда JIT компилируется в браузере. Для получения дополнительной информации см. предварительной [Руководство по компиляции](guide/aot-compiler).
[** @ Angular / основной**](api/core)| Критические части среды выполнения, которые необходимы каждому приложению. Включает все декораторы метаданных,  `Component`, `Directive`, внедрение зависимостей и хуки жизненного цикла компонента.
[** @ Angular / формы**](api/forms)| Поддержка как [шаблонов](guide/forms)и [реактивных форм](guide/reactive-forms). Для получения информации о выборе наилучшего подхода к формам для вашего приложения см. [Введение в формы](guide/forms-overview).
[** @ Angular / платформа-браузер**](api/platform-browser)| Все, что связано с DOM и браузером, особенно части, которые помогают визуализировать в DOM. Этот пакет также включает в себя  `bootstrapModuleFactory()`  Метод для начальной загрузки приложений для производственных сборок, которые предварительно компилируются с [AOT](guide/aot-compiler).
[** @ Angular / платформа-браузер-динамическая**](api/platform-browser-dynamic)| Включает [провайдеры](api/core/Provider)и методы для компиляции и запуска приложения на клиенте с использованием [JIT-компилятор](guide/aot-compiler).
[** @ Angular / маршрутизатор**](api/router)| Модуль маршрутизатора перемещается между страницами вашего приложения при изменении URL браузера. Для получения дополнительной информации см. [Маршрутизация и навигация](guide/router).


{@a support-packages}
{@a support-packages}
### Пакеты поддержки

Следующие пакеты поддержки включены в качестве зависимостей по умолчанию  `package.json`  файл для новой рабочей области Angular.


Название пакета | Описание
----------------------------------------   | --------------------------------------------------
[** rxjs**](https://github.com/ReactiveX/rxjs)| Многие Angular API возвращают [_observables_](guide/glossary#observable). RxJS - это реализация предлагаемой [спецификации Observables](https://github.com/tc39/proposal-observable)настоящее время находится на [рассмотрении TC39](https://www.ecma-international.org/memento/tc39.htm)комитета, который определяет стандарты для языка JavaScript.
[** zone.js**](https://github.com/angular/zone.js)| Angular использует zone.js для запуска процессов обнаружения изменений Angular, когда собственные операции JavaScript вызывают события. Zone.js является реализацией [спецификации](https://gist.github.com/mhevery/63fdcdf7c65886051d55)настоящее время находится на [рассмотрении TC39](https://www.ecma-international.org/memento/tc39.htm)комитета который определяет стандарты для языка JavaScript.


{@a polyfills}
{@a polyfill-packages}
### Пакеты Polyfill

Многие браузеры не имеют встроенной поддержки некоторых функций в последних стандартах HTML
особенности, которые требует Angular.
[_Polyfills_](https://en.wikipedia.org/wiki/Polyfill_(programming)) может эмулировать отсутствующие функции.
[Browser Support](guide/browser-support)руководство объясняет, какие браузеры нуждаются в заполнении и
как вы можете добавить их.

 `package.json` для нового Angular рабочего пространства устанавливает [ядро-JS](https://github.com/zloirock/core-js)пакет,
какие полифилы отсутствуют у нескольких популярных браузеров.


{@a dev-dependencies}

{@a devdependencies}
## DevDependencies

Пакеты, перечисленные в  `devDependencies`  раздел  `package.json` поможет вам разработать приложение на вашей локальной машине. Вы не развертываете их с производственным приложением.

Добавить новый  `devDependency`, либо использовать одну из следующих команд:

<code-example language="sh" class="code-shell">
  npm install --save-dev &lt;package-name&gt;
</code-example>

<code-example language="sh" class="code-shell">
  yarn add --dev &lt;package-name&gt;
</code-example>

Последующий  `devDependencies`  предоставляются по умолчанию  `package.json`  файл для новой рабочей области Angular.


Название пакета | Описание
----------------------------------------   | -----------------------------------
[** @ angular-devkit / build-angular**](https://github.com/angular/angular-cli/)| Angular инструменты для сборки.
[** @ angular / cli**](https://github.com/angular/angular-cli/)| Angular инструменты CLI.
**@ angular / <br />compiler & #8209; cli** | Angular компилятор, который вызывается Angular CLI `ng build ` и ` ng serve` команды.
**@ angular / <br />language & #8209; обслуживание** | [Служба Angular языка](guide/language-service)анализирует шаблоны компонентов и предоставляет информацию о типе и ошибок, машинопись-зависимых редактора могут использовать для улучшения опыта разработчика. Например, см. [Расширение службы Angular языка для кода VS](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
**@types / ...** | Файлы определения TypeScript для сторонних библиотек, таких как Jasmine и Node.js.
[** коделизатор**](https://www.npmjs.com/package/codelyzer)| Линтер для приложений Angular, правила которого соответствуют Angular [руководство по стилю](guide/styleguide).
**жасмин / ...** | Пакеты для поддержки [Jasmine](https://jasmine.github.io/)библиотеки тестов.
**карма / ...** | Пакеты для поддержки [карма](https://www.npmjs.com/package/karma)бегуна.
[** транспортир**](https://www.npmjs.com/package/protractor)| Сквозная (e2e) платформа для приложений Angular. Построен поверх [WebDriverJS](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs).
[** ц-узел**](https://www.npmjs.com/package/ts-node)| Среда выполнения TypeScript и REPL для Node.js.
[** цлинт**](https://www.npmjs.com/package/tslint)| Инструмент статического анализа, который проверяет код TypeScript на наличие ошибок читаемости, ремонтопригодности и функциональности.
[** машинопись**](https://www.npmjs.com/package/typescript)| Языковой сервер TypeScript, включая*tsc * компилятор TypeScript.


{@a related-information}
## Связанная информация

Для получения информации о том, как Angular консоли ручки пакетов см в следующих руководствах:

 * [Сборка и обслуживание](guide/build)описывает, как пакеты собираются вместе для создания сборки разработки.
 * [Развертывание](guide/deployment)описывает, как пакеты собираются вместе для создания производственной сборки.
