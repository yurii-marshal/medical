import { transformAddress } from '../../../core/helpers/transform-address.helper.es6';

export default class patientService {
    constructor($http, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI, WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.transformAddress = (data) => transformAddress(data);
    }

    getBillingProviderInfo(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/billing-provider`);
    }

    getBillingProviderById(providerId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${providerId}`);
    }

    getCreditCardOptions() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payments/credit-card/options`);
    }

    getActiveOrders(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/active-orders`);
    }

    getPatientPayersByName(payerName, patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/payers/dictionary`, { params: { payerName } });
    }

    getPatientCurrentItems(patientId, type, params) {

        if (params.DeliveryDateTo) {
            params.DeliveryDateTo = moment(params.DeliveryDateTo).hour(23).format();
        }

        if (params.DeliveryDateFrom) {
            params.DeliveryDateFrom = moment(params.DeliveryDateFrom).format();
        }

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/equipments/${type}`, { params })
            .then((response) => {
                angular.forEach(response.data, (item) => this._mapEquipmentItem(item));
                return response;
            });
    }

    getPatientHistoryItems(patientId, params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/equipments/history`, { params })
            .then((response) => {
                angular.forEach(response.data, (item) => this._mapEquipmentItem(item));
                return response;
            });
    }

    getPatientItemsNotes(patientId, params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/equipment/notes`, { params });
    }

    _mapEquipmentItem(item) {
        let noImage = 'assets/images/no-image-equipment.svg';

        if (item.PictureUrl) {
            item.image = this.WEB_API_INVENTORY_SERVICE_URI + item.PictureUrl;
        } else {
            item.image = noImage;
        }
    }

}
