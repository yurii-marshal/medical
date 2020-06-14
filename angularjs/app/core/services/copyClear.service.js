(function () {
    "use strict";

    angular
        .module("app")
        .service("copyClearService", copyClearService);

    /* @ngInject */
    function copyClearService($http, WEB_API_SERVICE_URI) {
        this.copySchedule = copySchedule;
        this.clearSchedule = clearSchedule;

        function copySchedule(modelToSave, calendarType, id) {
            switch (calendarType) {
                case "setup_center":
                    return $http.post(WEB_API_SERVICE_URI + 'v1/setup-centers/{0}/schedules/copy'.format(id), modelToSave);
                case "personnel":
                    return $http.post(WEB_API_SERVICE_URI + 'v1/personnels/{0}/schedules/copy/'.format(id), modelToSave);
                default:
                    throw new Error("copyClearService wrong param 'calendarType' is not 'setup_center' or 'setup_center'");
            }
        }

        function clearSchedule(modelToSave, calendarType, id) {
            switch (calendarType) {
                case "setup_center":
                    return $http.post(WEB_API_SERVICE_URI + 'v1/setup-centers/{0}/schedules/clear'.format(id), modelToSave);
                case "personnel":
                    return $http.post(WEB_API_SERVICE_URI + 'v1/personnels/{0}/schedules/clear/'.format(id), modelToSave);
                default:
                    throw new Error("clearSchedule wrong param 'calendarType' is not in 'setup_center' or 'setup_center'");
            }
        }
    }
})();
