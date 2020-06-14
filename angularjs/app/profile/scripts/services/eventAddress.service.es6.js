export default class eventAddressService {
    constructor(WEB_API_SERVICE_URI, $http) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;

        this.DepartureAddress = {
            AddressLine: '',
            AddressLine2: '',
            City: '',
            Zip: '',
            State: ''
        };
        this.ArrivalAddress = {
            AddressLine: '',
            AddressLine2: '',
            City: '',
            Zip: '',
            State: ''
        };
        this.isNarowStyle = false;
    }

    getIsNarowStyle() {
        return this.isNarowStyle;
    }
    setIsNarowStyle(value) {
        this.isNarowStyle = value;
    }

    getDepartureAddress() {
        return this.DepartureAddress;
    }
    getArrivalAddress() {
        return this.ArrivalAddress;
    }
    setDepartureAddress(addr) {
        this.DepartureAddress = addr;
    }
    setArrivalAddress(addr) {
        this.ArrivalAddress = addr;
    }

    clearModel() {
        this.DepartureAddress = {
            AddressLine: '',
            AddressLine2: '',
            City: '',
            Zip: '',
            State: ''
        };
        this.ArrivalAddress = {
            AddressLine: '',
            AddressLine2: '',
            City: '',
            Zip: '',
            State: ''
        };
    }

    getStates() {
        return this.$http({
            url: `${this.WEB_API_SERVICE_URI}/v1/settings/states/dictionary`,
            method:'GET',
            cache: true
        });
    }

    getZipCodes(filterObj) {
        const filter = Object.keys(filterObj)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filterObj[key])}`)
            .join('&');

        return this.$http.get(`${this.WEB_API_SERVICE_URI}setting/referrence/zip-codes?${filter}`, { cache: true });
    }

}
