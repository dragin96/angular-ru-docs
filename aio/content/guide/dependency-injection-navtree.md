{@a navigate-the-component-tree-with-di}
# Перемещайтесь по дереву компонентов с помощью DI

Прикладные компоненты часто должны обмениваться информацией.
Вы часто можете использовать слабосвязанные методы для обмена информацией
такие как привязка данных и совместное использование услуг
но иногда для одного компонента имеет смысл иметь прямую ссылку на другой компонент.
Например, вам нужна прямая ссылка для доступа к значениям или вызову методов этого компонента.

Получение ссылки на компонент немного сложно в Angular.
Сами Angular компоненты не имеют дерева, которое вы можете
проверять или перемещаться программно. Родительско-дочерние отношения являются косвенными,
устанавливается через компоненты [просмотр объектов](guide/glossary#view).

Каждый компонент имеет представление *хоста*и может иметь дополнительные *встроенные представления*.
Встроенный вид в компоненте A является
представление хоста компонента B, который, в свою очередь, может иметь встроенное представление.
Это означает, что существует [вид иерархии](guide/glossary#view-hierarchy)для каждого компонента,
из которых представление узла этого компонента является корнем.

Существует API для навигации *по* иерархии представлений.
Проверять, выписываться  `Query`, `QueryList`, `ViewChildren`, и  `ContentChildren` 
в [Справочник по API](api/).

Нет общедоступного API для получения родительской ссылки.
Тем не менее, поскольку каждый экземпляр компонента добавляется в контейнер инжектора, в
Вы можете использовать внедрение зависимостей Angular для достижения родительского компонента.

В этом разделе описываются некоторые методы для этого.

{@a find-parent}
{@a known-parent}


{@a find-a-parent-component-of-known-type}
### Найти родительский компонент известного типа

Вы используете инъекцию стандартного класса, чтобы получить родительский компонент, тип которого вы знаете.

В следующем примере родитель  `AlexComponent` имеет несколько детей, включая  `CathyComponent`  :

{@a alex}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-1" header="parent-finder.component.ts (AlexComponent v.1)"></code-example>



*Кэти* сообщает, есть ли у нее доступ к *Алексу*
после введения  `AlexComponent`  в ее конструктор:

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="cathy" header="parent-finder.component.ts (CathyComponent)"></code-example>



Обратите внимание, что, хотя [@Optional](guide/dependency-injection-in-action#optional)квалификатор
там для безопасности
<live-example name="dependency-injection-in-action"></live-example>
подтверждает, что  `alex`  Параметр установлен.


{@a base-parent}


{@a unable-to-find-a-parent-by-its-base-class}
### Невозможно найти родителя по его базовому классу

Что если вы *не* знаете конкретный класс родительских компонентов?

Повторно используемый компонент может быть дочерним для нескольких компонентов.
Представьте себе компонент для рендеринга последних новостей о финансовом инструменте.
По деловым причинам этот компонент новостей часто звонит
непосредственно в его родительский инструмент, как изменение рыночных потоков данных.

Приложение, вероятно, определяет более десятка компонентов финансовых инструментов.
Если вам повезет, все они реализуют один и тот же базовый класс
чей API твой  `NewsComponent`  понимает.


<div class="alert is-helpful">



Поиск компонентов, которые реализуют интерфейс, был бы лучше.
Это невозможно, потому что интерфейсы TypeScript исчезают
из переданного JavaScript, который не поддерживает интерфейсы.
Там нет артефакт для поиска.

</div>



Это не обязательно хороший дизайн.
В этом примере рассматривается *, может ли компонент
внедрить своего родителя через базовый класс родителя *.

Образец  `CraigComponent`  исследует этот вопрос. [Оглядываясь назад](#alex),
Вы видите, что  `Alex`  Компонент *расширяет* ( *наследует*) от класса с именем  `Base`.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (Alex class signature)"></code-example>



 `CraigComponent` пытается ввести  `Base`  в его  `alex`  Параметр конструктора и сообщает, если это удалось.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="craig" header="parent-finder.component.ts (CraigComponent)"></code-example>



К сожалению, это не работает.
<live-example name="dependency-injection-in-action"></live-example>
подтверждает, что  `alex`  Параметр равен нулю.
*Вы не можете внедрить родителя по его базовому классу.*



{@a class-interface-parent}


{@a find-a-parent-by-its-class-interface}
### Найдите родителя по его интерфейсу класса

Вы можете найти родительский компонент с [интерфейс класса](guide/dependency-injection-in-action#class-interface).

Родитель должен сотрудничать, предоставляя себе *псевдоним* в имени токена интерфейса класса.

Напомним, что Angular всегда добавляет экземпляр компонента в свой собственный инжектор;
вот почему вы можете ввести *Алекс* в *Кэти* [ранее](#known-parent).

Написать [* псевдоним провайдера*](guide/dependency-injection-in-action#useexisting)—a  `provide`  объектный литерал с  `useExisting` 
определение - это создает *альтернативный* способ внедрить тот же экземпляр компонента
и добавьте этого провайдера в  `providers`  массив  `@Component()` метаданные для  `AlexComponent`.

{@a alex-providers}


<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="parent-finder.component.ts (AlexComponent providers)"></code-example>


[Родитель](#parent-token)- токен интерфейса класса провайдера.
[* ForwardRef*](guide/dependency-injection-in-action#forwardref)нарушает циклическую ссылку вы только что созданный за счет того,  `AlexComponent`  ссылается на себя.

*Кэрол*, третий из *Алекса*дочерних компонентов, вводит родителя в его  `parent`  параметр
так же, как вы делали это раньше.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-class" header="parent-finder.component.ts (CarolComponent class)"></code-example>



Вот *Алекс* и семья в действии.

<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/alex.png" alt="Alex in action">
</div>



{@a parent-tree}


{@a find-a-parent-in-a-tree-with-@skipself}
### Найдите родителя в дереве с помощью _@ SkipSelf () _

Представьте себе одну ветвь иерархии компонентов: *Алиса* -> *Барри* -> *Кэрол*.
И *Алиса,* и *Барри* реализуют  `Parent`  Интерфейс класса.

*Барри* это проблема. Ему нужно связаться с его родителем, *Алисой*, а также быть родителем для *Кэрол*.
Это означает, что он должен как *инъекционные*  `Parent` Интерфейс класса, чтобы получить*Алису * и
*обеспечить*  `Parent` чтобы удовлетворить*Кэрол *.

Вот *Барри*.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry" header="parent-finder.component.ts (BarryComponent)"></code-example>



*Barry's*  `providers`  массив выглядит так же, как [* Alex*](#alex-providers).
Если вы собираетесь продолжать писать [* псевдонимы провайдеров*](guide/dependency-injection-in-action#useexisting)как это, вы должны создать [вспомогательную функцию](#provideparent).

А пока сосредоточимся на конструкторе *Барри*.

<code-tabs>

  <code-pane header="Barry's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="barry-ctor">

  </code-pane>

  <code-pane header="Carol's constructor" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="carol-ctor">

  </code-pane>

</code-tabs>


Он идентичен конструктору *Кэрол*, за исключением дополнительного  `@SkipSelf`  декоратор.

 `@SkipSelf` имеет важное значение по двум причинам:

1. Он говорит инжектору начать поиск  `Parent`  зависимость в компоненте *над* собой
который *является* какой родитель средства.

2. Angular выдает ошибку циклической зависимости, если вы опустите  `@SkipSelf`  декоратор.

   `Cannot instantiate cyclic dependency! (BethComponent -> Parent -> BethComponent)` 

Вот *Алиса*, *Барри*и семья в действии.


<div class="lightbox">
  <img src="generated/images/guide/dependency-injection-in-action/alice.png" alt="Alice in action">
</div>

{@a parent-token}


{@a parent-class-interface}
###  Интерфейс родительского класса
Вы [узнали ранее](guide/dependency-injection-in-action#class-interface)что интерфейс класса - это абстрактный класс, используемый как интерфейс, а не как базовый класс.

Пример определяет  `Parent`  Интерфейс класса.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="parent" header="parent-finder.component.ts (Parent class-interface)"></code-example>



 `Parent` Интерфейс класса определяет  `name`  Свойство с объявлением типа, но *без реализации*.
 `name` Свойство является единственным членом родительского компонента, который может вызвать дочерний компонент.
Такой узкий интерфейс помогает отделить класс дочерних компонентов от его родительских компонентов.

Компонент, который мог бы служить родителем, *должен* реализовывать интерфейс класса как  `AliceComponent`  делает.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-class-signature" header="parent-finder.component.ts (AliceComponent class signature)"></code-example>



Это добавляет ясности к коду. Но это не технически необходимо.
Хотя  `AlexComponent`  имеет  `name`  свойства, как того требует его  `Base`  класс
его подпись класса не упоминает  `Parent`.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-class-signature" header="parent-finder.component.ts (AlexComponent class signature)"></code-example>



<div class="alert is-helpful">



 `AlexComponent`  *должен* реализовать  `Parent`  как должный стиль.
Это не в этом примере *только* для демонстрации того, что код будет компилироваться и работать без интерфейса.


</div>



{@a provideparent}


{@a provideparent-helper-function}
###  `provideParent()` вспомогательная функция

Написание вариантов одного и того же родительского *провайдера псевдонимов* быстро устареет
особенно этот ужасный глоток с [* forwardRef*](guide/dependency-injection-in-action#forwardref).

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>

Вы можете извлечь эту логику в вспомогательную функцию, как показано ниже.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-the-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>

Теперь вы можете добавить более простой и значимый родительский поставщик в ваши компоненты.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alice-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>


Ты можешь лучше. Текущая версия вспомогательной функции может использовать только псевдоним  `Parent`  Интерфейс класса.
Приложение может иметь множество родительских типов, каждый из которых имеет свой собственный токен интерфейса класса.

Вот пересмотренная версия, которая по умолчанию  `parent`  но также принимает необязательный второй параметр для интерфейса другого родительского класса.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="provide-parent" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>


А вот как вы можете использовать его с другим родительским типом.

<code-example path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="beth-providers" header="dependency-injection-in-action/src/app/parent-finder.component.ts"></code-example>
