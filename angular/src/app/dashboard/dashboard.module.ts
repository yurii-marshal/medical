import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.route';
import { SharedModule } from '@shared/shared.module';

@NgModule({
    declarations: [
        DashboardComponent,
    ],
    imports: [
        DashboardRoutingModule,
        SharedModule,
    ],
    entryComponents: [DashboardComponent],
    providers: [],
})

export class DashboardModule {}
