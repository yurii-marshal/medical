(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("inputEmail", inputEmail);

    /* @ngInject */
    function inputEmail() {
        return {
            restrict: "E",
            template: function (tElement, tAttrs) {

                tAttrs['formName'] = tAttrs['formName'] || '';
                tAttrs['inputName'] = tAttrs['inputName'] || '';
                tAttrs['inputIndex'] = tAttrs['inputIndex'] || '';
                tAttrs['label'] = tAttrs['label'] || 'Phone';
                tAttrs['ngRequired'] = tAttrs['ngRequired'] || 'false';
                tAttrs['ngDisabled'] = tAttrs['ngDisabled'] || 'false';
                tAttrs['addDirectives'] = tAttrs['addDirectives'] || '';
                tAttrs['ngModel'] = tAttrs['ngModel'] || '';
                tAttrs['ngIf'] = tAttrs['ngIf'] || 'true';
                tAttrs['ngKeydown'] = tAttrs['ngKeydown'] || '';
                tAttrs['updateOn'] = tAttrs['updateOn'] || 'blur';

                var token = guid();
                var pattern = /^(([^<>()\[\]\\.,;:\s@']+(\.[^<>()\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                var templateStr =
                    '<md-input-container ' +
                        'ng-if="' + tAttrs['ngIf'] + '"> ' +
                        '<input tabindex="1" type="email" ' +
                            'placeholder="' + tAttrs['label'] + '" ' +
                            'name="' + tAttrs['inputName'] + token + '" ' +
                            'ng-model="' + tAttrs['ngModel'] + '" ' +
                            'ng-required="' + tAttrs['ngRequired'] + '" ' +
                            'ng-disabled="' + tAttrs['ngDisabled'] + '" ' +
                            'ng-pattern="' + pattern + '" ' +
                            'ng-keydown="' + tAttrs['ngKeydown'] + '" ' +
                            'ng-model-options="{ updateOn: \''+ tAttrs['updateOn']+ '\' }"' +
                            '' + tAttrs['addDirectives'] + '>' +
                        '<div ng-messages="' + tAttrs['formName'] + '[\'' + tAttrs['inputName'] + token + '\'].$error" class="md-input-messages-nice"> ' +
                            '<div ng-message="required" class="md-input-message-animation"><b>Email</b> cannot be empty.</div> ' +
                            '<div ng-message="email, pattern" class="md-input-message-animation"><b>Email</b> is not valid.</div> ' +
                        '</div> ' +
                    '</md-input-container>';
                return templateStr;
            }
        };
    }
})();
