import { NgModule } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { UserReportsEndpointsService } from '@shared/endpoints/core/user-reports/user-reports.endpoints';
import { SharedModule } from '@shared/shared.module';
import { ReportsDashboardComponent } from './components/reports-dashboard/reports-dashboard.component';
import { ReportsTableComponent } from './components/reports-table/reports-table.component';
import { HeaderComponent } from './components/reports-table/components/tabel-header/header.component';
import { ReportFilterBlockComponent } from './components/reports-table/components/filter-block/report-filter-block.component';
import { LoadingModule } from '@shared/modules/loading/loading.module';
import { AutocompleteInfiniteScrollDirective } from '@shared/directives/autocomplete-infinite-scroll.directive';
import { SubTabsModule } from '@shared/modules';
import { OwlDateTimeModule } from 'ng-pick-datetime';

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsDashboardComponent,
        ReportsTableComponent,
        HeaderComponent,
        ReportFilterBlockComponent,
    ],
    imports: [
        ReportsRoutingModule,
        OwlDateTimeModule,
        SharedModule,
        SubTabsModule,
        AgGridModule.withComponents([
            HeaderComponent,
        ]),
        LoadingModule,
    ],
    entryComponents: [ReportsComponent],
    providers: [],
    exports: [OwlDateTimeModule],
})

export class ReportsModule {}
