import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';
import { decade } from '../../date-utils';
import { AbstractSelector } from '../abstract-selector';

@Component({
    selector: 'app-year-selector',
    templateUrl: './year-selector.component.html',
    styleUrls: ['./year-selector.component.scss'],
})
export class YearSelectorComponent extends AbstractSelector {
    @Input() date: Moment;
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;
    @Input() set mode(value: string) {
        if (value === 'year') {
            this.initDate();
        }
    }

    @Output() dateChange: EventEmitter<Moment>;
    @Output() dateSelected: EventEmitter<Moment>;
    @Output() modeChanged: EventEmitter<any>;

    private _value: any;

    prev(): void {
        this.value = this.value.subtract(10, 'year');
    }

    public next(): void {
        this.value = this.value.add(10, 'year');
    }

    public initDate() {
        const [start] = decade(this.value);
        const result: Moment[] = [];

        for (let year = 0; year < 12; year++) {
            result.push(start.clone().add(year, 'year'));
        }

        this._value = result;
    }

    public isAllowedDate(date: Moment): boolean {
        if (!date) {
            throw new Error('Date is required.');
        }
        const start = date.clone().startOf('year');
        const end = date.clone().endOf('year');
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
