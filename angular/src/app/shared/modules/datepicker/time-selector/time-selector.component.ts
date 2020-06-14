import { ControlValueAccessor } from '@angular/forms';
import { Component, Input } from '@angular/core';
import { Moment } from 'moment';
import {
    ControlValueAccessorProviderFactory,
    local,
    OnChangeHandler,
    OnTouchedHandler,
} from '../common';


export type TimeSelectorMode = 'time' | 'hour' | 'minute';

@Component({
    selector: 'app-time-selector',
    providers: [ControlValueAccessorProviderFactory(TimeSelectorComponent)],
    templateUrl: './time-selector.component.html',
})
export class TimeSelectorComponent implements ControlValueAccessor {
    @Input() isMeridiem = true;
    @Input() interval = 1;
    displayDate: Moment = local();
    mode: TimeSelectorMode = 'time';
    private _onChange: OnChangeHandler;
    private _onTouched: OnTouchedHandler;

    private _selectedDate: Moment;

    get selectedDate(): Moment {
        return !this._selectedDate ? null : this._selectedDate.clone();
    }

    set selectedDate(value: Moment) {
        if (value && value.isValid()) {
            this._selectedDate = value.clone();
            this.displayDate = value.clone();

            if (this._onChange) {
                this._onChange(this.selectedDate.clone());
            }
        }

        this.mode = 'time';
    }

    writeValue(val: string): void {
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

    registerOnTouched(fn: OnTouchedHandler): void {
        this._onTouched = fn;
    }
}
