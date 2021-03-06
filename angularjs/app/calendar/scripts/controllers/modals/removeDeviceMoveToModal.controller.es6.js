class removeDeviceMoveToModalController {
    constructor($mdDialog, $scope, bsLoadingOverlayService,
                inventoryEquipmentService, transferEquipmentService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.transferEquipmentService = transferEquipmentService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

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

        $scope.$watch(
            _=> this.filtersObj,
            _=> {
                this.pageIndex = 0;
                this.locationsList = [];
                this.getLocations();
            },
            true);
    }

    getLocationTypes() {
        this.transferEquipmentService.getLocationTypes()
            .then(response => {
                response.data.Items.forEach(item => {
                    if (item.Name !== 'Patient') {
                        this.locationTypes.push(item);
                    }
                });
            });
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

    getLocations() {
        let locPromise = undefined;

        switch (this.filtersObj.TypeId) {
            case this.inventoryEquipmentService.LOCATION_TYPE().PERSONNEL:
                locPromise = this.getPersonnels();
                this.selectedLocationType.Name = 'Personnel';
                break;
            default:
                locPromise = this.getWarehouses();
                this.selectedLocationType.Name = 'Warehouse';
                break;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'searchLocation' });

        locPromise
            .then(response => {
                this.locationsList = this.locationsList.concat(response.Items);
                this.showMoreButton = !this.locationsList.length >= response.Count;
            })
            .finally(_ => this.bsLoadingOverlayService.stop({ referenceId: 'searchLocation' }));

    }

    showMore() {
        this.pageIndex++;
        this.getLocations();
    }

    clearFilters() {
        this.filtersObj = {
            Name: undefined,
            TypeId: undefined
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

angular
    .module('app.calendar')
    .controller('removeDeviceMoveToModalController', removeDeviceMoveToModalController);