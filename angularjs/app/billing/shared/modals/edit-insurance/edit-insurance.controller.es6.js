import { insuredSignatureOnFileConstants } from '../../../../core/constants/billing.constants.es6.js';
import {
    patientRelationshipConstants,
    patientGenderConstants,
    patientGenderConstantsV1
} from '../../../../core/constants/core.constants.es6.js';

export default class EditInsuranceCtrl {
    constructor($mdDialog, bsLoadingOverlayService, invoiceInsuranceService, patientInsurancesService, invoiceId, patientId, insuranceTypeCodes, insuranceId) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoiceInsuranceService = invoiceInsuranceService;
        this.patientInsurancesService = patientInsurancesService;

        this.insuredSignatureOnFileConstants = insuredSignatureOnFileConstants;

        this.insuranceId = insuranceId;
        this.invoiceId = invoiceId;
        this.patientId = patientId;
        this.insuranceTypeCodes = insuranceTypeCodes;
        this.insurance = {};
        this.payerPlans = [];
        this.isSelf = false;
        this.patientInfo = {};

        this.activate();
    }

    activate() {
        this.getInsurance();
        this.getPatientInfo();
        this.getRelationships();
        this.getGenders();
        this.getSignatureOnFile();
    }

    getInsurance() {
        this.bsLoadingOverlayService.start({ referenceId: 'editInsurance' });
        this.invoiceInsuranceService.getInsurance(this.invoiceId, this.insuranceId)
            .then((response) => {
                this._getPayerPlans(response.data.Payer.Id);

                this.insurance = response.data;

                this.selectedRelationship = this.insurance.Relationship.Id;
                this.isSelf = this.selectedRelationship === patientRelationshipConstants.SELF_ID;
                this.selectedGender = this._mapSelectedGender(this.insurance.Person.Gender.Id);
                this.insurance.Person.Gender = this.insurance.Person.Gender.Id;

                this.insurance.SignatureOnFile.IsSigned = this.insurance.SignatureOnFile.Type.Id;
                if (this.insurance.InsuranceTypeCode) {
                    this.insurance.InsuranceTypeCode = +this.insurance.InsuranceTypeCode.Id;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editInsurance' }));
    }

    getPatientInfo() {
        this.patientInsurancesService.getPatientInfo(this.patientId)
            .then((response) => {
                this.patientInfo = response.data;
            });
    }

    _mapSelectedGender(id) {
        const intIdKey = _.findKey(patientGenderConstants, (i) => i === id );

        return +patientGenderConstantsV1[intIdKey];
    }

    _getPayerPlans(payerId) {
        this.invoiceInsuranceService.getPayerPlans(payerId)
            .then((response) => this.payerPlans = response.data.Items);
    }

    getRelationships() {
        this.invoiceInsuranceService.getRelationships()
            .then((response) => this.relationships = response.data);
    }

    getGenders() {
        this.invoiceInsuranceService.getGenders()
            .then((response) => this.genderList = response.data);
    }

    getSignatureOnFile() {
        this.invoiceInsuranceService.getSignatureOnFile()
            .then((response) => this.signatureOnFileList = response.data);
    }

    insuranceRelationshipChanged() {
        this.isSelf = this.selectedRelationship === patientRelationshipConstants.SELF_ID;

        this.insurance.Relationship.Id = this.selectedRelationship;
        if (this.isSelf) {
            this.insurance.Person.Name = {
                FirstName: this.patientInfo.Name.First,
                LastName: this.patientInfo.Name.Last,
                MiddleName: this.patientInfo.Name.Middle || ''
            };
            this.insurance.Person.DateOfBirth = moment.utc(this.patientInfo.DateOfBirthday, 'YYYY-MM-DD').format('MM/DD/YYYY');
            this.insurance.Person.Gender = this.patientInfo.Gender.Id;
            this.insurance.Person.Address = this.patientInfo.Address;
            this.insurance.Person.Ssn = this.patientInfo.Ssn;

            this.selectedGender = this.patientInfo.Gender.Id;
        } else {
            this.insurance.Person = {
                Name: {
                    FirstName: '',
                    LastName: '',
                    MiddleName: ''
                },
                DateOfBirth: '',
                Gender: {
                    Id: '',
                    Name: '',
                    Code: ''
                },
                Address: {
                    FullAddress: '',
                    AddressLine: '',
                    AddressLine2: '',
                    City: '',
                    State: '',
                    Zip: ''
                },
                Ssn: ''
            };
            this.selectedGender = '';
        }
    }

    insuranceGenderChanged() {
        this.insurance.Person.Gender = this.selectedGender;
    }

    updateInvoiceInsurance() {
        if (this.editInsuranceForm.$invalid) {
            touchedErrorFields(this.editInsuranceForm);
            return;
        }
        this.bsLoadingOverlayService.start({ referenceId: 'editInsurance' });
        this.invoiceInsuranceService.editInvoiceInsurance(this.invoiceId, this.insurance)
            .then(() => this.$mdDialog.hide())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'editInsurance' }));
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
