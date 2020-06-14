export default class PurchaseOrderManageService {
    constructor() {
        'ngInject';

        this._initModel();
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
    }

    clearModel() {
        this._initModel();
    }

    _initModel() {
        this.model = {
            Products: [],
            vendorContactObj: {}
        };
    }
}

