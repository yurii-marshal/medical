import {
    orderConfirmationContactTypes,
    limitConstants
} from '../../../../../../../core/constants/core.constants.es6';

export default class OrderConfirmationModalController {
    constructor(
        $mdDialog,
        $scope,
        referral,
        fax
    ) {
        'ngInject';
        this.$mdDialog = $mdDialog;

        this.orderConfirmationContactTypes = orderConfirmationContactTypes;

        this.confirmationContacts = [];
        this.referral = referral;
        this.notes = '';
        this.notesMaxLength = limitConstants.NOTES_MAXLENGTH;

        this.confirmationContacts.push({
            value: fax || '',
            type: orderConfirmationContactTypes.FAX_ID
        });

        this.contactTypes = [
            {
                value: 'Fax',
                type: orderConfirmationContactTypes.FAX_ID
            },
            {
                value: 'Email',
                type: orderConfirmationContactTypes.EMAIL_ID
            }
        ];

        $scope.$watch(() => this.confirmationContacts, () => {
            this._checkContactTypeUnique();
        }, true);
    }

    _checkContactTypeUnique() {

        // mark all duplicates
        this.confirmationContacts
            .filter((contact) => !!contact.value)
            .forEach((contact, index) => {

                let formField = this.notifyForm[`contactVal-${index}`];

                if (formField) {
                    formField.$setValidity('notUnique', true);

                    this.confirmationContacts
                        .filter((compareContact) => !!compareContact.value)
                        .forEach((compareContact, compareContactIndex) => {

                            if (compareContactIndex !== index &&
                                contact.type === compareContact.type &&
                                contact.value.toString().trim().toLowerCase() === compareContact.value.trim().toLowerCase()) {

                                formField.$setValidity('notUnique', false);
                            }
                        });
                }
            });
    }

    doNotSend() {
        this.$mdDialog.hide();
    }

    addContact() {
        this.confirmationContacts.push({
            value: '',
            type: orderConfirmationContactTypes.EMAIL_ID
        });
    }

    deleteContact(index) {
        this.confirmationContacts.splice(index, 1);
    }

    send() {
        if (!this.confirmationContacts.length) {
            return;
        }
        this._checkContactTypeUnique();

        if (this.notifyForm.$invalid) {
            touchedErrorFields(this.notifyForm);
            return false;
        }

        this.$mdDialog.hide({
            emails: this.confirmationContacts.filter((contact) => contact.type === this.orderConfirmationContactTypes.EMAIL_ID)
                                             .map((contact) => contact.value),
            faxes: this.confirmationContacts.filter((contact) => contact.type === this.orderConfirmationContactTypes.FAX_ID)
                                            .map((contact) => contact.value),
            note: this.notes,
            DWO: this.DWO
        });
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}

