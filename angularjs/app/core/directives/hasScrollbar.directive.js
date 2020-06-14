/**
 * Created by sergey on 11.03.2016.
 */

(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("hasScrollbar", hasScrollbarDirective);

    function hasScrollbarDirective() {
        return {
            restrict: 'A',
            link: function(scope, elem, attr) {
                if (elem[0].scrollHeight > elem.height()) {
                    elem.addClass('hasScrollBar');
                }
            }
        };
    }
})();