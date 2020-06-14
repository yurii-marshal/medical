import { limitConstants, inventoryStatusConstants } from '../../../core/constants/core.constants.es6.js';

export default class inventoryPageController {
    constructor($scope,
                $state,
                $q,
                $filter,
                bsLoadingOverlayService,
                ngToast,
                inventoryEquipmentService,
                WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';
        this.$state = $state;
        this.$scope = $scope;
        this.$q = $q;
        this.$filter = $filter;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.inventoryEquipmentService = inventoryEquipmentService;

        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.inventoryStatusConstants = inventoryStatusConstants;

        this.tabs = [
            {
                'title': 'Details',
                'view': 'root.inventory_item.details'
            },
            {
                'title': 'Notes',
                'view': 'root.inventory_item.notes'
            }
        ];

        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;

        this.equipment = undefined;
        this.locationsDic = [];
        this.statusesDic = [];
        this.dataLoaded = false;
        this.updateEnabled = false;

        $scope.$watch(() => this.equipment, (newValue) => {
            if (!newValue || this.updateEnabled) {
                return;
            }

            if (!this.dataLoaded) {
                this.dataLoaded = true;
                return;
            }
            this.updateEnabled = true;
        },
        true);

        $scope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
            if ($state.is('root.inventory_item')) {
                this.activate();
                $state.go('root.inventory_item.details');
            }

            if (fromState.name !== 'root.inventory_item.details' && !this.dataLoaded) {
                this.activate();
            }
        });


    }

    activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'inventoryPage' });
        this.$q.all([
            this.inventoryEquipmentService.getEquipmentById(this.$state.params.equipmentId),
            this.inventoryEquipmentService.getLocationsDictionary(),
            this.inventoryEquipmentService.getStatusesDictionary()
        ])
            .then((datas) => {
                this.equipment = datas[0].data;
                this.equipment.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(this.equipment);

                if (this.equipment && this.equipment.Components) {
                    angular.forEach(this.equipment.Components, (component) => {
                        component.allHcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
                    });
                }

                if (this._showHistoryTab()
                    && _.findIndex(this.tabs, { 'title': 'History' }) === -1) {
                    this.tabs.push({
                        'title': 'History',
                        'view': 'root.inventory_item.history'
                    });
                }
                this.locationsDic = datas[1];
                this.statusesDic = datas[2];
            })
            .finally(() => {

                if (!this.equipment.PictureUrl) {
                    this.equipment.PictureUrl = '/assets/images/inventory-img.png';
                } else {
                    this.equipment.PictureUrl = this.WEB_API_INVENTORY_SERVICE_URI + this.equipment.PictureUrl;
                }

                this.bsLoadingOverlayService.stop({ referenceId: 'inventoryPage' });
            })
            .catch(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'inventoryPage' });
            });

        this._showHistoryTab = () => {
            let showTab = true;

            if (this.equipment.Bundle) {
                showTab = false;
                angular.forEach(this.equipment.Components, (item) => {
                    if (item.SerialNumber) {
                        showTab = true;
                    }
                });
            } else if (!this.equipment.SerialNumber) {
                showTab = false;
            }
            return showTab;
        };
    }

    changeStatus(statusId) {
        if (statusId !== this.inventoryStatusConstants.INACTIVE_STATUS_ID) {
            this.equipment.InactiveReason = undefined;
        }
    }

    getPatients(name, pageIndex) {
        let paramsObj = {
            Status: 1,
            pageIndex: pageIndex,
            pageSize: 10,
            fullName: name
        };

        return this.inventoryEquipmentService.getPatientsByName(paramsObj);
    }

    getLocations(name, pageIndex) {
        let paramsObj = {
            PageIndex: pageIndex,
            pageSize: 10,
            Name: name
        };

        return this.inventoryEquipmentService.getLocationsByName(paramsObj);
    }

    getPersonnels(name, pageIndex) {
        let paramsObj = {
            pageIndex: pageIndex,
            pageSize: 10,
            fullName: name
        };

        return this.inventoryEquipmentService.getPersonnelsByName(paramsObj);
    }

    updateEquipment() {
        this.bsLoadingOverlayService.start({ referenceId: 'inventoryPage' });
        this.inventoryEquipmentService.updateEquipment(this.$state.params.equipmentId, this.equipment)
            .then(() => {
                this.ngToast.success('Equipment was updated.');
                this.$state.go('root.inventory.list');
            })
            .then(() => this.bsLoadingOverlayService.stop({ referenceId: 'inventoryPage' }));
    }

    changeType() {
        switch (this.equipment.Location.StoreTypeId) {
            case this.inventoryEquipmentService.LOCATION_TYPE().PATIENT:    // Patient
                this.equipment.Location.Personnel = undefined;
                this.equipment.Location.Location = undefined;
                break;
            case this.inventoryEquipmentService.LOCATION_TYPE().PERSONNEL:    // Personnel
                this.equipment.Location.Patient = undefined;
                this.equipment.Location.Location = undefined;
                break;
            case this.inventoryEquipmentService.LOCATION_TYPE().LOCATION:    // Location
                this.equipment.Location.Patient = undefined;
                this.equipment.Location.Personnel = undefined;
                break;
            default:
                this.equipment.Location.Patient = undefined;
                this.equipment.Location.Personnel = undefined;
                this.equipment.Location.Location = undefined;
                break;
        }
    }

}

