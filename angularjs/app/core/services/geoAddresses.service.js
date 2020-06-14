(function () {
    "use strict";

    angular
        .module("app.core")
        .service("geoAddressesService", geoAddressesService);

    /* @ngInject */
    function geoAddressesService($http,  WEB_API_SERVICE_URI, $mdDialog, $q) {

        this.checkOrModifyAddresses = checkOrModifyAddresses;

        /**
         * @param addresses - array of address objects { addressObj: ctrl.Address, modalTitle: 'Patient Address' }
         * @returns {array of correct addresses}
         */
        function checkOrModifyAddresses(addresses) {

            var deferred = $q.defer();
            findGeoAddresses(addresses)
                .then(function(data) {
                    if (data && data.length === addresses.length) {
                        checkAddressesResponce(data, addresses)
                            .then(function(result) {
                                deferred.resolve(result);
                            }, function() {
                                deferred.reject();
                            });
                    }
                }, function(err) {
                    var rejectText = '';
                    angular.forEach(err, function(error, key) {
                        rejectText += addresses[error.index].modalTitle + ((key !== err.length - 1) ? ' and ' : '');
                    });
                    return errNoAddressFound(rejectText)
                        .then(function () {
                            deferred.reject();
                        });
                });

            return deferred.promise;
        };

        function checkAddressesResponce(responseAddress, initialAddress) {
            var isInvalidAddr,          // if response.length === 0, address not valid
                isChangeable,           // if address has to be changed - flag him
                addrModel,              // create address model for checking address
                addrArray = [],         // final array with addresses to change
                deferred = $q.defer();

            angular.forEach(responseAddress, function (addr, key) {
                isInvalidAddr = false,
                isChangeable = false,
                addrModel = undefined;

                if (addr.length === 0) {
                    isInvalidAddr = true;
                } else if (addr.length) {

                    angular.forEach(addr, function (item) {
                        item.AddressLine = item.AddressLine1;
                        delete item.AddressLine1;
                    });

                    var initAddr = initialAddress[key].addressObj;

                    if (addr.length === 1) {
                        for (var prop in addr[0]) {
                            if ( (addr[0][prop] && initAddr[prop]) && addr[0][prop].toLowerCase() !== initAddr[prop].toLowerCase() ) {
                                isChangeable = true;
                                break;
                            }
                        }
                    } else {
                        isChangeable = true;
                    }

                    if (isChangeable) {
                        addr.index = key;
                        addr.ModalText = initialAddress[key].modalTitle ? initialAddress[key].modalTitle : 'address';
                        addrArray.push(addr);
                    }
                }
            });

            if (isInvalidAddr) {
                errNoAddressFound()
                    .then(function () {
                        deferred.reject();
                    });

            } else {
                if (addrArray.length) {
                    $mdDialog.show({
                        controller: "addressesController as ctrl",
                        templateUrl: "core/views/templates/modals/addressesModal.html",
                        clickOutsideToClose: true,
                        fullscreen: true,
                        locals: {
                            items: addrArray

                        }
                    }).then(function (data) {
                        angular.forEach(data, function (addressArr) {
                            angular.forEach(addressArr, function (addr) {
                                if (addr.Selected) {
                                    for (var key in initialAddress[addressArr.index].addressObj) {
                                        initialAddress[addressArr.index].addressObj[key] = addr[key];
                                    }
                                }
                            });
                        });

                        deferred.resolve(true);
                    }, function() {
                        deferred.reject();
                    });
                } else {
                    deferred.resolve(true);
                }
            }
            return deferred.promise;
        };

        function findGeoAddress(filterObj) {

            var model = {
                "AddressLine1": filterObj.AddressLine1 ? filterObj.AddressLine1.toLowerCase() : "",
                "AddressLine2": filterObj.AddressLine2 ? filterObj.AddressLine2.toLowerCase() : "",
                "City": filterObj.City.toLowerCase(),
                "Zip": filterObj.Zip,
                "State": filterObj.State
            };

            var filter = Object.keys(model).map(function (key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(model[key]);
            }).join('&');

            return $http.get(WEB_API_SERVICE_URI + "geo/find-address?" + filter, {
                cache: true
            });
        };

        function findGeoAddresses(addressesArr) {

            var deferred = $q.defer();
            var promises = [];
            var responses = [];
            var result = [];

            function push(r) {
                responses.push(r);
            }

            angular.forEach(addressesArr, function (addr, key) {
                promises.push(
                    findGeoAddress(createAddrObj(addr.addressObj)).then(function (response) {
                        response.index = key;
                        push(response);
                    }).catch(function (err) {
                        err.index = key;
                        push(err);
                    })
                );
            });

            $q.all(promises).then(function () {

                responses = _.sortBy(responses, [function(o) { return o.index; }]);

                if (isGoodPromises(responses)) {
                    angular.forEach(responses, function (response) {
                        result.push(response.data);
                    });
                    deferred.resolve(result);
                } else {
                    angular.forEach(responses, function (response) {
                        if (response.status === 400) {
                            result.push(response);
                        }
                    });
                    deferred.reject(result);
                }

            });

            function isGoodPromises(datas) {
                var isAllOk = true;
                angular.forEach(datas, function (data) {
                    if (data.status !== 200) {
                        isAllOk = false;
                    }
                });
                return isAllOk;
            };

            return deferred.promise;
        };

        function createAddrObj(addrObj) {
            return {
                "AddressLine1": addrObj.AddressLine ? addrObj.AddressLine : addrObj.AddressLine1,
                "AddressLine2": addrObj.AddressLine2 ? addrObj.AddressLine2 : '',
                "City": addrObj.City,
                "Zip": addrObj.Zip,
                "State": addrObj.State
            };
        };

        function errNoAddressFound(text) {
            var deferred = $q.defer();
            var alertText = text || 'address';

            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('No ' + alertText + ' was found.')
                    .textContent('Please check entered ' + alertText + ' and try again.')
                    .ariaLabel('...')
                    .ok('OK')
            ).finally(function (response) {
                deferred.resolve();
            });

            return deferred.promise;
        };

    }
})();
