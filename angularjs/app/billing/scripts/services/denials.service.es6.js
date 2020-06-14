import { denialsStatusConstants } from '../../../core/constants/billing.constants.es6';

export default class denialsService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI, infinityTableFilterService, billingsCommonService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.billingsCommonService = billingsCommonService;
    }

    getDenials(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        params = this.billingsCommonService.filtersMapping(params);

        if (params.CreatedOn) {
            params.CreatedOn = moment(params.CreatedOn).format();
        }

        /**
         * @override this.billingsCommonService.filtersMapping
         *           because this filters work another way on denials
         */
        if (params.InProgressDateRangeFrom) {
            params['InProgressDateRangeFrom'] = moment(params.InProgressDateRangeFrom).startOf('day').format();
        }

        if (params.InProgressDateRangeTo) {
            params['InProgressDateRangeTo'] = moment(params.InProgressDateRangeTo).endOf('day').format();
        }

        if (params.inProgressStartDateFrom) {
            params['inProgressStartDateFrom'] = moment(params.inProgressStartDateFrom).startOf('day').format();
        }

        if (params.inProgressStartDateTo) {
            params['inProgressStartDateTo'] = moment(params.inProgressStartDateTo).endOf('day').format();
        }

        if (filterObj.Insurance) {
            filterObj.Source = filterObj.Insurance.Name;
            delete filterObj.Insurance;
        }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/denials`, { params })
            .then((response) => {
                response.data.Items.map((item) => {
                    let ItemDosFrom = moment.utc(item.Dos.From).format('MM/DD/YYYY'),
                        ItemDosTo = moment.utc(item.Dos.To).format('MM/DD/YYYY');

                    item.StatusClass = getStatusClass(item.Status.Id);
                    item.PatientFullName = `${item.Patient.FirstName} ${item.Patient.LastName}`;
                    item.PatientDateOfBirth = moment.utc(item.PatientDateOfBirth).format('MM/DD/YYYY');
                    item.Dos.Full = `${ItemDosFrom} - ${ItemDosTo}`;

                });

                return response;
            });

        function getStatusClass(denialsStatusId) {
            switch (denialsStatusId) {
                case denialsStatusConstants.PAID_STATUS_ID: // 0
                    return 'blue';
                case denialsStatusConstants.NEW_STATUS_ID: // 1
                    return 'green';
                case denialsStatusConstants.RESUBMITED_STATUS_ID: // 2
                    return 'light-blue';
                case denialsStatusConstants.WRITE_OFF_STATUS_ID: // 3
                    return 'dark-gray';
                case denialsStatusConstants.IGNORE_STATUS_ID: // 4
                    return 'orange';
                default:
                    break;
            }
        }
    }

    getDenialsStatuses() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/denials/statuses/dictionary`, { cache: true });
    }
}
