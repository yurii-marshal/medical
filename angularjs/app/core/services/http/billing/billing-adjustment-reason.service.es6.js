export default class BillingAdjustmentReasonsHttpService {
    constructor($http, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getAdjustmentReasons(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason`, { params });
    }

    getAdjustmentReason(id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason/${id}`);
    }

    createAdjustmentReason(model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason`, model);
    }

    updateAdjustmentReason(model) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason/${model.Id}`, model);
    }

    deleteAdjustmentReason(id) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/provider-adjustment-reason/${id}`);
    }

}
