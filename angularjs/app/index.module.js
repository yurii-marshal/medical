import core from './core/core.module.es6';
import calendar from './calendar/calendar.module.es6';
import inbox from './inbox/inbox.module.es6';
import orders from './orders/orders.module.es6';
import management from './management/management.module.es6';
import patients from './patients/patients.module.es6';
import billing from './billing/billing.module.es6';
import profile from './profile/profile.module.es6';
import inventory from './inventory/inventory.module.es6';
import reports from './reports/reports.module.es6';
import dashboard from './dashboard/dashboard.module.es6';
import tasks from './tasks/tasks.module.es6';
import utilityPages from './utility-pages/utility-pages.module.es6';

angular
    .module('app', [
        core,
        inventory,
        calendar,
        inbox,
        orders,
        patients,
        management,
        utilityPages,
        billing,
        profile,
        reports,
        dashboard,
        tasks
    ]);

angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});
