import { normalizeDeliveryMethodDictionariesData } from './order-delivery-method-dictionaries.normalization.es6';
import { normalizeOrderTrackingItemData } from './order-tracking-item.normalization.es6';

export default class CoreOrderService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        fileService
    ) {
        'ngInject';

        this.$http = $http;
        this.fileService = fileService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getOrdersDictionary(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/dictionary`, { params });
    }

    // ORDER TAGS
    getOrderTags(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/tags`, { params })
            .then((response) => response);
    }

    saveNewTag(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/orders/tags`, data);
    }

    // ORDER ITEMS
    getOrderedItems(orderId, params = {}) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/ordered/items`, { params })
            .then((response) => response.data.Items);
    }

    getOrderTrackingItems(orderId, params = {}) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking`, { params })
            .then((response) => response.data);
    }

    getOrderTrackingItemById(orderId, trackItemId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking/${trackItemId}`)
            .then((response) => normalizeOrderTrackingItemData(response.data));
    }

    getOrderTrackingComponents(patientId, orderId, trackingId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/tracking/${trackingId}/components`);
    }

    getOrderShortInfo(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/short-info`)
            .then((response) => response.data);
    }

    quickShip(orderId, patientId, model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/tracking/quick-ship`, model);
    }

    shipItem(orderId, patientId, itemId, model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/tracking/${itemId}/ship`, model);
    }

    getDeliveryMethodDictionaries() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/orders/delivery-method/dictionaries`)
            .then((response) => {
                return normalizeDeliveryMethodDictionariesData(response);
            });
    }

    getExpenseEstimatePricing(orderId, patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/expense-estimate/pricing`);
    }

    expenseEstimateCalculate(orderId, patientId, data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/expense-estimate/calculate`, { Items: data });
    }

    expenseEstimatesSave(orderId, patientId, data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/expense-estimate/save`, { Items: data });
    }

    expenseEstimatesDownload(orderId, patientId, data) {
        return this.fileService.openFileOnTab({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/expense-estimate/download`,
            method: 'POST',
            requestData: { Items: data }
        });
    }
}
