export default class eventAddressController {
    constructor($timeout, $scope, eventAddressService, $filter) {
        'ngInject';

        this.$filter = $filter;
        this.eventAddressService = eventAddressService;

        $scope.$watch(() => this.isModalWorkingHours, (newValue) => {
            this.isDepartureAddressRequired = this.isModalWorkingHours;
        }, true);

        $scope.$watch(() => this.DepartureAddress, (newValue) => {
            if (newValue) {
                if (!this.isModalWorkingHours) {
                    $timeout(() => {
                        this.isDepartureAddressRequired = !this._isAddressEmpty(newValue);
                    }, 0);
                }
                eventAddressService.setDepartureAddress(newValue);
            }
        }, true);

        $scope.$watch(() => this.ArrivalAddress, (newValue) => {
            if (newValue) { eventAddressService.setArrivalAddress(newValue); }
        }, true);

        $scope.$watch(() => eventAddressService.getDepartureAddress(), (newValue) => {
            if (newValue) { this.DepartureAddress = newValue; }
        }, true);

        $scope.$watch(() => eventAddressService.getArrivalAddress(), (newValue) => {
            if (newValue) { this.ArrivalAddress = newValue; }
        }, true);

        this._activate();
    }

    _activate() {
        this.setIsNarowStyle = this.eventAddressService.getIsNarowStyle();
        if (this.eventAddressService.getDepartureAddress().AddressLine) {
            this.DepartureAddress = this.eventAddressService.getDepartureAddress();
        }
        if (this.eventAddressService.getArrivalAddress().AddressLine) {
            this.ArrivalAddress = this.eventAddressService.getArrivalAddress();
        }
    }

    getStates(query) {
        return this.eventAddressService.getStates()
            .then((response) => this.$filter('filter')(response.data, query));
    }

    getZipCodes(query) {
        return this.eventAddressService.getZipCodes({ 'Text': query })
            .then((response) => response.data.Items);
    }

    copyDepartureToArrival() {
        angular.copy(this.DepartureAddress, this.ArrivalAddress);
    }

    copyArrivalToDeparture() {
        angular.copy(this.ArrivalAddress, this.DepartureAddress);
    }

    _isAddressEmpty(addressObj) {
        let isEmpty = true;
        for (let key in addressObj) {
            if (addressObj[key] && addressObj[key].length) {
                isEmpty = false;
                return isEmpty;
            }
        }
        return isEmpty;
    }

}
