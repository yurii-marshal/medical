// Config
import config from './utility-pages.route.es6';

// Controllers
import NoAccessController from './no-access/no-access.controller.es6';
import EmptyIframeController from './empty-iframe/empty-iframe.controller.es6';

export default angular
    .module('app.utilityPages', [])

    // Controllers
    .controller('noAccessController', NoAccessController)
    .controller('emptyIframeController', EmptyIframeController)
    .config(config)
    .name;
