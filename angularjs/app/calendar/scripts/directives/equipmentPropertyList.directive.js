(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("equipmentPropertyList", equipmentPropertyList);

function equipmentPropertyList() {

    return {
        restrict: 'E',
        templateUrl: "core/views/templates/equipmentPropertyList.html",
        scope: {
            isRequired: '=',
            value: '=',
            list: '='
        }
    }
}

})();