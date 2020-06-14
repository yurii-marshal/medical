export default class PrescriptionsService {
    constructor($filter, $http, $mdDialog, WEB_API_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$filter = $filter;
        this.$http = $http;
        this.$mdDialog = $mdDialog;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    getPrescriptions(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);

        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        if (params.EffectiveDate) {
            params['effectiveDate'] = moment.utc(params['EffectiveDate']).format('YYYY-MM-DD');
            delete params['EffectiveDate'];
        }

        if (params.ExpiryDateEquals) {
            params['expiryDate'] = moment.utc(params['ExpiryDateEquals']).format('YYYY-MM-DD');
            delete params['ExpiryDateEquals'];
        }

        if (params.ExpiryDateFrom) {
            params['expiryDateFrom'] = moment.utc(params.ExpiryDateFrom).format('YYYY-MM-DD');
            delete params['ExpiryDateFrom'];
        }

        if (params.ExpiryDateEquals && params.ExpiryDateFrom) {
            params['expiryDateFrom'] = moment.utc(params.ExpiryDateEquals).format('YYYY-MM-DD');
            delete params['ExpiryDateEquals'];
        }

        if (params.ExpiryDateTo) {
            params['expiryDateTo'] = moment.utc(params.ExpiryDateTo).format('YYYY-MM-DD');
            delete params['ExpiryDateTo'];
        }

        if (params.inProgressFrom) {
            params['inProgressFrom'] = moment.utc(params.inProgressFrom).format('YYYY-MM-DD');
        }

        if (params.inProgressTo) {
            params['inProgressTo'] = moment.utc(params.inProgressTo).format('YYYY-MM-DD');
        }

        if (params.Patient) {
            params['patientId'] = params.Patient.Id;
            delete params['Patient'];
        }

        if (params.PrimaryInsurance) {
            params['payerName'] = params.PrimaryInsurance.Name;
            delete params['PrimaryInsurance'];
        }

        if (params.displayId) {
            params['displayId'] = params.displayId.Text;
        }

        if (params.HcpcsCode) {
            params.hcpcs = params.HcpcsCode.Id;
            delete params['HcpcsCode'];
        }

        params.selectCount = true;
        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/prescriptions/billing`, { params })
            .then((response) => {
                if (response.data && response.data.Items.length) {
                    response.data.Items.map((item) => {
                        item.displayName = this.$filter('referralDisplayName')(item.TreatingProvider);
                        item.allHcpcsCodes = item.Hcpcs;
                    });
                }
                return response;
            });
    }

    getPrescriptionsStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/prescriptions/statuses/dictionary`, { cache: true });
    }

    getHcpcsCodes(code) {
        let params = { code };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }

}
