// Config
import config from './management.route.es6';

// Modules
import settings from './settings/settings.module.es6';
import personnel from './personnel_calendar/personnel.module.es6';
import serviceCenters from './setup_center/service-center.module.es6';
import organization from './organization/organization.module.es6';
import managementBilling from './management-billing/management-billing.module.es6';
import inventory from './inventory/inventory.module.es6';

// Controllers
import managementController from './management.controller.es6';

export default angular
    .module('app.management', [
        settings,
        personnel,
        serviceCenters,
        organization,
        managementBilling,
        inventory
    ])
    .config(config)

    // Controllers
    .controller('managementController', managementController)
    .name;
