export default class timerController {
    constructor($rootScope, $state, $mdDialog, authService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.authService = authService;
    }

    continueWorking() {
        this.$mdDialog.hide();
    }

    logout() {
        this.authService.logout();
        this.$mdDialog.cancel();
    }
}
