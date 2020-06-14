import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    OnInit,
    Type,
    ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { FormDateTimePickerComponent } from '../form-datetimepicker/form-datetimepicker.component';
import { FormAttrsTagsComponent } from '../form-attrs-tags/form-attrs-tags.component';
import { FormDateRangeComponent } from '../form-daterange/form-daterange.component';
import { FormCheckboxComponent } from '@shared/modules/dynamic-form/components/form-checkbox/form-checkbox.component';
import { FormChipsComponent } from '@shared/modules/dynamic-form/components/form-chips/form-chips.component';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { DynamicFieldTypes } from '../../enums/dynamic-field-types.enum';

const components: { [type: string]: Type<Field> } = {};
//     = {
//     'button': FormButtonComponent,
//     'input': FormInputComponent,
//     'select': FormSelectComponent,
//     'datetimepicker': FormDateTimePickerComponent,
//     'attrs-tags': FormAttrsTagsComponent,
//     'daterange': FormDateRangeComponent,
//     'checkbox': FormCheckboxComponent,
//     'chips': FormChipsComponent
// };

@Directive({
    selector: '[appDynamicField]',
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
    @Input()
    config: FieldConfig;

    @Input()
    group: FormGroup;

    component: ComponentRef<Field>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
    ) {
        components[DynamicFieldTypes.Button] = FormButtonComponent;
        components[DynamicFieldTypes.Input] = FormInputComponent;
        components[DynamicFieldTypes.Select] = FormSelectComponent;
        components[DynamicFieldTypes.DateTimePicker] = FormDateTimePickerComponent;
        components[DynamicFieldTypes.AttrsTags] = FormAttrsTagsComponent;
        components[DynamicFieldTypes.DateRange] = FormDateRangeComponent;
        components[DynamicFieldTypes.Checkbox] = FormCheckboxComponent;
        components[DynamicFieldTypes.Chips] = FormChipsComponent;
    }

    ngOnChanges() {
        if (this.component) {
            this.component.instance.config = this.config;
            this.component.instance.group = this.group;
        }
    }

    ngOnInit() {
        if (!components[this.config.type]) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `Trying to use an unsupported type (${this.config.type}).
        Supported types: ${supportedTypes}`,
            );
        }
        const component = this.resolver.resolveComponentFactory<Field>(components[this.config.type]);
        this.component = this.container.createComponent(component);
        this.component.instance.config = this.config;
        this.component.instance.group = this.group;
    }
}
