import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-select',
    template: `
        <div
            class="dynamic-field form-select"
            [formGroup]="group">
            <label class="dynamic-label">{{ config.label }}:</label>
            <mat-form-field>
                <mat-select [placeholder]="config.placeholder" [formControlName]="config.name">
                    <mat-option [value]="option" *ngFor="let option of config.options">{{ option }}</mat-option>
                </mat-select>
            </mat-form-field>
        </div>
    `,
})

export class FormSelectComponent implements Field {
    config: FieldConfig;
    group: FormGroup;
}
