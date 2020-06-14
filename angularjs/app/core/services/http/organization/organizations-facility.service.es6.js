export default class OrganizationsFacilityService {
    constructor(
        $http,
        $q,
        WEB_API_ORGANIZATIONS_URI
    ) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_ORGANIZATIONS_URI = WEB_API_ORGANIZATIONS_URI;
        this.$q = $q;
    }

    getFacilities(params) {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility`, { params });
    }

    getFacilityLocations(facilityId) {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility/${facilityId}/locations`);
    }

    getFacilityById(facilityId) {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility/${facilityId}`);
    }

    updateFacility(facilityId, model) {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility/${facilityId}`, model);
    }

    createFacility(model) {
        return this.$http.post(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility`, model);
    }

    deleteFacility(facilityId) {
        return this.$http.delete(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility/${facilityId}`);
    }

    getContactTypes() {
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/facility/contact-types/dictionary`, { cache: true });
    }
}
