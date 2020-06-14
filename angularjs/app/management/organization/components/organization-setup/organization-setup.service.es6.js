export default class organizationSetupService {
    constructor($q, $http, authService, WEB_API_SERVICE_URI, WEB_API_ORGANIZATIONS_URI) {
        'ngInject';

        this.$q = $q;
        this.$http = $http;
        this.authService = authService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_ORGANIZATIONS_URI = WEB_API_ORGANIZATIONS_URI;

        this.model = {};
    }

    clearModel() {
        this.model = {
            Name: '',
            Address: {},
            Contacts: [],
            Image: {
                Name: '',
                Bytes: ''
            }
        };
    }

    getModel() {
        return this.model;
    }

    getAndSetOrganization() {
        // in future organization ID should be added to endpoint
        return this.$http.get(`${this.WEB_API_ORGANIZATIONS_URI}v1/organizations`)
            .then((response) => this._setModel(response.data));
    }

    // TODO change to new endpoint from organizations microservice
    getOrganizationResupplyInfo() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/organization`)
            .then((res) => res.data && res.data.OrganizationSettings);
    }

    _setModel(data) {
        this.model.Name = data.Name;
        this.model.Address = data.Address;

        if (!data.OrganizationSettings) {
            this.model.OrganizationSettings = {
                GroupItemsForDelivery: false,
                ShippingDateWithin: undefined,
                ResupplyOrdersUpfront: undefined
            };
        } else {
            this.model.OrganizationSettings = data.OrganizationSettings;
        }

        if (data.Contacts && data.Contacts.length) {
            this.model.Contacts = data.Contacts.map((item) => {
                return {
                    newType: item.Type.Id,
                    type: item.Type.Id,
                    value: item.Value
                };
            });
        } else {
            this.model.Contacts = [];
        }

        if (data.ImageHash) {
            this.model.ImageHash = data.ImageHash;
        }
    }

    updateOrganization() {
        return this.$http.put(`${this.WEB_API_ORGANIZATIONS_URI}v1/organizations`, this._getUpdateModel());
    }

    _getUpdateModel() {
        let model = {
            Name: this.model.Name,
            Address: this.model.Address,
            Contacts: this.model.Contacts.map((o) => {
                return {
                    Type: o.type,
                    Value: o.value
                };
            }),
            OrganizationSettings: this.model.OrganizationSettings
        };

        if (this.model.Image.Name && this.model.Image.Bytes) {
            model.Image = {
                Name: this.model.Image.Name,
                Bytes: this.model.Image.Bytes
            };
        }

        return model;
    }

    getBase64FromBuffer(buffer) {
        let binary = '',
            bytes = new Uint8Array(buffer),
            len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    _fileToBase64(url) {
        const defer = this.$q.defer();
        let xhr = new XMLHttpRequest();

        xhr.onload = function() {
            let reader = new FileReader();

            reader.onloadend = function() {
                defer.resolve(reader.result);
            }
            reader.readAsArrayBuffer(xhr.response);
        };
        xhr.onerror = () => defer.reject();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();

        return defer.promise;
    }

    getOrganizationLogoUrl(hash) {
        const token = this.authService.getAccessToken();
        let url = `${this.WEB_API_ORGANIZATIONS_URI}v1/organizations/images?hash=${hash}&access_token=${token}`

        return this._fileToBase64(url)
            .then((base64) => {
                return {
                    url,
                    Name: `${hash}.jpg`,
                    Bytes: this.getBase64FromBuffer(base64)
                };
            });
    }
}
