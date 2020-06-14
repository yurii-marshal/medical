import { orderStatusConstants } from '../../../../../core/constants/core.constants.es6.js';

export default class appointmentOrdersService {
    constructor(
        $q,
        $http,
        $filter,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        coreOrderService
    ) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.$filter = $filter;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.coreOrderService = coreOrderService;

    }

    getPatientEquipment(patientId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/patients/${patientId}/equipment`);
    }

    getPatientActiveOrders(patientId, params) {
        params = angular.merge(
            {
                status: [
                    orderStatusConstants.NEW_ORDER_ID,
                    orderStatusConstants.IN_PROGRESS_ORDER_ID,
                    orderStatusConstants.HOLD_ORDER_ID,
                    orderStatusConstants.COMPLETED_ORDER_ID
                ],
                selectCount: true,
                orderTypes: null,
                patientId
            },
            params
        );

        if (params.referralCard && params.referralCard.displayName) {
            params['physicianName'] = params.referralCard.displayName;
            delete params['referralCard'];
        }

        if (params.hasOwnProperty('createdFrom')) {
            params['created.from'] = params['createdFrom'];
            delete params['createdFrom'];
        }

        if (params.hasOwnProperty('createdTo')) {
            params['created.to'] = params['createdTo'];
            delete params['createdTo'];
        }

        return this.coreOrderService.getOrdersDictionary(params);
    }

    getOrderDictionaries() {
        let promises = [
            this._getAppointmentTypesDictionary(),
            this._getPickUpTypesDictionary(),
            this._getRevisitDictionary()
        ];

        return this.$q.all(promises)
            .then((responses) => {
                return {
                    AppointmentTypes: responses[0].data,
                    PickUpTypes: responses[1].data,
                    RevisitOptions: responses[2].data
                };
            });
    }

    getReferralCards(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/dictionary`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.searchName = this.$filter('referralDisplayName')(item, true);
                    item.displayName = this.$filter('referralDisplayName')(item);
                });
                return response;
            });
    }

    _getAppointmentTypesDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/appointment-types/dictionary`, { cache: true });
    }

    _getRevisitDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/revisit/dictionaries`, { cache: true });
    }

    _getPickUpTypesDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/pickup-reason-types/dictionary`, { cache: true });
    }

    getOrderStatusClass(orderStatusId) {
        switch (orderStatusId.toString()) {
            case '1': // hold
                return 'orange';
            case '2': // ready
                return 'green';
            case '3': // ready
                return 'blue';
            case '4': // cancelled
                return 'gray';
            case '5': // complete
                return 'dark-gray';
            default:
                break;
        }
    }
}
