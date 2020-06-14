(function () {
    "use strict";

    angular
        .module("app")
        .directive("clearOnClick", clearOnClick);

    function clearOnClick() {
        return {
            restrict: 'AE',
            scope: false,
            require: [
                '?mdAutocompleteWithInfiniteScroll',
                '?mdAutocomplete',
                '?ngModel'
            ],
            link: function(scope, element, attr, ctrlArr) {
                var elem = element[0],
                    clearButton = $("<a href='javascript:void(0)' class='clear-field'></a>");

                switch(elem.tagName){

                    case 'MD-AUTOCOMPLETE-WITH-INFINITE-SCROLL':

                        clearButton.on('click', function(event) {
                            event.stopPropagation();
                            ctrlArr[0].scope.selectedItem = undefined;
                            ctrlArr[0].scope.searchText = undefined;
                            $(element).find('input').blur();
                        });
                        element.append(clearButton);

                        scope.$watchCollection(function() {
                            return [ctrlArr[0].scope.selectedItem, ctrlArr[0].scope.searchText];
                        }, function(newVal, oldVal) {
                            var haveData = false;

                            angular.forEach(newVal, function (item) {
                                if (item) {
                                    haveData = true;
                                }
                            });

                            if (haveData) {
                                $(element).find('input').css('padding-right', '21px');
                                clearButton.show();
                            } else {
                                $(element).find('input').css('padding-right', '0px');
                                clearButton.hide();
                            }
                        });

                        break;

                    case 'MD-AUTOCOMPLETE':

                        clearButton.on('click', function(event) {
                            event.stopPropagation();
                            ctrlArr[1].scope.selectedItem = undefined;
                            ctrlArr[1].scope.searchText = undefined;
                            $(element).find('input').blur();
                        });

                        element.append(clearButton);

                        scope.$watchCollection(function() {
                            return [ctrlArr[1].scope.selectedItem, ctrlArr[1].scope.searchText];
                        }, function(newVal, oldVal) {
                            var haveData = false;
                            angular.forEach(newVal, function (item) {
                                if (item !== '' && item !== null && item !== undefined) {
                                    haveData = true;
                                }
                            });
                            if (haveData) {
                                if ($(element).hasClass('autocomplete-with-addBtn')) {
                                    $(element).addClass('autocomplete-with-clear');
                                } else {
                                    $(element).find('input').css('padding-right', '21px');
                                }
                                clearButton.show();
                            } else {
                                if ($(element).hasClass('autocomplete-with-addBtn')) {
                                    $(element).removeClass('autocomplete-with-clear');
                                } else {
                                    $(element).find('input').css('padding-right', '0px');
                                }
                                clearButton.hide();
                            }
                        });

                        break;

                    case 'MD-SELECT':
                        var isMultiple = elem.hasAttribute('multiple');
                        clearButton.on('click', function(event) {
                            event.stopPropagation();
                            ctrlArr[2].$setViewValue(isMultiple ? [] : undefined);
                            ctrlArr[2].$render();
                            $(element).find('input').focus();
                            $(element).find('input').blur();
                        });

                        element.append(clearButton);

                        scope.$watch(function() {
                            return ctrlArr[2].$viewValue;
                        }, function(newVal, oldVal) {
                            var hasValue = newVal !== null && newVal !== undefined && newVal !== '';
                            if (hasValue && isMultiple) {
                                hasValue = newVal.length > 0;
                            }
                            if (hasValue) {
                                $(element).addClass('with-clear');
                                clearButton.show();
                            } else {
                                $(element).removeClass('with-clear');
                                clearButton.hide();
                            }
                        });

                        break;

                    case 'INPUT':

                        clearButton.on('click', function(event) {
                            event.stopPropagation();
                            if (elem.hasAttribute('datetimepicker')) {
                                $(elem).data("DateTimePicker").clear();
                            }
                            ctrlArr[2].$setViewValue('');
                            ctrlArr[2].$render();
                            //$(element).focus();
                            $(element).blur();
                        });

                        element.after(clearButton);

                        scope.$watch(function() {
                            return ctrlArr[2].$viewValue;
                        }, function(newVal, oldVal) {
                            if (newVal) {
                                $(element).css('padding-right', '21px');
                                clearButton.show();
                            } else {
                                $(element).css('padding-right', '0px');
                                clearButton.hide();
                            }
                        });

                        break;

                }

                scope.$on('$destroy', function(){
                    clearButton.off('click');
                });

            }
        };
    }
})();
