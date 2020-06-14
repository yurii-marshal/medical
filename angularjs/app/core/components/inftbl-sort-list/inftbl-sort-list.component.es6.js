/* @ngInject */
export default function inftblSortList(infinityTableService) {
    return {
        restrict: 'EA',
        templateUrl: 'core/components/inftbl-sort-list/inftbl-sort-list.component.html',
        scope: {
            paramName: '@'
        },
        transclude: true,
        link: function(scope, elem) {
            let sortObj = scope.$parent.sortObj || {};

            elem.on('click', () => {
                toggleSortExpr(scope.paramName, sortObj);
                infinityTableService.reload();
            });

            scope.$on('$destroy', () => {
                elem.off('click');
            });

            scope.getClass = function() {
                if (sortObj[scope.paramName] === true) {
                    return 'desc';
                }
                if (sortObj[scope.paramName] === false) {
                    return 'asc';
                }
                return '';
            };
        }
    };
}

function toggleSortExpr(name, sortExprObj) {
        // set for all undefined except the current one
    angular.forEach(sortExprObj, (value, key) => {
        if (name !== key) {
            sortExprObj[key] = undefined;
        }
    });
    sortExprObj[name] = !sortExprObj[name];
}
