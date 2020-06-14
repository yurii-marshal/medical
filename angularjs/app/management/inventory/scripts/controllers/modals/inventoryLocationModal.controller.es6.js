export default class inventoryLocationModalController {
    constructor($mdDialog,
                $timeout,
                $q,
                ngToast,
                bsLoadingOverlayService,
                inventoryLocationsService,
                locationId,
                afterSaveFn) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryLocationsService = inventoryLocationsService;
        this.afterSaveFn = afterSaveFn;

        this.model = {};
        this.locationId = locationId;
        this.defaultLocation = undefined;
        this.hasAnotherDefault = false;
        this.statuses = [
            { value: false, text: 'No' },
            { value: true, text: 'Yes' }
        ];

        this.activate();

        $timeout(() => {
            $('md-dialog').animate({
                scrollTop: 0
            }, 200);
        }, 600);

    }

    activate() {
        this.inventoryLocationsService.clearModel();
        this.model = this.inventoryLocationsService.getModel();

        let promises = [];

        let getDefaultLocationPromise = this.inventoryLocationsService.getDefaultLocation()
            .then((response) => {
                if (response) {
                    this.defaultLocation = response;
                    this.hasAnotherDefault = true;
                }
            });
        promises.push(getDefaultLocationPromise);

        if (this.locationId) {
            promises.push(this.inventoryLocationsService.getAndSetModel(this.locationId));
        }

        this.bsLoadingOverlayService.start({ referenceId: 'newLocation' });
        this.$q.all(promises)
            .then(() => {
                if (this.defaultLocation
                    && this.model.Default
                    && this.defaultLocation.Id === this.locationId) {
                    this.hasAnotherDefault = false;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'newLocation' }));
    }

    save() {
        if (this.form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'newLocation' });
            this.inventoryLocationsService.saveLocation(this.isAddressRequired)
                .then((data) => {
                    this.ngToast.success(`Location is ${this.model.Id ? 'updated' : 'created'}`);
                    this.afterSaveFn();
                    this.$mdDialog.hide();
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'newLocation' }));
        } else {
            touchedErrorFields(this.form);
        }
    };

    cancel() {
        this.$mdDialog.cancel();
    }
}

