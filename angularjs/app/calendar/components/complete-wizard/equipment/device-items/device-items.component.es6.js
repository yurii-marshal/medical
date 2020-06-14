import template from './device-items.html';
import RemoveDeviceMoveToModalController from '../modals/remove-device-move-to/remove-device-move-to.controller.es6';
import removeDeviceMoveToTemplate from '../modals/remove-device-move-to/remove-device-move-to-modal.html';

import RemoveDeviceConfirmModalController from '../modals/remove-device-confirm/remove-device-confirm.es6';
import removeDeviceConfirmTemplate from '../modals/remove-device-confirm/remove-device-confirm.html';

class DeviceItemsCtrl {
    constructor(
        $mdDialog,
        bsLoadingOverlayService,
        completeWizardService,
        $filter
    ) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.completeWizardService = completeWizardService;
        this.isEventComplete = false;
        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
    }

    getComponents(item) {
        if (this.isPatientItems) {
            this.getComponentsForPatientItem(item);
        } else {
            this.getComponentsForOrderItem(item);
        }
    }

    getComponentsForPatientItem(item) {

        if (!item.Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${ item.Id }` });

            this.completeWizardService.getEquipmentById(item.Id)
                .then((response) => {

                    item.Components = response.data.Components;

                    item.Components.forEach((item) => {
                        item.Hcpcs = this.$filter('hcpcsCodesToArr')(item);
                    });
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${ item.Id }` });
                });
        }
    }


    getComponentsForOrderItem(item) {

        if (!item.Components) {
            this.bsLoadingOverlayService.start({ referenceId: `bundleComponents${ item.Id }` });

            this.completeWizardService.getProductsById([item.ProductId])
                .then((response) => {
                    let searchItem = response.data.Items[0];

                    searchItem.Components.forEach((searchItemComponent) => {
                        if (item.Components) {
                            item.Components.forEach((itemComponent) => {
                                if (searchItemComponent.Id === itemComponent.ProductId) {
                                    searchItemComponent.SerialNumber = itemComponent.SerialNumber;
                                    searchItemComponent.LotNumber = itemComponent.LotNumber;
                                }
                            });
                        }

                        searchItemComponent.Hcpcs = this.$filter('hcpcsCodesToArr')(searchItemComponent);
                    });

                    item.Components = searchItem.Components;

                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: `bundleComponents${ item.Id }` });
                });
        }
    }

    deletePatientDevice($event, device) {

        this.$mdDialog.show({
            template: removeDeviceMoveToTemplate,
            targetEvent: $event,
            clickOutsideToClose: true,
            controllerAs: '$ctrl',
            controller: RemoveDeviceMoveToModalController,
            locals: {
                maxCountToMove: device.Count
            }
        })
            .then((dataObj) => {
                this.deleteDevice(device, dataObj.countItems, dataObj.selectedLocation);
            });
    }

    deleteDeviceWithoutPersonnel($event, device) {

        this.$mdDialog.show({
            template: removeDeviceConfirmTemplate,
            targetEvent: $event,
            clickOutsideToClose: true,
            controllerAs: '$ctrl',
            controller: RemoveDeviceConfirmModalController,
            locals: {
                maxCountToMove: device.Count,
                deviceName: device.Name
            }
        })
            .then((dataObj) => {
                this.deleteDevice(device, dataObj.countItems);
            });
    }

    deleteDevice(device, countItems, newLocation) {
        const removedDevice = angular.copy(device),
            removeCount = countItems;

        if (device.isNew) {

            if (angular.isArray(this.resupplyDevices)) {
                if (device.Bundle) {
                    device.Components.forEach((component) => {
                        _.remove(this.resupplyDevices, (resupplyDevice) => resupplyDevice.Product.Id === component.ProductId && resupplyDevice.IsNew);
                    });
                } else {
                    _.remove(this.resupplyDevices, (resupplyDevice) => resupplyDevice.Product.Id === device.ProductId && resupplyDevice.IsNew);
                }
            }

            _.remove(this.devices, (existingDevice) => existingDevice.Id === device.Id);
            return ;
        }

        if (device.Count > removeCount) {
            device.Count = device.Count - removeCount;
        } else {
            _.remove(this.devices, (existingDevice) => (existingDevice.Id === device.Id && !existingDevice.isRemoved));
        }

        const alreadyRemovedDevice = this.devices.find((device) => {
            if (device.isRemoved &&
                device.Id === removedDevice.Id &&
                // split removed item by different locations
                (!newLocation || (device.location && device.location.Id === newLocation.Id))
            ) {
                return device;
            }
        });

        if (alreadyRemovedDevice) {
            alreadyRemovedDevice.Count += removeCount;
        } else {
            removedDevice.Count = removeCount;
            removedDevice.isRemoved = true;
            this.devices.push(removedDevice);
        }

        if (newLocation) {
            removedDevice.location = newLocation;
        }

        this.sortDevices();
    }

    cancelDeletedDevice(device) {
        const foundDevice = this.devices.find((existingDevice) => (existingDevice.Id === device.Id && !existingDevice.isRemoved));

        if (foundDevice) {
            foundDevice.Count += device.Count;
            _.remove(this.devices, (existingDevice) => existingDevice === device);
        } else {
            delete device.isRemoved;
            delete device.location;
        }

        this.sortDevices();
    }

    setChangeStatus(device) {
        if (!device) {
            return false;
        }
        // Push device to top for view
        if ((device.Description && device.Description.length) &&
            !device.isRemoved &&
            !device.isNew) {

            device.isChanged = true;
        } else if ((device.Description && device.Description.length) && device.isRemoved || device.isNew) {
            delete device.isChanged;
        } else if (!(device.Description && device.Description.length) && device.isChanged) { // If length text is 0 and status is changed move to end list
            delete device.isChanged;
        }

        this.sortDevices();
    }

    sortDevices() {
        this.devices = _.orderBy(this.devices, ['isNew', 'isChanged', 'isRemoved'], ['asc']);
    }

}

const deviceItems = {
    bindings: {
        devices: '=',
        resupplyDevices: '=', // It needs for remove updated items
        isCurrentDevices: '=',
        editing: '=',
        ordered: '=',
        maxCount: '=',
        movePopup: '=',
        isPatientItems: '=',
        isShowOrderId: '=',
        qtyEditable: '<',
        dynamicMaxCount: '<?'
    },
    template,
    controller: DeviceItemsCtrl
};

export default deviceItems;

