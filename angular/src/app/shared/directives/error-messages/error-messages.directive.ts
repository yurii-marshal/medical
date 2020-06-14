import {
    Directive,
    OnDestroy,
    Input,
    OnInit,
    ElementRef,
} from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 *
 * ErrorMessagesDirective determine which error should be appear.
 * Child elements should have attr 'data-error-message' with value equal validation name
 *
 * Location:
 * -------------------
 * **ErrorMessagesDirective**
 * <example-url>http://niko.loc:8082/v2#/demo-components/error-messages</example-url>
 *
 * @example
 *
 *  <mat-form-field>
 *      <input matInput
 *             placeholder="Subject:"
 *             type="text"
 *             email
 *             autocomplete="off"
 *             formControlName="subject"
 *      />
 *       <mat-error [appErrorMessages]="helpdescForm.controls.subject">
 *           <div data-error-message="required"> This field is required.</div>
 *           <div data-error-message="email"> This value is not email.</div>
 *       </mat-error>
 *  </mat-form-field>
 *
 */
@Directive({
    selector: '[appErrorMessages]',
})

export class ErrorMessagesDirective implements OnInit, OnDestroy {

    @Input() appErrorMessages: FormControl;

    constructor(
        private elRef: ElementRef,
    ) {}

    ngOnInit() {
        this.determineToShowErrors();
        this.appErrorMessages.valueChanges.subscribe(() => {
            this.determineToShowErrors();
        });
    }

    public determineToShowErrors() {
        if (this.appErrorMessages.errors) {
            let errorShown = false;

            this.elRef.nativeElement.querySelectorAll('[data-error-message]').forEach((el) => {
                const attrData = el.getAttribute('data-error-message');

                if (attrData &&
                    this.appErrorMessages.errors[attrData] &&
                    !errorShown
                ) {
                    el.style.display = 'block';
                    errorShown = true;
                } else {
                    el.style.display = 'none';
                }
            });
        }
    }

    ngOnDestroy() {}
}
