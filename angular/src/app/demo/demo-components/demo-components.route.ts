import { DemoComponentsComponent } from './demo-components.component';
import {
    RouterModule,
    Routes,
} from '@angular/router';
import { NgModule } from '@angular/core';
import { DemoDatetimepickerComponent } from './datetimepicker/demo-datetimepicker.component';
import { DemoAttrsTagsComponent } from './attrs-tags/demo-attrs-tags.component';
import { DemoEmailInputComponent } from './email-input/demo-email-input.component';
import { DemoNoContentComponent } from './no-content/demo-no-content.component';
import { DemoPatientContactsComponent } from './patient-contacts/demo-patient-contacts.component';
import { DemoPhoneInputComponent } from './phone-input/demo-phone-input.component';
import { DemoStateAutocompleteComponent } from './state-autocomplete/demo-state-autocomplete.component';
import { DemoSubtabsComponent } from './subtabs/demo-subtabs.component';
import { DemoToolbarComponent } from './toolbar/demo-toolbar.component';
import { DemoZipAutocompleteComponent } from './zip-autocomplete/demo-zip-autocomplete.component';
import { DemoGridComponent } from './grid/demo-grid.component';
import { DemoListToPopoverComponent } from './list-to-popover/demo-list-to-popover.component';
import { DemoAdvancedFiltersComponent } from './advanced-filters/advanced-filters.component';
import { DemoDynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DemoSignatureComponent } from './signature/demo-signature.component';
import { DemoInfiniteScrollComponent } from './directives/infinite-scroll/demo-infinite-scroll.component';
import { DemoClickOutsideComponent } from './directives/click-outside/demo-click-outside.component';
import { DemoClearOnClickComponent } from './directives/clear-on-click/demo-clear-on-click.component';
import { DemoPopoverComponent } from './directives/popover/demo-popover.component';
import { DemoLoadingComponent } from './loading/demo-loading.component';
import { DemoErrorMessagesComponent } from '@app/demo/demo-components/directives/error-messages/demo-error-messages.component';
import { DemoPdfFormReviewComponent } from '@app/demo/demo-components/pdf-form-review/demo-pdf-form-review.component';
import { DemoAssignPdfFieldComponent } from '@app/demo/demo-components/assign-pdf-field/demo-assign-pdf-field.component';
import { DemoPatientSidebarComponent } from '@app/demo/demo-components/patient-sidebar/demo-patient-sidebar.component';
import { DemoVAccordionComponent } from './v-accordion/demo-v-accordion.component';

const COMPONENTS = [
    { path: 'datetimepicker', component: DemoDatetimepickerComponent },
    { path: 'attrs-tags', component: DemoAttrsTagsComponent },
    { path: 'email-input', component: DemoEmailInputComponent },
    { path: 'no-content', component: DemoNoContentComponent },
    { path: 'patient-contacts', component: DemoPatientContactsComponent },
    { path: 'phone-input', component: DemoPhoneInputComponent },
    { path: 'state-autocomplete', component: DemoStateAutocompleteComponent },
    { path: 'subtabs', component: DemoSubtabsComponent },
    { path: 'toolbar', component: DemoToolbarComponent },
    { path: 'zip-autocomplete', component: DemoZipAutocompleteComponent },
    { path: 'grid', component: DemoGridComponent },
    { path: 'list-to-popover', component: DemoListToPopoverComponent },
    { path: 'signature', component: DemoSignatureComponent },
    { path: 'infinite-scroll', component: DemoInfiniteScrollComponent },
    { path: 'click-outside', component: DemoClickOutsideComponent },
    { path: 'clear-on-click', component: DemoClearOnClickComponent },
    { path: 'error-messages', component: DemoErrorMessagesComponent },
    { path: 'popover', component: DemoPopoverComponent },
    { path: 'loading', component: DemoLoadingComponent },
    { path: 'advanced-filters', component: DemoAdvancedFiltersComponent },
    { path: 'dynamic-form', component: DemoDynamicFormComponent },
    { path: 'pdf-form-review', component: DemoPdfFormReviewComponent },
    { path: 'assign-pdf-field', component: DemoAssignPdfFieldComponent },
    { path: 'patient-sidebar', component: DemoPatientSidebarComponent },
    { path: 'v-accordion', component: DemoVAccordionComponent},
];

export const demoComponentsRoutes: Routes = [
    {
        path: '',
        component: DemoComponentsComponent,
        children: [...COMPONENTS],
    },
];

@NgModule({
    imports: [RouterModule.forChild(demoComponentsRoutes)],
    exports: [RouterModule],
})

export class DemoComponentsRoutingModule {}
