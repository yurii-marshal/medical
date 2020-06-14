export default function chipsAutocompleteRequired ($timeout) {
    'ngInject';

    return {
        restrict: 'A',
        require: 'ngModel',

        link: (scope, element, attrs, ngModelCtrl) => {

            $timeout(function() {
                let autocompleteEl = element.find('md-autocomplete');
                let autocompleteElInputName = autocompleteEl.attr('md-input-name');
                let isAutocompleteRequired = autocompleteEl.attr('ng-required');
                let autocompleteFormEl = ngModelCtrl.$$parentForm[autocompleteElInputName];

                function elementSetValidity(status) {
                    if (status) {
                        element.parent().addClass('invalid');
                        autocompleteFormEl.$setValidity('chipsAutocompleteRequired', false);
                    } else {
                        element.parent().removeClass('invalid');
                        autocompleteFormEl.$setValidity('chipsAutocompleteRequired', true);
                    }
                }

                if (isAutocompleteRequired === 'true') {
                     scope.$watchCollection(() => ngModelCtrl.$viewValue, (val) => {
                        elementSetValidity(val && !val.length && autocompleteFormEl.$touched);
                        if (val && val.length) {
                            autocompleteFormEl.$setValidity('required', true);
                        }
                    });

                    scope.$watchCollection(() => autocompleteFormEl.$touched, (touched) => {
                        elementSetValidity(ngModelCtrl.$viewValue && !ngModelCtrl.$viewValue.length && touched);
                        if (ngModelCtrl.$viewValue && ngModelCtrl.$viewValue.length) {
                            autocompleteFormEl.$setValidity('required', true);
                        }
                    });
                }
            })
        }
    }
}

