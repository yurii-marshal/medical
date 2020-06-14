import taskModalTemplate from '../../views/modals/task.html';
import taskModalCtrl from './modals/task-modal.controller.es6.js';

import taskConfirmModalTemplate from '../../views/modals/confirm-modal.html';
import taskConfirmModalCtrl from './modals/task-confirm-modal.controller.es6';

export default class taskCtrl {
    constructor($state,
                $scope,
                $rootScope,
                $mdDialog,
                ngToast,
                tasksService,
                infinityTableService,
                profileService) {
        'ngInject';
        this.$state = $state;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.tasksService = tasksService;
        this.profileService = profileService;

        this.tabs = [
            {
                'title' : 'Assigned To Me',
                'view' : 'root.tasks.assigned_to_me'
            },
            {
                'title' : 'Created By Me',
                'view' : 'root.tasks.created_by_me'
            },
            {
                'title' : 'All Tasks',
                'view' : 'root.tasks.all_tasks'
            }
        ];

        this.toolbarItems = [
            {
                text: 'Add new task',
                icon: {
                    url: 'assets/images/default/plus.svg',
                    w: 14,
                    h: 14
                },
                clickFunction: () => this.openTaskModal()
            },
            {
                text: 'Complete',
                icon: {
                    url: 'assets/images/default/check.svg',
                    w: 18,
                    h: 18
                },
                clickFunction:  () => this.batchTasksActionModal('complete'),
                isHidden: true
            },
            {
                text: 'Delete',
                icon: {
                    url: 'assets/images/default/trash.svg',
                    w: 14,
                    h: 18
                },
                clickFunction:  () => this.batchTasksActionModal('delete'),
                isHidden: true
            }
        ];

        // Will be got from dictionary
        this.taskPriorities = this.tasksService.getTaskPriorities();

        // Will be got from dictionary
        this.taskStatuses = this.tasksService.getTaskStatuses();

        this.sortExpr = {};
        this.filterObj = {};
        this.permanentFilters = [];

        // Modification depends on active tab
        this.assignedToHidden = false;
        this.createdByHidden = false;

        this.getTaskList = (pageIndex, pageSize) => {
            if (this.UserId) {
                return this.tasksService.getTaskList(pageIndex, pageSize, this.sortExpr, angular.merge({}, this.filterObj, this.filters))
            } else {
                return this.profileService.getProfilePromise()
                    .then((response) => {
                        this.UserId = response.data.Id;
                        this._setTaskListFilters();
                        return this.tasksService.getTaskList(pageIndex, pageSize, this.sortExpr, angular.merge({}, this.filterObj, this.filters))
                    })
            }
        }

        $scope.$on('$stateChangeSuccess', () => {
            this.checkState();
        });

        $scope.$watch(() => this.selectedItemsArrCount(), (newVal) => {
            const deleteBtn = _.find(this.toolbarItems,
                (item) => item.text.toLowerCase() === 'delete');
            const completeBtn = _.find(this.toolbarItems,
                (item) => item.text.toLowerCase() === 'complete');

            deleteBtn.isHidden = newVal ? !this._isBatchDeleteAllowed() : true;
            completeBtn.isHidden = newVal ? !this._isBatchCompleteAllowed() : true;
        });

        // $rootScope.$on('event:openTaskById', (event, data) => {
        //     this.openTaskModal(data);
        // })

    }

    checkState() {

        if (this.$state.is('root.tasks')) {
            this.$state.go('root.tasks.assigned_to_me');
        } else {
            this.filterObj = {};
        }

        if (this.$state.is('root.tasks.assigned_to_me')) {
            this.filterObj.Statuses = 1
        }

        this._setTaskListParams();
        if (this.UserId) {
            this._setTaskListFilters();
        }

    }

    _setTaskListParams() {
        switch(this.$state.current.name) {
            case 'root.tasks.assigned_to_me':
                this.activeTabName = 'Assigned To Me';
                this.assignedToHidden = true;
                this.createdByHidden = false;
                this.permanentFilters = ['AssigneeId'];
                break;

            case 'root.tasks.created_by_me':
                this.activeTabName = 'Created By Me';
                this.createdByHidden = true;
                this.assignedToHidden = false;
                this.permanentFilters = ['CreatedById'];
                break;

            case 'root.tasks.all_tasks':
                this.activeTabName = 'All Tasks';
                this.assignedToHidden = false;
                this.createdByHidden = false;
                this.permanentFilters = [];
                break;
        }
    }

    _setTaskListFilters() {
        switch(this.$state.current.name) {
            case 'root.tasks.assigned_to_me':
                this.filterObj.AssigneeId =
                    !this.filterObj.AssigneeId ? this.UserId : this.filterObj.AssigneeId;
                break;

            case 'root.tasks.created_by_me':
                this.filterObj.CreatedById =
                    !this.filterObj.CreatedById ? this.UserId : this.filterObj.CreatedById;
                break;
        }
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        this.infinityTableService.toggleItem(item);
    }

    selectedItemsArrCount() {
        let arr = this.infinityTableService.getSelectedItems();
        return arr && arr.length;
    }

    _isBatchCompleteAllowed() {
        let isAllowed = true;
        let arr = this.infinityTableService.getSelectedItems();
        angular.forEach(arr, (item) => {
            let itemStatus = item.Status.toLowerCase();
            if (itemStatus === 'archived' || itemStatus === 'completed') {
                isAllowed = false;
            }
        });
        return isAllowed;
    }

    _isBatchDeleteAllowed() {
        let isAllowed = true;
        let arr = this.infinityTableService.getSelectedItems();
        angular.forEach(arr, (item) => {
            let itemStatus = item.Status.toLowerCase();
            if (itemStatus === 'archived') {
                isAllowed = false;
            }
        });
        return isAllowed;
    }

    deleteTask(task) {
        if (!task || !task.Id) return;

        this.tasksService.deleteTasks([task.Id])
            .then(() => {
                this.ngToast.success('Task deleted');
                this.infinityTableService.reload();
            });
    }

    batchTasksActionModal(actionType) {
        let tasksIds = this.infinityTableService.getSelectedItems().map((item) => item.Id);

        this.$mdDialog.show({
            template: taskConfirmModalTemplate,
            controller: taskConfirmModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                tasksIds,
                actionType
            }
        })
        .then(() => {
            this.ngToast.success(`${tasksIds.length > 1 ? 'Tasks were' : 'Task was'} ${actionType}d`);
            this.infinityTableService.reload();
        });
    }

    openTaskModal(taskId = undefined, status) {
        if (taskId && status.toLowerCase() !== 'open' ) {
            return;
        }

        this.$mdDialog.show({
            template: taskModalTemplate,
            controller: taskModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { taskId }
        })
        .then(() => this.infinityTableService.reload());
    }

    getUsers(name) {
        return this.tasksService.getUsers(name);
    }
}
