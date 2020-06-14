import { Component, OnInit } from '@angular/core';
import { markFormGroupTouched } from '@shared/helpers/touch-error-fields';
import {
    OrganizationContactsTypes,
    SourceContactTypes,
} from '@shared/modules/patient-contacts/patient-contacts.enum';
import { Contact } from '@shared/modules/patient-contacts/patient-contacts.interfaces';


@Component({
    selector: 'app-demo-patient-contacts',
    templateUrl: './demo-patient-contacts.component.html',
    styleUrls: ['./demo-patient-contacts.component.scss'],
})
export class DemoPatientContactsComponent implements OnInit {
    public demoContacts: Contact[] = [];
    public contactsType = SourceContactTypes.Organization;

    constructor() {
        setTimeout(() => {

            this.demoContacts = [
                {
                    value: '1111111111',
                    type: {
                        id: OrganizationContactsTypes.PHONE_ID,
                        text: 'Home',
                        categoryType: 1,
                    },
                },
                {
                    value: 'https://niko.loc',
                    type: {
                        id: OrganizationContactsTypes.WEBSITE_ID,
                        text: 'Website',
                        categoryType: 1,
                    },
                },
                {
                    value: 'demoemail@mail.ru',
                    type: {
                        id: OrganizationContactsTypes.EMAIL_ID,
                        text: 'Email',
                        categoryType: 1,
                    },
                },
            ];
        }, 1000);
    }

    public onUpdateContact(event) {
        setTimeout(() => {
            markFormGroupTouched(event.form);
        }, 5 * 1000);

        this.demoContacts = event.contacts;

        console.log('this.demoContacts', this.demoContacts);
    }


    ngOnInit() {
    }

}
