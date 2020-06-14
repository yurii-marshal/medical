import { contactTypeConstants, contactTypeIdConstants } from '../../constants/core.constants.es6';
import template from './organization-contacts.html';

class organizationContactsCtrl {
    constructor($scope, coreDictionariesService) {
        'ngInject';

        this.coreDictionariesService = coreDictionariesService;

        this._contactCategoriesById = {};
        this.addContactVisible = true;
        this.contactsTypesLoaded = false;
        this.selectedContactsLength = undefined;
        this.selectedLocationContactsValid = 0;
        this.contactTypeConstants = contactTypeConstants;

        $scope.$watch(() => this.selectedContacts, (newValue) => {
            if (!this.selectedContacts) {
                return;
            }

            if (this.orgLocationRequired === 'true') {
                this.selectedLocationContactsValid = 0;
                newValue.forEach((item) => {
                    if (
                        (item.type === contactTypeConstants.FAX_ID) ||
                        (item.type === 2)
                    ) {
                        this.selectedLocationContactsValid++;
                    }

                    if (
                        (item.type === contactTypeConstants.PHONE_ID) ||
                        (item.type === 8)
                    ) {
                        this.selectedLocationContactsValid++;
                    }
                });
            }

            if (newValue && newValue.length >= this.minRequired) {
                touchedErrorFields(this.contactsForm);
                this.selectedContactsLength = newValue.length;
            } else {
                this.selectedContactsLength = undefined;
            }
        }, true);

        $scope.$watchCollection(() => this.allContactTypes, (newValue) => {
            if (this.contactsTypesLoaded) {
                return;
            }

            if (!newValue) {
                this.coreDictionariesService.getContactTypes()
                    .then((response) => {
                        this.allContactTypes = response.data;
                        this._mapContactTypes(this.allContactTypes);
                        this.contactsTypesLoaded = true;
                    });
            } else if (newValue.length) {
                this._mapContactTypes(this.allContactTypes);
                this.contactsTypesLoaded = true;
            }
        });
    }

    $onInit() {
        if (!this.selectedContacts || !this.selectedContacts.length) {
            this.selectedContacts = [{
                value: undefined,
                type: undefined
            }];
        }
    }

    _mapContactTypes(items) {
        items.forEach((item) => {
            item.TypeKey = item.Text || item.Id;
            item.Text = item.Text || item.Name;
            item.CategoryType = item.Category ? item.Category.Id : item.CategoryType;
            if (!item.CategoryType) {
                if (item.Id === contactTypeConstants.PHONE_ID || item.Id === contactTypeConstants.FAX_ID) {
                    item.CategoryType = contactTypeConstants.PHONE_ID;
                } else {
                    item.CategoryType = item.Id;
                }
            }
        });
        let contactTypes = angular.copy(items);

        this.contactCategories = {};
        if (this.notAllowedTypes) {
            this.allContactTypes = contactTypes.filter((item) => {
                let contactId = item.Text ? item.Text.toLowerCase() : item.Id;

                return this.notAllowedTypes.indexOf(contactId) === -1;
            });
        }
        angular.forEach(contactTypes, (item) => {
            this._contactCategoriesById[item.TypeKey] = item;
        });
        this._toggleContactsBtn();
    }

    getContactCategory(id) {
        const typeKey = contactTypeIdConstants[id] || id;

        if (this._contactCategoriesById.hasOwnProperty(typeKey)) {
            return this._contactCategoriesById[typeKey];
        }

        return {};
    }

    checkContactType(contact, type) {
        const typeKey = this.getContactCategory(contact.type).TypeKey;

        return typeKey && typeKey.toLowerCase() === type.toLowerCase();
    }

    addEventContact() {
        if (this.contactsForm.$invalid) {
            touchedErrorFields(this.contactsForm);

            const orgLocationRequiredField = this.contactsForm.orgLocationRequired;
            const hasOnlyOrgLocationRequiredError = this.orgLocationRequired === 'true' &&
                orgLocationRequiredField &&
                orgLocationRequiredField.$error &&
                orgLocationRequiredField.$error.required;

            if (!hasOnlyOrgLocationRequiredError) {
                return;
            }
        }
        if (checkExistingContacts(this.selectedContacts)) {
            this.selectedContacts.push({
                value: undefined,
                type: undefined
            });
        }
        this._checkContactTypeUnique();

        function checkExistingContacts(array) {
            let emptyContact = true;

            for (let i = 0; i < array.length; i++) {
                // exclude Ext.Phone
                if (array[i].type && array[i].type === 7) {
                    continue;
                }

                if (array[i].type === undefined ||
                    array[i].type === null ||
                    array[i].value === undefined ||
                    array[i].value === null ||
                    array[i].value === '') {
                    emptyContact = false;
                }
            }
            return emptyContact;
        }
    }

    deleteContact(index) {
        this.selectedContacts.splice(index, 1);
        if (!this.selectedContacts.length) {
            this.selectedContacts = [{
                value: undefined,
                type: undefined
            }];
        }
        this._checkContactTypeUnique();
    }

    contactTypeChanged(contact) {
        const newCategory = this.getContactCategory(contact.newType);
        const currentCategory = this.getContactCategory(contact.type);

        if (!currentCategory.CategoryType || currentCategory.CategoryType !== newCategory.CategoryType) {
            contact.value = '';
        }
        contact.type = contact.newType;

        this._checkContactTypeUnique();
    }

    _toggleContactsBtn() {
        // hide button if all types filled
        this.addContactVisible = this.selectedContacts.length !== this.allContactTypes.length;
    }

    _checkContactTypeUnique() {
        if (this.allowNotUniqueTypes) {
            return;
        }

        if (this.selectedContacts) {
            // get Duplicates
            let idArrayDuplicates = [];

            this.selectedContacts
                .map((item) => item.type)
                .forEach((typeId, index, array) => {
                    if (array.indexOf(typeId, index + 1) !== -1) {
                        idArrayDuplicates.push(typeId);
                    }
                });

            setTimeout(() => {
                // mark all duplicates
                for (let i in this.selectedContacts) {
                    let formField = this.contactsForm[`type-${i}`];

                    if (formField) {
                        const isNotUniqueItem = idArrayDuplicates.indexOf(this.selectedContacts[i].type);

                        formField.$setValidity('notUnique', isNotUniqueItem === -1);
                        formField.$setTouched();
                    }
                }
            });

            this._toggleContactsBtn();
        }
    }
}

const organizationContacts = {
    bindings: {
        selectedContacts: '=',
        allowNotUniqueTypes: '=?',
        minRequired: '=?',
        orgLocationRequired: '@?',
        isDisabled: '<?',
        notAllowedTypes: '<?',
        allContactTypes: '<?'
    },
    template,
    controller: organizationContactsCtrl
};

export default organizationContacts;
