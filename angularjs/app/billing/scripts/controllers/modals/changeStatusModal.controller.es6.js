export default class changeStatusModalController {
    constructor($mdDialog, infinityTableService, changeInProgressStatusService, statuses, ids, stateName, allStatuses) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.infinityTableService = infinityTableService;
        this.changeInProgressStatusService = changeInProgressStatusService;
        this.inProgressStatus = false;
        this.ids = ids;
        this.statuses = statuses;
        this.stateName = stateName;
        this.Status =undefined;
        this.allStatuses = allStatuses;
    }

    toggle() {
        this.inProgressStatus = !this.inProgressStatus;
    }

    save(status) {
        this.changeInProgressStatusService.changeStatus(status, this.ids, this.stateName)
            .then(() => this.infinityTableService.reload());

        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
