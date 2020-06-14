export default class notesService {
    constructor($http, WEB_API_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    getNotes(patientId, pageIndex, pageSize, sortExpression, filterExpression) {
        let params = this.infinityTableFilterService.getFilters(filterExpression);

        params = angular.merge(params, {
            pageSize,
            pageIndex,
            sortExpression
        });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/notes`, { params });
    }

    createNote(patientId, data) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/notes`, data);
    }

    noteSubjectDictionary() {
        return this.$http({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/note-subject/dictionary`,
            method: 'GET',
            cache: true
        });
    }

    notesUsers(patientId) {
        return this.$http({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/notes/users`,
            method: 'GET'
        });
    }
}
