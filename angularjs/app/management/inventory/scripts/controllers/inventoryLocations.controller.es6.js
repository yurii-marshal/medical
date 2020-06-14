// Modal Controllers
import inventoryLocationModalController from './modals/inventoryLocationModal.controller.es6';

// Modal Templates
import inventoryLocationModalTemplate from '../../views/modals/location-modal.html';

export default class inventoryLocationsController {
    constructor($state,
                $mdDialog,
                ngToast,
                inventoryLocationsService,
                infinityTableService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.$state = $state;
        this.inventoryLocationsService = inventoryLocationsService;
        this.infinityTableService = infinityTableService;

        this.cacheFiltersKey = 'management-inventory-locations';

        this.sortExpr = { Name: true };
        this.filter = {};

        this.statuses = [
            { value: 'false', text: 'No' },
            { value: 'true', text: 'Yes' }
        ];

        this.toolbarItems = [
            {
                text: 'Add Location',
                icon: {
                    url: 'assets/images/default/location2.svg',
                    w: 13,
                    h: 18
                },
                clickFunction: () => this.addLocation()
            },
            {
                text: 'Print Labels',
                icon: {
                    url: 'assets/images/default/documents.svg',
                    w: 16,
                    h: 20
                },
                clickFunction: () => this.printLocationLabels()
            }
        ];

        this.getLocations = (pageIndex, pageSize) => {
            if (this.sortExpr.Name === undefined) {
                this.sortExpr.Name = true;
            }
            return inventoryLocationsService.getList(this.filter, this.sortExpr, pageIndex, pageSize);
        };
    }

    showModal($event, locationId) {
        this.$mdDialog.show({
            template: inventoryLocationModalTemplate,
            targetEvent: $event,
            controller: inventoryLocationModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                locationId,
                afterSaveFn: () => this.infinityTableService.reload()
            }
        });
    }

    deleteLocation(locationId) {
        this.inventoryLocationsService.deleteLocation(locationId)
            .then(() => this.ngToast.success('Location is deleted'))
            .then(() => this.infinityTableService.reload());
    };

    printLocationLabels() {
        this.$state.go('root.location-labels');
    }

    addLocation() {
        this.showModal();
    }
}


