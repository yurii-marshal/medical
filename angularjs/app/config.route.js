(function () {
    'use strict';

    function saveCurrentUrlHelper() {
        var url = window.location.href;

        if (!(url.match('/login') ||
            url.match('/forgotpass') ||
            url.match('/changepass'))) {

            if (url.match('/calendar')) {
                url = url.split('?')[0];
            }

           // localStorage.setItem('url_before_login', JSON.stringify(url));
        }
    }

    angular
        .module('app')
        .config(appConfig)
        .run(appRun);

    /* @ngInject */
    function appConfig($stateProvider, $urlRouterProvider, $httpProvider) {
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        $httpProvider.defaults.headers.get["If-Modified-Since"] = "Mon, 26 Jul 1997 05:00:00 GMT";
        $httpProvider.defaults.headers.get["Cache-Control"] = "no-store, no-cache, must-revalidate";
        $httpProvider.defaults.headers.get["Pragma"] = "no-cache";

        $stateProvider
            .state('root', {
                url: '',
                abstract: true,
                template: '<div class="root-view" ui-view></div>',
                resolve: {
                    resolveInitRoutes: [
                        function() {
                            saveCurrentUrlHelper();
                            return null;
                        }
                    ]
                }
            });

        $urlRouterProvider.when('', '/dashboard/');
        $urlRouterProvider.when('/', '/dashboard/');
    }


    /* @ngInject */
    function appRun(
        $rootScope,
        cssInjector,
        $mdDialog,
        $window,
        $state,
        authService,
        CURRENT_DOMAIN,
        iframeUtils
    ) {

        var tabName = 'tab_'+guid();

        // todo finish later
        /*handleOpenedTabsSession(tabName, 'load');

        $(window).bind('unload',function(e) {
            handleOpenedTabsSession(tabName, 'unload');
            return undefined;
        });*/

        /**
         * Checking, adding or removing current tab to opened tabs array
         * @param {String} params - 'load' or 'unload' for handling page state
         */
        // function handleOpenedTabsSession(tabName, action) {
        //     var openedTabs = [];
        //
        //     if (action === 'load') {
        //         if (!localStorage.getItem('openedTabs')) {
        //             localStorage.setItem('openedTabs', JSON.stringify([]));
        //         }
        //
        //         openedTabs = JSON.parse(localStorage.getItem('openedTabs'));
        //
        //         if (openedTabs.indexOf(tabName) === -1) {
        //             openedTabs.push(tabName);
        //             localStorage.setItem('openedTabs', JSON.stringify(openedTabs));
        //         }
        //     }
        //
        //     if (action === 'unload') {
        //         openedTabs = JSON.parse(localStorage.getItem('openedTabs'));
        //
        //         if (!openedTabs) { return; }
        //
        //         if (openedTabs.indexOf(tabName) !== -1) {
        //             openedTabs = openedTabs.filter(function (item) {
        //                 return !(item === tabName);
        //             });
        //             localStorage.setItem('openedTabs', JSON.stringify(openedTabs));
        //         }
        //
        //         openedTabs = JSON.parse(localStorage.getItem('openedTabs'));
        //         if (!openedTabs.length) {
        //             authService.logout();
        //         }
        //     }
        // }

        // Listen all urls changes
        window.addEventListener('popstate', function() {
            saveCurrentUrlHelper();
        });



        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            // Redirect to Angular 2 app if there is NO iFrame
            // if (window.self === window.top) {
            //     $window.location.href = '/v2#/' + window.location.hash.substr(2);
            // }

            if (toState.url !== '/empty-iframe') {
                iframeUtils.sendDataToParentIframe(toState, false);
            }

            document.title = toState.params && toState.params.pageTitle || 'Niko Health';

            var module = toState.name;
            //TO DO: rewrite all modules on nasted views, like in reports
            if (toState.templateUrl !== undefined && toState.templateUrl.indexOf('inventory') === 0) {
                module = toState.url.substr("inventory");
            }

            //Add classes for old modules that need css class on html teg
            cssInjector.load(module.replace(/\//g, '.'));

            //Prevent reload/close/move_back
            if (toState.data && toState.data.showPopupBeforeLeave) {
                $window.onbeforeunload = function (e) {
                    return 'You will lose unsaved changes. Are you sure want to reload the page?';
                };
            } else {
                $window.onbeforeunload = undefined;
            }

        });

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            // hide dialog window while changing state
            $mdDialog.hide();

            var token = authService.getAccessToken();

            //handle navigation on breadcrumbs or cancel button
            if (fromState.data && fromState.data.showPopupBeforeLeave && !token === undefined) {

                //Navigate inside $state on ancestors or parent flows, if navigate outside 'showPopupBeforeLeave' = false
                if (toState.data && toState.data.showPopupBeforeLeave) {
                    return;
                }

                //Second state change after confirm alert was shown
                if (toState.showPopupBeforeLeaveOff) {
                    delete toState.showPopupBeforeLeaveOff;
                    return;
                }

                event.preventDefault();

                var confirm = $mdDialog.confirm()
                    .title("Confirm Navigation")
                    .textContent("You will lose unsaved changes. Are you sure want to leave the page?")
                    .ariaLabel("Confirm")
                    .ok("Yes")
                    .cancel("No");

                $mdDialog.show(confirm).then(function () {
                    toState.showPopupBeforeLeaveOff = true;
                    $state.go(toState, toParams);
                }, function () {
                });

            }
        });
    }

})();


(function () {
    'use strict';

    angular
        .module('app')
        .service('cssInjector', cssInjector);

    /* @ngInject */
    function cssInjector($window) {

        this.load = load;

        var config = {
            prefix: 'drp_',
            subClassDelimeter: '_'
        };

        function load(moduleName) {
            /* Statment for detect browser in .css.
             Example css rule for IE10:
             html[data-useragent*='MSIE 10.0'] h1 {
             color: blue;
             }  */
            var b = $window.document.documentElement;
            b.setAttribute('data-useragent', navigator.userAgent);
            b.setAttribute('data-platform', navigator.platform);


            var arr_postfix = moduleName.split('.'),
                arr_classes = [],
                regExp = new RegExp('(' + config.prefix + '.*(?:[\s]|$))', 'gim'),
                classes = $window.document.getElementsByTagName('html')[0].className;

            var classLast = '';
            for (var i = 0; arr_postfix.length > i; i++) {
                var className = (classLast === '') ? arr_postfix[i] : classLast + config.subClassDelimeter + arr_postfix[i];
                arr_classes.push(className);
                classLast = className;
            }

            arr_classes = arr_classes.map(function (item) {
                return config.prefix + item;
            });

            classes = classes.replace(regExp, '');

            $window.document.getElementsByTagName('html')[0].className = classes.trim() + ' ' + arr_classes.join(' ');
        }
    }

})();

