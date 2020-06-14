(function() {
    "use strict";

    angular
        .module("app")
        .filter("replacedEquipment", function() {
                return function(input) {
                    var result = [];
                    angular.forEach(input, function(item) {
                        if (item.DeviceBarcodes !== item.Barcodes) {
                            result.push(item);
                        }
                    });
                    return result;
                }
            }
        );
})();