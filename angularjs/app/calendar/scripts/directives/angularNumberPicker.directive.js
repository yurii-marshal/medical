(function () {
    "use strict";

        var defaults = {
            min: 0,
            max: 100,
            step: 1,
            timeout: 600
        };

        var assign = function (dest, src) {
            for (var key in src) {
                if (!dest[key]) {
                    dest[key] = src[key];
                }
            }
            return dest;
        };

        var isNumber = function (value) {
            var val = Number(value);
            return !isNaN(val) && val == value;
        };

        var toNumber = function (value) {
            return Number(value);
        };

        var checkNumber = function (value) {
            if (!isNumber(value)) {
                throw new Error('value [' + value + '] is not a valid number');
            }
        };

        var getTarget = function (e) {
            if (e.touches && e.touches.length > 0) {
                return angular.element(e.touches[0].target);
            }
            return angular.element(e.target);
        };

        var getType = function (e) {
            return getTarget(e).attr('type');
        };

        var transform = function (opts) {
            for (var key in opts) {
                var value = opts[key];
                opts[key] = toNumber(value);
            }
        };

        var directive = function () {

            return {
                restrict: 'E',
                scope: {
                    'value': '=',
                    'min': '@',
                    'max': '@',
                    'step': '@',
                    'change': '&'
                },
                link: function ($scope, element) {

                    var opts = assign({
                        min: $scope.min,
                        max: $scope.max,
                        step: $scope.step
                    }, defaults);

                    checkNumber(opts.min);
                    checkNumber(opts.max);
                    checkNumber(opts.step);

                    transform(opts);

                    if (opts.min > $scope.value) {
                        $scope.value = opts.min;
                    }

                    var roundNumber = function () {
                        if (opts.step < 1) {
                            var separator = ".";
                            if ($scope.step.indexOf(',') > 0) {
                                separator = ",";
                            }
                            var numOfDigits = $scope.step.split(separator)[1].length;
                            $scope.value = Number($scope.value.toFixed(numOfDigits));
                        }
                    };

                    var changeNumber = function ($event) {
                        var type = getType($event);
                        var parsedVal = Number($scope.value);
                        if (!isNaN(parsedVal)) {
                            $scope.value = parsedVal;
                        }


                        if ('up' === type) {
                            if ($scope.value >= opts.max) {
                                return;
                            }
                            $scope.value += opts.step;
                        } else if ('down' === type) {
                            if ($scope.value <= opts.min) {
                                return;
                            }
                            $scope.value -= opts.step;
                        }
                        roundNumber();
                    };

                    var addon = element.find('span');

                    addon.on('click', function (e) {
                        changeNumber(e);
                        $scope.$apply();
                        $scope.change();
                        e.stopPropagation();
                    });
                },
                template: '<div class="input-group"><span class="input-group-addon" type="down">&nbsp;&nbsp;-&nbsp;&nbsp;</span><label class="form-control">{{ value }}</label><span class="input-group-addon" type="up">&nbsp;&nbsp;+&nbsp;&nbsp;</span></div>'
            };
        };

        angular
        .module("app")
        .directive("hNumber", directive);

})();
