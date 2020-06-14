// Config
import config from './reports.route.es6';
import agGrid from 'ag-grid/dist/ag-grid.min';

// Modules
import reportsContainer from './reports-container/reports-container.module.es6';

// Components
import reportAddFilter from './scripts/components/addFilter/reportAddFilter.component.es6.js';
import ReportsDashboardCtrl from './components/reports-dashboard/reports-dashboard.controller.es6.js';
import reportsTableController from './components/reports-table/reports-table.controller.es6';

agGrid.initialiseAgGridWithAngular1(angular);

export default angular
    .module('app.reports', [
        reportsContainer,
        'agGrid'
    ])
    // Components
    .component('reportAddFilter', reportAddFilter)

    // Controllers
    .controller('reportsDashboardCtrl', ReportsDashboardCtrl)
    .controller('reportsTableController', reportsTableController)

    .config(config)
    .name;

