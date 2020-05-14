{@a angular-language-service}
# Angular Language Service

Language Service Angular предоставляет редакторы кода с путем, чтобы получить доработки, ошибку
подсказки и навигация внутри Angular шаблонов.
Он работает с внешними шаблонами в отдельных файлах HTML, а также с встроенными шаблонами.

{@a features}
## Особенности

Ваш редактор автоматически определяет, что вы открываете файл Angular.
Затем он использует Angular Language Service для чтения вашего  `tsconfig.json`  файл, найти все
шаблоны, которые есть в вашем приложении, а затем предоставляют языковые услуги для любых шаблонов, которые вы открываете.

Услуги Язык включают:

* Завершение списков
* AOT Диагностические сообщения
* Краткая информация
* Перейти к определению


{@a autocompletion}
### Автозаполнение

Автозаполнение может ускорить ваше время разработки, предоставляя вам
контекстные возможности и подсказки при вводе.
Этот пример показывает автозаполнение в интерполяции. По мере ввода его,
Вы можете нажать Tab, чтобы завершить.

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-completion.gif" alt="autocompletion">
</div>

Есть также дополнения в элементах. Любые элементы, которые вы используете в качестве селектора компонентов, будут
показать в списке завершения.

{@a error-checking}
### Проверка ошибок

Служба Angular Language Service может предупредить вас об ошибках в вашем коде.
В этом примере Angular не знает, что  `orders`  есть или откуда это приходит.

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-error.gif" alt="error checking">
</div>

{@a quick-info-and-navigation}
### Быстрая информация и навигация

Функция быстрой информации позволяет вам видеть, откуда берутся компоненты, директивы, модули и т. Д.
Затем вы можете нажать «Перейти к определению» или нажать F12, чтобы перейти непосредственно к определению.

<div class="lightbox">
  <img src="generated/images/guide/language-service/language-navigation.gif" alt="navigation">
</div>


{@a angular-language-service-in-your-editor}
## Angular Language Service в вашем редакторе

Angular Лингвистическая служба в настоящее время доступна в качестве расширения для [визуального кодекса студии](https://code.visualstudio.com/),
[WebStorm](https://www.jetbrains.com/webstorm)и [возвышенный текст](https://www.sublimetext.com/).

{@a visual-studio-code}
### Visual Studio Code

В [Visual Studio Code](https://code.visualstudio.com/)установите расширение из [Расширения: Торговая площадка](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template). Вы можете открыть торговую площадку из редактора с помощью значка «Расширения» на левой панели меню или использовать VS Quick Open (⌘ + P для Mac, CTRL + P в Windows) и ввести «? Ext».

На торговой площадке найдите расширение Angular Language Service и нажмите кнопку « **Установить»**.

{@a webstorm}
### WebStorm

В [WebStorm](https://www.jetbrains.com/webstorm/), вы должны установить пакет языкового сервиса как зависимость проекта.

1. Добавьте следующее к вашему  `devDependencies`  в вашем проекте  `package.json` 

<code-example language="json" header="package.json">
devDependencies {
  "@angular/language-service": "^6.0.0"
}
</code-example>

2. В окне терминала в корне вашего проекта установите  `devDependencies`  с  `npm`  или  `yarn`  :

```sh
npm install
```
*ИЛИ*

```sh
yarn
```

*ИЛИ*

```sh
yarn install
```

Когда Angular видит эту зависимость dev, он предоставляет языковую службу в среде WebStorm.
Затем WebStorm предоставляет вам раскрашивание внутри шаблона и автозаполнение в дополнение к Angular Language Service.


{@a sublime-text}
### Sublime Text

В [Sublime Text](https://www.sublimetext.com/) языковая служба поддерживает только встроенные шаблоны при установке в качестве плагина.
Вам нужен собственный подключаемый модуль Sublime (или модификации текущего подключаемого модуля) для дополнений в файлах HTML.

Чтобы использовать языковую службу для встроенных шаблонов, сначала необходимо добавить расширение, разрешающее использование TypeScript, а затем установить плагин Angular Language Service. Начиная с TypeScript 2.3, в TypeScript есть модель подключаемого модуля, которую может использовать языковая служба.

1. Установите последнюю версию TypeScript в локальном  `node_modules`  каталог:

```sh
npm install --save-dev typescript
```

2. Установите пакет Angular Language Service в том же месте:

```sh
npm install --save-dev @angular/language-service
```

3. После установки пакета добавьте следующее в  `"compilerOptions"`  раздел вашего проекта  `tsconfig.json`.

<code-example language="json" header="tsconfig.json">
  "plugins": [
      {"name": "@angular/language-service"}
  ]
</code-example>

4. В пользовательских настройках вашего редактора (`Cmd+,`  или  `Ctrl+,`), добавить следующее:

<code-example language="json" header="Sublime Text user preferences">
"typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"
</code-example>

Это позволяет Angular Language Service предоставлять диагностику и дополнения в  `.ts`  файлы.




{@a how-the-language-service-works}
## Как работает языковая служба

Когда вы используете редактор с языковой службой, редактор запускает отдельный процесс языковой службы
и связывается с ним через [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), используя [Language Server Protocol](https://microsoft.github.io/language-server-protocol/).
Когда вы печатаете в редакторе, редактор отправляет информацию процессу языковой службы в
отслеживать состояние вашего проекта.

Когда вы запускаете список завершения в шаблоне, редактор сначала анализирует шаблон в
HTML [абстрактное синтаксическое дерево (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).
Компилятор Angular интерпретирует это дерево для определения контекста: в какой модуль входит шаблон, текущую область действия, селектор компонента и где находится курсор в шаблоне AST. Затем он может определить символы, которые потенциально могли бы быть в таком положении ..

Это немного сложнее, если вы находитесь в интерполяции.
Если у вас есть интерполяция  `{{data.---}}`  внутри  `div`  и нужен список завершения после  `data.---`, компилятор не может использовать HTML AST, чтобы найти ответ.
HTML AST может только сказать компилятору, что есть какой-то текст с символами "  `{{data.---}}`  ».
Вот когда шаблон анализатор производит выражение AST, которая постоянно находится в пределах шаблона AST.
Угловое Language Services затем смотрит на  `data.---`  в своем контексте, спрашивает службу языка TypeScript, что члены  `data`  есть, и возвращает список возможностей.

<hr>

{@a more-information}
## Более подробная информация

* Для получения более подробной информации о реализации см
[Angular Language Service API](https://github.com/angular/angular/blob/master/packages/language-service/src/types.ts).

* Подробнее о конструктивных соображениях и намерениях см. [Документация по проектированию здесь](https://github.com/angular/vscode-ng-language-service/wiki/Design).

* См. Также [презентация Чака Джаздзевски Англоязычной](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)об службе с [ng-conf](https://www.ng-conf.org/)2017 года
