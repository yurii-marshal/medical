(function () {
    "use strict";

    angular
        .module("app")
        .directive("iconLoadingWhite", function() {
            return {
                template: '<md-progress-circular md-diameter="16px" class="md-white"></md-progress-circular>'
            };
        });

})();
