/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AnimationMetadata, AnimationOptions} from './animation_metadata';
import {AnimationPlayer} from './players/animation_player';

/**
 * Инъецируемый сервис, который программно создает последовательность анимации в
 * Angular компонент или директива.
 * Предоставляется `BrowserAnimationsModule` или `NoopAnimationsModule`.
 *
 *  @usageNotes
 *
 * Чтобы использовать этот сервис, добавьте его в свой компонент или директиву в качестве зависимости.
 * Служба создается вместе с вашим компонентом.
 *
 * Приложения, как правило, не нуждаются в создании собственных проигрывателей анимации, но, если вы
 * сделать необходимость, выполните следующиедействия:.
 *
 *  1. Используйте метод `build()` для создания программной анимации с использованием
 *  `animate()`функция. Метод возвращает `AnimationFactory` экземпляр.
 *
 * 2. Используйте фабричный объект, чтобы создать `AnimationPlayer` и прикрепить его к элементу DOM.
 *
 * 3. Используйте объект проигрывателя для программного управления анимацией.
 *
 * Например:.
 *
 *  ```ts
 *  // import the service from BrowserAnimationsModule
 *  import {AnimationBuilder} from '@angular/animations';
 *  // require the service as a dependency
 *  class MyCmp {
 *    constructor(private _builder: AnimationBuilder) {}
 *
 *    makeAnimation(element: any) {
 *      // first define a reusable animation
 *      const myAnimation = this._builder.build([
 *        style({ width: 0 }),
 *        animate(1000, style({ width: '100px' }))
 *      ]);
 *
 *      // use the returned factory object to create a player
 *      const player = myAnimation.create(element);
 *
 *      player.play();
 *    }
 *  }
 *  ```
 *
 * @publicApi
 */
export abstract class AnimationBuilder {
  /**
   * Builds a factory for producing a defined animation.
   * @param animation A reusable animation definition.
   * @returns A factory object that can create a player for the defined animation.
   * @see `animate()`
   */
  abstract build(animation: AnimationMetadata|AnimationMetadata[]): AnimationFactory;
}

/**
 * Фабричный объект, возвращенный из `AnimationBuilder` . `build()` метод.
 *
 * @publicApi
 */
export abstract class AnimationFactory {
  /**
   * Creates an `AnimationPlayer` instance for the reusable animation defined by
   * the `AnimationBuilder`.`build()` method that created this factory.
   * Attaches the new player a DOM element.
   * @param element The DOM element to which to attach the animation.
   * @param options A set of options that can include a time delay and
   * additional developer-defined parameters.
   */
  abstract create(element: any, options?: AnimationOptions): AnimationPlayer;
}
