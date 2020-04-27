{@a renderer-to-renderer2-migration}
# `Renderer ` to ` Renderer2` миграция

{@a migration-overview}
## Обзор миграции

 `Renderer` Класс помечен как устаревший с версии Angular 4
В этом разделе приведены рекомендации по переходу с этого устаревшего API на более новый. `Renderer2` API и его значение для вашего приложения.

{@a why-should-i-migrate-to-renderer2}
## Почему я должен перейти на Renderer2?

Устаревший `Renderer` Класс был удален в версии 9 Angular, поэтому необходимо перейти на поддерживаемый API.
С помощью `Renderer2` является рекомендуемой стратегией, поскольку он поддерживает набор функций, аналогичный `Renderer`.
Поверхность API довольно велика (с 19 методами), но схема должна упростить этот процесс для ваших приложений.

{@a is-there-action-required-on-my-end}
## Требуются ли действия с моей стороны?

No.
Схема должна обрабатывать большинство случаев, за исключением `Renderer.animate()` и `Renderer.setDebugInfo()`, которые уже не поддерживаются.

{@a what-are-the-ngrendererx-methods-why-are-they-necessary}
## Каковы `__ngRendererX` методы? Зачем они нужны?

Некоторые методы либо не имеют точных эквивалентов в `Renderer2`, или они соответствуют более чем одному выражению.
Например, оба рендера имеют `createElement()` метод, но они не равны, потому что такой вызов `renderer.createElement(parentNode, namespaceAndName) ` в ` Renderer` соответствует следующему блоку кода в `Renderer2` :

```ts
const [namespace, name] = splitNamespace(namespaceAndName);
const el = renderer.createElement(name, namespace);
if (parentNode) {
  renderer.appendChild(parentNode, el);
}
return el;
```

Миграция должна гарантировать, что возвращаемые значения функций и типов переменных остаются прежними.
Для безопасной обработки большинства случаев схема объявляет вспомогательные функции внизу файла пользователя.
Эти помощники инкапсулируют вашу собственную логику и сводят замены внутри вашего кода к одному вызову функции.
Вот пример того, как `createElement()` миграция выглядит:


**Перед тем как :**

```ts
public createAndAppendElement() {
  const el = this.renderer.createElement('span');
  el.textContent = 'hello world';
  return el;
}
```

**После того, как :**

<code-example>

public createAndAppendElement() {
  const el = __ngRendererCreateElement(this.renderer, this.element, 'span');
  el.textContent = 'hello world';
  return el;
}
// Generated code at the bottom of the file
__ngRendererCreateElement(renderer: any, parentNode: any, nameAndNamespace: any) {
  const [namespace, name] = __ngRendererSplitNamespace(namespaceAndName);
  const el = renderer.createElement(name, namespace);
  if (parentNode) {
    renderer.appendChild(parentNode, el);
  }
  return el;
}
__ngRendererSplitNamespace(nameAndNamespace: any) {
  // returns the split name and namespace
}

</code-example>

При реализации этих вспомогательных функций схема гарантирует, что они объявляются только один раз для каждого файла и что их имена достаточно уникальны, поэтому существует небольшая вероятность столкновения с уже существующими функциями в вашем коде. Схема также сохраняет свои типы параметров как `any` чтобы не пришлось вставлять дополнительную логику, которая гарантирует, что их значения имеют правильный тип.

{@a i’m-a-library-author.-should-i-run-this-migration}
### Я автор библиотеки. Должен ли я запустить эту миграцию?

**Авторы библиотеки обязательно должны использовать эту миграцию, чтобы отойти от `Renderer` . В противном случае библиотеки не будут работать с приложениями, созданными в версии 9**


{@a full-list-of-method-migrations}
### Полный список методов миграции

В следующей таблице показаны все методы, из которых переносится карта `Renderer` to `Renderer2`.

| Renderer | Renderer2 |
| --- | --- |
| `listen(renderElement, name, callback) ` | ` listen(renderElement, name, callback)` |
| `setElementProperty(renderElement, propertyName, propertyValue) ` | ` setProperty(renderElement, propertyName, propertyValue)` |
| `setText(renderNode, text) ` | ` setValue(renderNode, text)` |
| `listenGlobal(target, name, callback) ` | ` listen(target, name, callback)` |
| `selectRootElement(selectorOrNode, debugInfo?) ` | ` selectRootElement(selectorOrNode)` |
| `createElement(parentElement, name, debugInfo?) ` | ` appendChild(parentElement, createElement(name))` |
| `setElementStyle(el, style, value?) ` | ` value == null ? removeStyle(el, style) : setStyle(el, style, value)` 
| `setElementAttribute(el, name, value?) ` | ` attributeValue == null ? removeAttribute(el, name) : setAttribute(el, name, value)` 
| `createText(parentElement, value, debugInfo?) ` | ` appendChild(parentElement, createText(value))` |
| `createTemplateAnchor(parentElement)` | `appendChild(parentElement, createComment(''))` |
| `setElementClass(renderElement, className, isAdd) ` | ` isAdd ? addClass(renderElement, className) : removeClass(renderElement, className)` |
| `projectNodes(parentElement, nodes) ` | ` for (let i = 0; i < nodes.length; i++) { appendChild(parentElement, nodes[i]); }` |
| `attachViewAfter(node, viewRootNodes) ` | ` const parentElement = parentNode(node); const nextSibling = nextSibling(node); for (let i = 0; i < viewRootNodes.length; i++) { insertBefore(parentElement, viewRootNodes[i], nextSibling);}` |
| `detachView(viewRootNodes)` | `for (let i = 0; i < viewRootNodes.length; i++) {const node = viewRootNodes[i]; const parentElement = parentNode(node); removeChild(parentElement, node);}` |
| `destroyView(hostElement, viewAllNodes) ` | ` for (let i = 0; i < viewAllNodes.length; i++) { destroyNode(viewAllNodes[i]); }` |
| `setBindingDebugInfo()` | Эта функция является noop в `Renderer2` . |
| `createViewRoot(hostElement)` | Должен быть заменен ссылкой на `hostElement` |
| `invokeElementMethod(renderElement, methodName, args?) ` | ` (renderElement as any)[methodName].apply(renderElement, args);` |
| `animate(element, startingStyles, keyframes, duration, delay, easing, previousPlayers?)` | Выдает ошибку (такое же поведение, как `Renderer.animate()` ) |
