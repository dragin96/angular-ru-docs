{@a reactive-forms}
# Реактивные формы

*Реактивные формы* обеспечивают управляемый моделями подход к обработке входных данных форм, значения которых меняются со временем. В этом руководстве показано, как создать и обновить простой элемент управления формой, перейти к использованию нескольких элементов управления в группе, проверить значения форм и реализовать более сложные формы.



{@a toc}

Попробуйте <live-example title="Reactive Forms in Stackblitz">живой пример Reactive Forms </live-example>.

{@a intro}

{@a introduction-to-reactive-forms}
## Введение в реактивные формы

Реактивные формы используют явный и неизменный подход к управлению состоянием формы в данный момент времени. Каждое изменение состояния формы возвращает новое состояние, которое поддерживает целостность модели между изменениями. Реактивные формы строятся вокруг наблюдаемых потоков, где входные данные и значения форм предоставляются в виде потоков входных значений, к которым можно получить синхронный доступ.

Реактивные формы также обеспечивают прямой путь к тестированию, потому что вы уверены, что ваши данные непротиворечивы и предсказуемы при запросе. Любые потребители потоков могут безопасно управлять этими данными.

Реактивные формы отличаются от шаблонных форм разными способами. Реактивные формы обеспечивают большую предсказуемость благодаря синхронному доступу к модели данных, неизменности с наблюдаемыми операторами и отслеживанию изменений через наблюдаемые потоки. Если вы предпочитаете прямой доступ для изменения данных в шаблоне, формы, управляемые шаблоном, являются менее явными, поскольку они используют директивы, встроенные в шаблон, а также изменяемые данные для асинхронного отслеживания изменений. См. [Обзор форм](guide/forms-overview)для подробного сравнения двух парадигм.

{@a getting-started}
## Начало работы

В этом разделе описывается, как добавить один элемент управления формы. В этом примере пользователь вводит свое имя в поле ввода, фиксирует это входное значение и отображает текущее значение элемента управления формы.

{@a step-1-registering-the-reactive-forms-module}
### Шаг 1: Регистрация модуля реактивных форм

Чтобы использовать реактивные формы, импортируйте пакет `ReactiveFormsModule` из `@angular/forms` и добавьте его в свой массив `imports` в NgModule.

<code-example path="reactive-forms/src/app/app.module.ts" region="imports" header="src/app/app.module.ts (excerpt)"></code-example>

{@a step-2-generating-and-importing-a-new-form-control}
### Шаг 2: Создание и импорт нового элемента управления формы

Создайте компонент для элемента управления.

<code-example language="sh" class="code-shell">

  ng generate component NameEditor

</code-example>

 `FormControl` Класс является основным строительным блоком при использовании реактивных форм. Чтобы зарегистрировать один элемент управления формы, импортируйте `FormControl` класс в своем компоненте и создайте новый экземпляр элемента управления формы для сохранения в качестве свойства класса.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control" header="src/app/name-editor/name-editor.component.ts"></code-example>

Используйте конструктор `FormControl` чтобы установить его начальное значение, которое в этом случае является пустой строкой. Создавая эти элементы управления в своем классе компонентов, вы получаете немедленный доступ для прослушивания, обновления и проверки состояния ввода формы.

{@a step-3-registering-the-control-in-the-template}
### Шаг 3: Регистрация элемента управления в шаблоне

После создания элемента управления в классе компонента его необходимо связать с элементом элемента управления формы в шаблоне. Обновите шаблон с помощью элемента управления формы, используя `formControl` привязка обеспечивается `FormControlDirective` включен в `ReactiveFormsModule`.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" header="src/app/name-editor/name-editor.component.html"></code-example>

<div class="alert is-helpful">

**Примечание:** для более подробного списка классов и директив, предоставленных `ReactiveFormsModule` см [Реактивные формы API](#reactive-forms-api)раздел.

</div>

Используя синтаксис привязки шаблона, элемент управления формы теперь зарегистрирован в `name` элемента ввода в шаблоне. Элемент управления формы и элемент DOM взаимодействуют друг с другом: представление отражает изменения в модели, а модель отражает изменения в представлении.

{@a displaying-the-component}
#### Отображение компонента

Элемент управления формы назначен `name` отображается, когда компонент добавляется в шаблон.

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-name-editor" header="src/app/app.component.html (name editor)"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/name-editor-1.png" alt="Name Editor">
</div>

{@a managing-control-values}
## Управление контрольными значениями

Реактивные формы предоставляют вам доступ к состоянию и значению элемента управления формы в определенный момент времени. Вы можете манипулировать
текущее состояние и значение через класс компонента или шаблон компонента. В следующих примерах показано значение экземпляра элемента управления формы и измените его.

{@a display-value}

{@a displaying-a-form-control-value}
### Отображение значения элемента управления формы

Вы можете отобразить значение в этих отношениях:

* Сквозь `valueChanges` наблюдаемый, где вы можете прослушивать изменения значения формы в шаблоне, используя `AsyncPipe` или в классе компонентов, используя `subscribe()` Метод.
* С `value` свойства, которое дает вам снимок текущего значения.

В следующем примере показано, как отобразить текущее значение с помощью интерполяции в шаблоне.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value" header="src/app/name-editor/name-editor.component.html (control value)"></code-example>

Отображаемое значение изменяется при обновлении элемента управления формы.

Реактивные формы предоставляют доступ к информации о данном элементе управления через свойства и методы, предоставляемые каждому экземпляру. Эти свойства и методы базового [AbstractControl](api/forms/AbstractControl)класса используются для управления состоянием формы и определения, когда отображать сообщения при обработке проверки. Для получения дополнительной информации см. [Простая проверка формы](#simple-form-validation)позже в этом руководстве.

Читайте о других `FormControl` Свойства и методы в разделе [API Reactive форм](#reactive-forms-api).

{@a replacing-a-form-control-value}
### Замена значения элемента управления формы

У реактивных форм есть методы для программного изменения значения элемента управления, что дает вам возможность обновлять значение без вмешательства пользователя. Экземпляр элемента управления формы обеспечивает `setValue()` который обновляет значение элемента управления формы и проверяет структуру значения, предоставленного в соответствии со структурой элемента управления. Например, при извлечении данных формы из бэкэнд-API или службы используйте `setValue()` обновляет элемент управления до его нового значения, полностью заменяя старое значение.

В следующем примере метод добавляется в класс компонента для обновления значения элемента управления до *Nancy* с использованием `setValue()`.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value" header="src/app/name-editor/name-editor.component.ts (update value)">

</code-example>

Обновите шаблон с помощью кнопки для имитации обновления имени. При нажатии кнопки « **Обновить имя»** значение, введенное в элемент управления формы, отображается как его текущее значение.

<code-example path="reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value" header="src/app/name-editor/name-editor.component.html (update value)"></code-example>

Модель формы является источником правды для элемента управления, поэтому при нажатии кнопки значение ввода изменяется внутри класса компонента, переопределяя его текущее значение.

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/name-editor-2.png" alt="Name Editor Update">
</div>

<div class="alert is-helpful">

**Примечание.** В этом примере вы используете один элемент управления. При использовании `setValue()` с группой форм или экземпляром массива форм, значение должно соответствовать структуре группы или массива.

</div>

{@a grouping-form-controls}
## Группировка формы элементов управления

Так же, как экземпляр элемента управления формы дает вам контроль над одним полем ввода, экземпляр группы форм отслеживает состояние формы группы экземпляров элемента управления формы (например, формы). Каждый элемент управления в экземпляре группы форм отслеживается по имени при создании группы форм. В следующем примере показано, как управлять несколькими экземплярами элемента управления формы в одной группе.

Создать `ProfileEditor` Компонент и импортировать `FormGroup` и `FormControl` из `@angular/forms` пакет.

<code-example language="sh" class="code-shell">

  ng generate component ProfileEditor

</code-example>

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports" header="src/app/profile-editor/profile-editor.component.ts (imports)">

</code-example>

{@a step-1-creating-a-formgroup-instance}
### Шаг 1: Создание экземпляра FormGroup

Создайте свойство в классе компонента с именем `profileForm` и установите свойство для нового экземпляра группы форм. Чтобы инициализировать группу форм, предоставьте конструктору объект именованных ключей, сопоставленный их элементу управления.

Для формы профиля добавьте два экземпляра элемента управления формы с именами `firstName` и `lastName`.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup" header="src/app/profile-editor/profile-editor.component.ts (form group)">

</code-example>

Отдельные элементы управления формой теперь собраны в группе. `FormGroup` предоставляет значение своей модели в виде объекта, уменьшенного по со значениями каждого элемента управления в группе. Экземпляр группы форм имеет те же свойства (например, `value` и `untouched`) и методы (такие как `setValue()` ) как экземпляр управления формы.

{@a step-2-associating-the-formgroup-model-and-view}
### Шаг 2: Связывание модели и вида FormGroup

Группа форм отслеживает состояние и изменения для каждого из своих элементов управления, поэтому при изменении одного из элементов управления родительский элемент управления также выдает новое состояние или изменение значения. Модель для группы поддерживается от ее членов. После определения модели необходимо обновить шаблон, чтобы отразить модель в представлении.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup" header="src/app/profile-editor/profile-editor.component.html (template form group)"></code-example>

Обратите внимание, что так же, как группа форм содержит группу элементов управления, *форма профиля* `FormGroup` связана с `form` элемент с `FormGroup` Директива, создающая уровень связи между моделью и формой, содержащей входные данные. `formControlName` ввод предоставленный `FormControlName` Директива связывает каждый отдельный вход с управления формы, определенным в `FormGroup` . Элементы управления связываются с соответствующими элементами. Они также сообщают об изменениях экземпляру группы форм, который обеспечивает источник правды для значения модели.

{@a saving-form-data}
### Сохранение данных формы

 `ProfileEditor` Компонент принимает ввод от пользователя, но в реальном сценарии вы хотите захватить значение формы и сделать доступным для дальнейшей обработки вне компонента. `FormGroup` Директива прослушивает `submit` событие, испущенное `form` элемент и испускает `ngSubmit` Событие которое вы можете привязать к функции обратного вызова.

Добавить `ngSubmit` слушатель события `form` тег с `onSubmit()` обратного вызова.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit" header="src/app/profile-editor/profile-editor.component.html (submit event)"></code-example>

 `onSubmit() ` в ` ProfileEditor` Компонент фиксирует текущее значение `profileForm` . использование `EventEmitter` для сохранения формы в форме и предоставления значения формы вне компонента. В следующем примере используется `console.warn` для записи сообщения в консоль браузера.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit" header="src/app/profile-editor/profile-editor.component.ts (submit method)">

</code-example>

 `submit` событие испускается `form` тег с использованием родного события DOM. Вы запускаете событие, нажимая кнопку с `submit` тип. Это позволяет пользователю нажать клавишу **Enter,** чтобы отправить заполненную форму.

Использовать `button` элемент чтобы добавить кнопку внизу формы, чтобы вызвать отправку формы.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button" header="src/app/profile-editor/profile-editor.component.html (submit button)"></code-example>

<div class="alert is-helpful">

**Примечание:** кнопка в фрагменте выше также имеет `disabled` привязка к ней, чтобы отключить кнопку при `profileForm` является недействительным. Вы еще не выполняете проверку, поэтому кнопка всегда включена. Простая проверка формы описана в разделе [Простая проверка формы](#simple-form-validation).

</div>

{@a displaying-the-component}
#### Отображение компонента

Для отображения `ProfileEditor` Компонент, содержащий форму, добавьте ее в шаблон компонента.

<code-example path="reactive-forms/src/app/app.component.1.html" region="app-profile-editor" header="src/app/app.component.html (profile editor)"></code-example>

 `ProfileEditor` позволяет вам управлять экземплярами управления формы для `firstName` и `lastName` Элементы управления в экземпляре группы форм.

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-1.png" alt="Profile Editor">
</div>

{@a creating-nested-form-groups}
## Создание групп вложенных форм

При создании сложных форм управление различными областями информации проще в небольших разделах, и некоторые группы информации естественно попадают в одну группу. Использование вложенного экземпляра группы форм позволяет разбить большие группы форм на более мелкие, более управляемые.

{@a step-1-creating-a-nested-group}
### Шаг 1: Создание вложенной группы

Адрес является хорошим примером информации, которую можно сгруппировать. Группы форм могут принимать как элементы управления формой, так и экземпляры групп форм как дочерние. Это упрощает поддержку сложных моделей форм и их логическую группировку. Чтобы создать вложенную группу в `profileForm`, добавить вложенный `address` элемента к экземпляру группы форм.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup" header="src/app/profile-editor/profile-editor.component.ts (nested form group)"></code-example>

В этом примере `address group` объединяет текущий `firstName` и `lastName` контролирует с новым `street`, `city`, `state` и `zip` управления. Хотя `address` Элемент в группе формы является дочерним от общего `profileForm` Элемент в группе форм, те же правила применяются к изменениям значения и статуса. Изменения в статусе и значении из вложенной группы форм распространяются на родительскую группу форм, поддерживая согласованность с общей моделью.

{@a step-2-grouping-the-nested-form-in-the-template}
### Шаг 2: Группировка вложенной формы в шаблоне

После обновления модели в классе компонентов обновите шаблон, чтобы подключить экземпляр группы форм и его входные элементы.

Добавить `address` группа формы содержащая `street`, `city`, `state` и `zip` поля к `ProfileEditor` Шаблон.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname" header="src/app/profile-editor/profile-editor.component.html (template nested form group)"></code-example>

 `ProfileEditor` Форма отображается как одна группа, но модель далее разбивается для представления областей логической группировки.

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-2.png" alt="Profile Editor Update">
</div>

<div class="alert is-helpful">

**Примечание.** Отобразите значение для экземпляра группы форм в шаблоне компонента, используя `value` имущества и `JsonPipe`.

</div>

{@a partial-model-updates}
## Частичные обновления модели

При обновлении значения для экземпляра группы форм, который содержит несколько элементов управления, вы можете захотеть обновить только части модели. В этом разделе описывается, как обновить определенные части модели данных управления формой.

{@a patching-the-model-value}
### Исправление значения модели

Есть два способа обновления значения модели:

* Использовать `setValue()` для установки нового значения для отдельного управления. `setValue()` строго придерживается структуры группы форм и заменяет все значение для элемента управления.

* Использовать `patchValue()` для замены любых свойств, определенных в объекте, которые изменились в модели формы.

Строгие проверки `setValue()` помогает ошибки вложения в сложных формах, а `patchValue()` завершается с ошибкой на этих ошибках.

В `ProfileEditorComponent`, используйте `updateProfile` Метод с примером ниже, чтобы обновить имя и почтовый адрес для пользователя.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value" header="src/app/profile-editor/profile-editor.component.ts (patch value)">

</code-example>

Смоделируйте обновление, добавив кнопку в шаблон для обновления профиля пользователя по требованию.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value" header="src/app/profile-editor/profile-editor.component.html (update value)"></code-example>

Когда пользователь нажимает кнопку, `profileForm` Модель обновлена ​​новыми значениями для `firstName` и `street` . Заметь `street` предоставляется в объекте внутри `address` собственности. Это необходимо, потому что `patchValue()` применяет обновление к структуре модели. `PatchValue()` только обновляет свойства, которые определяет модель формы.

{@a generating-form-controls-with-formbuilder}
## Создание элементов управления формы с FormBuilder

Создание экземпляров элементов управления вручную может стать повторяющимся при работе с несколькими формами. `FormBuilder` предоставляет удобные методы для генерации элементов управления.

В следующем разделе рефакторинг `ProfileEditor` Компонент для использования службы построителя форм для создания элементов управления формы и групп форм.

{@a step-1-importing-the-formbuilder-class}
### Шаг 1: Импорт класса FormBuilder

Импортировать `FormBuilder` Класс из `@angular/forms` пакет.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

{@a step-2-injecting-the-formbuilder-service}
### Шаг 2: Внедрение службы FormBuilder

 `FormBuilder` - это поставщик для инъекций, который поставляется с модулем реактивных форм. Добавьте эту зависимость, добавив ее в конструктор компонента.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder" header="src/app/profile-editor/profile-editor.component.ts (constructor)">

</code-example>

{@a step-3-generating-form-controls}
### Шаг 3: Генерация элементов управления формы

 `FormBuilder` имеет три метода: `control()`, `group()` и `array()` . Это фабричные методы для генерации экземпляров в ваших классах компонентов, включая элементы управления формой, группы форм и массивы форм.

Использовать `group` метод для создания `profileForm` контролирует.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder" header="src/app/profile-editor/profile-editor.component.ts (form builder)">

</code-example>

В приведенном выше примере вы используете `group()` Метод с тем же объектом для определения свойств в модели. Значением для каждого имени элемента управления является массив, содержащий начальное значение в качестве первого элемента в массиве.

<div class="alert is-helpful">

**Примечание.** Вы можете определить элемент управления только с начальным значением, но если вашим элементам управления требуется синхронизация или асинхронная проверка, добавьте синхронизаторы и асинхронные валидаторы в качестве второго и третьего элементов в массиве.

</div>

Сравните с помощью построителя форм с созданием экземпляров вручную.

<code-tabs>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (instances)">

  </code-pane>

  <code-pane path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare" header="src/app/profile-editor/profile-editor.component.ts (form builder)">

  </code-pane>

</code-tabs>

{@a simple-form-validation}
## Простая проверка формы

_Form validation_ используется для проверки ввода пользователя, чтобы убедиться, что он полон и корректен. В этом разделе описывается добавление одного валидатора в элемент управления формы и отображение общего состояния формы. Проверка формы более подробно описана в руководстве [Проверка формы](guide/form-validation).

{@a step-1-importing-a-validator-function}
### Шаг 1: Импорт функции валидатора

Реактивные формы включают набор функций валидатора для общих случаев использования. Эти функции получают элемент управления для проверки и возврата объекта ошибки или нулевого значения на основе проверки проверки.

Импортировать `Validators` Класс из `@angular/forms` пакет.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

{@a step-2-making-a-field-required}
### Шаг 2: Создание поля обязательно

Наиболее распространенная проверка - это обязательное заполнение поля. В этом разделе описывается, как добавить обязательную проверку к `firstName` управления.

в `ProfileEditor` Компонент, добавьте `Validators.required` статический метод в качестве второго элемента в массиве для `firstName` управления.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator" header="src/app/profile-editor/profile-editor.component.ts (required validator)">

</code-example>

HTML5 имеет набор встроенных атрибутов, которые вы можете использовать для собственной проверки, в том числе `required`, `minlength` и `maxlength` . Вы можете воспользоваться этими дополнительными атрибутами в элементах ввода формы. Добавить `required` атрибут `firstName` элемент ввода.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="required-attribute" header="src/app/profile-editor/profile-editor.component.html (required attribute)"></code-example>

<div class="alert is-important">

**Внимание!** Используйте эти атрибуты проверки HTML5*в сочетании со * встроенными валидаторами, предоставленными реактивными формами Angular. Использование их в сочетании предотвращает ошибки при изменении выражения после проверки шаблона.

</div>

{@a displaying-form-status}
### Отображение статуса формы

Когда вы добавляете обязательное поле в элемент управления формы, его начальный статус недействителен. Этот недопустимый статус распространяется на родительский элемент группы форм, что делает его статус недействительным. Доступ к текущему состоянию экземпляра группы форм через его `status` собственности.

Показать текущее состояние `profileForm` с использованием интерполяции.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status" header="src/app/profile-editor/profile-editor.component.html (display status)"></code-example>

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-3.png" alt="Profile Editor Validation">
</div>

Кнопка **Отправить** отключена, потому что `profileForm` является недействительным из-за необходимого `firstName` элемент управления . После того, как вы заполните `firstName` вводе форма становится действительной и**Submit** кнопка активна.

Для получения дополнительной информации о проверке формы см. [Проверка формы](guide/form-validation)Руководство.

{@a dynamic-controls-using-form-arrays}
## Динамическое управление с использованием массивов форм

 `FormArray` является альтернативой `FormGroup` для управления любым количеством неназванных элементов управления. Как и в случае экземпляров группы форм, вы можете динамически вставлять и удалять элементы управления из экземпляров массива форм, а значение экземпляра массива форм и статус проверки вычисляются из его дочерних элементов управления. Однако вам не нужно определять ключ для каждого элемента управления по имени, поэтому это отличный вариант, если вы не знаете заранее количество дочерних значений. В следующем примере показано, как управлять массивом *псевдонимов* в `ProfileEditor`.

{@a step-1-importing-the-formarray-class}
### Шаг 1: Импорт класса FormArray

Импортировать `FormArray` Класс от `@angular/forms` использовать для информации о типе. `FormBuilder` готов создать `FormArray`.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports" header="src/app/profile-editor/profile-editor.component.ts (import)">

</code-example>

{@a step-2-defining-a-formarray-control}
### Шаг 2: Определение элемента управления FormArray

Вы можете инициализировать массив форм с любым количеством элементов управления, от нуля до множества, определив их в массиве. Добавить `aliases` свойства для экземпляра группы форм для `profileForm` для определения массива формы.

Использовать `FormBuilder.array()` для определения массива и `FormBuilder.control()` для заполнения массива начальным управления.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases" header="src/app/profile-editor/profile-editor.component.ts (aliases form array)">

</code-example>

Элемент управления псевдонимами в экземпляре группы форм теперь заполняется одним элементом управления, пока больше элементов управления не будут добавлены динамически.

{@a step-3-accessing-the-formarray-control}
### Шаг 3: Доступ к элементу управления FormArray

Получатель обеспечивает легкий доступ к псевдонимам в экземпляре массива формы по сравнению с повторением `profileForm.get()` Метод для получения каждого экземпляра. Экземпляр массива формы представляет неопределенное количество элементов управления в массиве. Доступ к элементу управления удобен через геттер, и этот подход легко повторить для дополнительных элементов управления.

Используйте синтаксис геттера для создания `aliases` свойство класса для извлечения элемента управления массива формы псевдонима из родительской группы форм.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter" header="src/app/profile-editor/profile-editor.component.ts (aliases getter)">

</code-example>

<div class="alert is-helpful">

**Примечание.** Поскольку возвращаемый элемент управления имеет тип `AbstractControl`, вам нужно предоставить явный тип для доступа к синтаксису метода для экземпляра массива формы.

</div>

Определите метод для динамической вставки элемента управления псевдонимом в массив формы псевдонима. `FormArray.push()` вставляет элемент управления как новый элемент в массив.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias" header="src/app/profile-editor/profile-editor.component.ts (add alias)">

</code-example>

В шаблоне каждый элемент управления отображается как отдельное поле ввода.

{@a step-4-displaying-the-form-array-in-the-template}
### Шаг 4: Отображение массива формы в шаблоне

Чтобы прикрепить псевдонимы из модели формы, необходимо добавить их в шаблон. Похож на `formGroupName` данные предоставлены `FormGroupNameDirective`, `formArrayName` связывает связь из экземпляра массива формы с шаблоном `FormArrayNameDirective`.

Добавьте шаблон HTML ниже после `<div>` закрытие `formGroupName` элемент.

<code-example path="reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname" header="src/app/profile-editor/profile-editor.component.html (aliases form array template)"></code-example>

 `*ngFor` Директива выполняет итерации по каждому экземпляру управления формы, предоставленному экземпляром массива формы псевдонимов. Поскольку элементы массива формы не называются, вы назначаете индекс `i` переменная и передать его каждому элементу управления, чтобы связать его с `formControlName` ввод.

<div class="lightbox">
  <img src="generated/images/guide/reactive-forms/profile-editor-4.png" alt="Profile Editor Aliases">
</div>

Каждый раз, когда добавляется новый экземпляр псевдонима, новому экземпляру массива форм предоставляется управление на основе индекса. Это позволяет отслеживать каждый отдельный элемент управления при расчете состояния и значения корневого элемента управления.

{@a adding-an-alias}
#### Добавление псевдонима

Изначально форма содержит один `Alias` поля. Чтобы добавить другое поле, нажмите кнопку « **Добавить псевдоним»** . Вы также можете проверить массив псевдонимов, представленных моделью формы, отображаемой `Form Value` внизу шаблона.

<div class="alert is-helpful">

**Примечание.** Вместо экземпляра элемента управления формы для каждого псевдонима можно создать другой экземпляр группы форм с дополнительными полями. Процесс определения элемента управления для каждого элемента одинаков.

</div>

{@a appendix}

{@a appendix}
## Приложение

{@a reactive-forms-api}

{@a reactive-forms-api}
### Реактивные формы API

Ниже перечислены базовые классы и службы, используемые для создания элементов управления форм и управления ими.

{@a classes}
#### Классы

<table>

  <tr>

    <th>
      Класс
    </th>

    <th>
      Описание
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>AbstractControl</code>
    </td>

    <td>

      Абстрактный базовый класс для классов управления конкретной формой `FormControl`, `FormGroup`, и `FormArray` . Это обеспечивает их общее поведение и свойства.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControl</code>
    </td>

    <td>

      Управляет значением и статусом статуса отдельного элемента управления формы. Это соответствует элементу управления формы HTML, например: `<input>` или `<select>`.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroup</code>
    </td>

    <td>

      Управляет значением и состоянием действительности группы `AbstractControl` экземпляры. Свойства группы включают ее дочерние элементы управления. Форма верхнего уровня в вашем компоненте `FormGroup`.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArray</code>
    </td>

    <td>

    Управляет значением и состоянием достоверности численно индексированного массива `AbstractControl` экземпляры.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormBuilder</code>
    </td>

    <td>

      Инъекционная служба, которая предоставляет фабричные методы для создания экземпляров управления.

    </td>

  </tr>

</table>

{@a directives}
#### Директивы

<table>

  <tr>

    <th>
      Директива
    </th>

    <th>
      Описание
    </th>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlDirective</code>
    </td>

    <td>

      Синхронизирует автономный `FormControl` для элемента управления формы.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormControlName</code>
    </td>

    <td>

      синхронизирующие `FormControl` в существующем `FormGroup` в элемент управления формы по имени.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupDirective</code>
    </td>

    <td>

      Синхронизирует существующий `FormGroup` для элемента DOM.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormGroupName</code>
    </td>

    <td>

      Синхронизирует вложенный `FormGroup` для элемента DOM.

    </td>

  </tr>

  <tr>

    <td style="vertical-align: top">
      <code>FormArrayName</code>
    </td>

    <td>

      Синхронизирует вложенный `FormArray` для элемента DOM.

    </td>

  </tr>

</table>
