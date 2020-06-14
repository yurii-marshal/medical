import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';
import {
    Observable,
    Subject,
    Subscription,
} from 'rxjs';
import {
    debounceTime, map,
} from 'rxjs/operators';
import { ReportsEndpointsService } from '@shared/endpoints/core/reports/reports.endpoints';
import { ReportFilterFieldType } from '@shared/endpoints/core/reports/reports.enums';

@Component({
    selector: 'app-report-filter-block',
    templateUrl: './report-filter-block.html',
    styleUrls: ['./report-filter-block.scss'],
})

export class ReportFilterBlockComponent implements OnInit, OnChanges, OnDestroy {
    @Input() paramsState: any;
    @Input() columns: any = {
        allIds: [],
        byId: {},
    };

    @Output() changeParamsState = new EventEmitter<any>();
    @Output() changeColumns = new EventEmitter<any>();

    public reportFilterFieldType = ReportFilterFieldType;
    public reportFilterForm: FormGroup;
    public reportColumnForm: FormGroup;
    public formChangeSubscription: Subscription;
    public remoteListOptions: { [id: string]: Observable<string[]> } = {};

    constructor(
        private reportsEndpointsService: ReportsEndpointsService,
        private fb: FormBuilder,
    ) {
        this.reportColumnForm = this.fb.group({
            selectedColumns: '',
        });
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.columns) {
            const displayedColumns: string[] = [];

            changes.columns.currentValue.allIds.forEach((columnId) => {
                if (changes.columns.currentValue.byId[columnId].displayed) {
                    displayedColumns.push(columnId);
                }
            });

            this.reportColumnForm.patchValue({selectedColumns: displayedColumns});
        }

        if (changes.paramsState) {
            const fieldsConfig: { [id: string]: string } = {};

            changes.paramsState.currentValue.allIds.forEach((id) => {
                fieldsConfig[id] = changes.paramsState.currentValue.byId[id].value || '';
                this.remoteListOptions[id] = new Subject();
            });

            if (this.formChangeSubscription) {
                this.formChangeSubscription.unsubscribe();
            }

            this.reportFilterForm = this.fb.group(fieldsConfig);

            this.formChangeSubscription = this.reportFilterForm.valueChanges
                .pipe(
                    debounceTime(200),
                )
                .subscribe((data) => {
                    let isNeedTriggerEvent = false;

                    Object.keys(data).forEach((key) => {

                        if (this.paramsState.byId[key].typeId === this.reportFilterFieldType.RemoteList
                            && this.paramsState.byId[key].value !== data[key]
                            && data[key]
                        ) {
                            this.onChangeRemoteListVal(key, data[key]);
                        }

                        if (this.paramsState.byId[key].typeId === this.reportFilterFieldType.Date
                            && this.paramsState.byId[key].value !== data[key]
                            && data[key]
                        ) {
                            isNeedTriggerEvent = true;
                        }

                        this.paramsState.byId[key].value = data[key];
                    });

                    if (isNeedTriggerEvent) {
                        this.onChangeStateValue();
                    }
                });
        }
    }

    public onChangeRemoteListVal(key: string, newVal: string): void {
        const remoteData = this.paramsState.byId[key].remote;

        this.remoteListOptions[key] = this.reportsEndpointsService
            .getLocationDictionary(remoteData.url, newVal, remoteData.filterField)
            .pipe(
                map((response) => response.Items),
            );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.formChangeSubscription.unsubscribe();
    }

    public onToggleColumnSelect(status: boolean): void {
        if (!status) {
            this.changeColumns.emit(this.reportColumnForm.controls['selectedColumns'].value);
        }
    }

    public getAutocompleteText(data) {
        return data.Name;
    }

    public onChangeStateValue() {
        this.changeParamsState.emit(this.paramsState);
    }
}
