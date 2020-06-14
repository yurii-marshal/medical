export default class patientResupplyProgramsService {
    constructor($http, $q, $filter, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.$filter = $filter;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getPatientResupplyPrograms(patientId) {
        let promises = [
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/resupply-programs/periods/dictionary`),
            this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patient/${patientId}/resupply-programs`)
        ];
        return this.$q.all(promises)
            .then(responses => {
                if (responses[1] && responses[1].data && responses[0] && responses[0].data) {
                    responses[1].data.map(item => {
                        item.CreatedDate = moment(item.CreatedDate).format('MM/DD/YYYY');
                    });
                    responses[1].data.forEach((program) => {
                        program.Items.map(item => {
                            item.NextScheduledDate = moment(item.NextScheduledDate).format('MM/DD/YYYY');
                        });

                        program.Items.forEach((program) => {
                            responses[0].data.forEach((period) => {
                                if (program.Period.toString() === period.Id.toString()) {
                                    program.Period = `${period.Text}(s)`;
                                }
                            })
                        })
                    });
                    return responses[1];
                }
            });
    }

    checkPatientResupplyPrograms(patientId, pageIndex = 0, pageSize = 1) {
        let params = { pageIndex, pageSize };
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patient/${patientId}/resupply-programs`, { params });
    }


    getResupplyProgramRelatedOrders(patientId, resupplyProgramId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patient/${patientId}/resupply-program/${resupplyProgramId}/orders`)
            .then(response => {
                response.data.map(item => {
                    item.CreatedDateDay = this.$filter('localDateTime')(item.CreatedDate, 'MM/DD/YYYY');
                    item.CreatedDateTime =  this.$filter('localDateTime')(item.CreatedDate, 'hh:mm A');

                    item.LastModifiedDateDay = item.LastModifiedDate ? this.$filter('localDateTime')(item.LastModifiedDate, 'MM/DD/YYYY') : '';
                    item.LastModifiedDateTime = item.LastModifiedDate ? this.$filter('localDateTime')(item.LastModifiedDate, 'hh:mm A') : '';

                    item.statusClass = this._mapOrderStatusClass(item.Status.Id)
                });
                return response;
            });
    }

    _mapOrderStatusClass(orderStatusId) {

        switch(orderStatusId.toString()) {
            case '1':
                return 'orange';
                break;
            case '2':
                return 'green';
                break;
            case '3':
                return 'blue';
                break;
            case '4':
               return 'gray';
                break;
            case '5':
                return 'middle-gray';
                break;
        }
    }

}
