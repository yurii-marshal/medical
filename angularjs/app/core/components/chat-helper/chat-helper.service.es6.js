export default class chatHelperService {
    constructor($rootScope, $state, $http, $filter, WEB_API_NLP_SERVICE_URI) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.$http = $http;
        this.$filter = $filter;
        this.WEB_API_NLP_SERVICE_URI = WEB_API_NLP_SERVICE_URI;
    }

    submitAction(Text) {
        let timeZone = moment().format('Z');
        let TimezoneOffset = timeZone.charAt(0) === '+'
            ? `${timeZone.substring(1)}:00`
            : `${timeZone}:00`;

        let data = { Text, TimezoneOffset };

        return this.$http({
            method: 'POST',
            url: `${this.WEB_API_NLP_SERVICE_URI}v1.0/action`,
            data: data
        });
    }

    goToPatientDetails(patientId) {
        this.$state.go('root.patient', { patientId });
        this.$rootScope.$emit('event:openPatientById');
    }

    goToTaskDetails(taskId) {
        this.$state.go('root.tasks.created_by_me');
        this.$rootScope.$emit('event:openTaskById', { taskId });
    }

    goToRef(titleLinkStr) {
        const splittedLink = titleLinkStr.split(':');
        const linkType = splittedLink[0];
        const linkId = splittedLink[1];

        if (linkType === 'patient') {
            return () => this.goToPatientDetails(linkId);
        }
        // TODO update after discussion design
        // else if (linkType === 'task') {
            // return () => this.goToTaskDetails(linkId);
        // }
    }

    addPhoneFilter(str) {
        const regPattern = /[0-9 ,;]+(?!\*\*Contacts\:\*\*\s)$/g;
        let telNumbers, telNumbersFormatted;

        if (str.match(regPattern)) {
            telNumbers = str.match(regPattern)[0];

            let telArr = telNumbers.split(',');

            for (let i = 0; i < telArr.length; i++) {

                if (telArr[i].indexOf(';') !== -1) {
                    let extentedTel = telArr[i].split(';');

                    extentedTel[0] = this.$filter('tel')(extentedTel[0].trim());
                    extentedTel[1] = `Ext.${extentedTel[1]}`;
                    telArr[i] = `${extentedTel[0]}, ${extentedTel[1]}`;

                } else {
                    telArr[i] = this.$filter('tel')(telArr[i].trim());
                }
            }

            telNumbersFormatted = telArr.join(', ');

            return str.replace(telNumbers, telNumbersFormatted);
        }

        return str;

    }


}
