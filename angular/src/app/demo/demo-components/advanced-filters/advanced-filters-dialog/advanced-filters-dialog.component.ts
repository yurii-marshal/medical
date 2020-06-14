import {
    Component,
    AfterViewInit,
    ViewChild,
    Inject,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { FieldConfig } from '@shared/modules/dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from '@shared/modules/dynamic-form/containers/dynamic-form/dynamic-form.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DynamicFieldTypes } from '@shared/modules/dynamic-form/enums/dynamic-field-types.enum';

@Component({
    selector: 'app-demo-advanced-filters-dialog',
    templateUrl: './advanced-filters-dialog.component.html',
    styleUrls: ['./advanced-filters-dialog.component.scss'],
})
export class DemoAdvancedFiltersDialogComponent implements AfterViewInit {

    @ViewChild(DynamicFormComponent)
    form: DynamicFormComponent;

    public config: FieldConfig[] = [
        {
            type: DynamicFieldTypes.Input,
            label: 'Input Text (minLength: 2)',
            name: 'text',
            placeholder: 'placeholder...',
            validation: [Validators.required, Validators.minLength(2)],
        },
        {
            type: DynamicFieldTypes.Select,
            label: 'Input Select',
            name: 'select',
            options: ['option 1', 'option 2', 'option 3', 'option 4'],
            placeholder: 'Select an option',
            validation: [Validators.required],
        },
        {
            type: DynamicFieldTypes.AttrsTags,
            label: 'Input Tags',
            name: 'attrs-tags',
        },
        {
            type: DynamicFieldTypes.DateTimePicker,
            label: 'DateTimePicker',
            name: 'datetimepicker',
            mode: 'date',
            displayImage: true,
            imagePosition: 'left',
            placeholder: 'Select date and time',
            validation: [Validators.required],
        },
        {
            type: DynamicFieldTypes.DateRange,
            label: 'Date Range',
            name: 'daterange',
            validation: [Validators.required],
        },
        {
            type: DynamicFieldTypes.Checkbox,
            label: 'CheckBoxes',
            name: 'checkbox',
            checkboxes: [
                {
                    label: 'Male',
                    value: 'male',
                },
                {
                    label: 'Female',
                    value: 'female',
                },
            ],
        },
        {
            type: DynamicFieldTypes.Chips,
            label: 'Chips',
            name: 'chips',
        },
        {
            type: DynamicFieldTypes.Button,
            label: 'Apply',
            name: 'submit',
            disabled: true,
        },
    ];

    constructor(
        public dialogRef: MatDialogRef<DemoAdvancedFiltersDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    ngAfterViewInit() {
        let previousValid = this.form.valid;
        this.form.changes.subscribe(() => {
            if (this.form.valid !== previousValid) {
                previousValid = this.form.valid;
                this.form.setDisabled('submit', !previousValid);
            }
        });
    }

    public submit(value: { [name: string]: any }) {
        console.log(value);
    }

}
