import { Observable } from 'rxjs';
import {
    Component,
    OnInit,
    Output,
    EventEmitter,
    Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import {
    debounceTime,
    distinctUntilChanged,
    flatMap,
    filter,
    map,
} from 'rxjs/operators';
import { StatesDictionaryType } from '../../endpoints/core/settings-dictionaries/setting-dictionaries.interface';
import { SettingDictionariesEndpointsService } from '../../endpoints/core/settings-dictionaries/setting-dictionaries.endpoints';

/**
 * 'Phone Input' Component
 * Location:
 * -------------------
 * **StateAutocompleteModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/state-autocomplete</example-url>
 *
 * @example
 * <app-state-autocomplete></app-state-autocomplete>
 */
@Component({
    selector: 'app-state-autocomplete',
    templateUrl: './state-autocomplete.component.html',
})

export class StateAutocompleteComponent implements OnInit {
    readonly debounceTime = 300;
    public statesDictionaries$: Observable<StatesDictionaryType[]>;
    public stateInputFormControl = new FormControl();
    @Output() selectedState = new EventEmitter<StatesDictionaryType>();

    constructor(private settingDictionaries: SettingDictionariesEndpointsService) {
    }

    public _currentSelectedState: StatesDictionaryType;

    /** Predefined or passed value for state-autocomplete */
    @Input() set currentSelectedState(value: StatesDictionaryType) {
        this._currentSelectedState = value;
        this.stateInputFormControl.setValue(value);
    }

    ngOnInit() {
        this.statesDictionaries$ = this.stateInputFormControl.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                filter((value) => typeof value === 'string'),
                distinctUntilChanged(),
                flatMap((searchText: string) => {
                    this._currentSelectedState = null;
                    if (!searchText) {
                        return of({byId: {}, allIds: []});
                    }
                    return this.settingDictionaries.getStatesDictionary(searchText);
                }),
                map((results) => {
                    return results.allIds.map((stateId) => results.byId[stateId]);
                }),
            );
    }

    public onMatAutocompleteClosed(): void {
        if (!this._currentSelectedState) {
            this.selectedState.emit(null);
            this.stateInputFormControl.setValue('');
        }
    }

    public onStateSelected(event): void {
        this._currentSelectedState = event.option.value;
        this.selectedState.emit(event.option.value);
    }

    public displayFn(state: StatesDictionaryType): string | null {
        return state && state.id ? state.id : null;
    }

}
