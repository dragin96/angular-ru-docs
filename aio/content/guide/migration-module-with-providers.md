{@a modulewithproviders-migration}
# `ModuleWithProviders` Миграция

{@a what-does-this-schematic-do}
## Что делает эта схема?


Некоторые Angular библиотеки, такие как `@angular/router` и `@ngrx/store`, реализуйте API, которые возвращают тип с именем `ModuleWithProviders` (обычно через метод с именем `forRoot()` ).
Этот тип представляет `NgModule` вместе с дополнительными провайдерами.
Angular версия 9 не одобряет использование `ModuleWithProviders` без явно универсального типа, где универсальный тип ссылается на тип `NgModule`.

Эта схема добавит универсальный тип к любому `ModuleWithProviders`, в которых отсутствует универсальный.
В приведенном ниже примере тип `NgModule` это `SomeModule`, поэтому схема меняет тип на `ModuleWithProviders<SomeModule>`.


**До**
```ts

@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config}
      ]
    };
  }
}

```

**После**

```ts
@NgModule({...})
export class MyModule {
  static forRoot(config: SomeConfig): ModuleWithProviders<SomeModule> {
    return {
      ngModule: SomeModule,
      providers: [
        {provide: SomeConfig, useValue: config }
      ]
    };
  }
}
```

В редком случае, когда схема не может определить тип `ModuleWithProviders`, вы можете увидеть схему печати комментария TODO для обновления кода вручную.


{@a why-is-this-migration-necessary}
## Почему эта миграция необходима?

 `ModuleWithProviders` с версии Angular 7, имеет универсальный тип, но он не является обязательным.
Это скомпилировано, потому что `metadata.json` Файлы содержат все метаданные.
С плющом, `metadata.json` Файлы больше не требуются, поэтому среда не может предполагать, что был предоставлен файл с необходимыми типами.
Вместо этого Айви полагается на общий тип для `ModuleWithProviders` для получения правильной информации о типе.

По этой причине Angular версии 9 устарела `ModuleWithProviders` без универсального типа.
В будущей версии Angular будет удален универсальный тип по умолчанию, что сделает явный тип обязательным.

{@a should-i-add-the-generic-type-when-i-add-new-modulewithproviders-types-to-my-application}
## Должен ли я добавить универсальный тип, когда я добавляю новый `ModuleWithProviders` Типы для моего приложения?

Да, каждый раз, когда ваш код ссылается на `ModuleWithProviders` Тип, он должен иметь универсальный тип, который соответствует фактическому `NgModule` который возвращается (например, `ModuleWithProviders<MyModule>`).


{@a what-should-i-do-if-the-schematic-prints-a-todo-comment}
## Что мне делать, если схема печатает комментарий TODO?

Схема напечатает комментарий TODO в том случае, если он не сможет определить правильный родовой для `ModuleWithProviders` Тип.
В этом случае вам нужно будет вручную добавить правильный универсальный `ModuleWithProviders` . Это должно соответствовать типу, какой бы ни `NgModule` возвращается в `ModuleWithProviders` Объект.

{@a what-does-this-mean-for-libraries}
## Что это значит для библиотек?

Библиотеки должны добавить универсальный тип к любому использованию `ModuleWithProviders` Тип.


{@a what-about-applications-using-non-migrated-libraries}
## А как насчет приложений, использующих немигрированные библиотеки?

[Угловое компилятор совместимости](guide/glossary#ngcc)(`ngcc`) должен автоматически преобразовывать любые библиотеки для генерации правильного кода.
