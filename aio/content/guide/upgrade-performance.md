{@a upgrading-for-performance}
# Обновление для производительности

<div class="alert is-helpful">

  _Angular_ это имя для Angular сегодня и завтра. <br />
  _AngularJS_ - имя для всех 1.x версий Angular.

</div>

В этом руководстве описаны некоторые встроенные инструменты для эффективной миграции проектов AngularJS в
Angular платформа, по одной штуке за раз. Это очень похоже на
[Обновление от AngularJS](guide/upgrade)за исключением того, что этот использует {@link
downgradeModule вспомогательная функция downgradeModule ()} вместо {@link UpgradeModule
UpgradeModule}учебный класс. Это влияет на загрузку приложения и обнаружение изменений
распространяется между двумя рамками. Это позволяет вам обновляться постепенно, улучшая
скорость ваших гибридных приложений и использование новейших приложений Angular в AngularJS в начале
процесс модернизации.



{@a preparation}
## Подготовка

Прежде чем обсуждать, как вы можете использовать `downgradeModule()` для создания гибридных приложений, есть вещи, которые
Вы можете упростить процесс обновления даже до того, как начнете обновление. Потому что шаги
То же самое независимо от того, как вы обновляете, обратитесь к [Подготовка](guide/upgrade#preparation)разделу
[Обновление от AngularJS](guide/upgrade).


{@a upgrading-with-ngupgrade}
## Обновление с `ngUpgrade` 

С `ngUpgrade` библиотеке на Angular вы можете постепенно обновлять существующее приложение AngularJS
создание гибридного приложения, в котором вы можете запускать обе платформы параллельно. В этих гибридных приложениях вы можете
смешивать и сочетать компоненты и сервисы AngularJS и Angular и обеспечивать их бесперебойную работу.
Это означает, что вам не нужно выполнять работу по обновлению сразу, поскольку существует естественное сосуществование
между двумя рамками в течение переходного периода.


{@a how-ngupgrade-works}
### Как `ngUpgrade` Works

Независимо от того, выберете ли вы `downgradeModule()` или `UpgradeModule`, основные принципы
обновление, ментальная модель гибридных приложений и то, как вы используете {@link upgrade/static
upgrade/static} коммунальные услуги остаются прежними. Для получения дополнительной информации см
[Как `ngUpgrade` Works](guide/upgrade#how-ngupgrade-works)раздел
[Обновление от AngularJS](guide/upgrade).

<div class="alert is-helpful">

[Change Detection](guide/upgrade#change-detection)сечение
  [Обновление с AngularJS](guide/upgrade)применяется только к приложениям, которые используют `UpgradeModule` . Хотя
  вы обнаруживаете изменения по-разному с `downgradeModule()`, который находится в центре этого
  Руководство, чтение [Обнаружение изменений](guide/upgrade#change-detection)раздела предоставляет полезную информацию
  контекст для того, что следует.

</div>


{@a change-detection-with-downgrademodule}
#### Обнаружение изменений с `downgradeModule()` 

Как упоминалось ранее, одно из ключевых различий между `downgradeModule()` и `UpgradeModule` имеет
делать с обнаружением изменений и как оно распространяется между двумя структурами.

С `UpgradeModule`, две системы обнаружения изменений более тесно связаны между собой. Всякий раз, когда
что-то происходит в части приложения AngularJS, автоматически включается обнаружение изменений
Angular часть и наоборот. Это удобно, так как гарантирует, что ни одна структура не пропустит
важное изменение. Однако в большинстве случаев эти дополнительные прогоны обнаружения изменений не нужны.

 `downgradeModule()`, с другой стороны, избегает явного запуска обнаружения изменений, если это не так
знает, что другая часть приложения заинтересована в изменениях. Например, если понижен компонент
определяет `@Input()`, скорее всего, приложение должно знать об изменении этого значения. Таким образом,
 `downgradeComponent()` автоматически запускает обнаружение изменений в этом компоненте.

Однако в большинстве случаев изменения, вносимые локально в конкретный компонент, не представляют интереса для
Остальная часть приложения. Например, если пользователь нажимает кнопку, которая отправляет форму, компонент обычно
обрабатывает результат этого действия. При этом есть _are_ случаи, когда вы хотите размножаться
изменения в другой части приложения, которая может контролироваться другой структурой. В таких случаях
Вы несете ответственность за уведомление заинтересованных сторон путем ручного запуска обнаружения изменений.

Если вы хотите определенный кусок кода для обнаружения изменений триггера в AngularJS части приложения,
Вы должны обернуть это
[scope. $ apply ()](https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$apply). Точно так же для
запуск обнаружения изменений в Angular, который вы бы использовали {@link NgZone#run ngZone.run()}.

Во многих случаях несколько дополнительных прогонов обнаружения изменений могут не иметь большого значения. Однако по большому или
тяжелые приложения для обнаружения изменений могут оказать заметное влияние. Давая вам более мелкозернистый
контроль за распространением обнаружения изменений, `downgradeModule()` позволяет добиться большего
производительность для ваших гибридных приложений.


{@a using-downgrademodule}
## С помощью `downgradeModule()` 

И AngularJS, и Angular имеют собственную концепцию модулей, помогающую объединить приложение в единое целое
блоки функциональности.

Их детали сильно отличаются по архитектуре и реализации. В AngularJS вы создаете
модуль, указав его имя и зависимости с
[angular.module ()](https://docs.angularjs.org/api/ng/function/angular.module). Тогда вы можете добавить
активы, используя различные методы. В Angular вы создаете класс, украшенный символом {@link NgModule
NgModule}декоратор, который описывает активы в метаданных.

В гибридном приложении вы запускаете обе платформы одновременно. Это означает, что вам нужен хотя бы один
модуль каждый из обоих AngularJS и Angular.

По большей части вы указываете модули так же, как для обычного приложения. Тогда ты
использовать `upgrade/static` помощники чтобы сообщить двум фреймворкам об активах, которые они могут использовать из каждого
Другой. Это известно как «обновление» и «понижение».

<div class="alert is-helpful">

  <b>Определения: </b>

  - _Upgrading_: действие по обеспечению доступности ресурса AngularJS, такого как компонент или служба, для
    Angular часть приложения.
  - _Downgrading_: Активизация доступа к активу Angular, такому как компонент или услуга
    AngularJS часть приложения.

</div>

Важной частью взаимосвязанных зависимостей является соединение двух основных модулей вместе. Это
где `downgradeModule()` Входит . Используйте его для создания модуля AngularJS, который вы можете использовать
в качестве зависимости в вашем основном модуле AngularJS, которая загрузит ваш основной модуль Angular и
начать Angular часть гибридного приложения. В некотором смысле это «понижает» Angular модуль до
Модуль AngularJS.

Есть несколько вещей, чтобы отметить, однако:

1. Вы не передаете Angular модуль напрямую `downgradeModule()` . Все `downgradeModule()` необходимо
   это «рецепт», например, фабричная функция, чтобы создать экземпляр для вашего модуля.

2. Модуль Angular не создается, пока приложение действительно не нуждается в нем.

Ниже приведен пример того, как вы можете использовать `downgradeModule()` чтобы связать два модуля.

```ts
// Import `downgradeModule()`.
import { downgradeModule } from '@angular/upgrade/static';

// Use it to downgrade the Angular module to an AngularJS module.
const downgradedModule = downgradeModule(MainAngularModuleFactory);

// Use the downgraded module as a dependency to the main AngularJS module.
angular.module('mainAngularJsModule', [
  downgradedModule
]);
```


{@a specifying-a-factory-for-the-angular-module}
#### Указание фабрики для Angular модуля

Как упоминалось ранее, `downgradeModule()` должен знать, как создать экземпляр модуля Angular. Это
нужен рецепт. Вы определяете этот рецепт, предоставляя фабричную функцию, которая может создать экземпляр
Angular модуль. `downgradeModule()` принимает два типа фабричных функций:

1. `NgModuleFactory` 
2. `(extraProviders: StaticProvider[]) => Promise<NgModuleRef>` 

Когда вы передаете `NgModuleFactory`, `downgradeModule()` использует его для создания экземпляра модуля с помощью
{@link platformBrowser platformBrowser}х {@link PlatformRef#bootstrapModuleFactory
bootstrapModuleFactory()}, который совместим с опережающей (AOT) компиляцией. AOT сборник
помогает быстрее загружать ваши приложения. Подробнее о AOT и о том, как создать `NgModuleFactory`, см
[Ahead-о-компиляция](guide/aot-compiler)руководство.

Кроме того, вы можете передать простую функцию, которая, как ожидается, вернет обещание, разрешающее в
{@link NgModuleRef NgModuleRef}(т.е. экземпляр вашего Angular модуля). Функция называется
с массивом дополнительных, {@link StaticProvider Providers}которые, как ожидается, будут доступны на
возвращенный `NgModuleRef` «s {@link Injector Injector}. Например, если вы используете {@link
platformBrowser platformBrowser} или {@link platformBrowserDynamic platformBrowserDynamic}, вы можете
пройти `extraProviders` массив к ним:

```ts
const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(MainAngularModule);
};
// or
const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowser(extraProviders);
  return platformRef.bootstrapModuleFactory(MainAngularModuleFactory);
};
```

Используя `NgModuleFactory` требует меньшего количества шаблонов и является хорошим вариантом по умолчанию, поскольку он поддерживает AOT
вне коробки. Использование пользовательской функции требует немного больше кода, но дает вам больше
гибкость.


{@a instantiating-the-angular-module-on-demand}
#### Создание Angular модуля по запросу

Еще одно ключевое отличие между `downgradeModule()` и `UpgradeModule` - это то, что требуется последнему
Вы должны создать экземпляры модулей AngularJS и Angular заранее. Это означает, что вы должны заплатить
стоимость создания Angular-части приложения, даже если вы не используете какие-либо ресурсы Angular
пока позже `downgradeModule()` снова менее агрессивен. Это будет только создавать экземпляр Angular части
когда это требуется в первый раз; то есть, как только нужно создать пониженную версию
составная часть.

Вы можете пойти дальше и даже не загружать код для Angular части приложения в
браузер пользователя, пока он не понадобится. Это особенно полезно, когда вы используете Angular на части
гибридное приложение, которое не требуется для первоначального рендеринга или недоступно пользователю.


Несколько примеров:

- Вы используете Angular только на определенных маршрутах, и он вам не нужен, пока / или пользователь не посетит такой маршрут.
- Вы используете Angular для функций, которые видны только определенным типам пользователей; например
  вошедшие в систему пользователи, администраторы или VIP-члены. Вам не нужно загружать Angular, пока не появится пользователь
  проверку подлинности.
- Вы используете Angular для функции, которая не является критичной для начального рендеринга приложения и вас
  может позволить себе небольшую задержку в пользу лучшей производительности начальной нагрузки.


{@a bootstrapping-with-downgrademodule}
### Начальная загрузка с `downgradeModule()` 

Как вы уже догадались, вам не нужно ничего менять в том, как вы загружаете свое существующее
AngularJS приложение. в отличие `UpgradeModule` который требует дополнительных шагов
 `downgradeModule()` может позаботиться о начальной загрузке модуля Angular, если вы его предоставите
рецепт.

Для того, чтобы начать использовать любой `upgrade/static` API, вам все равно нужно загрузить Angular Framework как
вы бы в нормальном приложении Angular. Вы можете увидеть, как это можно сделать с помощью SystemJS, следуя инструкциям
инструкции в [Upgrade Setup](guide/upgrade-setup "Setup for Upgrading from AngularJS") руководстве, выборочно копируя код из
[QuickStart Github хранилище](https://github.com/angular/quickstart).

Вам также необходимо установить `@angular/upgrade` пакет через `npm install @angular/upgrade --save` 
и добавьте отображение для `@angular/upgrade/static` пакет:

<code-example header="system.config.js">
'@angular/upgrade/static': 'npm:@angular/upgrade/bundles/upgrade-static.umd.js',
</code-example>

Затем создайте `app.module.ts` файл и добавьте следующее `NgModule` класс:

<code-example header="app.module.ts">
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule
  ]
})
export class MainAngularModule {
  // Empty placeholder method to satisfy the `Compiler`.
  ngDoBootstrap() {}
}
</code-example>

Это минимум `NgModule` Импорт `BrowserModule`, модуль каждого Angular-браузера
должны быть. Он также определяет пустой `ngDoBootstrap()`, чтобы предотвратить {@link Compiler
Compiler}от возврата ошибок. Это необходимо, потому что модуль не будет иметь `bootstrap` 
декларация о `NgModule` декоратор.

<div class="alert is-important">

  Вы не добавляете `bootstrap` декларация к `NgModule` Декоратор поскольку AngularJS владеет
  шаблон приложения и `ngUpgrade` необходимые компоненты.

</div>

Теперь вы можете связать AngularJS и Angular модули вместе, используя `downgradeModule()`.

<code-example header="app.module.ts">
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { downgradeModule } from '@angular/upgrade/static';

const bootstrapFn = (extraProviders: StaticProvider[]) => {
  const platformRef = platformBrowserDynamic(extraProviders);
  return platformRef.bootstrapModule(MainAngularModule);
};
const downgradedModule = downgradeModule(bootstrapFn);

angular.module('mainAngularJsModule', [
  downgradedModule
]);
</code-example>

Существующий код AngularJS работает как и прежде, и вы готовы начать добавление кода Angular.


{@a using-components-and-injectables}
### Использование компонентов и инъекций

Различия между `downgradeModule()` и `UpgradeModule` заканчивается здесь. Остальным
 `upgrade/static` API и концепции работают одинаково для обоих типов гибридных приложений.
Смотрите [Обновление с AngularJS](guide/upgrade)чтобы узнать о:

- [Использование Angular компонентов из кода AngularJS](guide/upgrade#using-angular-components-from-angularjs-code). <br />
  _ПРИМЕЧАНИЕ. Если вы понижаете класс нескольких модулей, вам нужно указать имя пониженного уровня
  модуль, к которому принадлежит каждый компонент, при вызове `downgradeComponent()` ._
- [Использование директив AngularJS от Angular Code](guide/upgrade#using-angularjs-component-directives-from-angular-code).
- [Проецирование AngularJS содержания в Angular компоненты](guide/upgrade#projecting-angularjs-content-into-angular-components).
- [Transcluding Angular Содержание в AngularJS компонентов директив](guide/upgrade#transcluding-angular-content-into-angularjs-component-directives).
- [Изготовление AngularJS зависимости Инъекционного к угловому](guide/upgrade#making-angularjs-dependencies-injectable-to-angular).
- [Изготовление Angular зависимости Инъекционного к AngularJS](guide/upgrade#making-angular-dependencies-injectable-to-angularjs). <br />
  _ПРИМЕЧАНИЕ. Если вы понижаете класс нескольких модулей, вам нужно указать имя пониженного уровня
  модуль, которому принадлежит каждый инъекционный, при вызове `downgradeInjectable()` ._

<div class="alert is-important">

  В то время как возможно понизить инъекционные препараты, понизившиеся инъецируемые не будут доступны до
  Angular модуль, который обеспечивает их, создается. Для того, чтобы быть в безопасности, вы должны убедиться
  что пониженные инъекционные препараты нигде не используются _outside_ часть приложения, где он находится
  гарантировано, что их модуль был создан.

  Например, _OK_ использовать устаревшую службу в обновленном компоненте, который используется только
  от пониженного Angular компонента, предоставленного тем же Angular модулем, что и инъецируемый, но это
  _не разрешено_ использовать его в компоненте AngularJS, который может использоваться независимо от Angular или использования
  это в пониженном угловом компоненте из другого модуля.

</div>


{@a using-ahead-of-time-compilation-with-hybrid-apps}
## Использование своевременной компиляции с гибридными приложениями

Вы можете воспользоваться преимуществом предварительной компиляции (AOT) в гибридных приложениях, как и в любых других
Angular приложение. Настройка гибридного приложения в основном такая же, как описано в
[Опережает время компиляции](guide/aot-compiler)руководство за исключением различий в `index.html` и
 `main-aot.ts`.

AOT необходимо загрузить любые файлы AngularJS, которые находятся в `<script>` теги в AngularJS `index.html`.
Простой способ скопировать их - добавить `copy-dist-files.js` файл.

Вам также нужно передать сгенерированный `MainAngularModuleFactory` to `downgradeModule()` вместо
Пользовательская функция начальной загрузки:

<code-example header="app/main-aot.ts">
import { downgradeModule } from '@angular/upgrade/static';
import { MainAngularModuleNgFactory } from '../aot/app/app.module.ngfactory';

const downgradedModule = downgradeModule(MainAngularModuleNgFactory);

angular.module('mainAngularJsModule', [
  downgradedModule
]);
</code-example>

И это все, что вам нужно сделать, чтобы получить все преимущества AOT для гибридных приложений Angular.


{@a conclusion}
## Заключение

На этой странице рассказано, как использовать {@link upgrade/static upgrade/static}пакет для приращения
обновите существующие приложения AngularJS в своем собственном темпе и не препятствуйте дальнейшему развитию приложения
на время процесса обновления.

В частности, это руководство показало, как можно добиться лучшей производительности и большей гибкости в работе
ваши гибридные приложения, используя {@link downgradeModule downgradeModule()}вместо {@link UpgradeModule
UpgradeModule},

Подводя итог, основные дифференцирующие факторы `downgradeModule()` являются:

1. Это позволяет создавать или даже загружать Angular часть лениво, что улучшает начальную
   время загрузки. В некоторых случаях это может полностью снизить стоимость запуска второго фреймворка.
2. Улучшает производительность, избегая ненужных прогонов обнаружения изменений при предоставлении разработчику
   больше возможностей для настройки.
3. Вам не нужно менять способ загрузки приложения AngularJS.

С помощью `downgradeModule()` - хороший вариант для гибридных приложений, когда вы хотите сохранить AngularJS и
Angular части менее сцеплены. Вы все еще можете смешивать и сочетать компоненты и услуги из обоих
фреймворки, но вам может потребоваться распространять обнаружение изменений вручную. Взамен
 `downgradeModule()` предлагает больше контроля и лучшую производительность.
