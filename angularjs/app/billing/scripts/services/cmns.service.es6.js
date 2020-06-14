export default class cmnsService {
    constructor($http, $mdDialog, WEB_API_SERVICE_URI, infinityTableFilterService, billingsCommonService) {
        'ngInject';

        this.$http = $http;
        this.$mdDialog = $mdDialog;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.billingsCommonService = billingsCommonService;
    }

    getCmns(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        params = this.billingsCommonService.filtersMapping(params);

        if (params.CmnType) { params['CmnType'] = params.CmnType.Id; }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/cmn-documents`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = getStatusClass(item.Status.Id));
                return response;
            });

        function getStatusClass(cmnStatusId) {
            switch(cmnStatusId.toString()) {
                case '1': // active
                    return 'green';
                case '2': // expired
                    return 'orange';
                case '3': // renewed
                    return 'blue';
            }
        }
    }

    getCmnsStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/cmn-documents/statuses/dictionary`, { cache: true })
    }
}
