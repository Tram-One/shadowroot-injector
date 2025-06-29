# ShadowRoot Injector

_🪡 declaratively define shadowroots to repeat in HTML templates_

## Example

```html
<!-- first, build a template that will be picked up by the ShadowRoot Injector -->
<template sr-tagname="highlightable-title" sr-mode="open">
  <style>
    :host {
      display: block;
    }
  </style>
  <h1>Hello <slot></slot></h1>
</template>

<!-- second, have instances of the component (we will automatically insert a shadow root) -->
<highlightable-title>World</highlightable-title>

<!-- third (optional), upgrade the component with dynamic behavior -->
<script>
  customElements.define(
    'highlightable-title',
    class extends HTMLElement {
      connectedCallback() {
        this.addEventListener('click', () => {
          this.style.background = 'yellow';
        });
      }
    },
  );
</script>
```

## How to use

You can include ShadowRoot Injector by using a CDN of your choice. In the script tag you can include `sr-autostart` to
automatically kick off the mutation observers that look for and inject shadow root templates

```html
<script src="https://unpkg.com/shadowroot-injector@1" sr-autostart></script>
```
