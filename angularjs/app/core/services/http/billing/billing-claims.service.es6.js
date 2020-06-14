export default class BillingClaimsService {
    constructor($http, WEB_API_BILLING_SERVICE_URI, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getClaimsTags(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/tags`, { params });
    }

    // TODO move to core (microservice) Only billing here
    createClaimsTag(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/claims/tag`, data);
    }

    updateClaimsState(claimId, data) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/state`, data);
    }

    postWriteOff(invoiceId, model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/write-off`, model);
    }

    getActiveServiceLines(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/active`, { params });
    }

    getHistoryServiceLines(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/history`, { params });
    }

    deleteInvoice(invoiceId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${ invoiceId }`);
    }

    printInvoices(params) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/print`, params);
    }

    getCms1500ForInvoices(ids, isBlank) {
        const params = {
            ClaimIds: ids,
            IsEmpty: !isBlank
        };

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/cms-1500`, params );
    }

    checkJobStatus(jobId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/jobs/${ jobId }`);
    }

    checkModelJobStatus(jobId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/jobs/${ jobId }/model`);
    }

    cancelJob(jobId) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/jobs/${ jobId }/cancel`);
    }

    getClaimsTasks(claimId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/tasks`, { params });
    }
}
