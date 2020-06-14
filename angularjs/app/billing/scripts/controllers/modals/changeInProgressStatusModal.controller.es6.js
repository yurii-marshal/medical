export default class changeInProgressStatusModalController {
    constructor($mdDialog, infinityTableService, changeInProgressStatusService, statuses, ids, stateName) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.infinityTableService = infinityTableService;
        this.changeInProgressStatusService = changeInProgressStatusService;
        this.inProgressStatus = false;
        this.ids = ids;
        this.statuses = statuses;
        this.stateName = stateName;

        this.setInProgressStatus();
    }

    toggle() {
        this.inProgressStatus = !this.inProgressStatus;
    }

    save(status) {
        this.changeInProgressStatusService.changeInProgressStatus(status, this.ids, this.stateName)
            .then(() => this.infinityTableService.reload());

        this.$mdDialog.hide();
    };

    cancel() {
        this.$mdDialog.cancel();
    }

    setInProgressStatus() {
        let statuses = this.statuses;

        if (allValuesSame(statuses)) {
            this.inProgressStatus = statuses[0];
        }

        function allValuesSame(arr) {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] !== arr[0]) { return false; }
            }
            return true;
        }
    }
}
