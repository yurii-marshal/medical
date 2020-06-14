export default class inventoryBarcodeService {
    constructor($http, WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';
        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.model = [];
    }

    getModel() {
        return this.model;
    }

    clearModel() {
        this.model = [];
    }

    addToModel(data) {
        angular.forEach(data, (item) => {
            // check for duplicates
            if (!_.find(this.model,  (o) => o.productId === item.productId && o.barcodeId === item.barcodeId )) {
                this.model.push(angular.copy(item));
            }
        });
    }

    checkAssociation(productId, barcode) {
        return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/products/lookup/check", { ProductId: productId, Barcode: barcode });
    }

    learnBarcodes() {
        return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/products/lookup/learn", { Items: this._saveModel() });
    }

    _saveModel(){
        return this.model.map((item) => {
            return {
                ProductId: item.productId,
                Barcode: item.barcodeId
            };
        });
    }
}
