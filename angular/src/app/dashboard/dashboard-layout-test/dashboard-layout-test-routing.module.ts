import { TestComponentComponent } from './test-component/test-component.component';
import {
    RouterModule,
    Routes,
} from '@angular/router';

import { RedirectToAuthGuard } from '@shared/guards/redirect-to-auth.guard';
import { NgModule } from '@angular/core';

export const dashboardRoutes: Routes = [
    {
        path: '',
        canActivate: [RedirectToAuthGuard],
        component: TestComponentComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(dashboardRoutes)],
    exports: [RouterModule],
})

export class DashboardTestRoutingModule {}
