/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {injectChangeDetectorRef as render3InjectChangeDetectorRef} from '../render3/view_engine_compatibility';

/**
 * Базовый класс для Angular Views, обеспечивает функциональность обнаружения изменений.
 * Дерево обнаружения изменений собирает все представления, которые должны быть проверены на наличие изменений.
 * Используйте методы для добавления и удаления вида из дерева, инициироватьизменение-обнаружение,.
 * и явно помечать представления как _dirty_, что означает, что они изменились и требуют повторного отображения.
 *
 *  @usageNotes
 *
 * В следующих примерах показано, как изменить поведение обнаружения изменений по умолчанию
 * выполнять явное обнаружение при необходимости.
 *
 *  ### Используйте `markForCheck()` со `CheckOnce` стратегией
 *
 * В следующем примере `OnPush` стратегия обнаружения измененийдля компонента
 * (`CheckOnce` , а непо умолчанию `CheckAlways`), затемвторую проверку
 * после перерыва. Смотрите[живое демо](http://plnkr.co/edit/GC512b?p=preview).
 *
 *  <code-example path="core/ts/change_detect/change-detection.ts"
 *  region="mark-for-check"></code-example>
 *
 *  ### Отсоедините детектор изменений, чтобы ограничить частоту проверки
 *
 * В следующем примере определяется компонент с большим списком данных только для чтения
 * ожидается, что он будет меняться постоянно, много раз в секунду.
 * Чтобы повысить производительность, мы хотим проверить и обновить список
 * реже, чем происходят изменения. Для этого мы отсоединяемся
 * детектор изменений компонента и выполнять явную локальную проверку каждые пять секунд.
 *
 *  <code-example path="core/ts/change_detect/change-detection.ts" region="detach"></code-example>
 *
 *
 *  ### Присоединение отдельного компонента
 *
 * В следующем примере создается компонент, отображающий текущие данные.
 * Компонент отсоединяет свой детектор изменений от основного дерева детекторов изменений
 * когда `live` установлено в false и повторно присоединяет его, когда свойство
 * становится правдой.
 *
 *  <code-example path="core/ts/change_detect/change-detection.ts" region="reattach"></code-example>
 *
 * @publicApi
 */
export abstract class ChangeDetectorRef {
  /**
   * When a view uses the {@link ChangeDetectionStrategy#OnPush OnPush} (checkOnce)
   * change detection strategy, explicitly marks the view as changed so that
   * it can be checked again.
   *
   * Components are normally marked as dirty (in need of rerendering) when inputs
   * have changed or events have fired in the view. Call this method to ensure that
   * a component is checked even if these triggers have not occured.
   *
   * <!-- TODO: Add a link to a chapter on OnPush components -->
   *
   */
  abstract markForCheck(): void;

  /**
   * Detaches this view from the change-detection tree.
   * A detached view is  not checked until it is reattached.
   * Use in combination with `detectChanges()` to implement local change detection checks.
   *
   * Detached views are not checked during change detection runs until they are
   * re-attached, even if they are marked as dirty.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   */
  abstract detach(): void;

  /**
   * Checks this view and its children. Use in combination with {@link ChangeDetectorRef#detach
   * detach}
   * to implement local change detection checks.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   * <!-- TODO: Add a live demo once ref.detectChanges is merged into master -->
   *
   */
  abstract detectChanges(): void;

  /**
   * Checks the change detector and its children, and throws if any changes are detected.
   *
   * Use in development mode to verify that running change detection doesn't introduce
   * other changes.
   */
  abstract checkNoChanges(): void;

  /**
   * Re-attaches the previously detached view to the change detection tree.
   * Views are attached to the tree by default.
   *
   * <!-- TODO: Add a link to a chapter on detach/reattach/local digest -->
   *
   */
  abstract reattach(): void;

  /**
   * @internal
   * @nocollapse
   */
  static __NG_ELEMENT_ID__: () => ChangeDetectorRef = () => SWITCH_CHANGE_DETECTOR_REF_FACTORY();
}



export const SWITCH_CHANGE_DETECTOR_REF_FACTORY__POST_R3__ = render3InjectChangeDetectorRef;
const SWITCH_CHANGE_DETECTOR_REF_FACTORY__PRE_R3__ = (...args: any[]): any => {};
const SWITCH_CHANGE_DETECTOR_REF_FACTORY: typeof render3InjectChangeDetectorRef =
    SWITCH_CHANGE_DETECTOR_REF_FACTORY__PRE_R3__;
