export default class profileCalendarService {
    constructor($state,
                ngToast,
                $mdDialog,
                eventsProfileService,
                breakService,
                popupMenuCalendar) {
        'ngInject';

        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.eventsProfileService = eventsProfileService;
        this.breakService = breakService;
        this.popupMenuCalendar = popupMenuCalendar;

        this._doctorId = undefined;
    }

    setPersonnelId(id) {
        this._doctorId = id;
    }

    viewRender($scope, $compile) {
        return function (view, element) {
            $compile(element)($scope);

            window.drowzCalendarResize = () => {
                view.calendar.option('height', document.body.clientHeight - 57);
            };

            $(window).off('resize');
            $(window).on('resize', window.drowzCalendarResize);
        }
    }

    eventResize(event, delta, revertFunc) {
        this._updateEventAfterResize(event, revertFunc);
    }

    dayClick(date, event) {
        if (!this._doctorId) {
            throw new Error('DoctorId is invalid.');
        }

        let arrListItems = [];
        const collisionItems = this.eventsProfileService.getAllIntersections(
            date,
            angular.copy(date).add(30,'m')
        );
        const extraTimesCountCollision = this.eventsProfileService.hasExtraTimesCollisions(date);
        const isPastDate = this.eventsProfileService.getIsPastDate(date);

        let collisionObjArrId = {
            'extra-hours':[],
            'setup-center':[],
            'constraint':[],
            'break':[],
            'event':[]
        };
        let collision = {
            'extra-hours':false,
            'setup-center':false,
            'constraint':false,
            'break':false,
            'event':false
        };

        angular.forEach(collisionItems, (item) => {
            if (collisionObjArrId[item.type]) {
                collisionObjArrId[item.type].push(item.id);
            }
            collision[item.type] = true;
        });

        //Generate menu
        if (collision['constraint']
            && !collision['break']
            && !collision['event']
            && !isPastDate) {
            arrListItems.push(
                this._getMenuItem('create_break', date, 0, event)
            );
        }
        if (collision['extra-hours']
            && !isPastDate) {
            angular.forEach(collisionObjArrId['extra-hours'], (id) => {
                arrListItems.push(this._getMenuItem("edit_extra_hours", moment(date), id));
            });
        }

        if(!collision['break']
            && !collision['extra-hours']
            && !collision['constraint']
            && !collision['event']
            && !collision['setup-center']
            && !extraTimesCountCollision
            && !isPastDate
        ) {
            arrListItems.push( this._getMenuItem("add_extra_hours", moment(date)) );
        }

        if (isPastDate) {
            const pastDateAction = this._getMenuItem("view_working_hours", date);
            if (pastDateAction.title) {
                arrListItems.push(pastDateAction);
            }
        } else {
            arrListItems.push( this._getMenuItem("add_edit_working_hours", date) );
        }

        this.popupMenuCalendar.showPopupMenu(arrListItems, event);

    }

    showTopPopupMenu(date, event) {
        let arrListItems = [];

        arrListItems.push( this._getMenuItem("add_edit_working_hours", moment(date)) );
        arrListItems.push( this._getMenuItem("add_extra_hours", moment(date)) );

        this.popupMenuCalendar.showPopupMenu(arrListItems, event);
    }

    eventDrop(event, delta, revertFunc) {
        this._updateEventAfterResize(event, revertFunc);
    }

    _updateEventAfterResize(event, revertFunc) {
        const appointment = {
            id: event.id,
            reason: event.reason,
            title: event.title,
            date: event.start.format("MM/DD/YYYY"),
            start: event.start.format("hh:mm A"),
            end: event.end.format("hh:mm A")
        };

        this.eventsProfileService.resizeEvent(appointment)
            .then((resolveMsg) => this.ngToast.success(resolveMsg),
                  (err) => revertFunc());
    }

    eventClick(event, jsEvent, view) {
        if (event.type === 'break' || event.type === undefined) {
            this.breakService.showModal(
                jsEvent,
                undefined,
                event,
                this.eventsProfileService.saveEvent.bind(this.eventsProfileService),
                this.eventsProfileService.deleteEvent.bind(this.eventsProfileService));
        }
    }

    _getParentState($state) {
        if ($state.current && $state.current.name) {
            let stateArr = $state.current.name.split('.');

            return stateArr.splice(0, stateArr.length - 1).join('.');
        }
        return '';
    }

    /**
     *
     * @param {string} type
     * @param {moment} dateMoment
     * @param {int} id
     * @param {$event} jsEvent
     * @returns {{}}
     * @private
     */
    _getMenuItem(type, dateMoment, id, jsEvent) {
        if (!this._doctorId) {
            throw new Error('DoctorId is invalid.');
        }

        let menuItemObj = {}, wh;

        switch (type) {
            case 'add_edit_working_hours':
                wh = this.eventsProfileService.getConstraintByDay(dateMoment.format('YYYY-MM-DD'));
                menuItemObj = {
                    'title': ((wh) ? "Edit" : "Add") + " Working Hours",
                    'class': 'add-hours',
                    'exec': () => {
                        let locObj = (wh) ? {'id': wh.id} : {'date': dateMoment.format('YYYY-MM-DD')};
                        locObj.personnelId = this._doctorId;
                        this._showHoursModal(jsEvent, locObj);
                    }
                };
                break;

            case 'view_working_hours':
                wh = this.eventsProfileService.getConstraintByDay(dateMoment.format('YYYY-MM-DD'));
                if (!wh) { break; }
                menuItemObj = {
                    'title': "View Working Hours",
                    'class': 'add-hours',
                    'exec': () => {
                        let locObj = {'id': wh.id};
                        locObj.personnelId = this._doctorId;
                        locObj.action = "view";
                        this._showHoursModal(jsEvent, locObj);
                    }
                };
                break;

            case 'add_extra_hours':
                menuItemObj = {
                    'title': "Add On-Call Hours",
                    'class': 'add-oncall',
                    'exec': () => {
                        let locObj = {'date': dateMoment.format('YYYY-MM-DD')};
                        locObj.time = dateMoment.format("hh-mm-a");
                        locObj.personnelId = this._doctorId;
                        locObj.isOnCallHours = true;
                        this._showHoursModal(jsEvent, locObj);
                    }
                };
                break;

            case 'edit_extra_hours':
                menuItemObj = {
                    'title': "Edit On-Call Hours",
                    'class': 'add-oncall',
                    'exec': () => {
                        let locObj = { id };
                        locObj.personnelId = this._doctorId;
                        locObj.isOnCallHours = true;
                        this._showHoursModal(jsEvent, locObj);
                    }
                };
                break;

            case 'create_break':
                //cache doctorId in function
                //TODO need to be refactored
                const $this = this;
                const saveFunc = function () {
                    let argsArr = Array.prototype.slice.call(arguments);
                    argsArr.push($this._doctorId);
                    return $this.eventsProfileService.saveEvent.apply($this.eventsProfileService, argsArr);
                };
                menuItemObj = {
                    'title': "Create Time block",
                    'class': 'add-oncall',
                    'exec': () => {
                        this.breakService.showModal(jsEvent,
                            dateMoment,
                            undefined,
                            saveFunc,
                            this.eventsProfileService.deleteEvent.bind(this.eventsProfileService));
                    }
                };
                break;
        }

        return menuItemObj;
    }

    _showHoursModal(event, location) {
        const showHoursModal = (locObj) => {
            this.$mdDialog.show({
                controller: 'HoursModalController as hours',
                templateUrl: 'management/personnel_calendar/modals/hours-modal/hours-modal.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: {
                    locObj,
                    reopenModal: (newHoursModel) => { showHoursModal(newHoursModel); }
                }
            });
        };

        showHoursModal(location);
    }

}
