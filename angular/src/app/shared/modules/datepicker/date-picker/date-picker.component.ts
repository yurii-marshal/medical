import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormGroup,
} from '@angular/forms';
import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Moment, utc } from 'moment';
import {
    ControlValueAccessorProviderFactory,
    local,
    MomentParseFunction,
    OnChangeHandler,
    OnTouchedHandler,
    ValidatorProviderFactory,
} from '../common';
import { DatePickerPanelComponent } from '../date-picker-panel/date-picker-panel.component';

type datePickerMode = 'date' | 'datetime' | 'time';

const dateParseData = {
    separators: ['/', '\\', '-', '.'],
    day: ['DD', 'D'],
    month: ['MM', 'M'],
    year: ['YYYY', 'YY'],
};

function generateDateParseFormatsFromParts(firstPart: string[], secondPart: string[], thirdPart: string[]): string[] {
    const result: string[] = [];

    for (const separator of dateParseData.separators) {
        for (const third of thirdPart) {
            for (const second of secondPart) {
                for (const first of firstPart) {
                    result.push(`${first}${separator}${second}${separator}${third}`);
                }
            }
        }
    }

    return result;
}

function generateDateParseFormats(): string[] {
    return [
        ...generateDateParseFormatsFromParts(dateParseData.month, dateParseData.day, dateParseData.year),
        ...generateDateParseFormatsFromParts(dateParseData.day, dateParseData.month, dateParseData.year),
        ...generateDateParseFormatsFromParts(dateParseData.year, dateParseData.month, dateParseData.day),
        ...generateDateParseFormatsFromParts(dateParseData.year, dateParseData.day, dateParseData.month),
    ];
}

const parseFormat: { [type: string]: string[] } = {
    date: generateDateParseFormats(),
    datetime: ['L hh:mm:ss'],
    time: ['H:M', 'hh:mm A', 'LT', 'LTS'],
};

const defaultFormat: { [type: string]: string; } = {
    date: 'L',
    datetime: 'L hh:mm:ss',
    time: 'LT',
};

export type ParserFunction = (value: any, parseFn: MomentParseFunction) => Moment;

/**
 * Parses the given value as date using moment.js.
 * If value cannot be parsed the invalid Moment object is returned.
 * The calling code should not assume if the method returns local or utc value and
 * must convert value to corresponding form itself.
 */
function parserFabric(mode: datePickerMode, format: string): ParserFunction {
    return (value: any, parseFn: MomentParseFunction): Moment => {
        parseFn = parseFn || utc;

        if (value === null || value === undefined || value === '') {
            return null;
        }

        const formatsToParse = parseFormat[mode || 'date'];
        return parseFn(value, [format, ...formatsToParse], true);
    };
}

/**
 * DateTime Picker is a custom and highly customizable component written on TypeScript without any jQuery code.
 *
 * You can specify mode ('date' / 'time' / 'datetime') and other Input() options and use it anywhere in the project.
 *
 * Input field designed using Material input component.
 *
 * Location:
 * -------------------
 * **DateTimePickerModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/datetimepicker</example-url>
 *
 * @example
 * <app-datetimepicker
 *                 placeholder="search date"
 *                 mode="date"
 *                 [showTodayButton]="true">
 * </app-datetimepicker>
 */
@Component({
    selector: 'app-datetimepicker',
    providers: [ControlValueAccessorProviderFactory(DatePickerComponent), ValidatorProviderFactory(DatePickerComponent)],
    templateUrl: './date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
})

export class DatePickerComponent implements ControlValueAccessor, OnInit {
    /** DateTime Picker mode */
    @Input() mode: 'date' | 'datetime' | 'time' = 'date';
    /** Display Date mode - the original screen of datepicker */
    @Input() displayDateMode: 'day' | 'month' | 'year' = 'day';
    /** Display 'Today' button */
    @Input() showTodayButton = true;
    /** Time formating mode ("AM / PM" or 24h) */
    @Input() isMeridiem = true;
    /** "Disabled" mode for DateTimePicker */
    @Input() disabled = false;
    /** Custom class for DateTimePicker input */
    @Input() inputClass: string;
    /** Custom placeholder for DateTimePicker */
    @Input() placeholder: string;
    /** Custom interval for minutes (up & down - buttons) */
    @Input() interval = 1;
    /** Minimum date range */
    @Input() minRange: Moment = null;
    /** Maximum date range */
    @Input() maxRange: Moment = null;
    /** Display image inside DateTimePicker input */
    @Input() displayImage = false;
    /** Display 'Clear' button */
    @Input() displayClearButton = false;
    /** Position of image (left / right) */
    @Input() imagePosition: 'left' | 'right' = 'right';
    /** @ignore */ onChange: OnChangeHandler;
    /** @ignore */ onTouched: OnTouchedHandler;
    /** @ignore */ inputText = '';
    /** @ignore */ isPopup = false;
    /** @ignore */ positionTop = 65;
    /** @ignore */ positionLeft = 0;
    form: FormGroup;
    private _value: Moment;
    private parseValue: ParserFunction;
    @ViewChild('dateTimeInput') private input: ElementRef;
    @ViewChild(DatePickerPanelComponent) private panel: DatePickerPanelComponent;
    private format: string;

    /** @ignore */
    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            input: fb.control(''),
        });
    }

    /** Date Format */
    @Input() set dateFormat(value: string) {
        if (value) {
            defaultFormat[this.mode] = value;
        }
    }

    /** Errors Description */
    @Input() set errors(value: string) {
        if (value) {
            this.form.controls['input'].setErrors({value: true});
        } else {
            this.form.controls['input'].setErrors(null);
        }
    }

    /** Format based on date picker current type. */
    private get currentFormat(): string {
        return this.format || defaultFormat[this.mode || 'date'];
    }

    ngOnInit(): void {
        this.parseValue = parserFabric(this.mode, this.currentFormat);
    }

    definePanelPosition() {
        const bottomSpace = window.innerHeight - this.input.nativeElement.getBoundingClientRect().top - 450;
        const rightSpace = window.innerWidth - this.input.nativeElement.getBoundingClientRect().left - 350;
        this.positionLeft = rightSpace > 0 ? 0 : -130;
        switch (this.mode) {
            case 'date':
                this.positionTop = bottomSpace > 0 ? 65 : -390;
                break;
            case 'time':
                this.positionTop = bottomSpace > 0 ? 65 : -280;
                break;
            case 'datetime':
                this.positionTop = bottomSpace > 0 ? 65 : -675;
                break;
        }
    }

    writeValue(value: string): void {
        if (value) {
            this.raiseOnChange(value);
        }
    }

    registerOnChange(fn: OnChangeHandler): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: OnTouchedHandler): void {
        this.onTouched = fn;
    }

    /** Raises handers registered by ControlValueAccessor.registerOnChange method with converted value. */
    raiseOnChange(value: string): void {
        const parsed = this.parseValue(value, local);

        if (!parsed) {
            this._value = null;
            this.updateControlText('');
        } else if (parsed.isValid()) {
            this._value = this.convertValue(parsed);

            const formatted = this.formatValue(this._value);
            this.updateControlText(formatted);
        } else {
            this.updateControlText(value);
        }

        if (this.onChange) {
            this.onChange(this.convertValue(parsed));
        }
    }


    openPopup(): void {
        if (!this.isPopup) {
            this.definePanelPosition();
            event.stopPropagation();
            this.isPopup = true;

            const val = this._value;

            this.panel.writeValue(val);
            this.panel.registerOnChange((v: any) => this.raiseOnChange(v));
        }
    }

    closePopup(): void {
        this.isPopup = false;
    }

    clear(): void {
        this.raiseOnChange('');
    }

    getCSSClasses(): string {
        const classArray = [];
        classArray.push('datepicker-actions__input');
        if (this.displayImage) {
            classArray.push('calendar-image');
        }
        if (this.displayImage && this.imagePosition === 'left') {
            classArray.push('calendar-image-left');
        }
        if (this.inputClass) {
            classArray.push(this.inputClass);
        }
        return classArray.join(' ');
    }

    private validate(c: AbstractControl): { [key: string]: any } {
        const value = this.parseValue(c.value, local);
        const err = {
            parseError: 'value has not been parsed',
        };

        if (c.pristine && !c.touched) {
            return null;
        }

        return value && !value.isValid() ? err : null;
    }

    /**
     * Formats input value based on current input type.
     * Value converted to local before formatting.
     */
    private formatValue(value: Moment): string {
        if (!value || !value.isValid()) {
            return '';
        }

        const mode: 'date' | 'datetime' | 'time' = this.mode || 'date';

        if (mode === 'date') {
            return value.clone().format(this.currentFormat);
        }

        return value.clone().local().format(this.currentFormat);
    }

    private updateControlText(formattedValue: string): void {
        this.form.patchValue({
            input: formattedValue,
        });
    }

    private convertValue(value: Moment): Moment {
        if (!value || !value.isValid()) {
            return value;
        }

        const mode: 'date' | 'datetime' | 'time' = this.mode || 'date';
        if (mode === 'date') {
            return utc({year: value.year(), month: value.month(), date: value.date()});
        } else {
            return value.clone().utc();
        }
    }
}
