{@a setup-for-upgrading-from-angularjs}
# Установка для обновления с AngularJS

<!--
Question: Can we remove this file and instead direct readers to https://github.com/angular/quickstart/blob/master/README.md
-->

<div class="alert is-critical">

**Аудитория:** используйте это руководство**только** в контексте   [Обновление с AngularJS](guide/upgrade "Upgrading from AngularJS to Angular") или [Обновление для повышения производительности](guide/upgrade-performance "Upgrading for Performance").
Эти руководства по обновлению см. В этом руководстве по установке для получения информации об использовании [устаревшего хранилища QuickStart GitHub](https://github.com/angular/quickstart "Deprecated Angular QuickStart GitHub repository"), которое было создано до текущего Angular [CLI](cli "CLI Overview").

**Для всех других сценариев** см. Текущие инструкции в[Настройка локальной среды и рабочего пространства](guide/setup-local "Setting up for Local Development").


</div>

<!--
The <live-example name=quickstart>QuickStart live-coding</live-example> example is an Angular _playground_.
There are also some differences from a local app, to simplify that live-coding experience.
In particular, the QuickStart live-coding example shows just the AppComponent file; it creates the equivalent of app.module.ts and main.ts internally for the playground only.
-->

В этом руководстве описывается, как разрабатывать локально на собственной машине.
Настроить новый проект на вашем компьютере можно легко и быстро с помощью [QuickStart seed на github](https://github.com/angular/quickstart "Install the github QuickStart repo").

**Предварительное :** убедитесь, что у вас есть [условие Node.js® и npm установлены](guide/setup-local#prerequisites "Angular prerequisites").


{@a clone}
{@a clone}
## Клон

Выполните шаги _clone-to-launch_ с этими командами терминала.


<code-example language="sh" class="code-shell">
  git clone https://github.com/angular/quickstart.git quickstart
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



 `npm start` в _Bash для Windows_ в версиях, предшествующих обновлению Creator (апрель 2017 г.).


</div>



{@a download}


{@a download}
## Скачать
<a href="https://github.com/angular/quickstart/archive/master.zip" title="Download the QuickStart seed repository">Загрузите семя QuickStart </a>
и распакуйте его в папку вашего проекта. Затем выполните остальные шаги с этими терминальными командами.


<code-example language="sh" class="code-shell">
  cd quickstart
  npm install
  npm start

</code-example>



<div class="alert is-important">



 `npm start` в _Bash для Windows_ в версиях, предшествующих обновлению Creator (апрель 2017 г.).


</div>



{@a non-essential}



{@a delete-non-essential-files-optional}
## Удалить _non-essential_ файлы (необязательно)

Вы можете быстро удалить _non-essential_ файлы, относящиеся к тестированию и обслуживанию QuickStart
( ***включая все связанные с git артефакты,*** такие как  `.git`  папка и  `.gitignore`  !).


<div class="alert is-important">



Делайте это только в начале, чтобы избежать случайного удаления ваших собственных тестов и настроек git!


</div>



Откройте окно терминала в папке проекта и введите следующие команды для вашей среды:

{@a os/x-bash}
### OS / X (bash)

<code-example language="sh" class="code-shell">
  xargs rm -rf &lt; non-essential-files.osx.txt
  rm src/app/*.spec*.ts
  rm non-essential-files.osx.txt

</code-example>



{@a windows}
### Окна

<code-example language="sh" class="code-shell">
  for /f %i in (non-essential-files.txt) do del %i /F /S /Q
  rd .git /s /q
  rd e2e /s /q

</code-example>



{@a seed}



{@a whats-in-the-quickstart-seed}
## Что в семени QuickStart?



**Семена QuickStart** обеспечивает базовое приложение QuickStart площадки и другие файлы, необходимое для местного развития.
Следовательно, в папке проекта на вашем компьютере много файлов
большинство из которых вы можете [узнать об этом позже](guide/file-structure).


<div class="alert is-helpful">

**Напоминание:** пример "QuickStart seed" был создан до Angular CLI, поэтому есть некоторые различия между тем, что описано здесь, и приложением Angular CLI.

</div>

{@a app-files}


Сосредоточьтесь на следующих трех TypeScript (`.ts`) файлы в**  `/src` ** папка.


<div class='filetree'>

  <div class='file'>
    ЦСИ
  </div>

  <div class='children'>

    <div class='file'>
      приложение
    </div>

    <div class='children'>

      <div class='file'>
        app.component.ts
      </div>

      <div class='file'>
        app.module.ts
      </div>

    </div>

    <div class='file'>
      main.ts
    </div>

  </div>

</div>



<code-tabs>

  <code-pane header="src/app/app.component.ts" path="setup/src/app/app.component.ts">

  </code-pane>

  <code-pane header="src/app/app.module.ts" path="setup/src/app/app.module.ts">

  </code-pane>

  <code-pane header="src/main.ts" path="setup/src/main.ts">

  </code-pane>

</code-tabs>



Все руководства и кулинарные книги содержат _как минимум эти основные файлы_.
Каждый файл имеет определенное назначение и развивается независимо по мере роста приложения.

Файлы снаружи  `src/`  обеспокоен созданием, развертыванием и тестированием вашего приложения.
Они включают в себя файлы конфигурации и внешние зависимости.

Файлы внутри  `src/`  "принадлежат" к вашему приложению.
Добавьте новые файлы Typescript, HTML и CSS внутри  `src/`  каталог, большинство из них внутри  `src/app`,
если не сказано, чтобы поступить иначе.

Следующее все в  `src/` 


<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="20%">

  </col>

  <col width="80%">

  </col>

  <tr>

    <th>
      Файл
    </th>

    <th>
      Цель
    </th>

  </tr>

  <tr>

    <td>
      <code>app/app.component.ts</code>
    </td>

    <td>


      Определяет то же самое  `AppComponent`  как тот, что на игровой площадке QuickStart.
      Это **корневой** компонент того, что станет деревом вложенных компонентов
      как приложение развивается.
    </td>

  </tr>

  <tr>

    <td>
      <code>app/app.module.ts</code>
    </td>

    <td>


      Определяет  `AppModule`, [корневой модуль](guide/bootstrapping "AppModule: the root module") который сообщает Angular, как собрать приложение.
      При первоначальном создании он объявляет только  `AppComponent`.
      Со временем вы добавляете больше компонентов для объявления.
    </td>

  </tr>

  <tr>

    <td>
      <code>main.ts</code>
    </td>

    <td>


      Компилирует приложение с помощью [JIT-компилятора](guide/glossary#jit)и
      [бутстрапы](guide/bootstrapping)
      основной модуль приложения (`AppModule`) для запуска в браузере.
      JIT-компилятор является разумным выбором при разработке большинства проектов и
      это единственный жизнеспособный выбор для образца, работающего в среде _live-coding_, такой как Stackblitz.
      альтернативные варианты [компиляция](guide/aot-compiler), [сборка](guide/build)и [развертывание](guide/deployment)Доступны.

    </td>

  </tr>

</table>


{@a appendix-develop-locally-with-ie}
## Приложение: Разработка локально с IE

Если вы развиваете Angular локально с `ng serve `, ` websocket` устанавливается автоматически между браузером и локальным сервером разработки, поэтому при изменении кода браузер может автоматически обновляться.

В Windows по умолчанию одно приложение может иметь только 6 подключений к сокету, <a href="https://msdn.microsoft.com/library/ee330736%28v=vs.85%29.aspx?f=255&MSPPError=-2147217396#websocket_maxconn" title="MSDN WebSocket settings">веб- MSDN WebSocket Settings </a>.
Таким образом, когда IE обновляется (вручную или автоматически `ng serve`), иногда WebSocket не закрывается должным образом. Когда соединения через веб-сокет превышают ограничения,  `SecurityError`  будет брошен. Эта ошибка не повлияет на Angular приложение, вы можете просто перезапустить IE, чтобы очистить эту ошибку, или изменить реестр Windows, чтобы обновить ограничения.

{@a appendix-test-using-fakeasync/async}
## Приложение: Тест с использованием  `fakeAsync()/async()` 

Если вы используете  `fakeAsync()/async()`  Вспомогательная функция для запуска модульных тестов (подробнее см. [Руководство по тестированию](guide/testing#async-test-with-fakeasync)), вам необходимо импортировать  `zone.js/dist/zone-testing`  в вашем установочном файле теста.

<div class="alert is-important">
Если вы создаете проект с  `Angular/CLI`, он уже импортирован в  `src/test.ts`.
</div>

И в более ранних версиях  `Angular`, следующие файлы были импортированы или встраиваются в HTML файл:

```
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
```

Вы все еще можете загрузить эти файлы отдельно, но порядок важен, вы должны импортировать  `proxy`  перед  `sync-test`, `async-test`, `fake-async-test`  и  `jasmine-patch`  . И вам также нужно импортировать  `sync-test`  перед  `jasmine-patch`, поэтому рекомендуется просто импортировать  `zone-testing`  вместо загрузки этих отдельных файлов.
