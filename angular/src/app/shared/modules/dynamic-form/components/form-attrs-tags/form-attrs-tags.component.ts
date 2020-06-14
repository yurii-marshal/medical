import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'app-form-attrs-tags',
  styleUrls: ['./form-attrs-tags.component.scss'],
  template: `
    <div
      class="dynamic-field form-attrs-tags"
      [formGroup]="group">
      <label class="dynamic-label">{{ config.label }}:</label>
        <app-attrs-tags
            [inputWidth]="400"
            [disableTagCreate]="false">
        </app-attrs-tags>
    </div>
  `,
})
export class FormAttrsTagsComponent implements Field {
  config: FieldConfig;
  group: FormGroup;
}
