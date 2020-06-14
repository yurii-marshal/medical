import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    ControlValueAccessor,
    FormControl,
    NG_VALUE_ACCESSOR,
    Validators,
} from '@angular/forms';
import { ClientFormValue } from '@shared/endpoints/core/dictionaries/client-form-values.interface';
import {
    MAT_MENU_SCROLL_STRATEGY,
    MatIconRegistry,
    MatMenuTrigger,
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import {
    debounceTime,
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AssignPdfFieldService } from '@shared/modules/assign-pdf-field/assign-pdf-field.service';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
    return () => overlay.scrollStrategies.block();
}

/**
 * Use 'Assign Pdf Field' Component for adding a value from mapping forms dictionary.
 * This component uses 'required' validation only. To extend please write a handler
 * for any validation type
 *
 * Required properties:
 * [formControlName]
 *
 * Location:
 * -------------------
 * **AssignPdfFieldModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/assign-pdf-field</example-url>
 *
 * @example
 * <app-assign-pdf-field
 *      formControlName="mappingControlName"
 *      (assignFieldFocus)="onAssignFieldFocus(item)"
 *      [required]="true"
 *      >
 * </app-assign-pdf-field>
 */
@Component({
    selector: 'app-assign-pdf-field-form',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AssignPdfFieldComponent),
            multi: true,
        },
        {
            provide: MAT_MENU_SCROLL_STRATEGY,
            useFactory: scrollFactory,
            deps: [Overlay],
        },
    ],
    templateUrl: './assign-pdf-field.component.html',
    styleUrls: ['./assign-pdf-field.component.scss'],
})

export class AssignPdfFieldComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    /** Get validator 'required' */
    @Input() required = false;
    /** Get name from user's control */
    @Input() formControlName: string;
    /** Emit event on focus of the input */
    @Output() assignFieldFocus = new EventEmitter();

    public formInputList: ClientFormValue[] = [];
    public dictionaryResults: ClientFormValue[] = [];

    public mappingFormControl = new FormControl('', []);
    public valueFormControl = new FormControl('');

    private destroy$: Subject<boolean> = new Subject<boolean>();
    private readonly debounceTime = 200;

    onChange: any = () => {
    }
    onTouched: any = () => {
    }

    constructor(
        private sanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry,
        private assignPdfFieldService: AssignPdfFieldService,
    ) {
    }

    ngOnInit() {
        this.assignPdfFieldService.pdfDictionary$.subscribe((result) => {
            this.dictionaryResults = result;
            this.formInputList = this.dictionaryResults.slice();
        });

        // set validators to input
        if (this.formControlName) {
            if (this.required) {
                this.valueFormControl.setValidators([Validators.required]);
            }
        } else {
            throw new Error('app-assign-pdf-field can not be used without form formControlName is missing)');
        }

        this.matIconRegistry.addSvgIcon('searchIcon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/search.svg'));

        this.mappingFormControl.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                filter((value) => typeof value === 'string'),
                map((searchText: string) => {
                    return this.dictionaryResults.filter((item) => item.name.indexOf(searchText) >= 0);
                }),
                takeUntil(this.destroy$),
            )
            .subscribe((result: ClientFormValue[]) => {
                this.formInputList = result;
            });

        this.valueFormControl.valueChanges
            .subscribe((val: string) => {
                this.onChange(val);
            });
    }

    public onFormInputChosen(el: ClientFormValue) {
        this.concatMappingField(el);
        this.trigger.closeMenu();
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    writeValue(signature: string): void {
        this.valueFormControl.patchValue(signature);
    }

    registerOnChange(fn: () => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public concatMappingField(el: ClientFormValue) {
        const concatStr = this.valueFormControl.value + `#{${el.name}}`;
        this.valueFormControl.patchValue(concatStr);
    }

    public onValueFormControlFocus() {
        this.assignFieldFocus.emit();
    }
}
