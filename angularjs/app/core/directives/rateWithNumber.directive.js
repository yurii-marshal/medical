(function () {
    "use strict";

    angular
        .module("app")
        .directive("rateWithNumber", rateWithNumberDirective);

    function rateWithNumberDirective(){
        'use strict';

        return {
            require: 'ngModel',
            restrict: "A",
            scope: {
                numbers: "=",
                activeNumber: "=",
                rateDisabled: "=",
                rateOnlyShow: "="
            },
            link: function(scope, elem, attrs, ngModel){

                var num         = scope.numbers ? scope.numbers : 6;
                var act         = scope.activeNumber;
                var onlyShow    = scope.rateOnlyShow;
                var container   = document.createElement('div');

                if(onlyShow) {
                    container.className = 'rating-buttons only-show';
                } else {
                    container.className = 'rating-buttons';
                }

                elem.hide();
                elem[0].parentNode.insertBefore(container, elem[0]);

                for (var i = 0; i < num; i++) {
                    if (act && i == act) {
                        container.innerHTML += '<button class="rate-btn active" data-number="'+ i +'"><span>'+i+'</span></button>';
                    } else {
                        container.innerHTML += '<button class="rate-btn" data-number="'+ i +'"><span>'+i+'</span></button>';
                    }
                };

                setTimeout(function(){
                    if (act) {
                        scope.$apply(function() {
                            ngModel.$setViewValue(act);
                        });
                    }
                }, 20);

                $(elem[0].parentNode).find('.rate-btn').on('click', function(event){

                    event.preventDefault();

                    var $this = $(this);

                    scope.$apply(function() {
                        ngModel.$setViewValue($this.attr('data-number'));
                    });

                    if (!$this.hasClass('active')) {
                        $(elem[0].parentNode).find('.rate-btn.active').removeClass('active');
                        $this.addClass('active');
                    }
                });

                if(scope.rateDisabled) {
                    $(elem[0].parentNode).find('.rate-btn').each(function(){
                        $(this).attr('disabled', 'disabled');
                    });
                };

                scope.$watch('rateDisabled', function(newVal, oldVal){
                    $(elem[0].parentNode).find('.rate-btn').each(function(){
                        if(newVal) {
                            $(this).attr('disabled', 'disabled');
                            $(this).removeClass('active');
                        } else {
                            $(this).removeAttr('disabled');
                        }
                    });
                });



                //console.log();

            }
        }
    }

})();