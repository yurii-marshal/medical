export default class SettingsService {
    constructor(
        $http,
        WEB_API_ORGANIZATIONS_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_ORGANIZATIONS_URI = WEB_API_ORGANIZATIONS_URI;
    }

    getOrderSettings() {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/order`);
    }

    getPackingSlipSettings() {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/packing-slip`);
    }

    getDeliveryTicketSettings() {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/delivery-ticket`);
    }

    updateOrderSettings(model) {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/order`, model);
    }

    updatePackingSlipSettings(model) {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/packing-slip`, model);
    }

    updateDeliveryTicketSettings(model) {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/delivery-ticket`, model);
    }

    getStatementSettings() {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/statement`);
    }

    updateStatementSettings(model) {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/settings/statement`, model);
    }
}
