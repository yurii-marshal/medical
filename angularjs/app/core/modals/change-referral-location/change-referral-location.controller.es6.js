export default class changeReferralLocationController {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        coreReferralCardsService,
        referralId,
        locationsList
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.coreReferralCardsService = coreReferralCardsService;
        this.referralId = referralId;
        if (locationsList) {
            this.locationsList = locationsList;
        } else {
            this.getLocations();
        }

        this.filtersObj = {
            fullNameFilter: null
        };

        this.selectedLocation = null;
    }

    getLocations() {
        this.bsLoadingOverlayService.start({ referenceId: 'searchLocation' });
        this.coreReferralCardsService.getLocations(this.referralId, this.filtersObj)
            .then((response) => {
                this.locationsList = response.data;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchLocation' }));
    }

    clearFilters() {
        this.filtersObj = {
            fullNameFilter: null
        };

        this.selectedLocation = null;

        this.getLocations();
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.selectedLocation);
    }
}
