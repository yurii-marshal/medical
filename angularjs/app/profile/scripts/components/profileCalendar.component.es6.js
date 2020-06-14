import template from './profileCalendar.html';

class profileCalendarCtrl {
    constructor(profileCalendarService,
                bsLoadingOverlayService,
                eventsProfileService,
                eventRenderService,
                $scope,
                $rootScope,
                ngToast,
                $compile,
                $mdDialog,
                $state) {
        'ngInject';

        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.profileCalendarService = profileCalendarService;
        this.eventRenderService = eventRenderService;
        this.eventsProfileService = eventsProfileService;

        // permission by default
        let permissionByDefault =  { edit: false };

        this.$onInit = () => {
            this.permissions = angular.extend(permissionByDefault, this.permissions);
            this.personnelId = (parseInt(this.personnelId) >= 0) ? parseInt(this.personnelId) : -1;
            this.personnelScheduleAble = !!this.personnelScheduleAble;

            // Calendar plugin init start
            this.uiConfig = {
                calendar: {
                    calendarId: 'calendarObj',
                    editable: !!this.permissions.edit, // convert to Boolean
                    eventLimit: true,
                    weekNumbers: true,
                    viewRender: this.profileCalendarService.viewRender($scope, $compile),
                    eventRender: this.eventRenderService.renderEventProfile.bind(this.eventRenderService),
                    eventMouseover: this.eventRenderService.eventMouseover.bind(this.eventRenderService),
                    eventMouseout: this.eventRenderService.eventMouseout.bind(this.eventRenderService),
                    defaultDate: ($state.params.date) ? $state.params.date : moment().format('YYYY-MM-DD'),
                    defaultView: ($state.params.view) ? $state.params.view : 'agendaWeek',
                    scrollTime: '06:00:00'
                }
            };

            // if permission for Edit
            if (this.permissions && this.permissions.edit) {
                this.uiConfig.calendar.weekTitleAdditionalHtml =
                    `<div class="fc-dn-btn setup-center-week-btn">
                         <a href="javascript:void(0)" 
                            ng-class="{'fc-dn-btn-past': $ctrl.btnInPast('{0}')}"
                            ng-click="$ctrl.showTopPopupMenu('{0}', $event)"></a>
                    </div>`;

                this.showTopPopupMenu = profileCalendarService.showTopPopupMenu.bind(profileCalendarService);

                this.uiConfig.calendar.eventDrop = profileCalendarService.eventDrop.bind(profileCalendarService);
                this.uiConfig.calendar.eventResize = profileCalendarService.eventResize.bind(profileCalendarService);
                this.uiConfig.calendar.dayClick = profileCalendarService.dayClick.bind(profileCalendarService);
                this.uiConfig.calendar.eventClick = profileCalendarService.eventClick.bind(profileCalendarService);

                this.btnInPast = (date) => {
                    if (!( moment.utc(date, "YYYY-MM-DD").valueOf() >= moment.utc().startOf('day').valueOf()) ) {
                        return true;
                    }
                };
            }

            this.eventSource = this._getEventFromServer.bind(this);

            profileCalendarService.setPersonnelId(this.personnelId);

        };

        $scope.$watch(() => this.personnelScheduleAble, (newVal) => {
            if (newVal !== undefined && newVal !== null) {
                eventsProfileService.setIsScheduleAble(this.personnelScheduleAble);
                //$rootScope.$broadcast('fullCalendar.reload', 'true');
            }
        });

        // what this code is suppose to be for ??
        $scope.$on('$destroy', () => $mdDialog.hide());
    }

    _getEventFromServer(start, end, timezone, callback) {

        if (this.personnelId === -1) { return false; }

        this.bsLoadingOverlayService.start({ referenceId: 'profile_calendar' });
        this.eventsProfileService.getCalendarData(
            start.format('YYYY-MM-DD'),
            end.format('YYYY-MM-DD'),
            this.personnelId
        ).then((response) => callback(response))
         .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'profile_calendar' }));
    }

    _saveWorkingHours(constraint) {
        // TODO fix non-existent function this.getActualPersonnelId()
        this.eventsProfileService.saveConstraint(constraint, this.getActualPersonnelId())
            .then(() => {
                this.ngToast.success('Saved');
                this.$scope.$broadcast('fullCalendar.reload', 'true');
            });
    }

    _showAddSchedule(event, date) {
        let constraint = date === undefined
            ? undefined
            : this.eventsProfileService.getConstraintByDay(date);

        if (constraint === undefined) {
            constraint = {
                date: date,
                start: moment.utc("09:00", "HH:mm"),
                end: moment.utc("18:00", "HH:mm")
            }
        } else {
            constraint = {
                id: constraint.id,
                date: moment(constraint.start).format('YYYY-MM-DD'),
                start: moment(constraint.start),
                end: moment(constraint.end)
            }
        }
        this.setupCenterPopups.showAddSchedule(
            event,
            constraint,
            this._saveWorkingHours.bind(this),
            this._deleteWorkingHours.bind(this)
        );
    }

    _deleteWorkingHours(id) {
        this.bsLoadingOverlayService.start({ referenceId: 'profile_calendar' });
        this.eventsProfileService.deleteConstraint(id)
            .then(() => {
                this.ngToast.success('Deleted');
                this.$scope.$broadcast('fullCalendar.reload', 'true');
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'profile_calendar' }));
    }

}

const profileCalendar = {
    restrict: 'E',
    transclude: true,
    bindings: {
        personnelId: '=',
        permissions: '=',
        personnelScheduleAble: '=',
        splitInnerEvents: '=?'
    },
    template,
    controller: profileCalendarCtrl
};

export default profileCalendar;
