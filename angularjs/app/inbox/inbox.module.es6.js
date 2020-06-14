// Config
import config                       from './inbox.route.es6';

// Controllers
import inboxController              from './scripts/controllers/inbox.controller.es6';
import inboxListController          from './scripts/controllers/inboxList.controller.es6';
import inboxAttachPatientController from './scripts/controllers/inboxAttachPatientController.es6.js';

// Services
import inboxService                 from './scripts/services/inbox.service.es6';

export default angular
    .module('app.inbox', [])
    .config(config)

    // Controllers
    .controller('inboxController', inboxController)
    .controller('inboxListController', inboxListController)
    .controller('inboxAttachPatientController', inboxAttachPatientController)

    // Services
    .service('inboxService', inboxService)
    .name;




