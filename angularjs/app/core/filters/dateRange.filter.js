(function() {
    "use strict";

    angular
        .module("app")
        .filter("dateRange", function () {
            return function(array, startDate, endDate, flag) {
                var result = [];

                // if the conversations are loaded
                if (array && array.length > 0) {
                    angular.forEach(array, function(item) {

                        var itemDate = "";

                        if (flag) {         // Filter only by time

                            var startTime = moment(startDate).format("HH:mm");
                            var endTime = moment(endDate).format("HH:mm");
                            var itemTime = moment(item.Date.From).format("HH:mm");

                            if (itemTime >= startTime && itemTime <= endTime) {
                                result.push(item);
                            }

                        } else {            // Filter by date and time

                            if (endDate) {
                                itemDate = moment(item.Date.From).valueOf();
                                if (itemDate >= startDate && itemDate <= endDate) {
                                    result.push(item);
                                }
                            } else {
                                itemDate = moment(moment(item.Date.From).format("YYYY-MM-DD")).valueOf();

                                if (itemDate == startDate) {
                                    result.push(item);
                                }
                            }
                        }
                    });

                    return result;
                }
            };
        });
})();
