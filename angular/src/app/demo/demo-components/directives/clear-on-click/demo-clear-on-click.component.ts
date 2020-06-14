import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
    selector: 'app-demo-clear-on-click',
    templateUrl: './demo-clear-on-click.component.html',
    styleUrls: ['./demo-clear-on-click.component.scss'],
})
export class DemoClearOnClickComponent implements OnInit {
    public form: FormGroup;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            name: new FormControl(''),
        });
    }
}
