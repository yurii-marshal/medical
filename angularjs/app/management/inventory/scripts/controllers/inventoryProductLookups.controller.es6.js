import productLookupModalController from './modals/productLookupModal.controller.es6';
import template from '../../views/modals/product-lookup-modal.html';
export default class inventoryProductLookupsController {
    constructor($q, $mdDialog) {
        'ngInject';
        this.$q = $q;
        this.$mdDialog = $mdDialog;


        this.sortExpr = {};
        this.filter = {};


        this.getProductsLookupsPromise = this._getProductsLookupsPromise.bind(this);
    }


    _getProductsLookupsPromise (pageIndex, pageSize) {
        let deferred = this.$q.defer();
        const result = {
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
    }

    deleteProduct (lookupId) {}

    showModal ($event, lookupId) {
        this.$mdDialog.show({
            template,
            targetEvent: $event,
            controller: productLookupModalController,
            controllerAs: "modal",
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                lookupId: lookupId
            }
        });
    }

}
