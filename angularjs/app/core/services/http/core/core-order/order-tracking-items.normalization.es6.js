export function normalizeOrderTrackingItemsData(data) {
    const orderTrackingItemsState = {
        items: {
            byHash: {},
            allHashes: []
        },

        // devices in status Pending Components don't return from back
        // so we map components in separate request
        components: {
            byHash: {},
            allHashes: []
        }
    };

    orderTrackingItemsState.items.count = data.Count;

    data.Items.forEach((item) => {
        const itemHash = `${item.Id.toString()}_${guid()}`;

        orderTrackingItemsState.items.byHash[itemHash] = {
            hash: itemHash,
            id: item.Id.toString(),
            deviceId: item.DeviceId ? item.DeviceId.toString() : null,
            productId: item.ProductId.toString(),
            name: item.Name,
            partNumber: item.PartNumber.toString(),
            manufacturer: item.Manufacturer,
            hcpcsCodes: item.HcpcsCodes,
            isBundle: item.Bundle,
            pictureUrl: item.PictureUrl,
            serialNumber: item.SerialNumber || null,
            isSerialized: item.Serialized,
            lotNumber: item.LotNumber,
            isLotted: item.Lotted,
            isMultiple: !item.Serialized && !item.Lotted,
            trackingNumber: item.TrackingNumber || null,
            expectedDate: item.ExpectedDate || '',
            shipDate: item.ShippedDate || '',
            deliveryDate: item.DeliveryDate || '',
            notes: item.Notes,
            count: item.Count,
            countInOrder: item.Count,
            deliveryCompany: item.DeliveryCompany && item.DeliveryCompany.Id ?
                item.DeliveryCompany.Id.toString() :
                null,
            status: item.Status.Id.toString(),
            componentsHashes: (function() {
                if (!item.Bundle) {
                    return null;
                }
                return item.Components && item.Components.length ?
                    item.Components.map((c, index) => {
                        if (c.ProductId) {
                            return `${c.ProductId.toString()}_${index}`;
                        }
                    }) :
                    [];
            })()
        };
    });

    orderTrackingItemsState.items.allHashes = Object.keys(orderTrackingItemsState.items.byHash);

    return orderTrackingItemsState;
}

/*
{
  "Count": 0,
  "Items": [
    {
      "Id": "string",
      "DeviceId": "string",
      "ProductId": "string",
      "Name": "string",
      "PartNumber": "string",
      "Manufacturer": "string",
      "HcpcsCodes": [
        "string"
      ],
      "Bundle": true,
      "Components": [
        {
          "DeviceId": "string",
          "ProductId": "string",
          "SerialNumber": "string",
          "LotNumber": "string"
        }
      ],
      "PictureUrl": "string",
      "SerialNumber": "string",
      "Lotted": true,
      "LotNumber": "string",
      "Serialized": true,
      "Multiple": true,
      "DeliveryCompany": {
        "Id": "string",
        "Text": "string"
      },
      "TrackingNumber": "string",
      "Count": 0,
      "Status": {
        "Id": "string",
        "Text": "string"
      },
      "ExpectedDate": "2018-07-26T12:02:54.184Z",
      "ShippedDate": "2018-07-26T12:02:54.184Z",
      "DeliveryDate": "2018-07-26T12:02:54.184Z",
      "EventId": "string",
      "Notes": "string"
    }
  ]
}
*/
