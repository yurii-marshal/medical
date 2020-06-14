export interface GetPatientsParams {
    'filter.all'?: boolean;
    'filter.fullName'?: string;
    pageIndex?: number;
    pageSize?: number;
    sortExpression?: string;
}

interface Tag {
    id: string;
    name: string;
}

export interface PatientsAddress {
    addressKey?: string;
    addressLine?: string;
    city?: string;
    fullAddress?: string;
    state?: string;
    zip?: string;
}

export interface Patient {
    id: string;
    displayId: string;
    name: string;
    dob: string;
    address: PatientsAddress;
    phones: string;
    statusId: string;
    statusName: string;
    locationName: string;
    locationNpi: string;
    tags: Tag[];
}

export interface PatientsState {
    patients: {
        count?: number;
        byId: {
            [id: string]: Patient,
        };
        allIds: string[];
    };
}

export interface PatientStatus {
    Id: number;
    Text: string;
    Description: string;
}

export interface InactivityReason {
    Id: number;
    Text: string;
    Description: string;
}

export function initPatientsState(): PatientsState {
    return {
        patients: {
            byId: {},
            allIds: [],
        },
    };
}
