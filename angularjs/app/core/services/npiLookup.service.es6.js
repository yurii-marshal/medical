export default class npiLookupService {
    constructor($window, $q, $http, WEB_API_SERVICE_URI, authService) {
        'ngInject';

        this.$window = $window;
        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.authService = authService;
    }

    npiLookup(model, type) {
        let query = encodeQueryData(model);
        let url = 'https://npiregistry.cms.hhs.gov/';

        if (!query.replace('addressType=ANY', '')) {
            query = query.replace('addressType=ANY', '');
        } else {
            url += 'registry/search-results-table?';
            if (type) {
                query += `&entity_type=NPI-${type}`;
            }
        }

        this.$window.open(url + query, '_blank');

        function encodeQueryData(data) {
            // addressType is required param
            data['addressType'] = 'ANY';

            let result = [];

            for (let prop in data) {
                if (data[prop]) {
                    result.push(encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]));
                }
            }
            return result.join('&');
        }
    }

    getNpiLookupModel(model) {
        let result = {};
        let source = model.ReferralCardSource || model;
        let physicianName = source.Name || (source.Physician && source.Physician.Name);

        let npi = source.Npi || (source.Physician && source.Physician.Npi);

        if (source && !_.isEmpty(source)) {
            if (physicianName && (physicianName.First || physicianName.Last)) {
                result = {
                    entity_type: 'NPI-1',
                    first_name: physicianName.First && physicianName.First.toUpperCase(),
                    last_name: physicianName.Last && physicianName.Last.toUpperCase()
                };
            } else if (source.Practice) {
                result = {
                    entity_type: 'NPI-2',
                    organization_name: source.Practice
                };
            }

            result.number = npi;
        }

        if (_.has(model, 'Location.Address')
            && (!physicianName || (!physicianName.First && !physicianName.Last) )) {
            result.city = model.Location.Address.City || undefined;
            result.state = model.Location.Address.State || undefined;
            result.postal_code = model.Location.Address.Zip || undefined;
        }

        return result;
    }

    getNpiRegistryDetails(npi) {
        const params = { npi };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}npi-registry/details`, { params });
    }
}
