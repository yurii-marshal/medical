export default class loginController {
    constructor(
        $rootScope,
        $state,
        $stateParams,
        $mdDialog,
        authService,
        profileService,
        userPermissions,
        $injector
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$stateParams = $stateParams;
        this.$mdDialog = $mdDialog;
        this.authService = authService;
        this.profileService = profileService;
        // this.tabNotifier = $injector.get('crosstabNotifierProvider');

        this.userPermissions = userPermissions;

        this.remember = false;
        this.isLoading = false;

        this.loginModel = {
            username: '',
            password: ''
        };

        this._activate();
    }

    _activate() {
        this.authService.logout();
        this.profileService.clearProfile();

        if (this.authService.getAccessToken()) {
            this._determineRedirection();
            return false;
        }

        this.$mdDialog.hide();
        $('body').removeAttr('style');  // we need this to clear custom material styles, that left after modal windows or autocomplete/selects
        checkRememberMe.apply(this);

        function checkRememberMe() {
            let remember = localStorage.getItem('remember');

            if (remember) {
                this.loginModel.username = remember;
                this.remember = true;
            }
        }
    }

    submitForm(event) {
        if (event.keyCode === 13) {
            if (this.isLoading) {
                return;
            }
            this.login();
        }
    }

    login() {
        if (this.loginForm.$invalid) {
            touchedErrorFields(this.loginForm);
            return;
        }

        this.isLoading = true;

        this.authService.login(this.loginModel)
            .then(() => {

                this.userPermissions.initPermissions().then(() => {

                    if (this.remember) {
                        localStorage.setItem('remember', this.loginModel.username);
                    } else {
                        localStorage.removeItem('remember');
                    }

                    if (this.$stateParams.back_url) {
                        window.location = decodeURI(this.$stateParams.back_url);
                    } else {
                        this._determineRedirection();
                    }

                    // this.$rootScope.$broadcast('loggedIn');

                    // this.tabNotifier.setTabLoggedIn();

                });

            }).finally(() => this.isLoading = false);
    }

    _determineRedirection() {
        const prevUrl = JSON.parse(localStorage.getItem('url_before_login'));

        this.profileService.getProfilePromise()
            .then((response) => {
                if (!response.data.NeedChangePassword) {
                    if (prevUrl) {
                        window.location.href = prevUrl;
                    } else {
                        this.$state.go('root.dashboard.index');
                    }
                }
            });
    }
}
