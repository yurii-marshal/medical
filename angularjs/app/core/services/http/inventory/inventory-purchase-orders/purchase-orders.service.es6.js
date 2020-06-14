export default class PurchaseOrdersHttpService {
    constructor(
        $http,
        WEB_API_INVENTORY_SERVICE_URI,
        WEB_API_SERVICE_URI,
        fileService
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.fileService = fileService;
    }

    getPurchaseOrders(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders`, { params });
    }

    getPurchaseOrder(purchaseOrderId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${purchaseOrderId}`);
    }

    editPurchaseOrderStatus(model) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${model.Id}/change-status`, model);
    }

    createPurchaseOrder(model) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders`, model);
    }

    updatePurchaseOrder(model) {
        return this.$http.put(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${model.Id}`, model);
    }

    deletePurchaseOrder(purchaseOrderId) {
        return this.$http.delete(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${purchaseOrderId}`);
    }

    printPurchaseOrder(purchaseOrderId) {
        return this.fileService.openFileOnTab({ url: `${this.WEB_API_SERVICE_URI}v1/purchase-orders/${purchaseOrderId}/print` });
    }

    getStatusesDictionary() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/statuses/dictionary`);
    }

    getPurchaseOrderAudit(purchaseOrderId, params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${purchaseOrderId}/audits`, { params });
    }

    getPurchaseOrderAuditDetails(purchaseOrderId, params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/purchase-orders/${purchaseOrderId}/audits/details`, { params });
    }
}
