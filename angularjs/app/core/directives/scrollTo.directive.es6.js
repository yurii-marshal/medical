export default function scrollTo(scrollToService) {
    'ngInject';

    return {
        restrict: 'A',
        scope: {
            scrollTo: '@',
            disabledScroll: '=?'
        },
        link: (scope, elem) => {

            $(elem).on('click', () => {

                if (!scope.disabledScroll) {
                    scrollToService.goToContainer(scope.scrollTo);
                } else {
                    scrollToService.goTopClass(['.ng-invalid:not(ng-form):not(form):not([ng-form])']);
                }
            });

            scope.$on('$destroy', () => {
                $(elem).off('click');
            });
        }
    };
}
