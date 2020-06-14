import { ControlValueAccessor } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from '@angular/core';
import { Moment } from 'moment';
import {
    ControlValueAccessorProviderFactory,
    local,
    OnChangeHandler,
} from '../common';
export type DateSelectorMode = 'day' | 'month' | 'year' | 'decade';

@Component({
    selector: 'app-date-selector',
    providers: [ControlValueAccessorProviderFactory(DateSelectorComponent)],
    templateUrl: './date-selector.component.html',
    styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent implements ControlValueAccessor, OnChanges {
    @Input() displayDateMode: 'day' | 'month' | 'year';
    @Input() showTodayButton = true;
    @Output() finishEditing: EventEmitter<any> = new EventEmitter<any>();
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;

    public mode: DateSelectorMode;
    public displayDate: Moment = local();

    private _selectedDate: Moment;
    private _onChange: OnChangeHandler;
    private _onTouched: () => void;

    constructor() {
    }

    ngOnChanges(changes: any) {
        if (changes.displayDateMode) {
            this.mode = this.displayDateMode;
        }
    }

    get selectedDate(): Moment {
        if (!this._selectedDate) {
            return null;
        }

        return this._selectedDate.clone();
    }

    set selectedDate(value: Moment) {
        if (value && value.isValid()) {
            this._selectedDate = value.clone();
            this.displayDate = value.clone();

            if (this._onChange) {
                this._onChange(this.selectedDate.clone());
            }
        }
    }

    writeValue(val: any): void {
        if (val === null || val === undefined) {
            this._selectedDate = null;
        } else {

            let parsed = local(val);
            if (!parsed.isValid()) {
                parsed = null;
            }

            this._selectedDate = parsed;
        }

        this.displayDate = this.selectedDate || local();
    }

    registerOnChange(fn: OnChangeHandler): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this._onTouched = fn;
    }

    onDaySelected(event: Moment) {
        this.selectedDate = event;
        this.finishEditing.emit();
    }

    onMonthSelected(event: Moment) {
        this.selectedDate = event;
        // this.displayDateMode !== 'month' ?
        this.mode = 'day';
    }

    onYearSelected(event: Moment) {
        this.selectedDate = event;
        // displayDateMode !== 'year' &&
        this.mode = 'month';
    }

    onDecadeSelected(event: Moment) {
        this.selectedDate = event;
        this.mode = 'year';
    }
}
