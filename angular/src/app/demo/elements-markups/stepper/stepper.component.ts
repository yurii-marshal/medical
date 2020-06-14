import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material';

/**
 * StepperComponent is component based on Material stepper.
 * Location:
 * -------------------
 * **StepperModule**
 * <example-url>http://niko.loc:8082/v2#/markups/stepper</example-url>
 *
 * Documentation [Angular Material's stepper](https://v5.material.angular.io/components/stepper/overview).
 *
 * [API reference for Angular Material stepper](https://v5.material.angular.io/components/stepper/api)
 *
 * `@Input() @.disabled: boolean` Disable stepper animation. By default false.
 *
 * `@Input() linear: boolean` To complete previous steps before proceeding to following steps. By default false.
 * See Linear [stepper](https://v5.material.angular.io/components/stepper/overview#linear-stepper)
 *
 * @example
 * <app-stepper></app-stepper>
 *
 */
@Component({
    selector: 'app-stepper',
    templateUrl: './stepper.component.html',
    styles: [
        `
            .actions {
                margin-bottom: 20px;
            }
        `,
    ],
})
export class StepperComponent implements OnInit, AfterViewInit {
    @ViewChild(MatHorizontalStepper)
    stepper: MatHorizontalStepper;

    public firstFormGroup: FormGroup;
    public secondFormGroup: FormGroup;

    constructor(
        private cdRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.firstFormGroup = this.formBuilder.group({
            firstCtrl: ['', Validators.required],
        });
        this.secondFormGroup = this.formBuilder.group({
            secondCtrl: ['', Validators.required],
        });
    }

    public ngAfterViewInit(): void {
        this.cdRef.detectChanges();
    }

    public onStepChange(): void {
        if (!this.stepper.selected.optional) {
            console.log('step changed');
        }
    }

    public setStepOptional(index: number, optional: boolean): void {
        const step = this.stepper._steps.find((item, i) => i === index);
        if (step) {
            step.optional = optional;
        }
    }

    public nextStep(): void {
        this.stepper.selected.completed = true;
        this.stepper.next();
        if (this.stepper.selected.optional) {
            this.stepper.next();
        }
    }

    public previousStep(): void {
        this.stepper.selected.completed = false;
        this.stepper.previous();
        if (this.stepper.selected.optional) {
            this.stepper.previous();
        }
    }

    public goToStep(index: number): void {
        this.stepper.selectedIndex = index;
    }

    public isNextStepButtonDisabled(): boolean {
        return !this.stepper._steps || this.stepper.selectedIndex === this.stepper._steps.length - 1;
    }

    public isPreviousStepButtonDisabled(): boolean {
        return this.stepper.selectedIndex === 0;
    }

    public resetStepper(): void {
        this.stepper.reset();
    }
}
