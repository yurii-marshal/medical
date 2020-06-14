export default function setWidthForLogin($rootScope) {
    'ngInject';

    return {
        restrict: 'A',
        link: (scope, elem) => {
            $rootScope.$on('$stateChangeStart', function($event, next) {
                const matchUrl = next.url || window.location.href;

                // This directive is fix for min-width when you located in login page

                if ((matchUrl.match('login') ||
                    matchUrl.match('forbidden') ||
                    matchUrl.match('forgotpass') ||
                    matchUrl.match('changepass'))
                ) {
                    if (!elem.hasClass('fix-width-login-page')) {
                        elem.addClass('fix-width-login-page');
                    }
                } else if (elem.hasClass('fix-width-login-page')) {
                    elem.removeClass('fix-width-login-page');
                }
            });
        }
    };
}
