{@a sharing-modules}
# Совместное использование модулей

Создание общих модулей позволяет вам организовать и оптимизировать ваш код. Вы можете поставить обычно
используемые директивы, каналы и компоненты в один модуль, а затем импортировать только этот модуль куда угодно
вам это нужно в других частях вашего приложения.

Рассмотрим следующий модуль из воображаемого приложения:


```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerComponent } from './customer.component';
import { NewItemDirective } from './new-item.directive';
import { OrdersPipe } from './orders.pipe';

@NgModule({
 imports:      [ CommonModule ],
 declarations: [ CustomerComponent, NewItemDirective, OrdersPipe ],
 exports:      [ CustomerComponent, NewItemDirective, OrdersPipe,
                 CommonModule, FormsModule ]
})
export class SharedModule { }
```

Обратите внимание на следующее:

* Импортирует  `CommonModule`  потому что компонент модуля нуждается в общих директивах.
* Он объявляет и экспортирует служебные каналы, директивы и классы компонентов.
* Реэкспортирует  `CommonModule`  и  `FormsModule`.

Реэкспортом  `CommonModule`  и  `FormsModule`, любой другой модуль, который импортирует это
 `SharedModule`, получает доступ к директивам, таким как  `NgIf`  и  `NgFor`  от  `CommonModule` 
и может связываться со свойствами компонентов с  `[(ngModel)]`, директива в  `FormsModule`.

Даже если компоненты объявлены  `SharedModule`  может не связываться
с  `[(ngModel)]`  и может не понадобиться  `SharedModule` 
импортировать  `FormsModule`, `SharedModule`  еще можно экспортировать
 `FormsModule` без включения его в список  `imports`  . Это
Кстати, вы можете дать другим модулям доступ к  `FormsModule`  без
придется импортировать его непосредственно в  `@NgModule`  decorator.

{@a using-components-vs-services-from-other-modules}
### Использование компонентов против служб из других модулей

Существует важное различие между использованием компонента другого модуля и
используя сервис из другого модуля. Импортируйте модули, когда вы хотите использовать
директивы, трубы и компоненты. Импорт модуля со службами означает, что у вас будет новый экземпляр этой службы, который обычно не является тем, что вам нужно (обычно требуется повторно использовать существующую службу). Используйте импорт модулей для управления реализацией сервисов.

Наиболее распространенный способ получить доступ к общим службам - через Angular
[внедрение зависимости](guide/dependency-injection), а не через систему модулей (импорт модуля приведет к появлению нового экземпляра службы, что не является типичным использованием).

Чтобы прочитать об общих службах, см. [Поставщики](guide/providers).


<hr />

{@a more-on-ngmodules}
## Больше на NgModules

Вы также можете быть заинтересованы в следующих ситуациях :
* [Провайдеры](guide/providers).
* [Типы функциональных модулей](guide/module-types).
