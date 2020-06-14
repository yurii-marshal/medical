export default class dashboardService {
    constructor($q,
                $http,
                ngToast,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI,
                WEB_API_TASKS_SERVICE_URI) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_TASKS_SERVICE_URI = WEB_API_TASKS_SERVICE_URI;

        this._messagesPerPage = 50;
    }

    quickSearch(text) {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/dashboard/quick-search',
            {params: {'searchValue': text}});
    }

    getCounters(userId) {
        let promises = [];
        const params = {
            selectCount: true,
            AssigneeId: userId,
            pageIndex: 0,
            pageSize: 1,
            Statuses: 1
        }

        promises.push(this.$http.get(this.WEB_API_SERVICE_URI + 'v1/patients/counts/new'));
        promises.push(this.$http.get(this.WEB_API_SERVICE_URI + 'v1/orders/counts/new'));
        promises.push(this.$http.get(this.WEB_API_BILLING_SERVICE_URI + 'v1/claims/counts/new'));
        promises.push(this.$http.get(`${this.WEB_API_TASKS_SERVICE_URI}v1.0/tasks`, { params }))

        return this.$q.all(promises);
    }

    getUpcommingAppointments(page, perPage) {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/dashboard/upcoming-appointments',
            {params: {'pageSize': perPage, 'pageIndex': page || 0, 'sortExpression': 'DateRange.From ASC'}});
    }

    getStatNewPatients() {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/dashboard/statistics/new-patients');
    }

    getStatPayrs() {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/dashboard/statistics/payers');
    }

    getStatPhysicians() {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/dashboard/statistics/physicians');
    }

    getAllUnreadMessages(userId, allUnreadMsg) {
        let defer = this.$q.defer(),
            msg = [],
            currentPage = 0,
            countUnreadMsg = 0;

        this._worker = () => {
            return this.getUserMessages(userId, {pageIndex: currentPage, pageSize: this._messagesPerPage})
                .then(response => {
                    let msgFromServer = response.data.Items;
                    //count Unread messages
                    angular.forEach(msgFromServer, item => {
                        if (!item.Read) countUnreadMsg++;
                    });
                    msg = msg.concat(msgFromServer.reverse());
                    return response.data;
                }, err => defer.reject())
                .then(this._manager);
        }

        this._worker(currentPage)
            .then(_ => {
                defer.resolve({
                    messages: msg,
                    currentPage: currentPage
                });
            });

        this._manager = result => {
            let isDownloadedAllUnreadMessages = countUnreadMsg >= allUnreadMsg,
                isDownloadAllMessages = result.Count < this._messagesPerPage * (currentPage + 1);
            if (isDownloadAllMessages || isDownloadedAllUnreadMessages) return;
            currentPage++;
            return this._worker();
        }

        return defer.promise;
    }

    getUserMessages(userId, paramsObj) {
        let params = angular.extend({pageSize: this._messagesPerPage}, paramsObj);
        if (!userId) throw new Error('UserId is empty or "0"');
        return this.$http.get(this.WEB_API_SERVICE_URI + `v1/users/${userId}/messages`,
            {params: params});
    }

    postUserMessage(userId, text) {
        if (!userId) throw new Error('UserId is empty or "0"');
        return this.$http.post(this.WEB_API_SERVICE_URI + `v1/users/${userId}/messages`,
            {Text: text});
    }

    getUserContacts(params) {
        return this.$http.get(this.WEB_API_SERVICE_URI + 'v1/users/messages/recent-contacts',
            {params: params});
    }

    setMessagesRead(messagesIdsArr) {
        return this.$http.post(this.WEB_API_SERVICE_URI + 'v1/users/messages/read',
            {MessageIds: messagesIdsArr});
    }
}
