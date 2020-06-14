import { parseHcpcsCodes } from '../../../../helpers/parse-hcpcs-codes.helper.es6';
import { inventoryProductType } from '../../../../constants/inventory.constants.es6';

export function normalizeBundleComponentsData(data, parentHash) {

    const bundleComponentsState = {
        components: {
            byHash: {},
            allHashes: []
        }
    };

    data.forEach((item) => {
        const componentHash = `${item.Id.toString()}_${guid()}`;

        bundleComponentsState.components.byHash[componentHash] = {
            hash: componentHash,
            id: item.Id.toString(),
            productId: item.Id.toString(),
            parentHash,
            count: item.Count,
            name: item.Name,
            partNumber: item.PartNumber,
            manufacturer: item.Manufacturer,
            group: item.Group,
            description: item.Description,
            pictureUrl: item.PictureUrl,
            category: item.Category,
            hcpcsCodes: parseHcpcsCodes(item.HcpcsCodes),
            isSerialized: item.Type && item.Type.Id.toString() === inventoryProductType.Serialized,
            isLotted: item.Lotted,
            isResupply: item.Resupply,
            isMultiple: (item.Type && item.Type.Id.toString() !== inventoryProductType.Serialized) && !item.Lotted
        };
    });

    bundleComponentsState.components.allHashes = Object.keys(bundleComponentsState.components.byHash);

    return bundleComponentsState;
}

/*
// v1/products/${productId}/components
[
  {
    "Id": "string",
    "Count": 0,
    "Type": {
      "Id": "string",
      "Name": "string",
      "Code": "string"
    },
    "Name": "string",
    "PartNumber": "string",
    "Manufacturer": "string",
    "Group": "string",
    "Description": "string",
    "PictureUrl": "string",
    "Category": "string",
    "HcpcsCodes": {
      "Primary": "string",
      "Additional": [
        "string"
      ]
    },
    "Lotted": true,
    "Resupply": true,
    "Multiple": true
  }
]
*/
