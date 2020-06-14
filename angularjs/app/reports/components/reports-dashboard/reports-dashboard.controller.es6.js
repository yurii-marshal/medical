
export default class ReportsDashboardCtrl {
    constructor($state) {
        'ngInject';

        this.reportsParams = {
            patientDetail: {
                reportSourceId: 7
            },
            appointmentDetail: {
                reportSourceId: 6
            },
            patientReferralSummary: {
                reportSourceId: 9
            },
            patientReferralDetail: {
                reportSourceId: 5
            },
            invoiceDetail: {
                reportSourceId: 11
            },
            thirdPartyIntegrations: {
                reportSourceId: 8
            }
        };

        this.$state = $state;
    }

    goToReports(params) {
        let url = '#/reports/?reportSourceId=' + params.reportSourceId;

        window.location.href = url;
    }
}
