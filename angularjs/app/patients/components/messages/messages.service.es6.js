export default class messagesService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getMessages(patientId, practiceId, paramsObj) {
        let params = paramsObj || {};
        params['sortExpression'] = 'CreatedDate DESC';

        return this.$http.get(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/practices/${practiceId}/messages`, { params });
    }

    getPractices(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/practices`);
    }

    getOrders(patientId, practiceId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/practices/${practiceId}/orders`);
    }

    getSubjectTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}/v1/messages/subject-types/dictionary`);
    }

    sendMessage(practiceId, model){
        return this.$http.post(`${this.WEB_API_SERVICE_URI}/v1/practices/${practiceId}/orders/${model.orderId}/messages`, model);
    }

    sendAlert(practiceId, model){
        return this.$http.post(`${this.WEB_API_SERVICE_URI}/v1/practices/${practiceId}/orders/${model.orderId}/alerts`, model);
    }

    setMessagesRead(arrItems) {
        const data = { MessageIds: _.map(arrItems, (i) => i.Id) };
        return this.$http.put(`${this.WEB_API_SERVICE_URI}/v1/practices/messages/mark-as-read`, data);
    }

    setMessagesUnRead(arrItems) {
        const data = { MessageIds: _.map(arrItems, (i) => i.Id) };
        return this.$http.put(`${this.WEB_API_SERVICE_URI}/v1/practices/messages/mark-as-unread`, data);
    }

    setAlertsInActive(arrItems) {
        const data = { AlertIds: _.map(arrItems, (i) => i.Id) };
        return this.$http.put(`${this.WEB_API_SERVICE_URI}/v1/practices/alerts/deactivate`, data);
    }
}
