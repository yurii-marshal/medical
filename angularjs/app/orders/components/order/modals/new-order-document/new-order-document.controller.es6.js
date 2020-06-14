export default class NewOrderDocumentCtrl {
    constructor(
        $rootScope,
        $state,
        $mdDialog,
        ngToast,
        bsLoadingOverlayService,
        orderDocumentsService,
        patientId
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.orderDocumentsService = orderDocumentsService;
        this.patientId = patientId;

        this.orderId = $state.params.orderId;

        this.patientDocument = undefined;
        this.patientDocuments = [];
    }

    getPatientDocuments(name) {
        return this.orderDocumentsService.getPatientDocuments(this.patientId, name)
            .then((response) => {
                return response.data.Items.filter((item) => !_.some(this.patientDocuments, (doc) => doc.Id === item.Id));
            });
    }

    selectPatientDocument() {
        let document = _.find(this.patientDocuments, (item) => item.Id === this.patientDocument.Id);

        if (!document) {
            this.patientDocuments.push(this.patientDocument);
            this.patientDocument = undefined;
        }
    }

    deleteSelectedDocument(documentId) {
        _.remove(this.patientDocuments, (item) => item.Id === documentId);
    }

    assignDocuments() {
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.orderDocumentsService.assignDocuments(this.orderId, this.patientId, this.patientDocuments)
            .then(() => {
                this.$rootScope.$broadcast('orderDocumentAdded');
                this.$mdDialog.cancel();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
