import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { daysOfWeek, monthCalendar } from '../../date-utils';
import { AbstractSelector } from '../abstract-selector';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-day-selector',
    templateUrl: './day-selector.component.html',
    styleUrls: ['./day-selector.component.scss'],
})
export class DaySelectorComponent extends AbstractSelector implements OnChanges {
    @Input() date: Moment;
    @Input() showTodayButton = true;
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;
    @Input() set mode(value: string) {
        if (value === 'day') {
            this.initDate();
        }
    }

    @Output() dateChange: EventEmitter<Moment>;
    @Output() dateSelected: EventEmitter<Moment>;
    @Output() modeChanged: EventEmitter<any>;

    public _value: any;

    public initDate() {
        this._value = monthCalendar(this.date);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.date) {
            this.initDate();
        }
    }

    public getDaysOfWeek(): string[] {
        return daysOfWeek();
    }

    public prev(): void {
        this.value = this.date.subtract(1, 'month');
        this.initDate();
    }

    public next(): void {
        this.value = this.date.add(1, 'month');
        this.initDate();
    }

    public isValidDate(date: Moment): boolean {
        if (!date) {
            throw new Error('Date is required.');
        }
        const thisMonthDay = this.value.year() === date.year() && this.value.month() === date.month();
        return thisMonthDay;
    }

    public isAllowedDate(date: Moment): boolean {
        if (!date) {
            throw new Error('Date is required.');
        }
        const start = date.clone().startOf('day');
        const end = date.clone().endOf('day');
        const validMinRange = this.minRange ? end.isSameOrAfter(this.minRange) : true;
        const validMaxRange = this.maxRange ? start.isSameOrBefore(this.maxRange) : true;

        return validMinRange && validMaxRange;
    }

    public todaySelected(event: Event) {
        this.value = moment();
        this.dateSelected.emit(moment());
        event.preventDefault();
        event.stopPropagation();
    }

    public onDateSelected(date: Moment) {
        if (this.isAllowedDate(date)) {
            this.dateSelected.emit(date);
        }
    }
}
