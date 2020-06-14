// Config
import config from './settings.route.es6';

// Controllers
import settingsOrderController from './components/settings-order/settings-order.controller.es6';
import settingsStatementController from './components/settings-statement/settings-statement.controller.es6';

export default angular
   .module('app.management.settings', [])
   .config(config)

   // Controllers
   .controller('settingsOrderController', settingsOrderController)
   .controller('settingsStatementController', settingsStatementController)
   .name;
