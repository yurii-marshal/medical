export default function alphanumericsValidator() {
    'ngInject';

    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            excludeValidators: '=excludeValidators'
        },
        link: function(scope, element, attr, ctrl) {

            function priceValidator(ngModelValue) {
                let exclude = scope.excludeValidators || [];

                if (!ngModelValue ||
                    exclude.indexOf(ngModelValue) > -1 ||
                    /^[a-zA-Z0-9]+$/.test(ngModelValue)

                ) {
                    ctrl.$setValidity('alphanumerics', true);

                    return null;
                }

                ctrl.$setValidity('alphanumerics', false);

                return ngModelValue;
            }

            scope.$watch(attr['ngModel'], (v) => {
                priceValidator(v);
            });

            scope.$watch(() => {
                return scope.excludeValidators;
            }, () => {
                priceValidator(ctrl.$modelValue);
            });

            ctrl.$parsers.push(priceValidator);
        }

    };
}
