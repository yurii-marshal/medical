(function () {
    "use strict";

    angular
        .module('app')
        .service("tabsService", tabsService);


    /* @ngInject */
    function tabsService($state) {
        this.getSteps = getSteps;

        // get and update steps Active and Finished Statuses
        function getSteps(steps, stateName) {
            var keepGoing = true;

            angular.forEach(steps, function(tab, key) {
                tab.active = false;
                tab.finished = false;

                if ( stateName.indexOf(tab.view) !== -1 && !tab.hidden ) {
                    if ( tab.insuranceTypeId ) {
                        if ( +$state.params.insuranceTypeId === tab.insuranceTypeId ) {
                            tab.active = true;
                        } else {
                            tab.active = false;
                        }
                    } else {
                        tab.active = true;
                    };
                };

                if ( keepGoing ) {
                    if ( !tab.active ) {
                        tab.finished = true;
                    } else if ( tab.active ) {
                        keepGoing = false;
                    };
                };
            });

            return steps;
        };

    };

})();
