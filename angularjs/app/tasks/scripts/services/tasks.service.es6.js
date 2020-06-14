export default class tasksService {
    constructor($http,
                $state,
                $sce,
                WEB_API_SERVICE_URI,
                WEB_API_TASKS_SERVICE_URI,
                infinityTableFilterService,
                customSearchAutocompleteService,
                coreUsersService
    ) {
        'ngInject';

        this.$http = $http;
        this.$state = $state;
        this.$sce = $sce;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_TASKS_SERVICE_URI = WEB_API_TASKS_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.customSearchAutocompleteService = customSearchAutocompleteService;
        this.coreUsersService = coreUsersService;

        // Will be got from dictionary
        this.taskPriorities = [
            { name: 'Low', id: 'Low' },
            { name: 'Normal', id: 'Normal' },
            { name: 'High', id: 'High' }
        ];

        // Will be got from dictionary
        this.taskStatuses = [
            { name: 'Open', id: 1 },
            { name: 'Completed', id: 2 },
            { name: 'Archived', id: 3 }
        ];
    }

    getTaskPriorities() {
        return this.taskPriorities;
    }

    getTaskStatuses() {
        return this.taskStatuses;
    }

    getTaskList(pageIndex, pageSize, sortExpression, filterObj) {
        let params = this.infinityTableFilterService.getFilters(filterObj);
        sortExpression = this.infinityTableFilterService.getSortExpressions(sortExpression);

        if (params.CreatedOn) {
            params.CreatedOn = moment(params.CreatedOn).format();
        }

        if (params.DueDate) {
            params.DueDate = moment(params.DueDate).format();
        }

        if (params.CreatedById) {
            params.CreatedById = params.CreatedById.Id || params.CreatedById;
        }

        if (params.AssigneeId) {
            params.AssigneeId = params.AssigneeId.Id || params.AssigneeId;
        }

        if (params.Statuses) {
            params.Statuses = !angular.isArray(params.Statuses) ? [params.Statuses] : params.Statuses;
        }

        params = angular.merge(params, { sortExpression, pageIndex, pageSize });

        return this.$http.get(`${this.WEB_API_TASKS_SERVICE_URI}v1/tasks`, { params })
            .then((response) => {
                response.data.Items.map(item => {
                    item.Title = item.Title
                        ? this.$sce.trustAsHtml(this.convertToRef(item.Title))
                        : '';

                    item.Description = item.Description
                        ? this.$sce.trustAsHtml(this.convertToRef(item.Description))
                        : '';

                    item.CreatedBy = `${item.CreatedBy.FirstName} ${item.CreatedBy.LastName}`;
                    item.AssignTo.map(i => {
                        i.AssignTo = `${i.FirstName} ${i.LastName}`
                    });
                    item.PriorityClass = getPriorityClass(item.Priority);
                });

                return response;
            });

        function getPriorityClass(priority) {
            switch (priority.toLowerCase()) {
                case 'low':
                    return 'dark-gray';
                case 'normal':
                    return 'blue';
                case 'high':
                    return 'orange';
                default:
                    return 'green';
            }
        }
    }

    initDefaultModel() {
        return {
            Text: '',
            Description: '',
            DueDate: '',
            Priority: { name: 'Normal', id: 2 },
            AssignTo: []
        };
    }

    getTaskById(taskId) {
        return this.$http.get(`${this.WEB_API_TASKS_SERVICE_URI}v1/tasks/${taskId}`);
    }

    saveTask(id, model) {
        let postModel = this._getPostModel(model);

        if (!id) {
            return this.$http.post(`${this.WEB_API_TASKS_SERVICE_URI}v1/tasks`, postModel);
        } else {
            return this.$http.put(`${this.WEB_API_TASKS_SERVICE_URI}v1/tasks/${id}`, postModel);
        }
    }

    _getPostModel(data) {
        let postModel = {
            Description: this.customSearchAutocompleteService.getAllIncomes(data.Description),
            Title: this.customSearchAutocompleteService.getAllIncomes(data.Title),
            DueDate: data.DueDate ? moment(data.DueDate).format('YYYY-MM-DDTHH:mm:ssZ') : '',
            Priority: data.Priority.id || data.Priority,
            AssignTo: data.AssignTo
        };

        return postModel;
    }

    deleteTasks(Ids) {
        let data = { Ids };

        return this.$http({
            method: 'DELETE',
            url: `${this.WEB_API_TASKS_SERVICE_URI}v1/tasks`,
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            data: data
        });
    }

    completeTasks(Ids) {
        let data = { Ids };
        return this.$http.post(`${this.WEB_API_TASKS_SERVICE_URI}v1/tasks/complete`, data);
    }

    getUsersDictionary(name) {
        const params = {
            'filter.fullName': name,
            pageIndex: 0,
            pageSize: 24
        };

        return this.coreUsersService.getUsersDictionary(params)
            .then((response) => {
                response.data = response.data.map((user) => {
                    return {
                        Id: user.Id,
                        Name: {
                            FirstName: user.Name.FirstName,
                            LastName: user.Name.LastName,
                            MiddleName: user.Name.MiddleName
                        }
                    };
                });

                return response.data;
            });
    }

    getUsers(Name) {
        const params = { Name };

        return this.$http.get(`${this.WEB_API_TASKS_SERVICE_URI}v1/users`, { params })
            .then((response) => response.data.Items);
    }

    goToPatientDetails(patientId) {
        this.$state.go('root.patient', { patientId });
    }

    convertToRef(str) {
        if (!str) { return; }

        const regExp = /<(\S+):(\S+):([^>]+)>/;

        let matchData = str.match(regExp);

        while (matchData) {

            let htmlStr;

            switch (matchData[1]) {
                case 'patient':
                    htmlStr = `<span class="active-text"
                                  ui-sref="root.patient.demographics({ patientId: ${ matchData[2] } })"
                                  ng-click="$event.stopPropagation();"   
                               >
                                     ${ matchData[3] }
                               </span>`;
                    break;
                case 'order':
                    htmlStr = `<span class="active-text"
                                  ui-sref="root.orders.order.details({ orderId: ${ matchData[2] } })"
                                  ng-click="$event.stopPropagation();"   
                               >
                                     ${ matchData[3] }response.data.Items = response.data.Items.map((user)=>{
                               </span>`;
                    break;
                case 'invoice':
                    htmlStr = `<span class="active-text"
                                  ui-sref="root.invoice.details({ invoiceId: '${ matchData[2] }' })"
                                  ng-click="$event.stopPropagation();"   
                               >
                                     ${ matchData[3] }
                               </span>`;
                    break;

                default :
                    htmlStr = '';

                    break;
            }

            str = str.replace(regExp, htmlStr);

            matchData = str.match(regExp);
        }

        return str;
    }
}

