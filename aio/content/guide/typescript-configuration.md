{@a typescript-configuration}
{@a typescript-configuration}
# Конфигурация TypeScript

TypeScript является основным языком для разработки приложений Angular.
Это расширенный набор JavaScript с поддержкой времени разработки для обеспечения безопасности типов и инструментов.

Браузеры не могут выполнять TypeScript напрямую.
Typescript должен быть «перенесен» в JavaScript с *помощью tsc* компилятора, что требует некоторой настройки.

На этой странице рассматриваются некоторые аспекты конфигурации TypeScript и среды TypeScript
которые имеют важное значение для Angular разработчиков, включая информацию о следующих файлах:

* [tsconfig.json](guide/typescript-configuration#tsconfig)—Конфигурация компилятора TypeScript.
* [typings](guide/typescript-configuration#typings)файлы объявлений TypesScript.


{@a tsconfig}

{@a typescript-configuration}
{@a typescript-configuration}
## Конфигурация TypeScript

Файл конфигурации TypeScript называется `tsconfig.json` направляет компилятор, поскольку он генерирует файлы JavaScript для проекта.
Этот файл содержит параметры и флаги, которые необходимы для приложений Angular.
Как правило, файл находится на [корневой уровень рабочей области](guide/file-structure).

<div class="alert is-helpful">

Подробнее о `tsconfig.json`, смотрите официальный
[TypeScript вики](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

</div>

Начальный `tsconfig.json` для приложения Angular обычно выглядит следующим образом.

<code-example lang="json" header="tsconfig.json" linenums="false">
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "module": "esnext",
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "es2015",
    "typeRoots": [
      "node_modules/@types"
    ],
    "lib": [
      "es2018",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "fullTemplateTypeCheck": true,
    "strictInjectionParameters": true
  }
}
</code-example>


{@a noImplicitAny}


{@a *noimplicitany*-and-*suppressimplicitanyindexerrors*}
{@a *noimplicitany*-and-*suppressimplicitanyindexerrors*}
### *noImplicitAny* и *suppressImplicitAnyIndexErrors*

Разработчики TypeScript не согласны с тем, `noImplicitAny` флаг должен быть `true` или `false`.
Там нет правильного ответа, и вы можете изменить флаг позже.
Но ваш выбор теперь может иметь значение в более крупных проектах, поэтому он заслуживает обсуждения.

Когда `noImplicitAny` флаг `false` (по умолчанию), и если
компилятор не может определить тип переменной в зависимости от того, как он используется
компилятор по умолчанию устанавливает тип `any` . Вот что подразумевается под *неявным `any`*.

Когда `noImplicitAny` флаг `true` и компилятор TypeScript не может вывести
типа, он все еще генерирует файлы JavaScript, но также **сообщает об ошибке**.
Многие опытные разработчики предпочитают эту более строгую настройку, потому что проверка типов ловит больше
непреднамеренные ошибки во время компиляции.

Вы можете установить тип переменной `any` даже когда `noImplicitAny` флаг `true`.

Когда `noImplicitAny` флаг `true`, вы также можете получить *неявные ошибки индекса*.
Большинство разработчиков считают, что *эта ошибка* скорее раздражает, чем помогает.
Вы можете подавить их со следующим дополнительным флагом:

<code-example>

  "suppressImplicitAnyIndexErrors": true

</code-example>

<div class="alert is-helpful">

Для получения дополнительной информации о том, как конфигурация TypeScript влияет на компиляцию, см. [Параметры Angular компилятора](guide/angular-compiler-options)и [Проверка типа шаблона](guide/template-typecheck).

</div>

{@a typings}

{@a typescript-typings}
{@a typescript-typings}
## Машинопись

Многие библиотеки JavaScript, такие как JQuery, библиотека тестирования жасмина, и угловатые,
расширить среду JavaScript с помощью функций и синтаксиса
что компилятор TypeScript не распознает изначально.
Когда компилятор не распознает что-либо, он выдает ошибку.

Использовать [файлы определения типа TypeScript](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html)- `d.ts files` - чтобы сообщить компилятору о загружаемых вами библиотеках.

Редакторы, поддерживающие TypeScript, используют эти же файлы определений для отображения информации о типах функций библиотеки.

Многие библиотеки включают файлы определений в свои пакеты npm, где есть и компилятор TypeScript, и редакторы
могу их найти. Angular - одна из таких библиотек.
 `node_modules/@angular/core/` любого приложения Angular содержит несколько `d.ts` файлы, которые описывают части Angular.

<div class="alert is-helpful">

Вам не нужно ничего делать, чтобы получить *наборов* файлы для библиотечных пакетов, которые включают `d.ts` файлы.
Angular пакеты уже включают их.

</div>

{@a lib.d.ts}
{@a lib.d.ts}
### lib.d.ts

TypeScript включает в себя специальный файл декларации под названием `lib.d.ts` . Этот файл содержит объявления окружения для различных общих конструкций JavaScript, присутствующих во время выполнения JavaScript и DOM.

На основе `--target`, TypeScript добавляет _дополнительные_ окружающие объявления
лайк `Promise` если цель `es6`.

По умолчанию целью является `es2015` . Если вы нацеливаетесь `es5`, у вас еще есть новые объявления типа из - за список файлов декларации включено:

<code-example path="getting-started/tsconfig.0.json" header="tsconfig.json (lib excerpt)" region="lib"></code-example>

{@a installable-typings-files}
{@a installable-typings-files}
### Устанавливаемые наборы файлов

Многие библиотеки, среди которых jQuery, Jasmine и Lodash, *не* включают `d.ts` файлы в их пакетах npm.
К счастью, либо их авторы, либо участники сообщества создали отдельные `d.ts` файлы для этих библиотек и
опубликовал их в известных местах.

Вы можете установить эти наборы через `npm` с помощью
[ `@ types / *` пакет с областью действия](http://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)
и Typescript, начиная с 2.0, автоматически распознает их.

Например, чтобы установить наборы для `jasmine` ты бежишь `npm install @types/jasmine --save-dev`.


{@a target}


{@a *target*}
{@a *target*}
### *цель*

По умолчанию целью является `es2015`, который поддерживается только в современных браузерах. Вы можете настроить цель на `es5` специально поддерживать устаревшие браузеры. [Дифференциальная загрузка](guide/deployment#differential-loading)также предоставляется Angular CLI для поддержки современных и устаревших браузеров с отдельными комплектами.
