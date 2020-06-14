export default class CorePersonnelService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getList(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel`, { params });
    }

    getPersonnel(id) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnels/${id}`);
    }

    create(model) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/personnels`, model);
    }

    update(id, model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/personnels/${id}`, model);
    }

    deleteById(id) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/personnels/${id}`);
    }

    getAllTags() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel/tags`);
    }
}
