// Config
import config from './reports-container.route.es6';

// Controllers
import ReportsContainerController from './reports-container.controller.es6';

export default angular
    .module('app.reports.container', [])
    .config(config)

    // Controllers
    .controller('reportsContainerController', ReportsContainerController)
    .name;
