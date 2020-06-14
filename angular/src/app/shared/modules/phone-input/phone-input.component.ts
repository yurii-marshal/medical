import {
    Component,
    Input,
    OnInit,
    Host,
    SkipSelf,
} from '@angular/core';
import {
    ControlValueAccessor,
    ControlContainer,
} from '@angular/forms';
import { createValueAccessorProvider } from '../../helpers/create-ng-value-accessor-provider';

/**
 * 'Phone Input' Component
 * Location:
 * -------------------
 * **PatientNumberInputModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/phone-input</example-url>
 *
 * @example
 * <app-phone-input formControlName="phone"></app-phone-input>
 */
@Component({
    selector: 'app-phone-input',
    providers: [createValueAccessorProvider(PhoneInputComponent)],
    templateUrl: './phone-input.component.html',
    styleUrls: ['./phone-input.scss'],
})

export class PhoneInputComponent implements OnInit, ControlValueAccessor {

    @Input() formControlName: string;

    public onChange;
    public onTouched;

    public inputValue: string;

    constructor(
        @Host() @SkipSelf()
        private controlContainer: ControlContainer,
    ) {
    }

    public onInputChange(value) {
        this.onChange(value);
    }

    ngOnInit() {
    }

    writeValue(value: string): void {
        this.inputValue = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

}
