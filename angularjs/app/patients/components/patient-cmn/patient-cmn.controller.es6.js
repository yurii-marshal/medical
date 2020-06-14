import {
    getQuestionsForSectionB
} from './components/cmn-form/forms/forms-data.helper.es6.js';

import {
    formQuestionsTypes,
    questionItemTypes
} from './components/cmn-form/forms/forms-types.es6';
import { cms484Validator } from './components/cmn-form/forms/cms484.es6';

export default class patientCmnCtrl {
    constructor($state,
                $scope,
                ngToast,
                $q,
                $filter,
                documentsService,
                cmnFormService,
                patientShortInfoService,
                medicalRecordsService,
                searchItemsService,
                bsLoadingOverlayService,
                billingDictionariesService
    ) {
        'ngInject';

        this.ngToast = ngToast;
        this.$q = $q;
        this.$state = $state;
        this.$filter = $filter;
        this.$scope = $scope;

        this.getQuestionsForSectionB = getQuestionsForSectionB;
        this.questionItemTypes = questionItemTypes;

        this.documentsService = documentsService;
        this.medicalRecordsService = medicalRecordsService;
        this.patientShortInfoService = patientShortInfoService;
        this.cmnFormService = cmnFormService;
        this.searchItemsService = searchItemsService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.billingDictionariesService = billingDictionariesService;

        this.patientId = $state.params.patientId;
        this.cmnId = $state.params.cmnId || undefined;
        this.isNewDocument = !this.cmnId;
        this.uploadFile = undefined;

        this.documentType = formQuestionsTypes.CMS484;

        this.cmnModel = {
            Pages: '',
            File: { Name: '', Bytes: '' },
            DocumentTypeId: 198,
            Cmn: {
                sectionBQuestions: this.getQuestionsForSectionB(this.documentType),
                ReviewStatus: 1,
                CmnRevisionType: null,
                LengthOfNeed: '',
                InitialDate: '',
                RevisedOrRecertificationDate: '',
                SignedDate: '',
                POS: { Name: 'Office' },
                FacilityName: '',
                FacilityAddress: '',
                SupplyItemsHcpcs: {
                    selectedHcpcs: [],
                    fields: ['Hcpcs1', 'Hcpcs2', 'Hcpcs3', 'Hcpcs4'],
                    Hcpcs1: undefined,
                    Hcpcs2: undefined,
                    Hcpcs3: undefined,
                    Hcpcs4: undefined
                },
                ReferringProviderId: '',
                Diagnosis: {
                    Diagnosis1: undefined, // make map in loop
                    Diagnosis2: undefined,
                    Diagnosis3: undefined,
                    Diagnosis4: undefined
                },
                NarrativeDescriptionOfItemsAndCost: [
                    {
                        Hcpcs: '',
                        Description: '',
                        Charge: {
                            Amount: undefined,
                            Currency: '$'
                        },
                        Allowed: {
                            Amount: undefined,
                            Currency: '$'
                        }
                    }
                ]
                // MostRecentTest: {
                //     ArterialBloodGasPo2: '',
                //     OxygenSaturationTestPercent: '',
                //     Date: ''
                // },
                // QuestionPerfomedState: 1,
                // ConditionOfTheTest: 1,
                // PortableOxygenMobileWithinHome: 1,
                // HighestOxygenFlowRate: '',
                // MostRecentTestOn4Lpm: {
                //     ArterialBloodGasPo2: '',
                //     OxygenSaturationTestPercent: '',
                //     Date: ''
                // },
                // PatientHaveDependentEdema: 1,
                // PatientHaveCorPulmonale: 1,
                // PatientHaveHematocritGreater56Percent: 1
            },
            Description: ''
        };

        this.$scope.$watch(() => this.cmnModel.Cmn.sectionBQuestions, () => {

            switch (this.documentType) {

                case formQuestionsTypes.CMS484:
                    cms484Validator(this.cmnModel.Cmn.sectionBQuestions);
                    break;

                default:
                    break;
            }

        }, true);

        this.patientInfo = patientShortInfoService.getPatientShortInfo();
        /**
         * Redirect to document in case of manually refreshing page,
         * because we miss this.cmnId from state.params
         */
        if (_.isEmpty(this.patientInfo)) {
            $state.go('root.patient.documents', { patientId: this.patientId });
        }

        /**
         * If we come from existing CMN document to edit it
         */
        if (this.cmnId) {
            bsLoadingOverlayService.start({ referenceId: 'patientCmnForm' });
            documentsService.getDocumentById(this.cmnId)
                .then((res) => {
                    // check this for old CMN, which don't have Cmn data
                    if (res.data.Cmn) {
                        this._mapCmnModel(res);
                    } else {
                        this.cmnModel.Id = res.data.Id;
                        this.cmnModel.DocumentTypeId = res.data.DocumentTypeId;
                        this.cmnModel.Description = res.data.Description;
                    }
                })
                .finally(() => bsLoadingOverlayService.stop({ referenceId: 'patientCmnForm' }));
        }
    }

    onTypeChange(docType) {
        this.documentType = docType.toString();

        this.cmnModel.Cmn.sectionBQuestions = this.getQuestionsForSectionB(this.documentType);
    }

    /**
     * @description - mapping of response model
     * @param {Object} res
     * @private
     */
    _mapCmnModel(res) {
        this.cmnModel = res.data;

        this.documentType = res.data.DocumentTypeId.toString();

        const sectionBQuestions = this.getQuestionsForSectionB(this.documentType);

        this.cmnModel.Cmn.sectionBQuestions = this.documentsService._assingAnswersToQuestionData(sectionBQuestions, res.data.Cmn.Answers);

        delete this.cmnModel.Cmn.Answers;

        if (this.cmnModel.POS) {
            this.cmnModel.POS = { Name: this.cmnModel.POS };
        }
        this.cmnModel.Cmn.SignedDate = this._mapDates(this.cmnModel.Cmn.SignedDate);
        this.cmnModel.Cmn.InitialDate = this._mapDates(this.cmnModel.Cmn.InitialDate);
        this.cmnModel.Cmn.RevisedOrRecertificationDate = this._mapDates(this.cmnModel.Cmn.RevisedOrRecertificationDate);

        this.cmnModel.Cmn.Diagnosis = this._mapDiagnosis(this.cmnModel.Cmn.Diagnosis);
        this.cmnModel.Cmn.SupplyItemsHcpcs = this._mapSupplyItemsHcpcs(this.cmnModel.Cmn.SupplyItemsHcpcs);

        const refProvider = res.data.Cmn.ReferringProvider ?
            res.data.Cmn.ReferringProvider.ReferralCardSource :
            null;

        if (refProvider) {
            this.cmnModel.Cmn.ReferringProvider.FullName = `${this.$filter('fullname')(refProvider.Name)} (NPI: ${refProvider.Npi})`;
        }

    }

    /**
     * @param {string} date
     * @returns {string}
     * @private
     */
    _mapDates(date) {
        return date ? moment.utc(date).format('MM/DD/YYYY') : '';
    }

    /**
     * @description - Extend this.cmnModel.Cmn.Diagnosis to standard 4 properties
     *                if backend send poor info
     * @param {Object} diagnosis
     * @returns {Object}
     * @private
     */
    _mapDiagnosis(diagnosis) {
        const diagnosisLength = _.isEmpty(diagnosis) ? 0 : Object.keys(diagnosis).length;

        if (diagnosisLength < 4) {
            for (let d = (diagnosisLength+1); d <= 4; d++) {
                diagnosis[`Diagnosis${d}`] = undefined;
            }
        }
        diagnosis = this._getDiagnosisDetails(diagnosis);

        return diagnosis;
    }

    /**
     * @description Get each diagnose by ID to get missing params, which couldn't be
*                   sent from backend in CMN model
     * @param {Object} diagnosis
     * @returns {Object} - mapped diagnosis
     * @private
     */
    _getDiagnosisDetails(diagnosis) {
        let promises = [];

        for (let key in diagnosis) {
            if (diagnosis[key]) {
                let filters = { 'filter.id': diagnosis[key] };

                promises.push(this.medicalRecordsService.getAllDiagnoses(undefined, 100, 0, filters));
            }
        }

        this.$q.all(promises)
            .then((responses) => {
                responses.forEach((res) => {
                    let id = res.data.Items[0].id;

                    for (let key in diagnosis) {
                        if (diagnosis[key] && (diagnosis[key].toString() === id.toString())) {
                            diagnosis[key] = res.data.Items[0];
                        }
                    }
                });
            });

        return diagnosis;
    }

    _mapSupplyItemsHcpcs(data) {
        data = data || {};
        const fields = ['Hcpcs1', 'Hcpcs2', 'Hcpcs3', 'Hcpcs4'];
        const selectedHcpcs = [];
        const promises = [];

        fields.forEach((field) => {
            if (data[field]) {
                promises.push(this.searchItemsService.getHcpcsCodes(data[field]));
            } else {
                data[field] = undefined;
            }
        });

        this.$q.all(promises)
            .then((responses) => {
                responses.forEach((res) => {
                    const item = res.data.Items[0];

                    fields.forEach((field) => {
                        if (data[field] && data[field] === item.Id) {
                            data[field] = item;
                            selectedHcpcs.push(item);
                        }
                    });
                });
                data.fields = fields;
                data.selectedHcpcs = selectedHcpcs;
            });


        return data;
    }

    /**
     * @description - create new or update existing CMN document
     */
    save() {
        if (this.mainForm.$valid) {

            this.cmnModel.document = this.uploadFile;

            let promise = this.cmnId
                ? () => this.documentsService.editDocument(this.cmnModel)
                : () => this.documentsService.addDocument(this.patientId, this.cmnModel);

            this.bsLoadingOverlayService.start({ referenceId: 'patientCmnForm' });
            promise()
                .then(() => {
                    this.ngToast.success(`Cmn was ${this.cmnId ? 'updated' : 'created'}`);
                    this.$state.go('root.patient.documents', { patientId: this.patientId });
                })
                .finally(() => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'patientCmnForm' });
                    this._clearPatientShortInfo();
                });

        } else {
            touchedErrorFields(this.mainForm);
        }
    }

    /**
     * Cancel creating new or updating existing CMN document
     */
    cancel() {
        this.$state.go('root.patient.documents', { patientId: this.patientId });
        this._clearPatientShortInfo();
    }

    _clearPatientShortInfo() {
        this.patientShortInfoService.clearPatientShortInfo();
    }
}

