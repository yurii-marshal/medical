import pricingOptionsModalCtrl from './modals/select-price-option/expense-select-price-option.controller.es6';

import pricingOptionsModalTemplate from './modals/select-price-option/expense-select-price-option.html';
import { expansePayerTypes } from '../../../../../core/constants/core.constants.es6';

export default class ExpenseEstimatesCtrl {
    constructor(
        expenseEstimatesService,
        ordersService,
        $state,
        $mdDialog,
        bsLoadingOverlayService,
        ngToast
    ) {
        'ngInject';

        this.expenseEstimatesService = expenseEstimatesService;

        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.$state = $state;

        this.ordersService = ordersService;

        this.$mdDialog = $mdDialog;

        this.expansePayerTypes = expansePayerTypes;

        this.ngToast = ngToast;

        this.insurancePriorityNames = {
            '1': 'primary insurance:',
            '2': 'secondary insurance:',
            '3': 'tertiary insurance:'
        };

        this.orderId = $state.params.orderId;
        this.patientId = null;

        this.pricings = [];

        this.model = this.expenseEstimatesService.getEmptyModel();

        this.savingDocument = false;
        this.downloadingDocument = false;

        this.bsLoadingOverlayService.start({ referenceId: 'expanseEstimates' });

        this.ordersService.getOrderShortInfo(this.orderId).then((response) => {

            this.patientId = response.data.Patient.Id;

            return this.expenseEstimatesService.getExpenseEstimatePricing(this.orderId, this.patientId);
        }).then((response) => {

            this.pricings = response.data;

            if (!this.pricings.length) {
                this.$state.go('root.orders.order.details', { orderId: this.orderId });
                return null;
            }

            return this.expenseEstimatesService.getCalculatedDataAndSetModel(this.orderId, this.patientId, this.pricings);
        }).then((newModel) => {
            this.model = newModel;
            this.bsLoadingOverlayService.stop({ referenceId: 'expanseEstimates' });
        });
    }

    getPricingItemByPricing(item) {
        return this.pricings.find((pricing) => {
            return pricing.ItemId === item.ItemId &&
                pricing.Hcpcs === item.Hcpcs &&
                pricing.ProductId === item.Product.Id;
        });
    }

    isNeedSelectPriceOption(item) {
        const pricingItem = this.getPricingItemByPricing(item);

        return pricingItem.PriceOptions.filter((item) => item.Default).length !== 1;
    }

    selectPriceOption(item) {
        const pricingItem = this.getPricingItemByPricing(item);

        this.$mdDialog.show({
            template: pricingOptionsModalTemplate,
            controller: pricingOptionsModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                options: {
                    pricings: pricingItem.PriceOptions,
                    hcpcsCode: item.Hcpcs
                }
            }
        })
            .then((priceOptionItem) => {

                pricingItem.PriceOptions.forEach((priceOption) => {
                    priceOption.Default = priceOption.Id === priceOptionItem.Id;
                });

                this.bsLoadingOverlayService.start({ referenceId: 'expanseEstimates' });

                this.expenseEstimatesService.getCalculatedDataAndSetModel(this.orderId, this.patientId, this.pricings)
                    .then((newModel) => {
                        this.model = newModel;
                    })
                    .finally(() => {
                        this.bsLoadingOverlayService.stop({ referenceId: 'expanseEstimates' });
                    });
            } );
    }

    onSavePdf() {

        this.savingDocument = true;

        this.expenseEstimatesService.saveExpenseEstimates(this.orderId, this.patientId, this.pricings)
            .then(() => {
                this.savingDocument = false;
                this.ngToast.success('Expanse estimates was save to order documents.');
            });
    }

    onDownloadPdf() {

        this.downloadingDocument = true;

        this.expenseEstimatesService.downloadExpenseEstimates(this.orderId, this.patientId, this.pricings)
            .then(() => {
                this.downloadingDocument = false;
            });

    }
}
