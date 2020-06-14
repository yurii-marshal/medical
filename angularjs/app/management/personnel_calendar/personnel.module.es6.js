// Config
import config from './personnel.route.es6';

// Controllers
import personnelListController from './scripts/controllers/personnelList.controller.es6';
import personnelEditController from './components/personnel-edit/personnel-edit.controller.es6';
import personnelCalendarController from './scripts/controllers/personnelCalendar.controller.es6';
import HoursModalController from './modals/hours-modal/hours-modal.controller.es6';

// Services
import personnelListService from './scripts/services/personnelList.service.es6';

export default angular
    .module('app.management.personnel', [])
    .config(config)

    // Controllers
    .controller('personnelListController', personnelListController)
    .controller('personnelEditController', personnelEditController)
    .controller('personnelCalendarController', personnelCalendarController)
    .controller('HoursModalController', HoursModalController)

    // Services
    .service('personnelListService', personnelListService)
    .name;
