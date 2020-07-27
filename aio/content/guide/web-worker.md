{@a using-web-workers-with-angular-cli}
# Использование веб воркеров с Angular CLI

[Веб-работники](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)позволяют запускать интенсивные вычисления в фоновом потоке, освобождая основной поток для обновления пользовательского интерфейса.

Если вы обнаружите, что ваше приложение перестает отвечать на запросы при обработке данных, вам могут помочь веб-работники.

{@a adding-a-web-worker}
## Добавление веб воркероа

Вы можете добавить веб воркер в любом месте вашего приложения. Если файл, который содержит ваши дорогие вычисления  `src/app/app.component.ts`, вы можете добавить веб воркер, используя `ng generate web-worker app`.

Выполнение этой команды:

- настройте свой проект на использование веб воркеров, если это еще не сделано.
- добавлять  `src/app/app.worker.ts`  с scaffolded кодом для получения сообщений:

  <code-example language="typescript" header="src/app/app.worker.ts">
  addEventListener('message', ({ data }) => {
    const response =  `worker response to ${data}` ;
    postMessage(response);
  });
 </code-example>

- добавить код лесов в  `src/app/app.component.ts`  использовать работник:

  <code-example language="typescript" header="src/app/app.component.ts">
  if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker('./app.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
      console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
  } else {
    // Web workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
  }
  </code-example>

После первоначального создания леса вам потребуется реорганизовать свой код, чтобы использовать веб-работника, отправляя сообщения в и из него.

{@a caveats}
## Предостережения

Есть две важные вещи, которые нужно иметь в виду при использовании веб - рабочих проектов Angular:

- Некоторые среды или платформы, такие как  `@angular/platform-server`  используемый в [рендеринг на стороне сервера](guide/universal), не поддерживает веб воркеров. Вы должны предоставить резервный механизм для выполнения вычислений, которые рабочий будет выполнять, чтобы ваше приложение работало в этих средах.
- Сам по себе Angular в веб-приложении через [запуск ** @ angular / platform-webworker**](api/platform-webworker)еще не поддерживается в Angular CLI.
