import { normalizeSearchEquipmentData } from './search-equipment.normalization.es6';

export default class InventoryEquipmentHttpService {
    constructor(
        $http,
        WEB_API_INVENTORY_SERVICE_URI
               ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    getProductsByIds(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/products`, { params });
    }

    getEquipmentComponentsById(componentId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/components/${ componentId }`);
    }

    searchEquipment(model) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/search`, model)
            .then((response) => {
                return normalizeSearchEquipmentData(response);
            });
    }
}
