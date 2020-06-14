// Config
import config from './profile.route.es6';

// Controllers
import currentPasswordModalController from './scripts/controllers/modal/currentPasswordModal.controller.es6';
import profileEditController from './scripts/controllers/profile.edit.controller.es6'
import eventAddressController from './scripts/controllers/event.address.controller.es6';
import eventDetailController from './scripts/controllers/event.detail.controller.es6';
import profileViewController from './scripts/controllers/profile.view.controller.es6';

// Components
import profileCalendar from './scripts/components/profileCalendar.component.es6';

// Services
import profileService from './scripts/services/profile.service.es6';
import eventAddressService from './scripts/services/eventAddress.service.es6';
import profileCalendarService from './scripts/services/profileCalendar.service.es6';
import eventsProfileService from './scripts/services/eventsProfile.service.es6';

export default angular
    .module('app.profile', [])
    .config(config)

    // Controllers
    .controller('currentPasswordModalController', currentPasswordModalController)
    .controller('profileEditController', profileEditController)
    .controller('eventAddressController', eventAddressController)
    .controller('eventDetailController', eventDetailController)
    .controller('profileViewController', profileViewController)

    // Components
    .component('profileCalendar', profileCalendar)

    // Services
    .service('profileService', profileService)
    .service('eventAddressService', eventAddressService)
    .service('profileCalendarService', profileCalendarService)
    .service('eventsProfileService', eventsProfileService)
    .name;

