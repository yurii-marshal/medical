export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.management.personnel_calendar', {
            url: '/personnel_calendar',
            abstract: true,
            template: '<ui-view/>',
            params: {
                topMenu: 'Management',
                leftMenu: 'Schedule',
                pageTitle: 'Personnel Schedule'
            }
        })

        .state('root.management.personnel_calendar.index', {
            url: '/:personnelId?view&date&filter',
            templateUrl: 'management/personnel_calendar/views/personnelCalendar.html',
            controller: 'personnelCalendarController as personnelCalendar',
            params: {
                topMenu: 'Management',
                leftMenu: 'Schedule',
                pageTitle: 'Personnel Schedule'
            }
        })
        .state('root.management.personnel', {
            url: '/personnel',
            templateUrl: 'management/personnel_calendar/views/personnelList.html',
            controller: 'personnelListController as personnelList',
            params: {
                topMenu: 'Management',
                leftMenu: 'Setup',
                pageTitle: 'Personnel List'
            }
        })
        .state('root.management.personnel_add', {
            url: '/personnel/add',
            templateUrl: 'management/personnel_calendar/components/personnel-edit/personnel-edit.html',
            controller: 'personnelEditController as $ctrl',
            params: {
                topMenu: 'Management',
                leftMenu: 'Setup',
                pageTitle: 'New Personnel'
            }
        })
        .state('root.management.personnel_edit', {
            url: '/personnel/edit/:personnelId',
            templateUrl: 'management/personnel_calendar/components/personnel-edit/personnel-edit.html',
            controller: 'personnelEditController as $ctrl',
            params: {
                topMenu: 'Management',
                leftMenu: 'Setup',
                pageTitle: 'Edit Personnel'
            }
        });
}
