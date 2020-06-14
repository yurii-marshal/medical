import {
    OrganizationContactsTypes,
    PatientContactsTypes,
    SourceContactTypes,
} from './patient-contacts.enum';
import { ContactsTypesIds } from './patient-contacts.interfaces';

export function getCotactsTypesIds(type: SourceContactTypes): ContactsTypesIds {
    let outData: ContactsTypesIds = {};

    switch (type) {
        case SourceContactTypes.Patient:
            outData = {
                HOME_ID: PatientContactsTypes.HOME_ID,
                WORK_ID: PatientContactsTypes.WORK_ID,
                CELL_ID: PatientContactsTypes.CELL_ID,
                OTHER_ID: PatientContactsTypes.OTHER_ID,
                EMAIL_ID: PatientContactsTypes.EMAIL_ID,
                FAX_ID: PatientContactsTypes.FAX_ID,
            };

            break;
        case SourceContactTypes.Organization:
            outData = {
                EMAIL_ID: OrganizationContactsTypes.EMAIL_ID,
                FAX_ID: OrganizationContactsTypes.FAX_ID,
                PHONE_ID: OrganizationContactsTypes.PHONE_ID,
                WEBSITE_ID: OrganizationContactsTypes.WEBSITE_ID,
            };
            break;
        default:
            break;
    }

    return outData;
}
