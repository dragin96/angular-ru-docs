{@a frequently-used-modules}
# Часто используемые модули

Для приложения Angular требуется как минимум один модуль, который служит корневым модулем.
Добавляя функции в свое приложение, вы можете добавлять их в модули.
Ниже приведены часто используемые Angular модули с примерами
некоторые из вещей, которые они содержат:


<table>

 <tr>
   <th style="vertical-align: top">
     NgModule
   </th>

   <th style="vertical-align: top">
     Импортируйте это из
   </th>

   <th style="vertical-align: top">
     Почему вы используете это
   </th>
 </tr>

 <tr>
   <td><code>BrowserModule</code></td>
   <td><code>@angular/platform-browser</code></td>
   <td>Когда вы хотите запустить свое приложение в браузере</td>
 </tr>

 <tr>
   <td><code>CommonModule</code></td>
   <td><code>@angular/common</code></td>
   <td>Если вы хотите использовать <code>NgIf</code>, <code>NgFor</code></td>
 </tr>

 <tr>
   <td><code>FormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>Когда вы хотите создать шаблон управляемых форм (включает в себя <code>NgModel</code>) </td>
 </tr>

 <tr>
   <td><code>ReactiveFormsModule</code></td>
   <td><code>@angular/forms</code></td>
   <td>Когда вы хотите построить реактивные формы </td>
 </tr>

 <tr>
   <td><code>RouterModule</code></td>
   <td><code>@angular/router</code></td>
   <td>Если вы хотите использовать <code>RouterLink</code>, <code>.forRoot()</code>и <code>.forChild()</code></td>
 </tr>

 <tr>
   <td><code>HttpClientModule</code></td>
   <td><code>@angular/common/http</code></td>
   <td>Когда вы хотите поговорить с сервером </td>
 </tr>

</table>

{@a importing-modules}
## Импорт модулей

Когда вы используете эти Angular модули, импортируйте их в `AppModule`,
или свой функциональный модуль в зависимости от ситуации, и перечислите их в `@NgModule` 
 `imports` массив. Например, в основном приложении, порожденного [Angular CLI](cli),
 `BrowserModule` - это первый импорт в верхней части `AppModule`,
 `app.module.ts`.


```typescript
/* import modules so that AppModule can access them*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ /* add modules here so Angular knows to use them*/
    BrowserModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Импорт в верхней части массива - это операторы импорта JavaScript
в то время как `imports` массив в `@NgModule` является специфическим для Angular.
Для получения дополнительной информации о разнице, см. [Модули JavaScript против NgModules](guide/ngmodule-vs-jsmodule).


{@a browsermodule-and-commonmodule}
## `BrowserModule ` и ` CommonModule` 

 `BrowserModule` Импорт `CommonModule`, который вносит много общего
директивы, такие как `ngIf` и `ngFor` . Дополнительно, `BrowserModule` 
реэкспорт `CommonModule` делает все его директивы доступными
к любому модулю, который импортирует `BrowserModule`.

Для приложений, работающих в браузере, импортируйте `BrowserModule` в
корень `AppModule` потому что он предоставляет услуги, которые необходимы
запустить и запустить приложение браузера. `BrowserModule` провайдеры «s
для всего приложения, поэтому оно должно быть только в корневом модуле
не в функциональных модулях. Функциональные модули нужны только общие
директивы в `CommonModule` ; им не нужно переустанавливать поставщиков всего приложения.

Если вы делаете импорт `BrowserModule` в лениво загруженный функциональный модуль
Angular возвращает ошибку, указывающую на использование `CommonModule` вместо.

<div class="lightbox">
  <img src="generated/images/guide/frequent-ngmodules/browser-module-error.gif" width=750 alt="BrowserModule error">
</div>

<hr />


{@a more-on-ngmodules}
## Больше на NgModules

Вы также можете быть заинтересованы в следующих ситуациях :
* [Самозагрузка](guide/bootstrapping).
* [NgModules](guide/ngmodules).
* [Против NgModules JavaScript модулей](guide/ngmodule-vs-jsmodule).
