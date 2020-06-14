export default class AdjustModalController {
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
        this.groups = [];
        this.getGroups();
    }

    getGroups() {
        return this.billingDictionariesService.getPayerAdjustmentGroups()
            .then((response) => this.groups = response.data);
    }

    getReasons(name, pageIndex) {
        const params = {
            Text: name,
            PageIndex: pageIndex,
            selectCount: true
        };

        return this.billingDictionariesService.getPayerAdjustmentReasons(params)
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
                Currency: '$',
                Amount: null
            },
            Group: null,
            Reason: null
        };
    }
}
