export default class InventoryVendorsHttpService {
    constructor($http, WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    getVendors(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors`, { params });
    }

    getVendor(vendorId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors/${vendorId}`);
    }

    createVendor(model) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors`, model);
    }

    updateVendor(model) {
        return this.$http.put(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors/${model.Id.Id}`, model);
    }

    deleteVendor(vendorId) {
        return this.$http.delete(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors/${vendorId}`);
    }

    getContactTypes() {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/vendors/contact-types/dictionary`, { cache: true });
    }
}
