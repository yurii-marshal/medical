import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';
import { AbstractSelector } from '../abstract-selector';

@Component({
    selector: 'app-month-selector',
    templateUrl: './month-selector.component.html',
    styleUrls: ['./month-selector.component.scss'],
})
export class MonthSelectorComponent extends AbstractSelector {
    @Input() date: Moment;
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;

    @Output() dateChange: EventEmitter<Moment>;
    @Output() dateSelected: EventEmitter<Moment>;
    @Output() modeChanged: EventEmitter<any>;
    @Input() set mode(value: string) {
        if (value === 'month') {
            this.initDate();
        }
    }

    public _value: any;

    public prev(): void {
        this.value = this.value.subtract(1, 'year');
    }

    public next(): void {
        this.value = this.value.add(1, 'year');
    }

    public initDate() {
        const result: Moment[] = [];

        for (let monthNum = 0; monthNum < 12; monthNum++) {
            result.push(this.value.month(monthNum));
        }

        this._value = result;
    }

    public isAllowedDate(date: Moment): boolean {
        if (!date) {
            throw new Error('Date is required.');
        }
        const start = date.clone().startOf('month');
        const end = date.clone().endOf('month');
        const validMinRange = this.minRange ? end.isSameOrAfter(this.minRange) : true;
        const validMaxRange = this.maxRange ? start.isSameOrBefore(this.maxRange) : true;

        return validMinRange && validMaxRange;
    }

    public onDateSelected(date: Moment) {
        if (this.isAllowedDate(date)) {
            this.dateSelected.emit(date);
        }
    }
}
