export default class patientContactsService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    addEventContact(contacts) {
        if (this._checkExistingContacts(contacts)) {
            contacts.push({
                Type: {
                    Id: undefined,
                    Text: undefined
                },
                Value: undefined,
                New: true
            });
        }
    }

    _checkExistingContacts(contacts) {
        let emptyContact = true;

        contacts.forEach((item) => {
            if (item.Type.Id === undefined
                || item.Type.Id === null
                || item.Value === undefined
                || item.Value === null
                || item.Value === '') {
                emptyContact = false;
            }
        });
        return emptyContact;
    }

    getContactTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}patients/phone-types/dictionary`, { cache: true });
    }
}
