import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Output,
    EventEmitter,
    Input,
    OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import cloneDeep from 'lodash-es/cloneDeep';

import { GridHeaderItem } from '../../../../interfaces/grid-header-item';
import { GridStateDataVal } from '../../../../interfaces/grid-state-data';
import {
    RequestParam,
    GridHeaderSortVal,
    GridFiltersGroup,
    GridFiltersFormVal,
} from '../../models/grid-filter.interface';

import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { GridStateService } from '../../../../services/grid-state.service';
import { TransformDataService } from '../../services/transform-data.service';

@Component({
    selector: 'app-grid-filter',
    templateUrl: './grid-filter.component.html',
    styleUrls: ['./grid-filter.component.scss'],
})
export class GridFilterComponent implements OnInit, OnDestroy {
    /** Input for grid filters state for renewing filters value while navigate routs */
    @Input() gridStateName: string;
    /** Input for array of object with description for generting gridHeaderItems  */
    @Input() gridHeaderItems: GridHeaderItem[];
    /** Input for object with formGroup description to generate gridFiltersForm */
    @Input() filtersGroup: GridFiltersGroup;

    @Output() filtersChange: EventEmitter<RequestParam> = new EventEmitter<RequestParam>();
    @Output() filtersReset: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('gridFilter') gridFilter: ElementRef;

    public gridFiltersFormSubscription: Subscription;
    public gridFiltersForm: FormGroup;
    public gridHeaderSortVal: GridHeaderSortVal = {};
    public gridHeaderItemsCopy: GridHeaderItem[] = [];
    /** Using copy of originl gridHeaderItems for avoiding object mutation */
    public gridFiltersFormVal: GridFiltersFormVal = {};
    public filtersResetClicked = false;

    constructor(
        private gridStateService: GridStateService,
        private transformDataService: TransformDataService,
        private fb: FormBuilder,
        iconRegistry: MatIconRegistry,
        sanitizer: DomSanitizer,
    ) {
        iconRegistry.addSvgIcon(
            'clear-filters',
            sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/clear-filters.svg'));
    }

    ngOnInit() {
        this.gridFiltersForm = this.fb.group(this.filtersGroup);
        this.gridHeaderItemsCopy = cloneDeep(this.gridHeaderItems);
        this.getGridStateData();
        this.formChangesSub();
    }

    public changeSortDirection(headerItem): void {
        if (headerItem.active) {
            headerItem.order = headerItem.order === 'asc' ? 'desc' : 'asc';
        } else {
            headerItem.active = true;
            headerItem.order = 'asc';
            this.gridHeaderItemsCopy.map((item) => {
                if (item.title !== headerItem.title) {
                    delete item.active;
                }
            });
        }

        this.gridHeaderSortVal.sortExpression = `${headerItem.sortBy} ${headerItem.order.toUpperCase()}`;
        this.onGridFiltersChange(this.gridFiltersFormVal, this.gridHeaderSortVal);

        this.gridStateService.setData(this.gridStateName, {headerItemsValue: this.gridHeaderItemsCopy});
    }

    public onResetFilters(): void {
        this.gridStateService.removeData(this.gridStateName);
        this.filtersResetClicked = true;
        this.gridHeaderItemsCopy = cloneDeep(this.gridHeaderItems);
        this.gridFiltersForm.reset();

        this.filtersReset.emit();
    }

    ngOnDestroy() {
        if (this.gridFiltersFormSubscription) {
            this.gridFiltersFormSubscription.unsubscribe();
        }
    }

    private getGridStateData(): void {
        const gridStateData: GridStateDataVal = this.gridStateService.getData(this.gridStateName);

        if (gridStateData && gridStateData.headerItemsValue) {
            this.gridHeaderItemsCopy = gridStateData.headerItemsValue;
        }

        if (gridStateData && gridStateData.formValue) {
            this.gridFiltersForm.patchValue(gridStateData.formValue);
            this.gridFiltersFormVal = this.transformDataService.transform(gridStateData.formValue);
        }
    }

    private formChangesSub(): void {
        this.gridFiltersFormSubscription = this.gridFiltersForm.valueChanges.pipe(
            debounceTime(500),
        ).subscribe((formValue) => {
            this.gridStateService.setData(this.gridStateName, {formValue});

            /** Transform data for proper request type */
            this.gridFiltersFormVal = this.transformDataService.transform(cloneDeep(formValue));

            if (!this.filtersResetClicked) {
                this.onGridFiltersChange(this.gridFiltersFormVal, this.gridHeaderSortVal);
            } else {
                this.filtersResetClicked = false;
            }
        });
    }

    private onGridFiltersChange(filtersFormVal, headerSortVal): void {
        const reqParams: RequestParam = Object.assign(filtersFormVal, headerSortVal);

        this.gridStateService.setData(this.gridStateName, {reqParams});
        this.filtersChange.emit(reqParams);
    }
}
