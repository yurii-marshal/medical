export function normalizeOrderTrackingItemData(data) {

    const orderTrackingItemState = {
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

    const itemHash = `${data.Id.toString()}_${guid()}`;

    orderTrackingItemState.items.byHash[itemHash] = {
        hash: itemHash,
        id: data.Id.toString(),
        deviceId: data.DeviceId ? data.DeviceId.toString() : null,
        productId: data.ProductId.toString(),
        name: data.Name,
        partNumber: data.PartNumber.toString(),
        manufacturer: data.Manufacturer,
        hcpcsCodes: data.HcpcsCodes,
        isBundle: data.Bundle,
        pictureUrl: data.PictureUrl,
        serialNumber: data.SerialNumber || null,
        isSerialized: data.Serialized,
        lotNumber: data.LotNumber,
        isLotted: data.Lotted,
        isMultiple: !data.Serialized && !data.Lotted,
        trackingNumber: data.TrackingNumber || null,
        expectedDate: data.ExpectedDate || '',
        shipDate: data.ShippedDate || '',
        deliveryDate: data.DeliveryDate || '',
        notes: data.Notes,
        count: data.Count,
        countInOrder: data.Count,
        deliveryCompany: data.DeliveryCompany && data.DeliveryCompany.Id ?
                data.DeliveryCompany.Id.toString() :
                null,
        status: data.Status.Id.toString(),
        componentsHashes: (function() {
            if (!data.Bundle) {
                return null;
            }
            return data.Components && data.Components.length ?
                    data.Components.map((c, index) => {
                        if (c.ProductId) {
                            return `${c.ProductId.toString()}_${index}`;
                        }
                    }) :
                    [];
        })()
    };

    orderTrackingItemState.items.allHashes.push(itemHash);

    return orderTrackingItemState;
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
