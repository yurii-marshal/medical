import {
    Component,
    Inject,
    Input,
    OnInit,
    AfterViewChecked,
    OnDestroy,
    ElementRef,
    ViewChild,
    ChangeDetectorRef,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';

import { NikoBotService } from './niko-bot.service';
import { Profile } from '@shared/interfaces/models/profile.model';
import { NikoBotActionRequest, NikoBotState, initNikoBotState } from '@shared/endpoints/nlp/nlp.interface';
import { UsersStoreService } from '@shared/stores/users-store.service';
import { SearchBoxStoreService } from '@shared/stores/search-box-store.service';
import { SearchBoxParams } from '@shared/modules/nikobot-autocomplete/nikobot-autocomplete.config';
import { AuthService } from '@app/auth/shared/services/auth.service';

@Component({
    selector: 'app-niko-bot',
    templateUrl: './niko-bot.component.html',
    styleUrls: ['./niko-bot.component.scss'],
})

export class NikoBotComponent implements OnInit, AfterViewChecked, OnDestroy {
    private tokenSubscription: Subscription;
    private routeChangeSubscription: Subscription;
    private typeAhead: Observable<object>;
    private typeAheadSubscription: Subscription;
    private clickOutside: Subscription;
    private searchBoxSubscription: Subscription;

    private _profileInfo: Profile;
    @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;

    public nikoBotForm: FormGroup;
    public chatOpened = false;

    public chatMessages: NikoBotState = initNikoBotState();
    public currentMessage: string;
    public inputSearchBox: any;
    public isAutocompleteVisible: boolean;

    /**
     * @description params for autocomplete to identify particular type of symbol(actually an items list type) or not
     * @type {patient: boolean; user: boolean; action: boolean}
     */
    public autocompleteOptions = {
        patient: true,
        user: true,
        action: true,
    };

    @Input()
    set profileInfo(profileData: Profile) {
        if (!profileData) {
            return ;
        }

        profileData.FullName = this.concatUserFullName(profileData.Name);
        this._profileInfo = profileData;
    }

    constructor(
        @Inject('moment') private moment,
        private elementRef: ElementRef,
        private cdRef: ChangeDetectorRef,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private nikoBotService: NikoBotService,
        private mentionedUsersService: UsersStoreService,
        private searchBoxStore: SearchBoxStoreService,
    ) {
        /**
         * @description - registration icons url for using in html attr
         */
        this.iconRegistry.addSvgIcon(
            'niko-bot-user',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/user-circle.svg'));
        this.iconRegistry.addSvgIcon(
            'niko-bot-operator',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/pluto_operator_1.svg'));
        this.iconRegistry.addSvgIcon(
            'hide-chat',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/hide_icon.svg'));
        this.iconRegistry.addSvgIcon(
            'clear-chat',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/images/default/clear_icon.svg'));

        this.nikoBotForm = fb.group({
            message: ['', []],
        });
    }

    ngOnInit() {

        /**
         * @description set uo greeting message
         */

        this.setStartMessage();

        /**
         * @description subscription on token$ BehaviorSubject to watch LOGIN & LOGOUT
         *  this.authService.token$ inherited from TokenService
         */
        this.tokenSubscription = this.authService.token$
            .subscribe({
                next: (token) => {
                    if (!token) {
                        this.clearChat();
                    }
                },
            });

        /**
         * @description adding class to main container for hiding main navigation
         */
        this.routeChangeSubscription = this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.chatOpened = false;
                }
            });

        /**
         * @description subscription on Type Event from search input
         */
        const searchBox = document.getElementById('chatSearchBox');
        this.typeAhead = fromEvent(searchBox, 'input') // input
            .pipe(
                map((e: KeyboardEvent | any) => {
                    if (e.keyCode !== 13) {
                        if (!this.inputSearchBox) {
                            this.inputSearchBox = e.target;
                        }

                        this.searchBoxStore.updateSearchBoxParams({
                            searchBoxElement: e.target,
                            searchBoxSelectionStart: e.target.selectionStart,
                            searchBoxText: e.target.value,
                        });

                        return e.target.value;
                    }

                    return '';
                }),
                debounceTime(10),
                distinctUntilChanged(),
            );

        this.typeAheadSubscription = this.typeAhead.subscribe(() => {});

        /**
         * @description subscription on searchBox$ BehaviorSubject to watch entered text
         * @type {Subscription}
         */
        this.searchBoxSubscription = this.searchBoxStore.searchBox$
            .subscribe({
                next: (params: SearchBoxParams) => {
                    if (params && params.searchBoxText) {
                        this.currentMessage = params.searchBoxText;
                        params.searchBoxElement.focus();
                    }
                },
            });

        /**
         * @description close chat window on click outside
         * @type {Subscription}
         */
        this.clickOutside = fromEvent(document, 'click')
            .subscribe((event: MouseEvent) => {
                if (this.chatOpened) {
                    if (!this.elementRef.nativeElement.contains(event.target)) {
                        this.chatOpened = false;
                    }
                }
            });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnDestroy() {
        this.tokenSubscription.unsubscribe();
        this.routeChangeSubscription.unsubscribe();
        this.typeAheadSubscription.unsubscribe();
        this.clickOutside.unsubscribe();
    }

    toggleAutocomplete(isAutocompleteVisible: boolean): void {
        this.isAutocompleteVisible = isAutocompleteVisible;
    }

    private setStartMessage(): void {
        const startMsgId = `NikoBot${this.moment().format()}`;
        this.chatMessages.msgs.byId[startMsgId] = {
            id: startMsgId,
            msgContent: `Hi, NikoBot here!
                   I hope that you are having a great day.
                   To learn more about what I can help you with type /`,
            createdBy: 'NikoBot',
            createdOn: this.moment().format(),
        };
        this.chatMessages.msgs.allIds.push(startMsgId);
    }

    private setNotFoundMessage(): void {
        const notFoundMsgId = `NikoBot${this.moment().format()}`;
        this.chatMessages.msgs.byId[notFoundMsgId] = {
            id: notFoundMsgId,
            msgContent: `I’m sorry, I don’t understand!
                         Type / to learn more about what I can help you with.`,
            createdBy: 'NikoBot',
            createdOn: this.moment().format(),
        };
        this.chatMessages.msgs.allIds.push(notFoundMsgId);
    }

    public toggleChat(): void {
        if (!this.chatOpened && this.chatMessages.msgs.allIds.length < 1) {
            this.setStartMessage();
        }
        this.chatOpened = !this.chatOpened;

        if (this.chatOpened) {
            this.elementRef.nativeElement.querySelector('#chatSearchBox').focus();
        }
    }

    public clearChat(): void {
        this.chatOpened = false;
        this.chatMessages = initNikoBotState();
        this.currentMessage = '';
    }

    public addUserMessage(str: string): void {
        const userMessageId = `${this._profileInfo.FullName}${this.moment().format()}`;
        this.chatMessages.msgs.byId[userMessageId] = {
            id: `${this._profileInfo.FullName}${this.moment().format()}`,
            msgContent: str.replace('#', '&#35;'), // parsed
            createdBy: this._profileInfo.FullName,
            msgTypeUser: true,
            createdOn: this.moment().format(),
        };
        this.chatMessages.msgs.allIds.push(userMessageId);
    }

    public submitAction(message: string) {

        if (message) {
            this.addUserMessage(message);
            this.currentMessage = '';

            const timeZone = this.moment().format('Z');
            const data: NikoBotActionRequest = {
                Text: this.mentionedUsersService.getAllIncomes(message),
                TimezoneOffset: timeZone.charAt(0) === '+'
                    ? `${timeZone.substring(1)}:00`
                    : `${timeZone}:00`,
            };

            this.nikoBotService.sendAction(data)
                 .subscribe(
                     (res: NikoBotState) => {

                         if (res.msgs.allIds.length) {

                             res.msgs.allIds.forEach((itemId) => {
                                 const item = res.msgs.byId[itemId];

                                 this.addMsgToList(item, itemId);

                                 if (res.attachments.allIds.length) {
                                     item.attachments.forEach((aId) => {

                                         const attachment = res.attachments.byId[aId];
                                         this.addAttachToList(attachment, aId);

                                     });
                                 }
                             });
                         }

                         if (!res.msgs.allIds.length) {
                             this.setNotFoundMessage();
                         }
                     },
                     () => {},
                     () => {
                         this.msgScrollDown();
                     });
        }
    }

    private addMsgToList(item, itemId) {
        if (item.titleLink) {
            item.goToRef = this.nikoBotService.goToRef(item.titleLink);
        }

        item.msgContent = this.nikoBotService.convertIdStrToName(item.msgContent);

        this.chatMessages.msgs.byId[itemId] = item;
        this.chatMessages.msgs.allIds.push(itemId);
    }

    private addAttachToList(attachment, aId) {
        if (attachment.titleLink) {
            attachment.goToRef = this.nikoBotService.goToRef(attachment.titleLink);
        }

        // transform part of string contains phone
        const strWithCorrectPhone = this.nikoBotService.transformPhoneStr(attachment.attachmentContent);
        // transform part of string contains id
        attachment.attachmentContent = this.nikoBotService.convertIdStrToName(strWithCorrectPhone);

        this.chatMessages.attachments.byId[aId] = attachment;
        this.chatMessages.attachments.allIds.push(aId);
    }

    private msgScrollDown(): void {
        setTimeout(() => {
            this.componentRef.directiveRef.scrollToBottom();
        }, 50);
    }

    private concatUserFullName(userName): string {
        return `${userName.FirstName} ${userName.LastName}`;
    }
}
