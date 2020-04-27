{@a building-and-serving-angular-apps}
# Создание и обслуживание приложений Angular

На этой странице обсуждаются параметры конфигурации для проектов Angular.

{@a app-environments}

{@a configuring-application-environments}
## Конфигурирование прикладных сред

Вы можете определить разные именованные конфигурации сборки для вашего проекта, такие как *этап* и *производство*, с разными значениями по умолчанию.

Каждая именованная конфигурация может иметь значения по умолчанию для любого из параметров, которые применяются к различным [целям компоновщика](guide/glossary#target), таким как  `build`,  `serve`  и  `test` . [Угловое CLI](cli)  `build `, ` serve ` и ` test` Затем команды могут заменить файлы соответствующими версиями для вашей целевой среды.

{@a configure-environment-specific-defaults}
### Сконфигурируйте специфичные для среды значения по умолчанию

Проект  `src/environments/`  папка содержит базовый файл конфигурации,  `environment.ts`, который обеспечивает среду по умолчанию.
Вы можете добавить значения переопределения по умолчанию для дополнительных сред, таких как производственная и промежуточная, в файлах конфигурации для конкретных целей.

Например:

```
└──myProject/src/environments/
                   └──environment.ts
                   └──environment.prod.ts
                   └──environment.stage.ts
```

Базовый файл  `environment.ts`, содержит настройки среды по умолчанию. Например:

```
export const environment = {
  production: false
};
```

 `build` Команда использует это как цель сборки, когда среда не указана.
Вы можете добавить дополнительные переменные, либо как дополнительные свойства объекта среды, либо как отдельные объекты.
Например, следующий добавляет по умолчанию для переменной к окружающей среде по умолчанию:

```
export const environment = {
  production: false,
  apiUrl: 'http://my-api-url'
};
```

Вы можете добавить целевые файлы конфигурации, такие как  `environment.prod.ts`.
Следующие наборы значений наборов контента по умолчанию для целевой сборки производства:

```
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};
```

{@a using-environment-specific-variables-in-your-app}
### Использование переменных окружения в вашем приложении

Следующие структуры приложения конфигурирует построить цели для производства и демонстрационных сред:

```
└── src
    └── app
        ├── app.component.html
        └── app.component.ts
    └── environments
        ├── environment.prod.ts
        ├── environment.staging.ts
        └── environment.ts
```

Для использования конфигурации среды, которые вы определили, ваши компоненты должны импортировать исходный файл сред:

```
import { environment } from './../environments/environment';
```

Это гарантирует, что команды build и serve могут найти конфигурации для конкретных целей сборки.

Следующий код в файле компонента (`app.component.ts`) использует переменную среды, определенную в файлах конфигурации.

```
import { Component } from '@angular/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    console.log(environment.production); // Logs false for default environment
  }
  title = 'app works!';
}
```
{@a file-replacement}

{@a configure-target-specific-file-replacements}
## Сконфигурируйте замены файлов для конкретных целей

Основной файл конфигурации CLI,  `angular.json`, содержит  `fileReplacements`  Раздел в конфигурации для каждого целевого объекта сборки, который позволяет заменить любой файл конкретной версией этого файла.
Это полезно для включения специфичного для цели кода или переменных в сборку, предназначенную для конкретной среды, такой как производство или подготовка.

По умолчанию файлы не заменяются.
Вы можете добавить замены файлов для конкретных целей сборки.
Например:

```
"configurations": {
  "production": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.prod.ts"
      }
    ],
   ...
```

Это означает, что когда вы создаете свою производственную конфигурацию (используя `ng build --prod ` или ` ng build --configuration=production `), ` src/environments/environment.ts` Файл заменяется целевой версией файла,  `src/environments/environment.prod.ts`.

Вы можете добавить дополнительные конфигурации по мере необходимости. Чтобы добавить промежуточную среду, создайте копию  `src/environments/environment.ts`  называется  `src/environments/environment.staging.ts`, затем добавьте  `staging`  конфигурация  `angular.json`  :

```
"configurations": {
  "production": {... },
  "staging": {
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.staging.ts"
      }
    ]
  }
}
```

Вы также можете добавить дополнительные параметры конфигурации в эту целевую среду.
Любая опция, которую поддерживает ваша сборка, может быть переопределена в целевой конфигурации сборки.

Для того, чтобы построить с использованием конфигурации индексирования, выполните следующую команду:

<code-example language="sh" class="code-shell">
 ng build --configuration=staging
</code-example>

Вы также можете настроить  `serve`  команда для использования целевой конфигурации сборки, если вы добавите ее в раздел «serve: configurations»  `angular.json`  :

```
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "your-project-name:build"
  },
  "configurations": {
    "production": {
      "browserTarget": "your-project-name:build:production"
    },
    "staging": {
      "browserTarget": "your-project-name:build:staging"
    }
  }
},
```

{@a size-budgets}
{@a configure-size-budgets}

{@a configuring-size-budgets}
## Настройка размеров бюджетов

По мере увеличения функциональности приложений они также увеличиваются в размерах.
CLI позволяет вам устанавливать пороговые значения размера в вашей конфигурации, чтобы гарантировать, что части вашего приложения остаются в границах размера, которые вы определяете.

Определите границы вашего размера в файле конфигурации CLI,  `angular.json`, в  `budgets`  раздел для каждого [настроенная среда](#app-environments).

```
{
 ...
  "configurations": {
    "production": {
     ...
      budgets: []
    }
  }
}
```

Вы можете указать размер бюджета для всего приложения и для отдельных частей.
Каждая запись бюджета настраивает бюджет данного типа.
Укажите значение размера в следующих форматах:

* 123 или 123b: размер в байтах

* 123kb: размер в килобайтах

* 123mb: размер в мегабайтах

* 12%: процент от размера относительно базовой линии. (Недействительно для базовых значений.)

Когда вы настраиваете бюджет, система сборки предупреждает или сообщает об ошибке, когда заданная часть приложения достигает или превышает установленный вами размер границы.

Каждый элемент бюджета представляет собой объект JSON со следующими свойствами:

<table>
  <tr>
    <th>Недвижимость </th>
    <th>Значение </th>
  </tr>

  <tr>
    <td>тип </td>
    <td>

    Тип бюджета. Один из:

*  `bundle` - размер определенного комплекта.
*  `initial` - начальный размер приложения.
*  `allScript` - размер всех скриптов.
*  `all` - размер всего приложения.
*  `anyComponentStyle` - размер таблицы стилей любого компонента.
*  `anyScript` - размер любого скрипта.
*  `any` - размер любого файла.

    </td>
  </tr>
   <tr>
    <td>имя </td>
    <td>

    Наименование комплекта (для  `type=bundle`).

    </td>
  </tr>
  <tr>
    <td>базовый уровень </td>
    <td>Базовый размер для сравнения. </td>
  </tr>
  <tr>
    <td>maximumWarning </td>
    <td>Максимальный порог для предупреждения относительно базовой линии. </td>
  </tr>
  <tr>
    <td>MaximumError </td>
    <td>Максимальный порог для ошибки относительно базовой линии. </td>
  </tr>
  <tr>
    <td>minimumWarning </td>
    <td>Минимальный порог для предупреждения относительно базовой линии. </td>
  </tr>
  <tr>
    <td>minimumError </td>
    <td>Минимальный порог для ошибки относительно базовой линии. </td>
  </tr>
  <tr>
    <td>предупреждение </td>
    <td>Порог для предупреждения относительно базовой линии (мин и макс). </td>
  </tr>
  <tr>
    <td>ошибка </td>
    <td>Порог для ошибки относительно базовой линии (мин и макс). </td>
  </tr>

 </table>


{@a browser-compat}

{@a configuring-browser-compatibility}
## Настройка совместимости браузера

CLI использует [Autoprefixer](https://github.com/postcss/autoprefixer)для обеспечения совместимости с различными версиями браузера и браузера.
Вы можете счесть необходимым настроить таргетинг на определенные браузеры или исключить определенные версии браузеров из вашей сборки.

Внутренне Autoprefixer использует библиотеку [Список браузеров](https://github.com/browserslist/browserslist)чтобы выяснить, какие браузеры поддерживать с префиксами.
Список браузеров ищет параметры конфигурации в  `browserslist`  свойство файла конфигурации пакета или файла конфигурации с именем  `.browserslistrc`.
Авторефиксатор ищет  `browserslist`  Конфигурация когда она префикс вашего CSS.

* Вы можете указать Autoprefixer, на какие браузеры ориентироваться, добавив свойство browserslist в файл конфигурации пакета,  `package.json`  :
```
 "browserslist": [
   "> 1%",
   "last 2 versions"
 ]
```

* Кроме того, вы можете добавить новый файл,  `.browserslistrc`, в каталог проекта, который задает браузеры вы хотите поддержку:
```
 ### Supported Browsers
 > 1%
 last 2 versions
```

Смотрите список [репозиторий обозревателей](https://github.com/browserslist/browserslist)для большего количества примеров того, как настроить таргетинг на определенные браузеры и версии.

{@a backward-compatibility-with-lighthouse}
### Обратная совместимость с маяком

Если вы хотите создать прогрессивное веб-приложение и используете [Lighthouse](https://developers.google.com/web/tools/lighthouse/)для оценки проекта, добавьте следующее  `browserslist`  запись в  `package.json` файл, для того, чтобы устранить [старый Flexbox](https://developers.google.com/web/tools/lighthouse/audits/old-flexbox)префиксы:

```
"browserslist": [
  "last 2 versions",
  "not ie <= 10",
  "not ie_mob <= 10"
]
```

{@a backward-compatibility-with-css-grid}
### Обратная совместимость с сеткой CSS

Поддержка разметки CSS-сетки в Autoprefixer, который ранее был включен по умолчанию, по умолчанию отключена в Angular 8 и выше.

Чтобы использовать CSS-сетку с IE10 / 11, вы должны явно включить ее, используя  `autoplace`.
Чтобы сделать это, добавьте следующую строку в верхней части глобального файла стилей (или в пределах области селекторного конкретных CSS)

```
/* autoprefixer grid: autoplace /
```
или
```
/ autoprefixer grid: no-autoplace */
```

Для получения дополнительной информации см. [Документация Autoprefixer](https://autoprefixer.github.io/).


{@a proxy}

{@a proxying-to-a-backend-server}
## Проксирование на бэкэнд-сервер

Вы можете использовать [прокси поддержку](https://webpack.js.org/configuration/dev-server/#devserverproxy)в  `webpack`  сервер для перенаправления определенных URL-адресов на внутренний сервер путем передачи файла  `--proxy-config`  сборки.
Например, для переадресации всех звонков на  `http://localhost:4200/api`  к серверу, работающему на  `http://localhost:3000/api`, выполните следующие действия.

1. Создать файл  `proxy.conf.json`  в вашем проекте  `src/`  папка.

1. Добавьте следующее содержимое в новый прокси - файл:
    ```
    {
      "/api": {
        "target": "http://localhost:3000",
        "secure": false
      }
    }
    ```

1. В файле конфигурации CLI  `angular.json`, добавьте  `proxyConfig`  опция для  `serve`  цели:
    ```
   ...
    "architect": {
      "serve": {
        "builder": "@angular-devkit/build-angular:dev-server",
        "options": {
          "browserTarget": "your-application-name:build",
          "proxyConfig": "src/proxy.conf.json"
        },
   ...
    ```

1. Чтобы запустить dev-сервер с этой конфигурацией прокси, позвоните `ng serve`.

Вы можете отредактировать файл конфигурации прокси, чтобы добавить параметры конфигурации; некоторые примеры приведены ниже.
Для описания всех параметров см [WebPack DevServer документации](https://webpack.js.org/configuration/dev-server/#devserverproxy).

Обратите внимание, что если вы редактируете файл конфигурации прокси, вы должны перезапустить `ng serve` Процесс заявок, чтобы сделать ваши изменения эффективными.

{@a rewrite-the-url-path}
### Перепишите путь URL

 `pathRewrite` конфигурации proxy позволяет перезаписать путь URL во время выполнения.
Например, вы можете указать следующее  `pathRewrite`  Значение для конфигурации прокси, чтобы удалить «api» из конца пути.

```
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

Если вам нужен доступ к бэкэнду, который не включен  `localhost`, установите  `changeOrigin`  опция также. Например:

```
{
  "/api": {
    "target": "http://npmjs.org",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "changeOrigin": true
  }
}
```

Чтобы определить, работает ли ваш прокси-сервер правильно, установите  `logLevel`  опция. Например:

```
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "pathRewrite": {
      "^/api": ""
    },
    "logLevel": "debug"
  }
}
```

Уровни прокси журнала  `info`  (по умолчанию),  `debug`,  `warn`,  `error`  и  `silent`.

{@a proxy-multiple-entries}
### Прокси несколько записей

Вы можете проксировать несколько записей к одной и той же цели, определив конфигурацию в JavaScript.

Установите файл конфигурации прокси на  `proxy.conf.js`  (вместо  `proxy.conf.json`) и укажите файлы конфигурации, как в следующем примере.

```
const PROXY_CONFIG = [
    {
        context: [
            "/my",
            "/many",
            "/endpoints",
            "/i",
            "/need",
            "/to",
            "/proxy"
        ],
        target: "http://localhost:3000",
        secure: false
    }
]

module.exports = PROXY_CONFIG;
```

В файле конфигурации CLI  `angular.json`, указывают на прокси - файл конфигурации JavaScript:

```
...
"architect": {
  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": {
      "browserTarget": "your-application-name:build",
      "proxyConfig": "src/proxy.conf.js"
    },
...
```

{@a bypass-the-proxy}
### Обойти прокси

Если вам необходимо дополнительно обойти прокси-сервер или динамически изменить запрос перед его отправкой, добавьте опцию обхода, как показано в этом примере JavaScript.

```
const PROXY_CONFIG = {
    "/api/proxy": {
        "target": "http://localhost:3000",
        "secure": false,
        "bypass": function (req, res, proxyOptions) {
            if (req.headers.accept.indexOf("html")  !== -1) {
                console.log("Skipping proxy for browser request.") ;
                return "/index.html";
            }
            req.headers["X-Custom-Header"] = "yes";
        }
    }
}

module.exports = PROXY_CONFIG;
```

{@a using-corporate-proxy}
### Использование корпоративного прокси

Если вы работаете за корпоративным прокси-сервером, серверная часть не может напрямую обращаться к любому URL-адресу за пределами вашей локальной сети.
В этом случае, вы можете настроить прокси бэкэнда для перенаправления вызовов через корпоративный прокси - сервер с помощью агента:

<code-example language="none" class="code-shell">
npm install --save-dev https-proxy-agent
</code-example>

Когда вы определяете переменную среды  `http_proxy`  или  `HTTP_PROXY`, агент автоматически добавляется для прохождения вызовов через ваш корпоративный прокси при запуске `npm start`.

Используйте следующее содержимое в файле конфигурации JavaScript.

```
var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/api',
  target: 'http://your-remote-server.com:3000',
  secure: false
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
```
