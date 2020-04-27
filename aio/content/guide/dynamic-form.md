{@a dynamic-forms}
# Динамические формы

{@a top}

Создание форм ручной работы может быть дорогостоящим и занимать много времени
особенно если вам нужно их много, они похожи друг на друга и часто меняются
соответствовать быстро меняющимся деловым и нормативным требованиям.

Может быть более экономичным создавать формы динамически, на основе
метаданные, описывающие модель бизнес-объекта.

Эта кулинарная книга показывает, как использовать  `formGroup`  для динамически
визуализировать простую форму с различными типами управления и проверки.
Это примитивное начало.
Он может развиваться, чтобы поддерживать гораздо более широкий спектр вопросов, более изящный рендеринг и превосходный пользовательский опыт.
Все такое величие имеет скромное начало.

Пример в этой кулинарной книге - это динамическая форма для создания
опыт онлайн приложений для героев, ищущих работу.
Агентство постоянно работает над процессом подачи заявки.
Вы можете создавать формы на лету, *не меняя код приложения*.
{@a toc}

Смотрите <live-example name="dynamic-form"></live-example>.

{@a bootstrap}

{@a bootstrap}
## Бутстрап

Начните с создания  `NgModule`  называется  `AppModule`.

Эта кулинарная книга использует [реактивные формы](guide/reactive-forms).

Реактивные формы принадлежат другому  `NgModule`  называется  `ReactiveFormsModule`,
Таким образом, чтобы получить доступ к любым директивам реактивных форм, вы должны импортировать
 `ReactiveFormsModule ` из ` @angular/forms` Библиотека.

Загрузи  `AppModule`  в  `main.ts`.


<code-tabs>

  <code-pane header="app.module.ts" path="dynamic-form/src/app/app.module.ts">

  </code-pane>

  <code-pane header="main.ts" path="dynamic-form/src/main.ts">

  </code-pane>

</code-tabs>


{@a object-model}

{@a question-model}
## Модель вопроса

Следующим шагом является определение объектной модели, которая может описать все сценарии, необходимые для функциональности формы.
Процесс подачи заявки на героя включает форму с множеством вопросов.
_Question_ является наиболее фундаментальным объектом в модели.

Последующий  `QuestionBase`  - фундаментальный класс вопросов.


<code-example path="dynamic-form/src/app/question-base.ts" header="src/app/question-base.ts">

</code-example>



Из этой базы вы можете получить два новых класса в  `TextboxQuestion`  и  `DropdownQuestion` 
которые представляют текстовое поле и выпадающие вопросы.
Идея заключается в том, что форма будет привязана к конкретным типам вопросов и отображать их
соответствующие элементы управления динамически.

 `TextboxQuestion` поддерживает несколько типов HTML5, таких как текст, электронная почта и URL
через  `type`  собственности.


<code-example path="dynamic-form/src/app/question-textbox.ts" header="src/app/question-textbox.ts"></code-example>



 `DropdownQuestion` представляет список вариантов в поле выбора.


<code-example path="dynamic-form/src/app/question-dropdown.ts" header="src/app/question-dropdown.ts"></code-example>



Далее это  `QuestionControlService`, простой сервис для преобразования вопросов в  `FormGroup`.
Короче говоря, группа форм использует метаданные из модели вопроса и
позволяет указать значения по умолчанию и правила проверки.


<code-example path="dynamic-form/src/app/question-control.service.ts" header="src/app/question-control.service.ts"></code-example>

{@a form-component}

{@a question-form-components}
## Компоненты формы вопроса
Теперь, когда вы определили полную модель, вы готовы
создавать компоненты для представления динамической формы.


 `DynamicFormComponent` является точкой входа и основным контейнером для формы.

<code-tabs>

  <code-pane header="dynamic-form.component.html" path="dynamic-form/src/app/dynamic-form.component.html">

  </code-pane>

  <code-pane header="dynamic-form.component.ts" path="dynamic-form/src/app/dynamic-form.component.ts">

  </code-pane>

</code-tabs>



Он представляет список вопросов, каждый из которых связан с  `<app-question>`  компонент.
 `<app-question>` тег соответствует  `DynamicFormQuestionComponent`,
компонент, отвечающий за рендеринг деталей каждого _individual_
вопрос на основе значений в объекте вопроса с привязкой к данным.


<code-tabs>

  <code-pane header="dynamic-form-question.component.html" path="dynamic-form/src/app/dynamic-form-question.component.html">

  </code-pane>

  <code-pane header="dynamic-form-question.component.ts" path="dynamic-form/src/app/dynamic-form-question.component.ts">

  </code-pane>

</code-tabs>



Обратите внимание, что этот компонент может представлять любой тип вопроса в вашей модели.
На данный момент у вас есть только два типа вопросов, но вы можете представить себе еще больше.
 `ngSwitch` определяет тип отображаемого вопроса.

В обоих компонентах вы полагаетесь на Angular **formGroup** для подключения шаблона HTML к
базовые объекты управления, заполняемые из модели вопроса правилами отображения и проверки.

 `formControlName ` и ` formGroup` - это директивы, определенные в
 `ReactiveFormsModule` . Шаблоны могут получить доступ к этим директивам
непосредственно с момента импорта  `ReactiveFormsModule`  from  `AppModule`.
{@a questionnaire-data}

{@a questionnaire-data}
## Данные анкеты

 `DynamicFormComponent` ожидает список вопросов в виде массива, привязанного к `@Input() questions`.

Набор вопросов, которые вы определили для заявления о приеме на работу, возвращается из  `QuestionService`.
В реальном приложении вы бы получили эти вопросы из хранилища.

Ключевым моментом является то, что вы контролируете вопросы о вакансиях героя
полностью через объекты, возвращенные из  `QuestionService`.
Обслуживание анкеты - это просто добавление, обновление
и удаление объектов из  `questions`  массив.


<code-example path="dynamic-form/src/app/question.service.ts" header="src/app/question.service.ts">

</code-example>



Наконец, отобразите экземпляр формы в  `AppComponent`  shell.


<code-example path="dynamic-form/src/app/app.component.ts" header="app.component.ts">

</code-example>

{@a dynamic-template}

{@a dynamic-template}
## Динамический Шаблон
Хотя в этом примере вы моделируете приложение для работы с героями, они есть
нет ссылок на какой-либо конкретный вопрос героя
вне объектов, возвращаемых  `QuestionService`.

Это очень важно, поскольку позволяет переназначить компоненты для любого типа опроса
до тех пор, пока он совместим с *вопроса* объектной моделью.
Ключ - это динамическая привязка метаданных, используемых для визуализации формы
без каких-либо жестких предположений по конкретным вопросам.
Помимо управления метаданными, вы также добавляете валидацию динамически.

Кнопка *Сохранить* отключена, пока форма не будет в действительном состоянии.
Когда форма верна, вы можете нажать *Сохранить,* и приложение отображает текущие значения формы в формате JSON.
Это доказывает, что любой пользовательский ввод связан с моделью данных.
Сохранение и извлечение данных - упражнение для другого времени.


Окончательный вид выглядит следующим образом :

<div class="lightbox">
  <img src="generated/images/guide/dynamic-form/dynamic-form.png" alt="Dynamic-Form">
</div>


[Вернуться к началу](guide/dynamic-form#top)
