export function normalizeGetProductsByIdsData(data) {

    // TODO finish it, because this is for QuickShip only
    const inventoryProductsState = {
        products: {
            byId: {},
            allIds: []
        }
    };

    data.Items.forEach((item) => {
        inventoryProductsState.products.byId[`${item.Id.toString()}`] = {
            id: item.Id.toString(),
            count: item.Count,
            storeIds: item.StoreIds
        };
    });

    inventoryProductsState.products.allIds = Object.keys(inventoryProductsState.products.byId);

    return inventoryProductsState;
}

/*
// v1/equipment/products

{
  "Items": [
    {
      "Id": "string",
      "Name": "string",
      "PartNumber": "string",
      "Manufacturer": "string",
      "PrimaryHcpcsCodes": [
        "string"
      ],
      "AdditionalHcpcsCodes": [
        "string"
      ],
      "Status": {
        "Id": "string",
        "Name": "string",
        "Code": "string"
      },
      "Type": {
        "Id": "string",
        "Name": "string",
        "Code": "string"
      },
      "Count": 0
    }
  ]
}

*/
