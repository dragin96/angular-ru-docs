{@a app-shell}
# Приложение оболочки

Оболочка приложения - это способ визуализации части вашего приложения через маршрут во время сборки.
Он может улучшить взаимодействие с пользователем, быстро запустив статическую визуализированную страницу (каркас, общий для всех страниц), пока браузер загружает полную версию клиента и автоматически переключается на нее после загрузки кода.

Это дает пользователям осмысленную первую картину вашего приложения, которая появляется быстро, потому что браузер может просто визуализировать HTML и CSS без необходимости инициализации какого-либо JavaScript.

Узнайте больше в [Модель оболочки приложения](https://developers.google.com/web/fundamentals/architecture/app-shell).

{@a step-1-prepare-the-application}
## Шаг 1: подготовить заявку

Вы можете сделать это с помощью следующей команды CLI:
<code-example language="bash">
ng new my-app --routing
</code-example>

Для существующего приложения вы должны вручную добавить `RouterModule` и определение `<router-outlet>` в вашем приложении.

{@a step-2-create-the-app-shell}
## Шаг 2: Создайте оболочку приложения

Используйте CLI для автоматического создания оболочки приложения.

<code-example language="bash">
ng generate app-shell
</code-example>

* `client-project` берет имя вашего клиентского приложения.

После выполнения этой команды вы заметите, что `angular.json` конфигурации был обновлен, чтобы добавить две новые цели, с некоторыми другими изменениями.

<code-example language="json">
"server": {
  "builder": "@angular-devkit/build-angular:server",
  "options": {
    "outputPath": "dist/my-app-server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  }
},
"app-shell": {
  "builder": "@angular-devkit/build-angular:app-shell",
  "options": {
    "browserTarget": "my-app:build",
    "serverTarget": "my-app:server",
    "route": "shell"
  },
  "configurations": {
    "production": {
      "browserTarget": "my-app:build:production",
      "serverTarget": "my-app:server:production"
    }
  }
}
</code-example>

{@a step-3-verify-the-app-is-built-with-the-shell-content}
## Шаг 3. Убедитесь, что приложение создано с использованием содержимого оболочки

Используйте CLI для построения `app-shell` цель.

<code-example language="bash">
ng run my-app:app-shell
</code-example>

Или использовать производственную конфигурацию.

<code-example language="bash">
ng run my-app:app-shell:production
</code-example>

Чтобы проверить вывод сборки, откройте `dist/my-app/index.html` . Ищите текст по умолчанию `app-shell works!` чтобы показать, что маршрут оболочки приложения отображен как часть вывода.


