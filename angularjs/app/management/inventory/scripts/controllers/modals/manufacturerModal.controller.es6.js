export default class manufacturerModalController {
    constructor($scope, $mdDialog, $timeout, ngToast, bsLoadingOverlayService, inventoryManufacturersService, manufacturerId) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryManufacturersService = inventoryManufacturersService;
        this.manufacturerId = manufacturerId;

        this.model = {};
        this.manufacturerId = manufacturerId;
        this.isAddressRequired = false;

        $scope.$watch(() =>  this.model.Address, newValue => {
                this.isAddressRequired = !!(newValue && (newValue.AddressLine || newValue.City || newValue.Zip || newValue.State));}, true);

        $timeout(() => {
            $('md-dialog').animate({
                scrollTop: 0
            }, 200);
        }, 600);

        this.activate();

    }

    activate() {
        this.inventoryManufacturersService.clearModel();
        this.model = this.inventoryManufacturersService.getModel();

        if (this.manufacturerId) {
            this.bsLoadingOverlayService.start({ referenceId: "newManufacturer" });
            this.inventoryManufacturersService.getAndSetModel(this.manufacturerId)
                .then((data) => {})
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: "newManufacturer" }));
        }
    }

    save() {
        if (this.form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: "newManufacturer" });
            this.inventoryManufacturersService.saveManufacturer(this.isAddressRequired)
                .then(() => {
                    this.ngToast.success(this.model.Id ? "Manufacturer is updated" : "Manufacturer is created");
                    this.$mdDialog.hide(true);
                }).finally(() => this.bsLoadingOverlayService.stop({ referenceId: "newManufacturer" }));
        } else {
            touchedErrorFields(this.form);
        }
    }

    cancel () {
        this.$mdDialog.cancel();
    }


}
