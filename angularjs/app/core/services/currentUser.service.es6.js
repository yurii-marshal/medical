export default class CurrentUser {
    constructor(
        $rootScope,
        $state,
        profileService,
        authService,
        ngToast,
        userPermissions,
        WEB_API_IDENTITY_URI,
        userPicture,
        $injector
    ) {
        'ngInject';

        this.$state = $state;
        this.profileService = profileService;
        this.authService = authService;
        this.ngToast = ngToast;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;

        this.userPicture = userPicture;
        // this.tabNotifier = $injector.get('crosstabNotifierProvider');

        this.userPermissions = userPermissions;

        this.profile = {};

        this.init();

        // $rootScope.$on('loggedIn', () => this.init());

        $rootScope.$on('logout', () => this.clear());

        $rootScope.$on('updateProfile', () => {
            this.clear();
            this.profileService.getProfilePromise()
                .then((response) => {
                    if (response.data) {
                        this._setProfileParams(response.data);
                    }
                });
        });

        // this.tabNotifier.on('loggedIn', () => {
        //     const prevUrl = localStorage.getItem('url_before_login');
        //
        //     this.profileService.getProfilePromise()
        //         .then((response) => {
        //             if (response.data && !response.data.NeedChangePassword && !prevUrl) {
        //
        //                 this.$state.go('root.dashboard.index');
        //                 this._setProfileParams(response.data);
        //             } else if (response.data && !response.data.NeedChangePassword && prevUrl) {
        //                 window.location.href = prevUrl;
        //                 this._setProfileParams(response.data);
        //             }
        //         });
        // }, this);
    }

    init() {
        const profile = this.profileService.getProfile();

        if (this.authService.getAccessToken() && profile && _.isEmpty(profile)) {
            this.profileService.getProfilePromise()
                .then((response) => {
                    if (response.data) {
                        this._setProfileParams(response.data);
                    }
                });
        } else if (this.authService.getAccessToken()) {
            this._setProfileParams(profile);
        }
    }

    clear() {
        this.profile = { ProfilePicture: { Data: '' }};
    }

    _setProfileParams(profile) {
        if (profile.NeedChangePassword) {
            this.$state.go('changepass', { email: profile.Email } );
            this.ngToast.warning('This account has temporary password. Please change your password for security reasons.');
            return;
        }
        this.profile.Name = profile.Name;

        if (profile.PictureUrl) {
            this.profile.PictureUrl = this.userPicture.getUserAvatarImgUrl(profile.Id);
        }

        if (!this.profile.Name) {
            return;
        }

        this.profile.ScheduleAble = profile.Schedulable;
        this.profile.Email = profile.Email;
        this.profile.Name.FullName = `${this.profile.Name.FirstName} ${this.profile.Name.LastName}`;
    }

}

