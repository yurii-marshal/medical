import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { DictionariesEndpointsService } from '../../endpoints/core/dictionaries/dictionaries.endpoints';
import {
    FormControl,
} from '@angular/forms';
import {
    filter,
    switchMap,
    map,
    tap,
    debounceTime,
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { HttpGetZipCodesParams, ZipDictionaryType } from '../../endpoints/core/dictionaries/zip-codes.interface';
import { BehaviorSubject, Subscription } from 'rxjs';

/**
 * 'Zip-Autocomplete' Component
 * Location:
 * -------------------
 * **ZipAutocompleteModule**
 * <example-url>http://niko.loc:8082/v2#/demo-components/zip-autocomplete</example-url>
 *
 * @example
 * <app-zip-autocomplete></app-zip-autocomplete>
 */
@Component({
    selector: 'app-zip-autocomplete',
    templateUrl: './zip-autocomplete.component.html',
})

export class ZipAutocompleteComponent implements OnInit, OnDestroy {

    private currentSelectedZip: ZipDictionaryType | null = null;
    public zipDictionaries$: BehaviorSubject<ZipDictionaryType[]> = new BehaviorSubject([]);
    public searchText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
    private formControlSubscription: Subscription;
    private searchTextSubscription: Subscription;
    public blockNextPage = false;
    public zipInputFormControl = new FormControl();
    public countOfItems = 0;
    public params: HttpGetZipCodesParams = {
        pageIndex: 0,
        pageSize: 20,
        text: '',
    };

    /** Predefined or passe value */
    @Input() set setSelectedZip(value: ZipDictionaryType) {
        this.zipInputFormControl.setValue(value);
    }

    @Output() changeZip = new EventEmitter<ZipDictionaryType>();

    constructor(private dictionariesEndpointsService: DictionariesEndpointsService) {}

    ngOnInit() {
        this.formControlSubscription = this.zipInputFormControl.valueChanges
            .pipe(
                filter( (value) => !!value),
            )
            .subscribe((searchText) => {
                this.params.pageIndex = 0;
                this.blockNextPage = false;
                this.searchText$.next(searchText);
            });

        this.searchTextSubscription = this.searchText$.pipe(
                debounceTime(300),
                filter((value) => typeof value === 'string' && this.blockNextPage === false),
                tap(() => {
                    this.blockNextPage = true;
                    this.currentSelectedZip = null;
                }),
                switchMap((searchText: string) => {

                    if (searchText.length < 2) {
                        return of({
                            byId: {},
                            allIds: [],
                            count: 0,
                        });
                    }

                    this.params.text = searchText;

                    return this.dictionariesEndpointsService.getZipDictionary(this.params);
                }),
                map((results) => {
                    this.countOfItems = results.count;
                    return results.allIds.map((zipId) => results.byId[zipId]);
                }),
            )
            .subscribe((newOptions: ZipDictionaryType[]) => {
                let options: ZipDictionaryType[] = newOptions;

                if (this.params.pageIndex > 0) {
                    options = this.zipDictionaries$.getValue().concat(options);
                }

                if (this.countOfItems > options.length) {
                    this.blockNextPage = false;
                }

                this.params.pageIndex++;
                this.zipDictionaries$.next(options);
            });
    }

    ngOnDestroy() {
        if (this.formControlSubscription) {
            this.formControlSubscription.unsubscribe();
        }

        if (this.searchTextSubscription) {
            this.searchTextSubscription.unsubscribe();
        }
    }

    displayFn(zip: ZipDictionaryType): string | null {
        return zip ? zip.text : null;
    }

    onZipSelected(event) {
        this.currentSelectedZip = event.option.value;
        this.changeZip.emit(event.option.value);
    }

    onMatAutocompleteClosed() {
        if (!this.currentSelectedZip) {
            this.zipInputFormControl.setValue('');
            this.changeZip.emit(null);
        }
    }

    getNextPage() {
        this.searchText$.next(this.zipInputFormControl.value);
    }
}
