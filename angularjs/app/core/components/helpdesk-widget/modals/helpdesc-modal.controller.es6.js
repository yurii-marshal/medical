export default class HelpDescModalCtrl {
    constructor(
        $mdDialog,
        coreUsersService,
        bsLoadingOverlayService
    ) {
        'ngInject';

        this.model = {
            subject: null,
            description: null,
            agree: false
        };

        this.filesCollections = [];
        this.selectedFiles = [];

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.coreUsersService = coreUsersService;
        this.$mdDialog = $mdDialog;
    }

    onFileSelected() {
        if (this.selectedFiles.length) {
            this.selectedFiles.forEach((file) => {
                this.filesCollections.push(file);
            });
        }
    }

    onRemoveFileItem(index) {
        this.filesCollections.splice(index, 1);
    }

    send() {
        if (!this.form.$valid) {
            touchedErrorFields(this.form);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'helpDescModal' });

        this.coreUsersService.sendToHelpdesc({
            Subject: this.model.subject,
            Description: this.model.description,
            Files: this.filesCollections
        }).then(() => {
            this.$mdDialog.hide(true);
        }).finally(() => {
            this.bsLoadingOverlayService.stop({ referenceId: 'helpDescModal' });
        });

    }

    close() {
        this.$mdDialog.cancel();
    }
}
