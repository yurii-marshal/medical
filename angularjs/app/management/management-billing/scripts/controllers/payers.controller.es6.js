import addPayerModalController from './modals/addPayerModal.controller.es6';

export default class payersController {
    constructor($state, $mdDialog, ngToast, $filter, $q, infinityTableService, payersService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.$filter = $filter;
        this.$q = $q;
        this.infinityTableService = infinityTableService;
        this.payersService = payersService;

        this.cacheFiltersKey = 'management-billing-payers';

        this.payers = [];
        this.filter = {};
        this.sortExpr = {};

        this.getPayers = (pageIndex, pageSize) => {
            return payersService.getList(this.filter, this.sortExpr, pageIndex, pageSize);
        };

        if ($state.params.showNewPayerModal) {
            this.addPayer();
        }
    }

    addPayer(event) {
        this.$mdDialog.show({
            controller: addPayerModalController,
            controllerAs: '$ctrl',
            templateUrl: 'management/management-billing/views/modals/addPayer.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        });
    }

    deletePayer(Id) {
        return this.payersService.deletePayer(Id)
            .then(response => {
                this.infinityTableService.reload();
                this.ngToast.success('Payer is deleted');
            });
    }

    getPayerIds(payerId, pageIndex) {
        return this.payersService.getPayerIdList(payerId, pageIndex)
            .then(response => response.data);
    }

    goToPayer(id) {
        this.$state.go('root.management.payer.details', { id });
    }
}
