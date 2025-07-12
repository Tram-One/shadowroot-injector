// ShadowRoot Injector - 🪡 declaratively define shadowroots to repeat in HTML templates

class ShadowRootInjector {
	constructor() {
		// map of known element tag names to shadow root template definitions
		this.shadowRootInjectorElementMap = new Map();

		/** function that takes in a mutation list and registers any templates as element definitions */
		const checkAndRegisterTemplatesForMutationLists = (mutationList) => {
			for (const mutation of mutationList) {
				for (const newNode of mutation?.addedNodes || []) {
					// if this is the element AFTER an injectable template, register that template for future elements
					// (this will almost always be a TEXT node, even if the next actual element would be an element)
					const previousNode = newNode.previousSibling;
					if (previousNode && previousNode.tagName === 'TEMPLATE' && previousNode.hasAttribute('sr-mode')) {
						this.registerTemplateDefinition(previousNode);
					}
				}
			}
		};

		// Mutation Observer to register templates as known element definitions
		this.templateDefinitionObserver = new MutationObserver((mutationList) => {
			checkAndRegisterTemplatesForMutationLists(mutationList);
		});

		/** function that takes in a mutation list and inserts templates for already registered elements */
		const checkAndInsertShadowRootsForMutationLists = (mutationList) => {
			for (const mutation of mutationList) {
				for (const newNode of mutation?.addedNodes || []) {
					const newNodeTagName = newNode.tagName;
					if (this.shadowRootInjectorElementMap.has(newNodeTagName)) {
						this.injectRegisteredTemplate(newNode);
					}
				}
			}
		};

		// Mutation Observer to look for registered elements with known template definitions
		this.registeredElementObserver = new MutationObserver((mutationList) =>
			checkAndInsertShadowRootsForMutationLists(mutationList),
		);
	}

	/** function that registers a template to be used later with custom elements */
	registerTemplateDefinition(template) {
		const tagName = template.getAttribute('sr-tagname');
		// to be able to actually attach a shadowroot, we'll clone and set the shadowroot mode
		const shadowRootTemplate = template.cloneNode(true);
		shadowRootTemplate.setAttribute('shadowrootmode', template.getAttribute('sr-mode'));
		shadowRootTemplate.removeAttribute('sr-tagname');
		shadowRootTemplate.removeAttribute('sr-mode');
		this.shadowRootInjectorElementMap.set(tagName.toUpperCase(), shadowRootTemplate);
	}

	/** function that attaches a registered shadow root template to a given node */
	injectRegisteredTemplate(node) {
		// if we already have a shadow root, do not attempt to inject a template
		if (node.shadowRoot) {
			return;
		}

		// get the template that exists for this node
		const nodeTagName = node.tagName;
		const template = this.shadowRootInjectorElementMap.get(nodeTagName);

		// if there is no defined template, return early
		if (!template) {
			return;
		}

		// build the actual shadow root object in a placeholder (we will copy this later into real elements)
		const shadowRootPlaceholder = document.createElement('div');

		// using setHTMLUnsafe allows us to build the parsed version of the shadowRoot object
		shadowRootPlaceholder.setHTMLUnsafe(`<div>${template.outerHTML}</div>`);
		const shadowRoot = shadowRootPlaceholder.children[0].shadowRoot;

		// attach a new shadow to this element using the properties of the shadowroot object that was created
		node.attachShadow(shadowRoot);
		node.shadowRoot.append(template.content.cloneNode(true));
	}

	/** function that starts both of the mutation observers */
	startObservers() {
		this.templateDefinitionObserver.observe(document.documentElement, { childList: true, subtree: true });
		this.registeredElementObserver.observe(document.documentElement, { childList: true, subtree: true });
	}

	/** function to stop both of the mutation observers */
	stopObservers() {
		this.templateDefinitionObserver.disconnect();
		this.registeredElementObserver.disconnect();
	}
}

// check if we are running as a module (if we are, expose the ShadowRootInjector to be imported)
if (typeof module !== 'undefined') {
	module.exports = ShadowRootInjector;
}

// check if the script tag has a `autostart` attribute (this indicates we should build and start the injector),
// otherwise we'll defer to the user to do this in their own script
if (document?.currentScript.hasAttribute('sr-autostart')) {
	window.shadowRootInjector = new ShadowRootInjector();
	window.shadowRootInjector.startObservers();
}
