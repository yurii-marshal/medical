export default function formatStringByParagraphs() {
    return {
        restrict: 'E',
        scope: {
            text: '=?text'
        },
        template: `<p style='display:block' ng-repeat='item in list track by $index'>{{item}}</p>`,
        link: function (scope, elem, attr) {
            scope.$watch('text', function (newValue) {
                scope.list = [];
                if (newValue !== undefined && newValue !== null && newValue !== "") {
                    scope.list = newValue.split("\n");
                }
            });
        }
    };
}