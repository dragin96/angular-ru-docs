{@a migration-for-missing-@injectable-decorators-and-incomplete-provider-definitions}
# Миграция пропавших без вести `@Injectable()` декораторы и неполные определения провайдеров

{@a what-does-this-schematic-do}
### Что делает эта схема?

  1. Эта схема добавляет `@Injectable()` для классов, представленных в
     приложение, но не оформлены.
  2. Поставщики обновлений схемы, которые следуют `{provide: SomeToken}` шаблон
     явно указать `useValue: undefined`.

**Пример пропавшего без вести `@Injectable()`**

_Перед миграцией: _
```typescript
export class MyService {...}
export class MyOtherService {...}
export class MyThirdClass {...}
export class MyFourthClass {...}
export class MyFifthClass {...}

@NgModule({
  providers: [
    MyService,
    {provide: SOME_TOKEN, useClass: MyOtherService},
    // The following classes do not need to be decorated because they
    // are never instantiated and just serve as DI tokens.
    {provide: MyThirdClass, useValue: ...},
    {provide: MyFourthClass, useFactory: ...},
    {provide: MyFifthClass, useExisting: ...},
  ]
})
```

_После миграции: _
```ts
@Injectable()
export class MyService {...}
@Injectable()
export class MyOtherService {...}
export class MyThirdClass {...}
export class MyFourthClass {...}
export class MySixthClass {...}

...
```

Обратите внимание, что `MyThirdClass`, `MyFourthClass` и `MyFifthClass` не нужно украшать
с `@Injectable()` потому что они никогда не создаются, а просто используются как [DI-токен] [DI_TOKEN].

**Пример для провайдера, нуждающегося `useValue: undefined`**

В этом примере показан поставщик, следующий за `{provide: X}` шаблон.
Поставщик должен быть перенесен в более четкое определение, где `useValue: undefined` определено.

_Before migration_:
```typescript
{provide: MyToken}
```
_After migration_:
```typescript
{provide: MyToken, useValue: undefined}
```

{@a why-is-adding-@injectable-necessary}
### Почему добавляется `@Injectable()` необходимо?

В наших документах мы всегда рекомендуем добавлять `@Injectable()` для любого класса, который предоставляется или внедряется в вашем приложении.
Однако более старые версии Angular допускали внедрение класса без декоратора в некоторых случаях, например в режиме AOT.
Это означает, что если вы случайно пропустили декоратор, ваше приложение могло продолжать работать, несмотря на отсутствие `@Injectable()` декораторы в некоторых местах.
Это проблематично для будущих версий Angular.
В конце концов, мы планируем строго требовать декоратор, потому что это позволяет дополнительно оптимизировать как компилятор, так и среду выполнения.
Эта схема добавляет любые `@Injectable()` декораторы, которые могут отсутствовать, чтобы ваше приложение в будущем.

{@a why-is-adding-usevalue-undefined-necessary}
### Почему добавляется `useValue: undefined` необходимо?

Рассмотрим следующий шаблон:

```typescript
@NgModule({
  providers: [{provide: MyService}]
})
```

Поставщики, использующие этот шаблон, будут вести себя так, как будто они предоставляют `MyService` как [DI-токен] [DI_TOKEN]
со значением `undefined`.
Это не тот случай в Ivy, где такие провайдеры будут интерпретироваться как `useClass: MyService`.
Это означает, что эти поставщики будут вести себя по-разному при обновлении до версии 9 и выше.
Чтобы убедиться, что поставщик ведет себя так же, как и раньше, значение DI должно быть явно установлено `undefined`.

{@a when-should-i-be-adding-@injectable-decorators-to-classes}
### Когда я должен добавить `@Injectable()` декораторы для классов?

Любой класс, который предоставляется, должен иметь `@Injectable()` декоратор.
Декоратор необходим для фреймворка для правильного создания экземпляра этого класса через DI.

Тем не менее, классы, которые уже украшены `@Pipe`, `@Component` или `@Directive` не нужны оба декоратора.
Существующий декоратор класса уже инструктирует компилятор генерировать
нужна информация

{@a should-i-update-my-library}
### Должен ли я обновить свою библиотеку?

Да, если в вашей библиотеке есть какие-либо классы, предназначенные для внедрения, они должны быть обновлены с помощью `@Injectable()` декоратор.
В будущей версии Angular отсутствует `@Injectable()` всегда будет ошибку.

Кроме того, поставщики в вашей библиотеке, которые следуют описанному `{provide: X}` Шаблон должен быть обновлен, чтобы указать явное значение.
Без явного значения эти поставщики могут вести себя по-разному в зависимости от версии Angular в приложениях, использующих вашу библиотеку.

[DI_TOKEN]: руководство / глоссарий #di-token
