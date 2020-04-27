/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {SimpleChanges} from './simple_change';


/**
 *  @description
 * Хук жизненного цикла, который вызывается при изменении любого привязанного к данным свойства директивы.
 * Определите `ngOnChanges()` для обработки изменений.
 *
 *  @see `DoCheck`
 *  @see `OnInit`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить обработчик изменений для входного свойства.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnChanges'}
 *
 * @publicApi
 */
export interface OnChanges {
  /**
   * A callback method that is invoked immediately after the
   * default change detector has checked data-bound properties
   * if at least one has changed, and before the view and content
   * children are checked.
   * @param changes The changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void;
}

/**
 *  @description
 * Хук жизненного цикла, который вызывается после инициализации Angular
 * все связанные с данными свойства директивы.
 * Определите `ngOnInit()` для обработки любых дополнительных задач инициализации.
 *
 *  @see `AfterContentInit`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свой собственный метод инициализации.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnInit'}
 *
 * @publicApi
 */
export interface OnInit {
  /**
   * A callback method that is invoked immediately after the
   * default change detector has checked the directive's
   * data-bound properties for the first time,
   * and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  ngOnInit(): void;
}

/**
 * Хук жизненного цикла, который вызывает пользовательскую функцию обнаружения изменений для директивы
 * в дополнение к проверке, выполненной детектором изменений по умолчанию.
 *
 * Алгоритм обнаружения изменений по умолчанию ищет различия путем сравнения
 * значения связанных свойств по ссылке во время прогонов обнаружения изменений. Вы можете использовать это
 * крючок для проверки и реагирования на изменения другими способами.
 *
 * Когда детектор изменения по умолчанию обнаруживает изменения, он вызывает `ngOnChanges()` если,.
 * независимо от того, выполняете ли вы дополнительное обнаружение изменений.
 * правило, вы не должны использовать как `DoCheck` и `OnChanges` чтобыреагировать.
 * изменения на том же входе.
 *
 *  @see `OnChanges`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * вызвать свой собственный цикл обнаружения изменений.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='DoCheck'}
 *
 * @publicApi
 */
export interface DoCheck {
  /**
   * A callback method that performs change-detection, invoked
   * after the default change-detector runs.
   * See `KeyValueDiffers` and `IterableDiffers` for implementing
   * custom change checking for collections.
   *
   */
  ngDoCheck(): void;
}

/**
 * Хук жизненного цикла, который вызывается при уничтожении директивы, канала или службы.
 * Используйте для любой пользовательской очистки, которая должна произойти, когда
 * Экземпляр уничтожен.
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свой собственный метод очистки.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='OnDestroy'}
 *
 * @publicApi
 */
export interface OnDestroy {
  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  ngOnDestroy(): void;
}

/**
 *  @description
 * Хук жизненного цикла, который вызывается после полной инициализации Angular
 * все содержание директивы.
 * Определите `ngAfterContentInit()` для обработки любых дополнительных задач инициализации.
 *
 *  @see `OnInit`
 *  @see `AfterViewInit`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свой метод инициализации контента.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='AfterContentInit'}
 *
 * @publicApi
 */
export interface AfterContentInit {
  /**
   * A callback method that is invoked immediately after
   * Angular has completed initialization of all of the directive's
   * content.
   * It is invoked only once when the directive is instantiated.
   */
  ngAfterContentInit(): void;
}

/**
 *  @description
 * Хук жизненного цикла, который вызывается после того, как детектор изменений по умолчанию имеет
 * завершена проверка всего содержимого директивы.
 *
 *  @see `AfterViewChecked`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свою собственную функцию после проверки.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='AfterContentChecked'}
 *
 * @publicApi
 */
export interface AfterContentChecked {
  /**
   * A callback method that is invoked immediately after the
   * default change detector has completed checking all of the directive's
   * content.
   */
  ngAfterContentChecked(): void;
}

/**
 *  @description
 * Хук жизненного цикла, который вызывается после полной инициализации Angular
 * вид компонента.
 * Определите `ngAfterViewInit()` для обработки любых дополнительных задач инициализации.
 *
 *  @see `OnInit`
 *  @see `AfterContentInit`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свой собственный метод инициализации представления.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='AfterViewInit'}
 *
 * @publicApi
 */
export interface AfterViewInit {
  /**
   * A callback method that is invoked immediately after
   * Angular has completed initialization of a component's view.
   * It is invoked only once when the view is instantiated.
   *
   */
  ngAfterViewInit(): void;
}

/**
 *  @description
 * Хук жизненного цикла, который вызывается после того, как детектор изменений по умолчанию имеет
 * завершена проверка вида компонента на наличие изменений.
 *
 *  @see `AfterContentChecked`
 *  @see [Lifecycle Hooks](guide/lifecycle-hooks#onchanges)руководство
 *
 *  @usageNotes
 * В следующем фрагменте показано, как компонент может реализовать этот интерфейс
 * определить свою собственную функцию после проверки.
 *
 *  {@example core/ts/metadata/lifecycle_hooks_spec.ts region='AfterViewChecked'}
 *
 * @publicApi
 */
export interface AfterViewChecked {
  /**
   * A callback method that is invoked immediately after the
   * default change detector has completed one change-check cycle
   * for a component's view.
   */
  ngAfterViewChecked(): void;
}
