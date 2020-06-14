(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("fixElementOnScroll", fixElementOnScroll);

    function fixElementOnScroll() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {

                var parent = $(elem),
                    child = $(attr.fixElementOnScroll),      // use selector in attribute like '.class' or '#ID'
                    scrollDistanceForSticky = parseInt(attr.scrollDistanceForSticky);

                $(window).on('scroll', checkBodyScroll);

                function checkBodyScroll() {
                    if (!$('md-backdrop').length) {
                        var top = $(window).scrollTop() - 38;    // 38 is not assignable random number for correct displaying

                        if ($(window).scrollTop() >= scrollDistanceForSticky) {
                            child.css('transform', 'translateY(' + top + 'px)');
                        } else {
                            child.css('transform', 'translateY(0px)');
                        }
                    }
                }

                scope.$on('$destroy', function(){
                    $(window).off('scroll', checkBodyScroll);
                });
            }
        };
    }
})();
