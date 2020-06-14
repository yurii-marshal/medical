export default class notesDialogController {
    constructor($mdDialog, currentNote) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.currentNote = currentNote || '';
    }

    cancel() {
        this.$mdDialog.cancel();
    }

    save() {
        this.$mdDialog.hide(this.currentNote);
    }
}