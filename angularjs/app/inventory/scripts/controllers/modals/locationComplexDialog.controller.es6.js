export default class locationComplexDialogController {
    constructor(
        $mdDialog,
        $timeout,
        $scope,
        $state,
        bsLoadingOverlayService,
        inventoryEquipmentService,
        transferEquipmentService,
        excludeLocations
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.transferEquipmentService = transferEquipmentService;
        this.excludeLocations = excludeLocations;

        this.filtersObj = {
            Name: undefined,
            TypeId: this.inventoryEquipmentService.LOCATION_TYPE().LOCATION
        };
        this.pageIndex = 0;
        this.locationsList = [];
        this.locationTypes = [];
        this.selectedLocation = undefined;
        this.selectedLocationType = { Name: 'Warehouse' };
        this.showMoreButton = true;
        this.pageSize = 10;

        this.getLocationTypes();

        $timeout(() => { $('md-dialog').animate({ scrollTop: 0 }, 200); }, 600);

        $scope.$watch(() => this.filtersObj, (newVal, oldVal) => {
            this.pageIndex = 0;
            let needToCleanList = false;

            if (!_.isEqual(newVal, oldVal)) {
                needToCleanList = true;
            }
            this.getLocations(needToCleanList);
        }, true);
    }

    getLocationTypes() {
        this.transferEquipmentService.getLocationTypes()
            .then((response) => {
                this.bsLoadingOverlayService.start({ referenceId: 'searchLocation' });
                this.locationTypes = response.data.Items;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchLocation' }));
    }

    getPatients() {
        let paramsObj = {
            Status: 1,
            pageIndex: this.pageIndex,
            pageSize: 10,
            fullName: this.filtersObj.Name,
            SortExpression: 'Name.FullName ASC'
        };
        return this.inventoryEquipmentService.getPatientsByName(paramsObj);
    }

    getWarehouses() {
        let paramsObj = {
            PageIndex: this.pageIndex,
            pageSize: 10,
            Name: this.filtersObj.Name,
            SortExpression: 'Name ASC'
        };
        return this.inventoryEquipmentService.getLocationsByName(paramsObj);
    }

    getPersonnels() {
        let paramsObj = {
            pageIndex: this.pageIndex,
            pageSize: 10,
            fullName: this.filtersObj.Name,
            SortExpression: 'Name.FullName ASC'
        };
        return this.inventoryEquipmentService.getPersonnelsByName(paramsObj);
    }

    getLocations(needToCleanList) {
        let locPromise = undefined;

        switch (this.filtersObj.TypeId) {
            case this.inventoryEquipmentService.LOCATION_TYPE().PATIENT:
                locPromise = this.getPatients();
                this.selectedLocationType.Name = 'Patient';
                break;
            case this.inventoryEquipmentService.LOCATION_TYPE().PERSONNEL:
                locPromise = this.getPersonnels();
                this.selectedLocationType.Name = 'Personnel';
                break;
            default: //this.inventoryEquipmentService.LOCATION_TYPE().LOCATION:
                locPromise = this.getWarehouses();
                this.selectedLocationType.Name = 'Warehouse';
                break;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'searchLocation' });
        locPromise
            .then((response) => {
                response.Items = response.Items.filter((item) => {
                    return !_.find(this.excludeLocations,
                        (locationId) => locationId.toString() === item.Id.toString());
                });
                if (needToCleanList) {
                    this.locationsList = [];
                }
                this.locationsList = this.locationsList.concat(response.Items);
                this.showMoreButton = this.locationsList.length < response.Count;
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
            TypeId: this.inventoryEquipmentService.LOCATION_TYPE().LOCATION
        };
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.selectedLocation.Type = this.selectedLocationType;
        this.$mdDialog.hide(this.selectedLocation);
    }
}
