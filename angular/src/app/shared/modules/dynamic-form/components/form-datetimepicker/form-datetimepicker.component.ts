import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-datetimepicker',
    template: `
        <div
            class="dynamic-field form-datetimepicker"
            [formGroup]="group">
            <label class="dynamic-label">{{ config.label }}:</label>
            <app-datetimepicker
                [formControlName]="config.name"
                [placeholder]="config.placeholder"
                [mode]="config.mode"
                [showTodayButton]="config.showTodayButton"
                [interval]="config.interval"
                [minRange]="config.minRange"
                [maxRange]="config.maxRange"
                [displayImage]="config.displayImage"
                [imagePosition]="config.imagePosition"
                [displayClearButton]="config.displayClearButton"
                [dateFormat]="config.dateFormat"></app-datetimepicker>
        </div>
    `,
})
export class FormDateTimePickerComponent implements Field {
    config: FieldConfig;
    group: FormGroup;
}
