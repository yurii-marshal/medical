export default class forgotpassController {
    constructor($state, authService, ngToast) {
        'ngInject';

        this.$state = $state;
        this.authService = authService;
        this.ngToast = ngToast;

        this.isLoading = false;
        this.userName = undefined;
        this.userEmail = undefined;
    }

    submitForm(event) {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.reset();
        }
    }

    reset() {
        if (this.forgotPassForm.$invalid) {
            touchedErrorFields(this.forgotPassForm);
            return;
        }

        this.isLoading = true;

        this.remindModel = {
            Login: this.userName,
            Email: this.userEmail
        };

        this.authService.remindPass(this.remindModel)
            .then(() => {
                this.ngToast.success('Your new password was sent to email');
                this.$state.go('login');
            })
            .finally(() => this.isLoading = false);
    }
}
