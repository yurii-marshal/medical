import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientsComponent } from './patients.component';

const routes: Routes = [
    {
        path: '',
        component: PatientsComponent,
        children: [
            // {
            //     path: '',
            //     loadChildren: './modules/patients-list/patients-list.module#PatientsListModule',
            // },
            {
                path: ':patientId',
                loadChildren: './modules/patient/patient.module#PatientModule',
            },
        ],
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ],
})
export class PatientsRoutingModule {
}
