export default class orderDocumentsController {
    constructor($scope, $state, $filter, orderDocumentsService, bsLoadingOverlayService, ordersService) {
        'ngInject';

        this.$filter = $filter;
        this.orderDocumentsService = orderDocumentsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.orderId = $state.params.orderId;
        this.documents = [];
        this.model = ordersService.getModel();

        $scope.$on('orderDocumentAdded', () => this.getDocuments());

        this.getDocuments();
    }

    getDocuments() {
        this.bsLoadingOverlayService.start({ referenceId: 'orderPage' });
        this.orderDocumentsService.getDocuments(this.orderId)
            .then((response) => this.documents = response.data)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'orderPage' }));
    }

    view(doc) {
        let pagetitle = this.model.shortInfo.Patient.Name.FullName || this.$filter('fullname')(this.model.shortInfo.Patient.Name);

        doc.isLoading = true;

        this.orderDocumentsService.openOrderDocument(doc.DocumentId, pagetitle)
            .finally(() => doc.isLoading = false);
    }
}

