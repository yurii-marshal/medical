import { Component } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-demo-error-messages',
    templateUrl: './demo-error-messages.component.html',
    styleUrls: ['./demo-error-messages.component.scss'],
})
export class DemoErrorMessagesComponent {

    public demoForm: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) {
        this.demoForm = fb.group(
            {
                text: ['', [Validators.required, Validators.email]],
            },
        );
    }
}
