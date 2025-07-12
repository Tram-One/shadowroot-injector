# ShadowRoot Injector

_🪡 declaratively define shadowroots to repeat in HTML templates_

## What is ShadowRoot Injector?

ShadowRoot Injector lets you define templates for custom elements using HTML. When those elements appear in the DOM, the
library will automatically insert the template you defined into the element. You can then, optionally, upgrade the
element using native web-component definitions (either inline in a script tag, or imported as a separate component
definition).

### Example

```html
<!-- 1. Auto-start the injector -->
<script src="https://unpkg.com/shadowroot-injector@1" sr-autostart></script>

<!-- 2. Define a generic <linked-header> -->
<template sr-tagname="callout-alert" sr-mode="open">
  <style>
    :host,
    slot {
      display: block;
    }

    details {
      display: block;
      border-left: solid 3px rgb(var(--callout-color));
      background: rgba(var(--callout-color), 0.1);
      padding: 0.5em;
    }

    summary {
      font-weight: bold;
      color: rgb(var(--callout-color));
      list-style: none;
    }
  </style>

  <details open>
    <summary><slot name="title"></slot></summary>
    <slot></slot>
  </details>
</template>

<!-- 3. Use it anywhere -->
<p>ShadowRoot Injector lets you repeat templates easily, no JS required!</p>

<callout-alert style="--callout-color: 160, 40, 40;">
  <span slot="title">Pro Tip!</span>
  If you want to add more behavior, you can upgrade custom-elements into web-components any time with JavaScript!
</callout-alert>

<p>You can check out the repository on Github.</p>

<callout-alert style="--callout-color: 40, 40, 160;">
  <span slot="title">PRs Welcome!</span>
  You can make git issues or pull requests for any issues you find.
</callout-alert>
```

### Why?

Today, there isn't a native or elegant way to repeat HTML content across the document without building a javascript
component definition. For many simple authoring use-cases, just having a template that should appear is all that web
authors need. This library gives you an easy and elegant way to do that, without the boilerplate or complexities
associated with building javascript class definitions.

## How to use

You can include ShadowRoot Injector by using a CDN of your choice. In the script tag you can include `sr-autostart` to
automatically kick off the mutation observers that look for and inject shadow root templates.

```html
<script src="https://unpkg.com/shadowroot-injector@1" sr-autostart></script>
```

You can also use the minified version by pointing to the minified asset

```html
<script src="https://unpkg.com/shadowroot-injector@1/shadowroot-injector.min.js" sr-autostart></script>
```

### HTML API

The HTML API is completely driven by attributes on the `<template>` tag. When you include both of the following
attributes, ShadowRoot Injector will automatically kick off and register these templates to be used for custom elements.

<dl>
  <dt><code>sr-tagname</code></dt>
  <dd>The custom element tagname to associate with this template. When these elements appear in the DOM, we'll automatically inject a template into them. They should be a hyphenated custom element name (although they do not have to be a defined web-component).</dd>

  <dt><code>sr-mode</code></dt>
  <dd>The <a href="https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/mode">ShadowRoot mode property</a>. This must be defined as a valid value for ShadowRoot modes, either <code>open</code> or <code>closed</code>.</dd>
</dl>

You may also include any valid
[ShadowRoot template properties](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/template#attributes),
for example, `shadowrootdelegatesfocus`, `shadowrootclonable`, or even `shadowrootcustomelementregistry`.

### JS API

While not required, you can use the JavaScript API to interface directly with the ShadowRoot Injector library. This can
also be useful when you need to control when the shadow root is injected in more complex web components.

The `ShadowRootInjector` class is available as a default export of the script. All the API methods below are method
calls you can make on an instance of the `ShadowRootInjector` class.

```js
const ShadowRootInjector = require('shadowroot-injector');
const injector = new ShadowRootInjector();
```

<!-- prettier-ignore -->
> [!note]
> If you include `sr-autostart` in the script you used to import, an instance of the ShadowRoot Injector will
> already be running and available to access as part of `window.shadowRootInjector`

<dl>
  <dt><code>shadowRootInjector.registerTemplateDefinition(template: HTMLTemplateElement)</code></dt>
  <dd>This function takes in a template node (as described above in the HTML API) and registers it for use later. This is useful if you want to programmatically add templates, or want to do so manually, without a observer on the page.</dd>

  <dt><code>shadowRootInjector.injectRegisteredTemplate(node: HTMLElement)</code></dt>
  <dd>This function takes in an HTML Element, and injects a known (registered) ShadowRoot template.</dd>

  <dt><code>shadowRootInjector.startObservers()</code></dt>
  <dd>This function starts the Mutation Observers associated with detecting new templates to register (calling <code>registerTemplateDefinition</code>), and finding custom elements to insert templates into (calling <code>injectRegisteredTemplate</code>).</dd>

  <dt><code>shadowRootInjector.stopObservers()</code></dt>
  <dd>This function stops the observers started by <code>startObservers</code>.</dd>
</dl>

## Task List Example

To see these APIs come together, lets look at a more complex Task List example, step by step (you can see the entire
file in `example/task-list.html`).

First, we'll import the library, and use the `sr-autostart` attribute to immediately start the observers that watch for
template definitions, and instances of registered elements.

```html
<script src="https://unpkg.com/shadowroot-injector@1" sr-autostart></script>
```

Next we'll build a template definition for a single `task-item`. It has some styles, and some basic markup.

```html
<template sr-tagname="task-item" sr-mode="open">
  <style>
    :host {
      display: list-item;
    }
    li {
      display: flex;
      gap: 12px;
    }
  </style>
  <li>
    <slot></slot>
    <button>remove</button>
  </li>
</template>
```

We'll create a list to hold some hard-coded task items.

```html
<ul id="taskList">
  <task-item>Add Items</task-item>
  <task-item>Remove Items</task-item>
</ul>
```

If we stopped here, the task items would present as we'd expect, but wouldn't be interactive. To make it interactive,
we'll upgrade our `task-item` custom element into a web component, with event listeners and all. Any existing
`task-item` elements in the page will upgrade automatically.

<!-- prettier-ignore -->
> [!important]
> In the `connectedCallback`, we call `shadowRootInjector.injectRegisteredTemplate(this);`. By doing this,
> we'll ensure that we have access to shadowRoot elements for the rest of the function.

```html
<script>
  customElements.define(
    'task-item',
    class extends HTMLElement {
      connectedCallback() {
        shadowRootInjector.injectRegisteredTemplate(this);
        this.shadowRoot.querySelector('button').addEventListener('click', () => {
          this.remove();
        });
      }
    },
  );
</script>
```

Finally we add a control to create new `task-item` elements. Any new `task-items` created will be defined by the class
definition above.

<!-- prettier-ignore -->
> [!note]
> If we hadn't called `shadowRootInjector.injectRegisteredTemplate` directly, the ShadowRootInjector library would still
> inject shadowRoot templates after the element was attached to the page.

```html
<label>
  Add Task
  <input id="addTaskInput" type="text" />
</label>

<script>
  addTaskInput.addEventListener('keyup', (event) => {
    if (event.code === 'Enter') {
      const newListItem = document.createElement('task-item');
      newListItem.textContent = addTaskInput.value;
      addTaskInput.value = '';
      taskList.append(newListItem);
    }
  });
</script>
```

## Contributions / Discussions

If you think this is useful or interesting, I'd love to hear your thoughts! Feel free to
[reach out to me on mastodon](https://fosstodon.org/@jrjurman), or join the
[Tram-One discord](https://discord.gg/dpBXAQC).
