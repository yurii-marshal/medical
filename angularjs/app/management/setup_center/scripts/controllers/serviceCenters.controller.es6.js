import addServiceCenterModalController from './modals/addServiceCenterModal.controller.es6';

export default class serviceCentersController {
    constructor($mdDialog, ngToast, infinityTableService, setupCenterListService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.setupCenterListService = setupCenterListService;

        this.cacheFiltersKey = 'management-service_centers';

        this.sortExpr = {};
        this.filter = {};

        this.getServiceCentersPromise = this._getServiceCentersPromise.bind(this);
    }

    delete(setupCenter) {
        this.setupCenterListService.deleteSetupCenter(setupCenter.Id)
            .then(() => {
                this.ngToast.success('Patient Service Center was deleted');
                this.infinityTableService.deleteRowById(setupCenter.guid);
            });
    }

    _getServiceCentersPromise(pageIndex, pageSize) {
        return this.setupCenterListService.getList(pageIndex, pageSize, this.sortExpr, this.filter);
    }

    openModal(setupCenterModel) {
        let reopenModal = function (newSetupCenterModel) {
            serviceCenterModal.apply(this, [newSetupCenterModel]);
        };

        let serviceCenterModal = function (setupCenter) {
            this.$mdDialog.show({
                controller: addServiceCenterModalController,
                controllerAs: '$ctrl',
                templateUrl: 'management/setup_center/views/modals/newServiceCenter.html',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: { setupCenter, reopenModal }
            });
        };

        serviceCenterModal.apply(this, [setupCenterModel]);
    }
}
