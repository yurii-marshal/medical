// import timerController from './scripts/controllers/timer.controller.es6';

export default function run(
    $rootScope,
    $mdDialog,
    $state,
    authService,
    loginConstants,
    bsLoadingOverlayService,
    Idle,
    profileService) {

    'ngInject';

    // Config for spinner that show on load data from server
    bsLoadingOverlayService.setGlobalConfig({
        delay: 0, // Minimal delay to hide loading overlay in ms.
        activeClass: undefined, // Class that is added to the element where bs-loading-overlay is applied when the overlay is active.
        templateUrl: 'core/views/loading.html' // Template url for overlay element. If not specified - no overlay element is created.
    });

    let timer;
    let apiFails = 0;
    let isModalShow = false;

    // Remove Idle from app1 for works properly app2 Idle
    // Idle.watch();

    $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState, fromParams, options) => {
        // if user Need to Change Password - redirect him from root routes to login
        let profile = profileService.getProfile();

        if (toState.name.indexOf('root.') === 0 && profile.NeedChangePassword) {
            ngToast.warning('This account has temporary password. Please change your password for security reasons.');
            event.preventDefault();
            $state.go('changepass');
        }
    });

    // window.addEventListener('storage', (event) => {
    //     if (event.key === 'loggedIn') {
    //         if (event.newValue === 'true') {
    //             if (!timer) {
    //                 apiFails = 0;
    //                 activateTokenRefresh();
    //             }
    //         } else {
    //             if (timer) {
    //                 clearTimeout(timer);
    //             }
    //             timer = undefined;
    //         }
    //     }
    // }, false);

    // activateTokenRefresh();

    // function refreshToken() {
    //
    //     if (!authService._getRefreshToken()) {
    //         return null;
    //     }
    //
    //     authService.refreshToken()
    //         .then(() => apiFails = 0)
    //         .catch((err) => {
    //             let isInvalidToken = err && err.data && err.data.error === "invalid_grant",
    //                 isMaxTriesReached = apiFails >= loginConstants.refreshTokenMaxFailRequests;
    //
    //             if (timer && (isInvalidToken || isMaxTriesReached)) {
    //                 clearTimeout(timer);
    //                 timer = undefined;
    //             }
    //
    //             // if no internet connection
    //             if (err && err.status === -1) {
    //                 return;
    //             }
    //
    //             apiFails++;
    //         });
    // }

    // function activateTokenRefresh() {
    //     timer = setInterval(() => {
    //         let tokenExpireUnixTime = authService.getTokenExpireDate(),
    //             deltaTime = loginConstants.refreshTokenBeforeSec,
    //             nowUnixTime = new Date().getTime();
    //
    //         // token is not expired
    //         if (nowUnixTime < tokenExpireUnixTime) {
    //             // start updating in XX sec before expiring
    //
    //             if (nowUnixTime >= tokenExpireUnixTime - deltaTime) {
    //                 refreshToken();
    //             }
    //         } else {
    //             if ($state.current.name.indexOf('root.') === 0) {
    //                 $state.go('login');
    //             }
    //         }
    //
    //        // activateTokenRefresh();
    //     }, 1000 * 10); // check every 10 seconds
    // }

    // $rootScope.$on('IdleStart', () => {
    //
    //     if (
    //         !window.location.href.match(/\/login\//) &&
    //         !isModalShow &&
    //         !document.hidden ||
    //         (document.hidden && !isAnyTabVisible())
    //     ) {
    //         isModalShow = true;
    //         $mdDialog.show({
    //             controller: timerController,
    //             controllerAs: '$ctrl',
    //             templateUrl: 'core/views/templates/timer.html',
    //             parent: angular.element(document.body),
    //             fullscreen: true,
    //             clickOutsideToClose: false
    //         })
    //         .then(() => {
    //             refreshToken();
    //             isModalShow = false;
    //         }, () => isModalShow = false);
    //     }
    // });

    document.addEventListener('visibilitychange', function() {
        let currentTabLocation = window.location.hash;

        for (let i =0; i < localStorage.length; i++) {
            if (localStorage.key(i).indexOf('TabVisibilityProp') !== -1) {
                localStorage.removeItem(localStorage.key(i));
            }
        }

        if (!document.hidden) {
            localStorage.setItem(`${currentTabLocation}TabVisibilityProp`, true);
        }
    });

    function isAnyTabVisible() {
        for (let i =0; i < localStorage.length; i++) {
            if (localStorage.key(i).indexOf('TabVisibilityProp') !== -1) {
                return true;
            }
        }
        return false;
    }
}
