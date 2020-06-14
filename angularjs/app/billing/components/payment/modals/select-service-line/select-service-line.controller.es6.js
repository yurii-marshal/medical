import { selectServiceLineModalType } from './select-service-line.constants.es6';

export default class SelectServiceLineCtrl {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        billingInvoiceService,
        invoiceId,
        disableIds,
        controlType
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingInvoiceService = billingInvoiceService;
        this.disableIds = disableIds || [];

        this.selectedServiceLine = [];

        this.controlType = controlType;
        this.selectServiceLineModalType = selectServiceLineModalType;

        this.serviceLines = [];

        this.bsLoadingOverlayService.start({ referenceId: 'selectServiceLineList' });

        this.billingInvoiceService.getServiceLinesByInvoiceId(invoiceId)
            .then((response) => {
                this.bsLoadingOverlayService.stop({ referenceId: 'selectServiceLineList' });

                this.serviceLines = response.data.map((item) => {

                    if (this.disableIds.indexOf(item.Id) > -1) {
                        item.isDisabled = true;
                        item.isChecked = true;
                    }

                    return item;
                });
            });
    }

    isDisableItem(itemId) {
        return this.disableIds.indexOf(itemId) > -1;
    }

    onSelect() {
        this.$mdDialog.hide(this.selectedServiceLine);
    }

    onCancel() {
        this.$mdDialog.cancel();
    }

    toggleItem(item) {
        const index = this.selectedServiceLine.findIndex((i) => i.Id === item.Id);

        if (index > -1) {
            this.selectedServiceLine.splice(index, 1);
        } else {
            this.selectedServiceLine.push(item);
        }
    }
}
