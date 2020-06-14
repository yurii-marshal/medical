import { PatientsState, PatientsAddress } from './patient.interfaces';

export function normalizePatientsData(patientsData: any): PatientsState {

    const patientsState: PatientsState = {
        patients: {
            byId: {},
            allIds: [],
        },
    };

    const transformAddress = (address) => {
        if (address) {
            const addrObj: PatientsAddress = {};

            Object.keys(address).map((key) => {
                addrObj[`${[key[0].toLowerCase() + key.slice(1)]}`] = address[key];
            });
            return addrObj;
        } else {
            return address;
        }
    };

    patientsState.patients.count = patientsData.Count;

    patientsData.Items.forEach((item) => {
        patientsState.patients.allIds.push(item.Id.toString());
        patientsState.patients.byId[item.Id.toString()] = {
            id: item.Id.toString(),
            displayId: item.DisplayId.toString(),
            name: `${item.Name.First} ${item.Name.Middle ? item.Name.Middle : ''} ${item.Name.Last}`,
            dob: item.DateOfBirthday,
            address: transformAddress(item.Address),
            // phones: item.Phones.length > 1 ? item.Phones.join(', ') : (item.Phones[0] || ''),
            phones: item.Phones,
            statusId: item.Status.Id.toString(),
            statusName: item.Status.Text,
            locationName: item.LocationName,
            locationNpi: item.LocationNpi,
            tags: item.Tags.map((tag) => {
                return {
                    id: tag.Id.toString(),
                    name: tag.Name.toString(),
                };
            }),
        };
    });

    return patientsState;
}
