import editAdjustmentReasonController from './modals/edit-adjustment-reason/edit-adjustment-reason.controller.es6';

export default class adjustmentReasonsController {
    constructor(
        $state,
        $mdDialog,
        ngToast,
        billingAdjustmentReasonsHttpService,
        infinityTableService,
        infinityTableFilterService
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.billingAdjustmentReasonsHttpService = billingAdjustmentReasonsHttpService;
        this.infinityTableService = infinityTableService;
        this.infinityTableFilterService = infinityTableFilterService;

        this.cacheFiltersKey = 'management-billing-adjustment-reasons';
        this.sortExpr = {
            Name: true
        };
        this.filters = {};

        this.getAdjustmentReasons = this._getAdjustmentReasons.bind(this);
    }

    _getAdjustmentReasons(pageIndex, pageSize) {
        const sortExpression = this.infinityTableFilterService.getSortExpressions(this.sortExpr);
        const filters = this.infinityTableFilterService.getFilters(this.filters);
        const params = Object.assign({}, filters, {
            selectCount: true,
            SortExpression: sortExpression,
            PageIndex: pageIndex,
            PageSize: pageSize
        });

        return this.billingAdjustmentReasonsHttpService.getAdjustmentReasons(params);
    }

    openAdjustmentReasonModal(model) {
        this.$mdDialog.show({
            templateUrl: 'management/management-billing/components/adjustment-reasons/modals/edit-adjustment-reason/edit-adjustment-reason.html',
            controller: editAdjustmentReasonController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                model: Object.assign({}, model)
            }
        }).then(() => this.infinityTableService.reload());
    }

    deleteAdjustmentReason(id) {
        this.billingAdjustmentReasonsHttpService.deleteAdjustmentReason(id)
            .then(() => this.ngToast.success('Adjustment reason is deleted'))
            .finally(() => this.infinityTableService.reload());
    }
}
