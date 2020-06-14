import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';

import { AbstractSelector } from '../abstract-selector';


@Component({
    selector: 'app-hour-selector',
    templateUrl: './hour-selector.component.html',
    styleUrls: ['./hour-selector.component.scss'],
})
export class HourSelectorComponent extends AbstractSelector {
    @Input() date: Moment;
    @Input() isMeridiem = true;

    @Output() dateChange: EventEmitter<Moment>;
    @Output() dateSelected: EventEmitter<Moment>;
    @Output() modeChanged: EventEmitter<any>;

    public hours(): Moment[] {
        const startDate = this.value;
        const result: Moment[] = [];

        startDate.hour( (startDate.hour() < 12 || this.isMeridiem === false) ? 0 : 12);

        for (let i = (this.isMeridiem === true ? 1 : 0); i < (this.isMeridiem === true ? 13 : 24); i++) {
            result.push(startDate.clone().add(i, 'hour'));
        }

        return result;
    }

    public isCurrentHour(date: Moment): boolean {
        return date && this.value && this.value.hour() === date.hour();
    }
}
