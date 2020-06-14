import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';

@Component({
    selector: 'app-time-component-selector',
    templateUrl: './time-component-selector.component.html',
    styleUrls: ['./time-component-selector.component.scss'],
})
export class TimeComponentSelectorComponent {
    @Input() date: Moment;
    @Input() isMeridiem = true;
    @Input() interval = 1;

    @Output() dateChange: EventEmitter<Moment> = new EventEmitter<Moment>();
    @Output() selectHour: EventEmitter<any> = new EventEmitter<any>();
    @Output() selectMinute: EventEmitter<any> = new EventEmitter<any>();

    public plusHour(): void {
        this.dateChange.emit(this.date.clone().add(1, 'hour'));
    }

    public minusHour(): void {
        this.dateChange.emit(this.date.clone().subtract(1, 'hour'));
    }

    public plusMinute(): void {
        this.dateChange.emit(this.date.clone().add(this.interval, 'minute'));
    }

    public minusMinute(): void {
        this.dateChange.emit(this.date.clone().subtract(this.interval, 'minute'));
    }

    public togglePmAm(): void {
        if (this.date.hour() < 12) {
            this.dateChange.emit(this.date.clone().add(12, 'hour'));
        } else {
            this.dateChange.emit(this.date.clone().subtract(12, 'hour'));
        }
    }
}
