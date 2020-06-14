export function normalizeEquipmentLocationsData(data) {
    let model = data.data;

    const equipmentLocationsState = {
        byId: {},
        allIds: []
    };

    equipmentLocationsState.count = data.Count;

    if (model && model.Items && model.Items.length) {
        model.Items.forEach((item) => {
            equipmentLocationsState.byId[`${item.Id.toString()}`] = {
                id: item.Id.toString(),
                name: item.Name,
                displayName: `${item.Name} ${item.Description ? (', ' + item.Description) : ''}`,
                type: item.Type ? item.Type.Id.toString() : null,
                uniqueId: item.UniqueId.toString()
            };
        });

        equipmentLocationsState.allIds = Object.keys(equipmentLocationsState.byId);
    }

    return equipmentLocationsState;
}

/*
v1/equipment/locations

{
  "Count": 0,
  "Items": [
    {
      "Id": "string",
      "Name": "string",
      "Type": {
        "Id": "string",
        "Name": "string",
        "Description": "string"
      },
      "UniqueId": "string"
    }
  ]
}
*/
