export default class inboxService {
    constructor($http, WEB_API_SERVICE_URI,
                authService,
                WEB_API_FAX_URI,
                infinityTableFilterService,
                $window) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.WEB_API_FAX_URI = WEB_API_FAX_URI;
        this.authService = authService;
        this.$window = $window;
    }

    getList(filterObj, sortExpressions, pageIndex, pageSize) {

        let sortExpr = this.infinityTableFilterService.getSortExpressions(sortExpressions),
            paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        if (paramsObj['ReceivedDate']) {
            paramsObj['ReceivedDate'] = moment(paramsObj['ReceivedDate']).format();
        }
        paramsObj = angular.merge(paramsObj, {
            'sortExpression': sortExpr,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(`${this.WEB_API_FAX_URI}v1/faxes/inbox`, { params: paramsObj });
    }

    showDocumentInPreview(Id) {
        let token = this.authService.getAccessToken();

        this.$window.document.getElementById('pdfPreview').src = `${this.WEB_API_FAX_URI}v1/faxes/inbox/${Id}/document?access_token=${token}`;
        return;
    }

    deleteItems(Ids) {
        return this.$http.post(`${this.WEB_API_FAX_URI}v1/faxes/inbox/delete`, { FaxIds: Ids });
    }

    downloadDocuments(arr) {
        let token = this.authService.getAccessToken();

        if (!arr && !arr.length) {
            return { status: false };
        }

        let faxIdsParam = arr.map((item) => `FaxIds=${item}`).join('&');

        const newWindowOpened = this.$window.open(`${this.WEB_API_FAX_URI}v1/faxes/inbox/download?access_token=${token}&${faxIdsParam}`, '_blank');

        if (!newWindowOpened) {
            return {
                isAdBlockOn: true,
                status: false
            };
        }

        return { status: true };
    }

    // PUT /v1/patients/inbox
    applyDocuments(dataArr) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/inbox`, { Patients: dataArr });
    }

    // POST /v1/patients/inbox
    createPatientsWithDocuments(dataArr) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/inbox`, { Patients: dataArr });
    }

    changeReadStatus(dataArr, isRead) {
        let data = {
            FaxIds: dataArr.map((o) => o.Id),
            Read: isRead
        };

        return this.$http.put(`${this.WEB_API_FAX_URI}v1/faxes/inbox/read`, data);
    }
}

