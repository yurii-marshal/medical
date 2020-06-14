export default class ReportsService {
    constructor(
        $http,
        WEB_API_SERVICE_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getReportPageConf(sourceId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/reports/${sourceId}`);
    }

    getReportPageData(sourceId, params) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/reports/${sourceId}/execute`, params);
    }

    exportReportToCsv(sourceId, params) {
        return this.$http({
            url: `${this.WEB_API_SERVICE_URI}v1/reports/${sourceId}/export/csv`,
            method: 'POST',
            data: params,
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            download(response.data, `${sourceId}_${moment().format('MM-DD-YYYY hh-mm-ss A')}.csv`, 'application/octet-stream');
        });
    }
}
