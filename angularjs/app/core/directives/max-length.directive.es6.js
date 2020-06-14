export default function maxLengthValue() {
    'ngInject';

    return {
        restrict: 'A',
        require:'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            const maxLength = parseInt(attrs.ngMaxlength);

            function changedValue(text) {
                if (text.length > maxLength) {

                    const transformedInput = text.substring(0, maxLength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;

                }

                return text;
            }

            ngModelCtrl.$parsers.push(changedValue);
        }

    };


}
