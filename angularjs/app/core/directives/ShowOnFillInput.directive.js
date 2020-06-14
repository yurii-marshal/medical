(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("showOnFillInputDirective", showOnFillInputDirective);

    function showOnFillInputDirective(){
        'use strict';

        var findInput = function(elem){
            if (elem === undefined)
                throw new Error("[Error] elem cannot be undefined.");

            var parent = elem.parent();
            var inputContainer = $(parent.children()[0]);
            return inputContainer.find('input')[0];
        };

        return {
            restrict: "A",
            link: function(scope, elem){
                elem.addClass('ng-hide');

                var inputFiledWatch = scope.$watch(function(){
                   return findInput(elem);
                }, function(input){
                    if (input !== undefined){
                        scope.$watch(function(){
                            return input.value.length;
                        }, function(inputLength){
                            if (inputLength !== undefined){
                                if (inputLength > 0)
                                    $(elem[0]).removeClass('ng-hide');
                                else
                                    $(elem[0]).addClass('ng-hide');
                            }
                        });
                        inputFiledWatch();
                    }
                });
            }
        }
    }
})();
