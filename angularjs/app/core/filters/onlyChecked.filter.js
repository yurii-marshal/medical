(function() {
    "use strict";

    angular
        .module("app")
        .filter("onlyChecked", function () {
                return function(input) {
                    var result = [];
                    for (var i in input) {
                        if (input[i].isChecked) {
                            result.push(input[i]);
                        }
                    }
                    return result;
                }
            }
        );
})();