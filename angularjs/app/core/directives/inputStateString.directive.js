(function () {
    "use strict";

    angular
        .module("app")

        //input-output "NY"
        .directive("inputStateString", inputStateString);

    /* @ngInject */
    function inputStateString($http,
                        $filter,
                        WEB_API_SERVICE_URI) {
        'use strict';

        var getStateFunc = function (query) {
            var params = { abbreviation: query };
            return $http.get(WEB_API_SERVICE_URI + "v1/settings/states/dictionary", { cache: true, params: params })
                .then(function (response) {
                    return response.data.map(function (state) {
                        return state.Id
                    });
                });
        };

        return directiveGenerator(getStateFunc, 'state');
    }

    function directiveGenerator(getStateFunc, autocompliteDisplayText) {
        return {
            restrict: 'E',
            scope: {
                selectedItem: "=",
                ngDisabled: '=ngDisabled',
                ngRequired: '=ngRequired',
                formName: '=formName'
            },
            link: function(scope, element, attrs) {
                scope.inputUniqueName = attrs['inputName'] + guid();
            },
            template: function(tElement, tAttrs) {

                tAttrs['formName'] = tAttrs['formName'] || '';
                tAttrs['inputName'] = tAttrs['inputName'] || '';
                tAttrs['selectedItem'] = tAttrs['selectedItem'] || '';
                tAttrs['label'] = tAttrs['label'] || 'State:';
                tAttrs['mdInputMinlength'] = tAttrs['mdInputMinlength'] || '2';
                tAttrs['ngReadonly'] = tAttrs['ngReadonly'] || 'false';
                tAttrs['ngDisabled'] = tAttrs['ngDisabled'] || 'false';
                tAttrs['ngRequired'] = tAttrs['ngRequired'] || 'false';
                tAttrs['addDirectives'] = tAttrs['addDirectives'] || '';

                if (!tAttrs['selectedItem']) return "<b>[AngularJS Error: tAttrs[selectedItem] is empty]</b>";

                return '<md-autocomplete flex' + '' +
                    '                 md-input-id="{{ inputUniqueName + \'Id\' }}"' +
                    '                 md-input-name="{{ inputUniqueName }}"' +
                    '                 md-input-minlength="' + tAttrs['mdInputMinlength'] + '"' +
                    '                 md-no-cache="true"' +
                    '                 md-selected-item="selectedItem"' +
                    '                 md-search-text="inputState.searchText' + tAttrs['inputName'] + '"' +
                    '                 md-items="state in inputState.getStates(inputState.searchText' + tAttrs['inputName'] + ')"' +
                    '                 md-item-text="' + autocompliteDisplayText + '"' +
                    '                 md-floating-label="' + tAttrs['label'] + '"' +
                    '                 ng-readonly="' + tAttrs['ngReadonly'] + '"' +
                    '                 ng-disabled="ngDisabled"' +
                    '                 ng-required="ngRequired"' +
                    '                 drowz-clear-value' +
                    '                 ' + tAttrs['addDirectives'] + '>' +
                    '    <md-item-template>' +
                    '        <span md-highlight-text="inputState.searchText' + tAttrs['inputName'] + '">{{' + autocompliteDisplayText + '}}</span>' +
                    '    </md-item-template>' +
                    '    <div ng-messages="formName[inputUniqueName].$error" class="md-input-messages-nice">' +
                    '        <div ng-message="required">This field is required</div>' +
                    '        <div ng-message="selected">State has to be selected from the list</div>' +
                    '    </div>' +
                    '</md-autocomplete>';
            },

            controller: ['$scope', '$element', '$attrs', '$transclude', function ($scope, $element, $attrs, $transclude) {
                var inputState = this;
                inputState.getStates = getStateFunc;

                $scope.$watch($attrs.selectedItem, function(newValue) {
                    if (!newValue) {
                        inputState['searchText' + $attrs['inputName']] = undefined;
                    }
                });
            }],
            controllerAs: 'inputState'
        }
    }
})();
