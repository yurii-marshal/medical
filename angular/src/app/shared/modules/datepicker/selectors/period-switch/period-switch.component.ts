import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';

@Component({
    selector: 'app-period-switch',
    templateUrl: './period-switch.component.html',
    styleUrls: ['./period-switch.component.scss'],
})
export class PeriodSwitchComponent {
    @Input() period: string;

    @Output() prev: EventEmitter<any> = new EventEmitter<any>();
    @Output() next: EventEmitter<any> = new EventEmitter<any>();
    @Output() modeChange: EventEmitter<any> = new EventEmitter<any>();
}
