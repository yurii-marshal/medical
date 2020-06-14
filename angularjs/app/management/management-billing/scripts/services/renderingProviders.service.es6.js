import { renderingProviderTypeConstants } from '../../../../core/constants/core.constants.es6';

export default class renderingProvidersService {
    constructor($q, $http, $filter, infinityTableFilterService, WEB_API_SERVICE_URI, WEB_API_BILLING_SERVICE_URI) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.$filter = $filter;
        this.infinityTableFilterService = infinityTableFilterService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
    }

    getRenderingTypeDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/types/dictionary`, { cache: true });
    }

    getRenderingList(filterObj, sortExpressions, pageIndex, pageSize) {
        let sortExpr = this.infinityTableFilterService.getSortExpressions(sortExpressions),
            params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, {
            sortExpression: sortExpr,
            pageIndex: pageIndex,
            pageSize: pageSize
        });

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering`, { params })
            .then(response => {
                response.data.Items.map(item => {
                    if (item.PersonName) {
                        item.PersonName.FullName = this.$filter("fullname")(item.PersonName);
                    }
                });
                return response;
            })
    }

    deleteRenderingProvider(Id) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/${Id}`);
    }

    getRenderingProvider(Id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/${Id}`);
    }

    saveRenderingProvider(Id, data) {
        if (!Id) {
            return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering`, this._getSaveModel(data));
        } else {
            return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/${Id}`, this._getSaveModel(data));
        }
    }

    _getSaveModel(data) {
        let model = {
            Npi: data.Npi,
            Type: data.Type,
            PersonName: data.Type === renderingProviderTypeConstants.PERSON_TYPE_ID ? {
                FirstName: data.PersonName.FirstName,
                LastName: data.PersonName.LastName
            } : undefined,
            OrganizationName: data.Type === renderingProviderTypeConstants.ORGANIZATION_TYPE_ID ? data.OrganizationName : undefined,
            Address: {
                AddressLine: data.Address.AddressLine,
                AddressLine2: data.Address.AddressLine2,
                City: data.Address.City,
                State: data.Address.State,
                Zip: data.Address.Zip
            },
            TaxonomyCode: data.Taxonomy && data.Taxonomy.Code,
            Contacts: []
        };

        //if some item exist add to the model
        ['Phone', 'Fax'].forEach(item => {
            if (data[item]) {
                model.Contacts.push({
                    Type: item,
                    Value: data[item]
                });
            }
        });
        return model;
    }
}
