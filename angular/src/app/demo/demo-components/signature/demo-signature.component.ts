import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-demo-signature',
    templateUrl: './demo-signature.component.html',
    styleUrls: ['./demo-signature.component.scss'],
})
export class DemoSignatureComponent implements OnInit {

    public form: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            signature: [null, Validators.required],
        });
    }

    public onSubmit() {
        console.log(this.form);
    }

}
