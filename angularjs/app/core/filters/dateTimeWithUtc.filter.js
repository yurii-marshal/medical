(function() {
    "use strict";

    angular
        .module("app")
        .filter("dateTimeWithUtc", function () {
            return function (dateUtcStr) {
                return moment.utc(dateUtcStr).format('MM/DD/YYYY h:mm A');
            }
        });
})();
