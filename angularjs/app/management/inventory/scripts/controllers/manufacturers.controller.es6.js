import template from '../../views/modals/manufacturer-modal.html';
import manufacturerModalController from './modals/manufacturerModal.controller.es6';
export default class manufacturersController {
    constructor($mdDialog, ngToast, inventoryManufacturersService, infinityTableService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.inventoryManufacturersService = inventoryManufacturersService;
        this.infinityTableService = infinityTableService;

        this.cacheFiltersKey = 'management-inventory-manufacturers';

        this.sortExpr = {
            'Name': true
        };

        this.filter = {};

        this.getManufacturers = this._getManufacturers.bind(this);

    }

    _getManufacturers(pageIndex, pageSize) {
        if (this.sortExpr.Name === undefined
            && this.sortExpr.Address === undefined
            && this.sortExpr.Website === undefined) {
            this.sortExpr.Name = true;
        }
        return this.inventoryManufacturersService.getList(this.filter, this.sortExpr, pageIndex, pageSize);
    }

    showModal($event, manufacturerId) {
        this.$mdDialog.show({
            template,
            targetEvent: $event,
            controller: manufacturerModalController,
            controllerAs: "modal",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                manufacturerId
            }
        }).then((isChanged ) => {
            if(isChanged) { this.infinityTableService.reload(); }
        });
    }

    deleteManufacturer(manufacturerId) {
        this.inventoryManufacturersService.deleteManufacturer(manufacturerId)
            .then(() =>  this.ngToast.success("Manufacturer is deleted"))
            .finally(() => this.infinityTableService.reload());
    }
}
