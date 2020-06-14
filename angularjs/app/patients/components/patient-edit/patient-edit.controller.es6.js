import { patientSignatureOnFileConstants } from '../../../core/constants/billing.constants.es6';
import {
    patientContactTypeConstants,
    patientStatusesConstants
} from '../../../core/constants/core.constants.es6';

export default class patientEditController {
    constructor($scope,
                $state,
                $timeout,
                $mdDialog,
                $q,
                bsLoadingOverlayService,
                patientEditService,
                corePatientService,
                organizationLocationsService,
                organizationsFacilityService,
                facilityService,
                geoAddressesService,
                ngToast,
                patientContactsService
                ) {
        'ngInject';

        this.$timeout = $timeout;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$scope = $scope;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientEditService = patientEditService;
        this.patientContactsService = patientContactsService;
        this.corePatientService = corePatientService;
        this.organizationLocationsService = organizationLocationsService;
        this.organizationsFacilityService = organizationsFacilityService;
        this.facilityService = facilityService;
        this.geoAddressesService = geoAddressesService;
        this.ngToast = ngToast;

        this.patientId = $state.params.patientId;
        this.orderId = $state.params.orderId;

        this.tabs = patientEditService.getTabs(this.patientId);
        this.patientSignatureOnFileConstants = patientSignatureOnFileConstants;

        this.breadcrumbName = `${this.patientId ? 'Edit' : 'Add New'} Patient`;

        this.dictionary = {};
        this.patientInfo = {
            DeliveryAddress: {}
        };
        this.maxDOB = moment().format('MM/DD/YYYY');
        this.copyToDeliveryFrom = null;
        this.releaseInfoExpanded = true;
        this.deliveryAddresSources = this.patientEditService.getDeliveryAddresSources();
        this.deliveryAddresSourcesTypes = {
            PATIENT: 'patient', FACILITY: 'facility'
        };

        this.patientContactsTypeCount = 6;

        this.patientStartStatus = undefined;
        this.preferredContactTypes = [];

        this.contactTypes = patientContactTypeConstants;
        this.patientStatusesConstants = patientStatusesConstants;

        this.addressesValidationStatus = {
            businessAddress: {
                isChecked: false,
                isRequired: false
            },
            emergencyAddress: {
                isChecked: false,
                isRequired: false
            },
            responsibleAddress: {
                isChecked: false,
                isRequired: false
            },
            patientAddresses: {
                isChecked: false,
                isRequired: true
            },
            deliveryAddresses: {
                isChecked: false,
                isRequired: true
            }
        };

        this.emergencyContactsTypes = [
            this.contactTypes.HOME_ID,
            this.contactTypes.CELL_ID
        ];

        this.responsibleContactsTypes = [
            this.contactTypes.HOME_ID,
            this.contactTypes.WORK_ID,
            this.contactTypes.CELL_ID,
            this.contactTypes.EMAIL_ID,
            this.contactTypes.FAX_ID
        ];

        this.employerContactsTypes = [
            this.contactTypes.WORK_ID,
            this.contactTypes.EMAIL_ID,
            this.contactTypes.FAX_ID
        ];

        $scope.$watch(() => {
            return this.patientInfo.Address;
        }, () => {
            this.addressesValidationStatus.patientAddresses.isChecked = false;
        }, true);

        $scope.$watch(() => {
            return this.patientInfo.DeliveryAddress;
        }, () => {
            this.addressesValidationStatus.deliveryAddresses.isChecked = false;
            this.copyToDeliveryFrom = null;
        }, true);

        $scope.$watch(() => {
            return this.patientInfo.PatientContacts;
        }, (newContactsVal, prevContactsVal) => {

            this.preferredContactTypes = this.patientEditService._checkPreferredContactType();

            // Bind work contact patient information => employer info
            if (prevContactsVal) {
                prevContactsVal.forEach((prevVal, index) => {
                    let isFindMatch = false,
                        isEmployerContactsHasWork = false;

                    if (prevVal.Type.Id !== this.contactTypes.WORK_ID) {
                        return ;
                    }

                    this.patientInfo.EmployerContact.EmployerContacts.forEach((employerContact) => {

                        if (employerContact.Type.Id === this.contactTypes.WORK_ID) {
                            isEmployerContactsHasWork = true;
                        }

                        if ((employerContact.Value || employerContact.PhoneExtension || employerContact.Type.Id) &&
                            employerContact.Value === prevVal.Value &&
                            employerContact.PhoneExtension === prevVal.PhoneExtension &&
                            employerContact.New === prevVal.New
                        ) {
                            isFindMatch = true;
                            employerContact.Value = newContactsVal[index].Value;
                            employerContact.PhoneExtension = newContactsVal[index].PhoneExtension;
                        }
                    });

                    if (!isFindMatch && !isEmployerContactsHasWork) {
                        let copiedContact = angular.copy(newContactsVal[index]);

                        copiedContact.New = true;
                        this.patientInfo.EmployerContact.EmployerContacts.unshift(copiedContact);
                    }

                });
            }

        }, true);

        this._activate();
    }

    initWatchers() {

        this.$scope.$watch(() => {
            return this.patientInfo.EmployerContact.BusinessAddress;
        }, (businessAddress) => {

            if (businessAddress) {
                this.addressesValidationStatus.businessAddress.isChecked = false;
                this.addressesValidationStatus.businessAddress.isRequired = this.isSomeAddressFieldFilled(businessAddress);
            }

        }, true);

        this.$scope.$watch(() => {
            return this.patientInfo.EmergencyContact.EmergencyAddress;
        }, (emergencyAddress) => {

            if (emergencyAddress) {
                this.addressesValidationStatus.emergencyAddress.isChecked = false;
                this.addressesValidationStatus.emergencyAddress.isRequired = this.isSomeAddressFieldFilled(emergencyAddress);
            }

        }, true);

        this.$scope.$watch(() => {
            return this.patientInfo.ResponsibleContact.ResponsibleAddress;
        }, (responsibleAddress) => {

            if (responsibleAddress) {
                this.addressesValidationStatus.responsibleAddress.isChecked = false;
                this.addressesValidationStatus.responsibleAddress.isRequired = this.isSomeAddressFieldFilled(responsibleAddress);
            }

        }, true);

    }

    isSomeAddressFieldFilled(addressObj) {
        return !!(addressObj.Zip || addressObj.State || addressObj.City || addressObj.AddressLine || addressObj.AddressLine2);
    }

    setPatientAge() {
        this.patientEditService.setPatientAge();
    }

    _activate() {
        let promises = [];

        promises.push(this._getResponsiblePartyTypes());
        promises.push(this._getGenders());
        promises.push(this._getNamePrefixes());
        promises.push(this._getPreferredCallTimes());
        promises.push(this._getRelationships());
        promises.push(this._getMaritalStatuses());
        promises.push(this._getPatientStatuses());
        promises.push(this._getPatientInactiveStatuses());
        promises.push(this._getSignatureOnFile());
        promises.push(this._getPatientInfo(this.patientId));

        if (!this.$state.is(this.tabs[0].state)) {
            this.$state.go(this.tabs[0].state);
        }

        this.bsLoadingOverlayService.start({ referenceId: 'patientEdit' });
        this.$q.all(promises)
            .then(() => {

                this.initWatchers();

                this.dictionary.patientStatuses.forEach((status) => {
                    if (status.Id === this.patientInfo.Status.Id) {
                        this.patientInfo.Status = status;
                    }
                });

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientEdit' }));
    }

    isPatientAddContactDisabled() {

        if (this.patientInfo.PatientContacts &&
            this.patientInfo.PatientContacts.length === this.patientContactsTypeCount) {

            return true;
        }

        if (this.patientInfo.PatientContacts) {
            return this.patientInfo.PatientContacts.find((contact) => !contact.Value) || this.step1Form['$ctrl.contactsForm'].$invalid;
        }

        return true;
    }

    getPreferredText() {
        let preferredValArr = ['Preferred'];

        if (this.patientInfo.PreferredCallTime) {
            this.dictionary.preferredCallTimes.forEach((preferredCallTime) => {
                if (preferredCallTime.Id === this.patientInfo.PreferredCallTime.Id) {
                    preferredValArr.push(preferredCallTime.Text);
                }
            });
        }

        return preferredValArr.join(', ');
    }

    getLocations(name) {
        return this.patientEditService.getLocations(name)
            .then((response) => response.data.Items);
    }

    patientStatusChanged(id) {
        if (id.toString() !== '2') {
            this.patientInfo.DcDate = '';
            this.$timeout(() => this.patientInfo.InactiveStatus = '');
        }
    }

    showModal(event, record) {
        event.stopPropagation();
        this.$mdDialog.show({
            controller: 'addMedicalInfoRecordModalController',
            controllerAs: 'modal',
            templateUrl: 'patients/views/modals/addMedicalInfoRecord.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            locals: {
                addMedicalInfo: this.addMedicalInfo.bind(this),
                record
            }
        });
    }

    copyAddress(copyFrom, copyTo) {
        if (!copyFrom) {
            this.ngToast.warning('Please select source to copy from');
            return;
        }

        if (copyFrom.id === this.deliveryAddresSourcesTypes.PATIENT) {
            if (this._isPatientAddressFulfilled()) {
                angular.copy(this.patientInfo.Address, copyTo);
            } else {
                this.ngToast.warning('Please fulfill patient address');
            }
        }

        if (copyFrom.id === this.deliveryAddresSourcesTypes.FACILITY) {
            if (this._isFacilityFulfilled()) {
                angular.copy(this.patientInfo.FacilityLocation.Address, copyTo);
            } else {
                this.ngToast.warning('Please fulfill facility address');
            }
        }

        copyFrom = null;
    }

    _isPatientAddressFulfilled() {
        return this.patientInfo.Address.AddressLine &&
            this.patientInfo.Address.City &&
            this.patientInfo.Address.State &&
            this.patientInfo.Address.Zip;
    }

    _isFacilityFulfilled() {
        return this.patientInfo.Facility && this.patientInfo.FacilityLocation;
    }

    _isDeliveryAddressFulfilled() {
        return this.patientInfo.DeliveryAddress.AddressLine &&
            this.patientInfo.DeliveryAddress.City &&
            this.patientInfo.DeliveryAddress.State &&
            this.patientInfo.DeliveryAddress.Zip;
    }

    relationshipChanged() {
        this.patientInfo.EmergencyContact.EmergencyRelationshipOther = '';
    }

    addMedicalInfo(record) {
        this.patientInfo.MedicalReleaseInfo.push(record);
        this.releaseInfoExpanded = true;
    }

    deleteMedicalInfo(index) {
        this.patientInfo.MedicalReleaseInfo.splice(index, 1);
    }

    signatureOnFileChanged(SignatureOnFile) {
        if (SignatureOnFile.IsSigned.toString() === patientSignatureOnFileConstants.NO_ID) {
            SignatureOnFile.SignedDate = '';
        }
    }

    getOrganizationLocations(name, pageIndex) {
        return this.organizationLocationsService.getLocationsDictionary(name, pageIndex)
            .then((response) => {
                response.data.Items.map((item) => {
                    item.FullName = `${item.Text} (${item.Npi})`;
                    return item;
                });

                return response.data;
            });
    }

    getFacilities(Name, PageIndex) {
        return this.organizationsFacilityService.getFacilities({ Name, PageIndex, selectCount: true })
            .then((response) => response.data);
    }

    onFacilityChange(facilityId) {
        if (!facilityId) {
            this.patientInfo.FacilityLocation = null;
            this.dictionary.facilityLocations = [];
        } else {
            this._getFacilityLocations(facilityId);
        }
    }

    _getFacilityLocations(facilityId) {

        return this.organizationsFacilityService.getFacilityLocations(facilityId)
            .then((response) => {
                if (response.data.length) {
                    this.dictionary.facilityLocations = this.facilityService.mapLocations(response.data, true);
                } else {
                    this.dictionary.facilityLocations = [{
                        FullAddress: 'No Locations on this facility',
                        Id: null
                    }];
                }
            });
    }

    isActive(state) {
        return this.$state.is(state);
    }

    addNewContact(constcts) {
        this.patientContactsService.addEventContact(constcts);
    }

    next() {
        let index = _.findIndex(this.tabs, (step) => this.$state.is(step.state));

        const validationStatus = this.addressesValidationStatus;

        if (this.mainForm.$valid) {

            if (this.tabs[index].name === 'Profile' &&
                (!validationStatus.patientAddresses.isChecked ||
                 !validationStatus.deliveryAddresses.isChecked)) {

                this._checkAddresses().then(() => {

                    validationStatus.patientAddresses.isChecked = true;
                    validationStatus.deliveryAddresses.isChecked = true;

                    this._goToNextStep(index);
                });
            } else if (this.tabs[index].name === 'Additional Info' &&
                       ((!validationStatus.businessAddress.isChecked && validationStatus.businessAddress.isRequired) ||
                        (!validationStatus.emergencyAddress.isChecked && validationStatus.emergencyAddress.isRequired) ||
                        (!validationStatus.responsibleAddress.isChecked && validationStatus.responsibleAddress.isRequired)
                       )) {

                this._checkAdditionalInfoAddresses().then(() => {
                    this.addressesValidationStatus.responsibleAddress.isChecked = true;
                    this.addressesValidationStatus.emergencyAddress.isChecked = true;
                    this.addressesValidationStatus.businessAddress.isChecked = true;

                    this._goToNextStep(index);
                });

            } else {
                this._goToNextStep(index);
            }

        } else {
            touchedErrorFields(this[`step${(index + 1)}Form`]);
        }
    }

    _goToNextStep(index) {
        this.$state.go(this.tabs[index + 1].state);
        this._setTabsFinished(this.tabs, index, true);
    }

    patientCurrentFormInvalid() {
        let index = _.findIndex(this.tabs, (step) => this.$state.is(step.state));

        if (index === this.tabs.length - 1) {
            return true;
        }

        return this[`step${(index + 1)}Form`].$invalid;
    }

    previous() {
        let index = _.findIndex(this.tabs, (step) => this.$state.is(step.state));

        let stepName = this.tabs[index].name;

        this._setTabsFinished(this.tabs, index, false);

        if (stepName === 'Items' && !this.model.hasReferringProvider) {
            this.$state.go(this.tabs[0].state);
            return ;
        }

        this.$state.go(this.tabs[index - 1].state);
    }

    _setTabsFinished(tabs, currentIndex, isNext) {
        angular.forEach(tabs, (tab, index) => {
            if (isNext) {
                tab.isFinished = index < currentIndex + 1;
            } else {
                tab.isFinished = index < currentIndex - 1;
            }
        });
    }

    isSaveShown() {
        return this.$state.is(this.tabs[this.tabs.length - 1].state);
    }

    isPreviousDisabled() {
        return this.$state.is(this.tabs[0].state);
    }

    isNextDisabled() {
        return false;
    }

    cancel() {
        if (this.patientId) {
            this.$state.go('root.patient', { patientId: this.patientId });
        } else {
            this.$state.go('root.patients.list');
        }
    }

    save() {
        this._savePatient();
    }

    _savePatient() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientEdit' });
        this.patientEditService.save(
            this.patientId,
            this.orderId,
            this.patientInfo,
            this.patientStartStatus
        )
        .then((response) => this.$state.go('root.patient.demographics', { patientId: this.patientId || response.data.Id }))
        .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientEdit' }));
    }

    _checkAdditionalInfoAddresses() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientEdit' });

        const defer = this.$q.defer(),
            addressesArr = [],
            validationStatus = this.addressesValidationStatus;

        if (!validationStatus.businessAddress.isChecked &&
            validationStatus.businessAddress.isRequired) {

            addressesArr.push({
                addressObj: this.patientInfo.EmployerContact.BusinessAddress,
                modalTitle: 'Employer Address'
            });
        }

        if (!validationStatus.emergencyAddress.isChecked &&
            validationStatus.emergencyAddress.isRequired
        ) {
            addressesArr.push({
                addressObj: this.patientInfo.EmergencyContact.EmergencyAddress,
                modalTitle: 'Emergency Address'
            });
        }

        if (!validationStatus.responsibleAddress.isChecked &&
            validationStatus.responsibleAddress.isRequired
        ) {
            addressesArr.push({
                addressObj: this.patientInfo.ResponsibleContact.ResponsibleAddress,
                modalTitle: 'Responsible Address'
            });
        }

        this.geoAddressesService.checkOrModifyAddresses(addressesArr)
            .then(() => {
                defer.resolve(addressesArr);
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'patientEdit' });
            });

        return defer.promise;
    }

    _checkAddresses() {
        const defer = this.$q.defer();

        this.bsLoadingOverlayService.start({ referenceId: 'patientEdit' });

        let addressesArr = [{
            addressObj: this.patientInfo.Address,
            modalTitle: 'Patient Address'
        }];

        if (this._isDeliveryAddressFulfilled()) {
            addressesArr.push({
                addressObj: this.patientInfo.DeliveryAddress,
                modalTitle: 'Delivery Address'
            });
        }

        this.geoAddressesService.checkOrModifyAddresses(addressesArr)
            .then(() => {
                this.addressesValidationStatus.patientAddresses.isChecked = true;
                this.addressesValidationStatus.deliveryAddresses.isChecked = true;
                defer.resolve(addressesArr);
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'patientEdit' });
            });

        return defer.promise;
    }

    _getPatientInfo(patientId) {
        const defer = this.$q.defer();

        this.patientEditService.getPatientInfoModel(patientId)
            .then((patientModel) => {
                this.patientInfo = patientModel;
                defer.resolve();
            });

        window.scrollTo(0, 0);

        return defer.promise;
    }

    _getResponsiblePartyTypes() {
        return this.patientEditService.getResponsiblePartyTypes()
            .then((response) => this.dictionary.responsiblePartyTypes = response.data);
    }

    _getGenders() {
        return this.patientEditService.getGenders()
            .then((response) => {
                _.remove(response.data, (item) => item.Text.toLowerCase() === 'unknown');
                this.dictionary.genders = response.data;
            });
    }

    _getNamePrefixes() {
        return this.patientEditService.getNamePrefixes()
            .then((response) => this.dictionary.namePrefixes = response.data);
    }

    _getPreferredCallTimes() {
        return this.patientEditService.getPreferredCallTimes()
            .then((response) => this.dictionary.preferredCallTimes = response.data);
    }

    _getRelationships() {
        return this.patientEditService.getRelationships()
            .then((response) => this.dictionary.relationships = response.data);
    }

    _getMaritalStatuses() {
        return this.patientEditService.getMaritalStatuses()
            .then((response) => this.dictionary.maritalStatuses = response.data);
    }

    _getPatientStatuses() {
        return this.corePatientService.getPatientStatuses()
            .then((response) => this.dictionary.patientStatuses = response.data.filter((status) => status.Id !== this.patientStatusesConstants.HOLD_ID));
    }

    _getPatientInactiveStatuses() {
        return this.patientEditService.getPatientInactiveStatuses()
            .then((response) => this.dictionary.patientInactiveStatuses = response.data);
    }

    _getSignatureOnFile() {
        return this.patientEditService.getSignatureOnFile()
            .then((response) => this.signatureOnFileList = response.data);
    }

    changeResponsibleType() {
        const SELF_TYPE = 6;

        if (this.patientInfo.ResponsibleContact.ResponsibleType && this.patientInfo.ResponsibleContact.ResponsibleType.Id === SELF_TYPE) {
            angular.merge(this.patientInfo.ResponsibleContact.ResponsibleContacts, this.patientInfo.PatientContacts);
            this.patientInfo.ResponsibleContact.ResponsiblePerson = angular.copy(this.patientInfo.Name);
            this.patientInfo.ResponsibleContact.ResponsibleAddress = angular.copy(this.patientInfo.Address);
        }
    }
}
