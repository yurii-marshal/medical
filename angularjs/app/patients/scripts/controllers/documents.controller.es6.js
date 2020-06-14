export default class documentsController {
    constructor($scope,
                $state,
                $filter,
                $mdDialog,
                bsLoadingOverlayService,
                documentsService,
                cmnFormService,
                patientEditService) {
        'ngInject';

        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.documentsService = documentsService;
        this.cmnFormService = cmnFormService;

        this.documentStatusExpiredId = 2;

        this.patientId = $state.params.patientId;

        this.check = false;
        this.disabled = true;
        this.documentsToPreview = [];
        this.model = {};

        patientEditService.getPatientInfoModel(this.patientId)
            .then((response) => this.model = response);

        this._load();

        $scope.$watch(() => this.documentsToPreview, (newValues) => {
            this.check = _.every(newValues, (value) => value.checked);

            this.disabled = !_.some(newValues, (value) => {
                return value.checked || (value.opened && _.some(value.previous, (previous) => previous.checked));
            });
        }, true);

        $scope.$on('documentAdded', () => {
            this.documentsToPreview = [];
            this._load();
        });
    }

    _load() {
        this.bsLoadingOverlayService.start({ referenceId: 'loading-documents' });
        this.documentsService.getDocuments(this.patientId)
            .then((response) => {
                this.documentsToPreview = response.data.Items.map((item) => {
                    item.lastDocumentVersion = true;
                    return item;
                });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-documents' }));
    }

    edit($event, document) {
        $event.stopPropagation();

        if (document.IsCmn) {
            this.goToCmn(document.Id);
        } else {
            this.$mdDialog.show({
                controller: 'editDocumentModalController',
                controllerAs: '$ctrl',
                templateUrl: 'patients/views/modals/edit-document-modal.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {
                    document: document,
                    save: this.save.bind(this)
                }
            });
        }

    }

    goToCmn(cmnId) {
        this.cmnFormService.goToCmnForm(this.patientId, cmnId);
    }

    save(document) {
        this.bsLoadingOverlayService.start({ referenceId: 'loading-documents' });
        return this.documentsService.editDocument(document)
            .then(() => {
                this._load();
                this.$mdDialog.cancel();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-documents' }));
    }

    getDocumentHistory($event, document, changeCurrentDocVisibility) {
        $event.stopPropagation();

        if (this.check && changeCurrentDocVisibility) {
            document.opened = true;
        } else {
            document.opened = changeCurrentDocVisibility ? false : !document.opened;
        }

        if (!document.historyIsLoaded) {
            this.bsLoadingOverlayService.start({ referenceId: 'loading-documents' });
            this.documentsService.getDocumentHistory(this.patientId, document.DocumentType.Id)
                .then((response) => {
                    document.previous = this.$filter('orderBy')(response.data.Items, ['-CreatedDate', 'Id']);

                    document.historyIsLoaded = true;
                    this._togglePreviousDocuments(document);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-documents' }));
        } else {
            this._togglePreviousDocuments(document);
        }
    }

    checkAll() {
        const changeCurrentDocVisibility = true;

        angular.forEach(this.documentsToPreview, (document) => {
            document.checked = this.check;
            this._togglePreviousDocuments(document);
            this.getDocumentHistory(event, document, changeCurrentDocVisibility);
        });
    }

    view($event, document) {
        $event.stopPropagation();

        document.isLoading = true;

        this.documentsService.view(document.AccessToken).then(() => {
            document.isLoading = false;
        });
    }

    remove() {
        let documentIds = [];

        this.bsLoadingOverlayService.start({ referenceId: 'loading-documents' });
        angular.forEach(this.documentsToPreview, (document) => {
            if (document.checked) {
                documentIds.push(document.Id);
            }

            angular.forEach(document.previous, (previous) => {
                if (previous.checked) {
                    documentIds.push(previous.Id);
                }
            });
        });

        this.documentsService.remove(documentIds)
            .then(() => {
                this.documentsToPreview = [];
                this._load();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'loading-documents' }));
    }

    _togglePreviousDocuments(document) {
        angular.forEach(document.previous, (previous) => {
            previous.checked = document.checked ? true : this.check;
        });
    }

    /*
    showShare($event) {
        let orders = [],
            checkedDocuments = _.filter(this.documentsToPreview, document => document.checked);

        angular.forEach(checkedDocuments, document => {
            if (document.Orders) {
                angular.forEach(document.Orders, order => {
                    let exist = _.some(orders, existingOrder => existingOrder.Id === order.Id);

                    if (!exist) {
                        orders.push(order);
                    }
                });
            }
        });

        this.$mdDialog.show({
            templateUrl: "patients/views/modals/share-modal.html",
            targetEvent: $event,
            controller: "shareModalController",
            controllerAs: "share",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                save: this.share.bind(this),
                orders: orders
            }
        });
    }

    share(orders) {
        let checkedDocuments = _.filter(this.documentsToPreview, document => document.checked),
            checkedOrders = _.filter(orders, order => order.checked);

        if (checkedDocuments.length) {
            this.bsLoadingOverlayService.start({ referenceId: "loading-documents" });
            this.documentsService.share(checkedDocuments, checkedOrders)
                .then(_ => {
                    angular.forEach(checkedDocuments, checkedDocument => {
                        let document = _.find(this.documentsToPreview, existingDocument => existingDocument.Id === checkedDocument.Id);

                        if (document) {
                            document.Orders = checkedOrders;
                        }
                    });

                    this.$mdDialog.cancel();
                })
                .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: "loading-documents" }));
        }
    }
     */
}

