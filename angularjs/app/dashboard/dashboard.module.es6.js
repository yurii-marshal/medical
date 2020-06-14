// Config
import config from './dashboard.route.es6';

// Controllers
import dashboardController from './scripts/controllers/dashboard.controller.es6';

// Components
import dashboardAppointments from './scripts/components/dashboardAppointments.component.es6';
import dashboardCommunication from './scripts/components/dashboardCommunication.component.es6';
import rssList from './scripts/components/rss-list/rssList.component.es6.js';

// Services
import dashboardService from './scripts/services/dashboard.service.es6';
import rssListService from './scripts/components/rss-list/rssList.service.es6.js';

export default angular
    .module('app.dashboard', [])
    // Controllers
    .controller('dashboardController', dashboardController)
    // Components
    .component('dashboardAppointments', dashboardAppointments)
    .component('dashboardCommunication', dashboardCommunication)
    .component('rssList', rssList)
    // Services
    .service('dashboardService', dashboardService)
    .service('rssListService', rssListService)
    .config(config)
    .name;

