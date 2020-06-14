export default class authorizationsService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        infinityTableFilterService,
        billingsCommonService
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.billingsCommonService = billingsCommonService;
    }

    getAuthorizations(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);

        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        params = this.billingsCommonService.filtersMapping(params);
        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/authorizations`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = getStatusClass(item.Status.Id));
                return response;
            });

        function getStatusClass(authorizationStatusId) {
            switch(authorizationStatusId.toString()) {
                case '0': // new
                case '1': // active
                    return 'green';
                    break;
                case '2': // expired
                    return 'orange';
                    break;
                case '3': // renew
                    return 'blue';
                    break;
            }
        }
    }

    getAuthorizationsStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/authorizations/statuses/dictionary`, { cache: true });
    }
}
