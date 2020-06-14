import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { Moment } from 'moment';
import { AbstractSelector } from '../abstract-selector';

@Component({
    selector: 'app-minute-selector',
    templateUrl: './minute-selector.component.html',
    styleUrls: ['./minute-selector.component.scss'],
})
export class MinuteSelectorComponent extends AbstractSelector {
    @Input() date: Moment;
    @Output() dateChange: EventEmitter<Moment>;
    @Output() dateSelected: EventEmitter<Moment>;
    @Output() modeChanged: EventEmitter<any>;

    public minutes(): Moment[] {
        const result: Moment[] = [];

        for (let i = 0; i < 60; i = i + 5) {
            result.push(this.value.clone().minute(i));
        }

        return result;
    }
}
