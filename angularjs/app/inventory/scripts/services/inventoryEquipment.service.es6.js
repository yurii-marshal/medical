import { inventoryStatusConstants } from '../../../core/constants/core.constants.es6.js';

export default class inventoryEquipmentService {
    constructor(
        $http,
        $filter,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        infinityTableFilterService,
        corePatientService
    ) {
        'ngInject';

        this.$http = $http;
        this.$filter = $filter;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.infinityTableFilterService = infinityTableFilterService;
        this.corePatientService = corePatientService;
    }

    LOCATION_TYPE() {
        // TODO remove this hardcode. We have endpoint
        return {
            LOCATION: '4431a39527655d7683172f00f10aec9b6afdf5da',
            PERSONNEL: '38e7f34b00aee32798fa6a83b6fa7bea21b5e81d',
            PATIENT: '2a79e8ac5f9ba8b8e3f7ee1bfa25583c9ca8f034'
        };
    }

    getCategoriesDictionary(params){
        params = angular.merge(params, { SortExpression: 'Name ASC' });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/categories/dictionary`, { params, cache: true })
            .then(res => res.data.Items);
    }

    getGroupsDictionary(params = {}){
        params = angular.merge(params, { SortExpression: 'Name ASC' });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/groups/dictionary`, { params, cache: true })
            .then(res => res.data.Items);
    }

    getLocationsDictionary(){
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/locations/types/dictionary`, { cache: true })
            .then(res => res.data.Items);
    }

    getStatusesDictionary(){
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/status/dictionary`, { cache: true })
            .then(res => res.data);
    }

    getList(filterObj, sortExpressions, pageIndex, pageSize) {
        sortExpressions = this.infinityTableFilterService.getSortExpressions(sortExpressions);
        let paramsObj = this.infinityTableFilterService.getFilters(filterObj);

        if (paramsObj.HcpcsCode) {
            paramsObj.HcpcsCode = paramsObj.HcpcsCode.Id;
        }

        paramsObj = angular.merge(paramsObj, {
            'sortExpression': sortExpressions,
            'pageIndex': pageIndex,
            'pageSize': pageSize
        });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment`, { params: paramsObj })
            .then((response) => {
                if (response.data.Items.length) {
                    response.data.Items.map((item) =>
                        item.allHcpcsCodes = item.AdditionalHcpcsCodes && item.AdditionalHcpcsCodes.length ?
                            _.union(item.PrimaryHcpcsCodes, item.AdditionalHcpcsCodes) :
                            item.PrimaryHcpcsCodes);
                }
                return response;
            });
    }

    getEquipmentById(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${id}`)
        .then(res => {
            switch (res.data.Status.Name) {
            case 'Active':
                res.data.statusClass = 'green';
                break;
            case 'Retired':
                res.data.statusClass = 'dark-blue';
                break;
            default:
                res.data.statusClass = 'gray';
                break;
            }

            // adding extra field for normal work of autocompletes
            if (res.data.Location.Patient) {
                res.data.Location.Patient.DisplayName = res.data.Location.DisplayName;
                res.data.Location.Patient.Id = res.data.Location.Patient.UniqueId;
            }
            if (res.data.Location.Personnel) {
                res.data.Location.Personnel.DisplayName = res.data.Location.DisplayName;
                res.data.Location.Personnel.Id = res.data.Location.Personnel.UniqueId;
            }
            if (res.data.Location.Location) {
                res.data.Location.Location.DisplayName = res.data.Location.DisplayName;
            }

            // joining notes from array to single string
            res.data.Notes = res.data.Notes ? res.data.Notes.join(' \n') : '';

            return res;

        });
    }

    updateEquipment(id, equipment) {
        let saveModel = {
            Status: equipment.Status.Id,
            InactiveReason: equipment.Status.Id === inventoryStatusConstants.INACTIVE_STATUS_ID ? equipment.InactiveReason : undefined,
            Destination: {},
            Refurbished: equipment.Refurbished
        };

        switch (equipment.Location.StoreTypeId) {
            case this.LOCATION_TYPE().PATIENT: // patient
                // Name.First/Last/Middle we get from dictionary
                // Name.FirstName/LastName/MiddleName we get from base equipment model
                saveModel.Destination.Patient = {
                    Id: equipment.Location.Patient.Id,
                    Name: {
                        First: equipment.Location.Patient.Name.First || equipment.Location.Patient.Name.FirstName,
                        Last: equipment.Location.Patient.Name.Last || equipment.Location.Patient.Name.LastName
                    },
                    DateOfBirth: equipment.Location.Patient.DateOfBirth
                };
                break;
            case this.LOCATION_TYPE().PERSONNEL: // personnel
                // Name.First/Last/Middle we get from dictionary
                // Name.FirstName/LastName/MiddleName we get from base equipment model
                saveModel.Destination.Personnel = {
                    Id: equipment.Location.Personnel.Id,
                    Name: {
                        First: equipment.Location.Personnel.Name.First || equipment.Location.Personnel.Name.FirstName,
                        Last: equipment.Location.Personnel.Name.Last || equipment.Location.Personnel.Name.LastName
                    }
                };
                break;
            default: // location
                saveModel.Destination.LocationId = equipment.Location.Location.Id;
        }

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/equipment/${id}`, saveModel);

    }

    deleteEquipmentById(id) {
        return this.$http.delete(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${id}`);
    }

    getPatientsByName(params) {
        params = angular.merge(params, { sortExpression: 'Name ASC' });
        return this.corePatientService.getPatientsDictionary(params)
            .then(response => {
                angular.forEach(response.data.Items, o => {
                    // remap for layout of name in autocomplete
                    o.DisplayName = `${o.Name.FullName} (${this.$filter('amDateFormat')(this.$filter('amUtc')(o.DateOfBirthday), 'MM/DD/YYYY')})`;
                    // remap of patient date of birth
                    o.DateOfBirth = o.DateOfBirthday;
                    // remap of patient names, because they are from different sources
                    o.Name = {
                            FirstName: o.Name.First,
                            LastName: o.Name.Last
                    }
                });
                return response.data;
            });
    }

    getLocationsByName(params) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/locations/dictionary?sortExpression=Name+ASC`, { params })
            .then(response => {
                response.data.Items.forEach(o => o.DisplayName = o.Name + `${o.Description ? ', ' + o.Description : ''}`);
                return response.data;
            });
    }

    getPersonnelsByName(params) {
        params = angular.merge(params, { sortExpression: 'Name.FullName ASC' });
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/personnel`, { params })
            .then(response => {
                angular.forEach(response.data.Items, o => {
                        o.DisplayName = o.Name.FullName;
                        // remap of personnel names, because they are from different sources
                        o.Name = {
                            FirstName: o.Name.First,
                            LastName: o.Name.Last
                        }
                    }
                );
                return response.data;
            });
    }

    getEquipmentNotes(pageIndex, pageSize, sortExpression, filterExpression, equipmentId) {
        let params = this.infinityTableFilterService.getFilters(filterExpression);
        params = angular.merge(params, { pageSize, pageIndex, sortExpression });

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${equipmentId}/notes`, { params })
            .then(response => {
                response.data = {
                    Count: response.data.Count,
                    Items: response.data.Items.map(item => {
                        return {
                            Description: item.Text,
                            CreatedByUser: {
                                Name: {
                                    First: item.User.FirstName,
                                    Last: item.User.LastName,
                                    FullName: `${item.User.FirstName} ${item.User.LastName}`
                                }
                            },
                            CreatedDate: item.Date
                        };
                    })
                };
                return response;
            });

    }

    addEquipmentNote(note, equipmentId) {
        return this.$http.post(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${equipmentId}/notes`, note);
    }

    getEquipmentHistory(id) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/equipment/${id}/history`);
    }

    getHcpcsCodes(code, pageIndex) {
        const params = {
            code,
            pageIndex
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }
}

