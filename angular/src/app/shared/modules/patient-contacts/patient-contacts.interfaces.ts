import { ContactType } from '../../endpoints/core/dictionaries/contact-types.interface';
import { FormGroup } from '@angular/forms';
import {
    OrganizationContactsTypes,
    PatientContactsTypes,
} from './patient-contacts.enum';

export interface Contact {
    value: string;
    phoneExtension?: string;
    isNew?: boolean;
    type: ContactType;
}

export interface ContactsEvent {
    contacts: Contact[];
    form: FormGroup;
}

export interface ContactsTypesIds {
    [key: string]: OrganizationContactsTypes | PatientContactsTypes;
}
