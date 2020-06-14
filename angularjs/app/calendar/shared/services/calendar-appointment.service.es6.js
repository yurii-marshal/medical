import { orderStatusConstants, patientStatusConstants } from '../../../core/constants/core.constants.es6.js';

import orderDetailsModalTemplate from '../modals/order-details/order-details.html';
import orderDetailsModalController from '../modals/order-details/order-details.controller.es6.js';

export default class CalendarAppointmentService {
    constructor(
        $rootScope,
        $mdDialog,
        $q,
        $http,
        WEB_API_SERVICE_URI,
        fileService,
        authService,
        corePatientService,
        coreOrderService
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.fileService = fileService;
        this.authService = authService;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;

        this.model = {};
    }

    getModel() {
        return this.model;
    }

    setDefaultModel() {
        this.model = {
            durationFromServer: '',
            selectedDuration: '0h 0m',
            IsCustomDuration: false,
            event: {
                Patient: {
                    Id: undefined
                },
                Relations: [],
                AppointmentType: {},
                Documents: []
            },
            isPatientHasOrders: undefined,
            patientDocuments: []
        };
    }

    _getPartsOfDay() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/part-of-day/dictionary`, { cache: true });
    }

    _getEventLocationTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/location-type/dictionary`, { cache: true });
    }

    /**
     * @param {Object} params example
     * @param {Number} params.pageSize example 100
     * @param {String} params.sortExpression example 'Name ASC'
     * @param {String} params.SchedulesRange.From example '2017-12-21T11:00:00'
     * @param {String} params.SchedulesRange.To example '2017-12-21T12:00:00'
     */
    getServiceCenters(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/setup-centers`, { params })
            .then((response) => {
                if (response.data.Count > 0) {
                    response.data.Items.forEach((item) => item.searchAddress = item.Address.FullAddress);
                } else {
                    response.data.Items = [];
                }

                return response;
            });
    }

    getAllDictionaries() {
        let promises = [];
        let deferred = this.$q.defer();

        promises.push(this._getPartsOfDay());
        promises.push(this._getEventLocationTypes());

        this.$q.all(promises)
            .then((responses) => {
                responses = responses.map((response) => response.data);
                deferred.resolve(responses);
            });

        return deferred.promise;
    }

    getEventById(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/${id}`)
            .then((response) => {
                this.model.event = response.data;
                this.model.IsCustomDuration = response.data.IsCustomDuration;
                return response;
            });
    }

    getPatientMainInfo(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}`);
    }

    getPatients(fullName, pageIndex) {
        pageIndex = pageIndex || 0;
        const params = {
            pageIndex,
            selectCount: true,
            sortExpression: 'Name ASC',
            'filter.fullName': fullName,
            'filter.Status': patientStatusConstants.ACTIVE_STATUS_ID
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getDocuments(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/documents`)
            .then((response) => {
                this.model.patientDocuments = response.data.Items;
                this.$rootScope.$broadcast('patientDocumentsInfoLoaded');
                return response;
            });
    }

    getPersonnel(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnel/available`, data);
    }

    getAppointments(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/events/scheduling`, data);
    }

    createEvent(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/events`, data);
    }

    updateEvent(data, eventId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/events/${eventId}`, data);
    }

    isPatientHasOrders(patientId) {
        const params = {
            pageSize: 1,
            pageIndex: 0,
            selectCount: true,
            status: [
                orderStatusConstants.NEW_ORDER_ID,
                orderStatusConstants.IN_PROGRESS_ORDER_ID,
                orderStatusConstants.COMPLETED_ORDER_ID
            ],
            patientId
        };

        return this.coreOrderService.getOrdersDictionary(params)
            .then((response) => {
                this.model.isPatientHasOrders = !!response.data.Count;
                return response;
            });
    }

    getInsurances(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances`);
    }

    openDocument(accessToken) {
        this.fileService.download(`${this.WEB_API_SERVICE_URI}v1/patients/documents/${accessToken}?access_token=${this.authService.getAccessToken()}`);
    }

    getDuration(data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/events/duration`, data);
    }

    openOrderDetails(order) {
        let orderId;

        if (!_.isObject(order)) {
            orderId = order;
            order = undefined;
        }

        this.$mdDialog.show({
            template: orderDetailsModalTemplate,
            clickOutsideToClose: true,
            controller: orderDetailsModalController,
            controllerAs: '$ctrl',
            locals: { order, orderId }
        });
    }

    getDurationSettingsModel(OrdersCount, appointmentType) {
        let request = {
            OrdersCount,
            AppType: appointmentType.Id
        };

        if (appointmentType.RevisitOptions
            && !_.isEmpty(appointmentType.RevisitOptions.RevisitList)) {
            let arrRevisitTypes = [];

            angular.forEach(appointmentType.RevisitOptions.RevisitList, (item) => {
                if (item.Enabled && item.Value) {
                    arrRevisitTypes.push(item.Id);
                }
            });

            if (arrRevisitTypes.length) {
                request.RevisitTypes = arrRevisitTypes;
            }
        }

        return request;
    }
}
