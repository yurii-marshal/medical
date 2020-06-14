export default class cmnFormService {
    constructor($state,
                $http,
                $filter,
                coreDictionariesService,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$state = $state;
        this.$http = $http;
        this.$filter = $filter;
        this.coreDictionariesService = coreDictionariesService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getReferringProviders(text, pageIndex) {
        let params = {
            SortExpression: 'Name ASC',
            filter: text,
            isPerson: true,
            pageIndex
        };

        return this.coreDictionariesService.getReferralCards(params)
            .then((response) => {
                response.data.Items.forEach((item) => this._mapReferringProvider(item));
                return response;
            });
    }

    _mapReferringProvider(model) {
        if (model.ReferralCardSource) {
            model.FullName = `${this.$filter('fullname')(model.ReferralCardSource.Name)} (NPI: ${model.ReferralCardSource.Npi})`;
            return model;
        }
    }

    goToCmnForm(patientId, cmnId) {
        this.$state.go(`root.patient-cmn-form`,
            { view: 'cmn-form', patientId, cmnId });
    }
}
