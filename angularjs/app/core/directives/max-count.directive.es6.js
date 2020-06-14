export default function maxCountValue() {
    'ngInject';

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            let maxLength = parseInt(attrs.maxCountValue),
                maxCountValueForm = ngModelCtrl.$$parentForm[ngModelCtrl.$name];

            function elementSetValidity(status) {
                if (status) {
                    element.parent().addClass('invalid');
                    maxCountValueForm.$setValidity('maxCountValueRequired', false);
                } else {
                    element.parent().removeClass('invalid');
                    maxCountValueForm.$setValidity('maxCountValueRequired', true);
                }
            }

            function changedValue(text) {
                maxLength = parseInt(attrs.maxCountValue);

                if (isNaN(maxLength)) {
                    elementSetValidity(false);
                    return text;
                }

                if (+text <= maxLength) {
                    elementSetValidity(false);
                } else {
                    elementSetValidity(true);
                }

                return text;
            }

            scope.$watch(() => attrs.maxCountValue, () => {
                changedValue(ngModelCtrl.$viewValue);
            });

            ngModelCtrl.$parsers.push(changedValue);
        }
    };
}
