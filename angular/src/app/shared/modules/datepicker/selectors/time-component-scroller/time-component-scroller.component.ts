import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';


@Component({
    selector: 'app-time-component-scroller',
    templateUrl: './time-component-scroller.component.html',
    styleUrls: ['./time-component-scroller.component.scss'],
})
export class TimeComponentScrollerComponent {
    @Input() value: Moment;
    @Input() format: string;

    @Output() selectValue: EventEmitter<any> = new EventEmitter<any>();
    @Output() up: EventEmitter<any> = new EventEmitter<any>();
    @Output() down: EventEmitter<any> = new EventEmitter<any>();
}
