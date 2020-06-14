export default class settingsStatementController {
    constructor(
        $state,
        ngToast,
        bsLoadingOverlayService,
        settingsService
    ) {
        'ngInject';

        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.settingsService = settingsService;

        this.model = {};
        this.initModel = {};
        this.textAfterPatientNameMaxLength = 300;
        this.headerAfterPaymentOptionMaxLength = 200;
        this.textAfterPaymentOptionMaxLength = 200;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'settingsStatement' });
        this.settingsService.getStatementSettings()
            .then((response) => {
                this.model = response.data;
                this.model.isPayOnline = !!this.model.PayOnlineLink;
                this.model.isPayByPhone = !!this.model.PayByPhone;
                if (!this.model.BalanceDueDate) {
                    this.model.BalanceDueDate = '';
                }
                angular.copy(this.model, this.initModel);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'settingsStatement' }));
    }

    onPayOnlineChange() {
        if (!this.model.isPayOnline) {
            this.model.PayOnlineLink = '';
        }
    }

    onPayByPhoneChange() {
        if (!this.model.isPayByPhone) {
            this.model.PayByPhone = '';
        }
    }

    cancel() {
        angular.copy(this.initModel, this.model);
    }

    save() {
        if (this.statementForm.$invalid) {
            touchedErrorFields(this.statementForm);
            return;
        }
        const model = angular.copy(this.model);
        if (!model.BalanceDueDate) {
            model.BalanceDueDate = 0;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'settingsStatement' });
        this.settingsService.updateStatementSettings(model)
            .then(() => {
                angular.copy(this.model, this.initModel);
                this.ngToast.success('Statements settings are updated');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'settingsStatement' }));
    }
}
