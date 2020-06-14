(function () {
    "use strict";

    angular
        .module("app")
        .factory("tokenService", tokenService);

    /* @ngInject */
    function tokenService($q, $window, $injector,
                          WEB_API_SERVICE_URI,
                          WEB_API_INVENTORY_SERVICE_URI,
                          WEB_API_IDENTITY_URI,
                          WEB_API_BILLING_SERVICE_URI,
                          WEB_API_FAX_URI,
                          WEB_API_NLP_SERVICE_URI,
                          WEB_API_TASKS_SERVICE_URI,
                          WEB_API_CATALOG_URI,
                          WEB_API_TEMPLATES_URI,
                          WEB_API_ORGANIZATIONS_URI) {
        return {
            request: function (config) {
                if (config && config.url
                    && (
                    config.url.indexOf(WEB_API_SERVICE_URI) > -1
                    || config.url.indexOf(WEB_API_INVENTORY_SERVICE_URI) > -1
                    || config.url.indexOf(WEB_API_BILLING_SERVICE_URI) > -1
                    || config.url.indexOf(WEB_API_NLP_SERVICE_URI) > -1
                    || config.url.indexOf(WEB_API_TASKS_SERVICE_URI) > -1
                    || config.url.indexOf(WEB_API_IDENTITY_URI) > -1
                    || config.url.indexOf(WEB_API_FAX_URI) > -1
                    || config.url.indexOf(WEB_API_CATALOG_URI) > -1
                    || config.url.indexOf(WEB_API_TEMPLATES_URI) > -1
                    || config.url.indexOf(WEB_API_ORGANIZATIONS_URI) > -1)
                    && isUrlRequireToken(config.url)) {
                    config.headers = config.headers || {};

                    var $state = $injector.get("$state");
                    var authService = $injector.get("authService");
                    var token = authService.getAccessToken();

                    //console.log('token', token);

                    if (token === null) {
                        console.log(' empty token');
                    }

                    if (token === undefined) {
                        // do not redirect if we on the login screen
                        if (!$window.location.href.match(/\/login\//)) {
                            // var obj = {
                            //     back_url: $window.location.hash
                            // };
                            // $state.go("login", obj);
                            // reject current request
                            // authService.logout();
                            // return $q.reject('emptyToken');
                        }
                    } else {
                        config.headers.Authorization = "Bearer " + token;
                    }
                }

                return config;
            },
            responseError: function (response) {
                if (response.status === 401) {
                    // handle the case where the user is not authenticated
                    //reset token
                    var authService = $injector.get("authService");
                    // authService.logout();

                    //not redirect if we on the login screen
                    if (!$window.location.href.match(/\/login\//)) {
                        var $state = $injector.get("$state");
                        var obj = {
                            back_url: $window.location.hash
                        };
                        $state.go("login", obj);
                    }
                } else {
                    if (response.config && response.config.url && isUrlInWhiteList(response.config.url)) {
                        var error = getErrorMsg(response);
                        try {
                            var ngToast = $injector.get("ngToast");
                            ngToast.danger(error);
                        } catch (e) {
                            alert(error);
                        }
                    }
                }
                return $q.reject(response);
            }
        };
    }

    /* no need handle errors messages in automatic mode */
    function isUrlInWhiteList(url) {
        return url.indexOf('Token') === -1 &&
            url.indexOf('token') === -1 &&
            url.indexOf('sensors/register') === -1 &&
            url.indexOf('v1/payments') === -1 &&
            url.indexOf('find-address') === -1 &&
            url.indexOf('shippo/v1/tracks/') === -1 &&
            url.indexOf('credit-cards') === -1;
    }

    /* need the token for all URLs apart from those URLs */
    function isUrlRequireToken(url) {
        return url.indexOf("Token") === -1
            && url.indexOf("token") === -1
            && url.indexOf("ForgotPassword") === -1;
    }

    angular
        .module("app")
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push("tokenService");
        });
})();
