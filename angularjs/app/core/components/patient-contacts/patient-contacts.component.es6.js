import template from './patient-contacts.html';
import { patientContactTypeConstants } from '../../constants/core.constants.es6';

class patientContactsCtrl {
    constructor($filter, $scope, patientContactsService) {
        'ngInject';

        this.$filter = $filter;
        this.$scope = $scope;

        this.phones = '';
        this.contactTypes = [];
        this.noRecordsText = this.noRecordsText || 'Contacts';
        this.patientContactsService = patientContactsService;

        this.patientContactTypeConstants = patientContactTypeConstants;

        patientContactsService.getContactTypes()
            .then((response) => {
                if (!this.availableContactTypeIds || !this.availableContactTypeIds.length) {
                    this.contactTypes = response.data;
                    return;
                }

                this.availableContactTypeIds.forEach((item) => {
                    response.data.forEach((contactType) => {
                        if (item.toString() === contactType.Id.toString()) {
                            this.contactTypes.push(contactType);
                        }
                    });
                });
            });

        $scope.$watch(() => this.contacts, () => {
            if (!this.contacts) {
                return;
            }

            if (!this.contacts.length) {
                this.contacts.push({
                    Type: {
                        Id: '',
                        Text: ''
                    },
                    New: true
                });
            } else {
                this._setPhonesValues();
            }
        }, true);
    }

    _setPhonesValues() {
        let value = '';

        this.contacts.forEach((contact) => {
            if (contact.Type.Id
                && (+contact.Type.Id === this.patientContactTypeConstants.HOME_ID
                    || +contact.Type.Id === this.patientContactTypeConstants.WORK_ID
                    || +contact.Type.Id === this.patientContactTypeConstants.CELL_ID)) {
                value += contact.Value;
            }
        });
        this.phones = value;
    }

    isShowTooltip(contact) {
        return !!(contact.Type.Id && contact.Type.Id === this.patientContactTypeConstants.WORK_ID && this.showTooltipForWorkPhone);
    }

    isPatientAddContactDisabled() {
        if (this.contacts) {
            return this.contacts.find((contact) => !contact.Value) || this.contactsForm.$invalid;
        }

        return true;
    }

    showContact(contact) {
        const contactId = contact.Type.Id;
        const contactValue = contact.Value;

        if (this.readonly) {
            return (contactId && contactValue) ? isShowing(this.contactTypes, contactId) : false;
        }
        return contactId ? isShowing(this.contactTypes, contactId) : true;


        function isShowing(contactTypes, contactId) {
            let isShowing = false;

            contactTypes.forEach((item) => {
                if (item.Id.toString() === contactId.toString()) {
                    isShowing = true;
                }
            });
            return isShowing;
        }
    }

    addEventContact() {
        this.patientContactsService.addEventContact(this.contacts);
    }

    contactTypeChanged(index, oldTypeId) {
        let contact = this.contacts[index];

        if (oldTypeId === this.patientContactTypeConstants.EMAIL_ID
            || contact.Type.Id.toString() === this.patientContactTypeConstants.EMAIL_ID) {
            contact.Value = '';
        }

        this._checkContactTypeUnique();
    }

    deleteContact(index) {
        this.contacts.splice(index, 1);
        this._checkContactTypeUnique();
    }

    isNoRecordsAvailable() {
        const readonly = !!this.readonly;
        const noContacts = !this.contacts || !this.contacts.length;
        let noAvailableRecords = true;

        angular.forEach(this.contacts, (contact) => {
            angular.forEach(this.contactTypes, (type) => {
                if (contact.Type.Id && contact.Type.Id.toString() === type.Id.toString()) {
                    noAvailableRecords = false;
                }
            });
        });

        return (readonly && noContacts) || (readonly && noAvailableRecords);
    }

    _checkContactTypeUnique() {
        if (!this.contacts) {
            return;
        }

        let idArrayFull = [];
        let idArrayDuplicates = [];

        // get array of phone type Id's
        this.contacts.forEach((item) => idArrayFull.push(item.Type.Id));

        // sort array
        if (idArrayFull.length) {
            idArrayFull = this.$filter('orderBy')(idArrayFull);
        }

        // get array of duplicate Id's
        for (let i in idArrayFull) {
            if (parseInt(i) !== (idArrayFull.length - 1)) {
                // check is already in
                let alreadyIn = false;

                for (let j in idArrayDuplicates) {
                    if (idArrayDuplicates[j] == idArrayFull[i]) {
                        alreadyIn = true;
                    }
                }

                if (!alreadyIn && idArrayFull[i] === idArrayFull[parseInt(i) + 1]) {
                    idArrayDuplicates.push(idArrayFull[i]);
                }
            }
        }

        // mark all duplicates
        for (let i in this.contacts) {
            let formField = this.contactsForm[`contactType-${i}`];

            if (formField) {
                formField.$setValidity('notUnique', true);
                for (let j in idArrayDuplicates) {
                    if (this.contacts[i].Type.Id == idArrayDuplicates[j]) {
                        formField.$setValidity('notUnique', false);
                        formField.$setTouched();
                    }
                }
            }
        }
    }
}

const patientContacts = {
    bindings: {
        contacts: '=',
        availableContactTypeIds: '<?',
        notRequiredPhones: '<?',
        showTooltipForWorkPhone: '@?',
        readonly: '<?',
        noRecordsText: '@?',
        addBtnHide: '<'
    },
    template,
    controller: patientContactsCtrl
};

export default patientContacts;
