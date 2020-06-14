export default class Cms1500TypeModalCtrl {
    constructor($mdDialog) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.selectedOption = 'PreprintedForm';
        this.options = [
            { Id: 'PreprintedForm', Name: 'Preprinted Form' },
            { Id: 'BlankForm', Name: 'Blank Form' }
        ];
    }

    print(option) {
        if (option === 'BlankForm') {
            this.$mdDialog.hide(true);
        }
        this.$mdDialog.hide();
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
