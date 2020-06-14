import { parseHcpcsCodes } from '../../../../helpers/parse-hcpcs-codes.helper.es6';
import { inventoryProductType } from '../../../../constants/inventory.constants.es6';

export function normalizeSearchEquipmentData(response) {
    const searchEquipmentState = {
        items: {
            byId: {},
            allIds: [],
            count: null
        },

        components: {
            byId: {},
            allIds: []
        },

        productTypes: {
            byId: {},
            allIds: []
        },

        productStatuses: {
            byId: {},
            allIds: []
        },

        status: null,
        nextKey: null,
        product: null
    };

    if (response.data.Items) {
        response.data.Items.forEach((item) => {
            searchEquipmentState.items.byId[item.Id] = {
                id: item.Id.toString(),
                productId: item.ProductId.toString(),
                name: item.Name,
                locationId: item.LocationId.toString(),
                locationUniqueId: item.LocationUniqueId.toString(),
                location: item.Location,
                isSerialized: (item.Type && item.Type.Id.toString() === inventoryProductType.Serialized),
                isLotted: !!item.LotNumber,
                serialNumber: item.SerialNumber,
                lotNumber: item.LotNumber,
                statusId: item.Status.Id.toString(),
                inactiveReason: item.InactiveReason,
                refurbished: item.Refurbished,
                count: item.Count,
                manufacturer: item.Manufacturer,
                partNumber: item.PartNumber,
                hcpcsCodes: item.HcpcsCodes ? parseHcpcsCodes(item.HcpcsCodes) : null,
                pictureUrl: item.PictureUrl,
                componentsIds: item.Components ? item.Components.map((component) => component.ComponentId.toString()) : null
            };

            searchEquipmentState.productStatuses.byId[item.Status.Id.toString()] = {
                id: item.Status.Id.toString(),
                name: item.Status.Name,
                code: item.Status.Code
            };

            searchEquipmentState.productTypes.byId[item.Type.Id.toString()] = {
                id: item.Type.Id.toString(),
                name: item.Type.Name,
                code: item.Type.Code
            };

            if (item.Components) {
                item.Components.forEach((component) => {
                    searchEquipmentState.components.byId[component.ComponentId.toString()] = {
                        componentId: component.ComponentId.toString(),
                        name: component.Name,
                        productId: component.ProductId.toString(),
                        isSerialized: (component.Type && component.Type.Id.toString() === inventoryProductType.Serialized),
                        isLotted: !!component.LotNumber,
                        serialNumber: component.SerialNumber,
                        lotNumber: component.LotNumber,
                        manufacturer: component.Manufacturer,
                        partNumber: component.PartNumber,
                        hcpcsCodes: component.HcpcsCodes ? parseHcpcsCodes(component.HcpcsCodes) : null,
                        pictureUrl: component.PictureUrl,
                        count: component.Count
                    };
                });
            }

        });
    }

    searchEquipmentState.status = {
        id: response.data.Status.Id.toString(),
        name: response.data.Status.Name,
        code: response.data.Status.Code
    };

    if (response.data.Product) {
        searchEquipmentState.product = {
            id: response.data.Product.Id.toString(),
            name: response.data.Product.Name,
            partNumber: response.data.Product.PartNumber,
            isSerialized: (response.data.Product.Type && response.data.Product.Type.Id.toString() === inventoryProductType.Serialized),
            isLotted: response.data.Product.Lotted,
            isMultiple: response.data.Product.Multiple,
            needDeviceNumber: response.data.Product.NeedDeviceNumber,
            componentsIds: response.data.Product.Components ? response.data.Product.Components.map((component) => component.Id.toString()) : null,
            purchasePrice: response.data.Product.PurchasePrice,
            statusId: response.data.Product.Status && response.data.Product.Status.Id.toString()
        };

        if (response.data.Product.Components) {
            response.data.Product.Components.forEach((component) => {
                searchEquipmentState.components.byId[component.Id.toString()] = {
                    componentId: component.Id.toString(),
                    name: component.Name,
                    count: component.Count,
                    isSerialized: (component.Type && component.Type.Id.toString() === inventoryProductType.Serialized),
                    isLotted: component.Lotted,
                    needDeviceNumber: component.NeedDeviceNumber
                };
            });
        }
    }

    if (response.data.NextKey) {
        searchEquipmentState.nextKey = {
            productId: response.data.NextKey.ProductId.toString(),
            keyType: {
                id: response.data.NextKey.KeyType.Id.toString(),
                name: response.data.NextKey.KeyType.Name,
                code: response.data.NextKey.KeyType.Code
            }
        };
    }

    searchEquipmentState.items.count = response.data.Count;

    searchEquipmentState.items.allIds = Object.keys(searchEquipmentState.items.byId);
    searchEquipmentState.components.allIds = Object.keys(searchEquipmentState.components.byId);
    searchEquipmentState.productTypes.allIds = Object.keys(searchEquipmentState.productTypes.byId);
    searchEquipmentState.productStatuses.allIds = Object.keys(searchEquipmentState.productStatuses.byId);

    return searchEquipmentState;
}

/*
// v1/equipment/search

{
  "Status": {
    "Id": "string",
    "Name": "string",
    "Code": "string"
  },
  "Items": [
    {
      "Id": "string",
      "ProductId": "string",
      "Type": {
        "Id": "string",
        "Name": "string",
        "Code": "string"
      },
      "Name": "string",
      "LocationId": "string",
      "LocationUniqueId": "string",
      "Location": "string",
      "SerialNumber": "string",
      "LotNumber": "string",
      "Status": {
        "Id": "string",
        "Name": "string",
        "Code": "string"
      },
      "InactiveReason": "string",
      "Refurbished": true,
      "Count": 0,
      "Manufacturer": "string",
      "PartNumber": "string",
      "HcpcsCodes": {
        "Primary": "string",
        "Additional": [
          "string"
        ]
      },
      "PictureUrl": "string",
      "Components": [
        {
          "ComponentId": "string",
          "ProductId": "string",
          "Type": {
            "Id": "string",
            "Name": "string",
            "Code": "string"
          },
          "Name": "string",
          "SerialNumber": "string",
          "LotNumber": "string",
          "Manufacturer": "string",
          "PartNumber": "string",
          "HcpcsCodes": {
            "Primary": "string",
            "Additional": [
              "string"
            ]
          },
          "PictureUrl": "string",
          "Count": 0
        }
      ]
    }
  ],
  "Product": {
    "Id": "string",
    "Name": "string",
    "PartNumber": "string",
    "Type": {
      "Id": "string",
      "Name": "string",
      "Code": "string"
    },
    "Lotted": true,
    "Multiple": true,
    "NeedDeviceNumber": true,
    "Components": [
      {
        "Id": "string",
        "Name": "string",
        "Count": 0,
        "Type": {
          "Id": "string",
          "Name": "string",
          "Code": "string"
        },
        "Lotted": true,
        "NeedDeviceNumber": true
      }
    ],
    "PurchasePrice": 0,
    "Status": {
      "Id": "string",
      "Name": "string",
      "Code": "string"
    }
  },
  "NextKey": {
    "ProductId": "string",
    "KeyType": {
      "Id": "string",
      "Name": "string",
      "Code": "string"
    }
  }
}
*/
