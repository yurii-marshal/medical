export default class InventoryLocationsHttpService {
    constructor($http,
                WEB_API_INVENTORY_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    getEquipmentLocations(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations`, { params });
    }
}
