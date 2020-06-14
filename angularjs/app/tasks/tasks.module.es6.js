// Config
import config from './tasks.route.es6';

// Controllers
import tasksCtrl from './scripts/controllers/tasks.controller.es6';

// Services
import tasksService from './scripts/services/tasks.service.es6';

export default angular
    .module('app.tasks', [])
    // Controllers
    .controller('tasksCtrl', tasksCtrl)
    // Services
    .service('tasksService', tasksService)

    .config(config)
    .name;
