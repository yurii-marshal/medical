(function () {
    "use strict";

    angular
        .module("app")
        .directive("inputNumber", inputNumber);

    /* @ngInject */
    function inputNumber() {
        return {
            restrict: "E",
            template: function (tElement, tAttrs) {

                tAttrs['formName']              = tAttrs['formName'] || '';
                tAttrs['inputName']             = tAttrs['inputName'] || '';
                tAttrs['ngModel']               = tAttrs['ngModel'] || '';
                tAttrs['ngRequired']            = tAttrs['ngRequired'] || 'false';
                tAttrs['label']                 = tAttrs['label'] || '';
                tAttrs['maxLength']             = tAttrs['maxLength'] || '';
                tAttrs['max']                   = tAttrs['max'] || '';
                tAttrs['min']                   = tAttrs['min'] || '';
                tAttrs['requiredMessage']       = tAttrs['requiredMessage'] || 'This field is required';

                return  '<md-input-container>'  +
                    '<label>'                       + tAttrs['label']  + '</label>' +
                    '<input type="text"'            +
                    '   name="'                     + tAttrs['inputName'] + '"' +
                    '   ng-model="'                 + tAttrs['ngModel'] + '"' +
                    '   ng-required="'              + tAttrs['ngRequired'] + '"' +
                    '   only-digits-with-length'    +
                    '   max-length="'               + tAttrs['maxLength'] + '"' +
                    '   max="'                      + tAttrs['max'] + '"' +
                    '   min="'                      + tAttrs['min'] + '"' +
                    '   aria-label="...">'          +
                    '<div ng-messages="' + tAttrs['formName'] + '.' + tAttrs['inputName'] + '.$error" class="md-input-messages-nice">' +
                    '   <div ng-message="required">' + tAttrs['requiredMessage'] + '</div>' +
                    '</div>' +
                    '</md-input-container>';
            }
        }
    }


})();
