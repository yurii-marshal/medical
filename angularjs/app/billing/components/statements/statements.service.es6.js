export default class statementsService {
    constructor(
        $http,
        $q,
        fileService,
        ngToast,
        WEB_API_SERVICE_URI,
        WEB_API_BILLING_SERVICE_URI,
        infinityTableFilterService,
        authService,
        claimsStatementsService
    ) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.fileService = fileService;
        this.ngToast = ngToast;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.authService = authService;
        this.claimsStatementsService = claimsStatementsService;
    }

    getStatements(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);

        if (params['Dob']) {
            params['Dob'] = moment.utc(params['Dob'], 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        params = angular.merge(params, {
            'sortExpression': this.infinityTableFilterService.getSortExpressions(sortExpression),
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.claimsStatementsService.getStatements(params);
    }

    getAllPatientIds(params) {
        return this.claimsStatementsService.getStatements(params);
    }

    hideProgressBar() {
        return this.claimsStatementsService.hideProgressBar();
    }

    downloadStatements() {
        const defer = this.$q.defer();
        const token = this.authService.getAccessToken();

        let x = new XMLHttpRequest();

        x.open('GET', `${this.WEB_API_SERVICE_URI}v1/patients/statements/generate/result`, true);
        x.setRequestHeader('Authorization', `Bearer ${token}`);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        x.responseType = 'blob';

        x.onload = function(e) {
            defer.resolve();
            download(e.target.response, 'Statements.pdf', e.target.response.type);
        };
        x.onerror = function() {
            defer.reject();
        };

        x.send();
        return defer.promise;
    }

}
