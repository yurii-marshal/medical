// Config
import config from './management-billing.route.es6';

// Controllers
import payersController from './scripts/controllers/payers.controller.es6';
import payerController from './scripts/controllers/payer.controller.es6';
import payerDetailsController from './scripts/controllers/payerDetails.controller.es6';
import payerBillingController from './scripts/controllers/payerBilling.controller.es6';
import payerRulesController from './scripts/controllers/payerRules.controller.es6';
import renderingProvidersController from './scripts/controllers/renderingProviders.controller.es6';
import renderingProviderController from './components/rendering-provider/rendering-provider.controller.es6';
import billingProvidersController from './scripts/controllers/billingProviders.controller.es6';
import billingProviderController from './components/billing-provider/billing-provider.controller.es6.js';
import providerRegistrationController from './scripts/controllers/providerRegistration.controller.es6';
import pricingListController from './components/pricing/pricing-list/pricingList.controller.es6.js';
import pricingController from './components/pricing/manage-pricing/pricing.controller.es6.js';
import hcpcsController from './scripts/controllers/hcpcs.controller.es6';
import adjustmentReasonsController from './components/adjustment-reasons/adjustment-reasons.controller.es6';

// Components
import payerPlans from './components/payer-plan/payer-plans.component.es6.js';

// Services
import payersService                    from './scripts/services/payers.service.es6';
import renderingProvidersService        from './scripts/services/renderingProviders.service.es6';
import billingProvidersService          from './scripts/services/billingProviders.service.es6';
import pricingService                   from './components/pricing/shared/services/pricing.service.es6.js';
import hcpcsService                     from './scripts/services/hcpcs.service.es6';

export default angular
    .module('app.management.billing', ['ui.mask'])
    .config(config)

    // Controllers
    .controller('payersController', payersController)
    .controller('payerController', payerController)
    .controller('payerDetailsController', payerDetailsController)
    .controller('payerBillingController', payerBillingController)
    .controller('payerRulesController', payerRulesController)
    .controller('renderingProvidersController', renderingProvidersController)
    .controller('renderingProviderController', renderingProviderController)
    .controller('billingProvidersController', billingProvidersController)
    .controller('billingProviderController', billingProviderController)
    .controller('providerRegistrationController', providerRegistrationController)
    .controller('pricingListController', pricingListController)
    .controller('pricingController', pricingController)
    .controller('hcpcsController', hcpcsController)
    .controller('adjustmentReasonsController', adjustmentReasonsController)

    // Components
    .component('payerPlans', payerPlans)

    // Services
    .service('payersService', payersService)
    .service('renderingProvidersService', renderingProvidersService)
    .service('billingProvidersService', billingProvidersService)
    .service('pricingService', pricingService)
    .service('hcpcsService', hcpcsService)
    .name;
