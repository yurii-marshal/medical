(function () {
    "use strict";

    angular
        .module("app")
        .directive("menuUserInfo", menuUserInfo);

    /* @ngInject */
    function menuUserInfo($compile, profileService, authService, $state) {
        var directive = {
            link: function (scope, elem, attr, ctrl) {

                var html = '' +
                '    <div class="main-menu-avatar"></div>' +
                '    <div class="main-menu-greeting" style="display: none;">' +
                '        <span>welcome,</span>' +
                '        <a href="#/profile/"><b class="user-name"></b></a>' +
                '    </div>' +
                '    <a href="javascript:void(0);" class="logout-link" ng-click="$ctrl.logout()">' +
                '        <md-icon class="logout-link-img" md-svg-src="assets/images/main-menu/logout.svg"></md-icon>' +
                '    </a>';

                $(elem).html($compile(html)(scope));

                profileService.getProfilePromise()
                    .then(function(response) {
                        var profileModel = response.data;
                        if (profileModel.ProfilePicture.Data) {
                            elem[0].getElementsByClassName('main-menu-avatar')[0]
                                .style.backgroundImage = 'url(data:image/JPEG;base64,' + profileModel.ProfilePicture.Data + ')';
                        }
                        elem[0].getElementsByClassName('main-menu-greeting')[0].style.display = 'block';
                        elem[0].getElementsByClassName('user-name')[0].innerHTML = profileModel.Name.Last;
                    }, function(response) {

                    });
            },
            controller: function () {
                this.logout = function(){
                    // authService.logout();
                };
            },
            controllerAs: '$ctrl'
        };
        return directive;
    }
})();
