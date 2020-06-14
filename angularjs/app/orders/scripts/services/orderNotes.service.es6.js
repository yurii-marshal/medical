export default class orderNotesService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        infinityTableFilterService,
        WEB_API_IDENTITY_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;
    }

    getSubjects() {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/orders/notes/subjects/dictionary');
    }

    getNotes(orderId, pageIndex, pageSize, sortExpression, filterExpression) {
        var params = this.infinityTableFilterService.getFilters(filterExpression);
        params = angular.merge(params, {
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortExpression: sortExpression
        });
        return this.$http.get(this.WEB_API_SERVICE_URI + `v1/orders/${orderId}/notes`, { params: params })
            .then(response => {
                response.data.Items.map(item => {
                    item.Description = item.Text;
                    item.CreatedByUser = {
                        Name: item.CreatedBy
                    };
                    return item;
                });
                return response;
            }, err => {});
    }

    addNote(orderId, note) {
        return this.$http.post(this.WEB_API_SERVICE_URI + `v1/orders/${orderId}/notes`, {
            Subject: note.Subject,
            Text: note.Description
        });
    }

    getUsers(fullName) {
        return this.$http.get(this.WEB_API_IDENTITY_URI + `users/list?fullName=${fullName}&sortExpression=Name.FullName%20ASC`);
    }
}
