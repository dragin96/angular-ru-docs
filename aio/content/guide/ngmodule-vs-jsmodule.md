{@a javascript-modules-vs.-ngmodules}
# Модули JavaScript против NgModules

JavaScript и Angular используют модули для организации кода и
хотя они организовывают это по-разному, приложения Angular полагаются на оба.


{@a javascript-modules}
## Модули JavaScript

В JavaScript модули представляют собой отдельные файлы с кодом JavaScript в них. Для того, чтобы сделать то, что в них имеется, вы пишете заявление на экспорт, как правило, после соответствующего кода, например:

```typescript
export class AppComponent { ... }
```

Затем, когда вам нужно код этого файла в другой файл, импортировать его как это:

```typescript
import { AppComponent } from './app.component';
```

Модули JavaScript помогают вам пространство имен, предотвращая случайные глобальные переменные.

Для получения дополнительной информации о модулях JavaScript см. [Модули JavaScript / ECMAScript](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/).

{@a ngmodules}
## NgModules

<!-- KW-- perMisko: let's discuss. This does not answer the question why it is different. Also, last sentence is confusing.-->
NgModules - классы, украшенные `@NgModule` . `@NgModule ` декоратор ` imports` массив говорит, что другие Angular NgModules текущие потребности модуля. Модули в `imports` Массив отличается от модулей JavaScript, потому что они являются модулями NgModules, а не обычными модулями JavaScript. Классы с `@NgModule` Декоратор хранится в своих собственных файлах, но что делает их `NgModule` не находится в своем собственном файле, как модули JavaScript; это присутствие `@NgModule` и его метаданные.

 `AppModule` генерируется из [Angular CLI](cli)демонстрирует оба вида модулей в действии:

```typescript
/* These are JavaScript import statements. Angular doesn’t know anything about these.*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

/* The @NgModule decorator lets Angular know that this is an NgModule.*/
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ /* These are NgModule imports.*/
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```


В NgModule классов отличаются от модуля JavaScript в следующих ключевых направлениях:

* Только границы NgModule [объявляемые классы](guide/ngmodule-faq#q-declarable).
Объявления являются единственными классами, которые имеют значение для [Angular компилятор](guide/ngmodule-faq#q-angular-compiler).
* Вместо того, чтобы определить все классы членов в один гигантский файл, как в модуле JavaScript,
вы перечисляете классы модуля в `@NgModule.declarations` list.
* NgModule может экспортировать только [декларируемые классы](guide/ngmodule-faq#q-declarable)
он владеет или импортирует из других модулей. Он не объявляет и не экспортирует другие виды классов.
* В отличие от модулей JavaScript, NgModule может расширять приложение _entire_ сервисами
добавив провайдеров в `@NgModule.providers` list.

<hr />

{@a more-on-ngmodules}
## Больше на NgModules

Для получения дополнительной информации о NgModules, см
* [Самозагрузка](guide/bootstrapping).
* [Часто используемые модули](guide/frequent-ngmodules).
* [Провайдеры](guide/providers).
