export default class customSearchAutocompleteService {
    constructor($q,
                $http,
                $interval,
                $state,
                $rootScope,
                coreUsersService,
                WEB_API_SERVICE_URI,
                WEB_API_NLP_SERVICE_URI,
                WEB_API_TASKS_SERVICE_URI
    ) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.$interval = $interval;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.coreUsersService = coreUsersService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_NLP_SERVICE_URI = WEB_API_NLP_SERVICE_URI;
        this.WEB_API_TASKS_SERVICE_URI = WEB_API_TASKS_SERVICE_URI;

        this.actionsList = [
            {
                name: 'task',
                params: '[what] [@someone] [due]',
                description: 'Create a new task'
            },
            {
                name: 'mytask',
                params: '',
                description: 'List your current tasks'
            },
            {
                name: 'search',
                params: '(or /s) [your text]',
                description: 'Perform a patient search'
            }
        ];

        this.mentionedUsers = [];
    }

    getMentionedUsers() {
        return this.mentionedUsers;
    }

    getPatients(term, pageIndex) {
        const params = {
            'filter.all': true,
            'filter.fullName': term,
            pageIndex: pageIndex || 0,
            pageSize: 10,
            sortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients`, { params });
    }

    getUsers(term, pageIndex) {
        const params = {
            'filter.fullName': term,
            pageIndex: pageIndex || 0,
            pageSize: 10
        };

        return this.coreUsersService.getUsersDictionary(params);
    }

    getActions(term) {
        return this.autocompleteQuerySearch(term, this.actionsList);
    }

    autocompleteQuerySearch(query, list) {
        let results = query ? list.filter(this.filterSearchQuery(query)) : list;
        return results;
    }

    filterSearchQuery(query) {
        return function filterFn(item) {
            let itemName = item.name.toLowerCase();
            let searchQuery = query.trim().toLowerCase();
            return itemName.indexOf(searchQuery) !== -1;
        };
    }

    _getEditedSubstrOptions(str, targetElement) {
        const caretPos = targetElement.prop('selectionStart');
        const tmpSubstr = str.slice(0, caretPos);
        const closestSpaceIndex = tmpSubstr.lastIndexOf(' ', tmpSubstr.length - 1) !== -1
            ? tmpSubstr.lastIndexOf(' ', tmpSubstr.length - 1)
            : 0 ;

        let editedSubstrOptions = {
            substr: undefined,
            startIndex: undefined,
            caretPos: undefined
        }

        editedSubstrOptions.startIndex = closestSpaceIndex;
        editedSubstrOptions.caretPos = caretPos;
        editedSubstrOptions.substr = tmpSubstr.slice(closestSpaceIndex, caretPos);

        return editedSubstrOptions;
    }

    lookForSpecialChar(str, options, targetElement) {
        let result = { type: '', input: '' };
        let targetSubstr = this._getEditedSubstrOptions(str, targetElement).substr;

        // for patient
        const isShowPatientsRegExp = targetSubstr.length > 1 ? /\s#|^#/g : /\s#\s|^#\s|^#$|\s#$/g;
        let isTypePatient = options.patient
            ? isShowPatientsRegExp.exec(targetSubstr)
            : false;

        // for user
        const isShowUsersRegExp = targetSubstr.length > 1 ? /\s@|^@/g : /\s@\s|^@\s|^@$|\s@$/g;
        let isTypeUser = options.user
            ? isShowUsersRegExp.exec(targetSubstr)
            : false;

        // for action
        const isShowActionsRegExp = targetSubstr.length > 1 ? /\s\/|^\//g : /\s\/\s|^\/\s|^\/$|\s\/$/g;
        let isTypeAction = options.action
            ? isShowActionsRegExp.exec(targetSubstr)
            : false;

        if (isTypePatient) {
            result.type = 'patient';
        } else if (isTypeUser) {
            result.type = 'user';
        } else if (isTypeAction) {
            result.type = 'action';
        }

        result.input = getNameWithSpace(targetSubstr);

        function getNameWithSpace(str) {
            const inputVal = str.trim().slice(1);
            const indexOfCapitalLetter = /[A-Z]/g.exec(inputVal.slice(1))
                ? /[A-Z]/g.exec(inputVal.slice(1))['index']
                : -1;

            const editedIncome = inputVal[indexOfCapitalLetter + 1];
            return inputVal.replace(`${editedIncome}`, ` ${editedIncome}`).trim();
        }

        return result;
    }

    userChoiceHandler(item, type, searchStr, targetElement) {
        const targetSubstr = this._getEditedSubstrOptions(searchStr, targetElement).substr;
        const substrRegPattern = `\\s${targetSubstr}\\s|^${targetSubstr}\\s|^${targetSubstr}$|\\s${targetSubstr}$`;
        const reg = new RegExp(substrRegPattern, 'g');

        if (type === 'patient') {
            this.mentionedUsers.push({
                id: `#${item.fullname.split(' ').join('')}`,
                type: 'patient',
                strForBack: `<patient:${item.id}:${item.fullname}>`,
                refId: item.id
            });

            searchStr = replaceSubstr(searchStr,
                this._getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `#${item.fullname.split(' ').join('')}`
            )

        } else if (type === 'user') {
            this.mentionedUsers.push({
                id: `@${item.fullname.split(' ').join('')}`,
                type: 'user',
                strForBack: `@${item.id}`,
                refId: item.id
            });

            searchStr = replaceSubstr(searchStr,
                this._getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `@${item.fullname.split(' ').join('')}`
            )

        } else if (type === 'action') {
            searchStr = replaceSubstr(searchStr,
                this._getEditedSubstrOptions(searchStr, targetElement),
                reg,
                `/${item.name}`
            )
        }

        function replaceSubstr(searchStr, editedSubstrOptions, reg, strForReplace) {
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

        return searchStr;
    }

    getAllIncomes(searchStr) {
        if (!searchStr) { return;}

        const strHasUsersIncomes = /@|#/g;
        let substrArr = searchStr.split(' ');

        substrArr.forEach((item, index) => {
            let hasUser = item.match(strHasUsersIncomes);
            if (hasUser) {
                let user = _.find(this.mentionedUsers, (i) => i.id === item.trim());
                substrArr[index] = user ? user.strForBack : item;
            }
        });

        return substrArr.join(' ');
    }

    convertToJustName(str) {
        if (!str) { return; }

        const regExp = /<(\S+):(\S+):([^>]+)>/;

        let matchData = str.match(regExp);

        while (matchData) {
            let replaceText;

            switch (matchData[1]) {
                case 'patient':
                    replaceText = `#${ matchData[3] }`;

                    break;
                case 'order':
                    replaceText = `#${ matchData[3] }`;

                    break;
                case 'invoice':
                    replaceText = `#${ matchData[3] }`;

                    break;

                default :
                    replaceText = '';

                    break;
            }

            str = str.replace(regExp, replaceText.replace(/\s/g, ''));

            this.mentionedUsers.push({
                id: replaceText.replace(/\s/g, ''),
                type: matchData[1],
                strForBack: `<${ matchData[1] }:${ matchData[2] }:${ matchData[3] }>`,
                refId: matchData[2]
            });

            matchData = str.match(regExp);
        }

        return str;
    }

    convertIdStrToName(str) {
        if (!str) { return; }

        const patientRe = /#[A-Z, a-z]+\s[A-Z, a-z]+\<patient\:\d+\>/g;
        const userRe = /@\d+/g;

        let patientCodeMatch = str.match(patientRe);
        let userCodeMatch = str.match(userRe);

        if (patientCodeMatch && patientCodeMatch.length) {
            patientCodeMatch.forEach((i) => {
                let item = i.trim();
                let indexOfPatientCodeStart = item.indexOf('<');
                let substrWithName = item.substring(0, indexOfPatientCodeStart).split(' ').join('');

                str = str.replace(item, substrWithName.replace('#', '&#35;'));
            });
        }

        if (userCodeMatch && userCodeMatch.length) {
            userCodeMatch.forEach((i) => {
                let item = i.trim();
                let nameMentioned = _.find(this.mentionedUsers, (i) => i.strForBack === item);
                if (nameMentioned) {
                    str = str.replace(item, nameMentioned.id);
                }
            })
        }

        return str;

    }

}
