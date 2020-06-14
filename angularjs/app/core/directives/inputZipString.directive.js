(function () {
    "use strict";

    angular
        .module("app")
        .directive("inputZipString", inputZipString);

    /* @ngInject */
    function inputZipString($http, WEB_API_SERVICE_URI) {
        return {
            restrict: "E",
            scope: {
                selectedItem: "=",
                isDisabled: '=ngDisabled',
                ngRequired: '=ngRequired'
            },

            template: function(tElement, tAttrs) {
                tAttrs['formName'] = tAttrs['formName'] || '';
                tAttrs['inputName'] = tAttrs['inputName'] || '';
                tAttrs['selectedItem'] = tAttrs['selectedItem'] || '';
                tAttrs['label'] = tAttrs['label'] || 'ZIP:';
                tAttrs['mdInputMinlength'] = tAttrs['mdInputMinlength'] || '2';
                tAttrs['ngReadonly'] = tAttrs['ngReadonly'] || 'false';
                tAttrs['addDirectives'] = tAttrs['addDirectives'] || '';

                var token = guid(true);

                if (!tAttrs['selectedItem']) return "<b>[AngularJS Error: tAttrs[selectedItem] is empty]</b>";

                return '<md-autocomplete-with-infinite-scroll ' +
                    '                 flex' +
                    '                 md-no-cache="true"' +
                    '                 md-selected-item="selectedItem"' +
                    '                 md-search-text="inputZipCode.searchText' + tAttrs['inputName'] + '"' +
                    '                 md-items="zipCode in inputZipCode.getZipCodes(inputZipCode.searchText' + tAttrs['inputName'] + ', pageIndex)"' +
                    '                 md-item-text="zipCode"' +
                    '                 md-min-length="' + tAttrs['mdInputMinlength'] + '"' +
                    '                 md-floating-label="' + tAttrs['label'] + '"' +
                    '                 md-menu-container-class="zip-decorator" ' +
                    '                 md-autocomplete-required' +
                    '                 md-input-id="' + tAttrs['inputName'] + 'Id"' +
                    '                 md-input-name="' + tAttrs['inputName'] + token + '"' +
                    '                 ng-readonly="' + tAttrs['ngReadonly'] + '"' +
                    '                 ng-disabled="isDisabled"' +
                    '                 ng-required="ngRequired"' +
                    '                 ng-model-options="{debounce: 450}" ' +
                    '                 drowz-clear-value' +
                    '                 ' + tAttrs['addDirectives'] + '>' +
                    '    <md-item-template>' +
                    '        <span md-highlight-text="inputZipCode.searchText' + tAttrs['inputName'] + '">{{zipCode}}</span>' +
                    '    </md-item-template>' +
                    '   <md-not-found>No Zip Codes were found</md-not-found>' +
                    '    <div ng-messages="' + tAttrs['formName'] + '[\'' + tAttrs['inputName'] + token + '\'].$error" class="md-input-messages-nice">' +
                    '        <div ng-message="required">This field is required</div>' +
                    '        <div ng-message="selected">Zip has to be selected from the list</div>' +
                    '    </div>' +
                    '</md-autocomplete-with-infinite-scroll>';
            },

            controller: ['$scope', '$attrs', function($scope, $attrs) {
                var inputZipCode = this;

                inputZipCode.getZipCodes = function(query, pageIndex) {
                    var paramsObj = {
                        text: query,
                        pageIndex: pageIndex,
                        pageSize: 20
                    };
                    return $http.get(WEB_API_SERVICE_URI + "dictionaries/zip-codes", { cache: true, params: paramsObj })
                        .then(function(response) {
                            response.data.Items = _.map(response.data.Items, function (zip) { return zip.text; });
                            return response.data;
                        });
                };

                $scope.$watch('selectedItem', function(newValue) {
                    if (!newValue) {
                        inputZipCode['searchText' + $attrs['inputName']] = undefined;
                    }
                });

            }],
            controllerAs: "inputZipCode"
        };
    }
})();
