(function () {
    "use strict";

    angular
        .module("app")
        .filter("timeUtc", function () {
                return function(dateUtcStr, inputFormat, isLonger) {
                    if (dateUtcStr !== undefined && dateUtcStr !== null && dateUtcStr !== "") {
                        if (inputFormat) {
                            return moment.utc(dateUtcStr, inputFormat).format('hh:mm A');
                        } else if (isLonger) {
                            return moment.utc(dateUtcStr).format('hh:mm A');
                        }
                        return moment.utc(dateUtcStr).format('h:mm a');
                    }
                    return "";
                };
            }
        );
})();