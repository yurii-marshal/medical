export default function config($stateProvider) {
    'ngInject';

    $stateProvider
        .state('root.tasks', {
            url: '/tasks',
            templateUrl: 'tasks/views/tasks.html',
            controller: 'tasksCtrl as tasks',
            params: {
                Statuses: undefined,
                pageTitle: 'Tasks'
            }
        })
        .state('root.tasks.assigned_to_me', {
            url: '/assigned_to_me',
            templateUrl: 'tasks/views/tasks-list.html',
            params: {
                pageTitle: 'Assigned To Me'
            }
        })
        .state('root.tasks.created_by_me', {
            url: '/created_by_me',
            templateUrl: 'tasks/views/tasks-list.html',
            params: {
                pageTitle: 'Created By Me'
            }
        })
        .state('root.tasks.all_tasks', {
            url: '/all_tasks',
            templateUrl: 'tasks/views/tasks-list.html',
            params: {
                pageTitle: 'All Tasks'
            }
        });

}
