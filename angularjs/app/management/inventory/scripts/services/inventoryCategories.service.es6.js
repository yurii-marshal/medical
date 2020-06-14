export default class inventoryCategoriesService {
    constructor($http, WEB_API_INVENTORY_SERVICE_URI, infinityTableFilterService) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;

        this.model = {};

    }

    getModel() {
        return this.model;
    }

    getList(filterObj, sortExpressions, pageIndex, pageSize) {
        let _sortExpressions = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': _sortExpressions,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/categories", { params: paramsObj });

    }

    deleteCategory(id) {
        return this.$http.delete(this.WEB_API_INVENTORY_SERVICE_URI + "v1/categories/{0}".format(id));
    }

     saveCategory() {
        if (this.model.Id) {
            return this.$http.put(this.WEB_API_INVENTORY_SERVICE_URI + "v1/categories/{0}".format(this.model.Id), this.getSaveModel());
        } else {
            return this.$http.post(this.WEB_API_INVENTORY_SERVICE_URI + "v1/categories", this.getSaveModel());
        }
    }

    getSaveModel() {
        return {
            Name: this.model.Name,
            Description: this.model.Description
        };
    }

    getAndSetModel(id) {
        return this.$http.get(this.WEB_API_INVENTORY_SERVICE_URI + "v1/categories/{0}".format(id))
            .then(data => this.setModel(data.data));
    }

    setModel(data) {
        this.model.Id = data.Id;
        this.model.Name = data.Name;
        this.model.Description = data.Description;
    }

    clearModel() {
        this.model = {
            Id: "",
            Name: "",
            Description: ""
        };
    }

}
