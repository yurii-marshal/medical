(function () {
    "use strict";

    angular
        .module("app.core")
        .directive("inputPhoneNumber", inputPhoneNumber);

    /* @ngInject */
    function inputPhoneNumber() {
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

                var token = guid();

                var templateStr =
                    '<md-input-container ' +
                        'ng-if="' + tAttrs['ngIf'] + '"> ' +
                        //'<label>' + tAttrs['label'] + '</label>' +
                        '<input type="tel" ' +
                            'placeholder="' + tAttrs['label'] + '" ' +
                            'name="' + tAttrs['inputName'] + token + '" ' +
                            'ng-model="' + tAttrs['ngModel'] + '" ' +
                            'ng-required="' + tAttrs['ngRequired'] + '" ' +
                            'ng-disabled="' + tAttrs['ngDisabled'] + '" ' +
                            'ng-model-options="{ updateOn: \'blur\' }"' +
                            'input-phone-mask ' +
                            '' + tAttrs['addDirectives'] + '>' +
                        '<div ng-messages="' + tAttrs['formName'] + '[\'' + tAttrs['inputName'] + token + '\'].$error" class="md-input-messages-nice"> ' +
                            '<div ng-message="required" class="md-input-message-animation"><b>Contact</b> cannot be empty</div> ' +
                            '<div ng-message="phone-pattern" class="md-input-message-animation">Contact must be in correct format.</div> ' +
                        '</div> ' +
                    '</md-input-container>';
                return templateStr;
            }
        };
    }

    angular
        .module("app.core")
        .directive("inputPhoneMask", function($filter, $browser) {
                var isFieldEnabled = true;
                var noValidation = false;
                return {
                    require: "ngModel",
                    link: function($scope, $element, $attrs, ngModelCtrl) {
                        var listener = function() {
                            var value = $element.val().replace(/[^0-9]/g, ""),
                                        caretPosition = getCaretPosition($element[0]),
                                        prevVal = $element.val();

                            noValidation = $attrs.noValidation;
                            if (isFieldEnabled && !noValidation) {
                                ngModelCtrl.$setValidity("phone-pattern", RegExp(/^(|[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})$/).test(value));
                            }

                            $element.val(addPhoneFormat(value, false));

                            if(prevVal.length !== caretPosition.start) {
                                setInputSelection($element[0], caretPosition.start, caretPosition.start);
                            }

                        };

                        // This runs when we update the text field
                        ngModelCtrl.$parsers.push(function(viewValue) {
                            return viewValue.replace(/[^0-9]/g, "").slice(0, 10);
                        });

                        // This runs when the model gets updated on the scope directly and keeps our view in sync
                        ngModelCtrl.$render = function() {
                            $element.val(addPhoneFormat(ngModelCtrl.$viewValue, false));
                        };

                        $element.bind("change", listener);
                        $element.bind("keydown", function(event) {
                            var key = event.keyCode;
                            // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                            // This lets us support copy and paste too
                            if (key === 9
                                || key === 91
                                || (15 < key && key < 19)
                                || (37 <= key && key <= 40)
                            ) {
                                return;
                            }

                            $browser.defer(listener); // Have to do this or changes don't get picked up properly
                        });

                        $element.bind("paste cut", function() {
                            $browser.defer(listener);
                        });

                        $scope.$watchGroup([
                                function() {
                                    return $attrs.readOnly;
                                }, function() {
                                    return $attrs.disabled;
                                }
                            ],
                            function() {
                                isFieldEnabled = !$attrs.readOnly && !$attrs.disabled;
                                if (isFieldEnabled) {
                                    ngModelCtrl.$setValidity("phone-pattern", RegExp(/^(|[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6})$/).test($element.val().replace(/[^0-9]/g, "")));
                                } else {
                                    ngModelCtrl.$setValidity("phone-pattern", true);
                                }
                            });
                    }
                };
            }
        );

    function setInputSelection(input, startPos, endPos) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(startPos, endPos);
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', endPos);
            range.moveStart('character', startPos);
            range.select();
        }
    }

    function getCaretPosition(ctrl) {
        if (document.selection) {
            ctrl.focus();
            var range = document.selection.createRange();
            var rangelen = range.text.length;
            range.moveStart ('character', -ctrl.value.length);
            var start = range.text.length - rangelen;
            return {'start': start, 'end': start + rangelen };
        }
        else if (ctrl.selectionStart || ctrl.selectionStart == '0') {
            return {'start': ctrl.selectionStart, 'end': ctrl.selectionEnd };
        } else {
            return {'start': 0, 'end': 0};
        }
    }


    //Custom formatting for input when type phone numbers
    function addPhoneFormat(tel) {
        if (!tel) {
            return '';
        }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if (number) {

            if (number.length > 7) {
                number = number.slice(0, 7);
            }

            if (number.length > 0 && number.length < 4) {
                number = number.slice(0, 3);
            } else {
                if (number.length > 0 && number.length < 6) {
                    number = number.slice(0, 3) + '-' + number.slice(3, 6);
                } else {
                    if (number.length > 0 && number.length <= 7) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 7);
                    }
                }
            }

            return ("(" + city + ") " + number).trim();
        } else {
            return "(" + city;
        }
    };

})();
