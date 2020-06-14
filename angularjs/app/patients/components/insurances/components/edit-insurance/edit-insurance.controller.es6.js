import { insuredSignatureOnFileConstants } from '../../../../../core/constants/billing.constants.es6';

export default class editInsuranceController {
    constructor(
        $rootScope,
        $state,
        ngToast,
        bsLoadingOverlayService,
        patientInsurancesService,
        payersService
    ) {
        'ngInject';

        this.$rootScope = $rootScope;
        this.$state = $state;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.patientInsurancesService = patientInsurancesService;
        this.payersService = payersService;

        this.insuredSignatureOnFileConstants = insuredSignatureOnFileConstants;
        this.insuranceId = $state.params.insuranceId;

        this.selfRelationship = 1;
        this.relationship = 0;

        this.genderList = [];
        this.relationships = [];
        this.insuranceTypeCodes = [];
        this.statuses = [];
        this.payerPlans = [];
        this.isSelf = false;

        this.insurance = {
            Payer: undefined,
            ClaimCode: '',
            Status: {
                Id: 3,
                Text: ''
            },
            PolicyNumber: '',
            EffectiveDate: '',
            ExpiredDate: '',
            Holder: {
                Ssn: '',
                Name: {
                    First: '',
                    Last: '',
                    FullName: '',
                    Middle: ''
                },
                DateOfBirthday: '',
                RelationshipValue: 0,
                Relationship: {
                    Id: 0,
                    Text: ''
                },
                LocationId: 0,
                Address: {
                    FullAddress: '',
                    AddressLine: '',
                    AddressLine2: '',
                    City: '',
                    Zip: '',
                    State: ''
                },
                Gender: 0,
                GroupNumber: '',
                PayerPlan: undefined
            },
            CreatedDate: '',
            InsuranceVerification: {},
            Deductible: null,
            Coinsurance: null,
            Copay: null,
            SignatureOnFile: {
                IsSigned: insuredSignatureOnFileConstants.NO_ID,
                SignedDate: null
            }
        };

        if (this.insuranceId) {
            this.bsLoadingOverlayService.start({ referenceId: 'editInsurance' });
            this.patientInsurancesService.getInsurance(this.insuranceId)
                .then((response) => {
                    this.insurance = response.data;

                    this.insurance.InsuranceTypeCode = response.data.InsuranceTypeCode ? response.data.InsuranceTypeCode.Id : null;
                    this.insurance.PayerId = response.data.Payer.Id;

                    this.insurance.Holder.DateOfBirthday = moment.utc(this.insurance.Holder.DateOfBirthday, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    this.insurance.searchPayer = this.insurance.Payer.Name;
                    this.insurance.Holder.Gender = this.insurance.Holder.Gender.Id;
                    this.isSelf = this.insurance.Holder.Relationship.Id === this.selfRelationship;
                    this.relationship = this.insurance.Holder.Relationship.Id;
                    this.insurance.EffectiveDate = this.insurance.EffectiveDate ?
                        moment.utc(this.insurance.EffectiveDate, 'YYYY-MM-DD').format('MM/DD/YYYY') : '';
                    this.insurance.TerminationDate = this.insurance.TerminationDate ?
                        moment.utc(this.insurance.TerminationDate, 'YYYY-MM-DD').format('MM/DD/YYYY') : '';

                    this._getPayerPlans(this.insurance.Payer.Id);
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editInsurance' }));
        }

        this._activate();
    }

    _activate() {
        this._getGenders();
        this._getRelationships();
        this._getSignatureOnFile();
        this._getStatuses();
        this._getInsuranceTypeCodes();
    }

    getPayers(name) {
        return this.patientInsurancesService.getPayers(name)
            .then((response) => response.data.Items);
    }

    goToInsurancesList() {
        this.$state.go('root.patient.insurances.insurances-list');
    }

    cancel() {
        this.goToInsurancesList();
    }

    save() {
        if (this.addForm.$invalid) {
            touchedErrorFields(this.addForm);
            return;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'editInsurance' });
        this.patientInsurancesService.save(this.$state.params.patientId, this.insurance)
            .then(() => {
                this.ngToast.success(`Insurance is ${this.insuranceId ? 'updated' : 'created'}`);
                this.$rootScope.$broadcast('insurancesUpdated');
                this.$rootScope.$broadcast('patientUpdated');
                this.goToInsurancesList();
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editInsurance' }));
    }

    insuranceChanged() {
        if (this.insurance.Payer) {
            this.insurance.searchPayer = this.insurance.Payer.Name;
            this.insurance.ClaimCode = this.insurance.Payer.ClaimCode;

            if (this.insurance.Payer.Id !== this.insurance.PayerId) {
                this.insurance.PayerId = this.insurance.Payer.Id;
                clearPayerPlans.apply(this);
            }

            this._getPayerPlans(this.insurance.Payer.Id);
        } else {
            clearPayerPlans.apply(this);
            this.insurance.ClaimCode = '';
        }

        function clearPayerPlans() {
            this.insurance.Holder.PayerPlan = undefined;
            this.payerPlans = [];
        }
    }

    relationshipChanged() {
        this.isSelf = this.insurance.Holder.Relationship.Id === this.selfRelationship;
        if (this.isSelf) {
            this.bsLoadingOverlayService.start({ referenceId: 'editInsurance' });
            this.patientInsurancesService.getPatientInfo(this.$state.params.patientId)
                .then((response) => {
                    this.insurance.Holder.Name = response.data.Name;
                    this.insurance.Holder.DateOfBirthday = moment.utc(response.data.DateOfBirthday, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    this.insurance.Holder.Address = response.data.Address;
                    this.insurance.Holder.Ssn = response.data.Ssn;
                    this.insurance.Holder.Gender = response.data.Gender.Id;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editInsurance' }));
        } else if (this.relationship === this.selfRelationship) {
            this.insurance.Holder.Name = '';
            this.insurance.Holder.DateOfBirthday = '';
            this.insurance.Holder.Address = '';
            this.insurance.Holder.Ssn = '';
            this.insurance.Holder.Gender = '';
        }
        this.relationship = this.insurance.Holder.Relationship.Id;
    }

    signatureOnFileChanged() {
        if (this.insurance.SignatureOnFile.IsSigned === insuredSignatureOnFileConstants.NO_ID) {
            this.insurance.SignatureOnFile.SignedDate = null;
        }
    }

    _getGenders() {
        this.patientInsurancesService.getGenders()
            .then((response) => this.genderList = response.data);
    }

    _getStatuses() {
        this.patientInsurancesService.getStatuses()
            .then((response) => this.statuses = response.data);
    }

    _getRelationships() {
        this.patientInsurancesService.getRelationships()
            .then((response) => this.relationships = response.data);
    }

    _getSignatureOnFile() {
        this.patientInsurancesService.getSignatureOnFile()
            .then((response) => this.signatureOnFileList = response.data);
    }

    _getPayerPlans(payerId) {
        this.payersService.getPayerPlans(payerId)
            .then((response) => this.payerPlans = response.data);
    }

    _getInsuranceTypeCodes() {
        this.payersService.getInsuranceTypesCodes()
            .then((response) => this.insuranceTypeCodes = response.data);
    }

    getMinTerminationDate(effectiveDate) {
        if (effectiveDate) {
            return moment(effectiveDate).add(1, 'days').format('MM/DD/YYYY');
        }
    }
}
