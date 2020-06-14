import template from '../../views/modals/category-modal.html';
import categoryModalController from './modals/categoryModal.controller.es6';
export default class categoriesController {
    constructor($mdDialog, ngToast, inventoryCategoriesService, infinityTableService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.inventoryCategoriesService = inventoryCategoriesService;
        this.infinityTableService = infinityTableService;

        this.cacheFiltersKey = 'management-inventory-categories';

        this.sortExpr = {
            'Name': true
        };

        this.filter = {};

        this.getCategories = this._loadCategories.bind(this);
    }


    _loadCategories(pageIndex, pageSize) {
        if (this.sortExpr.Name === undefined && this.sortExpr.Description === undefined) {
            this.sortExpr.Name = true;
        }

        return this.inventoryCategoriesService.getList(this.filter, this.sortExpr, pageIndex, pageSize);
    }

    showModal ($event, categoryId) {
        this.$mdDialog.show({
            template: template,
            targetEvent: $event,
            controller: categoryModalController,
            controllerAs: "$ctrl",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                categoryId,
                afterSaveFn: () => { this.infinityTableService.reload(); }
            }
        });
    }

    deleteCategory(categoryId) {
        this.inventoryCategoriesService.deleteCategory(categoryId)
            .then(() => {
                this.ngToast.success("Category is deleted");

            }).finally(() => {
                this.infinityTableService.reload();
            });
    }

}
