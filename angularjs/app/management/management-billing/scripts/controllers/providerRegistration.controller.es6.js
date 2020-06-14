export default class providerRegistrationController {
    constructor($state, $http, $stateParams, ngToast, billingProvidersService) {
        'ngInject';

        let providerId = $stateParams.state,
            stripeCode = $stateParams.code;
        const redirectFromStripe = true;

        if (stripeCode && providerId && !$stateParams.error) {
            billingProvidersService.connectStripe(providerId, stripeCode)
                .then(() => {
                    ngToast.success('Billing Provider is connected to Stripe.');
                    $state.go('root.management.billing.providers.view', { providerId, redirectFromStripe });
                })
                .catch(() => {
                    ngToast.danger('API: Error connecting Billing Provider to Stripe account.');
                    $state.go('root.management.billing.providers.view', { providerId, redirectFromStripe });
                });
        } else if (providerId) {
            if ($stateParams.error_description) {
                ngToast.info(`Stripe: ${$stateParams.error_description}`);
            }
            $state.go('root.management.billing.providers.view', { providerId, redirectFromStripe });
        } else {
            ngToast.danger('Error. Billing Provider information isn\'t exist.');
            $state.go('root.management.billing.providers');
        }
    }
}
