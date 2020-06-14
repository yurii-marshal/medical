export default function decimals () {
    'ngInject';

    return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
            decimals: '@',
            decimalPoint: '@?'
        },
        link: function (scope, element, attr, ngModel) {
            const decimalCount = parseInt(scope.decimals) || 2;
            const decimalPoint = scope.decimalPoint || '.';

            // Run when the model is first rendered and when the model is changed from code
            angular.element(() => {
                ngModel.$render = function () {
                    if (ngModel.$modelValue !== null && ngModel.$modelValue >= 0) {
                        if (typeof decimalCount === 'number') {
                            element.val(ngModel.$modelValue.toFixed(decimalCount).toString().replace(/\,/g, decimalPoint))
                        } else {
                            element.val(ngModel.$modelValue.replace(/\,/g, decimalPoint))
                        }
                    }
                }

                // Run when the view value changes - after each keypress
                // The returned value is then written to the model
                ngModel.$parsers.unshift((newValue) => {
                    if (typeof decimalCount === 'number') {
                        const floatValue = parseFloat(newValue.replace(/\,/g, decimalPoint));
                        return parseFloat(floatValue.toFixed(decimalCount));
                    }

                    return parseFloat(newValue.replace(/\,/g, decimalPoint));
                });

                // Formats the displayed value when the input field loses focus
                element.on('change', () => {
                    const floatValue = parseFloat(element.val().replace(/\,/g, decimalPoint));
                    if (!isNaN(floatValue) && typeof decimalCount === 'number') {
                        const strValue = floatValue.toFixed(decimalCount);
                        element.val(strValue.replace(/\,/g, decimalPoint));
                    }
                })
            })
        }
    }
}
