import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFieldDirective } from './components/dynamic-field/dynamic-field.directive';
import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormInputComponent } from './components/form-input/form-input.component';
import { FormSelectComponent } from './components/form-select/form-select.component';
import { FormDateTimePickerComponent } from './components/form-datetimepicker/form-datetimepicker.component';
import { FormAttrsTagsComponent } from './components/form-attrs-tags/form-attrs-tags.component';
import { FormDateRangeComponent } from './components/form-daterange/form-daterange.component';
import { FormCheckboxComponent } from './components/form-checkbox/form-checkbox.component';

import {
    AttrsTagsModule,
    DateTimePickerModule,
} from '../../modules';
import { FormChipsComponent } from '@shared/modules/dynamic-form/components/form-chips/form-chips.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        DateTimePickerModule,
        AttrsTagsModule,
    ],
    declarations: [
        DynamicFieldDirective,
        DynamicFormComponent,
        FormButtonComponent,
        FormInputComponent,
        FormSelectComponent,
        FormDateTimePickerComponent,
        FormAttrsTagsComponent,
        FormDateRangeComponent,
        FormCheckboxComponent,
        FormChipsComponent,
    ],
    exports: [
        DynamicFormComponent,
    ],
    entryComponents: [
        FormButtonComponent,
        FormInputComponent,
        FormSelectComponent,
        FormDateTimePickerComponent,
        FormAttrsTagsComponent,
        FormDateRangeComponent,
        FormCheckboxComponent,
        FormChipsComponent,
    ],
})

export class DynamicFormModule {}
