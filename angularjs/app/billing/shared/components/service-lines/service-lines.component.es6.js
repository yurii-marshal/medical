// Template
import template from './service-lines.html';

// Transaction Modal
import transactionModalTemplate from '../../modals/transactions/transaction-modal.html';
import transactionModalCtrl from '../../modals/transactions/transaction-modal.controller.es6.js';

import {
    permissionsCategoriesConstants,
    billingPermissionsConstants
} from '../../../../core/constants/permissions.constants.es6';

class serviceLinesCtrl {
    constructor($rootScope,
                $mdDialog,
                $state,
                bsLoadingOverlayService,
                invoicesService,
                billingsCommonService,
                userPermissions
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.billingsCommonService = billingsCommonService;

        this.userPermissions = userPermissions;
        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;

        this.invoiceDetailsLoaded = false;

        $rootScope.$on('reloadInvoiceInfo', (event, args) => {
            if (args && args.lineId) {
                this.getTransactionList(args.lineId);
            }
        });

        $rootScope.$on('invoiceDetailsLoaded', (event, args) => {
            if (this.accordionControl) {
                if (args.activeLineId) {
                    this.accordionControl.expand(args.activeLineId);
                } else {
                    this.accordionControl.collapseAll();
                }
            }
            this.invoiceDetailsLoaded = true;
        });
    }

    _transactionAfterSave(lineId) {
        const NEED_CHECK_BALANCE = true;

        this.$rootScope.$broadcast('reloadInvoiceInfo', {
            lineId,
            NEED_CHECK_BALANCE,
            serviceLineLevelTransaction: true
        });
    }

    showTransactionModal($event, line) {
        $event.stopPropagation();
        this.$mdDialog.show({
            template: transactionModalTemplate,
            controller: transactionModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                invoiceId: this.invoiceId,
                lineId: line.ServiceLineId
            }
        })
        .then((ServiceLineId) => this._transactionAfterSave(ServiceLineId));
    }

    getTransactionList(lineId) {
        this.bsLoadingOverlayService.start({ referenceId: `transactions-${lineId}` });
        this.invoicesService.getSLTransactions(this.invoiceId, lineId)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `transactions-${lineId}` }));
    }

    showPricingDetails($event, serviceLine) {
        this.billingsCommonService.showPricingDetails($event, serviceLine, this.invoiceId);
    }

    isPeriodVisible(line) {
        const isPayment = this.paymentId,
            hasRentProgram = line.RentProgramId,
            hasReriod = line.Period;

        return !isPayment && hasRentProgram && hasReriod;
    }

    goToRental(event, rentProgramId) {
        event.stopPropagation();

        this.$state.go('root.patient.rental', {
            patientId: this.patientId,
            rentProgramId
        });
    }
}

const serviceLines = {
    bindings: {
        lines: '=',
        patientId: '<',
        invoiceId: '<',
        paymentId: '<?',
        preDefinedPayer: '<?',
        anchorServiceLine: '<?',
        searchServiceLine: '=?',
        isVoidInvoice: '<?'
    },
    template,
    controller: serviceLinesCtrl
};

export default serviceLines;
