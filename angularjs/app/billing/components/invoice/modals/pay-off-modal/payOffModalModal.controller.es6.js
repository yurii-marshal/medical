export default class payOffModalController {
    constructor($mdDialog, ngToast, $rootScope, $filter, bsLoadingOverlayService, invoicesService, invoiceId, invoiceBalance, paymentsService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.$rootScope = $rootScope;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.invoiceId = invoiceId;
        this.invoiceBalance = invoiceBalance;
        this.paymentsService = paymentsService;

        this.paymentInfo = undefined;
        this.previousPayment = undefined;
        this.Note = '';
    }

    searchPayments(name) {
        return this.paymentsService.searchPayments(name)
            .then((response) => response.data.Items);
    }

    getFilteredNumber(numberValue, fixedLength) {
        return this.$filter('number')(numberValue, fixedLength);
    }

    previousPaymentChanged(payment) {
        if (payment && payment.Id) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            this.paymentsService.getPaymentDetails(payment.Id)
                .then((response) => this.paymentInfo = response.data)
                .catch(() => this.paymentInfo = undefined)
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            this.paymentInfo = undefined;
        }
    }

    save() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        let model = {
            PaymentId: this.paymentInfo.Id,
            Note: this.Note
        };

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.invoicesService.postPayOff(this.invoiceId, model)
            .then(() => this.invoicesService.closeInvoiceModal(this.invoiceId))
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    onlySave() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        let model = {
            PaymentId: this.paymentInfo.Id,
            Note: this.Note
        };

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.invoicesService.postPayOff(this.invoiceId, model)
            .then(() => {
                this.ngToast.success('Transactions were successfully added');
                this.$mdDialog.hide();
                this.$rootScope.$broadcast('reloadInvoiceInfo');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}