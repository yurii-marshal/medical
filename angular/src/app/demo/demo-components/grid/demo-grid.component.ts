import {
    Component,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { PatientEndpointsService } from '@shared/endpoints/core/patient/patient.endpoints';
import { GridHeaderItem } from '@shared/interfaces/grid-header-item';
import { PatientsFormModel } from '@shared/interfaces/models/grid-form.model';

import {
    Subject,
    Subscription,
} from 'rxjs';
import {
    map,
    distinctUntilChanged,
    switchMap,
} from 'rxjs/operators';
import {
    Patient,
    GetPatientsParams,
    PatientsState,
} from '@shared/endpoints/core/patient/patient.interfaces';
import { GridStateService } from '@shared/services/grid-state.service';
import { GridStateDataVal } from '@shared/interfaces/grid-state-data';

/**
 *
 * GridModule is a custom module for representing, filtering and serarching data with infinity scroll functionality.
 *
 * Location:
 * -------------------
 * **GridModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/grid</example-url>
 *
 */
@Component({
    selector: 'app-demo-grid',
    templateUrl: './demo-grid.component.html',
})
export class DemoGridComponent implements OnInit, OnDestroy {
    public patientsFormGroup: PatientsFormModel = new PatientsFormModel();
    public gridHeaderItems: GridHeaderItem[] = [];
    public gridDataReq$: Subject<GetPatientsParams> = new Subject<GetPatientsParams>();
    public gridDataReqSubscription: Subscription;

    public gridItemsCount = 0;
    public gridPageIndex = 0;
    public isGridReload = false;
    public isLoadMore = false;
    public isAllGridItemsLoaded = false;
    public isGridItemsLoading = false;
    public isAppNoContent = true;

    public gridReqParams: GetPatientsParams = {};
    public gridData: Patient[] = [];

    /** Name for saving grid filters state while navigating through routs */
    public gridStateName: string;

    constructor(
        private patientEndpointsService: PatientEndpointsService,
        private gridStateService: GridStateService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.iconRegistry.addSvgIcon(
            'chevron',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/chevron.svg'));
        this.iconRegistry.addSvgIcon(
            'user-square',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/user-square.svg'));
        this.iconRegistry.addSvgIcon(
            'tag',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/tag.svg'));

        this.gridStateName = 'patients';

        /** Object with descriptions for Grid Header Items. Generare Grid Header Filters */
        this.gridHeaderItems = [
            {
                active: true, /** Status for item acitve by default */
                order: 'asc', /** Default 'order' for active header item */
                sortable: true,
                title: 'patient:',
                sortBy: 'Name', /** Value for server request */
                icon: 'user-square',
                class: 'w250px',
            },
            {
                sortable: true,
                title: 'dob:',
                sortBy: 'DateOfBirth',
                icon: 'user-square',
                class: 'w125px',
            },
            {
                title: 'phone:',
                icon: 'user-square',
                class: 'w200px',
            },
            {
                title: 'address:',
                icon: 'user-square',
                class: 'w400px',
            },
            {
                title: 'location:',
                icon: 'user-square',
                class: 'grow-1',
            },
            {
                title: 'status:',
                icon: 'user-square',
                class: 'w110px',
            },
            {
                class: 'number-data', /** empty space separator */
            },
        ];
    }

    ngOnInit() {
        this.gridDataReq();
        this.getGridStateData();
        this.getGridData();
    }

    public gridDataReq(): void {
        this.gridDataReqSubscription = this.gridDataReq$.pipe(
            distinctUntilChanged(),
            switchMap((requestParams) => this.patientEndpointsService.getPatients(requestParams)),
            map((data: PatientsState) => {
                const patients = data.patients;

                this.gridItemsCount = patients.count;
                return patients.allIds.map((patientId) => patients.byId[patientId]);
            }),
        ).subscribe((data: Patient[]) => {
            this.isGridReload = true;

            this.isLoadMore ? this.gridData = this.gridData.concat(data) : this.gridData = data;
            this.isAppNoContent = !!this.gridItemsCount;

            this.isAllGridItemsLoaded = this.gridItemsCount === this.gridData.length;
            this.isGridItemsLoading = this.isAllGridItemsLoaded;
        });
    }

    public getGridStateData(): void {
        const gridStateData: GridStateDataVal = this.gridStateService.getData(this.gridStateName);

        if (gridStateData && gridStateData.reqParams) {
            this.gridReqParams = gridStateData.reqParams;
        }
    }

    public getGridData(isLoadMore = false, options?): void {
        /** Params for data default first loading and resetting  */
        const defaultReqParams: GetPatientsParams = {
            'filter.all': true,
            'pageSize': 24,
            'sortExpression': 'Name ASC',
        };

        this.isLoadMore = isLoadMore;
        this.isAllGridItemsLoaded = false;
        this.isGridItemsLoading = true;
        this.isAppNoContent = true;

        if (options) {
            this.gridReqParams = options;
        }

        if (!isLoadMore) {
            this.isGridReload = false;
        }

        const reqParams: GetPatientsParams = Object.assign(defaultReqParams, this.gridReqParams);

        reqParams.pageIndex = this.isLoadMore ? this.gridPageIndex += 1 : this.gridPageIndex = 0;
        this.gridDataReq$.next(reqParams);
    }

    public onFiltersReset(): void {
        this.gridReqParams = {};
        this.getGridData();
    }

    ngOnDestroy() {
        if (this.gridDataReqSubscription) {
            this.gridDataReqSubscription.unsubscribe();
        }
    }
}
