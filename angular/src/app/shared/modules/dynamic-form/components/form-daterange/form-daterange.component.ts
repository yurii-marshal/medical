import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-daterange',
    styleUrls: ['./form-daterange.component.scss'],
    template: `
        <div
            class="dynamic-field form-datetimepicker"
            [formGroup]="fromToGroup">
            <label class="dynamic-label">{{ config.label }}:</label>
            <app-datetimepicker
                formControlName="from"
                placeholder="From"
                [mode]="config.mode ? config.mode : 'date'"
                [showTodayButton]="config.showTodayButton"
                [interval]="config.interval"
                [minRange]="config.minRange"
                [maxRange]="config.maxRange"
                [displayImage]="config.displayImage ? config.displayImage : 'true'"
                [imagePosition]="config.imagePosition ? config.imagePosition : 'left'"
                [displayClearButton]="config.displayClearButton"
                [dateFormat]="config.dateFormat"
                [errors]="errors"></app-datetimepicker>

            <span class="dash">—</span>

            <app-datetimepicker
                formControlName="to"
                placeholder="To"
                [mode]="config.mode ? config.mode : 'date'"
                [showTodayButton]="config.showTodayButton"
                [interval]="config.interval"
                [minRange]="config.minRange"
                [maxRange]="config.maxRange"
                [displayImage]="config.displayImage ? config.displayImage : 'true'"
                [imagePosition]="config.imagePosition ? config.imagePosition : 'left'"
                [displayClearButton]="config.displayClearButton"
                [dateFormat]="config.dateFormat"
                [errors]="errors"></app-datetimepicker>
        </div>
    `,
})

export class FormDateRangeComponent implements Field, OnInit {
    public config: FieldConfig;
    public group: FormGroup;
    public fromToGroup: FormGroup;
    public errors: string;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.fromToGroup = this.fb.group({
            from: this.fb.control(null),
            to: this.fb.control(null),
        });

        this.onChanges();
    }

    onChanges(): void {
        this.fromToGroup.valueChanges.subscribe((val) => {
            if (val.from && val.to) {
                if (val.to.isSameOrAfter(val.from)) {
                    this.errors = '';
                    this.group.get(this.config.name).patchValue(this.fromToGroup.value);
                } else {
                    this.errors = 'error msg';
                }
            }
        });
    }
}
