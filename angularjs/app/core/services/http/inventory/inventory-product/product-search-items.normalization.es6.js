import { parseHcpcsCodes } from '../../../../helpers/parse-hcpcs-codes.helper.es6';
import { inventoryProductType } from '../../../../constants/inventory.constants.es6';

export function normalizeSearchItemsData(data) {

    const searchItemsState = {
        items: {
            byHash: {},
            allHashes: []
        },
        components: {
            byHash: {},
            allHashes: []
        }
    };

    searchItemsState.items.count = data.Count;

    data.Items.forEach((item) => {

        const itemHash = `${item.Id.toString()}_${guid()}`;

        searchItemsState.items.byHash[itemHash] = {
            hash: itemHash,
            productId: item.Id.toString(),
            name: item.Name,
            partNumber: item.PartNumber.toString(),
            manufacturer: item.Manufacturer,
            group: item.Group,
            category: item.Category,
            hcpcsCodes: parseHcpcsCodes(item.HcpcsCodes),
            isSerialized: (item.Type && item.Type.Id.toString() === inventoryProductType.Serialized),
            pictureUrl: item.PictureUrl,
            description: item.Description,
            isBundle: item.Bundle,
            isLotted: item.Lotted,
            resupply: item.Resupply,
            isMultiple: (item.Type && item.Type.Id.toString() !== inventoryProductType.Serialized) && !item.Lotted && !item.Bundle,
            archived: item.Archived,
            count: item.Count,
            componentsHashes: (function() {
                if (!item.Bundle) {
                    return null;
                }
                return item.Components && item.Components.length ?
                    item.Components.map((c, i) => `${c.Id.toString()}_${i}`) :
                    [];
            })()
        };

        if (item.Bundle) {
            item.Components.forEach((component) => {

                if (component.Multiple || component.Lotted) {
                    searchItemsState.items.byHash[itemHash].isMultiple = false;
                }

                searchItemsState.components.byHash[`${component.Id.toString()}_${ itemHash }`] = {
                    hash: `${component.Id.toString()}_${ itemHash }`,
                    parentHash: itemHash,
                    id: component.Id.toString(),
                    productId: item.Id.toString(),
                    count: component.Count,
                    name: component.Name,
                    partNumber: component.PartNumber,
                    manufacturer: component.Manufacturer,
                    group: component.Group,
                    description: component.Description,
                    pictureUrl: component.PictureUrl,
                    category: component.Category,
                    hcpcsCodes: parseHcpcsCodes(component.HcpcsCodes),
                    isSerialized: (component.Type && component.Type.Id.toString() === inventoryProductType.Serialized),
                    isLotted: component.Lotted,
                    resupply: component.Resupply,
                    isMultiple: component.Multiple
                };
            });
        }


    });

    searchItemsState.items.allHashes = Object.keys(searchItemsState.items.byHash);
    searchItemsState.components.allHashes = Object.keys(searchItemsState.components.byHash);

    return searchItemsState;
}

/*
// v1/products/${id}

{
  "Count": 0,
  "Items": [
    {
      "Id": "string",
      "Type": {
        "Id": "string",
        "Name": "string",
        "Code": "string"
      },
      "Name": "string",
      "PartNumber": "string",
      "Manufacturer": "string",
      "Group": "string",
      "Category": "string",
      "HcpcsCodes": {
        "Primary": "string",
        "Additional": [
          "string"
        ]
      },
      "PictureUrl": "string",
      "Description": "string",
      "Bundle": true,
      "Lotted": true,
      "Resupply": true,
      "Multiple": true,
      "Components": [
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
      ],
      "Archived": true
    }
  ]
}
*/
