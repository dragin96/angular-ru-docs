{@a angular-ivy}
# Angular Ivy

Ivy - это кодовое имя для Angular [конвейер компиляции и рендеринга следующего поколения](https://blog.angular.io/a-plan-for-version-8-0-and-ivy-b3318dfc19f7).
В версии Angular версии 9 новые инструкции компилятора и среды выполнения используются по умолчанию вместо старых компилятора и среды выполнения, известных как View Engine.

<div class="alert is-helpful">

Узнайте больше о [Compiler](https://www.youtube.com/watch?v=anphffaCZrQ)и [Runtime](https://www.youtube.com/watch?v=S0o-4yc2n-8)в этих видео от нашей команды.


</div>

{@a aot-and-ivy}
{@a aot-and-ivy}
## АОТ и Айви

Компиляция AOT с Ivy быстрее и должна использоваться по умолчанию.
в `angular.json` конфигурации рабочей области, задайте параметры сборки по умолчанию для вашего проекта, чтобы всегда использовать компиляцию AOT.
При использовании интернационализации приложений (i18n) с Ivy [слияние переводов](guide/i18n#merge)также требуется использование компиляции AOT.

<code-example language="json" header="angular.json">

{
  "projects": {
    "my-existing-project": {
      "architect": {
        "build": {
          "options": {
            ...
            "aot": true,
          }
        }
      }
    }
  }
}
</code-example>

{@a ivy-and-libraries}
## Плющ и библиотеки

Приложения Ivy можно создавать с помощью библиотек, созданных с помощью компилятора View Engine.
Эта совместимость обеспечивается инструментом, известным как компилятор Angular совместимости (`ngcc`).
Команды CLI работают `ngcc` мере необходимости при выполнении Angular сборки.

Для получения дополнительной информации о том, как публиковать библиотеки, см. [Публикация вашей библиотеки](guide/creating-libraries#publishing-your-library).

{@a maintaining-library-compatibility}
{@a maintaining-library-compatibility}
### Поддержание совместимости библиотеки

Если вы являетесь автором библиотеки, вы должны продолжать использовать компилятор View Engine начиная с версии 9
Если все библиотеки будут продолжать использовать View Engine, вы будете поддерживать совместимость с приложениями v9 по умолчанию, которые используют Ivy, а также с приложениями, которые решили продолжать использовать View Engine.

Смотрите [Создание библиотек](guide/creating-libraries)руководство для получения дополнительной информации о том, как скомпилировать или связать вашу библиотеку Angular.
Когда вы используете инструменты, интегрированные в Angular CLI или `ng-packagr`, ваша библиотека всегда будет правильно построена.

{@a ivy-and-universal-app-shell}
{@a ivy-and-universal/app-shell}
## Ivy и Universal / App оболочка
В версии 9 построитель сервера, который используется для [оболочка приложения](guide/app-shell)и [Angular универсальная](guide/universal)имеет `bundleDependencies` включена по умолчанию.
Если вы отказываетесь от связывания зависимостей, вам необходимо запустить автономный компилятор Angular совместимости (`ngcc`). Это необходимо, потому что в противном случае Node не сможет разрешить версию пакетов Ivy.

Вы можете запустить `ngcc` после каждой установки node_modules, добавив `postinstall` [НПЙ сценарий](https://docs.npmjs.com/misc/scripts):

<code-example language="json" header="package.json">
{
  "scripts": {
    "postinstall": "ngcc"
  }
}
</code-example>

<div class="alert is-important">

 * `postinstall` скрипт будет запускаться при каждой установке `node_modules`, в том числе выполненные `ng update ` и ` ng add`.
 * Не использовать `--create-ivy-entry-points` поскольку это приведет к тому, что Node не сможет правильно разрешить версию пакетов Ivy.

</div>

{@a opting-out-of-angular-ivy}
{@a opting-out-of-ivy-in-version-9}
## Отказ от плюща в версии 9

В версии 9 Ivy используется по умолчанию.
Для совместимости с текущими рабочими процессами в процессе обновления вы можете отказаться от Ivy и продолжить использовать предыдущий компилятор View Engine.

<div class="alert is-helpful">

Прежде чем отключить Ivy, ознакомьтесь с рекомендациями по отладке в [Руководстве по совместимости Ivy](guide/ivy-compatibility#debugging).

</div>

Чтобы отказаться от плюща, измените `angularCompilerOptions` в конфигурации TypeScript вашего проекта, чаще всего расположенный в `tsconfig.app.json` в корне рабочей области.

Значение `enableIvy` флаг установлен в `true` по умолчанию, начиная с версии 9

В следующем примере показано, как установить `enableIvy` опция для `false` для того, чтобы отказаться от плюща.

<code-example language="json" header="tsconfig.app.json">
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ],
  "angularCompilerOptions": {
    "enableIvy": false
  }
}
</code-example>

<div class="alert is-important">

Если вы отключите Ivy, вы также можете пересмотреть вопрос о том, следует ли делать компиляцию AOT по умолчанию для разработки приложений, как описано [выше](#aot-and-ivy).

Чтобы восстановить компилятор по умолчанию, установите опцию сборки `aot: false ` в ` angular.json` конфигурации.

</div>

Если вы отключили Ivy и в проекте используется интернационализация, вы также можете удалить `@angular/localize` времени выполнения из файла polyfills проекта, расположенный по умолчанию в `src/polyfills.ts`.

Чтобы удалить, удалите `import '@angular/localize/init';` строка из файла polyfills.

<code-example language="typescript" header="polyfills.ts">
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
</code-example>

{@a using-ssr-without-angular-ivy}
{@a using-ssr-without-ivy}
### Использование SSR без плюща

Если вы отказываетесь от Ivy и ваше приложение использует [Angular Universal](guide/universal)для рендеринга приложений Angular на сервере, вы также должны изменить способ загрузки сервера.

В следующем примере показано, как изменить `server.ts` файл для предоставления `AppServerModuleNgFactory` в качестве модуля начальной загрузки.

* Импортировать `AppServerModuleNgFactory` из `app.server.module.ngfactory` виртуальный файл.
* Задавать `bootstrap: AppServerModuleNgFactory ` в ` ngExpressEngine`.

<code-example language="typescript" header="server.ts">
import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { APP_BASE_HREF } from '@angular/common';

import { AppServerModuleNgFactory } from './src/app/app.server.module.ngfactory';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/ivy-test/browser');

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render('index', { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}

export * from './src/main.server';
</code-example>
