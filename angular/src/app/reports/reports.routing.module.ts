import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { ReportsDashboardComponent } from './components/reports-dashboard/reports-dashboard.component';
import { ReportsTableComponent } from './components/reports-table/reports-table.component';

export const reportsRoutes: Routes = [
    {
        path: '',
        component: ReportsComponent,
        children: [
            {
                path: '',
                component: ReportsDashboardComponent,
                data: {title: 'Reports Dashboard', topMenu: 'Reports'},
            },
            {
                path: 'table/aging_summary',
                component: ReportsTableComponent,
                data: [{
                    menuId: 'ARAgingSummary',
                }],
            },
            {
                path: 'table/aging_insurance',
                component: ReportsTableComponent,
                data: [{
                    menuId: 'ARAgingByInsurance',
                }],
            },
            {
                path: 'table/aging_patient',
                component: ReportsTableComponent,
                data: [{
                    menuId: 'ARAgingByPatient',
                }],
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(reportsRoutes)],
    exports: [RouterModule],
})

export class ReportsRoutingModule {}

