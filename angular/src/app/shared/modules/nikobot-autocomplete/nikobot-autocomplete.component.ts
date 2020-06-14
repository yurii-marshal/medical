import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ElementRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { SearchBoxStoreService } from '../../stores/search-box-store.service';
import { NikobotAutocompleteService } from './nikobot-autocomplete.service';
import {
    Action,
    AutocompleteOptions,
    LookForSpecialCharResult,
    SearchBoxParams,
} from './nikobot-autocomplete.config';
import { PatientsState, initPatientsState } from '../../endpoints/core/patient/patient.interfaces';
import { UsersState, initUsersState } from '../../endpoints/core/users/users.interfaces';


@Component({
    selector: 'app-nikobot-autocomplete',
    templateUrl: './nikobot-autocomplete.component.html',
    styleUrls: ['./nikobot-autocomplete.component.scss'],
})

export class NikobotAutocompleteComponent implements OnInit, OnDestroy {
    public searchBoxParams: SearchBoxParams;
    public currentListType: string;
    public patientsState: PatientsState = initPatientsState();
    public usersState: UsersState = initUsersState();
    public actionsList: Action[] = [];
    @Input() autocompleteOptions: AutocompleteOptions;
    @Output() toggleAutocomplete = new EventEmitter<boolean>();
    private searchBoxSubscription: Subscription;
    private clickOutside: Subscription;

    constructor(
        private elementRef: ElementRef,
        private nikobotAutocompleteService: NikobotAutocompleteService,
        private searchBoxStore: SearchBoxStoreService,
    ) {
    }

    ngOnInit() {
        /**
         * @description subscription on searchBox$ BehaviorSubject to watch entered text
         * @type {Subscription}
         */
        this.searchBoxSubscription = this.searchBoxStore.searchBox$
            .subscribe({
                next: (params: SearchBoxParams) => {
                    if (params && params.searchBoxText) {
                        this.searchBoxParams = params;
                        this.generateAutocompleteList();
                    } else {
                        this.toggleAutocomplete.emit(false);
                    }
                },
            });

        /**
         * @description close autocomplete on click outside
         * @type {Subscription}
         */
        this.clickOutside = fromEvent(document, 'click')
            .subscribe((event: MouseEvent) => {
                if (!this.elementRef.nativeElement.contains(event.target)) {
                    this.toggleAutocomplete.emit(false);
                }
            });
    }

    ngOnDestroy() {
        this.searchBoxSubscription.unsubscribe();
        this.clickOutside.unsubscribe();
    }

    public isKeyCharTyped(): LookForSpecialCharResult {
        const params = {
            str: this.searchBoxParams.searchBoxText,
            options: this.autocompleteOptions,
            targetElement: this.searchBoxParams.searchBoxElement,
        };

        return this.nikobotAutocompleteService.lookForSpecialChar(params);
    }

    public generateAutocompleteList(): void {
        const options = this.isKeyCharTyped();

        switch (options.type) {
            case 'patient':
                this.nikobotAutocompleteService.getPatients(options.input)
                    .subscribe(
                        (res: PatientsState) => {
                            this.patientsState = res;
                            if (this.patientsState.patients.allIds.length) {
                                this.currentListType = 'patient';
                                this.toggleAutocomplete.emit(true);
                            } else {
                                this.toggleAutocomplete.emit(false);
                            }
                        },
                        () => {
                        },
                        () => {
                        },
                    );
                break;

            case 'user':
                this.nikobotAutocompleteService.getUsers(options.input)
                    .subscribe(
                        (res: UsersState) => {
                            this.usersState = res;
                            if (this.usersState.users.allIds.length) {
                                this.currentListType = 'user';
                                this.toggleAutocomplete.emit(true);
                            } else {
                                this.toggleAutocomplete.emit(false);
                            }
                        },
                        () => {
                        },
                        () => {
                        },
                    );
                break;

            case 'action':
                this.actionsList = this.nikobotAutocompleteService.getActions(options.input);
                if (this.actionsList.length) {
                    this.currentListType = 'action';
                    this.toggleAutocomplete.emit(true);
                } else {
                    this.toggleAutocomplete.emit(false);
                }
                break;

            default:
                this.currentListType = null;
                this.toggleAutocomplete.emit(false);
                break;
        }
    }

    public onItemClick($event: Event, item: any): void {
        $event.stopPropagation();

        this.searchBoxParams.searchBoxText = this.nikobotAutocompleteService.userChoiceHandler(
            item,
            this.currentListType,
            this.searchBoxParams.searchBoxText,
            this.searchBoxParams.searchBoxElement,
        );

        this.searchBoxStore.updateSearchBoxParams({
            searchBoxElement: this.searchBoxParams.searchBoxElement,
            searchBoxSelectionStart: this.searchBoxParams.searchBoxSelectionStart,
            searchBoxText: this.searchBoxParams.searchBoxText,
        });
    }

}
