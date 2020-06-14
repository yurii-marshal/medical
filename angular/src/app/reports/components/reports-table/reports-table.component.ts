import { Component, OnInit } from '@angular/core';
import { SubTab } from '@shared/modules/sub-tabs/sub-tab.interface';
import { UserReportsEndpointsService } from '@shared/endpoints/core/user-reports/user-reports.endpoints';
import { HeaderComponent } from './components/tabel-header/header.component';
import { GridOptions } from 'ag-grid';
import {
    ActivatedRoute,
    Router,
} from '@angular/router';
import { ReportsEndpointsService } from '@shared/endpoints/core/reports/reports.endpoints';
import {
    initReportPageState,
    ReportPageState,
} from '@shared/endpoints/core/reports/reports.interface';
import { mapExecuteRequest } from '@shared/endpoints/core/reports/reports.normalizers';

@Component({
    selector: 'app-reports-table',
    templateUrl: './reports-table.html',
    styleUrls: ['./reports-table.scss'],
})

export class ReportsTableComponent implements OnInit {

    public pageLoaderStatus = true;
    public rowLoaderStatus = false;
    public menuId: string;
    public pageConfData: ReportPageState = initReportPageState();
    public tabs: SubTab[] = [
        {
            url: '/reports/table/aging_summary',
            text: 'A/R Aging Summary',
        },
        {
            url: '/reports/table/aging_insurance',
            text: 'A/R Aging By Insurance',
        },
        {
            url: '/reports/table/aging_patient',
            text: 'A/R Aging By Patient',
        },
    ];

    public gridOptions: GridOptions = {};
    public overlayNoRowsTemplate = '<span></span>';
    public rowData: any = [];

    constructor(
        private userReportsService: UserReportsEndpointsService,
        private router: Router,
        private route: ActivatedRoute,
        private reportsEndpointsService: ReportsEndpointsService,
    ) {

        this.gridOptions.defaultColDef = {
            headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
            headerComponentParams: {
                sortingOrder: false,
                enableSorting: true,
            },
        };

        this.menuId = route.snapshot.data[0].menuId;

        this.reportsEndpointsService.getReportPageConf(route.snapshot.data[0].menuId).subscribe((response) => {
            this.pageConfData = response;

            this.pageLoaderStatus = false;

            this.gridOptions.api.setColumnDefs(response.columns.allIds.map((columnId: string) => {
                return {
                    headerName: response.columns.byId[columnId].label,
                    field: 'name',
                    cellClass: this.getColorClass,
                    suppressMenu: true,
                    suppressSorting: true,
                };
            }));

            this.getRows();
        });
    }

    ngOnInit() {
        // const params = {
        //     pageSize: 20,
        //     pageIndex: 0
        // };
        //
        // this.userReportsService.getUserReports(11, params)
        //     .subscribe((res: any) => {
        //
        //         this.rowData = res.ReportBody.map((item) => {
        //             return {
        //                 gender: item.Gender,
        //                 address: item.PatientAddress,
        //                 name: item.Name
        //             };
        //         });
        //     });
    }

    public getRows() {
        this.reportsEndpointsService.getReportsRows(this.menuId, mapExecuteRequest(this.pageConfData)).subscribe((requestData) => {
        });
    }

    public onChangedColumn(data) {
        this.getRows();
    }

    public onChangedState(data) {
        this.getRows();
    }

    private getColorClass(params) {
        return Math.random() >= 0.5 ? 'red-color' : 'green-color';
    }
}
