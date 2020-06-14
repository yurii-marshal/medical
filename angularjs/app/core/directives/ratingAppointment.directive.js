(function () {
    "use strict";

    angular
        .module("app.calendar")
        .directive("ratingAppointment", ratingAppointment);

    function ratingAppointment() {
        return {
            restrict: 'A',
            scope: {
                score: "="
            },
            templateUrl: "core/views/templates/rating.html",
            link: function(scope) {

                scope.scoreLength = [];

                function getDecimal(num) {
                    return num - Math.floor(num);
                }

                for (var i = 1; i <= 10; i++) {
                    if (i <= scope.score) {
                        scope.scoreLength.push({
                            index: i,
                            active: true,
                            width: '100%'
                        })
                    } else {
                        if ((i - scope.score) < 1) {
                            scope.scoreLength.push({
                                index: i,
                                active: false,
                                width: getDecimal(scope.score) * 100 + '%'
                            })
                        } else {
                            scope.scoreLength.push({
                                index: i,
                                active: false,
                                width: '0%'
                            })
                        }
                    }
                }
            }
        };
    }
})();
