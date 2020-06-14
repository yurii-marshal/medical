import {
    providerSignatureOnFileConstants,
    insuredSignatureOnFileConstants,
    patientSignatureOnFileConstants
} from '../../../../../core/constants/billing.constants.es6';
import {
    billingPermissionsConstants,
    permissionsCategoriesConstants
} from '../../../../../core/constants/permissions.constants.es6';

import transactionModalTemplate from '../../../../shared/modals/transactions/transaction-modal.html';
import transactionModalCtrl from '../../../../shared/modals/transactions/transaction-modal.controller.es6';

export default class InvoiceDetailsCtrl {
    constructor($scope,
                $state,
                $mdDialog,
                $rootScope,
                bsLoadingOverlayService,
                invoicesService,
                userPermissions) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.$mdDialog = $mdDialog;
        this.$rootScope = $rootScope;
        this.providerSignatureOnFileConstants = providerSignatureOnFileConstants;
        this.insuredSignatureOnFileConstants = insuredSignatureOnFileConstants;
        this.patientSignatureOnFileConstants = patientSignatureOnFileConstants;
        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;
        this.userPermissions = userPermissions;

        this.invoiceId = $state.params.invoiceId;
        this.anchorServiceLine = $state.params.serviceLineId;
        this.invoiceDetailsLoaded = false;
        this.isTransactionListExpanded = false;

        this.model = invoicesService.getModel();
        this.messages = [];

        this._getMessages();

        $scope.$on('reloadInvoiceInfo', (event, args) => {
            this._getMessages();
            if (args &&
                (args.invoiceLevelTransaction ||
                    (args.serviceLineLevelTransaction && this.isTransactionListExpanded))) {
                this.getTransactionList();
            }
        });

        $scope.$on('invoiceDetailsLoaded', () => this.invoiceDetailsLoaded = true);
    }

    _getMessages() {
        this.invoicesService.getMessages(this.invoiceId)
            .then((response) => this.messages = response.data.Items);
    }

    deleteMessage(msg) {
        this.invoicesService.deleteMessage(this.invoiceId, msg.Id);
        this.messages.splice(this.messages.indexOf(msg), 1);
    }

    getTransactionList() {
        this.bsLoadingOverlayService.start({ referenceId: `invoice-transactions` });
        this.invoicesService.getInvoiceTransactions(this.invoiceId)
            .then((response) => this.transactions = response)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `invoice-transactions` }));
    }

    showTransactionModal($event) {
        $event.stopPropagation();

        this.$mdDialog.show({
            template: transactionModalTemplate,
            controller: transactionModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                invoiceId: this.invoiceId,
                lineId: null
            }
        })
        .then(() => this._transactionAfterSave());
    }

    _transactionAfterSave() {
        const NEED_CHECK_BALANCE = true;

        this.$rootScope.$broadcast('reloadInvoiceInfo', {
            NEED_CHECK_BALANCE,
            invoiceLevelTransaction: true
        });
    }
}
