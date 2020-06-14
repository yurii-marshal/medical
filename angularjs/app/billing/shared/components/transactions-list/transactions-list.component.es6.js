import template from './transactions-list.html';
import {
    adjustmentTypeConstants,
    adjustmentSourceConstants
} from '../../../../core/constants/billing.constants.es6';

class transactionsListCtrl {
    constructor(
        $rootScope,
        bsLoadingOverlayService,
        billingInvoiceTransactionService,
        $state
    ) {
        'ngInject';

        this.$state = $state;
        this.$rootScope = $rootScope;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingInvoiceTransactionService = billingInvoiceTransactionService;
        this.adjustmentTypeConstants = adjustmentTypeConstants;
        this.adjustmentSourceConstants = adjustmentSourceConstants;
    }

    _transactionAfterRemove(lineId) {
        const NEED_CHECK_BALANCE = true;

        this.$rootScope.$broadcast('reloadInvoiceInfo', {
            lineId,
            NEED_CHECK_BALANCE,
            invoiceLevelTransaction: !this.serviceLineId,
            serviceLineLevelTransaction: !!this.serviceLineId
        });
    }

    removeTransaction(transactionId) {
        const promise = this.serviceLineId ?
            () => this.billingInvoiceTransactionService.deleteSLTransaction(this.invoiceId, this.serviceLineId, transactionId) :
            () => this.billingInvoiceTransactionService.deleteInvoiceTransaction(this.invoiceId, transactionId);

        const referenceId = this.serviceLineId ?
            'transactions-' + this.serviceLineId :
            'invoice-transactions';

        this.bsLoadingOverlayService.start({ referenceId });
        promise().then(() => this._transactionAfterRemove(this.serviceLineId))
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId }));
    }

    determineGoToPayment(transaction) {
        if (transaction.PaymentId) {
            this.$state.go('root.paymentDetails', {
                paymentId: transaction.PaymentId,
                scrollToInvoiceId: transaction.PaymentElementId
            });
        }
    }

}

const transactionsList = {
    bindings: {
        invoiceId: '<',
        isVoidInvoice: '<',
        serviceLineId: '<?',
        transactions: '<'
    },
    template,
    controller: transactionsListCtrl
};

export default transactionsList;
