export default class AddAuthorizationCtrl {
    constructor(
        $rootScope,
        $state,
        $mdDialog,
        bsLoadingOverlayService,
        patientService,
        patientAuthorizationService,
        authorizationId
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientService = patientService;
        this.patientAuthorizationService = patientAuthorizationService;

        this.patientId = $state.params.patientId;
        this.authorizationId = authorizationId;
        this.model = {
            Hcpcs: [],
            Modifiers: {
                Level1: null,
                Level2: null,
                Level3: null,
                Level4: null
            },
            Notes: ''
        };
        this.title = authorizationId ? 'Edit Authorization' : 'New Authorization';
        this.btnText = authorizationId ? 'Save' : 'Create';

        this.priceOptionsDictionary = [];

        this._activate();
    }

    _activate() {
        if (this.authorizationId) {
            this.bsLoadingOverlayService.start({ referenceId: 'addAuthorization' });
            this.patientAuthorizationService.getById(this.patientId, this.authorizationId)
                .then((response) => this.model = this._mapItemProperty(response.data))
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addAuthorization' }));
        }
        this.getPriceOptionsDictionary();

    }

    _mapItemProperty(model) {
        let newModel = angular.copy(model);

        newModel.Modifiers = {
            Level1: null,
            Level2: null,
            Level3: null,
            Level4: null
        };
        angular.forEach(newModel.Modifiers, (value, key) => {
            if (model.Modifiers[key]) {
                newModel.Modifiers[key] = { Id: model.Modifiers[key] };
            }
        });
        newModel.Payer = model.PayerId ? { Description: model.PayerName, Id: model.PayerId, Text: '' } : undefined;
        newModel.From = model.FromDate ? moment.utc(model.FromDate).format('MM/DD/YYYY') : '';
        newModel.To = model.ToDate ? moment.utc(model.ToDate).format('MM/DD/YYYY') : '';

        return newModel;
    }

    addHcpcs(code) {
        if (!code) {
            return;
        }

        let _findDuplicate = _.findLastIndex(this.model.Hcpcs, (item) => angular.lowercase(item) === angular.lowercase(code.Text));

        if (_findDuplicate === -1) {
            this.model.Hcpcs.push(code.Text);
        }
        this.searchHcpcs = '';
        this.hcpcs = undefined;
        $('#focusAutocomplite input').blur();
    }

    deleteHcpcs(index) {
        this.model.Hcpcs.splice(index, 1);
    }

    getHcpcsCodes(code) {
        return this.patientAuthorizationService.getHcpcsCodes(code)
            .then((response) => response.data.Items.filter((item) => !this.model.Hcpcs.find((code) => code === item.Text)));
    }

    getPriceOptionsDictionary() {
        return this.patientAuthorizationService.getPriceOptionsDictionary()
            .then((response) => {
                this.priceOptionsDictionary = response.data;
            });
    }

    getPayers(name) {
        return this.patientService.getPatientPayersByName(name, this.patientId)
            .then((response) => response.data.Items);
    }

    close() {
        this.$mdDialog.cancel();
    }

    save() {
        if (this.addForm.$valid) {
            this.bsLoadingOverlayService.start({ referenceId: 'addAuthorization' });
            this.patientAuthorizationService.save(this.patientId, this.model)
                .then(() => {
                    this.$mdDialog.cancel();
                    this.$rootScope.$broadcast('authorizationListUpdate');
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'addAuthorization' }));
        } else {
            touchedErrorFields(this.addForm);
        }
    }
}
