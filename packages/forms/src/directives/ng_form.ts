/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterViewInit, Directive, EventEmitter, forwardRef, Inject, Input, Optional, Self} from '@angular/core';

import {AbstractControl, FormControl, FormGroup, FormHooks} from '../model';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS} from '../validators';

import {ControlContainer} from './control_container';
import {Form} from './form_interface';
import {NgControl} from './ng_control';
import {NgModel} from './ng_model';
import {NgModelGroup} from './ng_model_group';
import {composeAsyncValidators, composeValidators, removeDir, setUpControl, setUpFormContainer, syncPendingControls} from './shared';

export const formDirectiveProvider: any = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};

const resolvedPromise = (() => Promise.resolve(null))();

/**
 *  @description
 * Создает верхний уровень `FormGroup` экземпляри связывает егоформу.
 * отслеживать совокупное значение формы и статус проверки.
 *
 * Как только вы импортируете `FormsModule` , эта директива становится активной по умолчанию
 * все `<form>` теги. Вам не нужно добавлять специальный селектор.
 *
 * Вы можете экспортировать директиву в локальную переменную шаблона, используя `ngForm` в качестве ключа
 * (ex: `#myForm="ngForm"`). Это необязательно, но полезно. Многие свойства из базового
 *  `FormGroup`дублируется в самой директиве, поэтому ссылка на нее
 * дает вам доступ к совокупному значению и статусу действительности формы, а также
 * свойства взаимодействия с пользователем, такие как `dirty` и `touched`.
 *
 * Для регистрации дочерних элементов с формой, используйте `NgModel` с `name`
 * атрибут. Вы можете использовать `NgModelGroup` создать подгруппы в форме.
 *
 * Если необходимо, прослушайтедирективы `ngSubmit` событиекоторое будет уведомлено, когда пользователь получит
 * вызвал отправку формы. `ngSubmit` событие излучает первоначальнуюформу.
 * событие представления.
 *
 * В основе шаблонов форм, все `<form>` тегиавтоматически помечаются как `NgForm` NgForm.
 * Чтобы импортировать `FormsModule` но пропустить его использование в некоторыхформах.
 * например, использовать встроенную проверку HTML5, добавьте `ngNoForm` и `<form>`
 * теги не будут создавать `NgForm` директиву. В реактивных формах, используя `ngNoForm` есть
 * не нужно, потому что `<form>` тегиинертны. В этом случае вы бы
 * воздерживаться от использования `formGroup` директивы formGroup.
 *
 *  @usageNotes
 *
 *  ### Прослушивание для подачи формы
 *
 * В следующем примере показано, как получить значения формы из события «ngSubmit».
 *
 *  {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 *  ### Настройка параметров обновления
 *
 * В следующем примере показано, как изменить параметр «updateOn» по умолчанию с помощью
 * ngFormOptions.
 *
 *  ```html
 *  <form [ngFormOptions]="{updateOn: 'blur'}">
 *     <input name="one" ngModel><!-- this ngModel will update on blur -->
 *  </form>
 *  ```
 *
 *  ### Родной интерфейс проверки DOM
 *
 * Чтобы пользовательский интерфейс проверки формы DOM не мешал форме Angular
 * проверка, Angular автоматически добавляет `novalidate` атрибут любого `<form>` всякийраз.
 * `FormModule` или ` ReactiveFormModule` импортируются в приложение.
 * Если вы хотите явно включить собственный пользовательский интерфейс проверки DOM с Angularи формами, вы можете добавить
 * `ngNativeValidate` атрибут в `<form>` элемента формы:
 *
 *  ```html
 *  <form ngNativeValidate>
 *    ...
 *  </form>
 *  ```
 *
 *  @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
  providers: [formDirectiveProvider],
  host: {'(submit)': 'onSubmit($event)', '(reset)': 'onReset()'},
  outputs: ['ngSubmit'],
  exportAs: 'ngForm'
})
export class NgForm extends ControlContainer implements Form, AfterViewInit {
  /**
   * @description
   * Returns whether the form submission has been triggered.
   */
  public readonly submitted: boolean = false;

  private _directives: NgModel[] = [];

  /**
   * @description
   * The `FormGroup` instance created for this form.
   */
  form: FormGroup;

  /**
   * @description
   * Event emitter for the "ngSubmit" event
   */
  ngSubmit = new EventEmitter();

  /**
   * @description
   * Tracks options for the `NgForm` instance.
   *
   * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
   * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
   * Possible values: `'change'` | `'blur'` | `'submit'`.
   *
   */
  // TODO(issue/24571): remove '!'.
  @Input('ngFormOptions') options!: {updateOn?: FormHooks};

  constructor(
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: any[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators: any[]) {
    super();
    this.form =
        new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
  }

  /**
   * @description
   * Lifecycle method called after the view is initialized. For internal use only.
   */
  ngAfterViewInit() {
    this._setUpdateStrategy();
  }

  /**
   * @description
   * The directive instance.
   */
  get formDirective(): Form {
    return this;
  }

  /**
   * @description
   * The internal `FormGroup` instance.
   */
  get control(): FormGroup {
    return this.form;
  }

  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it is always an empty array.
   */
  get path(): string[] {
    return [];
  }

  /**
   * @description
   * Returns a map of the controls in this group.
   */
  get controls(): {[key: string]: AbstractControl} {
    return this.form.controls;
  }

  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * @param dir The `NgModel` directive instance.
   */
  addControl(dir: NgModel): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      (dir as {control: FormControl}).control =
          <FormControl>container.registerControl(dir.name, dir.control);
      setUpControl(dir.control, dir);
      dir.control.updateValueAndValidity({emitEvent: false});
      this._directives.push(dir);
    });
  }

  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `NgModel` directive.
   *
   * @param dir The `NgModel` directive instance.
   */
  getControl(dir: NgModel): FormControl {
    return <FormControl>this.form.get(dir.path);
  }

  /**
   * @description
   * Removes the `NgModel` instance from the internal list of directives
   *
   * @param dir The `NgModel` directive instance.
   */
  removeControl(dir: NgModel): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
      removeDir<NgModel>(this._directives, dir);
    });
  }

  /**
   * @description
   * Adds a new `NgModelGroup` directive instance to the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  addFormGroup(dir: NgModelGroup): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      const group = new FormGroup({});
      setUpFormContainer(group, dir);
      container.registerControl(dir.name, group);
      group.updateValueAndValidity({emitEvent: false});
    });
  }

  /**
   * @description
   * Removes the `NgModelGroup` directive instance from the form.
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  removeFormGroup(dir: NgModelGroup): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
    });
  }

  /**
   * @description
   * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
   *
   * @param dir The `NgModelGroup` directive instance.
   */
  getFormGroup(dir: NgModelGroup): FormGroup {
    return <FormGroup>this.form.get(dir.path);
  }

  /**
   * Sets the new value for the provided `NgControl` directive.
   *
   * @param dir The `NgControl` directive instance.
   * @param value The new value for the directive's control.
   */
  updateModel(dir: NgControl, value: any): void {
    resolvedPromise.then(() => {
      const ctrl = <FormControl>this.form.get(dir.path!);
      ctrl.setValue(value);
    });
  }

  /**
   * @description
   * Sets the value for this `FormGroup`.
   *
   * @param value The new value
   */
  setValue(value: {[key: string]: any}): void {
    this.control.setValue(value);
  }

  /**
   * @description
   * Method called when the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * @param $event The "submit" event object
   */
  onSubmit($event: Event): boolean {
    (this as {submitted: boolean}).submitted = true;
    syncPendingControls(this.form, this._directives);
    this.ngSubmit.emit($event);
    return false;
  }

  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   */
  onReset(): void {
    this.resetForm();
  }

  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * @param value The new value for the form.
   */
  resetForm(value: any = undefined): void {
    this.form.reset(value);
    (this as {submitted: boolean}).submitted = false;
  }

  private _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.form._updateOn = this.options.updateOn;
    }
  }

  /** @internal */
  _findContainer(path: string[]): FormGroup {
    path.pop();
    return path.length ? <FormGroup>this.form.get(path) : this.form;
  }
}
