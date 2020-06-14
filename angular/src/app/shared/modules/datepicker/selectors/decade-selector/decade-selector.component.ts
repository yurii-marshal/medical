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
    selector: 'app-decade-selector',
    templateUrl: './decade-selector.component.html',
    styleUrls: ['./decade-selector.component.scss'],
})
export class DecadeSelectorComponent extends AbstractSelector {
    @Input() date: Moment;
    @Input() minRange: Moment = null;
    @Input() maxRange: Moment = null;
    @Input() set mode(value: string) {
        if (value === 'decade') {
            this.initDate();
        }
    }

    public _value: any;

    @Output() dateChange: EventEmitter<Moment> = new EventEmitter<Moment>();
    @Output() dateSelected: EventEmitter<Moment> = new EventEmitter<Moment>();
    @Output() modeChanged: EventEmitter<any> = new EventEmitter<any>();

    public prev(): void {
        this.value = this.value.subtract(100, 'year');
    }

    public next(): void {
        this.value = this.value.add(100, 'year');
    }

    public formatCentury(): string {
        const startYear = this.value.year() - this.value.year() % 100;
        const endYear = startYear + 99;

        return `${startYear}-${endYear}`;
    }

    public initDate() {
        const startYear = this.value.year() - this.value.year() % 100;
        const start = this.value.year(startYear);
        const result: Moment[] = [];

        for (let year = 0; year < 90; year = year + 10) {
            result.push(start.clone().add(year, 'year'));
        }

        this._value = result;
    }

    public isDecadeSelected(value: Moment): boolean {
        const [start, end] = decade(value);
        return this.value.year() >= start.year() && this.value.year() <= end.year();
    }

    public isAllowedDate(date: Moment): boolean {
        if (!date) {
            throw new Error('Date is required.');
        }

        const validMinRange = this.minRange ? this.minRange.year() < date.year() + 10 : true;
        const validMaxRange = this.maxRange ? this.maxRange.year() >= date.year() : true;

        return validMinRange && validMaxRange;
    }

    public onDateSelected(date: Moment) {
        if (this.isAllowedDate(date)) {
            this.dateSelected.emit(date);
        }
    }
}
