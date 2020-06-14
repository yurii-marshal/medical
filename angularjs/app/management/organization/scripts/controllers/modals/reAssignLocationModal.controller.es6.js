export default class reAssignLocationModalController {
    constructor($mdDialog, bsLoadingOverlayService, organizationLocationsService, locationId, locationName) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.organizationLocationsService = organizationLocationsService;
        this.locationId = locationId;
        this.locationName = locationName;

        this.reAssignedLocation = undefined;
    }

    getLocations(Name, pageIndex) {
        return this.organizationLocationsService.getLocationsDictionary(Name, pageIndex)
            .then((response) => {
                response.data.Items = response.data.Items.filter((item) => item.Id !== this.locationId);
                return response.data;
            });
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    confirm() {
        if (this.modalForm.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            let model = {
                OldLocationId: this.locationId,
                NewLocationId: this.reAssignedLocation.Id
            };
            this.organizationLocationsService.reAssignLocation(model)
                .then(() => this.$mdDialog.hide())
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            touchedErrorFields(this.modalForm);
        }
    }
}