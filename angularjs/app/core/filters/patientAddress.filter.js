(function() {
    "use strict";

    angular
        .module("app")
        .filter("patientAddress", function () {

                    return function(input) {
                        if (input === undefined || input === null || input === "")
                            return "";
                        var result = "";
                        for (var prop in input) {
                            if (input.hasOwnProperty(prop) && prop !== "Position") {
                                result += input[prop] + ", ";
                            }
                        }
                        result = result.substr(0, result.length - 2);
                        return result;
                    }
                }
        );
})();