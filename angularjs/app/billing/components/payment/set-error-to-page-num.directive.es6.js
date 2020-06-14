export default function setErrorToPageNum() {
    'ngInject';

    return {
        restrict: 'A',

        link: function(scope, element, attrs) {

            const renderErrors = () => {
                setTimeout(() => {
                    const list = Array.from(element[0].getElementsByClassName('pagination-page'));
                    const pagesWithErrors = scope.paymentCtrl.paginationParams.pagesWithErrors;

                    list.forEach((el, index) => {
                        const pageIndex = el.textContent.trim();

                        angular.element(el).removeClass('page-error');

                        if (pageIndex === '...') {
                            pagesWithErrors.forEach((pageWithError) => {

                                if (pageWithError > +(list[index - 1].textContent.trim()) &&
                                    pageWithError < +(list[index + 1].textContent.trim())) {

                                    angular.element(el).addClass('page-error');
                                }
                            });
                        }

                        if (pagesWithErrors.find((pageWithError) => pageWithError.toString() === pageIndex)) {
                            angular.element(el).addClass('page-error');
                        }

                    });
                });
            };

            scope.$watch(() => scope.paymentCtrl.paginationParams.pagesWithErrors, () => {
                renderErrors();
            });

            element[0].addEventListener('click', () => {
                renderErrors();
            });
        }
    };
}
