export default class PrescriptionService {
    constructor($http, WEB_API_SERVICE_URI, authService, fileService, $mdDialog) {
        'ngInject';

        this.$http = $http;
        this.authService = authService;
        this.fileService = fileService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.$mdDialog = $mdDialog;

        this.model = {
            EffectiveDate: '',
            TreatingProviderId: '',
            Hcpcs: [],
            Products: []
        };
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
    }

    resetModel() {
        this.model = {
            EffectiveDate: '',
            TreatingProviderId: '',
            Hcpcs: [],
            Products: []
        };
    }

    getPrescriptionsList(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI }v1/prescriptions`, { params })
            .then((response) => response.data.Items);
    }

    getPrescriptionDetails(prescriptionId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/prescriptions/${prescriptionId}`)
            .then((response) => {

                if (response.data.BundleProducts) {
                    response.data.BundleProducts.forEach((product) => {
                        product.Components.forEach((component) => {
                            component.Diagnosis = component.DiagnosisCodes || [];
                            component.Diagnosis = component.Diagnosis.map((diagnoseCode) => ({ Code: diagnoseCode }));

                            delete product.DiagnosisCodes;
                        });
                    });
                }

                if (response.data.Products) {
                    response.data.Products.forEach((product) => {
                        product.Diagnosis = product.DiagnosisCodes || [];
                        product.Diagnosis = product.Diagnosis.map((diagnoseCode) => ({ Code: diagnoseCode }));

                        delete product.DiagnosisCodes;
                    });
                }

                if (response.data.HcpcsCodes) {
                    response.data.HcpcsCodes.forEach((product) => {
                        product.Diagnosis = product.DiagnosisCodes || [];
                        product.Diagnosis = product.Diagnosis.map((diagnoseCode) => ({ Code: diagnoseCode }));

                        delete product.DiagnosisCodes;
                    });
                }

                return response.data;
            });
    }

    getPatientDiagnosis(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/diagnoses`)
            .then((response) => {
                response.data.Items.forEach((diagnosis) => {
                    return {
                        id: diagnosis.Id,
                        name: diagnosis.Code,
                        description: diagnosis.CodeWithDescription
                    };
                });

                return response.data.Items;
            });
    }

    addNewPrescription(model, patientId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI }v1/patients/${patientId}/prescriptions`, model);
    }

    updatePrescription(model, patientId, prescriptionId) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI }v1/patients/${patientId}/prescriptions/${prescriptionId}`, model);
    }

    deletePrescription(prescriptionId) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI }v1/prescriptions/${prescriptionId}`);
    }

    /**
     * @function for mapping contacts of  Treating Provider in prescription
     * @param {Object} provider
     */
    mapTreatingProviderContacts(provider) {
        const location = angular.copy(provider.Location);
        const contactKeys = ['Phone', 'Fax', 'Email'];
        let contacts = [];

        contactKeys.forEach((key) => {
            if (location[key]) {
                contacts.push({
                    type: key,
                    value: location[key]
                });
            }
        });

        provider.Location.Contacts = contacts;
    }


    _getPrescriptionActionGetString(options) {
        let getParams = [{ key: 'access_token', val: this.authService.getAccessToken() }];

        options = _.assign({}, options);
        // prepare options
        options.SignedDateTime = options.SignedDate
            ? moment.utc(options.SignedDateTime, 'MM/DD/YYYY').format('YYYY-MM-DD')
            : '';
        options.StartOrderDateTime = options.StartOrderDate
            ? moment.utc(options.StartOrderDateTime, 'MM/DD/YYYY').format('YYYY-MM-DD')
            : '';
        // map and check
        angular.forEach(options, (value, key) => {
            getParams.push({ key: 'model.dwo.' + _firstToLower(key), val: value });
        });
        return getParams.map((item) => item.key + '=' + item.val).join('&');

        function _firstToLower(str) {
            return str.substr(0, 1).toLocaleLowerCase() + str.substr(1);
        }
    }

    prescriptionActionPrint(id, options, pagetitle) {
        let url = `${this.WEB_API_SERVICE_URI}v1/sales-orders/prescriptions/${id}/print`;
        let fileUrl = `${url}?${this._getPrescriptionActionGetString(options)}`;

        this.$mdDialog.hide(); // prevent left opened popup
        this.fileService.open(fileUrl, pagetitle);
    }

    prescriptionActionFax(id, options, fax) {
        let url = `${this.WEB_API_SERVICE_URI}v1/sales-orders/prescriptions/${id}/send-fax?${this._getPrescriptionActionGetString(options)}&model.Fax=${fax}`;

        return this.$http.get(url);
    }

    mapPrescriptionModel(currentModel) {
        const model = angular.copy(currentModel);

        return {
            EffectiveDate: moment.utc(model.EffectiveDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            TreatingProviderId: model.TreatingProvider.Id,
            TreatingProviderLocationId: model.TreatingProvider.Location && model.TreatingProvider.Location.Id,
            Hcpcs: this._mapHcpcsCodes(model),
            Products: this._mapProducts(model)
        };
    }

    _mapHcpcsCodes(model) {
        let hcpcsCodes = [];

        angular.forEach(model.Products, (item) => {
            if (item.isAny) {
                hcpcsCodes.push({
                    Code: item.Code || item.HcpcsCode.Id,
                    LengthOfNeed: item.LengthOfNeed,
                    Count: +item.Count,
                    Description: item.Notes,
                    DiagnosisCodes: item.Diagnosis.filter((diagnose) => !!diagnose ).map((diagnoseObj) => diagnoseObj.Code)
                });
            }
        });
        return hcpcsCodes;
    }

    _mapProducts(model) {
        let products = [];

        angular.forEach(model.Products, (item) => {
            if (!item.isAny) {
                let product = {
                    ProductId: item.Id || item.Product.Id,
                    Description: item.Notes,
                    Count: item.Count
                };

                if (!item.Bundle) {
                    product.LengthOfNeed = item.LengthOfNeed;
                    product.DiagnosisCodes = item.Diagnosis.filter((diagnose) => !!diagnose ).map((diagnoseObj) => diagnoseObj.Code);
                }

                if (item.Bundle) {
                    product.Components = item.Components.map((component) => {
                        return {
                            ProductId: component.Id || component.Product.Id,
                            LengthOfNeed: component.LengthOfNeed,
                            DiagnosisCodes: component.Diagnosis.filter((diagnose) => !!diagnose ).map((diagnoseObj) => diagnoseObj.Code),
                            Description: item.Notes,
                            Count: item.Count
                        };
                    });
                }

                if (item.Bundle) {
                    products.push({ Bundle: product } );
                } else {
                    products.push({ Primitive: product } );
                }
            }

        });

        return products;
    }

    getStatusClass(prescriptionStatusId) {
        switch (prescriptionStatusId.toString()) {
            case '1': // new
            case '2': // active
                return 'green';
            case '3': // expired
                return 'orange';
            case '4': // renew
                return 'blue';
            default:
                return;
        }
    }
}
