export default class changepassController {
    constructor($state, authService, ngToast, bsLoadingOverlayService) {
        'ngInject';

        this.$state = $state;
        this.authService = authService;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        if (!$state.params.email) {
            authService.logout();
            $state.go('login');
            ngToast.warning('Please log in with our temporary password');
        }

        this.bsLoadingOverlayService.stop({ referenceId: 'change-password' });

        this.isLoading = false;
        this.vm = {
            oldPassword: '',
            newPassword: '',
            rptPassword: ''
        };
    }

    submitForm(event) {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.save();
        }
    }

    save() {
        if (this.changePasswordForm.$invalid) {
            touchedErrorFields(this.changePasswordForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'change-password' });
        this.isLoading = true;

        let updateProfileModel = {
            Email: this.$state.params.email,
            NewPassword: this.vm.newPassword,
            Password: this.vm.oldPassword
        };

        this.authService.changePass(updateProfileModel)
            .then(() => {
                this.ngToast.success('Your password has changed');
                this.authService.logout();
                this.$state.go('login');
            })
            .finally(() => {
                this.isLoading = false;
                this.bsLoadingOverlayService.stop({ referenceId: 'change-password' });
            });
    }

    cancel() {
        this.authService.logout();
        this.$state.go('login');
    }
}

