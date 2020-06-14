export default class ComparePaymentValueValidatorDirective {
    constructor() {
        this.restrict = 'A';
        this.require = 'ngModel';
        this.scope = {
            comparePaymentValidator: '='
        };
    }

    link(scope, elem, attr, ctrl) {
        scope.$watch(() => ctrl.$viewValue + scope.comparePaymentValidator, () => {
            ctrl.$setValidity('comparePaymentValidator', validate(ctrl.$viewValue));
        });

        function validate(value) {
            return parseFloat(value) === parseFloat(scope.comparePaymentValidator);
        }
    }
}
