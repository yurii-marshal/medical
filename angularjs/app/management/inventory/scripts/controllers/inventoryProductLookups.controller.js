(function () {
    'use strict';

    angular
        .module('app.management.inventory')
        .controller('inventoryProductLookupsController', inventoryProductLookupsController);

    /* @ngInject */
    function inventoryProductLookupsController($scope, $state, $q, $mdDialog, infinityTableService) {

        var lookups = this;

        lookups.sortExpr = {};
        lookups.filter = {};

        function activate() {}

        //load items
        lookups.getProductsLookupsPromise = function (pageIndex, pageSize) {
            // return productsLookupsService.getList(pageIndex, pageSize, lookups.sortExpr, lookups.filter);

            var deferred = $q.defer();
            var result = {
                data: {
                    Items:[
                        {
                            index: 1,
                            Id: '498987198917917',
                            productId: '498987198917917',
                            lotId: '156648994',
                            notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer quis ornare ex, quis vulputate ex.'
                        },
                        {
                            index: 2,
                            Id: '981798797198719',
                            productId: '981798797198719',
                            lotId: '419898119',
                            notes: ''
                        },
                        {
                            index: 3,
                            Id: '981797198179871',
                            productId: '981798797198719',
                            lotId: '894984984',
                            notes: 'Cras nibh purus, interdum et fringilla vel, mollis non libero. '
                        }
                    ]
                }
            };
            deferred.resolve(result);
            return deferred.promise;
        };

        lookups.deleteProduct = function (lookupId) {};

        lookups.showModal = function ($event, lookupId) {
            $mdDialog.show({
                templateUrl: 'management/inventory/views/modals/product-lookup-modal.html',
                targetEvent: $event,
                controller: "productLookupModalController",
                controllerAs: "modal",
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                    lookupId: lookupId
                }
            });
        };

        activate();
    }
})();
