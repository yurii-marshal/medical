import hcpcsModalController from './modals/hcpcsModal.controller.es6';

export default class hcpcsController {
    constructor($scope, $mdDialog, ngToast, hcpcsService, infinityTableService) {
        'ngInject';

        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.hcpcsService = hcpcsService;
        this.infinityTableService = infinityTableService;

        this.cacheFiltersKey = 'management-billing-hcpcs';

        this.sortExpr = {};
        this.filter = {};

        this.getHcpcsList = (pageIndex, pageSize) => {
            return hcpcsService.getHcpcsList(this.filter, this.sortExpr, pageIndex, pageSize);
        };
    }

    showModal($event, hcpcsObj) {
        if (hcpcsObj && hcpcsObj.Default) { return; }

        let isNew = false;

        if(!hcpcsObj) {
            hcpcsObj = {
                Code: "",
                ShortDescription: "",
                LongDescription: ""
            };
            isNew = true;
        }

        this.$mdDialog.show({
            templateUrl: 'management/management-billing/views/modals/hcpcs-modal.html',
            targetEvent: $event,
            controller: hcpcsModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { hcpcsObj, isNew }
        })
        .then(_ => this.infinityTableService.reload());
    }

    deleteHcpcs(item) {
        this.hcpcsService.deleteHcpcs(item.Code)
            .then(_ => this.ngToast.success('Hcpcs Code was deleted'))
            .finally(_ => this.infinityTableService.reload());
    }
}
