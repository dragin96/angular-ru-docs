/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Injector, Type} from '@angular/core';
import {Subscription} from 'rxjs';

import {ComponentNgElementStrategyFactory} from './component-factory-strategy';
import {NgElementStrategy, NgElementStrategyFactory} from './element-strategy';
import {createCustomEvent, getComponentInputs, getDefaultAttributeToPropertyInputs} from './utils';

/**
 * Прототип для конструктора класса на основе компонента Angular
 * это можно использовать для регистрации пользовательских элементов. Реализовано и возвращено
 * посредством{@link createCustomElement createCustomElement() function},
 *
 * @publicApi
 */
export interface NgElementConstructor<P> {
  /**
   * An array of observed attribute names for the custom element,
   * derived by transforming input property names from the source component.
   */
  readonly observedAttributes: string[];

  /**
   * Initializes a constructor instance.
   * @param injector If provided, overrides the configured injector.
   */
  new(injector?: Injector): NgElement&WithProperties<P>;
}

/**
 * Реализует функциональность, необходимую для пользовательского элемента.
 *
 * @publicApi
 */
export abstract class NgElement extends HTMLElement {
  /**
   * The strategy that controls how a component is transformed in a custom element.
   */
  // TODO(issue/24571): remove '!'.
  protected ngElementStrategy!: NgElementStrategy;
  /**
   * A subscription to change, connect, and disconnect events in the custom element.
   */
  protected ngElementEventsSubscription: Subscription|null = null;

  /**
   * Prototype for a handler that responds to a change in an observed attribute.
   * @param attrName The name of the attribute that has changed.
   * @param oldValue The previous value of the attribute.
   * @param newValue The new value of the attribute.
   * @param namespace The namespace in which the attribute is defined.
   * @returns Nothing.
   */
  abstract attributeChangedCallback(
      attrName: string, oldValue: string|null, newValue: string, namespace?: string): void;
  /**
   * Prototype for a handler that responds to the insertion of the custom element in the DOM.
   * @returns Nothing.
   */
  abstract connectedCallback(): void;
  /**
   * Prototype for a handler that responds to the deletion of the custom element from the DOM.
   * @returns Nothing.
   */
  abstract disconnectedCallback(): void;
}

/**
 * Дополнительная информация о типе, которая может быть добавлена в класс NgElement
 * для свойств, которые добавляются на основе
 * на входы и методы базового компонента.
 *
 * @publicApi
 */
export type WithProperties<P> = {
  [property in keyof P]: P[property]
};

/**
 * Конфигурация, которая инициализирует NgElementConstructor с помощью
 * зависимости и стратегию, в которую он должен превратить компонент
 * класс пользовательских элементов.
 *
 * @publicApi
 */
export interface NgElementConfig {
  /**
   * The injector to use for retrieving the component's factory.
   */
  injector: Injector;
  /**
   * An optional custom strategy factory to use instead of the default.
   * The strategy controls how the transformation is performed.
   */
  strategyFactory?: NgElementStrategyFactory;
}

/**
 *   @description Создает пользовательский класс элементов на основе компонента Angular.
 *
 * Создает класс, который инкапсулирует функциональность предоставленного компонента и
 * использует информацию о конфигурации, чтобы предоставить больше контекста классу.
 * Принимает входные и выходные данные фабрики компонентов, чтобы преобразовать их в правильные
 * Пользовательский элемент API и добавить хуки для ввода изменений.
 *
 * Инжектор конфигурации - это начальный инжектор, установленный в классе
 * и используется по умолчанию для каждого созданного экземпляра. Это поведение может быть переопределено с помощью
 * статическое свойство, влияющее на все вновь создаваемые экземпляры, или как аргумент конструктора для
 * одноразовые творения.
 *
 *  @param компонент Компонент для преобразования.
 *  @param config Конфигурация, которая предоставляет информацию об инициализации для созданного класса.
 *  @returns Класс конструкции нестандартного элемента, который можно зарегистрировать в
 * броузера `CustomElementRegistry` CustomElementRegistry.
 *
 * @publicApi
 */
export function createCustomElement<P>(
    component: Type<any>, config: NgElementConfig): NgElementConstructor<P> {
  const inputs = getComponentInputs(component, config.injector);

  const strategyFactory =
      config.strategyFactory || new ComponentNgElementStrategyFactory(component, config.injector);

  const attributeToPropertyInputs = getDefaultAttributeToPropertyInputs(inputs);

  class NgElementImpl extends NgElement {
    // Work around a bug in closure typed optimizations(b/79557487) where it is not honoring static
    // field externs. So using quoted access to explicitly prevent renaming.
    static readonly['observedAttributes'] = Object.keys(attributeToPropertyInputs);

    constructor(injector?: Injector) {
      super();

      // Note that some polyfills (e.g. document-register-element) do not call the constructor.
      // Do not assume this strategy has been created.
      // TODO(andrewseguin): Add e2e tests that cover cases where the constructor isn't called. For
      // now this is tested using a Google internal test suite.
      this.ngElementStrategy = strategyFactory.create(injector || config.injector);
    }

    attributeChangedCallback(
        attrName: string, oldValue: string|null, newValue: string, namespace?: string): void {
      if (!this.ngElementStrategy) {
        this.ngElementStrategy = strategyFactory.create(config.injector);
      }

      const propName = attributeToPropertyInputs[attrName]!;
      this.ngElementStrategy.setInputValue(propName, newValue);
    }

    connectedCallback(): void {
      if (!this.ngElementStrategy) {
        this.ngElementStrategy = strategyFactory.create(config.injector);
      }

      this.ngElementStrategy.connect(this);

      // Listen for events from the strategy and dispatch them as custom events
      this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe(e => {
        const customEvent = createCustomEvent(this.ownerDocument!, e.name, e.value);
        this.dispatchEvent(customEvent);
      });
    }

    disconnectedCallback(): void {
      if (this.ngElementStrategy) {
        this.ngElementStrategy.disconnect();
      }

      if (this.ngElementEventsSubscription) {
        this.ngElementEventsSubscription.unsubscribe();
        this.ngElementEventsSubscription = null;
      }
    }
  }

  // Add getters and setters to the prototype for each property input. If the config does not
  // contain property inputs, use all inputs by default.
  inputs.map(({propName}) => propName).forEach(property => {
    Object.defineProperty(NgElementImpl.prototype, property, {
      get: function() {
        return this.ngElementStrategy.getInputValue(property);
      },
      set: function(newValue: any) {
        this.ngElementStrategy.setInputValue(property, newValue);
      },
      configurable: true,
      enumerable: true,
    });
  });

  return (NgElementImpl as any) as NgElementConstructor<P>;
}
