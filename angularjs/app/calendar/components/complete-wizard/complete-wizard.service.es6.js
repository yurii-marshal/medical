import { orderTypeConstants } from '../../../core/constants/core.constants.es6.js';
import { orderStatusConstants } from '../../../core/constants/core.constants.es6';
import getAllHcpcsCodesFromItem from '../../../core/helpers/order-item.helper.es6';

export default class completeWizardService {

    constructor(
        $http,
        $q,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        $filter,
        patientResupplyService,
        ordersService
    ) {
        'ngInject';

        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.SALES_ORDER_ID = orderTypeConstants.SALES_ORDER_ID;
        this.RESUPPLY_ORDER_ID = orderTypeConstants.RESUPPLY_ORDER_ID;
        this.model = {};
        this.steps = [];
        this.$filter = $filter;
        this.patientResupplyService = patientResupplyService;
        this.ordersService = ordersService;

        this._tmpSearchItems = [];
    }

    getSteps() {
        return this.steps;
    }

    getHcpcsCodesByAllItems() {
        let newItems = this.getNewItems(),
            allHcpcs = [];

        newItems.forEach((item) => {
            allHcpcs = allHcpcs.concat(getAllHcpcsCodesFromItem(item));
        });

        return allHcpcs;
    }

    setDefaultSteps(isEventComplete, orderType) {
        this.steps = [
            {
                title: 'Equipment',
                view: `root.${isEventComplete ? 'completeEvent' : 'completeOrder'}.step1.equipments`
            },
            {
                title: 'Resupply Program',
                view: `root.${isEventComplete ? 'completeEvent' : 'completeOrder'}.step2.resupply`,
                isHidden: Number(orderType) === this.RESUPPLY_ORDER_ID
            },
            {
                title: 'Notes',
                view: `root.${isEventComplete ? 'completeEvent' : 'completeOrder'}.step3`
            },
            {
                title: 'Review & Sign',
                view: `root.${isEventComplete ? 'completeEvent' : 'completeOrder'}.step4`
            }
        ];
    }

    setDefaultModel() {
        this.model = {
            patientId: undefined,
            partNumbersForSearchFilter: [],
            devices: [],
            orders: [],
            selectedOrder: {},
            prescribedModels: [],
            removedDevices: [],
            notes: '',
            signedDate: [],
            signature: [],
            signPerson: undefined,
            relationship: undefined,
            relationshipOther: '',
            ResupplyProgramAvailable: false,
            FirstResupplyProgramInit: false,
            ResupplyProgram: {
                DeliveryGroupingDays: undefined,
                ConfirmationRequired: false,
                Hold: false,
                Items: []
            },
            newResupplyDevices: []
        };
    }

    setModelForOrderComplete(orderId, patientId) {
        let defer = this.$q.defer(),
            promises = [];

        this.model.patientId = patientId;

        promises.push(this.getPatientItems(patientId));
        promises.push(this.getItemsByOrderId(orderId));
        promises.push(this.getResupplyPrograms(patientId));
        promises.push(this.ordersService.getOrderShortInfo(orderId));

        this.$q.all(promises)
            .then((responses) => {
                const patientItemsDataResponse = responses[0].data,
                    orderItemsResponse = responses[1].data,
                    resupplyDataResponse = responses[2].data;

                this.model.orderShortInfo = responses[3].data;

                // Set patient devices
                this.model.devices = patientItemsDataResponse;

                // Set order data
                this.model.orders = [{
                    OrderId: orderId,
                    DisplayId: this.$filter('orderIdToDisplayIdFilter')(orderId),
                    selected: [],
                    ordered: orderItemsResponse.Items,
                    prescribedModels: [],
                    isActive: true
                }];

                this.model.selectedOrder = this.model.orders[0];

                // Set resupply data
                this.setResupplyData(resupplyDataResponse);

                defer.resolve(this.model);

            })
            .catch(() => defer.reject(this.model));

        return defer.promise;
    }

    setModelForEventComplete(patientId, appointmentId) {
        let defer = this.$q.defer(),
            promises = [];

        this.model.patientId = patientId;

        promises.push(this.getPatientItems(patientId));
        promises.push(this.getEventDataById(appointmentId));
        promises.push(this.getResupplyPrograms(patientId));

        this.$q.all(promises)
            .then((responses) => {
                const patientItemsDataResponse = responses[0].data,
                    eventDataResponse = responses[1].data,
                    resupplyDataResponse = responses[2].data;

                // Set patient devices
                this.model.devices = patientItemsDataResponse;

                this.model.appointmentStatus = eventDataResponse.AppointmentStatus;

                // Set order data
                if (eventDataResponse.Relations) {
                    this.model.orders = eventDataResponse.Relations.map((order) => {
                        order.selected = [];
                        order.ordered = [];
                        order.prescribedModels = [];
                        return order;
                    }).filter((order) => {
                        return Number(order.OrderStatus.Id) === orderStatusConstants.NEW_ORDER_ID || Number(order.OrderStatus.Id) === orderStatusConstants.IN_PROGRESS_ORDER_ID;
                    });
                }

                if (this.model.orders && this.model.orders.length) {
                    this.model.orders[0].isActive = true;
                    this.model.selectedOrder = this.model.orders[0];

                    this.getItemsByOrderId(this.model.orders[0].OrderId).then((response) => {
                        this.model.orders[0].ordered = response.data.Items;

                        defer.resolve(this.model);
                    });
                } else {

                    this.model.selectedOrder.selected = [];

                    defer.resolve(this.model);
                }

                // Set resupply data
                this.setResupplyData(resupplyDataResponse);

            })
            .catch(() => defer.reject(this.model));

        return defer.promise;
    }

    setResupplyData(response) {
        this.hasResupplyProgram = !!response.Items;

        // If we add new resupply program we load ConfirmationRequired from url getRestriction
        if (!this.hasResupplyProgram) {

            this.patientResupplyService.getRestriction(this.model.patientId).then((res) => {
                if (res.data.ResupplyModel) {
                    this.model.ResupplyProgram.ConfirmationRequired = res.data.ResupplyModel.ResuplyRequiredForDelivery || false;
                }
            });
        }

        if (response.Items) {
            response.Items.map((item) => {
                item.NextScheduledDate = moment(item.NextScheduledDate).format('MM/DD/YYYY');
                item.NextEligibleDate = moment(item.NextEligibleDate).format('MM/DD/YYYY');
                item.HcpcsCodes = item.Product.HcpcsCodes;
                item.ProductId = item.Product.Id;
            });

            this.model.ResupplyProgram = response;
            this.model.ResupplyProgram.groupItemsForDelivery = this.model.ResupplyProgram.DeliveryGroupingDays > 0;

            this.model.ResupplyProgramAvailable = !!response.Id;
        } else {
            this.model.FirstResupplyProgramInit = true;
        }
    }

    getProductsById(Ids) {
        let params = {
            Ids,
            PageIndex: 0,
            PageSize: 100,
            StoreTypeIds: []
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params });
    }

    getEquipmentById(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${ id }`);
    }

    getEventDataById(appointmentId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/events/${ appointmentId }`);
    }

    getResupplyPrograms(patientId) {
        return this.patientResupplyService.getResupplyProgramByPatientId(patientId);
    }

    getPatientItems(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${ patientId }/equipments/inventory?pagination.pageIndex=0&pagination.pageSize=100`);
    }

    getItemsByOrderId(orderId) {
        const params = {
            'filter.status': 1
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/tracking`, { params })
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        Id: item.Id,
                        ProductId: item.ProductId,
                        Name: item.Name,
                        PartNumber: item.PartNumber,
                        Hcpcs: item.HcpcsCodes,
                        Manufacturer: item.Manufacturer,
                        ManufacturerId: item.ManufacturerId,
                        SerialNumber: item.SerialNumber,
                        LotNumber: item.LotNumber,
                        Bundle: item.Bundle,
                        Components: null,
                        Count: item.Count,
                        Status: item.Status,
                        Description: item.Notes
                    };
                });

                return response;
            });
    }

    getModel() {
        return this.model;
    }

    getNewItems() {
        let newDevices = [];

        if (this.model.orders && this.model.orders.length) {
            this.model.orders.forEach((order) => {
                order.selected.forEach((selectedItem) => {
                    selectedItem.OrderId = order.OrderId;
                    selectedItem.OrderDisplayId = order.DisplayId;
                    newDevices.push(selectedItem);
                });
            });
        } else {
            newDevices = this.model.selectedOrder.selected || [];
        }

        return newDevices;
    }

    getUpdatedItems() {
        return this.model.devices.filter((device) => device.isChanged && !device.isRemoved);
    }

    getRemovedItems() {
        return this.model.devices.filter((device) => device.isRemoved);
    }

    // find bundle products
    findExistingBundle(itemList, newItem) {
        return _.find(itemList, (o) => {
            return o.Status.Id === newItem.Status.Id &&
                o.ProductId === newItem.ProductId &&
                this.isBundleComponentsEqual(o.Components, newItem.Components);
        });
    }

    // compare components of two bundle products
    isBundleComponentsEqual(components1, components2) {
        if (components1.length !== components2.length) {
            return false;
        }

        let hasNotEqual = false;

        angular.forEach(components1, (c1) => {
            if (!_.find(components2, (c2) => {
                return c1.ProductId === c2.ProductId &&
                    c1.SerialNumber === c2.SerialNumber &&
                    c1.LotNumber === c2.LotNumber;
            })) {
                hasNotEqual = true;
            }
        });
        return hasNotEqual === false;
    }

    /**
     * @desc looking for existing products among already added
     * @param deviceToCheck
     * @returns {boolean}
     * @private
     */
    _isProductExisting(deviceToCheck) {
        let existingProduct;

        if (deviceToCheck.Type.Id === '2') {
            existingProduct = _.find(this.model.devices, (device) =>
                deviceToCheck.ProductId === device.ProductId &&
                deviceToCheck.LotNumber === device.LotNumber &&
                deviceToCheck.SerialNumber === device.SerialNumber &&
                deviceToCheck.Status.Id === device.Status.Id &&
                deviceToCheck.LocationId === device.LocationId
            );
        } else if (!deviceToCheck.Bundle) {
            existingProduct = _.find(this.model.devices, (device) =>
                deviceToCheck.ProductId === device.ProductId &&
                deviceToCheck.LotNumber === device.LotNumber &&
                deviceToCheck.Status.Id === device.Status.Id &&
                deviceToCheck.LocationId === device.LocationId
            );
        } else {
            existingProduct = this.findExistingBundle(this.model.devices, deviceToCheck);
        }

        return existingProduct;
    }

    revertSelectedItems() {
        this.model.selectedOrder.selected = angular.copy(this._tmpSearchItems);
    }

    saveSelectedItemsToTmp() {
        this._tmpSearchItems = angular.copy(this.model.selectedOrder.selected);
    }

    saveEquipmentToOrder() {

        this.model.selectedOrder.selected = this.model.selectedOrder.selected.map((prescribedModel) => {
            const maxCount = prescribedModel.maxCount;

            return {
                Id: prescribedModel.Id,
                ProductId: prescribedModel.ProductId,
                LocationId: prescribedModel.LocationId,
                LocationName: prescribedModel.LocationName,
                Name: prescribedModel.Name,
                PartNumber: prescribedModel.PartNumber,
                Group: prescribedModel.Group,
                Category: prescribedModel.Category,
                Hcpcs: prescribedModel.Hcpcs || this.$filter('hcpcsCodesToArr')(prescribedModel),
                Resupply: prescribedModel.Resupply,
                Manufacturer: prescribedModel.Manufacturer,
                SerialNumber: prescribedModel.SerialNumber,
                LotNumber: prescribedModel.LotNumber,
                Bundle: prescribedModel.Bundle,
                Components: prescribedModel.Components,
                maxCount: maxCount,
                Count: prescribedModel.Count,
                Status: prescribedModel.Status,
                Multiple: prescribedModel.Multiple,
                isNew: true
            };
        });
    }

    saveEquipment() {
        angular.forEach(this.model.selected, (prescribedModel) => {

            let addAction = false,
                maxCount = prescribedModel.maxCount,
                nonSerialised = prescribedModel.nonSerialised,
                existingProduct = this._isProductExisting(prescribedModel);

            if (nonSerialised && !existingProduct) {
                addAction = true;
            } else if (nonSerialised && existingProduct) {
                maxCount = prescribedModel.maxCount;
                addAction = !existingProduct.isNew;
            } else {
                addAction = !existingProduct;
            }

            if (addAction) {
                const index = _.findLastIndex(this.model.devices, (item) => {
                    return item.isNew;
                });
                const device = {
                    Id: prescribedModel.Id,
                    ProductId: prescribedModel.ProductId,
                    LocationId: prescribedModel.LocationId,
                    LocationName: prescribedModel.LocationName,
                    Name: prescribedModel.Name,
                    PartNumber: prescribedModel.PartNumber,
                    Group: prescribedModel.Group,
                    Category: prescribedModel.Category,
                    Hcpcs: prescribedModel.HcpcsCodes,
                    Resupply: prescribedModel.Resupply,
                    Manufacturer: prescribedModel.Manufacturer,
                    SerialNumber: prescribedModel.SerialNumber,
                    LotNumber: prescribedModel.LotNumber,
                    Bundle: prescribedModel.Bundle,
                    Components: prescribedModel.Components,
                    maxCount: maxCount,
                    Count: prescribedModel.Count,
                    Status: prescribedModel.Status,
                    Multiple: prescribedModel.Multiple,
                    isNew: true
                };

                if (index === -1) {
                    this.model.devices.unshift(device);
                } else {
                    this.model.devices.splice(index + 1, 0, device);
                }

            }
        });
    }

    getRelationships() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/caregiver-relationship/dictionaries`);
    }

    completeEvent(appointmentId, patientId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/events/${appointmentId}/complete`, this._getPostModel());
    }

    completeOrder(orderId, patientId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${ patientId }/orders/${ orderId }/complete`, this._getPostModel());
    }

    _getPostModel() {

        let postModel = {
            AddedDevices: getNewDevices(this.getNewItems()),
            UpdatedDevices: getUpdatedDevices(this.getUpdatedItems()),
            RemovedDevices: getRemovedDevices(this.getRemovedItems()),
            SignUp: {
                SignPerson: this.model.signPerson,
                SignatureBytes: this.model.signature,
                SignedDateBytes: this.model.signedDate,
                CaregiverRelationship: this.model.relationship ? this.model.relationship.Id : undefined,
                CaregiverRelationshipOther: this.model.relationshipOther
            },
            Notes: this.model.notes
        };

        if (this.model.ResupplyProgram.Items.length > 0 &&
            this.model.ResupplyProgramAvailable) {

            postModel.ResupplyProgram = {
                ConfirmationRequired: this.model.ResupplyProgram.ConfirmationRequired,
                Hold: this.model.ResupplyProgram.Hold,
                Items: []
            };

            if (this.model.ResupplyProgram.groupItemsForDelivery) {
                postModel.ResupplyProgram.DeliveryGroupingDays = this.model.ResupplyProgram.DeliveryGroupingDays;
                postModel.ResupplyProgram.ResupplyReplaceBundleItems = this.model.ResupplyProgram.ResupplyReplaceBundleItems;
            }

            angular.forEach(this.model.ResupplyProgram.Items, (item) => {

                postModel.ResupplyProgram.Items.push({
                    ProductId: item.Product.Id,
                    Count: +item.Frequency.Quantity,
                    Frequency: +item.Frequency.Frequency,
                    PeriodValue: +item.Frequency.PeriodValue,
                    PeriodType: +item.Frequency.PeriodType.Id,
                    RecentDeliveryDate: item.RecentDeliveryDate || null,
                    NextScheduledDate: moment(item.NextScheduledDate).format('YYYY-MM-DD'),
                    Hold: item.Hold
                });

            });
        }

        return postModel;

        function getUpdatedDevices(items) {
            return items.map((device) => {
                return {
                    DeviceId: device.Id,
                    Notes: device.Description
                };
            });
        }

        function getNewDevices(items) {
            return items.map((device) => {
                return {
                    DeviceId: device.Id,
                    Count: device.Count,
                    Notes: device.Description,
                    OrderId: device.OrderId
                };
            });
        }

        function getRemovedDevices(items) {
            let removedDevices = [];

            items.forEach((device) => {
                let removedDevice = {
                    DeviceId: device.Id,
                    Count: device.Count,
                    Notes: device.Description
                };

                if (device.location) {
                    removedDevice.Destination = {};

                    if (device.location.Type.Name === 'Warehouse') {
                        removedDevice.Destination.LocationId = device.location.Id;
                    }

                    if (device.location.Type.Name === 'Personnel') {
                        removedDevice.Destination.Personnel = {
                            Id: device.location.Id,
                            Name: {
                                First: device.location.Name.FirstName || '',
                                Last: device.location.Name.LastName || ''
                            }
                        };
                    }
                }
                removedDevices.push(removedDevice);
            });
            return removedDevices;
        }
    }
}
