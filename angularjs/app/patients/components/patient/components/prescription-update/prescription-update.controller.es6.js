export default class PrescriptionUpdateCtrl {
    constructor($scope, $state, $filter, bsLoadingOverlayService, prescriptionService, patientShortInfoService) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.prescriptionService = prescriptionService;
        this.patientShortInfoService = patientShortInfoService;

        this.patientId = $state.params.patientId;
        this.prescriptionId = $state.params.prescriptionId;
        this.isNewPrescription = this.$state.includes('root.patients.newPrescription');

        this.currentSelectedItems = [];
        this.model = this.prescriptionService.getModel();
        this.patientShortInfo = {};

        this.statuses = {
            prescriptionNew: 1,
            prescriptionActive: 2,
            prescriptionExpired: 3
        };

        $scope.$on('$stateChangeSuccess',
            (event, toState, toParams, fromState) => this._checkState(fromState)
        );
        this._checkState();
        this._activate();

        this.addItem = this._addItem.bind(this);
        this.deleteItem = this._deleteItem.bind(this);
    }

    _checkState(fromState) {
        if (fromState && !fromState.name) {
            this.$state.go(`root.patients.${ this.isNewPrescription ? 'newPrescription' : 'prescriptionUpdate' }.view`);
        }
        if (this.$state.is('root.patients.newPrescription')) {
            this.$state.go('root.patients.newPrescription.view');
        }
        if (this.$state.is('root.patients.prescriptionUpdate')) {
            this.$state.go('root.patients.prescriptionUpdate.view');
        }
    }

    _activate() {

        this.prescriptionService.getPatientDiagnosis(this.patientId)
            .then((response) => {
                this.patientDiagnosis = response;
            });

        this.patientShortInfoService.getShortInfo(this.patientId)
            .then((response) => {
                this.patientShortInfo = response.data;
            });

        if (!this.prescriptionId) {
            this.prescriptionService.resetModel();
            this.model = this.prescriptionService.getModel();
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'updatePrescription' });
        this.prescriptionService.getPrescriptionDetails(this.prescriptionId)
            .then((response) => {
                this.model = this._modelNormalize(response);
                this.prescriptionService.setModel(this.model);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'updatePrescription' }));

    }

    _modelNormalize(model) {
        model.EffectiveDate = moment(model.EffectiveDate ).format('MM/DD/YYYY');

        let refProv = model.TreatingProvider;

        refProv.searchName = this.$filter('referralDisplayName')(refProv, true);
        refProv.displayName = this.$filter('referralDisplayName')(refProv);

        if (model.Products) {
            model.Products.map((product) => {
                this._productFlatStructure(product);

                return product;
            });
        }

        if (model.BundleProducts) {
            model.BundleProducts.map((product) => {
                product.Bundle = true;
                this._productFlatStructure(product);

                if (product.Components.length) {
                    product.Components.map((component) => {
                        this._productFlatStructure(component);
                        return component;
                    });
                }

                return product;
            });

            // Concat BundleProducts with Products into one array
            model.Products = model.Products
                ? model.Products.concat(model.BundleProducts)
                : [].concat(model.BundleProducts);
        }

        if (model.HcpcsCodes) {
            model.HcpcsCodes.map((item) => {
                item.Notes = item.Description;
                item.isAny = true;

                return item;
            });

            // Concat HcpcsCodes(Any device of this category) with Products into one array
            model.Products = model.Products
                ? model.Products.concat(model.HcpcsCodes)
                : [].concat(model.HcpcsCodes);
        }

        return model;
    }

    _productFlatStructure(item) {
        item.Name = item.Product.Name;
        item.allHcpcsCodes = item.Product.Hcpcs;
        item.Manufacturer = item.Product.Manufacturer;
        item.PartNumber = item.Product.PartNumber;
        item.PictureUrl = item.Product.PictureUrl;
        item.Notes = item.Description;

        return item;
    }

    _addItem() {
        angular.copy(this.model.Products, this.currentSelectedItems);
        this.$state.go(`root.patients.${ this.isNewPrescription ? 'newPrescription' : 'prescriptionUpdate' }.add`,
            { patientId: this.patientId, prescriptionId: this.prescriptionId });
    }

    _deleteItem(currentItem, products, index) {
        products.splice(index, 1);
    }

    cancelItems() {
        angular.copy(this.currentSelectedItems, this.model.Products);
        this.$state.go(`root.patients.${ this.isNewPrescription ? 'newPrescription' : 'prescriptionUpdate' }.view`,
            { patientId: this.patientId, prescriptionId: this.prescriptionId });
    }

    saveItems() {
        this.$state.go(`root.patients.${ this.isNewPrescription ? 'newPrescription' : 'prescriptionUpdate' }.view`,
            { patientId: this.patientId, prescriptionId: this.prescriptionId });
    }

    cancel() {
        this.$state.go('root.patient.prescription', { patientId: this.patientId });
        this.prescriptionService.resetModel();
    }

    save() {
        if (this.updatePrescriptionForm.$invalid) {
            touchedErrorFields(this.updatePrescriptionForm);
            return false;
        }

        const model = this.prescriptionService.mapPrescriptionModel(this.model);
        let promise = this.isNewPrescription
                ? () => this.prescriptionService.addNewPrescription(model, this.patientId)
                : () => this.prescriptionService.updatePrescription(model, this.patientId, this.prescriptionId);

        this.bsLoadingOverlayService.start({ referenceId: 'updatePrescription' });
        promise().then(() => this.cancel())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'updatePrescription' }));
    }
}
