import { Component, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';

@Component({
    selector: 'app-email-input-tags',
    templateUrl: './demo-email-input.component.html',
    styleUrls: ['./demo-email-input.component.scss'],
})
export class DemoEmailInputComponent implements OnInit {

    public form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            email: this.fb.control(''),
        });
    }

    ngOnInit() {
    }

}
