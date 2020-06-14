export default class groupModalController {
    constructor($mdDialog, $timeout, ngToast, bsLoadingOverlayService, inventoryGroupsService, groupId) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryGroupsService = inventoryGroupsService;
        this.groupId = groupId;

        this.model = {};
        this.activate();

        $timeout( () => {
            $('md-dialog').animate({
                scrollTop: 0
            }, 200);
        }, 600);
    }

    activate() {
        this.inventoryGroupsService.clearModel();
        this.model = this.inventoryGroupsService.getModel();

        if (this.groupId) {
            this.bsLoadingOverlayService.start({ referenceId: "newGroup" });
            this.inventoryGroupsService.getAndSetModel(this.groupId)
                .then((data) => { })
                .finally(() => {this.bsLoadingOverlayService.stop({ referenceId: "newGroup" });});
        }
    }

    save() {
        if (this.form.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: "newGroup" });
            this.inventoryGroupsService.saveGroup()
                .then( (data) => {
                    this.ngToast.success(this.model.Id ? "Group is updated" : "Group is created");
                    this.$mdDialog.hide(true);
                }).finally( () =>  this.bsLoadingOverlayService.stop({ referenceId: "newGroup" }));
        } else {
            touchedErrorFields(this.form);
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
