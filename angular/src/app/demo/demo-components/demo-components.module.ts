// Modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { DemoComponentsRoutingModule } from './demo-components.route';

import {
    EmailInputModule,
    DateTimePickerModule,
    NoContentModule,
    StateAutocompleteModule,
    PatientContactsModule,
    PatientNumberInputModule,
    ZipAutocompleteModule,
    SubTabsModule,
    ToolbarModule,
    AttrsTagsModule,
    GridModule,
    SignatureModule,
    ListToPopoverModule,
    LoadingModule,
    AssignPdfFieldModule,
    PdfFormReviewModule,
    PatientShortInfoSidebarModule,
    VAccordionModule,
} from '@shared/modules/index';

// Components
import { DemoComponentsComponent } from './demo-components.component';
import { DemoDatetimepickerComponent } from './datetimepicker/demo-datetimepicker.component';
import { DemoAttrsTagsComponent } from './attrs-tags/demo-attrs-tags.component';
import { DemoEmailInputComponent } from './email-input/demo-email-input.component';
import { DemoNoContentComponent } from './no-content/demo-no-content.component';
import { DemoPatientContactsComponent } from './patient-contacts/demo-patient-contacts.component';
import { DemoPhoneInputComponent } from './phone-input/demo-phone-input.component';
import { DemoStateAutocompleteComponent } from './state-autocomplete/demo-state-autocomplete.component';
import { DemoSubtabsComponent } from './subtabs/demo-subtabs.component';
import { DemoZipAutocompleteComponent } from './zip-autocomplete/demo-zip-autocomplete.component';
import { DemoToolbarComponent } from './toolbar/demo-toolbar.component';
import { DemoGridComponent } from './grid/demo-grid.component';
import { DemoListToPopoverComponent } from './list-to-popover/demo-list-to-popover.component';
import { DemoSignatureComponent } from './signature/demo-signature.component';
import { DemoInfiniteScrollComponent } from './directives//infinite-scroll/demo-infinite-scroll.component';
import { DemoClickOutsideComponent } from './directives/click-outside/demo-click-outside.component';
import { DemoClearOnClickComponent } from './directives/clear-on-click/demo-clear-on-click.component';
import { DemoPopoverComponent } from './directives/popover/demo-popover.component';
import { DemoLoadingComponent } from './loading/demo-loading.component';
import { DemoAdvancedFiltersComponent } from './advanced-filters/advanced-filters.component';
import { DemoAdvancedFiltersDialogComponent } from './advanced-filters/advanced-filters-dialog/advanced-filters-dialog.component';
import { DemoDynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormModule } from '@shared/modules/dynamic-form/dynamic-form.module';
import { DemoErrorMessagesComponent } from '@app/demo/demo-components/directives/error-messages/demo-error-messages.component';
import { DemoAssignPdfFieldComponent } from '@app/demo/demo-components/assign-pdf-field/demo-assign-pdf-field.component';
import { DemoPdfFormReviewComponent } from '@app/demo/demo-components/pdf-form-review/demo-pdf-form-review.component';
import { DemoPatientSidebarComponent } from '@app/demo/demo-components/patient-sidebar/demo-patient-sidebar.component';
import { PatientService } from '@app/patients/modules/patient/services/patient.service';
import { SidebarModule } from '@app/core/sidebar/sidebar.module';
import { ServicesModule } from '@app/core/services.module';
import { DemoVAccordionComponent } from './v-accordion/demo-v-accordion.component';

const COMPONENTS = [
    DemoComponentsComponent,
    DemoDatetimepickerComponent,
    DemoAttrsTagsComponent,
    DemoEmailInputComponent,
    DemoNoContentComponent,
    DemoPatientContactsComponent,
    DemoPhoneInputComponent,
    DemoStateAutocompleteComponent,
    DemoToolbarComponent,
    DemoSubtabsComponent,
    DemoZipAutocompleteComponent,
    DemoGridComponent,
    DemoListToPopoverComponent,
    DemoAdvancedFiltersComponent,
    DemoAdvancedFiltersDialogComponent,
    DemoDynamicFormComponent,
    DemoListToPopoverComponent,
    DemoInfiniteScrollComponent,
    DemoClickOutsideComponent,
    DemoSignatureComponent,
    DemoClearOnClickComponent,
    DemoPopoverComponent,
    DemoLoadingComponent,
    DemoErrorMessagesComponent,
    DemoPdfFormReviewComponent,
    DemoAssignPdfFieldComponent,
    DemoPatientSidebarComponent,
    DemoVAccordionComponent,
];

// Const solution bug: can't add modules with forRoot method
const MODULES = [
    SharedModule,
    FormsModule,
    DemoComponentsRoutingModule,
    EmailInputModule,
    AttrsTagsModule,
    NoContentModule,
    PatientNumberInputModule,
    PatientContactsModule,
    StateAutocompleteModule,
    ZipAutocompleteModule,
    SubTabsModule,
    ToolbarModule,
    GridModule,
    DateTimePickerModule,
    ListToPopoverModule,
    SignatureModule,
    LoadingModule,
    DynamicFormModule,
    PdfFormReviewModule,
    PatientShortInfoSidebarModule,
    SidebarModule,
    AssignPdfFieldModule,
    VAccordionModule,
];

@NgModule({
    // Using forRoot static method for swap service with http request to service with mocks data
    imports: [...MODULES, ServicesModule.forDemo()],
    declarations: [...COMPONENTS],
    exports: [...MODULES, ...COMPONENTS],
    entryComponents: [DemoAdvancedFiltersDialogComponent],
    providers: [PatientService],
})

export class DemoComponentsModule { }
