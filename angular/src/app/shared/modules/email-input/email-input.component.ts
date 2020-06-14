import {
    Component,
    Input,
    OnInit,
    Host,
    SkipSelf,
    AfterViewInit,
} from '@angular/core';
import {
    ControlValueAccessor,
    ControlContainer,
    FormControl,
    Validators,
} from '@angular/forms';
import { createValueAccessorProvider } from '../../helpers/create-ng-value-accessor-provider';

/**
 * Use this component for inputs with type "email".
 * Location:
 * -------------------
 * **EmailInputModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/email-input</example-url>
 *
 * @example
 *  <app-email-input formControlName="email"></app-email-input>
 */
@Component({
    selector: 'app-email-input',
    providers: [createValueAccessorProvider(EmailInputComponent)],
    templateUrl: './email-input.component.html',
})

export class EmailInputComponent implements OnInit, ControlValueAccessor, AfterViewInit {
    readonly mailRegExp =
        new RegExp('^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)' +
            '|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.' +
            '[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');

    public emailFormControl: FormControl;

    @Input() class = '';
    @Input() required = false;
    @Input() formControlName: string;

    constructor(
        @Host() @SkipSelf()
        private controlContainer: ControlContainer,
    ) {
    }

    ngAfterViewInit() {
        if (this.controlContainer && this.formControlName) {
            if (!this.required) {
                this.emailFormControl.setValidators(Validators.pattern(this.mailRegExp));
            } else {
                this.emailFormControl.setValidators(Validators.compose(
                    [Validators.pattern(this.mailRegExp), Validators.required]),
                );
            }
        }
    }

    ngOnInit() {
        if (this.controlContainer && this.formControlName) {
            this.emailFormControl = this.controlContainer['form'].controls[this.formControlName];
        } else {
            this.emailFormControl = new FormControl();
            throw new Error('app-email-input can not be used without form (formControlName is missing)');
        }
    }

    writeValue(value: string): void {
    }

    registerOnChange(fn: any): void {
    }

    registerOnTouched(fn: any): void {
    }

}
