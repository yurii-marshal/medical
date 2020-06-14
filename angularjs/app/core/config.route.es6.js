export default function config($stateProvider, $urlRouterProvider, KeepaliveProvider, IdleProvider) {
    'ngInject';

    IdleProvider.idle(900);         // 15 min
    IdleProvider.timeout(false);
    KeepaliveProvider.interval(60);

    // Loading without autorization
    $stateProvider
        .state('login', {
            url: '/login/:back_url',
            templateUrl: 'core/views/login.html',
            controller: 'loginController as login',
            params: {
                pageTitle: 'Login'
            }
        })
        .state('forbidden', {
            url: '/forbidden',
            templateUrl: 'core/views/forbidden.html',
            params: {
                pageTitle: 'Forbidden'
            }
        })
        .state('forgotpass', {
            url: '/forgotpass/',
            templateUrl: 'core/views/forgotpass.html',
            controller: 'forgotpassController as forgotpass',
            params: {
                pageTitle: 'Forgot Password'
            }
        })
        .state('changepass', {
            url: '/changepass/',
            templateUrl: 'core/views/changePass.html',
            controller: 'changepassController as changepass',
            params: {
                email: '',
                pageTitle: 'Change Password'
            }
        });
}
