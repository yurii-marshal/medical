export default class patientFormsService {
    constructor(
        $filter,
        $http,
        fileService,
        WEB_API_SERVICE_URI,
        WEB_API_TEMPLATES_URI,
        authService,
        coreOrderService
    ) {
        'ngInject';

        this.$filter = $filter;
        this.$http = $http;
        this.fileService = fileService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_TEMPLATES_URI = WEB_API_TEMPLATES_URI;
        this.authService = authService;
        this.coreOrderService = coreOrderService;
    }

    getTemplates(params) {
        return this.$http.get(`${this.WEB_API_TEMPLATES_URI}v1/pdf/dictionary`, { params });
    }

    getPatientOrders(patientId, pageIndex = 0, pageSize = 100) {
        let params = {
            pageIndex,
            pageSize,
            patientId
        };

        return this.coreOrderService.getOrdersDictionary(params)
            .then((response) => {
                response.data.Items = response.data.Items.map((order) => mapResponseOrders.call(this, order));
                return response;
            });

        function mapResponseOrders(order) {
            let orderDate = this.$filter('localDateTime')(order.CreatedDate, 'MM/DD/YYYY');
            let physician = '-';

            if (!_.isEmpty(order.Physician)) {
                physician = `${!order.Physician.Name ?
                    order.Physician.Practice :
                    order.Physician.Name.FullName}`;
            }

            return {
                Id: order.Id,
                Text: `Order ID: ${order.DisplayId} | Date: ${orderDate} | Ref. Provider: ${physician}`
            };
        }
    }

    getPatientForms(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/forms`);
    }

    generateTemplate(patientId, templateId, date, order) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/forms/${templateId}/generate`, {
            'signed-date': moment.utc(date),
            OrderId: order && order.Id
        })
            .then((response) => {

                this.fileService.openFileOnTab({
                    url: `${this.WEB_API_SERVICE_URI}v1/patients/documents/${response.data.AccessToken}?access_token=${this.authService.getAccessToken()}&content-disposition=1`
                });

            });
    }

    openDocument(accessToken, contentDisposition) {
        return this.fileService.openFileOnTab({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/documents/${accessToken}?access_token=${this.authService.getAccessToken()}&content-disposition=${contentDisposition}`
        });
    }

    getDocument(accessToken, contentDisposition) {
        this.fileService.open(`${this.WEB_API_SERVICE_URI}v1/patients/documents/${accessToken}?access_token=${this.authService.getAccessToken()}&content-disposition=${contentDisposition}`);
    }
}
