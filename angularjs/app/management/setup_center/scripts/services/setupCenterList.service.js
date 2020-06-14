(function () {
    "use strict";

    angular
        .module("app.management.service_center")
        .service("setupCenterListService", setupCenterListService);

    /* @ngInject */
    function setupCenterListService($http,
                                    WEB_API_SERVICE_URI,
                                    infinityTableFilterService) {
        this.getList = getList;
        this.deleteSetupCenter = deleteSetupCenter;
        this.createSetupCenter = createSetupCenter;
        this.updateSetupCenter = updateSetupCenter;

        function getList(pageIndex, pageSize, sortExpressions, filterObj) {
            var sortExpressions = infinityTableFilterService.getSortExpressions(sortExpressions);
            var paramsObj = infinityTableFilterService.getFilters(filterObj);

            paramsObj = angular.merge(paramsObj, {
                'sortExpression': sortExpressions,
                'pageIndex': pageIndex,
                'pageSize': pageSize
            });

            return $http.get(WEB_API_SERVICE_URI + "/v1/setup-centers", {params: paramsObj});
        }

        function deleteSetupCenter(Id) {
            return $http.delete(WEB_API_SERVICE_URI + "/v1/setup-centers/" + Id);
        }

        function createSetupCenter(obj) {
            return $http.post(WEB_API_SERVICE_URI + "/v1/setup-centers/", obj);
        }

        function updateSetupCenter(obj) {
            return $http.put(WEB_API_SERVICE_URI + "/v1/setup-centers/" + obj.Id, obj);
        }

    }

})();
