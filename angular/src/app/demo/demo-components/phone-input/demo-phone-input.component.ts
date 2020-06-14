import {
    Component,
    OnInit,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-demo-phone-input',
  templateUrl: './demo-phone-input.component.html',
  styleUrls: ['./demo-phone-input.component.scss'],
})
export class DemoPhoneInputComponent implements OnInit {

    public form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            phone: this.fb.control(''),
        });
    }

    ngOnInit() {
    }

}
