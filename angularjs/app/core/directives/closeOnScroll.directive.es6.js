export default function closeOnScroll () {
    'ngInject';

    return {
        restrict: 'A',
        link: (scope, elem) => {

            angular.element(() => {
                let mdDialogElement = $(elem).parents('md-dialog');

                if (mdDialogElement) {
                    $('md-dialog').on('scroll', () => {
                        $(elem).find('input').blur();
                    });
                }
            });

            scope.$on('$destroy', () => {
                $('md-dialog').off('scroll');
            });
        }
    }
}
