import {
    Component,
    OnInit,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
} from '@angular/forms';

@Component({
    selector: 'app-assign-pdf-field',
    templateUrl: './demo-assign-pdf-field.component.html',
    styleUrls: ['./demo-assign-pdf-field.component.scss'],
})
export class DemoAssignPdfFieldComponent implements OnInit {
    public demoFormGroup: FormGroup;
    public items: FormArray;
    public formJSON: string;

    constructor(private formBuilder: FormBuilder) {
        this.demoFormGroup = this.formBuilder.group({
            items: this.formBuilder.array([this.createItem(), this.createItem()]),
        });
        this.onSubmit();
    }

    ngOnInit() {
    }

    public getControls() {
        return (this.demoFormGroup.get('items') as FormArray).controls;
    }

    public createItem(): FormGroup {
        return this.formBuilder.group({
            headerControl: 'Some header',
            mapControl: '${VAL}',
        });
    }

    public addItem(): void {
        this.items = this.demoFormGroup.get('items') as FormArray;
        this.items.push(this.createItem());
    }

    public onAssignFieldFocus(control) {
        console.log(control);
    }

    public onSubmit(): void {
        if (!this.demoFormGroup.get('items').valid) {
            this.formJSON = 'All mapping fields are required!';
        } else {
            this.formJSON = JSON.stringify(this.demoFormGroup.get('items').value);
        }
    }

}
