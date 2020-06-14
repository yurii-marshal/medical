import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AddNewContactDirective } from './add-new-contact.directive';
import { PatientContactsComponent } from './patient-contacts.component';
import { ContactsUniqValidatorDirective } from './contacts-uniq-validator.directive';
import { PatientNumberInputModule } from '../phone-input/phone-input.module';

const COMPONENTS = [
    PatientContactsComponent,
    ContactsUniqValidatorDirective,
    AddNewContactDirective,
];

const MODULES = [
    SharedModule,
    PatientNumberInputModule,
];

@NgModule({
    imports: [...MODULES],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
})

export class  PatientContactsModule {
}
