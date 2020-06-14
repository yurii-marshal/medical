import { ControlValueAccessor } from '@angular/forms';
import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';
import { ControlValueAccessorProviderFactory, local } from '../common';

@Component({
    selector: 'app-datepicker-panel',
    providers: [ControlValueAccessorProviderFactory(DatePickerPanelComponent)],
    templateUrl: './date-picker-panel.component.html',
    styleUrls: ['./date-picker-panel.component.scss'],
})
export class DatePickerPanelComponent implements ControlValueAccessor {
    @Input() type: 'date' | 'datetime' | 'time' = 'date';
    @Input() displayDateMode: 'day' | 'month' | 'year' = 'day';
    @Input() showTodayButton = true;
    @Input() isMeridiem = true;
    @Input() interval = 1;
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;
    @Input() isPopup = false;

    @Output() dateChange: EventEmitter<Moment> = new EventEmitter<Moment>();
    @Output() dateSelected: EventEmitter<Moment> = new EventEmitter<Moment>();
    @Output() modeChanged: EventEmitter<any> = new EventEmitter<any>();
    @Output() finishEditing: EventEmitter<any> = new EventEmitter<any>();

    private _dateValue: Date;
    private _timeValue: Date;
    private _onChange: (value: any) => void;

    get dateSelectorVisible(): boolean {
        return this.type === 'date' || this.type === 'datetime';
    }

    get timeSelectorVisible(): boolean {
        return this.type === 'time' || this.type === 'datetime';
    }

    get date(): Date {
        return this._dateValue;
    }

    set date(value: Date) {
        this._dateValue = value;
        this.pushChangedValue();
    }

    get time(): Date {
        return this._timeValue;
    }

    set time(value: Date) {
        this._timeValue = value;
        this.pushChangedValue();
    }

    writeValue(value: any): void {
        let parsedValue = local(value);
        if (!parsedValue.isValid()) {
            parsedValue = local();
        }

        this.updateControls(parsedValue);
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {}

    private updateControls(value: Moment): void {
        this.date = value.toDate();
        this.time = value.toDate();
    }

    private pushChangedValue(): void {
        const date = local(this.date);
        const time = local(this.time);

        const result = date.clone()
            .hour(time.hour())
            .minute(time.minute())
            .second(time.second())
            .millisecond(time.millisecond());

        if (this._onChange) {
            this._onChange(result);
        }
    }
}
