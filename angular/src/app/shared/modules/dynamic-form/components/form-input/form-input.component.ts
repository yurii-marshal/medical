import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-input',
    template: `
        <div
            class="dynamic-field form-input"
            [formGroup]="group">
            <label class="dynamic-label">{{ config.label }}:</label>
            <mat-form-field>
                <input matInput [formControlName]="config.name" [placeholder]="config.placeholder">
            </mat-form-field>
        </div>
    `,
})
export class FormInputComponent implements Field {
    config: FieldConfig;
    group: FormGroup;
}
