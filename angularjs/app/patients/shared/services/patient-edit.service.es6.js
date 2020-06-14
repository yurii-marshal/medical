import { patientSignatureOnFileConstants } from '../../../core/constants/billing.constants.es6';
import { transformAddress } from '../../../core/helpers/transform-address.helper.es6';
import { mapPatientInfoData } from '../../../core/services/http/core/core-patient/patient-info-mapping.es6';

export default class patientEditService {
    constructor(
        $http,
        WEB_API_SERVICE_URI,
        WEB_API_BILLING_SERVICE_URI,
        $q,
        patientService
    ) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.patientService = patientService;

        this.model = {};
    }

    getModel() {
        return this.model;
    }

    getPatientInfoModel(patientId) {
        const defer = this.$q.defer();

        if (patientId) {
            this.getPatientInfo(patientId)
                .then((response) => {
                    this.model = response.data;

                    this.patientStartStatus = this.model.Status.Id;
                    this.model.DcDate = this.model.DcDate ? moment(this.model.DcDate).format('MM/DD/YYYY') : '';
                    this.model.DateOfBirthday = moment(this.model.DateOfBirthday).format('MM/DD/YYYY');
                    this.model.StatusDate = moment(this.model.StatusDate).format('MM/DD/YYYY');

                    this.model.SignatureOnFile.IsSigned = this.model.SignatureOnFile.IsSigned ?
                        patientSignatureOnFileConstants.YES_ID :
                        patientSignatureOnFileConstants.NO_ID;
                    this.model.SignatureOnFile.SignedDate = this.model.SignatureOnFile.SignedDate ?
                        moment(this.model.SignatureOnFile.SignedDate).format('MM/DD/YYYY') : null;

                    if (this.model.Location || this.model.Location.Id) {
                        this.model.Location.FullName = `${this.model.Location.Text} (${this.model.Location.Npi})`;
                    }

                    this.setPatientAge();
                    this._checkPreferredContactType();

                    if (!this.model.DeliveryAddress) {
                        this.model.DeliveryAddress = {
                            AddressLine: undefined,
                            AddressLine2: undefined,
                            City: undefined,
                            Zip: null,
                            State: null
                        };
                    }

                    // Create model if patient do not have it and create empty contacts array for handling contacts directive

                    // Init employer contact

                    if (!this.model.EmployerContact ||
                        !this.model.EmployerContact.EmployerContacts
                    ) {
                        this.model.EmployerContact = {
                            EmployerContacts: []
                        };
                    }

                    if (!this.model.EmployerContact.BusinessAddress) {
                        this.model.EmployerContact.BusinessAddress = {};
                    }

                    // Init responsible contact

                    if (!this.model.ResponsibleContact ||
                        !this.model.ResponsibleContact.ResponsibleContacts
                    ) {
                        this.model.ResponsibleContact = {
                            ResponsibleContacts: []
                        };
                    }

                    if (!this.model.ResponsibleContact.ResponsibleAddress) {
                        this.model.ResponsibleContact.ResponsibleAddress = {};
                    }

                    // Init emergency contact

                    if (!this.model.EmergencyContact ||
                        !this.model.EmergencyContact.EmergencyContacts
                    ) {
                        this.model.EmergencyContact = {
                            EmergencyContacts: []
                        };
                    }

                    if (!this.model.EmergencyContact.EmergencyAddress) {
                        this.model.EmergencyContact.EmergencyAddress = {};
                    }

                    if (!this.model.MedicalReleaseInfo) {
                        this.model.MedicalReleaseInfo = [];
                    }

                    if (!this.model.Location || !this.model.Location.Id) {
                        this.model.Location = undefined;
                    }

                    if (this.model.Facility) {
                        this.model.FacilityLocation.FullAddress = transformAddress(this.model.FacilityLocation.Address);
                    }

                })
                .finally(() => {
                    defer.resolve(this.model);
                });
        } else {
            // create new patient
            this.model = this.getDefaultPatientInfo();
            defer.resolve(this.model);
        }

        return defer.promise;
    }

    _checkPreferredContactType() {
        let tempArr = [],
            preferredContactTypes = [];

        angular.forEach(this.model.PatientContacts, (contact) => {
            if (contact.Value && contact.Type.Id) {
                tempArr.push(contact);
            }
        });

        angular.copy(tempArr, preferredContactTypes);

        if (this.model.PreferredPatientPhoneType && this.model.PreferredPatientPhoneType.Id) {
            let haveCurrentContact = false;

            angular.forEach(preferredContactTypes, (contact) => {
                if (contact.Type.Id === this.model.PreferredPatientPhoneType.Id) {
                    haveCurrentContact = true;
                }
            });

            if (!haveCurrentContact) {
                this.model.PreferredPatientPhoneType.Id = undefined;
            }
        }

        return preferredContactTypes;
    }

    setPatientAge() {
        this.model.patientAge = moment().diff(moment(this.model.DateOfBirthday, 'MM/DD/YYYY'), 'years');
    }

    getResponsiblePartyTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/responsible-party-types/dictionary`);
    }

    getGenders() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/genders/dictionary`);
    }

    getNamePrefixes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/name-prefixes/dictionary`);
    }

    getPreferredCallTimes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/preferred-call-times/dictionary`);
    }

    getRelationships() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/relationships/dictionary`);
    }

    getMaritalStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/marital-status/dictionary`);
    }

    getPatientInactiveStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/patient-inactive-status/dictionary`);
    }

    getMedicalInfoReleaseRelation() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/medical-info-release-relation/dictionary`);
    }

    getPatientInfo(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}`).then((response) => mapPatientInfoData(response));
    }

    getLocations(name) {
        const params = { name };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/locations/dictionary`, { params });
    }

    getSignatureOnFile() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patient-signature-on-file/dictionary`, { cache: true });
    }

    getTabs(patientId) {
        const mainState = patientId ? 'root.patients.edit' : 'root.patients.add';

        return [
            {
                name: 'Profile',
                state: `${mainState}.step1`
            },
            {
                name: 'Additional Info',
                state: `${mainState}.step2`
            },
            {
                name: 'Summary',
                state: `${mainState}.step3`
            }
        ];
    }

    getDefaultPatientInfo() {
        return {
            Id: '—',
            Name: {
                FullName: '',
                First: '',
                Last: ''
            },
            Tags: [],
            Prefix: undefined,
            Gender: 0,
            Status: {},
            InactiveStatus: 0,
            MaritalStatus: undefined,
            PreferredPatientPhoneType: 0,
            PreferredCallTime: 0,
            DcDate: '',
            DateOfBirthday: '',
            StatusDate: moment.utc().format('YYYY-MM-DD'),
            Height: undefined,
            Weight: undefined,
            Ssn: '',
            NickName: '',
            LocationId: 0,
            BranchId: 0,
            Address: {
                AddressLine: '',
                AddressLine2: '',
                City: '',
                Zip: '',
                State: ''
            },
            DeliveryAddress: {
                AddressLine: '',
                AddressLine2: '',
                City: '',
                Zip: '',
                State: ''
            },
            PatientContacts: [],
            EmergencyContact: {
                EmergencyPerson: {
                    First: '',
                    Last: '',
                    FullName: ''
                },
                EmergencyRelationship: 0,
                EmergencyRelationshipOther: '',
                EmergencyAddress: {
                    AddressLine: '',
                    AddressLine2: '',
                    City: '',
                    Zip: '',
                    State: ''
                },
                EmergencyContacts: []
            },
            EmployerContact: {
                Employer: '',
                BusinessAddress: {
                    AddressLine: '',
                    AddressLine2: '',
                    City: '',
                    Zip: '',
                    State: ''
                },
                EmployerContacts: []
            },
            ResponsibleContact: {
                ResponsiblePerson: {
                    First: '',
                    Last: '',
                    FullName: ''
                },
                ResponsibleType: 0,
                ResponsibleAddress: {
                    AddressLine: '',
                    AddressLine2: '',
                    City: '',
                    Zip: '',
                    State: ''
                },
                ResponsibleContacts: []
            },
            MedicalReleaseInfo: [],
            SignatureOnFile: {
                IsSigned: patientSignatureOnFileConstants.NO_ID,
                SignedDate: null
            }
        };
    }

    _getEditModel(patientInfo, patientStartStatus) {
        let info = patientInfo,
            emrg = info.EmergencyContact,
            empl = info.EmployerContact,
            resp = info.ResponsibleContact,
            medRelease = info.MedicalReleaseInfo;

        let patientModel = {
            Status: info.Status.Id,
            Name: {
                First: info.Name.First,
                Last: info.Name.Last,
                Middle: info.Name.Middle
            },
            NickName: info.NickName ? info.NickName : undefined,
            LocationId: info.Location.Id,
            Ssn: info.Ssn ? info.Ssn : undefined,
            Gender: info.Gender.Id,
            Prefix: (info.Prefix && info.Prefix.Id) ? info.Prefix.Id : undefined,
            DateOfBirthday: moment(info.DateOfBirthday).format('YYYY-MM-DD'),
            MaritalStatus: info.MaritalStatus ? info.MaritalStatus.Id : undefined,
            Address: this._getAddress(info.Address),
            PatientContacts: this._formatContactsModel(info.PatientContacts),
            Height: info.Height || undefined,
            Weight: info.Weight || undefined,
            Tags: info.Tags.map((tag) => tag.Id),
            PreferredPatientPhoneType: (info.PreferredPatientPhoneType && info.PreferredPatientPhoneType.Id) ?
                info.PreferredPatientPhoneType.Id :
                undefined,
            PreferredCallTime: (info.PreferredCallTime && info.PreferredCallTime.Id) ?
                info.PreferredCallTime.Id :
                undefined,
            EmergencyContact: {
                EmergencyPerson: this._getName(emrg.EmergencyPerson),
                EmergencyRelationship: (emrg.EmergencyRelationship && emrg.EmergencyRelationship.Id) ?
                    emrg.EmergencyRelationship.Id :
                    undefined,
                EmergencyRelationshipOther: (emrg.EmergencyRelationship && emrg.EmergencyRelationship.Id === 6) ?
                    emrg.EmergencyRelationshipOther :
                    undefined,
                EmergencyAddress: this._getAddress(emrg.EmergencyAddress),
                EmergencyContacts: this._formatContactsModel(emrg.EmergencyContacts)
            },
            EmployerContact: {
                Employer: empl.Employer ? empl.Employer : undefined,
                BusinessAddress: this._getAddress(empl.BusinessAddress),
                EmployerContacts: this._formatContactsModel(empl.EmployerContacts)
            },
            ResponsibleContact: {
                ResponsiblePerson: this._getName(resp.ResponsiblePerson),
                ResponsibleType: resp.ResponsibleType ? resp.ResponsibleType.Id : undefined,
                ResponsibleAddress: this._getAddress(resp.ResponsibleAddress),
                ResponsibleContacts: this._formatContactsModel(resp.ResponsibleContacts)
            },
            MedicalReleaseInfo: [],
            SignatureOnFile: {
                IsSigned: patientInfo.SignatureOnFile.IsSigned === patientSignatureOnFileConstants.YES_ID,
                SignedDate: moment.utc(patientInfo.SignatureOnFile.SignedDate).format('MM/DD/YYYY')
            }
        };

        if (patientStartStatus !== info.Status.Id) {
            patientModel.StatusDate = moment().format('YYYY-MM-DD');
        }

        if (info.Status.Id === 2) {
            patientModel.InactiveStatus = info.InactiveStatus.Id;
            patientModel.DcDate = info.DcDate;
        } else {
            patientModel.InactiveStatus = undefined;
            patientModel.DcDate = undefined;
        }

        patientModel.DeliveryAddress = this._getAddress(info.DeliveryAddress);

        if (medRelease.length) {
            angular.forEach(medRelease, (record) => {
                patientModel.MedicalReleaseInfo.push({
                    RelationType: record.RelationType.Id,
                    Email: record.Email ? record.Email : undefined,
                    Phone: record.Phone ? record.Phone : undefined,
                    Name: {
                        First: record.Name.First,
                        Last: record.Name.Last
                    }
                });
            });
        }

        if (info.FacilityLocation && info.FacilityLocation.Id) {
            patientModel.FacilityLocationId = info.FacilityLocation.Id;
        }

        return patientModel;
    }

    _formatContactsModel(arr) {
        if (arr && (arr.length > 0) && arr[0].Type.Id) {
            let contacts = [];

            angular.forEach(arr, (contact) => {
                if (contact.Value) {
                    contacts.push({
                        Type: contact.Type.Id,
                        Value: contact.Value,
                        PhoneExtension: contact.PhoneExtension
                    });
                }
            });

            return contacts;
        }
        return undefined;
    }

    _getAddress(address) {
        if (address &&
            address.AddressLine &&
            address.City &&
            address.Zip &&
            address.State) {
            return {
                AddressLine: address.AddressLine,
                AddressLine2: address.AddressLine2 ? address.AddressLine2 : '',
                City: address.City,
                Zip: address.Zip,
                State: address.State
            };
        }
        return undefined;
    }

    _getName(name) {
        if (name) {
            return {
                First: name.First,
                Last: name.Last,
                Middle: name.Middle
            };
        }
    }

    getDeliveryAddresSources() {
        return [
            { id: 'patient', name: 'Patient' },
            { id: 'facility', name: 'Facility' }
        ];
    }

    save(patientId, orderId, patientInfo, patientStartStatus) {
        let editModel = this._getEditModel(patientInfo, patientStartStatus);

        if (patientId) {         // edit existing patient
            return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}`, editModel);
        } else if (orderId) {   // create new patient and assign to order
            return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/`, editModel)
                .then((response) => {
                    const defer = this.$q.defer();

                    if (response && response.data.Id) {
                        this.$http.put(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/assign-to-patient/${response.data.Id}`)
                            .then(() => defer.resolve(response));
                    } else {
                        defer.reject('Patient was not created.');
                    }
                    return defer;
                });
        }                 // create new patient
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/`, editModel);
    }
}
