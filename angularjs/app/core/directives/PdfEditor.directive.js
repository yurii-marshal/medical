(function () {
    "use strict";

    angular
        .module("app")
        .directive("pdfEdit", pdfEdit);
    function pdfEdit($compile) {
        /* @ngInject */

        function initialize(elem, scope, pages) {
            var editor = new PdfEditor($(elem), scope, $compile);
            editor.loadPdf(pages);
        }
        return {
            restrict: "A",
            scope: {
                name: "=fileName",
                pages: '='
            },
            link: function (scope, elem) {
                initialize(elem, scope, scope.pages);
            }
        };
    }
})();
