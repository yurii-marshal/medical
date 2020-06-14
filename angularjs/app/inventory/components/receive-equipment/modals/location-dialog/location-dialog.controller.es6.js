export default class locationDialogController {
    constructor(
        $mdDialog,
        $timeout,
        $scope,
        $state,
        bsLoadingOverlayService,
        receiveEquipmentService,
        transferEquipmentService,
        inventoryAction,
        isAnyLocation,
        locationTypeId,
        storeIds
    ) {
        'ngInject';

        // locationTypeId - if we want to search locations by some location type

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.receiveEquipmentService = receiveEquipmentService;
        this.transferEquipmentService = transferEquipmentService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryAction = inventoryAction;
        this.isAnyLocation = isAnyLocation;
        this.isAnyLocationAvailable = !(isAnyLocation === undefined);
        this.storeIds = storeIds || null;

        this.filtersObj = {
            Name: undefined,
            TypeId: locationTypeId,
            Ids: this.storeIds
        };

        this.sortExpr = {
            Name: true
        };

        this.locationsList = [];
        this.locationTypes = [];
        this.selectedLocation = undefined;
        this.showMoreButton = true;
        this.pageIndex = 0;
        this.pageSize = 10;

        $timeout(() => $('md-dialog').animate({ scrollTop: 0 }, 200), 600);

        $scope.$watch(() => this.filtersObj, (newVal, oldVal) => {
            this.pageIndex = 0;
            let needToCleanList = false;

            if (!_.isEqual(newVal, oldVal)) {
                needToCleanList = true;
            }
            this.getLocations(needToCleanList);

            this.selectedLocation = undefined;
        }, true);
    }

    anyLocationChanged() {
        if (this.isAnyLocation) {
            this.selectedLocation = undefined;
        } else if (this.selectedLocation) {
            this.isAnyLocation = false;
        }
    }

    getLocations(needToCleanList) {
        this.bsLoadingOverlayService.start({ referenceId: 'searchLocation' });

        let promise = this.inventoryAction === 'transfer'
            ? this.transferEquipmentService.getLocations(this.filtersObj, this.sortExpr, this.pageIndex, this.pageSize)
            : this.receiveEquipmentService.getLocations(this.filtersObj, this.sortExpr, this.pageIndex, this.pageSize);

        promise
            .then((response) => {
                response.data.Items.forEach((item) => {
                    item.DisplayName = item.Name + `${item.Description ? ', ' + item.Description : ''}`;
                });

                if (needToCleanList) {
                    this.locationsList = [];
                }

                this.locationsList = this.locationsList.concat(response.data.Items);
                this.showMoreButton = this.locationsList.length < response.data.Count;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchLocation' }));
    }

    showMore() {
        this.pageIndex++;
        this.getLocations();
    }

    clearFilters() {
        this.filtersObj = {
            Name: undefined,
            TypeId: undefined,
            Ids: this.storeIds
        };

        this.selectedLocation = undefined;
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        let location = this.isAnyLocation || !this.selectedLocation
            ? {
                Id: '',
                UniqueId: '',
                Description: '',
                Name: ''
            }
            : this.selectedLocation;
        this.$mdDialog.hide(location);
    }
}
