const ShadowRootInjector = require('shadowroot-injector');

const injector = new ShadowRootInjector();
injector.registerTemplateDefinition(calloutAlertDefinition);
injector.injectRegisteredTemplate(calloutAlertElement);
