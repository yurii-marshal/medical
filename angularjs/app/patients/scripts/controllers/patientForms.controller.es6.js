export default class patientFormsController {
    constructor(
        $state,
        $q,
        bsLoadingOverlayService,
        patientFormsService,
        CURRENT_DOMAIN,
        iframeUtils
    ) {
        'ngInject';

        this.$state = $state;
        this.$q = $q;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientFormsService = patientFormsService;
        this.CURRENT_DOMAIN = CURRENT_DOMAIN;

        this.iframeUtils = iframeUtils;

        this.patientId = $state.params.patientId;
        this.templateId = undefined;
        this.forms = [];
        this.templates = [];
        this.orders = [];

        this.template = undefined;
        this.date = undefined;
        this.order = undefined;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        let patientOrdersPromise = this.patientFormsService.getPatientOrders(this.patientId)
            .then((response) => this.orders = response.data.Items);

        let promises = [
            this._getTemplates(),
            patientOrdersPromise,
            this._getForms()
        ];

        this.$q.all(promises)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    _getTemplates() {
        const params = { PageSize: 0 };

        return this.patientFormsService.getTemplates(params)
            .then((response) => {
                this.templates = response.data.Items;
                // other has to have preselected first template
                if (this.templates.length) { this.template = this.templates[0]; }
            });
    }

    _getForms() {
        return this.patientFormsService.getPatientForms(this.patientId)
            .then((response) => this.forms = response.data.Items);
    }

    generate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });
        this.patientFormsService.generateTemplate(this.patientId, this.template.Id, this.date, this.order)
            .then(() => this._getForms())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }

    goToFillSign() {

        if (this.template) {
            let params = {
                patientId: this.patientId,
                templateId: this.template.Id,
                OrderId: this.order ? this.order.Id : null,
                SignedDate: this.date ? moment(this.date).format('YYYY-MM-DD') : null
            };

            this.$state.go('root.fill_sign', params);
        }

    }

    goToAddForm() {
        this.iframeUtils.changeParentUrl({
            url: `/patients-v2/${ this.patientId }/forms/add`,
            pageTitle: 'Add Form',
            topMenu: 'Patients'
        }, false);
    }

    goToEditForm() {
        this.iframeUtils.changeParentUrl({
            url: `/patients-v2/${this.patientId}/forms/edit/${this.template.Id}`,
            pageTitle: 'Edit Form',
            topMenu: 'Patients'
        }, false);
    }

    openDocument(form, contentDisposition) {
        form.isLoading = true;

        this.patientFormsService.openDocument(form.AccessToken, contentDisposition).then(() => {
            form.isLoading = false;
        });
    }

    getDocument(accessToken, contentDisposition) {
        this.patientFormsService.getDocument(accessToken, contentDisposition);
    }
}
