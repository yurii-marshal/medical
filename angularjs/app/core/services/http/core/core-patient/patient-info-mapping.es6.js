export function mapPatientInfoData(response) {
    if (!response.data.Location) {
        response.data.Location = {
            Id: null,
            Text: null,
            Npi: null,
            Address: {
                AddressLine: null,
                AddressLine2: null,
                City: null,
                State: null,
                Zip: null,
                FullAddress: null,
                AddressKey: null
            }
        };
    }

    if (!response.data.Organization) {
        response.data.Organization = {
            Id: null,
            Text: null,
            Description: null
        };
    }

    if (!response.data.DeliveryAddress) {
        response.data.DeliveryAddress = {
            FullAddress: null,
            AddressLine: null,
            AddressLine2: null,
            City: null,
            Zip: null,
            State: null
        };
    }

    if (!response.data.Address) {
        response.data.Address = {
            FullAddress: null,
            AddressLine: null,
            AddressLine2: null,
            City: null,
            Zip: null,
            State: null
        };
    }

    return response;
}
