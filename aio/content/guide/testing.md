{@a top}
{@a testing}
# Тестирование

Это руководство предлагает советы и методы для модульного и интеграционного тестирования Angular приложений.

В руководстве представлены тесты примера приложения, созданного с помощью [Angular CLI](cli). Этот пример приложения очень похож на тот, что был создан в [_Tour of Heroes_ учебник](tutorial).
Пример приложения и все тесты в данном руководстве доступны для осмотра и экспериментов:

- <live-example embedded-style noDownload>Пример приложения </live-example>
- <live-example stackblitz="specs" noDownload>Тесты </live-example>

<hr>

{@a setup}
## Настройка

Angular CLI загружает и устанавливает все необходимое для тестирования приложения Angular с помощью [среда тестирования Jasmine](https://jasmine.github.io/).

Проект, который вы создаете с помощью CLI, сразу готов к тестированию.
Просто запустите [ `нг test` ](cli/test)команду CLI:

<code-example language="sh" class="code-shell">
  ng test
</code-example>

 `ng test` Команда создает приложение в режиме _watch
и запускает [бегун испытания кармы](https://karma-runner.github.io).

Выход консоли выглядит как это:

<code-example language="sh" class="code-shell">
10% building modules 1/1 modules 0 active
...INFO [karma]: Karma v1.7.1 server started at http://0.0.0.0:9876/
...INFO [launcher]: Launching browser Chrome ...
...INFO [launcher]: Starting browser Chrome
...INFO [Chrome ...]: Connected on socket ...
Chrome ...: Executed 3 of 3 SUCCESS (0.135 secs / 0.205 secs)
</code-example>

Последняя строка журнала является наиболее важной.
Это показывает, что Карма прошла три испытания, которые все прошли.

Браузер Chrome также открывается и отображает результаты теста в «Jasmine HTML Reporter», как это.

<div class="lightbox">
  <img src='generated/images/guide/testing/initial-jasmine-html-reporter.png' alt="Jasmine HTML Reporter in the browser">
</div>

Большинству людей этот вывод браузера легче читать, чем журнал консоли.
Вы можете щелкнуть строку теста, чтобы повторно запустить только этот тест, или щелкнуть описание, чтобы повторно запустить тесты в выбранной группе тестов («набор тестов»).

Между тем, `ng test` Команда следит за изменениями.

Чтобы увидеть это в действии, внесите небольшое изменение в `app.component.ts` и сохраните.
Тесты запускаются снова, браузер обновляется, и появляются новые результаты теста.

{@a configuration}
#### Конфигурация

CLI позаботится о конфигурации Жасмин и Карма.

Вы можете настроить многие параметры, отредактировав `karma.conf.js` и др
 `test.ts` файлы в `src/` папка.

 `karma.conf.js` Файл является частичным файлом конфигурации Karma.
CLI создает полную конфигурацию времени выполнения в памяти на основе структуры приложения, указанной в `angular.json` файл, дополненный `karma.conf.js`.

Поиск в Интернете для получения более подробной информации о конфигурации Жасмин и Карма.

{@a other-test-frameworks}
#### Другие тестовые рамки

Вы также можете выполнить модульное тестирование приложения Angular с другими библиотеками тестирования и участниками тестирования.
Каждая библиотека и исполнитель имеют свои собственные особые процедуры установки, настройки и синтаксиса.

Поиск в Интернете, чтобы узнать больше.

{@a test-file-name-and-location}
#### Проверьте имя файла и местоположение

Заглянуть внутрь `src/app` папка.

CLI сгенерировал тестовый файл для `AppComponent` назван `app.component.spec.ts`.

<div class="alert is-important">

Расширение тестового файла **должно быть `.spec.ts`** чтобы инструментарий мог идентифицировать его как файл с тестами (AKA, файл _spec_).

</div>

 `app.component.ts ` и ` app.component.spec.ts` Файлы находятся в одной папке.
Имена корневых файлов (`app.component`) одинаковы для обоих файлов.

Примите эти два соглашения в ваших собственных проектах для _every вида_ тестового файла.

{@a ci}

{@a set-up-continuous-integration}
## Настройте непрерывную интеграцию

Один из лучших способов сохранить ваш проект без ошибок - через набор тестов, но легко забыть запускать тесты постоянно.
Серверы непрерывной интеграции (CI) позволяют вам настроить репозиторий проекта так, чтобы ваши тесты выполнялись при каждом запросе на фиксацию и извлечение.

Существуют платные услуги CI, такие как Circle CI и Travis CI, и вы также можете бесплатно разместить свои собственные, используя Jenkins и другие.
Хотя Circle CI и Travis CI являются платными услугами, они предоставляются бесплатно для проектов с открытым исходным кодом.
Вы можете создать публичный проект на GitHub и добавить эти услуги без оплаты.
Взносы в репозиторий Angular автоматически проходят через весь набор тестов Circle CI.

В этой статье объясняется, как настроить проект для запуска Circle CI и Travis CI, а также обновить тестовую конфигурацию, чтобы иметь возможность запускать тесты в браузере Chrome в любой среде.


{@a configure-project-for-circle-ci}
### Настройте проект для круга CI

Шаг 1. Создайте папку с именем `.circleci` в корне проекта.

Шаг 2: В новой папке создайте файл с именем `config.yml` со следующим содержанием:

```
version: 2
jobs:
  build:
    working_directory: ~/my-project
    docker:
      - image: circleci/node:10-browsers
    steps:
      - checkout
      - restore_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run: npm install
      - save_cache:
          key: my-project-{{ .Branch }}-{{ checksum "package-lock.json" }}
          paths:
            - "node_modules"
      - run: npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
      - run: npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

Эта конфигурация кеширует `node_modules/` и использует [ `npm run` ](https://docs.npmjs.com/cli/run-script)для запуска команд CLI, потому что `@angular/cli` не устанавливается глобально.
Двойная черта (`--`) необходимо передать аргументы в `npm` скрипт.

Шаг 3: Зафиксируйте свои изменения и отправьте их в свой репозиторий.

Шаг 4: [Зарегистрируйтесь в Circle CI](https://circleci.com/docs/2.0/first-steps/)и [добавьте свой проект](https://circleci.com/add-projects).
Ваш проект должен начать строить.

* Узнайте больше о Circle CI [документация Circle CI](https://circleci.com/docs/2.0/).

{@a configure-project-for-travis-ci}
### Настроить проект для Travis CI

Шаг 1: Создайте файл с именем `.travis.yml` в корне проекта, со следующим содержанием:

```
dist: trusty
sudo: false

language: node_js
node_js:
  - "10"

addons:
  apt:
    sources:
      - google-chrome
    packages:
      - google-chrome-stable

cache:
  directories:
     - ./node_modules

install:
  - npm install

script:
  - npm run test -- --no-watch --no-progress --browsers=ChromeHeadlessCI
  - npm run e2e -- --protractor-config=e2e/protractor-ci.conf.js
```

Это делает то же самое, что и конфигурация Circle CI, за исключением того, что Travis не поставляется с Chrome, поэтому мы используем Chromium.

Шаг 2: зафиксируйте ваши изменения и отправьте их в хранилище.

Шаг 3: [Зарегистрируйтесь в Travis CI](https://travis-ci.org/auth)и [добавьте свой проект](https://travis-ci.org/profile).
Вам нужно будет нажать новый коммит, чтобы запустить сборку.

* Подробнее о тестировании Travis CI от [Travis CI документации](https://docs.travis-ci.com/).

{@a configure-cli-for-ci-testing-in-chrome}
### Настройте CLI для тестирования CI в Chrome

Когда команды CLI `ng test ` и ` ng e2e` как правило, запускают тесты CI в вашей среде, вам все равно может потребоваться изменить конфигурацию для запуска тестов браузера Chrome.

Для обоих есть конфигурационные файлы [Karma JavaScript runner](https://karma-runner.github.io/latest/config/configuration-file.html)
и [транспортир](https://www.protractortest.org/#/api-overview)конца до конца инструмент тестирования,
который вы должны настроить, чтобы запустить Chrome без песочницы.

Мы будем использовать [Headless Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome#cli)в этих примерах.

* В конфигурационном файле Karma `karma.conf.js`, добавить пользовательский гранатомет под названием ChromeHeadlessCI ниже браузеров:
```
browsers: ['Chrome'],
customLaunchers: {
  ChromeHeadlessCI: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
```

* В корневой папке вашего проекта тестов e2e создайте новый файл с именем `protractor-ci.conf.js` . Этот новый файл расширяет оригинал `protractor.conf.js`.
```
const config = require('./protractor.conf').config;

config.capabilities = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--headless', '--no-sandbox']
  }
};

exports.config = config;
```

Теперь вы можете запустить следующие команды, чтобы использовать `--no-sandbox` флаг:

<code-example language="sh" class="code-shell">
  ng test --no-watch --no-progress --browsers=ChromeHeadlessCI
  ng e2e --protractor-config=e2e/protractor-ci.conf.js
</code-example>

<div class="alert is-helpful">

   **Примечание.** Прямо сейчас вы также захотите включить `--disable-gpu` флаг, если вы работаете в Windows. Смотрите [crbug.com/737678](https://crbug.com/737678).

</div>

{@a code-coverage}

{@a enable-code-coverage-reports}
## Включить отчеты о покрытии кода

CLI может запускать модульные тесты и создавать отчеты о покрытии кода.
Отчеты о покрытии кода показывают вам какие-либо части нашей кодовой базы, которые не могут быть должным образом проверены вашими юнит-тестами.

Чтобы создать отчет о покрытии, выполните следующую команду в корневом каталоге вашего проекта.

<code-example language="sh" class="code-shell">
  ng test --no-watch --code-coverage
</code-example>

Когда тесты завершены, команда создает новый `/coverage` папка в проекте. Открой `index.html` Файл для просмотра отчета с исходным кодом и значениями покрытия кода.

Если вы хотите создавать отчеты о покрытии кода при каждом тестировании, вы можете установить следующую опцию в файле конфигурации CLI: `angular.json` :

```
  "test": {
    "options": {
      "codeCoverage": true
    }
  }
```

{@a code-coverage-enforcement}
### Кодовое обеспечение исполнения

Процент покрытия кода позволяет оценить, сколько кода протестировано.
Если ваша команда выбирает минимальное количество для тестирования, вы можете применить этот минимум с помощью Angular CLI.

Например, предположим, что вы хотите, чтобы база кода имела минимальное покрытие кода 80%.
Чтобы включить это, откройте [Karma](https://karma-runner.github.io)файл конфигурации тестовой платформы, `karma.conf.js` и добавьте следующее в `coverageIstanbulReporter:` ключ.

```
coverageIstanbulReporter: {
  reports: [ 'html', 'lcovonly' ],
  fixWebpackSourcePaths: true,
  thresholds: {
    statements: 80,
    lines: 80,
    branches: 80,
    functions: 80
  }
}
```

 `thresholds` Свойство заставляет инструмент обеспечивать минимальное покрытие кода в 80% при выполнении модульных тестов в проекте.

{@a service-tests}
## Сервисные тесты

Сервисы часто являются простейшими файлами для модульного тестирования.
Вот некоторые синхронные и асинхронные модульные тесты `ValueService` 
написано без помощи утилиты тестирования Angular.

<code-example path="testing/src/app/demo/demo.spec.ts" region="ValueService" header="app/demo/demo.spec.ts"></code-example>

{@a services-with-dependencies}

{@a services-with-dependencies}
#### Сервисы с зависимостями

Сервисы часто зависят от других сервисов, которые Angular внедряет в конструктор.
Во многих случаях легко создавать и вводить эти зависимости вручную
вызов конструктора сервиса.

 `MasterService` простой пример:

<code-example path="testing/src/app/demo/demo.ts" region="MasterService" header="app/demo/demo.ts"></code-example>

 `MasterService` делегирует свой единственный метод, `getValue`, чтобы вводить `ValueService`.

Вот несколько способов проверить это.

<code-example path="testing/src/app/demo/demo.spec.ts" region="MasterService" header="app/demo/demo.spec.ts"></code-example>

Первый тест создает `ValueService` с `new` и передает его `MasterService` конструктор.

Однако внедрение реального сервиса редко работает хорошо, так как большинство зависимых сервисов сложно создавать и контролировать.

Вместо этого вы можете смоделировать зависимость, использовать фиктивное значение или создать
[Шпион](https://jasmine.github.io/2.0/introduction.html#section-Spies)
на соответствующий метод обслуживания.

<div class="alert is-helpful">

Предпочитаю шпионов, поскольку они обычно являются самым простым способом издеваться над сервисами.

</div>

Эти стандартные методы тестирования отлично подходят для сервисов модульного тестирования.

Однако вы почти всегда внедряете сервисы в классы приложений, используя Angular
внедрение зависимости, и у вас должны быть тесты, отражающие эту модель использования.
Утилиты Angular тестирования позволяют легко исследовать поведение внедренных сервисов.

{@a testing-services-with-the-testbed}
#### Тестирование сервисов с помощью _TestBed_

Ваше приложение использует Angular [внедрение зависимостей (DI)](guide/dependency-injection)
создавать сервисы.
Когда у службы есть зависимая служба, DI находит или создает эту зависимую службу.
И если этот зависимый сервис имеет свои собственные зависимости, DI также находит или создает их.

Как сервис _consumer_, вы не беспокоитесь об этом.
Вы не беспокоитесь о порядке аргументов конструктора или о том, как они создаются.

Как сервис _tester_, вы должны по крайней мере думать о первом уровне сервисных зависимостей
но вы _можете_ позволить Angular DI создать сервис и разобраться с порядком аргументов конструктора
когда вы используете `TestBed` утилита для предоставления и создания сервисов.

{@a testbed}

{@a angular-testbed}
#### Angular _TestBed_

 `TestBed` - самая важная из утилит для тестирования Angular.
 `TestBed` создает динамически создаваемый модуль Angular _test_, который эмулирует
Angular [@NgModule](guide/ngmodules).

 `TestBed.configureTestingModule()` принимает объект метаданных, который может иметь большинство свойств [@NgModule](guide/ngmodules).

Чтобы проверить сервис, вы устанавливаете `providers` свойство метаданных с
массив сервисов, которые вы будете тестировать или издеваться.

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-before-each"
  header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach)">
</code-example>

Затем введите его в тест, вызвав `TestBed.inject()` с классом службы в качестве аргумента.

<div class="alert is-helpful">

**Примечание:** раньше мы имели `TestBed.get()` вместо `TestBed.inject()`.
 `get` Метод не был безопасным типом, он всегда возвращался `any`, и это подвержено ошибкам.
Мы решили перейти на новую функцию вместо обновления существующей
широкомасштабное использование, которое имело бы огромное количество критических изменений.

</div>

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-it">
</code-example>

Или внутри `beforeEach()` если вы предпочитаете внедрять службу как часть вашей настройки.

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="value-service-inject-before-each">
</code-example>

При тестировании сервиса с зависимостью укажите макет в `providers` массив.

В следующем примере макет является шпионским объектом.

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-before-each"></code-example>

Тест использует этого шпиона так же, как и раньше.

<code-example
  path="testing/src/app/demo/demo.testbed.spec.ts"
  region="master-service-it">
</code-example>

{@a no-before-each}
{@a testing-without-beforeeach}
#### Тестирование без _beforeEach () _

Большинство тестовых наборов в этом руководстве называют `beforeEach()` чтобы установить предварительные условия для каждого `it()` тест
и полагаться на `TestBed` для создания классов и внедрения сервисов.

Есть еще одна школа тестирования, которая никогда не звонит `beforeEach()` и предпочитает создавать классы явно, а не использовать `TestBed`.

Вот как вы можете переписать один из `MasterService` тестирует в этом стиле.

Начните с помещения повторно используемого подготовительного кода в функцию _setup_ вместо `beforeEach()`.

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup"
  header="app/demo/demo.spec.ts (setup)"></code-example>

 `setup()` Функция возвращает литерал объекта
с переменными, такими как `masterService`, на который может ссылаться тест.
Вы не определяете _semi-global_ переменные (например, `let masterService: MasterService`)
в теле `describe()`.

Затем каждый тест вызывает `setup()` в первой строке, прежде чем продолжить
с шагами, которые манипулируют испытуемым и утверждают ожидания.

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-test"></code-example>

Обратите внимание, как используется тест
[_деструктурирующее назначение_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
извлечь переменные установки, которые ему нужны.

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="no-before-each-setup-call">
</code-example>

Многие разработчики считают этот подход более понятным и понятным, чем
традиционный `beforeEach()`.

Хотя это руководство по тестированию следует традиционному стилю
по умолчанию [схема CLI](https://github.com/angular/angular-cli)
генерировать тестовые файлы с `beforeEach()` и `TestBed`,
не стесняйтесь применять этот альтернативный подход в ваших собственных проектах.

{@a testing-http-services}
#### Тестирование HTTP-сервисов

Службы данных, которые выполняют HTTP-вызовы удаленным серверам, обычно внедряют и делегируют
в Angular [ `HttpClient` XHR](guide/http)службу для вызовов.

Вы можете проверить сервис данных с введенным `HttpClient` шпион, как вы бы
протестировать любой сервис с зависимостью.
<code-example
  path="testing/src/app/model/hero.service.spec.ts"
  region="test-with-spies"
  header="app/model/hero.service.spec.ts (tests with spies)">
</code-example>

<div class="alert is-important">

 `HeroService` Методы возвращаются `Observables` . Вы должны
_subscribe_ для наблюдаемого, чтобы (a) заставить его выполнить и (b)
утверждают, что метод успешен или неуспешен.

 `subscribe()` Метод имеет успех (`next`) и провал (`error`) обратный вызов.
Убедитесь, что вы предоставляете _both_ обратные вызовы, так что вы фиксируете ошибки.
Пренебрежение к этому приводит к асинхронной необучаемой наблюдаемой ошибке
Бегущий по тесту, скорее всего, приписывает совершенно другой тест.

</div>

{@a httpclienttestingmodule}
#### _HttpClientTestingModule_

Расширенные взаимодействия между службой данных и `HttpClient` может быть сложным
и трудно шутить с шпионами.

 `HttpClientTestingModule` может сделать эти сценарии тестирования более управляемыми.

В то время как _code sample_, сопровождающий это руководство, демонстрирует `HttpClientTestingModule`,
эта страница будет сдвинута на [Http гид](guide/http#testing-http-requests),
который охватывает тестирование с `HttpClientTestingModule` подробно.


{@a component-test-basics}
## Основы тестирования компонентов

Компонент, в отличие от всех других частей приложения Angular
объединяет шаблон HTML и класс TypeScript.
Компонент действительно является шаблоном и классом, работающим вместе. Чтобы адекватно протестировать компонент, вы должны проверить, что они работают вместе
как предполагалось.

Такие тесты требуют создания хост-элемента компонента в DOM браузера
как это делает Angular, и исследует взаимодействие класса компонента с
DOM, как описано в его шаблоне.

Angular `TestBed` облегчает этот вид тестирования, как вы увидите в следующих разделах.
Но во многих случаях - тестирование класса компонента в одиночку, без участия DOM
может проверить большую часть поведения компонента более простым и очевидным способом.

{@a component-class-testing}
### Тестирование класса компонентов

Протестируйте класс компонента самостоятельно, как если бы вы тестировали класс обслуживания.

Учти это `LightswitchComponent` который включает и выключает свет
(представлен сообщением на экране), когда пользователь нажимает кнопку.

<code-example
  path="testing/src/app/demo/demo.ts"
  region="LightswitchComp"
  header="app/demo/demo.ts (LightswitchComp)"></code-example>

Вы можете решить только проверить, что `clicked()` Метод
переключает состояние _on / off_ источника света и устанавливает сообщение соответствующим образом.

Этот класс компонентов не имеет зависимостей.
Чтобы протестировать сервис без каких-либо зависимостей, вы создаете его с помощью `new`, тыкать в его API,
и отстаивать ожидания от своего публичного состояния.
Сделайте то же самое с классом компонента.

<code-example
  path="testing/src/app/demo/demo.spec.ts"
  region="Lightswitch"
  header="app/demo/demo.spec.ts (Lightswitch tests)"></code-example>

Здесь `DashboardHeroComponent` из учебника _Tour of Heroes_.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="class"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

Он появляется в шаблоне родительского компонента
который связывает _hero_ с `@Input` и
прослушивает событие, поднятое через _selected_ `@Output` свойство.

Вы можете проверить, что код класса работает без создания `DashboardHeroComponent` 
или его родительский компонент.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="class-only"
  header="app/dashboard/dashboard-hero.component.spec.ts (class tests)"></code-example>

Если у компонента есть зависимости, вы можете использовать `TestBed` для обоих
создать компонент и его зависимости.

Последующий `WelcomeComponent` зависит от `UserService` чтобы узнать имя пользователя, чтобы приветствовать.

<code-example
  path="testing/src/app/welcome/welcome.component.ts"
  region="class"
  header="app/welcome/welcome.component.ts"></code-example>

Вы можете начать с создания макета `UserService` который отвечает минимальным потребностям этого компонента.

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="mock-user-service"
  header="app/welcome/welcome.component.spec.ts (MockUserService)"></code-example>

Затем предоставьте и внедрите как и сервис **компонент, так** в `TestBed` Конфигурация.

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-before-each"
  header="app/welcome/welcome.component.spec.ts (class-only setup)"></code-example>

Затем используйте класс компонента, не забывая вызывать [методы ловушки жизненного цикла](guide/lifecycle-hooks)как это делает Angular при запуске приложения.

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="class-only-tests"
  header="app/welcome/welcome.component.spec.ts (class-only tests)"></code-example>

{@a component-dom-testing}
### Тестирование компонентов DOM

Тестирование компонента _class_ так же просто, как тестирование сервиса.

Но компонент - это больше, чем просто его класс.
Компонент взаимодействует с DOM и другими компонентами.
_Class-only_ тесты могут рассказать вам о поведении класса.
Они не могут сказать вам, будет ли компонент правильно отображаться
реагировать на пользовательский ввод и жесты или интегрироваться с его родительскими и дочерними компонентами.

Ни один из тестов _class-only_ выше не может ответить на ключевые вопросы о том, как
компоненты фактически ведут себя на экране.

- Является `Lightswitch.clicked()` связан с чем-либо таким, что пользователь может вызвать его?
- Это `Lightswitch.message` отображается?
- Может ли пользователь фактически выбрать героя, отображаемого `DashboardHeroComponent` ?
- Имя героя отображается так, как ожидается (например, заглавными буквами)?
- Отображается ли приветственное сообщение по шаблону `WelcomeComponent` ?

Возможно, это не волнующие вопросы для простых компонентов, показанных выше.
Но многие компоненты имеют сложные взаимодействия с элементами DOM
описано в их шаблонах, заставляя HTML появляться и исчезать как
состояние компонента изменяется.

Чтобы ответить на такие вопросы, вы должны создать связанные элементы DOM
с компонентами вы должны проверить DOM, чтобы подтвердить это состояние компонента
правильно отображается в соответствующее время, и вы должны имитировать взаимодействие с пользователем
с экраном, чтобы определить, вызывают ли эти взаимодействия компонент
вести себя как положено.

Чтобы написать этот вид теста, вы будете использовать дополнительные функции `TestBed` 
а также другие помощники тестирования.

{@a cli-generated-tests}
#### CLI-генерируемые тесты

CLI создает начальный тестовый файл для вас по умолчанию, когда вы об этом просите
создать новый компонент.

Например, следующая команда CLI создает `BannerComponent` в `app/banner` папка (с шаблоном инлайн и стилями):

<code-example language="sh" class="code-shell">
ng generate component banner --inline-template --inline-style --module app
</code-example>

Он также генерирует исходный тестовый файл для компонента, `banner-external.component.spec.ts`, который выглядит следующим образом :

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v1"
  header="app/banner/banner-external.component.spec.ts (initial)"></code-example>

<div class="alert is-helpful">

Потому что `compileComponents` является асинхронным, он использует
[ `async` ](api/core/testing/async)утилита
функция импортирована из `@angular/core/testing`.

Пожалуйста, обратитесь к [асинхронному](#async)разделу для более подробной информации.

</div>

{@a reduce-the-setup}
#### Уменьшите настройку

Только последние три строки этого файла фактически проверяют компонент
и все, что они делают, это утверждают, что Angular может создать компонент.

Остальная часть файла представляет собой стандартный код установки, предваряющий более сложные тесты, которые, возможно, будут необходимы, если компонент превратится в нечто существенное.

Вы узнаете об этих дополнительных функциях тестирования ниже.
На данный момент, вы можете радикально уменьшить этот тестовый файл на более управляемый размер:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v2"
  header="app/banner/banner-initial.component.spec.ts (minimal)"></code-example>

В этом примере объект метаданных, переданный в `TestBed.configureTestingModule` 
просто заявляет `BannerComponent`, компонент для тестирования.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="configureTestingModule">
</code-example>

<div class="alert is-helpful">

Там нет необходимости декларировать или импортировать что-либо еще.
Тестовый модуль по умолчанию предварительно настроен на
что-то вроде `BrowserModule` from `@angular/platform-browser`.

Позже позвоню `TestBed.configureTestingModule()` с
импорт, поставщики и другие объявления для удовлетворения ваших потребностей тестирования.
Необязательный `override` Методы могут дополнительно отрегулировать аспекты конфигурации.

</div>

{@a create-component}

{@a createcomponent}
#### _createComponent() _

После настройки `TestBed`, вы называете его `createComponent()`.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="createComponent">
</code-example>

 `TestBed.createComponent()` создает экземпляр `BannerComponent`,
добавляет соответствующий элемент в тест-бегун DOM,
и возвращает [ `ComponentFixture` ](#component-fixture).

<div class="alert is-important">

Не перенастраивать `TestBed` после вызова `createComponent`.

 `createComponent` Метод замораживает текущий `TestBed` Определение
закрывая его для дальнейшей конфигурации.

Вы не можете больше звонить `TestBed` конфигурации, а не `configureTestingModule()`,
ни `get()`, ни один из `override...` методы.
Если вы пытаетесь, `TestBed` выдает ошибку.

</div>

{@a component-fixture}

{@a componentfixture}
#### _ComponentFixture_

[ComponentFixture](api/core/testing/ComponentFixture)тест Жгут для взаимодействия с созданным компонентом и его соответствующим элементом.

Доступ к экземпляру компонента через приспособление и подтвердить она существует с ожиданием Жасмин:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="componentInstance">
</code-example>

{@a beforeeach}
#### _beforeEach () _

По мере развития этого компонента вы будете добавлять больше тестов.
Вместо того, чтобы дублировать `TestBed` Конфигурация для каждого теста
вы рефакторинг, чтобы вытащить установку в жасмин `beforeEach()` и некоторые вспомогательные переменные:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v3"
 ></code-example>

Теперь добавьте тест, который получает элемент компонента из `fixture.nativeElement` и
ищет ожидаемый текст.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-2">
</code-example>

{@a native-element}

{@a nativeelement}
#### _nativeElement_

Значение `ComponentFixture.nativeElement` имеет `any` тип.
Позже вы столкнетесь с `DebugElement.nativeElement` и он тоже имеет `any` тип.

Angular не может знать во время компиляции, какой элемент HTML `nativeElement` - это или
если это даже элемент HTML.
Приложение может работать на платформе _non-browser_, такой как сервер или
[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API),
где элемент может иметь уменьшенный API или не существовать вообще.

Тесты в этом руководстве предназначены для запуска в браузере, поэтому a
 `nativeElement` Значение всегда будет `HTMLElement` или
один из его производных классов.

Зная, что это `HTMLElement` какой-то, вы можете использовать
стандартный HTML `querySelector` чтобы погрузиться глубже в дерево элементов.

Вот еще один тест, который вызывает `HTMLElement.querySelector` получить элемент абзаца и внешний вид для текста баннера:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-3">
</code-example>

{@a debug-element}

{@a debugelement}
#### _DebugElement_

Angular _fixture_ предоставляет элемент компонента непосредственно через `fixture.nativeElement`.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="nativeElement">
</code-example>

На самом деле это удобный метод, реализованный как `fixture.debugElement.nativeElement`.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="debugElement-nativeElement">
</code-example>

Есть веская причина для этого обходного пути к элементу.

Свойства `nativeElement` зависит от среды выполнения.
Вы можете запускать эти тесты на платформе _non-browser_, которая не имеет DOM или
чья DOM-эмуляция не поддерживает полную `HTMLElement` API.

Angular опирается на `DebugElement` для безопасной работы на всех поддерживаемых платформах.
Вместо создания дерева элементов HTML, Angular создает `DebugElement` Дерево которое оборачивает _native elements_ для платформы времени выполнения.
 `nativeElement` свойство разворачивает `DebugElement` и возвращает специфичный для платформы объектный элемент.

Поскольку примеры тестов для этого руководства предназначены для запуска только в браузере
 `nativeElement` в этих тестах всегда `HTMLElement` 
чьи знакомые методы и свойства вы можете изучить в тесте.

Вот предыдущий тест, заново реализованный с `fixture.debugElement.nativeElement` :

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-4">
</code-example>

 `DebugElement` есть и другие методы и свойства
полезны в тестах, как вы увидите в других частях этого руководства.

Вы импортируете `DebugElement` Символ из базовой библиотеки Angular.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-debug-element">
</code-example>

{@a by-css}
{@a by.css}
#### _By.css () _

Хотя все тесты, описанные в этом руководстве, выполняются в браузере
некоторые приложения могут работать на другой платформе, по крайней мере, время от времени.

Например, компонент может сначала отображаться на сервере как часть стратегии, позволяющей ускорить запуск приложения на плохо подключенных устройствах. Рендерер на стороне сервера может не поддерживать полный API-интерфейс элемента HTML.
Если это не поддерживает `querySelector`, предыдущий тест может не пройти.

 `DebugElement` предлагает методы запросов, которые работают для всех поддерживаемых платформ.
Эти методы запроса принимают функцию _predicate_, которая возвращает `true` когда узел в `DebugElement` Дерево соответствует критериям выбора.

Вы создаете _предикат_ с помощью `By` классу импортируется из
библиотека для платформы времени выполнения. Вот `By` импорту для платформы браузера:

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="import-by">
</code-example>

В следующем примере повторно реализуется предыдущий тест с
 `DebugElement.query()` и браузер `By.css` метод.

<code-example
  path="testing/src/app/banner/banner-initial.component.spec.ts"
  region="v4-test-5">
</code-example>

Некоторые примечательные наблюдения:

- `By.css()` выбирает статический метод `DebugElement` Узлы
  с [стандартный селектор CSS](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Getting_started/Selectors 'CSS selectors').
- Запрос возвращает `DebugElement` для абзаца.
- Вы должны развернуть этот результат, чтобы получить элемент абзаца.

Когда вы фильтруете с помощью селектора CSS и тестируете только свойства _native element_ браузера, `By.css` может быть излишним.

Часто проще и понятнее фильтровать стандартными `HTMLElement` Метод
Такие как `querySelector()` или `querySelectorAll()`,
как вы увидите в следующем наборе тестов.

<hr>

{@a component-test-scenarios}
## Сценарии тестирования компонентов

В следующих разделах, составляющих большую часть этого руководства, рассматриваются общие вопросы
сценарии тестирования компонентов

{@a component-binding}
### Связывание компонентов

Электрический ток `BannerComponent` представляет статический текст заголовка в шаблоне HTML.

После нескольких изменений `BannerComponent` представляет динамический заголовок путем привязки к
компоненты `title` свойство вроде этого

<code-example
  path="testing/src/app/banner/banner.component.ts"
  region="component"
  header="app/banner/banner.component.ts"></code-example>

Как просто, вы решили добавить тест для подтверждения этого компонента
на самом деле отображает правильный контент, где вы думаете, что это должно.

{@a query-for-the-&lth1&gt}
#### Запрос для _&lt;h1&gt;_

Вы напишете последовательность тестов, которые проверяют значение `<h1>` элемент
это оборачивает привязку интерполяции свойства _title_.

Вы обновляете `beforeEach` найти этот элемент со стандартным HTML `querySelector` 
и назначить его `h1` переменная.

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="setup"
  header="app/banner/banner.component.spec.ts (setup)"></code-example>

{@a detect-changes}

{@a createcomponent-does-not-bind-data}
#### _createComponent () _ не привязывает данные

Для вашего первого теста вы хотели бы видеть, что на экране отображаются значения по умолчанию `title`.
Ваш инстинкт должен написать тест, который немедленно осматривает `<h1>` как это:

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default-v1">
</code-example>

_That тест fails_ с сообщением:

```javascript
expected '' to contain 'Test Tour of Heroes'.
```

Связывание происходит, когда Angular выполняет **обнаружение изменений**.

В процессе производства обнаружение изменений запускается автоматически
когда Angular создает компонент или пользователь нажимает клавишу или
асинхронная активность (например, AJAX) завершается.

 `TestBed.createComponent` инициирует обнаружение изменений; что подтверждается в пересмотренном тесте:

<code-example
  path="testing/src/app/banner/banner.component.spec.ts" region="test-w-o-detect-changes"></code-example>

{@a detectchanges}
#### _detectChanges () _

Вы должны сказать `TestBed` для выполнения привязки данных путем вызова `fixture.detectChanges()`.
Только тогда `<h1>` имеет ожидаемый заголовок.

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="expect-h1-default">
</code-example>

Обнаружение отложенных изменений является намеренным и полезным.
Это дает тестеру возможность проверить и изменить состояние
компонент _before Angular инициирует привязку данных и вызовы ловушки [жизненного цикла](guide/lifecycle-hooks)_.

Вот еще один тест, который изменяет компонент `title` собственности _перед_ призвание `fixture.detectChanges()`.

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="after-change">
</code-example>

{@a auto-detect-changes}

{@a automatic-change-detection}
#### Автоматическое обнаружение изменений

 `BannerComponent` Тесты часто вызывают `detectChanges`.
Некоторые тестировщики предпочитают, чтобы среда тестирования Angular запускала обнаружение изменений автоматически.

Это возможно, настроив `TestBed` с `ComponentFixtureAutoDetect` Поставщик.
Во- первых импортировать его из тестирования утилиты библиотеки:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="import-ComponentFixtureAutoDetect" header="app/banner/banner.component.detect-changes.spec.ts (import)"></code-example>

Затем добавьте его в `providers` массив конфигурации модуля тестирования:

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)"></code-example>

Вот три теста, которые иллюстрируют, как работает автоматическое обнаружение изменений.

<code-example path="testing/src/app/banner/banner.component.detect-changes.spec.ts" region="auto-detect-tests" header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)"></code-example>

Первый тест показывает преимущество автоматического обнаружения изменений.

Второй и третий тест выявляют важное ограничение.
Среда тестирования Angular _не_ знает, что тест изменил компонент `title`.
 `ComponentFixtureAutoDetect` Служба реагирует на _асинхронные действия_, такие как разрешение обещаний, таймеры и события DOM.
Но прямое синхронное обновление свойства компонента невидимо.
Тест должен позвонить `fixture.detectChanges()` вручную, чтобы запустить другой цикл обнаружения изменений.

<div class="alert is-helpful">

Вместо того, чтобы удивляться, когда тестовое устройство будет или не будет выполнять обнаружение изменений
образцы в этом руководстве всегда вызывать `detectChanges()` _explicitly_.
Звонить не вредно `detectChanges()` чаще, чем это строго необходимо.

</div>

<hr>

{@a dispatch-event}

{@a change-an-input-value-with-dispatchevent}
#### Измените входное значение с помощью _dispatchEvent () _

Чтобы симулировать пользовательский ввод, вы можете найти элемент ввода и установить его `value` имущества.

Ты позвонишь `fixture.detectChanges()` для запуска обнаружения изменений Angular.
Но есть существенный, промежуточный шаг.

Angular не знает, что вы установили входной элемент `value` имущества.
Это свойство не будет прочитано, пока вы не поднимете элемент `input` событие, позвонив `dispatchEvent()`.
_Then_ вы звоните `detectChanges()`.

Следующий пример демонстрирует правильную последовательность.

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

{@a component-with-external-files}
### Компонент с внешними файлами

 `BannerComponent` выше определяется с помощью _inline template_ и _inline css_, указанных в `@Component.template` и `@Component.styles` Свойства соответственно.

Многие компоненты указывают _external templates_ и _external css_ с помощью
 `@Component.templateUrl ` и ` @Component.styleUrls` Свойства соответственно
как следующий вариант `BannerComponent` делает.

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  region="metadata"
  header="app/banner/banner-external.component.ts (metadata)"></code-example>

Этот синтаксис указывает Angular-компилятору читать внешние файлы во время компиляции компонента.

Это не проблема, когда вы запускаете CLI `ng test` команда, потому что это
_компилирует приложение перед запуском tests_.

Тем не менее, если вы запустите тесты в **среде без CLI**,
Тесты этого компонента могут не пройти.
Например, если вы запустите `BannerComponent` тесты в веб - кодирования окружающей среды, такие как [plunker](https://plnkr.co/), вы увидите сообщение вроде этого:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

Вы получаете это тестовое сообщение об ошибке, когда среда выполнения
компилирует исходный код во время самих тестов.

Чтобы исправить проблему, позвоните `compileComponents()` как объяснено [ниже](#compile-components).

{@a component-with-dependency}

{@a component-with-a-dependency}
### Компонент с зависимостью

Компоненты часто имеют служебные зависимости.

 `WelcomeComponent` отображает приветственное сообщение для вошедшего в систему пользователя.
Он знает, кто является пользователем на основе свойства введенного `UserService` :

<code-example path="testing/src/app/welcome/welcome.component.ts" header="app/welcome/welcome.component.ts"></code-example>

 `WelcomeComponent` имеет логику принятия решений, которая взаимодействует со службой, логику, которая делает этот компонент достойным тестирования.
Вот конфигурация модуля тестирования для файла спецификации, `app/welcome/welcome.component.spec.ts` :

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="config-test-module" header="app/welcome/welcome.component.spec.ts"></code-example>

На этот раз, в дополнение к объявив _component-под-test_,
конфигурация добавляет `UserService` провайдер `providers` список.
Но не настоящий `UserService`.

{@a service-test-doubles}

{@a provide-service-test-doubles}
#### Обеспечить сервис двойных испытаний

_Component-под-test_ не должен быть введен с реальными услугами.
На самом деле, обычно лучше, если они тестовые двойники (заглушки, подделки, шпионы или издевательства).
Цель спецификации - протестировать компонент, а не сервис
и реальные услуги могут быть проблемой.

Впрыскивать реальное `UserService` может быть кошмаром.
Реальный сервис может попросить пользователя ввести учетные данные и
попытаться связаться с сервером аутентификации.
Такое поведение может быть трудно перехватить.
Намного проще и безопаснее создать и зарегистрировать тестовый дубль вместо реального `UserService`.

Этот конкретный набор тестов обеспечивает минимальный макет `UserService` который удовлетворяет потребности `WelcomeComponent` и его испытания:

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="user-service-stub"
  header="app/welcome/welcome.component.spec.ts"></code-example>

{@a get-injected-service}

{@a get-injected-services}
#### Получите инъекционные услуги

Тесты должны иметь доступ к (заглушка) `UserService` вводится в `WelcomeComponent`.

Angular имеет иерархическую систему впрыска.
Там могут быть инжекторы на нескольких уровнях, от корневого инжектора, созданного `TestBed` 
вниз через дерево компонентов.

Самый безопасный способ получить впрыскивается сервис, так что **_всегда works_**,
это **получить его от инжектора тестируемого_компонента**.
Компонент инжектор является свойством прибора `DebugElement`.

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="injected-service"
  header="WelcomeComponent's injector">
</code-example>

{@a testbed-inject}

{@a testbed.inject}
#### _TestBed.inject () _

Вы также можете получить услугу от корневого инжектора через `TestBed.inject()`.
Это легче запомнить и менее многословно.
Но это работает только тогда, когда Angular внедряет компонент с экземпляром службы в корневой инжектор теста.

В этом тестовом наборе _only_ поставщик `UserService` - это модуль корневого тестирования
так что безопасно звонить `TestBed.inject()` следующим образом :

<code-example
  path="testing/src/app/welcome/welcome.component.spec.ts"
  region="inject-from-testbed"
  header="TestBed injector">
</code-example>

<div class="alert is-helpful">

Для случая использования, в котором `TestBed.inject()` не работает
см. [раздел _Override component provider_](#component-override)который
объясняет, когда и почему вы должны получить сервис от инжектора компонента.

</div>

{@a service-from-injector}

{@a always-get-the-service-from-an-injector}
#### Всегда получайте сервис от инжектора

_Не_ ссылаться на `userServiceStub` объект
это предоставляется модулю тестирования в теле вашего теста.
**Это не работает!**
 `userService` в компонент, является полностью _different_ объектом
клон предоставленного `userServiceStub`.

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="stub-not-injected" header="app/welcome/welcome.component.spec.ts"></code-example>

{@a welcome-spec-setup}

{@a final-setup-and-tests}
#### Окончательная настройка и тесты

Вот полный `beforeEach()`, используя `TestBed.inject()` :

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="setup" header="app/welcome/welcome.component.spec.ts"></code-example>

А вот некоторые тесты:

<code-example path="testing/src/app/welcome/welcome.component.spec.ts" region="tests" header="app/welcome/welcome.component.spec.ts"></code-example>

Первый - это тест на разумность; это подтверждает, что заглушка `UserService` называется и работает.

<div class="alert is-helpful">

Второй параметр для соответствия Жасмин (например, `'expected name'`) - необязательный ярлык ошибки.
Если ожидание не выполняется, Жасмин добавляет эту метку к сообщению об ошибке ожидания.
В спецификации с множественными ожиданиями это может помочь прояснить, что пошло не так, а какое ожидание не удалось.

</div>

Остальные тесты подтверждают логику компонента, когда сервис возвращает разные значения.
Второй тест проверяет эффект изменения имени пользователя.
Третий тест проверяет, что компонент отображает правильное сообщение, когда нет вошедшего в систему пользователя.

<hr>

{@a component-with-async-service}

{@a component-with-async-service}
### Компонент с асинхронным сервисом

В этом примере `AboutComponent` шаблон хостов `TwainComponent`.
 `TwainComponent` отображает цитаты Марка Твена.

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="template"
  header="app/twain/twain.component.ts (template)"></code-example>

Обратите внимание, что значение компонента `quote` собственности проходит через `AsyncPipe`.
Это означает, что свойство возвращает либо `Promise` или `Observable`.

В этом примере `TwainComponent.getQuote()` говорит вам об этом
 `quote` свойство возвращает `Observable`.

<code-example
  path="testing/src/app/twain/twain.component.ts"
  region="get-quote"
  header="app/twain/twain.component.ts (getQuote)"></code-example>

 `TwainComponent` получает цитаты из введенного `TwainService`.
Компонент запускает возвращенный `Observable` со значением заполнителя (`'...'`)
прежде чем сервис сможет вернуть свою первую цитату.

 `catchError` перехватывает сервисные ошибки, готовит сообщение об ошибке
и возвращает значение заполнителя в канале успеха.
Нужно подождать галочку, чтобы установить `errorMessage` 
чтобы избежать обновления этого сообщения дважды в одном и том же цикле обнаружения изменений.

Это все функции, которые вы хотите проверить.

{@a testing-with-a-spy}
#### Тестирование со шпионом

При тестировании компонента должен иметь значение только публичный API сервиса.
Как правило, сами тесты не должны совершать звонки на удаленные серверы.
Они должны подражать таким звонкам. Настройка в этом `app/twain/twain.component.spec.ts` показывает один из способов сделать это:

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="setup"
  header="app/twain/twain.component.spec.ts (setup)"></code-example>

{@a service-spy}

Сосредоточьтесь на шпионе.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy">
</code-example>

Шпион устроен так, что любой вызов `getQuote` получает наблюдаемое с тестовой цитатой.
В отличие от реального `getQuote()`, этот шпион обходит сервер
и возвращает синхронную наблюдаемую, значение которой доступно немедленно.

Вы можете написать много полезных тестов с этим шпионом, хотя его `Observable` является синхронным.

{@a sync-tests}

{@a synchronous-tests}
#### Синхронные тесты

Ключевое преимущество синхронного `Observable` что
Вы часто можете превратить асинхронные процессы в синхронные тесты.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="sync-test">
</code-example>

Поскольку результат шпиона возвращается синхронно, `getQuote()` метода
сообщение на экране немедленно _after_
первый цикл обнаружения изменений, во время которого Angular вызовы `ngOnInit`.

Вам не так повезло при тестировании пути ошибки.
Хотя шпион службы вернет ошибку синхронно
вызовы метода компонента `setTimeout()`.
Тест должен подождать хотя бы один полный оборот движка JavaScript перед
значение становится доступным. Тест должен стать _asynchronous_.

{@a fake-async}

{@a async-test-with-fakeasync}
#### Асинхронный тест с _fakeAsync () _

Использовать `fakeAsync()` необходимо импортировать `zone.js/dist/zone-testing` в вашем установочном файле теста.
Если вы создали свой проект с Angular CLI, `zone-testing` уже импортировано в `src/test.ts`.

Следующий тест подтверждает ожидаемое поведение, когда служба возвращает `ErrorObservable`.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="error-test">
</code-example>

Обратите внимание, что `it()` Функция получает аргумент в следующей форме.

```javascript
fakeAsync(() => { /* test body*/ })
```

 `fakeAsync()` включает линейный стиль кодирования, выполняя тело теста в специальном `fakeAsync test zone`.
Тело теста кажется синхронным.
Нет вложенного синтаксиса (например, `Promise.then()` ), чтобы нарушить поток управления.

<div class="alert is-helpful">

Ограничение: `fakeAsync()` не будет работать, если тело теста `XMLHttpRequest` Вызов (XHR).
Вызовы XHR в тесте редки, но если вам нужно вызвать XHR, см. [ `Async ()` ](#async)ниже.

</div>

{@a tick}

{@a the-tick-function}
#### Функция _tick () _

Вы должны вызвать [tick ()](api/core/testing/tick)чтобы продвинуть (виртуальные) часы.

Вызов [tick ()](api/core/testing/tick)имитирует течение времени до завершения всех ожидающих асинхронных действий.
В этом случае он ждет обработчика ошибок `setTimeout()`.

Функция [tick ()](api/core/testing/tick)принимает в качестве параметров миллисекунды и tickOptions, а параметр миллисекунды (по умолчанию 0, если не предоставлен) показывает, насколько увеличиваются виртуальные часы. Например, если у вас есть `setTimeout(fn, 100) ` в ` fakeAsync()` проверки вам необходимо использовать tick (100) для запуска обратного вызова fn. TickOptions - это необязательный параметр, свойство которого называется `processNewMacroTasksSynchronously` (по умолчанию true) следует ли вызывать новые сгенерированные макрокоманды при отметке.

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick">
</code-example>

Функция [tick ()](api/core/testing/tick)- это одна из утилит для тестирования Angular, которую вы импортируете с помощью `TestBed`.
Это компаньон для `fakeAsync()` и вы можете вызвать его только в `fakeAsync()`.

{@a tickoptions}
#### отметьте галочкой

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick-new-macro-task-sync">
</code-example>

В этом примере у нас есть новая задача макроса (вложенная setTimeout), по умолчанию, когда мы `tick`, setTimeout `outside` и `nested` будут оба сработали.

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-tick-new-macro-task-async">
</code-example>

И в некоторых случаях, мы не хотим запускать новую макро-задачу при отметке, мы можем использовать `tick(milliseconds, {processNewMacroTasksSynchronously: false})` чтобы не вызывать новую задачу maco.

{@a comparing-dates-inside-fakeasync}
#### Сравнение дат внутри fakeAsync ()

 `fakeAsync()` имитирует течение времени, что позволяет рассчитать разницу между датами внутри `fakeAsync()`.

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-date">
</code-example>

{@a jasmine.clock-with-fakeasync}
#### jasmine.clock с fakeAsync ()

Жасмин также обеспечивает `clock` особенность чтобы издеваться над датами. Angular автоматически запускает тесты, которые запускаются после
 `jasmine.clock().install()` вызывается внутри `fakeAsync()` до `jasmine.clock().uninstall()` вызывается. `fakeAsync()` не требуется и выдает ошибку, если вложена.

По умолчанию эта функция отключена. Чтобы включить его, установите глобальный флаг перед импортом `zone-testing`.

Если вы используете Angular CLI, настройте этот флаг в `src/test.ts`.

```
(window as any)['__zone_symbol__fakeAsyncPatchLock'] = true;
import 'zone.js/dist/zone-testing';
```

<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-clock">
</code-example>

{@a using-the-rxjs-scheduler-inside-fakeasync}
#### Использование планировщика RxJS внутри fakeAsync ()

Вы также можете использовать планировщик RxJS в `fakeAsync()` же, как с помощью `setTimeout()` или `setInterval()`, но вам нужно импортировать `zone.js/dist/zone-patch-rxjs-fake-async` для исправления планировщика RxJS.
<code-example
  path="testing/src/app/demo/async-helper.spec.ts"
  region="fake-async-test-rxjs">
</code-example>

{@a support-more-macrotasks}
#### Поддержите больше macroTasks

По умолчанию, `fakeAsync()` поддерживает следующие макро-задачи.

- `setTimeout` 
- `setInterval` 
- `requestAnimationFrame` 
- `webkitRequestAnimationFrame` 
- `mozRequestAnimationFrame` 

Если вы запускаете другие макро-задачи, такие как `HTMLCanvasElement.toBlob()`, _«Неизвестная macroTask, запланированная в поддельном асинхронном тесте» _ будет выдана.

<code-tabs>
  <code-pane
    header="src/app/shared/canvas.component.spec.ts (failing)"
    path="testing/src/app/shared/canvas.component.spec.ts"
    region="without-toBlob-macrotask">
  </code-pane>
  <code-pane
    header="src/app/shared/canvas.component.ts"
    path="testing/src/app/shared/canvas.component.ts"
    region="main">
  </code-pane>
</code-tabs>

Если вы хотите поддержать такой случай, вам нужно определить макрос-задачу, которую вы хотите поддерживать в `beforeEach()`.
Например:

<code-example
  header="src/app/shared/canvas.component.spec.ts (excerpt)"
  path="testing/src/app/shared/canvas.component.spec.ts"
  region="enable-toBlob-macrotask">
</code-example>

Обратите внимание, что для того, чтобы сделать `<canvas>` элемент Zone.js-осведомлен в вашем приложении, вам необходимо импортировать `zone-patch-canvas` патч (либо в `polyfills.ts` или в конкретном файле, который использует `<canvas>`)

<code-example
  header="src/polyfills.ts or src/app/shared/canvas.component.ts"
  path="testing/src/app/shared/canvas.component.ts"
  region="import-canvas-patch">
</code-example>


{@a async-observables}
#### Асинхронные наблюдаемые

Вы можете быть удовлетворены тестовым покрытием этих тестов.

Тем не менее, вы можете быть обеспокоены тем фактом, что реальный сервис не совсем так себя ведет.
Реальный сервис отправляет запросы на удаленный сервер.
Для ответа сервера требуется время, и ответ, безусловно, не будет доступен немедленно
как в предыдущих двух тестах.

Ваши тесты будут более точно отражать реальный мир, если вы вернете _asynchronous_ observable
от `getQuote()` шпион, как это.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-setup">
</code-example>

{@a async-observable-helpers}
#### Асинхронные наблюдаемые помощники

Наблюдаемая асинхронность была произведена `asyncData` помощник.
 `asyncData` helper - это служебная функция, которую вам придется написать самостоятельно, или вы можете скопировать ее из примера кода.

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-data"
  header="testing/async-observable-helpers.ts">
</code-example>

Наблюдаемый этот помощник испускает `data` Значение в следующем обороте движка JavaScript.

Оператор [RxJS `defer ()` ](http://reactivex.io/documentation/operators/defer.html)возвращает наблюдаемое.
Требуется фабричная функция, которая возвращает либо обещание, либо наблюдаемое.
Когда что - то выписывает _defer_ - х наблюдаемыми
он добавляет подписчика к новой наблюдаемой, созданной на этой фабрике.

 `defer()` Оператор преобразует `Promise.resolve()` в новую наблюдаемую, что
лайк `HttpClient`, выдает один раз и завершает.
Подписчики отписываются после получения значения данных.

Есть аналогичный помощник для создания асинхронной ошибки.

<code-example
  path="testing/src/testing/async-observable-helpers.ts"
  region="async-error">
</code-example>

{@a more-async-tests}
#### Больше асинхронных тестов

Теперь, когда `getQuote()` шпион возвращается асинхронной наблюдаемыми,
большинство ваших тестов также должны быть асинхронными.

Вот `fakeAsync()` который демонстрирует поток данных
в реальном мире.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="fake-async-test">
</code-example>

Обратите внимание, что элемент quote отображает значение заполнителя (`'...'`) после `ngOnInit()`.
Первая цитата еще не пришла.

Чтобы сбросить первую цитату из наблюдаемой, вы вызываете [tick ()](api/core/testing/tick).
Тогда позвони `detectChanges()` чтобы сообщить Angular обновить экран.

Затем вы можете утверждать, что элемент кавычки отображает ожидаемый текст.

{@a async}

{@a async-test-with-async}
#### Асинхронный тест с _async () _

Использовать `async()`, вы должны импортировать `zone.js/dist/zone-testing` в вашем установочном файле теста.
Если вы создали свой проект с Angular CLI, `zone-testing` уже импортировано в `src/test.ts`.

 `fakeAsync()` служебной функции есть несколько ограничений.
В частности, это не будет работать, если тестовое тело `XMLHttpRequest` Вызов (XHR).
Вызовы XHR в тесте редки, поэтому вы можете придерживаться [ `fakeAsync ()` ](#fake-async).
Но если вам когда-либо нужно позвонить `XMLHttpRequest`, вы хотите знать о `async()`.

<div class="alert is-helpful">

 `TestBed.compileComponents()` метода (см. [Ниже](#compile-components)) `XHR` 
читать внешние шаблоны и CSS-файлы во время компиляции «точно в срок».
Написать тесты, которые называют `compileComponents()` с `async()` утилита.

</div>

Вот предыдущий `fakeAsync()`, переписанный с `async()` утилита.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="async-test">
</code-example>

 `async()` Утилита скрывает некоторые асинхронные шаблоны, организуя код тестера
запускать в специальной _async тестовой зоне_.
Вам не нужно передавать Жасмин `done()` в тест и вызов `done()` потому что это `undefined` в обещании или наблюдаемых обратных вызовах.

Но асинхронный характер теста раскрывается при вызове `fixture.whenStable()`,
который нарушает линейный поток управления.

При использовании `intervalTimer()` такой как `setInterval()` в `async()`, не забудьте отменить таймер с помощью `clearInterval()` после теста, в противном случае `async()` никогда не заканчивается.

{@a when-stable}

{@a whenstable}
#### _whenStable_

Тест должен ждать `getQuote()` наблюдается, чтобы испустить следующую цитату.
Вместо вызова [tick ()](api/core/testing/tick)он вызывает `fixture.whenStable()`.

 `fixture.whenStable()` возвращает обещание, которое разрешается, когда движок JavaScript
очередь задач становится пустой.
В этом примере очередь задач становится пустой, когда наблюдаемое испускает первую кавычку.

Тест возобновляется в рамках обещания обратного вызова, который вызывает `detectChanges()` для
обновите элемент цитаты ожидаемым текстом.

{@a jasmine-done}

{@a jasmine-done}
#### Жасмин _done () _

В то время как `async()` и `fakeAsync()` работает очень
упростить Angular асинхронное тестирование
Вы все еще можете вернуться к традиционной технике
и передать `it` функция, которая принимает
[«Готово», обратный вызов](https://jasmine.github.io/2.0/introduction.html#section-Asynchronous_Support).

Ты не можешь позвонить `done()` в `async()` или `fakeAsync()`, потому что `done parameter` 
является `undefined`.

Теперь вы несете ответственность за цепочку обещаний, обработку ошибок и вызов `done()` в соответствующие моменты.

Написание тестовых функций с `done()`, более громоздкий, чем `async()` и `fakeAsync()`, но иногда это необходимо, когда код включает `intervalTimer()` как `setInterval`.

Вот еще две версии предыдущего теста, написанные с `done()`.
Первый подписывается на `Observable` подвергается шаблону компонентами `quote` собственности.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="quote-done-test"></code-example>

RxJS `last()` Оператор выдает последнее значение наблюдаемой перед завершением, которое будет тестовой кавычкой.
 `subscribe` обратный звонок `detectChanges()` для
обновите элемент цитаты с помощью тестовой цитаты, так же, как и в предыдущих тестах.

В некоторых тестах вас больше интересует, как вызывается внедренный сервисный метод и какие значения он возвращает
чем то, что появляется на экране.

Сервисный шпион, такой как `qetQuote()` шпион подделки `TwainService`,
может дать вам эту информацию и сделать утверждения о состоянии просмотра.

<code-example
  path="testing/src/app/twain/twain.component.spec.ts"
  region="spy-done-test"></code-example>

<hr>

{@a marble-testing}
{@a component-marble-tests}
### Компонент мраморных тестов

Предыдущий `TwainComponent` Тесты моделировали асинхронный наблюдаемый отклик
от `TwainService` с `asyncData` и `asyncError` утилиты.

Это короткие, простые функции, которые вы можете написать сами.
К сожалению, они слишком просты для многих распространенных сценариев.
Наблюдаемое часто испускает несколько раз, возможно, после значительной задержки.
Компонент может координировать несколько наблюдаемых
с перекрывающимися последовательностями значений и ошибок.

**Тестирование мрамора RxJS** - отличный способ проверить наблюдаемые сценарии
и простой и сложный.
Вы, вероятно, видели [мраморные диаграммы](http://rxmarbles.com/)
это иллюстрирует, как работают наблюдаемые.
Тестирование мрамора использует аналогичный мраморный язык
укажите наблюдаемые потоки и ожидания в ваших тестах.

Следующие примеры повторяют два из `TwainComponent` тесты
с мраморным тестированием.

Начните с установки `jasmine-marbles` нпм пакет.
Затем импортируйте нужные вам символы.

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="import-marbles"
  header="app/twain/twain.component.marbles.spec.ts (import marbles)"></code-example>

Вот полный тест для получения цитаты:

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="get-quote-test"></code-example>

Обратите внимание, что тест Жасмин является синхронным. Нет никаких `fakeAsync()`.
Мраморное тестирование использует планировщик испытаний, чтобы симулировать течение времени
в синхронном тесте.

Прелесть мраморных испытаний заключается в визуальном определении наблюдаемых потоков.
Этот тест определяет [_cold_ observable](#cold-observable)который ждет
три [кадры](#marble-frame)(`---`)
выдает значение (`x`) и завершает (`|`).
Во втором аргументе вы отображаете маркер значения (`x`) до испускаемого значения (`testQuote`).

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-quote-marbles"></code-example>

Мраморная библиотека строит соответствующие наблюдаемые, которые
тестовые наборы как `getQuote` шпиона.

Когда вы будете готовы активировать мраморные наблюдаемые объекты
ты говоришь `TestScheduler` _flush_ своей очереди подготовленных задач, как это.

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="test-scheduler-flush"></code-example>

Этот шаг служит цели, аналогичной [tick ()](api/core/testing/tick)и `whenStable()` в
ранее `fakeAsync()` и `async()` Примеры.
Баланс теста такой же, как в этих примерах.

{@a marble-error-testing}
#### Тестирование мраморных ошибок

Вот тестовая версия мрамора `getQuote()` тест ошибок.

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-test"></code-example>

Это все еще асинхронный тест, вызывающий `fakeAsync()` и [tick ()](api/core/testing/tick), потому что сам компонент
звонки `setTimeout()` при обработке ошибок.

Посмотрите на мраморное наблюдаемое определение.

<code-example
  path="testing/src/app/twain/twain.component.marbles.spec.ts"
  region="error-marbles"></code-example>

Это _cold_ наблюдаемый, что ждет три кадра, а затем выдает сообщение об ошибке,
Хеш (`#`) указывает время ошибки, указанной в третьем аргументе.
Второй аргумент является нулевым, потому что наблюдаемое никогда не генерирует значение.

{@a learn-about-marble-testing}
#### Узнайте о тестировании мрамора

{@a marble-frame}
_Marble frame_ - это виртуальная единица времени тестирования.
Каждый символ (`-`, `x`, `|`, `#`) отмечает прохождение одного кадра.

{@a cold-observable}
Наблюдаемая _cold_ не производит значения, пока вы не подпишетесь на нее.
Большинство ваших наблюдаемых приложений холодные.
Все [_HttpClient_](guide/http)методы возвращают холодные наблюдаемые.

_Hot_ observable уже производит значения _before_ вы подписаны на него.
[_Router.events_](api/router/Router#events)наблюдаемый
который сообщает об активности маршрутизатора, является _hot_ наблюдаемым.

Испытания мрамора RxJS - богатая тема, выходящая за рамки данного руководства.
Узнайте об этом в Интернете, начиная с
[официальная документация](https://github.com/ReactiveX/rxjs/blob/master/doc/writing-marble-tests.md).

<hr>

{@a component-with-input-output}

{@a component-with-inputs-and-outputs}
### Компонент с входами и выходами

Компонент с входами и выходами обычно появляется внутри шаблона представления хост-компонента.
Хост использует привязку свойства для установки свойства ввода и привязку события к
прослушивать события, вызванные выходным свойством.

Цель тестирования - убедиться, что такие привязки работают так, как ожидалось.
Тесты должны устанавливать входные значения и прослушивать выходные события.

 `DashboardHeroComponent` является крошечным примером компонента в этой роли.
Отображается отдельный герой, предоставленный `DashboardComponent`.
Нажав, что герой говорит `DashboardComponent`, чтобы пользователь выбрал героя.

 `DashboardHeroComponent` встроен в `DashboardComponent` шаблон, как это:

<code-example
  path="testing/src/app/dashboard/dashboard.component.html"
  region="dashboard-hero"
  header="app/dashboard/dashboard.component.html (excerpt)"></code-example>

 `DashboardHeroComponent` появляется в `*ngFor` повторитель, который устанавливает каждый компонент `hero` входное свойство
к значению цикла и слушает для компонента `selected` событие.

Вот полное определение этого компонента:

{@a dashboard-hero-component}

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.ts"
  region="component"
  header="app/dashboard/dashboard-hero.component.ts (component)"></code-example>

В то время как тестирование этого простого компонента имеет небольшую внутреннюю ценность, стоит знать, как это сделать.
Вы можете использовать один из этих подходов:

- Проверьте это как используется `DashboardComponent`.
- Протестируйте его как самостоятельный компонент.
- Протестируйте как используется заменой `DashboardComponent`.

Беглый взгляд на `DashboardComponent` конструктор отбивает первый подход:

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

 `DashboardComponent` зависит от Angular маршрутизатора и `HeroService`.
Вам, вероятно, придется заменить их обоих на тестовые двойники, что является большой работой.
Маршрутизатор кажется особенно сложным.

<div class="alert is-helpful">

[Обсуждение ниже](#routing-component)охватывает тестирование компонентов, которые требуют маршрутизатора.

</div>

Ближайшая цель - проверить `DashboardHeroComponent`, а не `DashboardComponent`,
Итак, попробуйте второй и третий варианты.

{@a dashboard-standalone}

{@a test-dashboardherocomponent-stand-alone}
#### Протестируйте _DashboardHeroComponent_ автономно

Вот суть настройки spec-файла.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="setup"
  header="app/dashboard/dashboard-hero.component.spec.ts (setup)"></code-example>

Обратите внимание, как код установки назначает тестового героя (`expectedHero`) к компонентам `hero` собственность
подражая пути `DashboardComponent` установит его
через привязку свойства в его повторителе.

Следующий тест проверяет, что имя героя передается в шаблон через привязку.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="name-test">
</code-example>

Потому что [шаблон](#dashboard-hero-component)передает имя героя через Angular `UpperCasePipe`,
тест должен соответствовать значению элемента с именем в верхнем регистре.

<div class="alert is-helpful">

Этот небольшой тест демонстрирует, как Angular тесты могут проверить визуальную составляющую
представление - что-то не возможно с
[тесты классов компонентов](#component-class-testing)- ат
низкая стоимость и не прибегая к гораздо более медленным и сложным сквозным испытаниям.

</div>

{@a clicking}
#### Щелчок

Нажатие героя должно поднять `selected` событие
хост-компонент ( `DashboardComponent` предположительно) может услышать:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test">
</code-example>

Компоненты `selected` свойство возвращает `EventEmitter`,
который выглядит как синхронный RxJS `Observable` для потребителей.
Тест подписывается на него _explicitly_ так же, как компонент хоста _implicitly_.

Если компонент ведет себя так, как ожидалось, щелкните элемент героя
должен сказать компонент `selected` свойство для испускания `hero` объект.

Тест обнаруживает это событие по своей подписке на `selected`.

{@a trigger-event-handler}

{@a triggereventhandler}
#### _triggerEventHandler_

 `heroDe` в предыдущем тесте `DebugElement`, представляющий героя `<div>`.

Он имеет Angular свойства и методы, которые абстрагируют взаимодействие с нативным элементом.
Этот тест называет `DebugElement.triggerEventHandler` с именем события «click».
Привязка события click вызывает ответ `DashboardHeroComponent.click()`.

Angular `DebugElement.triggerEventHandler` может вызвать любое событие, связанное с данными, по своему имени события.
Второй параметр - это объект события, переданный в обработчик.

Тест вызвал событие «щелчка» с `null` объект события.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="trigger-event-handler">
</code-example>

Тест предполагает (правильно в этом случае), что время выполнения
обработчик события - компонент `click()` Метод - нет
заботиться об объекте события.

<div class="alert is-helpful">

Другие обработчики менее прощающие. Например, `RouterLink` 
Директива ожидает объект с `button` свойство
это идентифицирует, какая кнопка мыши (если есть) была нажата во время щелчка.
 `RouterLink` Директива выдает ошибку, если объект события отсутствует.

</div>

{@a click-the-element}
#### Нажмите на элемент

Следующая тестовая альтернатива вызывает собственный элемент `click()` метод
что отлично подходит для этого компонента.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-2">
</code-example>

{@a click-helper}

{@a click-helper}
#### _click () _ помощник

Нажатие кнопки, привязки или произвольного элемента HTML является обычной тестовой задачей.

Сделайте это последовательным и простым, инкапсулируя процесс _click-triggering_
в помощнике, таком как `click()` функцию ниже:

<code-example
  path="testing/src/testing/index.ts"
  region="click-event"
  header="testing/index.ts (click helper)"></code-example>

Первый параметр - это _element-to-click_. Если вы хотите, вы можете передать
Пользовательский объект события в качестве второго параметра. Значением по умолчанию является (частичное)
<a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button">объект события левой кнопки мыши </a>
принят многими обработчиками, включая `RouterLink` Директива.

<div class="alert is-important">

 `click()` Вспомогательная функция **не** является утилитой тестирования Angular.
Эта функция определена в примере кода этого руководства.
Все примеры тестов используют его.
Если вам это нравится, добавьте его в свою собственную коллекцию помощников.

</div>

Вот предыдущий тест, переписанный с помощью помощника по щелчку.

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="click-test-3"
  header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)">
</code-example>

<hr>

{@a component-inside-test-host}

{@a component-inside-a-test-host}
### Компонент внутри тестового хоста

Предыдущие тесты играли роль хозяина `DashboardComponent` сами по себе.
Но делает ли `DashboardHeroComponent` работает правильно, если правильно привязать данные к компоненту хоста?

Вы можете проверить с фактическим `DashboardComponent`.
Но для этого может потребоваться много настроек
особенно когда его шаблон имеет `*ngFor` повторителя
другие компоненты, расположение HTML, дополнительные крепления,
конструктор, который внедряет несколько сервисов
и он сразу начинает взаимодействовать с этими сервисами.

Представьте себе попытку отключить эти отвлекающие факторы, просто чтобы доказать свою точку зрения
которые могут быть выполнены удовлетворительно с _test host_ как этот:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host"
  header="app/dashboard/dashboard-hero.component.spec.ts (test host)"
 ></code-example>

Этот тестовый хост связывается с `DashboardHeroComponent` как `DashboardComponent` будет
но без шума `Router`, то `HeroService`, или `*ngFor` повторителя.

Тестовый хост устанавливает компоненты `hero` свойство input с его тестовым героем.
Это связывает компонент `selected` событие с его `onSelected` обработчик
который записывает испущенного героя в его `selectedHero` свойство.

Позже тесты смогут легко проверить `selectedHero` чтобы проверить, что
 `DashboardHeroComponent.selected` Событие выдало ожидаемого героя.

Установка для испытаний _test-host_ аналогична установке для автономных испытаний:

<code-example path="testing/src/app/dashboard/dashboard-hero.component.spec.ts" region="test-host-setup" header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)"></code-example>

Этот модуль тестирования конфигурации показывает три важных отличия:

1. Это _declares_ оба `DashboardHeroComponent` и `TestHostComponent`.
1. Это создает `TestHostComponent` вместо `DashboardHeroComponent`.
1. `TestHostComponent ` устанавливает ` DashboardHeroComponent.hero` с привязкой.

 `createComponent ` возвращает ` fixture` которое содержит экземпляр `TestHostComponent` вместо экземпляра `DashboardHeroComponent`.

Создание `TestHostComponent` имеет побочный эффект создания `DashboardHeroComponent` 
потому что последний появляется в шаблоне первого.
Запрос для элемента героя (`heroEl`) до сих пор находит его в тесте DOM
хотя на большей глубине в дереве элементов, чем раньше.

Сами тесты практически идентичны автономной версии

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="test-host-tests"
  header="app/dashboard/dashboard-hero.component.spec.ts (test-host)"></code-example>

Только выбранный тест событий отличается. Это подтверждает, что выбранный `DashboardHeroComponent` героя
действительно находит свой путь через привязку событий к компоненту хоста.

<hr>

{@a routing-component}

{@a routing-component}
### Компонент маршрутизации

_Routing component_ - это компонент, который сообщает `Router` для перехода к другому компоненту.
 `DashboardComponent` является компонентом маршрутизации, потому что пользователь может
перейти к `HeroDetailComponent`, нажав на одну из _hero кнопок_ на приборной панели.

Маршрутизация довольно сложна.
Тестирование `DashboardComponent` казался пугающим отчасти потому, что он включает в себя `Router`,
который он вводит вместе с `HeroService`.

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="ctor"
  header="app/dashboard/dashboard.component.ts (constructor)"></code-example>

Высмеивать `HeroService` со шпионом [знакомая история](#component-with-async-service).
Но `Router` имеет сложный API и связан с другими сервисами и предварительными условиями для приложений. Может ли быть трудно издеваться?

К счастью, не в этом случае, потому что `DashboardComponent` мало что делает с `Router` 

<code-example
  path="testing/src/app/dashboard/dashboard.component.ts"
  region="goto-detail"
  header="app/dashboard/dashboard.component.ts (goToDetail)">
</code-example>

Это часто имеет место с _routing components_.
Как правило, вы тестируете компонент, а не маршрутизатор
и заботиться, только если компонент перемещается с правильным адресом при данных условиях.

Предоставить шпион маршрутизатора для _this component_ test suite так же просто
как обеспечение `HeroService` шпион.

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="router-spy"
  header="app/dashboard/dashboard.component.spec.ts (spies)"></code-example>

Следующий тест нажимает на отображаемого героя и подтверждает это
 `Router.navigateByUrl` вызывается с ожидаемым URL.

<code-example
  path="testing/src/app/dashboard/dashboard.component.spec.ts"
  region="navigate-test"
  header="app/dashboard/dashboard.component.spec.ts (navigate test)"></code-example>

{@a routed-component-w-param}

{@a routed-components}
### Направленные компоненты

_Routed component_ является местом назначения `Router` навигации.
Тестирование может быть сложнее, особенно когда маршрут к компоненту _include parameters_.
 `HeroDetailComponent` - это _routed component_, который является пунктом назначения такого маршрута.

Когда пользователь нажимает на героя _Dashboard_, `DashboardComponent` сообщает `Router` 
перейти к `heroes/:id`.
 `:id` - это параметр маршрута, значением которого является `id` героя для редактирования.

 `Router` сопоставляет этот URL с маршрутом к `HeroDetailComponent`.
Это создает `ActivatedRoute` Объект с информацией о маршрутизации и
вводит его в новый экземпляр `HeroDetailComponent`.

Вот `HeroDetailComponent` конструктор:

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ctor" header="app/hero/hero-detail.component.ts (constructor)"></code-example>

 `HeroDetail` Компонент нуждается в `id` Параметр чтобы он мог получить
соответствующий герой через `HeroDetailService`.
Компонент должен получить `id` из `ActivatedRoute.paramMap` Свойство
который является `Observable`.

Это не может просто ссылаться на `id` свойство объекта `ActivatedRoute.paramMap`.
Компонент должен подписаться на `ActivatedRoute.paramMap` наблюдать и быть готовым
для `id` для изменения в течение своей жизни

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="ng-on-init" header="app/hero/hero-detail.component.ts (ngOnInit)"></code-example>

<div class="alert is-helpful">

В [Router](guide/router#route-parameters)крышки направляющих `ActivatedRoute.paramMap` более подробно.

</div>

Тесты могут изучить, как `HeroDetailComponent` реагирует на разные `id` значения параметров
манипулируя `ActivatedRoute` внедряется в конструктор компонента.

Вы знаете, как шпионить за `Router` и служба данных.

Вы будете использовать другой подход с `ActivatedRoute` потому что

- `paramMap ` возвращает ` Observable` который может испускать больше чем одно значение
  во время теста.
- Вам нужна вспомогательная функция маршрутизатора, `convertToParamMap()`, чтобы создать `ParamMap`.
- Другие тесты _routed component_ нуждаются в двойном тесте для `ActivatedRoute`.

Эти различия свидетельствуют о пригодности для повторного использования класса-заглушки.

{@a activatedroutestub}
#### _ActivationRouteStub_

Последующий `ActivatedRouteStub` Класс служит двойным тестом для `ActivatedRoute`.

<code-example
  path="testing/src/testing/activated-route-stub.ts"
  region="activated-route-stub"
  header="testing/activated-route-stub.ts (ActivatedRouteStub)"></code-example>

Рассмотрите возможность размещения таких помощников в `testing` папка брат и сестра `app` папка.
Этот образец ставит `ActivatedRouteStub` в `testing/activated-route-stub.ts`.

<div class="alert is-helpful">

Подумайте о написании более функциональной версии этого класса заглушки с
[_marble тестирование library_](#marble-testing).

</div>

{@a tests-w-test-double}

{@a testing-with-activatedroutestub}
#### Тестирование с помощью _ActivationRouteStub_

Вот тест, демонстрирующий поведение компонента, когда наблюдаемый `id` относится к существующему герою:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-good-id" header="app/hero/hero-detail.component.spec.ts (existing id)"></code-example>

<div class="alert is-helpful">

 `createComponent() ` и ` page` Объект обсуждается [ниже](#page-object).
Положитесь на свою интуицию сейчас.

</div>

Когда `id` не может быть найден, компонент должен перенаправить на `HeroListComponent`.

В настройках тестового набора был тот же шпион маршрутизатора [описанный выше](#routing-component)который шпионил за маршрутизатором без фактической навигации.

Этот тест ожидает, что компонент попытается перейти к `HeroListComponent`.

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="route-bad-id" header="app/hero/hero-detail.component.spec.ts (bad id)"></code-example>

Хотя у этого приложения нет маршрута к `HeroDetailComponent` который пропускает `id` Параметр, он может добавить такой маршрут когда-нибудь.
Компонент должен делать что-то разумное, когда нет `id`.

В этой реализации компонент должен создавать и отображать нового героя.
Новые герои `id=0` и бланк `name` . Этот тест подтверждает, что компонент ведет себя, как и ожидалось:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="route-no-id"
  header="app/hero/hero-detail.component.spec.ts (no id)"></code-example>

<hr>

{@a nested-component-tests}
### Тесты вложенных компонентов

Шаблоны компонентов часто имеют вложенные компоненты, чьи шаблоны
может содержать больше компонентов.

Дерево компонентов может быть очень глубоким и, чаще всего, вложенными компонентами
не играют никакой роли в тестировании компонента в верхней части дерева.

 `AppComponent`, например, отображает панель навигации с привязками и их `RouterLink` Директивы.

<code-example
  path="testing/src/app/app.component.html"
  header="app/app.component.html"></code-example>

В то время как `AppComponent` _class_ пуст,
Вы можете написать модульные тесты, чтобы убедиться, что ссылки подключены правильно
к `RouterLink` Директивы, возможно, по причинам [объясненным ниже](#why-stubbed-routerlink-tests).

Чтобы проверить ссылки, вам не нужно `Router` для навигации, а вы нет
нужен `<router-outlet>` для обозначения где `Router` вставляет _routed компоненты_.

 `BannerComponent` и `WelcomeComponent` 
(указано `<app-banner>` и `<app-welcome>`) также не имеют значения.

Тем не менее, любой тест, который создает `AppComponent` в DOM также будет создавать экземпляры
эти три компонента и, если вы позволите этому случиться,
вам придется настроить `TestBed` для их создания.

Если вы пренебрегаете их объявлением, компилятор Angular не распознает
 `<app-banner> `, ` <app-welcome>`, и `<router-outlet>` метки в `AppComponent` Шаблон
и выдаст ошибку.

Если вы объявляете реальные компоненты, вам также придется объявлять _their_ вложенные компоненты
и обеспечить _все_ сервисы, внедренные в _any_ компонент в дереве.

Это слишком много усилий, чтобы просто ответить на несколько простых вопросов о ссылках.

В этом разделе описываются два метода для минимизации настройки.
Используйте их, по отдельности или в комбинации, чтобы сосредоточиться на тестировании основного компонента.

{@a stub-component}

{@a stubbing-unneeded-components}
##### Заглушка ненужных компонентов

В первом методе вы создаете и объявляете версии-заглушки компонентов
и директива, которая играет небольшую или никакую роль в тестах.

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="component-stubs"
  header="app/app.component.spec.ts (stub declaration)"></code-example>

Селекторные заглушки соответствуют селекторам для соответствующих реальных компонентов.
Но их шаблоны и классы пусты.

Затем объявите их в `TestBed` Конфигурация рядом с
компоненты, директивы и трубы, которые должны быть реальными.

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="testbed-stubs"
  header="app/app.component.spec.ts (TestBed stubs)"></code-example>

 `AppComponent` является объектом тестирования, поэтому, конечно, вы объявляете реальную версию.

 `RouterLinkDirectiveStub`, [описанный позже](#routerlink), является тестовой версией
реального `RouterLink` который помогает с тестами ссылок.

Остальные окурки.

{@a no-errors-schema}

{@a noerrorsschema}
#### _NO_ERRORS_SCHEMA_

Во втором подходе добавьте `NO_ERRORS_SCHEMA` для `TestBed.schemas` Метаданные.

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="no-errors-schema"
  header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)"></code-example>

 `NO_ERRORS_SCHEMA` указывает Angular-компилятору игнорировать нераспознанные элементы и атрибуты.

Компилятор распознает `<app-root>` элемент и `routerLink` атрибут
потому что вы объявили соответствующий `AppComponent` и `RouterLinkDirectiveStub` 
в `TestBed` Конфигурация.

Но компилятор не выдаст ошибку, когда встретится `<app-banner>`, `<app-welcome>` или `<router-outlet>`.
Он просто отображает их как пустые теги, а браузер игнорирует их.

Вам больше не нужны компоненты заглушки.

{@a use-both-techniques-together}
#### Используйте обе техники вместе

Это методы для тестирования мелких компонентов
так называемый, потому что они уменьшают визуальную поверхность компонента только к этим элементам
в шаблоне компонента, который имеет значение для тестов.

 `NO_ERRORS_SCHEMA` Подход - самый простой из двух, но не злоупотребляйте им.

 `NO_ERRORS_SCHEMA` также не позволяет компилятору сообщать вам о пропавшем
компоненты и атрибуты, которые вы случайно пропустили или неправильно написали.
Вы могли бы потратить часы, преследуя фантомные ошибки, которые компилятор мог бы поймать в одно мгновение.

У подхода _stub component_ есть еще одно преимущество.
В то время как окурки в _this_ примера были пусты,
Вы могли бы дать им урезанные шаблоны и классы, если ваши тесты
нужно взаимодействовать с ними каким-то образом.

На практике вы объедините две техники в одной и той же настройке
как видно в этом примере.

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="mixed-setup"
  header="app/app.component.spec.ts (mixed setup)"></code-example>

Angular компилятор создает `BannerComponentStub` для `<app-banner>` элемент
и применяет `RouterLinkStubDirective` к с `routerLink` атрибут
но он игнорирует `<app-welcome>` и `<router-outlet>` метки.

<hr>

{@a routerlink}
{@a components-with-routerlink}
### Компоненты с _RouterLink_

Реальный `RouterLinkDirective` довольно сложен и запутан с другими компонентами
и директивы `RouterModule`.
Это требует сложной настройки, чтобы издеваться и использовать в тестах.

 `RouterLinkDirectiveStub` в этом примере кода заменяет настоящую директиву
с альтернативной версией, разработанной для проверки типа проводки якорного тега
видел в `AppComponent` Шаблон.

<code-example
  path="testing/src/testing/router-link-directive-stub.ts"
  region="router-link"
  header="testing/router-link-directive-stub.ts (RouterLinkDirectiveStub)"></code-example>

URL привязан к `[routerLink]` в директиву `linkParams` свойство.

 `HostListener` событие click элемента host
(`<a>` анкерные элементы `AppComponent`) к директиве заглушки `onClick` метод.

Нажатие на якорь должно вызвать `onClick()` метод
который устанавливает контрольную заглушку `navigatedTo` свойство.
Тесты проверяют `navigatedTo` чтобы подтвердить, что нажав на якорь
установить ожидаемое определение маршрута.

<div class="alert is-helpful">

Правильно ли настроен маршрутизатор для навигации с этим определением маршрута
вопрос для отдельного набора тестов.

</div>

{@a by-directive}
{@a inject-directive}

{@a by.directive-and-injected-directives}
#### _By.directive_ и введенные директивы

Побольше установки триггеров начальные привязки данных и получает ссылки на навигационные ссылки:

<code-example
  path="testing/src/app/app.component.spec.ts"
  region="test-setup"
  header="app/app.component.spec.ts (test setup)"></code-example>

Три точки, представляющие особый интерес:

1. Вы можете найти якорные элементы с помощью прикрепленной директивы, используя `By.directive`.

1. Запрос возвращает `DebugElement` вокруг соответствующих элементов.

1. каждый `DebugElement` предоставляет инъектор зависимостей с помощью
    конкретный экземпляр директивы, прикрепленной к этому элементу.

 `AppComponent` ссылки для проверки являются следующие:

<code-example
  path="testing/src/app/app.component.html"
  region="links"
  header="app/app.component.html (navigation links)"></code-example>

{@a app-component-tests}

Вот несколько тестов, которые подтверждают, что эти ссылки связаны с `routerLink` директивы
как и ожидалось:

<code-example path="testing/src/app/app.component.spec.ts" region="tests" header="app/app.component.spec.ts (selected tests)"></code-example>

<div class="alert is-helpful">

Тест "щелчка" в этом примере вводит в заблуждение.
Это проверяет `RouterLinkDirectiveStub` а не _component_.
Это обычная ошибка директивных заглушек.

У этого есть законная цель в этом руководстве.
Это демонстрирует, как найти `RouterLink` Элемент, щелкните его и проверьте результат
без задействования полного оборудования маршрутизатора.
Это навык, который вам может понадобиться для тестирования более сложного компонента, который изменяет отображение
пересчитывает параметры или переупорядочивает параметры навигации, когда пользователь щелкает ссылку.

</div>

{@a why-stubbed-routerlink-tests}

{@a what-good-are-these-tests}
#### Чем хороши эти тесты?

загасил `RouterLink` Тесты могут подтвердить, что компонент со ссылками и выходом настроен правильно
у компонента есть ссылки, которые он должен иметь, и что все они указывают в ожидаемом направлении.
Эти тесты не касаются того, удастся ли приложению перейти к целевому компоненту, когда пользователь щелкает ссылку.

Заглушка RouterLink и RouterOutlet - лучший вариант для таких ограниченных целей тестирования.
Полагаясь на настоящий роутер, они станут хрупкими.
Они могут потерпеть неудачу по причинам, не связанным с компонентом.
Например, навигационная защита может предотвратить доступ неавторизованного пользователя к `HeroListComponent`.
Это не вина `AppComponent` и отсутствие изменений в этом компоненте может вылечить неудачный тест.

_Different_ батарея тестов может исследовать, работает ли приложение, как ожидалось
при наличии условий, влияющих на охрану, таких как аутентификация и авторизация пользователя.

<div class="alert is-helpful">

Будущее обновление руководства объяснит, как написать такое
тесты с `RouterTestingModule`.

</div>

<hr>

{@a page-object}

{@a use-a-page-object}
### Используйте объект _page_

 `HeroDetailComponent` - это простое представление с заголовком, двумя полями героев и двумя кнопками.

<div class="lightbox">
  <img src='generated/images/guide/testing/hero-detail.component.png' alt="HeroDetailComponent in action">
</div>

Но есть много сложностей шаблонов даже в этой простой форме.

<code-example
  path="testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"></code-example>

Тесты, которые осуществляют потребность компонента ...

- ждать, пока герой не прибудет, прежде чем элементы появятся в DOM.
- ссылка на текст заголовка.
- ссылка на поле ввода имени, чтобы проверить и установить его.
- ссылки на две кнопки, чтобы они могли нажимать их.
- шпионы для некоторых компонентов и методов маршрутизатора.

Даже такая маленькая форма, как эта, может привести к путанице из-за мучительной условной установки и выбора элементов CSS.

Приручить сложность с `Page` Класс который обрабатывает доступ к свойствам компонента
и инкапсулирует логику, которая их устанавливает.

Вот такая `Page` Класс для `hero-detail.component.spec.ts` 

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="page"
  header="app/hero/hero-detail.component.spec.ts (Page)"></code-example>

Теперь важные хуки для манипулирования компонентами и их проверки аккуратно организованы и доступны из `Page`.

 `createComponent` Метод создает `page` объект и заполняет пробелы, как только `hero` прибывает.

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="create-component"
  header="app/hero/hero-detail.component.spec.ts (createComponent)"></code-example>

В [_HeroDetailComponent_ тесты](#tests-w-test-double)в предыдущем разделе показано, как `createComponent` и `page` 
держать тесты короткими и _on сообщение_.
Нет отвлекающих факторов: не нужно ждать выполнения обещаний и не искать в DOM значения элементов для сравнения.

Вот еще несколько `HeroDetailComponent` тестирует, чтобы укрепить точку.

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="selected-tests"
  header="app/hero/hero-detail.component.spec.ts (selected tests)"></code-example>

<hr>

{@a compile-components}
{@a calling-compilecomponents}
### Вызов _compileComponents () _
<div class="alert is-helpful">

Вы можете игнорировать этот раздел, если вы _только_ запускаете тесты с CLI `ng test` команда
потому что CLI компилирует приложение перед запуском тестов.

</div>

Если запустить тесты в **не-CLI среды**, тесты могут произойти сбой с сообщением вроде этого:

<code-example language="sh" class="code-shell" hideCopy>
Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.
</code-example>

Корень проблемы - по крайней мере один из компонентов, участвующих в тесте
определяет внешний шаблон или файл CSS как
следующая версия `BannerComponent` делает.

<code-example
  path="testing/src/app/banner/banner-external.component.ts"
  header="app/banner/banner-external.component.ts (external template & css)"></code-example>

Тест не пройден, когда `TestBed` пытается создать компонент.

<code-example
  path="testing/src/app/banner/banner.component.spec.ts"
  region="configure-and-create"
  header="app/banner/banner.component.spec.ts (setup that fails)"
  avoid></code-example>

Напомним, что приложение не было скомпилировано.
Поэтому, когда вы звоните `createComponent()`, `TestBed` компилируется неявно.

Это не проблема, когда исходный код находится в памяти.
Но `BannerComponent` требует внешних файлов
что компилятор должен прочитать из файловой системы
изначально асинхронная операция.

Если `TestBed` было разрешено продолжить, тесты будут работать и таинственным образом провалится
прежде чем компилятор мог закончить.

Превентивное сообщение об ошибке говорит вам явно скомпилировать `compileComponents()`.

{@a compilecomponents-is-async}
#### _compileComponents () _ является асинхронным

Вы должны позвонить `compileComponents()` внутри асинхронной тестовой функции.

<div class="alert is-critical">

Если вы пренебрегаете сделать тестовую функцию асинхронной
(например, забудьте использовать `async()` как описано ниже)
вы увидите это сообщение об ошибке

<code-example language="sh" class="code-shell" hideCopy>
Error: ViewDestroyedError: Attempt to use a destroyed view
</code-example>

</div>

Типичный подход состоит в том, чтобы разделить логику настройки на два отдельных `beforeEach()` функции:

1. Асинхронный `beforeEach()` который компилирует компоненты
1. Синхронный `beforeEach()` которая выполняет оставшуюся настройку.

Чтобы следовать этому шаблону, импортируйте `async()` Помощник с другими символами тестирования.

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="import-async">
</code-example>

{@a the-async-beforeeach}
#### Асинхронный _beforeEach_

Напишите первый асинхронный `beforeEach` как это все.

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="async-before-each"
  header="app/banner/banner-external.component.spec.ts (async beforeEach)"></code-example>

 `async()` Вспомогательная функция принимает функцию без параметров с телом установки.

 `TestBed.configureTestingModule() ` возвращает ` TestBed` Класс чтобы вы могли цепочку
звонки другим `TestBed` Статические методы такие как `compileComponents()`.

В этом примере `BannerComponent` - единственный компонент для компиляции.
Другие примеры конфигурируют модуль тестирования с несколькими компонентами
и может импортировать модули приложения, которые содержат еще больше компонентов.
Любой из них может потребовать внешних файлов.

 `TestBed.compileComponents` Метод асинхронно компилирует все компоненты, настроенные в модуле тестирования.

<div class="alert is-important">

Не переконфигурируйте `TestBed` после вызова `compileComponents()`.

</div>

призвание `compileComponents()` закрывает текущий `TestBed` для дальнейшей настройки.
Вы не можете больше звонить `TestBed` конфигурации, а не `configureTestingModule()` 
ни один из `override...` методы. `TestBed` выдает ошибку, если вы пытаетесь.

Сделать `compileComponents()` последний шаг
перед звонком `TestBed.createComponent()`.

{@a the-synchronous-beforeeach}
#### Синхронный _beforeEach_

Второй, синхронный `beforeEach()` содержит оставшиеся шаги установки,
который включает в себя создание компонента и запрос элементов для проверки.

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="sync-before-each"
  header="app/banner/banner-external.component.spec.ts (synchronous beforeEach)"></code-example>

Вы можете рассчитывать на тестового бегуна в ожидании первого асинхронного `beforeEach` чтобы закончить перед вызовом второго.

{@a consolidated-setup}
#### Консолидированная настройка

Вы можете объединить два `beforeEach()` функционирует в одном асинхронном `beforeEach()`.

 `compileComponents()` возвращает обещание, чтобы вы могли выполнить
синхронная настройка задач _after_ компиляция путем перемещения синхронного кода
в `then(...)` обратный вызов.

<code-example
  path="testing/src/app/banner/banner-external.component.spec.ts"
  region="one-before-each"
  header="app/banner/banner-external.component.spec.ts (one beforeEach)"></code-example>

{@a compilecomponents-is-harmless}
#### _compileComponents () _ безвреден

Там нет никакого вреда в вызове `compileComponents()` когда это не требуется.

Тестовый файл компонента, сгенерированный вызовами CLI `compileComponents()` 
хотя это никогда не требуется при запуске `ng test`.

Тесты в этом руководстве только вызывают `compileComponents` когда это необходимо.

<hr>

{@a import-module}

{@a setup-with-module-imports}
### Настройка с импортом модуля

Предыдущие тесты компонентов настроили модуль тестирования с несколькими `declarations` нравится это:

<code-example
  path="testing/src/app/dashboard/dashboard-hero.component.spec.ts"
  region="config-testbed"
  header="app/dashboard/dashboard-hero.component.spec.ts (configure TestBed)">
</code-example>

 `DashboardComponent` прост. Это не нуждается в помощи.
Но более сложные компоненты часто зависят от других компонентов, директив, каналов и поставщиков
и они также должны быть добавлены в модуль тестирования.

К счастью, `TestBed.configureTestingModule` Параметр параллель
метаданные, переданные в `@NgModule` decorator
это означает, что вы также можете указать `providers` и `imports`.

 `HeroDetailComponent` требует большой помощи, несмотря на его небольшой размер и простую конструкцию.
В дополнение к поддержке, которую он получает от модуля тестирования по умолчанию `CommonModule`, он должен:

- `NgModel` и друзья в `FormsModule` для включения двусторонней привязки данных.
- `TitleCasePipe ` от ` shared` папка.
- Маршрутизатор услуг (которые эти тесты заглушки).
- Сервисы доступа к данным Hero (также заглушки).

Один из подходов заключается в настройке тестирования модуля из отдельных частей, как в этом примере:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-forms-module"
  header="app/hero/hero-detail.component.spec.ts (FormsModule setup)"></code-example>

<div class="alert is-helpful">

Обратите внимание, что `beforeEach()` асинхронный и вызывает `TestBed.compileComponents` 
поскольку `HeroDetailComponent` имеет внешний шаблон и файл CSS.

Как объяснено в [_Calling compileComponents () _](#compile-components)выше,
эти тесты могут выполняться в среде без CLI
где Angular должен был бы скомпилировать их в браузере.

</div>

{@a import-a-shared-module}
#### Импортировать общий модуль

Потому что многие компоненты приложения нуждаются в `FormsModule` и `TitleCasePipe`, разработчик создал
 `SharedModule` для объединения этих и других часто запрашиваемых частей.

Тестовая конфигурация может использовать `SharedModule` тоже, как видно в этой альтернативной настройке:

<code-example
  path="testing/src/app/hero/hero-detail.component.spec.ts"
  region="setup-shared-module"
  header="app/hero/hero-detail.component.spec.ts (SharedModule setup)"></code-example>

Это немного сложнее и меньше, с меньшим количеством операторов импорта (не показано).

{@a feature-module-import}

{@a import-a-feature-module}
#### Импортировать функциональный модуль

 `HeroDetailComponent` является частью `HeroModule` [Feature Module](guide/feature-modules)который объединяет больше взаимозависимых частей
в том числе `SharedModule`.
Попробуйте тестовую конфигурацию, которая импортирует `HeroModule` как этот:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-hero-module" header="app/hero/hero-detail.component.spec.ts (HeroModule setup)"></code-example>

Это действительно круто. Только _test удваивается_ в `providers` остаются. Даже `HeroDetailComponent` Объявление исчезло.

Фактически, если вы попытаетесь объявить это, Angular выдаст ошибку, потому что
 `HeroDetailComponent` объявлен в обоих `HeroModule` и `DynamicTestModule` 
созданный `TestBed`.

<div class="alert is-helpful">

Импорт функционального модуля компонента может быть самым простым способом настройки тестов
когда в модуле много взаимозависимостей и
модуль небольшой, как это обычно бывает с функциональными модулями.

</div>

<hr>

{@a component-override}

{@a override-component-providers}
### Переопределить поставщиков компонентов

 `HeroDetailComponent` предоставляет свой собственный `HeroDetailService`.

<code-example path="testing/src/app/hero/hero-detail.component.ts" region="prototype" header="app/hero/hero-detail.component.ts (prototype)"></code-example>

Невозможно заглушить компонент `HeroDetailService` в `providers` из `TestBed.configureTestingModule`.
Это поставщики для _testing module_, а не компонент. Они готовят инжектор зависимостей на уровне _fixture_.

Angular создает компонент с его _own_ инжектором, который является _child_ инжектора прибора.
Регистрирует поставщиков компонента ( `HeroDetailService` в данном случае) с детским инжектором.

Тест не может попасть в сервисные службы детского инжектора от инжектора прибора.
И `TestBed.configureTestingModule` не может их настроить.

Angular создает новые экземпляры реального `HeroDetailService` все вместе!

<div class="alert is-helpful">

Эти тесты могут провалиться или прекратятся, если `HeroDetailService` сделал свои собственные звонки на удаленный сервер.
Возможно, нет удаленного сервера для вызова.

К счастью, `HeroDetailService` делегирует ответственность за удаленный доступ к данным для `HeroService`.

<code-example path="testing/src/app/hero/hero-detail.service.ts" region="prototype" header="app/hero/hero-detail.service.ts (prototype)"></code-example>

[Предыдущая тестовая конфигурация](#feature-module-import)заменяет реальную `HeroService` с `TestHeroService` 
который перехватывает запросы сервера и подделывает их ответы.

</div>

Что делать, если тебе не так повезло. Что если подделать `HeroService` это сложно?
Что если `HeroDetailService` делает собственные запросы к серверу?

 `TestBed.overrideComponent` Метод может заменить компонент `providers` с простыми в управлении _test doubles_
как показано в следующей вариации установки:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="setup-override" header="app/hero/hero-detail.component.spec.ts (Override setup)"></code-example>

Заметь `TestBed.configureTestingModule` больше не предоставляет (подделка) `HeroService` потому что он [не нужен](#spy-stub).

{@a override-component-method}

{@a the-overridecomponent-method}
#### Метод _overrideComponent_

Сосредоточиться на `overrideComponent` метод.

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-component-method" header="app/hero/hero-detail.component.spec.ts (overrideComponent)"></code-example>

Он принимает два аргумента: тип компонента для переопределения (`HeroDetailComponent`) и переопределить объект метаданных.
[Переопределение объект метаданных](#metadata-override-object)является общим определяется следующим образом :

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

Объект переопределения метаданных может либо добавлять и удалять элементы в свойствах метаданных, либо полностью сбрасывать эти свойства.
Этот пример сбрасывает компонент `providers` метаданные.

Параметр типа, `T`, это тип метаданных, которые вы передаете `@Component` декоратор:

<code-example language="javascript">
  selector?: string;
  template?: string;
  templateUrl?: string;
  providers?: any[];
  ...
</code-example>

{@a spy-stub}

{@a provide-a-spy-stub-herodetailservicespy}
#### Укажите _spy stub_ (_HeroDetailServiceSpy_)

Этот пример полностью заменяет компонент `providers` массив с новым массивом, содержащим `HeroDetailServiceSpy`.

 `HeroDetailServiceSpy` является версией реального `HeroDetailService` 
это подделывает все необходимые функции этого сервиса.
Ни вводит, ни делегирует на нижний уровень `HeroService` 
так что нет необходимости предоставлять тестовый дубль для этого.

Связанный `HeroDetailComponent` Тесты будут утверждать, что методы `HeroDetailService` 
были вызваны слежкой за методами обслуживания.
Соответственно, заглушка реализует свои методы, как шпионы:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="hds-spy" header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)"></code-example>

{@a override-tests}

{@a the-override-tests}
#### Тесты переопределения

Теперь тесты могут управлять героем компонента напрямую, манипулируя заглушкой шпиона. `testHero` 
и подтвердите, что были вызваны сервисные методы.

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="override-tests" header="app/hero/hero-detail.component.spec.ts (override tests)"></code-example>

{@a more-overrides}

{@a more-overrides}
#### Больше переопределений

 `TestBed.overrideComponent` Метод может вызываться несколько раз для одного и того же или разных компонентов.
 `TestBed` предлагает аналогичные `overrideDirective`, `overrideModule` и `overridePipe` методы
для копания и замены частей этих других классов.

Изучите варианты и комбинации по своему усмотрению.

<hr>

{@a attribute-directive}

{@a attribute-directive-testing}
## Директива Тестирование атрибутов

Директива _attribute_ изменяет поведение элемента, компонента или другой директивы.
Его имя отражает способ применения директивы: как атрибут на элементе хоста.

Пример приложения `HighlightDirective` устанавливает цвет фона элемента
на основе либо цвета привязки данных, либо цвета по умолчанию (светло-серый).
Он также устанавливает пользовательское свойство элемента (`customProperty`) для `true` 
ни по какой другой причине, кроме как показать, что это может.

<code-example path="testing/src/app/shared/highlight.directive.ts" header="app/shared/highlight.directive.ts"></code-example>

Он используется во всем приложении, возможно, наиболее просто в `AboutComponent` :

<code-example path="testing/src/app/about/about.component.ts" header="app/about/about.component.ts"></code-example>

Тестирование конкретного использования `HighlightDirective` пределах `AboutComponent` требует только
методы, рассмотренные выше (в частности, [«неглубокий тест»](#nested-component-tests)подход ).

<code-example path="testing/src/app/about/about.component.spec.ts" region="tests" header="app/about/about.component.spec.ts"></code-example>

Однако тестирование одного варианта использования вряд ли позволит изучить весь спектр возможностей директивы.
Поиск и тестирование всех компонентов, использующих эту директиву, утомителен, хрупок и почти так же маловероятен, чтобы обеспечить полное покрытие.

_Тесты только для класса_ могут быть полезны
но такие директивы атрибутов имеют тенденцию манипулировать DOM.
Изолированные модульные тесты не трогать DOM, и, следовательно,
не внушайте уверенности в эффективности директивы.

Лучшим решением является создание искусственного тестового компонента, который демонстрирует все способы применения директивы.

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="test-component" header="app/shared/highlight.directive.spec.ts (TestComponent)"></code-example>

<div class="lightbox">
  <img src='generated/images/guide/testing/highlight-directive-spec.png' alt="HighlightDirective spec in action">
</div>

<div class="alert is-helpful">

 `<input>` регистр связывает `HighlightDirective` для имени значения цвета в поле ввода.
Начальным значением является слово «голубой», которое должно быть цветом фона поля ввода.

</div>

Вот некоторые тесты этого компонента:

<code-example path="testing/src/app/shared/highlight.directive.spec.ts" region="selected-tests" header="app/shared/highlight.directive.spec.ts (selected tests)"></code-example>

Несколько методов заслуживают внимания:

- `By.directive` Предикат - отличный способ получить элементы, имеющие эту директиву, когда их типы элементов неизвестны.

- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:not"> `:not` псевдокласс </a>
  в `By.css('h2:not([highlight])')` помогает найти `<h2>` элементы, которые не имеют директивы.
   `By.css('*:not([highlight])')` находит элемент _any_, который не имеет директивы.

- `DebugElement.styles` предоставляет доступ к стилям элементов даже в отсутствие реального браузера благодаря `DebugElement` абстракция.
  Но не стесняйтесь использовать `nativeElement` когда это кажется проще или понятнее, чем абстракция.

- Angular добавляет директиву к инжектору элемента, к которому она применяется.
  В тесте на цвет по умолчанию используется инжектор второго `<h2>` чтобы получить его `HighlightDirective` экземпляр
  и это `defaultColor`.

- `DebugElement.properties` предоставляет доступ к искусственному пользовательскому свойству, которое установлено директивой.

<hr>

{@a pipe-testing}
## Испытание труб

Трубы легко тестируются без утилит Angular.

У класса трубы есть один метод, `transform`, которое манипулирует вводом
значение в преобразованное выходное значение.
 `transform` реализация редко взаимодействует с DOM.
Большинство труб не зависят от Angular, кроме `@Pipe` 
метаданные и интерфейс.

Рассмотрим `TitleCasePipe` который использует первую букву каждого слова.
Вот наивная реализация с регулярным выражением.

<code-example path="testing/src/app/shared/title-case.pipe.ts" header="app/shared/title-case.pipe.ts"></code-example>

Все, что использует регулярное выражение, заслуживает тщательного тестирования.
Используйте простой Жасмин, чтобы исследовать ожидаемые случаи и крайние случаи.

<code-example path="testing/src/app/shared/title-case.pipe.spec.ts" region="excerpt" header="app/shared/title-case.pipe.spec.ts"></code-example>

{@a write-tests}

{@a write-dom-tests-too}
#### Пишите DOM-тесты тоже

Это испытания трубы в изоляции.
Они не могут сказать, если `TitleCasePipe` работает правильно, как применяется в компонентах приложения.

Рассмотрите возможность добавления компонентов тестов, таких как этот:

<code-example path="testing/src/app/hero/hero-detail.component.spec.ts" region="title-case-pipe" header="app/hero/hero-detail.component.spec.ts (pipe test)"></code-example>

<hr>

{@a test-debugging}

{@a test-debugging}
## Тестовая отладка

Отладка спецификаций в браузере аналогична отладке приложения.

1. Откройте окно браузера Карма (скрытое ранее).
1. Нажмите **DEBUG** кнопку ; он открывает новую вкладку браузера и повторно запускает тесты.
1. Откройте в браузере «Инструменты разработчика» ?? ( `Ctrl-Shift-I` в Windows; `Command-Option-I` в macOS).
1. Выберите раздел «Источники».
1. Открой `1st.spec.ts` Тестовый файл (Control / Command-P, затем начните вводить имя файла).
1. Установите точку останова в тесте.
1. Обновите браузер, и он остановится на точке останова.

<div class="lightbox">
  <img src='generated/images/guide/testing/karma-1st-spec-debug.png' alt="Karma debugging">
</div>

<hr>

{@a atu-apis}

{@a testing-utility-apis}
## API-интерфейсы тестирования

В этом разделе описываются наиболее полезные функции тестирования Angular и дается краткое описание того, что они делают.

Утилиты Angular тестирования включают в себя: `TestBed`, `ComponentFixture` и несколько функций, которые контролируют среду тестирования.
[_TestBed_](#testbed-api-summary)и [_ComponentFixture_](#component-fixture-api-summary)классы покрыты отдельно.

Вот краткое изложение автономных функций, в порядке вероятной полезности:

<table>
  <tr>
    <th>
      Функция
    </th>
    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>async</code>
    </td>

    <td>

      Запускает тело теста (`it`) или настройка (`beforeEach`) функция в специальной зоне _async test_.
      Смотрите [обсуждение выше](#async).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>fakeAsync</code>
    </td>

    <td>

      Запускает тело теста (`it`) в специальной _fakeAsync тестовой зоне_, включив
      стиль кодирования потока линейного управления. Смотрите [обсуждение выше](#fake-async).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>tick</code>
    </td>

    <td>

      Имитирует течение времени и завершение ожидающих асинхронных действий
      путем сброса очередей _timer_ и _micro-task_ в тестовой зоне _fakeAsync_.

      <div class="alert is-helpful">

      Любопытному, преданному читателю может понравиться этот длинный пост в блоге
      [«_Tasks, microtasks, queues и schedule__»](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

      </div>

      Принимает необязательный аргумент, который перемещает виртуальные часы вперед
      на указанное число миллисекунд,
      очистка асинхронных действий, запланированных в этот период.
      Смотрите [обсуждение выше](#tick).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
       <code>inject</code>
    </td>

    <td>

      Внедряет одну или несколько служб из текущей `TestBed` инжектор в функцию тестирования.
      Он не может внедрить сервис, предоставляемый самим компонентом.
      Смотрите обсуждение [debugElement.injector](#get-injected-services).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>discardPeriodicTasks</code>
    </td>

    <td>

      Когда `fakeAsync()` заканчивается ожидающим событием таймера _tasks_ (в очереди `setTimeOut` и `setInterval` обратные вызовы)
      тест не проходит с четким сообщением об ошибке.

      В общем, тест должен заканчиваться без задач в очереди.
      Когда ожидающие задачи таймера ожидаются, позвоните `discardPeriodicTasks` для очистки очереди _task_
      и избежать ошибки.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>flushMicrotasks</code>
    </td>

    <td>

      Когда `fakeAsync()` заканчивается отложенными _micro-tasks_, такими как нерешенные обещания
      тест не проходит с четким сообщением об ошибке.

      В общем, тест должен ждать завершения микро-задач.
      Когда ожидают ожидающих выполнения микрозадач, звоните `flushMicrotasks` для очистки очереди _micro-task_
      и избежать ошибки.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>ComponentFixtureAutoDetect</code>
    </td>

    <td>

      Токен провайдера для службы, которая включается [автоматическое обнаружение изменений](#automatic-change-detection).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>getTestBed</code>
    </td>

    <td>

      Получает текущий экземпляр `TestBed`.
      Обычно не нужно, потому что статические методы класса `TestBed` Класс как правило, достаточно.
 `TestBed` предоставляет несколько редко используемых членов, которые недоступны как
      статические методы.

    </td>
  </tr>
</table>

<hr>

{@a testbed-class-summary}

#### _TestBed_ сводка классов

 `TestBed` Класс является одной из основных утилит для тестирования Angular.
Его API довольно большой и может быть огромным, пока вы его не изучите
немного за один раз. Сначала прочтите первую часть этого руководства
чтобы получить основы, прежде чем пытаться освоить полный API.

Определение модуля передано `configureTestingModule` 
является подмножеством `@NgModule` метаданных.

<code-example language="javascript">
  type TestModuleMetadata = {
    providers?: any[];
    declarations?: any[];
    imports?: any[];
    schemas?: Array&lt;SchemaMetadata | any[]&gt;;
  };
</code-example>

{@a metadata-override-object}

Каждый метод переопределения занимает `MetadataOverride<T>` где `T` это вид метаданных
в соответствии с методом, то есть параметром `@NgModule`,
 `@Component `, ` @Directive ` или ` @Pipe`.

<code-example language="javascript">
  type MetadataOverride&lt;T&gt; = {
    add?: Partial&lt;T&gt;;
    remove?: Partial&lt;T&gt;;
    set?: Partial&lt;T&gt;;
  };
</code-example>

{@a testbed-methods}
{@a testbed-api-summary}

 `TestBed` API состоит из статических методов класса, которые либо обновляют, либо ссылаются на экземпляр _global_ `TestBed`.

Внутренне все статические методы покрывают методы текущей среды выполнения `TestBed` экземпляра
который также возвращается `getTestBed()`.

Вызов `TestBed` Методы _within_ `beforeEach()` чтобы обеспечить новый старт перед каждым отдельным тестом.

Вот наиболее важные статические методы в порядке вероятности полезности.

<table>
  <tr>
    <th>
      Методы
    </th>
    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>configureTestingModule</code>
    </td>

    <td>

      Тестирующие прокладки (`karma-test-shim`, `browser-test-shim`)
      установить [начальную среду тестирования](guide/testing)и модуль тестирования по умолчанию.
      Модуль тестирования по умолчанию настроен с базовыми декларативами и некоторыми заменителями службы Angular, которые нужны каждому тестировщику.

      Вызов `configureTestingModule` для уточнения конфигурации модуля тестирования для определенного набора тестов
      путем добавления и удаления импорта, объявлений (компонентов, директив и каналов) и поставщиков.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>compileComponents</code>
    </td>

    <td>

      Скомпилируйте модуль тестирования асинхронно после того, как вы закончили его настройку.
      Вы **должны** вызвать этот метод, если _any_ из компонентов модуля тестирования имеет `templateUrl` 
      или же `styleUrls` потому что выборка шаблона компонента и файлов стиля обязательно асинхронна.
      Смотрите [выше](#compile-components).

      После звонка `compileComponents`, `TestBed` Конфигурация заморожена на время текущей спецификации.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>createComponent<T></code>
    </td>

    <td>

      Создать экземпляр компонента типа `T` на основе текущего `TestBed` Конфигурация.
      После звонка `compileComponent`, `TestBed` Конфигурация заморожена на время текущей спецификации.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideModule</code>
    </td>
    <td>

      Заменить метаданные на данный `NgModule` . Напомним, что модули могут импортировать другие модули.
 `overrideModule` Метод может глубоко проникнуть в текущий модуль тестирования
      изменить один из этих внутренних модулей.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideComponent</code>
    </td>

    <td>

      Замените метаданные для данного класса компонентов, которые могут быть глубоко вложены
      во внутреннем модуле.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overrideDirective</code>
    </td>

    <td>

      Замените метаданные для данного класса директив, которые могут быть глубоко вложены
      во внутреннем модуле.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>overridePipe</code>
    </td>
    <td>

      Замените метаданные для данного класса канала, которые могут быть глубоко вложены
      во внутреннем модуле.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-inject}
      <code>inject</code>
    </td>

    <td>

      Получить сервис из текущего `TestBed` инжектор.

 `inject` Функция часто подходит для этой цели.
      Но `inject` выдает ошибку, если не может предоставить сервис.

      Что делать, если услуга не является обязательной?

 `TestBed.inject()` метод принимает необязательный второй параметр,
      объект, который нужно вернуть, если Angular не может найти провайдера
      ( `null` в этом примере)

      <code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="testbed-get-w-null" header="app/demo/demo.testbed.spec.ts"></code-example>

      После звонка `TestBed.inject`, `TestBed` Конфигурация заморожена на время текущей спецификации.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      {@a testbed-initTestEnvironment}
      <code>initTestEnvironment</code>
    </td>
    <td>

      Инициализируйте среду тестирования для всего теста.

      Тестирующие прокладки (`karma-test-shim`, `browser-test-shim`) позвони за тебя
      поэтому у вас редко есть причина, чтобы называть это самостоятельно.

      Вы можете вызвать этот метод _точно один раз_. Если вы должны измениться
      это значение по умолчанию в середине вашего теста, вызов `resetTestEnvironment`.

      Укажите фабрику Angular компиляторов, `PlatformRef` и модуль Angular тестирования по умолчанию.
      Альтернативы для небраузерных платформ доступны в общем виде
       `@angular/platform-<platform_name>/testing/<platform_name>`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>resetTestEnvironment</code>
    </td>
    <td>

      Сбросить начальную среду тестирования, включая модуль тестирования по умолчанию.

    </td>
  </tr>
</table>

Несколько из `TestBed` экземпляра не покрываются статическими `TestBed` _class_ методы.
Это редко нужно.

{@a component-fixture-api-summary}

{@a the-componentfixture}
#### _ComponentFixture_

 `TestBed.createComponent<T>` 
создает экземпляр компонента `T` 
и возвращает строго типизированный `ComponentFixture` для этого компонента.

 `ComponentFixture` Свойства и методы обеспечивают доступ к компоненту
его представление DOM и аспекты его Angular среды.

{@a component-fixture-properties}

{@a componentfixture-properties}
#### Свойства _ComponentFixture_

Вот наиболее важные свойства для тестеров, в порядке вероятности полезности.

<table>
  <tr>
    <th>
      Свойства
    </th>
    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      Экземпляр класса компонента, созданный `TestBed.createComponent`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>debugElement</code>
    </td>

    <td>

 `DebugElement` связан с корневым элементом компонента.

 `debugElement` обеспечивает понимание компонента и его элемента DOM во время тестирования и отладки.
      Это критическое свойство для тестеров. Самые интересные участники покрыты [ниже](#debug-element-details).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      Собственный элемент DOM в корне компонента.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>changeDetectorRef</code>
    </td>

    <td>

 `ChangeDetectorRef` для компонента.

 `ChangeDetectorRef` является наиболее ценным при тестировании
      компонент, который имеет `ChangeDetectionStrategy.OnPush` Метод
      или обнаружение изменений компонента находится под вашим программным контролем.

    </td>
  </tr>
</table>

{@a component-fixture-methods}

{@a componentfixture-methods}
#### _ComponentFixture_ методы

Методы _fixture_ заставляют Angular выполнять определенные задачи в дереве компонентов.
Вызовите этот метод, чтобы вызвать Angular поведение в ответ на смоделированное действие пользователя.

Вот самые полезные методы для тестеров.

<table>
  <tr>
    <th>
      Методы
    </th>
    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>detectChanges</code>
    </td>

    <td>

      Запустите цикл обнаружения изменений для компонента.

      Вызовите его для инициализации компонента (он вызывает `ngOnInit`) и после вашего
      тестовый код, измените значения свойства компонента, связанные с данными.
      Angular не видит, что ты изменился `personComponent.name` и не будет обновлять `name` 
      обязательный, пока вы не позвоните `detectChanges`.

      Запускается `checkNoChanges` впоследствии, чтобы подтвердить, что нет никаких циклических обновлений, если
      называется как `detectChanges(false)` ;

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>autoDetectChanges</code>
    </td>

    <td>

      Установите это в `true` если вы хотите, чтобы прибор автоматически обнаруживал изменения.

      Когда автоопределение `true`, тестовый прибор вызывает `detectChanges` немедленно
      после создания компонента. Затем он слушает события соответствующей зоны
      и звонки `detectChanges` соответственно.
      Когда ваш тестовый код изменяет значение свойств компонентов непосредственно
      Вам, вероятно, еще нужно позвонить `fixture.detectChanges` для запуска обновлений привязки данных.

      По умолчанию `false` . Тестеры, которые предпочитают хороший контроль над поведением тестов
      как правило, держать его `false`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>checkNoChanges</code>
    </td>

    <td>

      Выполните прогон обнаружения изменений, чтобы убедиться, что нет ожидающих изменений.
      Выдает исключения, если они есть.
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>isStable</code>
    </td>

    <td>

      Если прибор в настоящее время _stable_, возвращает `true`.
      Если есть асинхронные задачи, которые не были выполнены, возвращается `false`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>whenStable</code>
    </td>

    <td>

      Возвращает обещание, которое разрешается, когда устройство стабильно.

      Возобновить тестирование после завершения асинхронного действия или
      Обнаружение асинхронного изменения, перехватите это обещание.
      Смотрите [выше](#when-stable).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>destroy</code>
    </td>

    <td>

      Запустить уничтожение компонента.

    </td>
  </tr>
</table>

{@a debug-element-details}

{@a debugelement}
#### _DebugElement_

 `DebugElement` предоставляет важную информацию о представлении DOM компонента.

Из тестового корневого компонента `DebugElement` возвращается `fixture.debugElement`,
Вы можете пройтись (и запросить) весь элемент прибора и его поддеревья.

Вот самые полезные `DebugElement` элементы для тестировщиков, в примерном порядке полезности:

<table>
  <tr>
    <th>
      Член
    </th>
    <th>
      Описание
    </th>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>nativeElement</code>
    </td>

    <td>

      Соответствующий элемент DOM в браузере (ноль для WebWorkers).

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>query</code>
    </td>

    <td>

      призвание `query(predicate: Predicate<DebugElement>)` возвращает первый `DebugElement` 
      это соответствует [предикат](#query-predicate)на любой глубине в поддереве.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>queryAll</code>
    </td>

    <td>

      призвание `queryAll(predicate: Predicate<DebugElement>)` возвращает все `DebugElements` 
      это соответствует [предикат](#query-predicate)на любой глубине в поддереве.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>injector</code>
    </td>

    <td>

      Инжектор зависимости от хоста.
      Например, инжектор экземпляра компонента корневого элемента.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>componentInstance</code>
    </td>

    <td>

      Экземпляр собственного компонента элемента, если он есть.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>context</code>
    </td>

    <td>

      Объект, который предоставляет родительский контекст для этого элемента.
      Часто экземпляр компонента-предка, который управляет этим элементом.

      Когда элемент повторяется в `*ngFor`, контекст является `NgForRow` чей `$implicit` 
      Свойство - это значение значения экземпляра строки.
      Например, `hero` в `*ngFor="let hero of heroes"`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>children</code>
    </td>

    <td>

      Немедленное `DebugElement` дети. Прогуляйтесь по дереву, спустившись через `children`.

      <div class="alert is-helpful">

       `DebugElement` также имеет `childNodes`, список `DebugNode` Объекты.
       `DebugElement` происходит от `DebugNode` Объекты существуют и часто
      больше узлов, чем элементов. Тестеры обычно могут игнорировать простые узлы.

      </div>
    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>parent</code>
    </td>
    <td>

 `DebugElement` родитель. Нуль, если это корневой элемент.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>name</code>
    </td>

    <td>

      Имя тега элемента, если это элемент.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>triggerEventHandler</code>
    </td>
    <td>

      Запускает событие по его имени, если есть соответствующий слушатель
      в стихии `listeners` коллекция.
      Второй параметр - это объект _event, ожидаемый обработчиком.
      Смотрите [выше](#trigger-event-handler).

      Если событие не хватает слушателя или есть какая - то другая проблема,
      рассмотреть вопрос о звонке `nativeElement.dispatchEvent(eventObject)`.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>listeners</code>
    </td>

    <td>

      Обратные вызовы, прикрепленные к компоненту `@Output` Свойства и / или свойства события элемента.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>providerTokens</code>
    </td>

    <td>

      Токены поиска инжектора этого компонента.
      Включает сам компонент плюс токены, которые компонент перечисляет в своем `providers` метаданные.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>source</code>
    </td>

    <td>

      Где найти этот элемент в шаблоне исходного компонента.

    </td>
  </tr>

  <tr>
    <td style="vertical-align: top">
      <code>references</code>
    </td>

    <td>

      Словарь объектов, связанных с шаблонными локальными переменными (например, `#foo`)
      по имени локальной переменной.

    </td>
  </tr>
</table>

{@a query-predicate}

 `DebugElement.query(predicate) ` и ` DebugElement.queryAll(predicate)` принимают
Предикат, который фильтрует поддерево исходного элемента для соответствия `DebugElement`.

Предикат - это любой метод, который принимает `DebugElement` и возвращает значение _truthy_.
Следующий пример находит все `DebugElements` с ссылкой на локальную переменную шаблона с именем «содержание»:

<code-example path="testing/src/app/demo/demo.testbed.spec.ts" region="custom-predicate" header="app/demo/demo.testbed.spec.ts"></code-example>

Angular `By` классу имеет три статические методы для общих предикатов

- `By.all` - вернуть все элементы.
- `By.css(selector)` - возвращает элементы с соответствующими селекторами CSS.
- `By.directive(directive)` - возвращает элементы, которые Angular соответствуют экземпляру класса директивы.

<code-example path="testing/src/app/hero/hero-list.component.spec.ts" region="by" header="app/hero/hero-list.component.spec.ts"></code-example>

<hr>

{@a useful-tips}

{@a useful-tips}
## Полезные советы

{@a q-spec-file-location}

{@a place-your-spec-file-next-to-the-file-it-tests}
#### Поместите ваш spec-файл рядом с файлом, который он тестирует

Это хорошая идея, чтобы поместить файлы спецификации модульного теста в одну папку
как файлы исходного кода приложения, которые они испытывают:

- Такие тесты легко найти.
- Вы сразу видите, что в части вашего приложения отсутствуют тесты.
- Соседние тесты могут показать, как деталь работает в контексте.
- Когда вы перемещаете источник (неизбежно), вы не забываете перемещать тест.
- Когда вы переименовываете исходный файл (неизбежно), вы не забываете переименовывать тестовый файл.

{@a q-specs-in-test-folder}

{@a place-your-spec-files-in-a-test-folder}
#### Поместите ваши спецификации в тестовую папку

Спецификации интеграции приложений могут проверять взаимодействие нескольких частей
распределить по папкам и модулям.
Они на самом деле не принадлежат какой-либо конкретной части, поэтому у них нет
естественный дом рядом с любым файлом.

Часто лучше создать соответствующую папку для них в `tests` каталог.

Конечно, спецификации, которые тестируют тестовых помощников, относятся к `test` папка
рядом с их соответствующими вспомогательными файлами.

{@a q-kiss}

{@a keep-it-simple}
#### Сохраняйте это простым

[Проверка класса компонентов](#component-class-testing)должна быть очень чистой и простой.
Следует тестировать только одну единицу. На первый взгляд, вы должны понимать
что тест тестирует. Если он делает больше, то ему здесь не место.

{@a q-end-to-end}

{@a use-e2e-end-to-end-to-test-more-than-a-single-unit}
#### Используйте E2E (сквозной) для тестирования более чем одного устройства

Тесты E2E отлично подходят для высокоуровневой проверки всей системы.
Но они не могут дать вам исчерпывающее тестовое покрытие, которое вы ожидаете от модульных тестов.

Тесты E2E сложно написать и выполнить плохо по сравнению с модульными тестами.
Они легко ломаются, часто из-за изменений или неправильного поведения, удаленных от места поломки.

Тесты E2E не могут легко выявить, как ваши компоненты ведут себя, когда что-то идет не так
такие как отсутствующие или неверные данные, потерянные соединения и сбои удаленного сервиса.

E2E тестирует приложения, которые обновляют базу данных
Чтобы отправить счет-фактуру или снять с кредитной карты, требуются специальные хитрости и задние ходы для предотвращения
случайное повреждение удаленных ресурсов.
Может даже быть трудно перейти к компоненту, который вы хотите протестировать.

Из-за этих многочисленных препятствий вы должны проверить взаимодействие DOM
с методами юнит тестирования как можно больше.
