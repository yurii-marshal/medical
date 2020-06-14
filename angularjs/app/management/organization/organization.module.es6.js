// Config
import config from './organization.route.es6';

// Controllers
import organizationSetupController from './components/organization-setup/organization-setup.controller.es6.js';
import organizationLocationsController from './scripts/controllers/organizationLocations.controller.es6.js';
import organizationLocationViewController from './components/organization-location/organization-location.controller.es6.js';
import referralsController from './scripts/controllers/referrals.controller.es6';
import referralController from './components/referral/referral.controller.es6.js';
import FacilitiesListCtrl from './components/facilities-list/facilities-list.controller.es6';
import FacilityCtrl from './components/facility/facility.controller.es6';

// Services
import organizationSetupService from './components/organization-setup/organization-setup.service.es6.js';
import organizationLocationsService from './services/organization-locations.service.es6.js';
import referralsService from './services/referrals.service.es6.js';
import FacilityService from './services/facility.service.es6.js';

export default angular
    .module('app.management.organization', [])
    .config(config)

    // Controllers
    .controller('organizationSetupController', organizationSetupController)
    .controller('organizationLocationsController', organizationLocationsController)
    .controller('organizationLocationViewController', organizationLocationViewController)
    .controller('referralsController', referralsController)
    .controller('referralController', referralController)
    .controller('facilitiesListCtrl', FacilitiesListCtrl)
    .controller('facilityCtrl', FacilityCtrl)

    // Services
    .service('organizationSetupService', organizationSetupService)
    .service('organizationLocationsService', organizationLocationsService)
    .service('referralsService', referralsService)
    .service('facilityService', FacilityService)
    .name;
