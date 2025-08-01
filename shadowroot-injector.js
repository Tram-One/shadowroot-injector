// ShadowRoot Injector - 🪡 declaratively define shadowroots to repeat in HTML templates

class ShadowRootInjector extends HTMLElement {
	connectedCallback() {
		// verify that we have a child template to register
		const shadowRootTemplate = this.querySelector('template');

		// if we don't have one yet, add mutation observer for when the template is added
		if (shadowRootTemplate === null) {
			this.watchForTemplateDefinition();
		} else {
			this.applyTemplateDefinitionToDocument();
		}
	}

	/** method to add a mutation observer to watch for a child template to be added */
	watchForTemplateDefinition() {
		/** function that takes in a mutation list and determines if we've completed the template node */
		const checkAndRegisterTemplatesForMutationLists = (mutationList, observer) => {
			for (const mutation of mutationList) {
				for (const newNode of mutation?.addedNodes || []) {
					// if this is the element AFTER an injectable template, register that template for future elements
					// (this will almost always be a TEXT node, even if the next actual element would be an element)
					// if we found one, stop the mutation observer (we don't need to wait for more templates)
					const previousNode = newNode.previousSibling;
					if (previousNode && previousNode.tagName === 'TEMPLATE') {
						this.applyTemplateDefinitionToDocument();
						observer.disconnect();
					}
				}
			}
		};

		this.templateDefinitionObserver = new MutationObserver(checkAndRegisterTemplatesForMutationLists);
		this.templateDefinitionObserver.observe(this, { childList: true, subtree: true });
	}

	/** method to attach template to existing elements, and start mutation observer for any future elements */
	applyTemplateDefinitionToDocument() {
		const selector = this.getAttribute('selector');

		// see if there are any existing elements to attach a shadow root for already in the document
		const existingElements = this.ownerDocument.querySelectorAll(selector);
		existingElements.forEach((element) => {
			this.injectRegisteredTemplate(element);
		});

		// start mutation observer for any future elements that might appear in the document
		const checkAndInsertShadowRootsForMutationLists = (mutationList) => {
			for (const mutation of mutationList) {
				for (const newNode of mutation?.addedNodes || []) {
					if (newNode.matches?.(selector)) {
						this.injectRegisteredTemplate(newNode);
					}
				}
			}
		};

		// Mutation Observer to look for registered elements with known template definitions
		this.registeredElementObserver = new MutationObserver((mutationList) =>
			checkAndInsertShadowRootsForMutationLists(mutationList),
		);
		this.registeredElementObserver.observe(this.ownerDocument.documentElement, { childList: true, subtree: true });
	}

	/** method that attaches the shadow root template to a given node */
	injectRegisteredTemplate(node) {
		// if we already have a shadow root, do not attempt to inject a template
		if (node.shadowRoot) {
			return;
		}

		// build shadow root template
		const shadowRootTemplate = this.querySelector('template').cloneNode(true);
		shadowRootTemplate.setAttribute('shadowrootmode', this.getAttribute('mode'));

		// build the actual shadow root object in a placeholder (we will copy this later into real elements)
		const shadowRootPlaceholder = document.createElement('div');

		// using setHTMLUnsafe allows us to build the parsed version of the shadowRoot object
		shadowRootPlaceholder.setHTMLUnsafe(`<div>${shadowRootTemplate.outerHTML}</div>`);
		const shadowRoot = shadowRootPlaceholder.children[0].shadowRoot;

		// attach a new shadow to this element using the properties of the shadowroot object that was created
		node.attachShadow(shadowRoot);
		node.shadowRoot.append(shadowRootTemplate.content.cloneNode(true));
	}
}

customElements.define('shadowroot-for', ShadowRootInjector);

// check if we are running as a module (if we are, expose the ShadowRootInjector to be imported)
if (typeof module !== 'undefined') {
	module.exports = ShadowRootInjector;
} else {
	window.ShadowRootInjector = ShadowRootInjector;
}
