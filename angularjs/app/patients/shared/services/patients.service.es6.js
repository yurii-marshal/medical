export default class patientsService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        infinityTableFilterService,
        coreOrderService
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.coreOrderService = coreOrderService;
    }

    _getStatusClass(orderStatusId) {
        switch (orderStatusId.toString()) {
            case '1': // hold
                return 'orange';
            case '2': // ready
                return 'green';
            case '3': // incomplete
                return 'blue';
            case '4': // cancelled
                return 'grey';
            case '5': // complete
                return 'dark-gray';
            default:
                return '';
        }
    }

    getPatients(pageIndex, pageSize, sortExpression, params) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        params = this.infinityTableFilterService.getFilters(params);

        if (params['filter.displayId']) {
            params['filter.displayId'] = params['filter.displayId'].DisplayId;
        }

        if (params['filter.dateOfBirthday']) {
            params['filter.dateOfBirthday'] = moment(params['filter.dateOfBirthday'], 'MM/DD/YYYY').format('YYYY-MM-DD');
        }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients`, { params });
    }

    getOrderedItemsByOrderId(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${ orderId }/ordered/items`);
    }

    getProductBundles(productId) {
        const params = { Ids: [productId] };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params })
            .then((response) => response.data);
    }

    getOrdersDictionary(patientId, pageIndex = 0, pageSize = 100, params) {
        params = params || {};
        angular.extend(params, {
            patientId,
            pageIndex,
            pageSize
        });

        return this.coreOrderService.getOrdersDictionary(params);
    }

    getOrders(patientId, pageIndex = 0, pageSize = 100, params) {
        params = params || {};
        angular.extend(params, {
            patientId,
            pageIndex,
            pageSize
        });
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders`, { params })
            .then((response) => {
                response.data.Items.map((item) => item.StatusClass = this._getStatusClass(item.State.Status.Id));
                return response;
            });
    }

    getDevicesForRegistration(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/sensors/possible-registrations`)

            .then((response) => {
                // bc API returns list of devices without RegistrationType
                let returnList = [];

                angular.forEach(response.data.Items, (item) => {
                    if (Number(item.RegistrationType.Id) !== 0) {
                        returnList.push(item);
                    }
                });
                return returnList;
            });
    }

    registerDevice(regModel, patientId) {

        let postModel = {
            DeviceId: regModel.device.Id,
            StartDate: regModel.monitoringStartDate
        };

        if (regModel.device.ComponentId) {
            postModel.ComponentId = regModel.device.ComponentId;
        }

        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/sensors/register`, postModel);
    }

    getLocations(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization/locations/dictionary`, { params });
    }

    getDiagnosis(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/diagnosis-codes/dictionary`, { cache: true, params });
    }

    getMedications(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/medications/dictionary`, { params });
    }
}
