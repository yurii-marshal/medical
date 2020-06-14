(function () {
    "use strict";

    angular
        .module("app.management.service_center")
        .service("setupCenterAppointmentService", setupCenterAppointmentService);


    /* @ngInject */
    function setupCenterAppointmentService($state, $http, $q, WEB_API_SERVICE_URI, $mdDialog, $rootScope) {
        this.getPersonnelDictionaryPromise = getPersonnelDictionaryPromise;
        this.getRepeatPatternsDictionaryPromise = getRepeatPatternsDictionaryPromise;
        this.getDailyRepeatPatternsDictionaryPromise = getDailyRepeatPatternsDictionaryPromise;
        this.getMonthlyRepeatPatternsDictionaryPromise = getMonthlyRepeatPatternsDictionaryPromise;
        this.getWeekDaysDictionaryPromise = getWeekDaysDictionaryPromise;
        this.getAllRepeatPatterns = getAllRepeatPatterns;
        this.saveAppointmentPromise = saveAppointmentPromise;
        this.updateAppointmentPromise = updateAppointmentPromise;
        this.getAppointmentPromise = getAppointmentPromise;
        this.deleteAppointmentPromise = deleteAppointmentPromise;
        this.showAppointPersonnelModal = showAppointPersonnelModal;

        function showAppointPersonnelModal($event, centerId, eventId) {
            $mdDialog.show({
                controller: "appointPersonnelModalController",
                controllerAs: "appointPersonnel",
                templateUrl: "management/setup_center/views/modals/appointPersonnelModal.html",
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: false,
                locals: {
                    centerId: centerId,
                    eventId: eventId
                }
            }).then(function () {
                $rootScope.$broadcast('fullCalendar.reload', 'true');
            });
        }

        function getAppointmentPromise(setupCenterEventId) {
            return $http.get(WEB_API_SERVICE_URI + "/v1/setup-centers/events/" + setupCenterEventId);
        }
        function getPersonnelDictionaryPromise(query) {
            return $http.get(WEB_API_SERVICE_URI + "v1/personnel/dictionary?filter.fullName=" + query);
        }
        function getRepeatPatternsDictionaryPromise() {
            return $http.get(WEB_API_SERVICE_URI + "v1/setup-centers/events/event-repeat-types");
        }
        function getDailyRepeatPatternsDictionaryPromise() {
            return $http.get(WEB_API_SERVICE_URI + "v1/setup-centers/events/daily-event-repeat-types");
        }
        function getMonthlyRepeatPatternsDictionaryPromise() {
            return $http.get(WEB_API_SERVICE_URI + "v1/setup-centers/events/monthly-event-repeat-types");
        }
        function getWeekDaysDictionaryPromise() {
            return $http.get(WEB_API_SERVICE_URI + "patients/weekdays/dictionary");
        }
        function saveAppointmentPromise(model) {
            return $http.post(WEB_API_SERVICE_URI + "v1/setup-centers/{0}/events".format(model.SetupCenterId), model);
        }
        function updateAppointmentPromise(eventId, model) {
            return $http.put(WEB_API_SERVICE_URI + "v1/setup-centers/events/" + eventId, model);
        }
        function getAllRepeatPatterns() {
            var promises = [];
            promises.push(getRepeatPatternsDictionaryPromise());
            promises.push(getDailyRepeatPatternsDictionaryPromise());
            promises.push(getMonthlyRepeatPatternsDictionaryPromise());
            promises.push(getWeekDaysDictionaryPromise());

            var deferred = $q.defer();

            $q.all(promises).then(function (datas) {
                var result = [];

                if (datas) {
                    for (var i = 0; i < datas.length; i++) {
                        result[i] = datas[i].data;
                    }
                }

                deferred.resolve(result);
            }, function (err) {

                deferred.reject('[Error] Can\'t get data from server:'
                    + '<br/>Url: ' + err.config.url
                    + '<br/>Status ' + err.status);

            });

            return deferred.promise;
        }
        function deleteAppointmentPromise(setupCenterEventId, isDeleteAll) {
            return $http.delete(WEB_API_SERVICE_URI + "v1/setup-centers/events/{0}/{1}".format(setupCenterEventId, isDeleteAll));
        }
    }
})();
