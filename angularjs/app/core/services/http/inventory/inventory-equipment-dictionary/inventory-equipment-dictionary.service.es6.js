export default class InventoryEquipmentDictionaryHttpService {
    constructor(
        $http,
        WEB_API_INVENTORY_SERVICE_URI
       ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
    }

    getLocationsTypeDictionary(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations/types/dictionary`, { params })
            .then((response) => response.data.Items);
    }
}

/*
* {
  "Count": 0,
  "Items": [
    {
      "Id": "string",
      "Name": "string",
      "Description": "string"
    }
  ]
}
*/
