import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from './patient.component';

const routes: Routes = [
    {
        path: '',
        component: PatientComponent,
        children: [
            {
                path: 'forms',
                loadChildren: './modules/patient-forms/patient-forms.module#PatientFormsModule',
            },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})
export class PatientRoutingModule {
}
