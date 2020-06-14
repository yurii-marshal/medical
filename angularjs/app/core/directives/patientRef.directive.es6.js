export default function patientRef($state) {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            patientRef: '@'
        },
        link: (scope, elem) => {

            angular.element(() => {
                $(elem).on('click', (e) => {
                    e.stopPropagation();
                    let patientId = scope.patientRef;
                    $state.go('root.patient', {patientId});
                });
            });

            scope.$on('$destroy', () => {
                $(elem).off('click');
            });

        }
    }
}
