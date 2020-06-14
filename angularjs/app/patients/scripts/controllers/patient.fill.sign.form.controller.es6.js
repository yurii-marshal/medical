export default class patientFillSignFormController {
    constructor(
        $mdDialog,
        $state,
        patientFillSignService,
        bsLoadingOverlayService,
        patientFormsService
    ) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.patientFillSignService = patientFillSignService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientFormsService = patientFormsService;
        this.pageName = $state.params.pageTitle;
        this._pdfPages = null;
        this._pdfName = undefined;
        this.patientId = $state.params.patientId;
        this.templateId = $state.params.templateId;

        this.model = {};
        if ($state.params.OrderId) {
            this.model.OrderId = $state.params.OrderId;
        }
        if ($state.params.SignedDate) {
            this.model.SignedDate = $state.params.SignedDate;
        }

        this.TYPES = {
            textField: 2,
            checkBox: 3,
            radioBtn: 5,
            image: 7
        };
        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientFillSign' });

        this.patientFillSignService.unscramblePdf(this.patientId, this.templateId, this.model)
            .then((res) => {
                this._pdfPages = res.data.Pages;
                this._pdfName = res.data.Name;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientFillSign' }));
    }

    save() {

        let fields = this._mapModelForSign();

        this.bsLoadingOverlayService.start({ referenceId: 'patientFillSign' });

        this.patientFillSignService.signPdf(this.patientId, this.templateId, { Fields: fields })
            .then((response) => {
                this.patientFormsService.openDocument(response.data.AccessToken);
                this.$state.go('root.patient.forms', { patientId: this.patientId });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientFillSign' }));

    }

    _mapModelForSign() {
        let fields = [];

        this._pdfPages.forEach((page) => {

            if (page.Fields.length) {
                page.Fields.forEach((item) => {
                    let element = document.getElementById(`id_${item.Index}`);
                    let value;

                    if (element) {
                        if (parseInt(item.Type.Id) === this.TYPES.image) {
                            if (element.getAttribute('img-src')) {
                                value = element.getAttribute('img-src').split(',')[1];
                            }
                        } else {
                            value = element.value;
                        }
                    }

                    // Remove item with duplicate name
                    let index = _.findIndex(fields, (field) => {
                        return field.FullName === item.FullName;
                    });

                    let itemRadioOrCheck = (+item.Type.Id === this.TYPES.radioBtn) || (+item.Type.Id === this.TYPES.checkBox);

                    if (element && element.checked && itemRadioOrCheck) {
                        fields.push({
                            Value: (+item.Type.Id === this.TYPES.radioBtn) ? item.CheckValue : 1,
                            Index: item.Index,
                            FullName: item.FullName,
                            _isRequired: item.Required
                        });
                    } else if (index === -1 && !itemRadioOrCheck) {
                        fields.push({
                            Value: value,
                            Index: item.Index,
                            FullName: item.FullName,
                            _isRequired: item.Required
                        });
                    }
                });
            }
        });

        return fields;
    }

    cancel() {
        this.$state.go('root.patient.forms', { patientId: this.patientId });
    }
}
