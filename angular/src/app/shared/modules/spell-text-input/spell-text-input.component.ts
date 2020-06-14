import {
    Component,
    ElementRef,
    forwardRef,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-spell-text-input',
    templateUrl: './spell-text-input.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SpellTextInputComponent),
        multi: true,
    }],
})

export class SpellTextInputComponent implements ControlValueAccessor {

    @ViewChild('inputsContainer') inputsContainerEl: ElementRef;
    public inputClassName = 'verification-code-input';
    public inputsCount = 6;
    private _value: string = null;
    // Function to call when the model changes.
    onChange = (code: string) => {
    }
    // Function to call when the input is touched (when a star is clicked).
    onTouched = () => {
    }

    constructor() {
    }

    public paste(eventText) {
        if (eventText) {
            setTimeout(() => {
                const pasteText = eventText.trim().replace(/ /g, '').slice(0, 6);

                if (pasteText.length === this.inputsCount) {
                    this.onChange(pasteText);
                }

                this.writeValue(pasteText);

                this.inputsContainerEl.nativeElement.getElementsByClassName(this.inputClassName)[5].focus();
            });
        }
    }

    // Allows Angular to update the model.
    // Update the model and changes needed for the view here.
    writeValue(code: string): void {
        const inputsCollection = this.inputsContainerEl.nativeElement.getElementsByClassName(this.inputClassName);

        Array.from(inputsCollection).forEach((inputEl: any) => {
            inputEl.value = '';
        });

        this._value = null;

        if (code && code.length <= this.inputsCount) {
            this._value = code;

            code.split('').forEach((chart, index) => {
                inputsCollection[index].value = chart;
            });
        }
    }

    // Allows Angular to register a function to call when the model changes.
    // Save the function as a property to call later here.
    registerOnChange(fn: (code: string) => void): void {
        this.onChange = fn;
    }

    // Allows Angular to register a function to call when the input has been touched.
    // Save the function as a property to call later here.
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public onCodeChange(event) {
        const codeStr = Array.from(event.target.parentNode.getElementsByClassName(this.inputClassName)).map((element: any) => {
            return element.value;
        }).join('');

        if (codeStr.length === this.inputsCount) {
            this._value = codeStr;
        } else {
            this._value = null;
        }

        this.onChange(this._value);
    }

    public onRemoveDigit(event) {
        const el = event.target;

        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);

        if (/[a-z0-9]/i.test(charStr) || charCode === 8) {
            el.value = '';
        }
    }

    public onClickBackspace(event) {
        const charCode = event.which || event.keyCode;
        let el = event.target;

        if (charCode === 8) {
            while (el) {
                el = el.previousSibling;

                if (el && el.classList && el.classList.contains(this.inputClassName)) {
                    el.focus();
                    break;
                }
            }
        }
    }

    public onEnterChart(event) {
        const charCode = event.which || event.keyCode;
        const charStr = String.fromCharCode(charCode);

        let el = event.target;

        if (/[a-z0-9]/i.test(charStr)) {
            while (el) {
                el = el.nextSibling;

                if (el && el.classList && el.classList.contains(this.inputClassName)) {
                    el.focus();
                    break;
                }
            }
        }
    }
}
