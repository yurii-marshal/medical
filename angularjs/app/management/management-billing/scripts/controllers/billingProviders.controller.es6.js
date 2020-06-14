import reAssignBillingProviderModalController from './modals/reAssignBillingProviderModal.controller.es6';
import template from '../../views/modals/reAssignBillingProviderModal.html';

export default class billingProvidersController {
    constructor($state, ngToast, $mdDialog, bsLoadingOverlayService, infinityTableService, billingProvidersService) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.infinityTableService = infinityTableService;
        this.billingProvidersService = billingProvidersService;

        this.cacheFiltersKey = 'management-billing-providers';

        this.TotalCount = undefined;
        this.filter = {};
        this.sortExpr = {};
        this.statuses = [
            { value: 'false', text: 'No' },
            { value: 'true', text: 'Yes' }
        ];

        this.getProviders = this._getProviders.bind(this);
    }

    _getProviders(pageIndex, pageSize) {
        return this.billingProvidersService.getList(this.filter, this.sortExpr, pageIndex, pageSize)
            .then((response) => {
                this.TotalCount = response.data.Count;
                return response;
            })
            .catch((err) => this.TotalCount = undefined);
    }

    goToProvider(providerId) {
        this.$state.go('root.management.billing.providers.view', { providerId });
    }

    deleteProvider(provider) {
        let providerId = provider.Id;
        let providerName = provider.Name;

        this.bsLoadingOverlayService.start({ referenceId: 'billingProvidersList' });
        this.billingProvidersService.isProviderAssigned(providerId)
            .then((response) => {
                if (response.data) {
                    // if billing provider assigned to location user have to choose other billing provider for this location
                    reAssignBillingProvider.call(this);
                } else {
                    deleteBillingProviderPromise.call(this);
                }
            });

        function reAssignBillingProvider() {
            this.bsLoadingOverlayService.stop({ referenceId: 'billingProvidersList' });

            this.$mdDialog.show({
                template,
                controller: reAssignBillingProviderModalController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { providerId, providerName }
            }).then(() => {
                deleteBillingProviderPromise.call(this);
            });
        }

        function deleteBillingProviderPromise() {
            this.bsLoadingOverlayService.start({ referenceId: 'billingProvidersList' });

            this.billingProvidersService.deleteProvider(providerId)
                .then(() => this.ngToast.success('Billing Provider is deleted'))
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'billingProvidersList' });
                    this.infinityTableService.reload();
                });
        }
    }
}
