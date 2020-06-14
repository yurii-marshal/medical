import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Action,
    AutocompleteActionsList,
    EditedSubstrOptions,
    LookForSpecialCharParams,
    LookForSpecialCharResult,
    OptionsTypes,
} from './nikobot-autocomplete.config';
import { PatientEndpointsService } from '../../endpoints/core/patient/patient.endpoints';
import { UsersStoreService } from '../../stores/users-store.service';
import { UsersEndpointsService } from '../../endpoints/core/users/users.endpoints';
import { PatientsState } from '../../endpoints/core/patient/patient.interfaces';
import { UsersState } from '../../endpoints/core/users/users.interfaces';
import { MentionedUser } from '../../stores/users-store.interfaces';

@Injectable()
export class NikobotAutocompleteService {
    public actionsList = AutocompleteActionsList;

    constructor(
        private patientEndpointsService: PatientEndpointsService,
        private usersEndpointsService: UsersEndpointsService,
        private mentionedUsersService: UsersStoreService,
    ) { }

    public getPatients(term): Observable<PatientsState> {
        const params = {
            'filter.all': true,
            'filter.fullName': term,
            'pageIndex': 0,
            'pageSize': 24,
            'sortExpression': 'Name ASC',
        };

        return this.patientEndpointsService.getPatients(params);
    }

    public getUsers(term): Observable<UsersState> {
        const params = {
            'filter.fullName': term,
            'pageIndex': 0,
            'pageSize': 24,
        };

        return this.usersEndpointsService.getUsers(params);
    }

    public getActions(term): Action[] {
        return this.autocompleteQuerySearch(term, this.actionsList);
    }

    private autocompleteQuerySearch(query: string, list: Action[]): Action[] {
        return (query ? list.filter(this.filterSearchQuery(query)) : list);
    }

    private filterSearchQuery(query: string): any {
        return function filterFn(item: Action) {
            const itemName = item.name.toLowerCase();
            const searchQuery = query.trim().toLowerCase();

            return itemName.indexOf(searchQuery) !== -1;
        };
    }

    public lookForSpecialChar(params: LookForSpecialCharParams): LookForSpecialCharResult {
        const str = params.str;
        const options = params.options;
        const targetElement = params.targetElement;

        const result: LookForSpecialCharResult = { type: '', input: '' };
        const targetSubstr = this.getEditedSubstrOptions(str, targetElement).substr;

        if (targetSubstr) {
            // for patient
            const isShowPatientsRegExp = targetSubstr.length > 1 ?
                /\s#|^#/g :
                /\s#\s|^#\s|^#$|\s#$/g;
            const isTypePatient = options.patient
                ? isShowPatientsRegExp.exec(targetSubstr)
                : false;

            // for user
            const isShowUsersRegExp = targetSubstr.length > 1
                ? /\s@|^@/g :
                /\s@\s|^@\s|^@$|\s@$/g;
            const isTypeUser = options.user
                ? isShowUsersRegExp.exec(targetSubstr)
                : false;

            // for action
            const isShowActionsRegExp = targetSubstr.length > 1 ?
                /\s\/|^\//g :
                /\s\/\s|^\/\s|^\/$|\s\/$/g;
            const isTypeAction = options.action
                ? isShowActionsRegExp.exec(targetSubstr)
                : false;

            if (isTypePatient) {
                result.type = OptionsTypes.patient;
            } else if (isTypeUser) {
                result.type = OptionsTypes.user;
            } else if (isTypeAction) {
                result.type = OptionsTypes.action;
            }

            result.input = getNameWithSpace(targetSubstr);
        }

        function getNameWithSpace(string) {
            const inputVal = string.trim().slice(1);
            const indexOfCapitalLetter = /[A-Z]/g.exec(inputVal.slice(1))
                ? /[A-Z]/g.exec(inputVal.slice(1))['index']
                : -1;

            const editedIncome = inputVal[indexOfCapitalLetter + 1];
            return inputVal.replace(`${editedIncome}`, ` ${editedIncome}`).trim();
        }

        return result;
    }

    private getEditedSubstrOptions(str: string, targetElement: any): EditedSubstrOptions {
        const caretPos = targetElement.selectionStart;
        const nextSymbol = str.charAt(caretPos);

        const tmpSubstr = str.slice(0, caretPos);
        const closestSpaceIndex = tmpSubstr.lastIndexOf(' ', tmpSubstr.length - 1) !== -1
            ? tmpSubstr.lastIndexOf(' ', tmpSubstr.length - 1)
            : 0 ;

        const editedSubstrOptions = {
            substr: undefined,
            startIndex: undefined,
            caretPos: undefined,
        };

        if (!nextSymbol) {
            editedSubstrOptions.startIndex = closestSpaceIndex;
            editedSubstrOptions.caretPos = caretPos;
            editedSubstrOptions.substr = tmpSubstr.slice(closestSpaceIndex, caretPos);
        }

        return editedSubstrOptions;
    }

    /**
     * TODO find out proper place for this function
     * @desc - will be used in task modal
     * @param {string} str
     * @returns {string}
     */
    public convertToPatientName(str: string): string {
        if (!str) { return; }

        const patientRe = /#[A-Z, a-z]+\s[A-Z, a-z]+\<patient\:\d+\>/g;

        const patientCodeArr = str.match(patientRe);

        if (patientCodeArr && patientCodeArr.length) {
            patientCodeArr.forEach((i) => {
                const item = i.trim();
                const indexOfPatientCodeStart = item.indexOf('<');
                const substrWithName = item.substring(0, indexOfPatientCodeStart).split(' ').join('');

                const indexOfCodeStart = item.indexOf(':');
                const patientId = item.substring(indexOfCodeStart + 1, item.length - 1);

                const newMentionedUser = {
                    id: item.substring(0, indexOfPatientCodeStart).split(' ').join(''),
                    type: OptionsTypes.patient,
                    strForBack: `#${item.substring(1, indexOfPatientCodeStart)}<patient:${patientId}>`,
                    refId: patientId,
                };

                this.updateMentionedUsersArr(newMentionedUser);

                str = str.replace(item, substrWithName);
            });
        }

        return str;
    }

    public userChoiceHandler(item: any, type: string, searchStr: string, targetElement: any): string {
        const targetSubstr = this.getEditedSubstrOptions(searchStr, targetElement).substr;
        const substrRegPattern = `\\s${targetSubstr}\\s|^${targetSubstr}\\s|^${targetSubstr}$|\\s${targetSubstr}$`;
        const reg = new RegExp(substrRegPattern, 'g');

        if (type === OptionsTypes.patient) {
            const newMentionedUser = {
                id: `#${item.name.split(' ').join('')}`,
                type: OptionsTypes.patient,
                strForBack: `#${item.name}<patient:${item.id}>`,
                refId: item.id,
            };
            this.updateMentionedUsersArr(newMentionedUser);

            searchStr = this.replaceSubstr(searchStr,
                this.getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `#${item.name.split(' ').join('')}`,
            );

        } else if (type === OptionsTypes.user) {
            const newMentionedUser = {
                id: `@${item.name.split(' ').join('')}`,
                type: OptionsTypes.user,
                strForBack: `@${item.id}`,
                refId: item.id,
            };
            this.updateMentionedUsersArr(newMentionedUser);

            searchStr = this.replaceSubstr(searchStr,
                this.getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `@${item.name.split(' ').join('')}`,
            );

        } else if (type === OptionsTypes.action) {
            searchStr = this.replaceSubstr(searchStr,
                this.getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `/${item.name}`,
            );
        }

        return searchStr;
    }

    private replaceSubstr(
        searchStr: string,
        editedSubstrOptions: EditedSubstrOptions,
        reg: RegExp,
        strForReplace: string,
    ): string {
        let targetSubstr = searchStr.slice(editedSubstrOptions.startIndex, editedSubstrOptions.caretPos);
        const beforeTargetSubstr = editedSubstrOptions.startIndex === 0
            ? ''
            : searchStr.slice(0, editedSubstrOptions.startIndex + 1);
        const afterTargetSubstr = editedSubstrOptions.caretPos === searchStr.length
            ? ''
            : searchStr.slice(editedSubstrOptions.caretPos);

        targetSubstr = targetSubstr.replace(reg, strForReplace);

        return `${beforeTargetSubstr}${targetSubstr}${afterTargetSubstr}`;
    }

    private updateMentionedUsersArr(newMentionedUser: MentionedUser): void {
        const mentionedUsers = Object.assign([], this.mentionedUsersService.getMentionedUsers());

        if (!mentionedUsers.find((item) => newMentionedUser.id === item.id)) {
            mentionedUsers.push(newMentionedUser);
        }

        this.mentionedUsersService.updateMentionedUsers(mentionedUsers);
    }

}
