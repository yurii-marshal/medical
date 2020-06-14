export default class providerAdjustModalController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        billingDictionariesService,
        isEdit,
        adjustment
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.billingDictionariesService = billingDictionariesService;
        this.isEdit = isEdit;
        this.adjustments = [
            adjustment ? angular.copy(adjustment) : this.getAdjustmentMock()
        ];
    }

    getProviderLevelAdjustments(name, pageIndex) {
        const params = {
            Text: name,
            PageIndex: pageIndex,
            selectCount: true
        };

        return this.billingDictionariesService.getProviderLevelAdjustments(params)
            .then((response) => response.data);
    }

    addAdjustment() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.adjustments.push(this.getAdjustmentMock());
    }

    removeAdjustment(index) {
        this.adjustments.splice(index, 1);
    }

    save() {
        if (this.modalForm.$invalid) {
            touchedErrorFields(this.modalForm);
            return;
        }

        this.$mdDialog.hide(this.adjustments);
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    getAdjustmentMock() {
        return {
            Amount: {
                Amount: null,
                Currency: '$'
            },
            ProviderRefId: null,
            Date: null,
            PLBCode: null
        };
    }
}
