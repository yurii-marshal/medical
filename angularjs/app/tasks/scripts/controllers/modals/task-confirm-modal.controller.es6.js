export default class taskConfirmModalCtrl {
    constructor($mdDialog, tasksService, tasksIds, actionType) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.tasksService = tasksService;
        this.tasksIds = tasksIds;
        this.actionType = actionType;
    }

    confirm() {
        return this.actionType === 'complete'
            ? this.completeTasks()
            : this.deleteTasks();
    }

    completeTasks() {
        this.tasksService.completeTasks(this.tasksIds)
            .then(() => this.$mdDialog.hide());
    }

    deleteTasks() {
        this.tasksService.deleteTasks(this.tasksIds)
            .then(() => this.$mdDialog.hide());
    }

    cancel() {
        this.$mdDialog.cancel();
    }

}
