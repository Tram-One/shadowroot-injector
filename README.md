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

    div {
      display: block;
      border-left: solid 3px rgb(var(--callout-color));
      background: rgba(var(--callout-color), 0.1);
      padding: 0.5em;
    }

    slot[name='title'] {
      font-weight: bold;
      color: rgb(var(--callout-color));
    }
  </style>

  <div>
    <slot name="title"></slot>
    <slot></slot>
  </div>
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

While not required, you can use the JavaScript API to interface directly with the ShadowRoot Injector library.

<dl>
  <dt><code>ShadowRootInjector.registerTemplateDefinition(template: HTMLTemplateElement)</code></dt>
  <dd>This function takes in a template node (as described above in the HTML API) and registers it for use later. This is useful if you want to programmatically add templates, or want to do so manually, without a observer on the page.</dd>

  <dt><code>ShadowRootInjector.injectRegisteredTemplate(node: HTMLElement)</code></dt>
  <dd>This function takes in an HTML Element, and injects a known (registered) ShadowRoot template.</dd>

  <dt><code>ShadowRootInjector.startObservers</code></dt>
  <dd>This function starts the Mutation Observers associated with detecting new templates to register (calling <code>registerTemplateDefinition</code>), and finding custom elements to insert templates into (calling <code>injectRegisteredTemplate</code>).</dd>

  <dt><code>ShadowRootInjector.stopObservers</code></dt>
  <dd>This function stops the observers started by <code>startObservers</code>.</dd>
</dl>

<!-- prettier-ignore -->
> [!note]
> If you include `sr-autostart` in the script you used to import, an instance of the ShadowRoot Injector will
> already be running and available to access as part of `window.shadowRootInjector`
