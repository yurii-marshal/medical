(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("drowzClearValue", drowzClearValue);

    /* @ngInject */
    function drowzClearValue($timeout) {
        var directive = {
            restrict: "A",
            require: ["^?mdAutocomplete", "^?mdAutocompleteWithInfiniteScroll", "^?ngModel"],
            bindToController: true,
            link: function (scope, elem, attr, ngModelCtrl) {

                $(elem).on('blur', 'input', function(event){
                    if (!(event.relatedTarget && event.relatedTarget.getAttribute("md-virtual-repeat") !== null)) {
                        $timeout(function () {
                            var _ngModelCtrl = ngModelCtrl[0] || ngModelCtrl[1]; // in case of infinite autocomplete
                            if (   _ngModelCtrl.scope.selectedItem === undefined
                                || _ngModelCtrl.scope.selectedItem === null
                                || _ngModelCtrl.scope.selectedItem === '') {
                                   _ngModelCtrl.scope.searchText = '';
                            }
                        },300);
                    }
                });

            }
        };
        return directive;
    }
})();
