import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';

import { DictionariesEndpointsService } from '../../endpoints/core/dictionaries/dictionaries.endpoints';
import { ContactType } from '../../endpoints/core/dictionaries/contact-types.interface';

import {
    Contact,
    ContactsEvent,
    ContactsTypesIds,
} from './patient-contacts.interfaces';

import {
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
    OrganizationContactsTypes,
    PatientContactsTypes,
    SourceContactTypes,
} from './patient-contacts.enum';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    skip,
} from 'rxjs/operators';
import { getCotactsTypesIds } from './helper';
import { Observable, Subscription } from 'rxjs';
import { phoneNumberValidator } from '../phone-input/phone-validator.directive';

/**
 * 'Patient Contacts' Component
 * Location:
 * -------------------
 * **PatientContactsModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/patient-contacts</example-url>
 *
 * @example
 * <app-patient-contacts
 *                  [contacts]="demoContacts"
 *                  [sourceContacts]="contactsType"
 *                  (contactsUpdated)="onUpdateContact($event)">
 * </app-patient-contacts>
 */
@Component({
    selector: 'app-patient-contacts',
    templateUrl: './patient-contacts.component.html',
    styleUrls: ['./patient-contacts.scss'],
})

export class PatientContactsComponent implements OnChanges, OnInit, OnDestroy {
    /** Received array of contacts object for generate data row */
    @Input() contacts: Contact[] = [];
    @Input() possibleSelect: Array<(PatientContactsTypes | OrganizationContactsTypes)>;
    /** Change to `true` if need to add new type of contacts  */
    @Input() disableUniqType = false;
    @Input() hideAddBtn = false;
    /** Input for contacts type */
    @Input() sourceContacts: SourceContactTypes;

    @Output() contactsUpdated = new EventEmitter<ContactsEvent>();

    formChangesSubscription: Subscription;
    contactsFormGroup: FormGroup;
    contactsTypes: ContactType[] = [];
    contactsTypesIds: ContactsTypesIds;

    constructor(
        private dictionariesEndpointsService: DictionariesEndpointsService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
    ) {

        this.iconRegistry.addSvgIcon(
            'trash',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/trash.svg'));

        this.contactsFormGroup = this.fb.group({
            contacts: this.fb.array([]),
        });

        this.setOrUpdateFormSubscription();
    }

    ngOnInit() {
        this.contactsTypesIds = getCotactsTypesIds(this.sourceContacts);

        this.getContactsTypesSource(this.sourceContacts)
            .pipe(
                map((response: ContactType[]) => {
                    if (!this.possibleSelect) {
                        return response;
                    }

                    return response.filter((type: ContactType) => {
                        return !(this.possibleSelect.indexOf(type.id) === -1);
                    });
                }),
            )
            .subscribe((response: ContactType[]) => {
                this.contactsTypes = response;
            });
    }

    ngOnDestroy() {
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }
    }

    ngOnChanges(changesData) {

        if (changesData.contacts) {

            this.contactsFormGroup = this.fb.group({
                contacts: this.fb.array([]),
            });

            changesData.contacts.currentValue.forEach((contact: Contact) => {
                const contactControl = this.fb.group({
                    phone: [
                        contact.type.id !== this.contactsTypesIds.EMAIL_ID &&
                        contact.type.id !== this.contactsTypesIds.WEBSITE_ID ?
                            contact.value : '',
                    ],
                    email: [ contact.type.id === this.contactsTypesIds.EMAIL_ID ? contact.value : '' ],
                    website: [ contact.type.id === this.contactsTypesIds.WEBSITE_ID ? contact.value : '' ],
                    type: [ contact.type.id ],
                    phoneExtension: [ contact.phoneExtension ],
                });

                this.determineValidators(contactControl);

                this.contactsForm.push(contactControl);
            });

            this.setOrUpdateFormSubscription();
        }
    }

    get contactsForm(): FormArray {
        return this.contactsFormGroup.get('contacts') as FormArray;
    }

    setOrUpdateFormSubscription() {
        if (this.formChangesSubscription) {
            this.formChangesSubscription.unsubscribe();
        }

        this.formChangesSubscription = this.contactsForm.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                skip(1),
            )
            .subscribe(() => {

                // That solution need for save array reference. If user will want to set Input contacts -> Output contacts.
                while (this.contacts.length > 0) {
                    this.contacts.pop();
                }

                this.contactsForm.controls.forEach((formGroup: FormGroup) => {
                    let value = '';

                    if (formGroup.controls.type.value === this.contactsTypesIds.EMAIL_ID) {
                        value = formGroup.controls.email.value;
                    } else if (formGroup.controls.type.value === this.contactsTypesIds.WEBSITE_ID) {
                        value = formGroup.controls.website.value;
                    } else {
                        value = formGroup.controls.phone.value;
                    }

                    this.contacts.push({
                        type: this.contactsTypes.find((type) => type.id === formGroup.controls.type.value),
                        value,
                        phoneExtension: formGroup.controls.phoneExtension.value,
                    });
                });

                this.contactsUpdated.emit({
                    contacts: this.contacts,
                    form: this.contactsFormGroup,
                });
            });
    }

    getContactsTypesSource(type: SourceContactTypes): Observable<ContactType[]> {
        let source: Observable<ContactType[]>;

        switch (type) {
            case(SourceContactTypes.Organization):
                source = this.dictionariesEndpointsService.getOrganizationContactTypes();
                break;
            case(SourceContactTypes.Patient):
                source = this.dictionariesEndpointsService.getPatientContactTypes();
                break;
            default:
                source = this.dictionariesEndpointsService.getPatientContactTypes();
                break;
        }

        return source;
    }

    onAddContact() {

        if (!this.getContactsTypes().length) {
            return ;
        }

        const contactControl = this.fb.group({
            phone: [''],
            email: [''],
            website: [''],
            type: [this.getContactsTypes()[0].id],
            phoneExtension: [],
        });

        this.determineValidators(contactControl);

        this.contactsForm.push(contactControl);
    }

    isEmailType(typeId: number) {
        return this.contactsTypesIds.EMAIL_ID === typeId;
    }

    isWebsiteType(typeId: number) {
        return this.contactsTypesIds.WEBSITE_ID === typeId;
    }

    // As all types is phone number aside from EMAIL_ID and WEBSITE_ID
    isPhoneNumberType(typeId: number) {
        return this.contactsTypesIds.EMAIL_ID !== typeId && this.contactsTypesIds.WEBSITE_ID !== typeId;
    }

    // Only work phone has ext number
    isPhoneNumberWithExtType(typeId: number) {
        return this.contactsTypesIds.WORK_ID === typeId;
    }

    getContactsTypes(excludeTypeId?: number): ContactType[] {
        if (this.disableUniqType) {
            return this.contactsTypes;
        }

        return this.contactsTypes.filter((contactType) => {
            return !this.contactsForm.value.find((contactFormValue) => {
                return contactFormValue.type === contactType.id && excludeTypeId !== contactType.id;
            });
        });
    }

    onChangeType(formControl) {
        this.determineValidators(formControl);
    }

    determineValidators(formControl) {
        formControl.controls.phone.clearValidators();
        formControl.controls.website.clearValidators();
        formControl.controls.email.clearValidators();

        if (this.isEmailType(formControl.value.type)) {
            formControl.controls.email.setValidators([Validators.required, Validators.email]);
        } else if (this.isWebsiteType(formControl.value.type)) {
            formControl.controls.website.setValidators([
                Validators.required,
                Validators.pattern('https?:\\/\\/(?:www\\.|(?!www))[^\\s\\.]+\\.[^\\s]{2,}|www\\.[^\\s]+\\.[^\\s]{2,}'),
            ]);
        } else if (this.isPhoneNumberType(formControl.value.type)) {
            formControl.controls.phone.setValidators([Validators.required, phoneNumberValidator()]);
        }

        formControl.controls.phone.updateValueAndValidity();
        formControl.controls.website.updateValueAndValidity();
        formControl.controls.email.updateValueAndValidity();
    }

    onDeleteContacts(i) {
        this.contactsForm.removeAt(i);
    }

}
