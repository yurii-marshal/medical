export default class taskModalCtrl {
    constructor($mdDialog,
                ngToast,
                bsLoadingOverlayService,
                tasksService,
                taskId,
                customSearchAutocompleteService) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.tasksService = tasksService;
        this.taskId = taskId;
        this.customSearchAutocompleteService = customSearchAutocompleteService;

        // Will be got from dictionary
        this.taskPriorities = this.tasksService.getTaskPriorities();
        this.autocompleteOptions = { patient: true, user: false, action: false };

        this.model = {};

        if (this.taskId) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            tasksService.getTaskById(this.taskId)
                .then((response) => {
                    this.model = response.data;

                    this.model.DueDate = this.model.DueDate ? moment(this.model.DueDate).format('MM/DD/YYYY hh:mm A') : '';
                    this.model.Priority = this.model.Priority
                        ? _.find(this.taskPriorities, (i) => i.name === this.model.Priority)
                        : this.taskPriorities[1];

                    this.model.Title =
                        this.customSearchAutocompleteService.convertToJustName(this.model.Title);
                    this.model.Description =
                        this.customSearchAutocompleteService.convertToJustName(this.model.Description);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        } else {
            this.model = tasksService.initDefaultModel();

            this.model.Priority = this.model.Priority
                ? _.find(this.taskPriorities, (i) => i.name === this.model.Priority.name)
                : this.taskPriorities[1];
        }
    }

    getUsersDictionary(name, assigneeArr) {
        return this.tasksService.getUsersDictionary(name)
            .then((res) => {
                return _.filter(res, (user) => {
                    return !_.find(assigneeArr, (i) => i.Id.toString() === user.Id.toString());
                });
            });
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.TaskForm.$invalid) {
            touchedErrorFields(this.TaskForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.tasksService.saveTask(this.taskId, this.model)
            .then(() => {
                this.ngToast.success(`Issue is ${this.taskId ? 'updated' : 'created'}`);
                this.$mdDialog.hide();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }
}
