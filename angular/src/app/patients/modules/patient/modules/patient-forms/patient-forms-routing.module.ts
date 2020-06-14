import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientFormsComponent } from './patient-forms.component';
import { EditFormTemplateComponent } from './components/edit-form-template/edit-form-template.component';

const routes: Routes = [
    {
        path: '',
        component: PatientFormsComponent,
        children: [
            {
                path: 'add',
                component: EditFormTemplateComponent,
            },
            {
                path: 'edit/:templateId',
                component: EditFormTemplateComponent,
            },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})
export class PatientFormsRoutingModule {
}
