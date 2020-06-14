(function() {
    "use strict";

    angular
        .module("app")
        .filter("weekdaysOrder", function() {
                return function(input) {
                    if (input) {
                        var result = [];
                        var startIndex = 0;
                        for (var i = 0; i < input.length; i++) {
                            if (input[i].Text.toLowerCase() === 'sunday') {
                                startIndex = i;
                            }
                        }
                        for (var i = startIndex; i < input.length; i++) {
                            result.push(input[i]);
                        }
                        if (startIndex > 0) {
                            for (var i = 0; i < startIndex; i++) {
                                result.push(input[i]);
                            }
                        }
                        return result;
                    }
                    return [];
                };
            }
        );
})();