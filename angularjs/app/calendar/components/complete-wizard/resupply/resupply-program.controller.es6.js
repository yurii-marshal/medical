export default class CompleteWizardResupplyController {
    constructor(
        $scope,
        $state,
        $timeout,
        $mdDialog,
        bsLoadingOverlayService,
        completeWizardService,
        patientResupplyService,
        $q
        ) {
        'ngInject';

        this.$q = $q;
        this.$state = $state;
        this.patientResupplyService = patientResupplyService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$timeout = $timeout;
        this.$mdDialog = $mdDialog;
        this.completeWizardService = completeWizardService;

        this.orderId = $state.params.orderId;

        this.isEventComplete = !!$state.params.appointmentId;
        this.searchItemsRoot = `root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.add`;

        this.model = completeWizardService.getModel();
        this.currentSelectedItems = [];

        this.hcpcsForToday = this.completeWizardService.getHcpcsCodesByAllItems();

        $scope.$on('$stateChangeSuccess', () => this._checkState());

        this._newDevicesToResupplyProgram();

        this._manageDatesForAddHcpcsCodes();
    }

    _checkState() {
        if (this.$state.is(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2`)) {
            this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.resupply`);
        }
    }

    toggleResupplyProgram() {
        if (this.model.ResupplyProgramAvailable && this.model.newResupplyDevices.length) {

            this.model.ResupplyProgram.Items = this.model.newResupplyDevices.map((item) => {

                item.IsNew = true;
                item.RecentDeliveryDate = moment.utc().startOf('day').format('MM/DD/YYYY');

                return item;
            });

            this._getResupplyFrequencies();
        }
    }

    cancelItems() {
        angular.copy(this.currentSelectedItems, this.model.ResupplyProgram.Items);
        this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.resupply`);
    }

    saveItems() {

        this.$state.go(`root.${this.isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.resupply`);
        if (this.model.ResupplyProgram.Hold) {
            this.model.ResupplyProgram.Items.map((item) => item.Hold = this.model.ResupplyProgram.Hold);
        }

        this._getResupplyFrequencies();
    }

    _getResupplyFrequencies() {
        const promises = [];

        this.model.ResupplyProgram.Items.map((item) => {

            if (!item.Frequency) {
                item.Frequency = {};
            }

            if (!item.Frequency.Frequency) {
                let primaryCode;

                if (angular.isArray(item.HcpcsCodes)) {
                    primaryCode = item.HcpcsCodes[0];
                } else if (item.HcpcsCodes) {
                    primaryCode = item.HcpcsCodes.Primary;
                }

                const promise = this.patientResupplyService.getResupplyFrequency(this.model.patientId, primaryCode);

                promises.push(promise);

                promise.then((response) => {
                    if (response.data) {
                        const rule = {
                            'HcpcsCodes': [primaryCode],
                            'Frequency': response.data.Frequency,
                            'PeriodType': { Id: response.data.PeriodType },
                            'PeriodValue': response.data.Period,
                            'Quantity': response.data.Quantity
                        };

                        item.Frequency.Frequency = response.data.Frequency;
                        item.Frequency.PeriodValue = response.data.Period;
                        item.Frequency.PeriodType = { Id: response.data.PeriodType };
                        item.Frequency.Quantity = response.data.Quantity;

                        if (this.model.ResupplyProgram.ResupplyRules) {
                            this.model.ResupplyProgram.ResupplyRules.push(rule);
                        } else {
                            this.model.ResupplyProgram.ResupplyRules = [rule];
                        }
                    }

                    this.patientResupplyService.calcNextSchedule(item, true);

                });
            }
        });

        this.$q.all(promises).then(() => {
            this.patientResupplyService.setUpProgramDates(this.model.ResupplyProgram.Items.filter((item) => item.IsNew && !item.RecentDeliveryDate), this.model.patientId);
        });
    }

    _getResupplayDeviceObj(device) {
        return {
            Count: device.Count,
            Frequency: null,
            HcpcsCodes: device.Hcpcs || device.allHcpcsCodes,
            Hold: this.model.ResupplyProgram.Hold,
            NextEligibleDate: null,
            NextScheduledDate: null,
            PeriodType: {
                Id: '3',
                Text: 'Month'
            },
            PeriodValue: null,
            RecentDeliveryDate: null,
            ProductId: device.ProductId,
            Product: {
                HcpcsCodes: device.Hcpcs || device.allHcpcsCodes,
                Id: device.ProductId,
                Manufacturer: device.Manufacturer,
                Name: device.Name,
                PartNumber: device.PartNumber
            }
        };
    }

    _manageDatesForAddHcpcsCodes() {
        this.model.ResupplyProgram.Items.forEach((item) => {
            const intersection = _.intersection(item.HcpcsCodes, this.hcpcsForToday);

            if (intersection.length > 0) {
                if (!item._saveInitialNextSchedule) {
                    item._saveInitialNextSchedule = item.NextScheduledDate;
                    item._saveInitialRecentDeliveryDate = item.RecentDeliveryDate;
                    item.RecentDeliveryDate = moment.utc().startOf('day').format('MM/DD/YYYY');
                }

                this.patientResupplyService.calcNextSchedule(item);
            } else {
                if (item._saveInitialNextSchedule) {
                    item.NextScheduledDate = item._saveInitialNextSchedule;
                    item.RecentDeliveryDate = item._saveInitialRecentDeliveryDate;
                }

                if (item.RecentDeliveryDate) {
                    this.patientResupplyService.calcNextSchedule(item);
                }
            }
        });

    }

    _newDevicesToResupplyProgram() {

        this.model.newResupplyDevices = [];

        const modelDevices = this.completeWizardService.getNewItems();

        angular.forEach(modelDevices, (device) => {
            if (device.Resupply) {
                let index = _.findIndex(this.model.ResupplyProgram.Items,
                    (o) => o.Product.Id === device.ProductId);

                if (index === -1) {
                    this.model.newResupplyDevices.push(this._getResupplayDeviceObj(device));
                }
            }
            if (device.Components && device.Components.length) {
                angular.forEach(device.Components, (component) => {
                    if (component.Resupply) {
                        let index = _.findIndex(this.model.ResupplyProgram.Items,
                            (o) => o.Product.Id === component.ProductId);

                        if (index === -1) {
                            this.model.newResupplyDevices.push(this._getResupplayDeviceObj(component));
                        }
                    }
                });
            }
        });

        this.model.newResupplyDevices = _.uniqWith(this.model.newResupplyDevices, (oldVal, newVal) => {
            return oldVal.Product.Id === newVal.Product.Id;
        });

        this.$timeout(() => {
            if (this.model.ResupplyProgramAvailable && this.model.newResupplyDevices.length) {

                this.$mdDialog.show({
                    templateUrl: 'calendar/components/complete-wizard/resupply/modals/update-resupply-program-modal.html',
                    controller: 'updateResupplyProgramModalController',
                    controllerAs: '$ctrl',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    locals: {
                        items: this.model.newResupplyDevices
                    }
                }).then((newItems) => {
                    if (newItems) {

                        newItems.forEach((item) => {
                            item.IsNew = true;
                            this.patientResupplyService.calcNextSchedule(item);
                            item.RecentDeliveryDate = moment.utc().startOf('day').format('MM/DD/YYYY');
                        });

                        this.model.ResupplyProgram.Items = this.model.ResupplyProgram.Items.concat(newItems);

                        this._getResupplyFrequencies();
                    }
                });
            }
        });
    }
}
