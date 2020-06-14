import { NgModule } from '@angular/core';

import { DatePickerPanelComponent } from './date-picker-panel/date-picker-panel.component';
import { DateSelectorComponent } from './date-selector/date-selector.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { TimeSelectorComponent } from './time-selector/time-selector.component';
import { PeriodSwitchComponent } from './selectors/period-switch/period-switch.component';
import { HourSelectorComponent } from './selectors/hour-selector/hour-selector.component';
import { MinuteSelectorComponent } from './selectors/minute-selector/minute-selector.component';
import { TimeComponentSelectorComponent } from './selectors/time-component-selector/time-component-selector.component';
import { MonthSelectorComponent } from './selectors/month-selector/month-selector.component';
import { TimeComponentScrollerComponent } from './selectors/time-component-scroller/time-component-scroller.component';
import { YearSelectorComponent } from './selectors/year-selector/year-selector.component';
import { DaySelectorComponent } from './selectors/day-selector/day-selector.component';
import { DecadeSelectorComponent } from './selectors/decade-selector/decade-selector.component';
import { SharedModule } from '../../shared.module';

import {
    OWL_DATE_TIME_FORMATS,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
} from 'ng-pick-datetime';

import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
    parseInput: 'l LT',
    fullPickerInput: 'l LT',
    datePickerInput: 'MM/DD/YYYY',
    timePickerInput: 'LT',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
};

@NgModule({
    imports: [
        SharedModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        OwlMomentDateTimeModule,
    ],
    declarations: [
        PeriodSwitchComponent,
        DaySelectorComponent,
        DecadeSelectorComponent,
        HourSelectorComponent,
        MinuteSelectorComponent,
        MonthSelectorComponent,
        TimeComponentSelectorComponent,
        YearSelectorComponent,
        DatePickerPanelComponent,
        DateSelectorComponent,
        DatePickerComponent,
        TimeSelectorComponent,
        TimeComponentScrollerComponent,
    ],
    exports: [
        DatePickerComponent,
    ],
    providers: [
        {
            provide: OWL_DATE_TIME_FORMATS,
            useValue: MY_MOMENT_FORMATS,
        },
    ],
    entryComponents: [
        DatePickerPanelComponent,
    ],
})
export class DateTimePickerModule {}
