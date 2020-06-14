export default function() {
    return {
        restrict: 'A',
        scope: {
            onAutocompletePanelVisibility: '&onAutocompletePanelVisibility'
        },
        link: function(scope, element) {

            const autocompleteCtrl = angular.element(element[0].firstElementChild.firstElementChild).scope().$mdAutocompleteCtrl;

            scope.$watch(() => autocompleteCtrl.hidden, (status) => {
                scope.onAutocompletePanelVisibility({ status: !status });
            });
        }

    };

}
