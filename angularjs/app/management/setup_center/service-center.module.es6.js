// Config
import config from './service-center.route.es6';

// Controllers
import serviceCentersController from './scripts/controllers/serviceCenters.controller.es6';
import scheduleModalController from './scripts/controllers/modals/scheduleModal.controller.es6';

export default angular
    .module('app.management.service_center', [])
    .config(config)

    // Controllers
    .controller('serviceCentersController', serviceCentersController)
    .controller('scheduleModalController', scheduleModalController)
    .name;
