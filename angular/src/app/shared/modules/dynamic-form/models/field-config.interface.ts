import { ValidatorFn } from '@angular/forms';
import { Moment } from 'moment';

export interface FieldConfig {
    type: string;
    name: string;
    label?: string;
    value?: any;
    validation?: ValidatorFn[];
    disabled?: boolean;
    placeholder?: string;

    // Select
    options?: string[];

    // DateTimePicker
    mode?: string;
    showTodayButton?: boolean;
    displayClearButton?: boolean;
    displayImage?: boolean;
    imagePosition?: 'left' | 'right';
    interval?: number;
    minRange?: Moment;
    maxRange?: Moment;
    dateFormat?: string;

    // CheckBox
    checkboxes?: CheckBoxField[];

    // Chips
    chips?: string[];
}

export interface CheckBoxField {
    label: string;
    value: string;
}
