import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
    selector: 'app-form-input',
    template: `
        <div class="dynamic-field form-input">
            <label class="dynamic-label">{{ config.label }}:</label>
            <mat-checkbox
                *ngFor="let checkbox of config.checkboxes"
                class="custom-checkbox"
                [value]="checkbox.value"
                [checked]="this.checkboxes.indexOf(checkbox.value) !== -1"
                (change)="onCheckboxChanged($event)">{{ checkbox.label }}
            </mat-checkbox>
        </div>
    `,
})

export class FormCheckboxComponent implements Field {
    public config: FieldConfig;
    public group: FormGroup;
    public checkboxes: string[] = [];

    onCheckboxChanged(event: any) {
        if (event.checked) {
            this.checkboxes.push(event.source.value);
        } else {
            this.checkboxes.splice(this.checkboxes.indexOf(event.source.value), 1);
        }

        this.group.get(this.config.name).patchValue(this.checkboxes);
    }

}
