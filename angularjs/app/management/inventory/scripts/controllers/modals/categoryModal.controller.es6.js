export default class categoryModalController {
    constructor($mdDialog, $timeout, ngToast, bsLoadingOverlayService, inventoryCategoriesService, categoryId, afterSaveFn) {
        'ngInject';
        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryCategoriesService = inventoryCategoriesService;
        this.categoryId = categoryId;
        this.afterSaveFn = afterSaveFn;

        this.model = {};

        this.activate();

        $timeout( () => {
            $('md-dialog').animate({
                scrollTop: 0
            }, 200);
        }, 600);

    }

    activate () {
        this.inventoryCategoriesService.clearModel();
        this.model = this.inventoryCategoriesService.getModel();

        if (this.categoryId) {
            this.bsLoadingOverlayService.start({ referenceId: "newCategory" });
            this.inventoryCategoriesService.getAndSetModel(this.categoryId)
                .finally( () => { this.bsLoadingOverlayService.stop({ referenceId: "newCategory" }); });
        }
    }

    save () {
        if (this.form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: "newCategory" });
            this.inventoryCategoriesService.saveCategory()
                .then( (data) => {
                    this.ngToast.success(this.model.Id ? "Category is updated" : "Category is created");
                    this.afterSaveFn();
                    this.$mdDialog.hide();
                })
                .finally( () => { this.bsLoadingOverlayService.stop({ referenceId: "newCategory" }); });

        } else {
            touchedErrorFields(this.form);
        }
    }

    cancel () {
        this.$mdDialog.cancel();
    }
}
