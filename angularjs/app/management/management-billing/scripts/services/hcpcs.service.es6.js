export default class hcpcsService {
    constructor($http, WEB_API_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
    }

    getHcpcsList(filterObj, sortExpression, pageIndex, pageSize) {
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);
        let params = this.infinityTableFilterService.getFilters(filterObj);

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs`, { params });
    }

    deleteHcpcs(code) {
        return this.$http({
            method: 'DELETE',
            url: `${this.WEB_API_SERVICE_URI}v1/hcpcs`,
            data: {
                Codes: [
                    code
                ]
            },
            headers: {
                'Content-type': 'application/json;charset=utf-8'
            }
        });
    }

    createHcpcs(model) {
        let postModel = {
            Code: model.Code,
            LongDescription: model.LongDescription,
            ShortDescription: model.ShortDescription
        };
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/hcpcs`, postModel);
    }

    updateHcpcs(model) {
        let putModel = {
            LongDescription: model.LongDescription,
            ShortDescription: model.ShortDescription
        };
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/hcpcs/${model.Code}`, putModel);
    }

    getHcpcsByCode(code) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/${code}`);
    }
}