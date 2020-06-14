export default function priceValidator() {
    'ngInject';

    return {
        restrict: 'A',
        require: 'ngModel',
        link: (scope, element, attr, ctrl) => {

            function priceValidator(ngModelValue) {

                if (!ngModelValue || /^-?\d+\.\d{1,2}$|^-?\d+$/.test(ngModelValue)) {
                    ctrl.$setValidity('price', true);
                } else {
                    ctrl.$setValidity('price', false);
                }

                return ngModelValue;
            }

            scope.$watch(attr['ngModel'], function(v) {
                priceValidator(v);
            });

            ctrl.$parsers.push(priceValidator);
        }
    };
}
