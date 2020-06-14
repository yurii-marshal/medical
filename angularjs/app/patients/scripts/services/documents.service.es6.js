import {
    questionItemTypes,
    fieldTypes,
    answerTypes,
    formQuestionsTypes
} from '../../../../app/patients/components/patient-cmn/components/cmn-form/forms/forms-types.es6';

export default class documentsService {
    constructor($http, fileService, WEB_API_SERVICE_URI, authService) {
        'ngInject';

        this.$http = $http;
        this.fileService = fileService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.authService = authService;
        this.questionItemTypes = questionItemTypes;
        this.fieldTypes = fieldTypes;
        this.answerTypes = answerTypes;
        this.formQuestionsTypes = formQuestionsTypes;
    }

    getDocuments(patientId, filtersObj) {
        let params = { sortExpression: 'CreatedDate DESC' };

        if (filtersObj) {
            angular.merge(params, filtersObj);
        }

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/documents`, { params })
            .then((response) => {
                response.data.Items
                    .map((item) => item.StatusClass = item.Status ? this._getStatusClass(item.Status.Id) : '');
                return response;
            });
    }

    getDocumentTypes(name) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}document-types?name={0}&sortExpression=Name%20ASC`.format(name));
    }

    getDocumentTypesDictionary(name, filtersObj) {
        const params = { name, 'sortExpression': 'Name ASC' };

        if (filtersObj) {
            angular.merge(params, filtersObj);
        }
        return this.$http.get(`${this.WEB_API_SERVICE_URI}document-types/dictionary`, { params });
    }

    getDocumentHistory(patientId, documentTypeId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/documents/${documentTypeId}/previous`);
    }

    getOrders(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/dictionary`);
    }

    addDocument(patientId, document) {
        let model = {};

        if (document.DocumentTypeId) {
            model = this._getModelForCmnUpload(document, true);
        } else {
            model = this._getModelForDocumentUpload(document);
        }

        return this.$http.post(`${this.WEB_API_SERVICE_URI}v2/patients/${patientId}/documents/upload`, model);
    }


    _getModelForDocumentUpload(document) {
        return {
            Pages: '',
            File: {
                Name: document.name,
                Bytes: this._getByteArray(document.bytes)
            },
            DocumentTypeId: document.documentType.Id,
            Description: document.notes
        };
    }

    _assingAnswersToQuestionData(sectionBQuestions, answers) {

        const self = this;

        function assignFields(fields, answers, questionIndex) {
            fields.forEach((field) => {

                const answer = answers.find((answer) => {
                    return answer.QuestionNumber === (questionIndex.toString() + field.name);
                });

                if (answer) {
                    let value = answer.Value;

                    if (field.type === self.fieldTypes.DATE) {
                        value = moment(value, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    } else if (field.type === self.fieldTypes.GAS_MASK) {
                        value = value.toFixed(2);
                        value = value.length === 4 ? `0${value}` : value;
                    }

                    field.value = value;
                }
            });

            return fields;
        }

        sectionBQuestions.forEach((question) => {

            if (question.type === this.questionItemTypes.FIELDS) {
                question.fields = assignFields(question.fields, answers, question.order);
            } else if (question.type === this.questionItemTypes.GROUP_FIELDS) {
                question.groups.forEach((group) => {
                    group.fields = assignFields(group.fields, answers, question.order);
                });
            } else {

                const answer = answers.find((answer) => {
                    return answer.QuestionNumber === question.order.toString();
                });

                if (answer) {
                    let value = answer.Value;

                    if (question.type === this.questionItemTypes.DATE) {
                        value = moment(value, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    }

                    question.value = value;
                }
            }

        });

        return sectionBQuestions;
    }

    _getAnswerTypeByFieldType(fieldType) {
        const matchObj = {
            [this.fieldTypes.INT_MASK]: this.answerTypes.Number,
            [this.fieldTypes.TEXT]: this.answerTypes.Text,
            [this.fieldTypes.RADIO]: this.answerTypes.Number,
            [this.fieldTypes.DATE]: this.answerTypes.Date,
            [this.fieldTypes.GAS_MASK]: this.answerTypes.Number
        };

        return matchObj[fieldType];
    }

    _getAnswerTypeByQuestionType(questionType) {
        const matchObj = {
            [this.questionItemTypes.TEXT]: this.answerTypes.Text,
            [this.questionItemTypes.DATE]: this.answerTypes.Date,
            [this.questionItemTypes.CHECKBOX]: this.answerTypes.Number,
            [this.questionItemTypes.INT]: this.answerTypes.Number,
            [this.questionItemTypes.RADIO]: this.answerTypes.Number
        };

        return matchObj[questionType];
    }

    _getFieldsAnswers(fields, order) {
        return fields.reduce((acc, field) => {
            const valueType = this._getAnswerTypeByFieldType(field.type);

            let value = field.value;

            if (value !== null) {

                if (valueType === this.answerTypes.Date) {
                    value = moment(field.value).format('YYYY-MM-DD');
                } else if (valueType === this.answerTypes.Number) {
                    value = +field.value;
                }

                acc.push({
                    QuestionNumber: order + field.name,
                    Value: value,
                    Type: valueType
                });
            }

            return acc;
        }, []);
    }

    _getModelForCmnUpload(document, isNew) {
        const supplyItemsHcpcs = document.Cmn.SupplyItemsHcpcs;

        let answers = document.Cmn.sectionBQuestions.reduce((acc, question) => {
            if (question.type === this.questionItemTypes.FIELDS) {
                acc = [...acc, ...this._getFieldsAnswers(question.fields, question.order)];
            } else if (question.type === this.questionItemTypes.GROUP_FIELDS) {
                question.groups.forEach((group) => {
                    acc = [...acc, ...this._getFieldsAnswers(group.fields, question.order)];
                });
            } else if (question.value !== null) {
                const valueType = this._getAnswerTypeByQuestionType(question.type);

                let value = question.value;

                if (valueType === this.answerTypes.Date) {
                    value = moment(question.value).format('YYYY-MM-DD');
                } else if (valueType === this.answerTypes.Number) {
                    value = +question.value;
                }

                acc.push({
                    QuestionNumber: question.order.toString(),
                    Value: value,
                    Type: valueType
                });
            }

            return acc;
        }, []);

        let model = {
            DocumentTypeId: document.DocumentTypeId,
            Cmn: {
                Answers: answers,
                NameOfPersonAnswering: document.Cmn.NameOfPersonAnswering,
                ReviewStatus: document.Cmn.ReviewStatus,
                CmnRevisionType: document.Cmn.CmnRevisionType,
                LengthOfNeed: document.Cmn.LengthOfNeed,
                InitialDate: moment(document.Cmn.InitialDate).format('YYYY-MM-DD'),
                RevisedOrRecertificationDate: document.Cmn.RevisedOrRecertificationDate ?
                        moment(document.Cmn.RevisedOrRecertificationDate).format('YYYY-MM-DD') :
                        '',
                SignedDate: moment(document.Cmn.SignedDate).format('YYYY-MM-DD'),
                POS: document.Cmn.POS && document.Cmn.POS.Name ? document.Cmn.POS.Name : document.Cmn.POS,
                FacilityName: document.Cmn.FacilityName,
                FacilityAddress: document.Cmn.FacilityAddress,
                SupplyItemsHcpcs: {
                    Hcpcs1: supplyItemsHcpcs.Hcpcs1 && supplyItemsHcpcs.Hcpcs1.Id,
                    Hcpcs2: supplyItemsHcpcs.Hcpcs2 && supplyItemsHcpcs.Hcpcs2.Id,
                    Hcpcs3: supplyItemsHcpcs.Hcpcs3 && supplyItemsHcpcs.Hcpcs3.Id,
                    Hcpcs4: supplyItemsHcpcs.Hcpcs4 && supplyItemsHcpcs.Hcpcs4.Id
                },
                ReferringProviderId: document.Cmn.ReferringProvider.Id,
                Diagnosis: {
                    Diagnosis1: document.Cmn.Diagnosis.Diagnosis1.id,
                    Diagnosis2: document.Cmn.Diagnosis.Diagnosis2 ? document.Cmn.Diagnosis.Diagnosis2.id : null,
                    Diagnosis3: document.Cmn.Diagnosis.Diagnosis3 ? document.Cmn.Diagnosis.Diagnosis3.id : null,
                    Diagnosis4: document.Cmn.Diagnosis.Diagnosis4 ? document.Cmn.Diagnosis.Diagnosis4.id : null
                }
            },
            Description: document.Description
        };

        if (document.DocumentTypeId.toString() !== this.formQuestionsTypes.CMS10126.toString()) {
            model.Cmn.NarrativeDescriptionOfItemsAndCost = document.Cmn.NarrativeDescriptionOfItemsAndCost;
        }

        if (isNew) {
            model.Pages = '';
            model.File = {
                Name: document.document.name,
                Bytes: this._getByteArray(document.document.bytes)
            };
        }

        return model;
    }

    editDocument(document) {
        let model = {};

        if (document.DocumentTypeId === 198) {
            // 198 - DocumentType Id of CMN document
            model = this._getModelForCmnUpload(document);
        } else {
            model = this._getModelForDocumentEdit(document);
        }

        return this.$http.put(`${this.WEB_API_SERVICE_URI}v2/patients/documents/${document.Id}`, model);
    }

    _getModelForDocumentEdit(document) {
        return {
            Description: document.Description,
            DocumentTypeId: document.DocumentType.Id,
            Id: document.Id
        };
    }

    view(accessToken) {
        return this.fileService.openFileOnTab({
            url: `${this.WEB_API_SERVICE_URI}v1/patients/documents/${accessToken}?access_token=${this.authService.getAccessToken()}`
        });
    }

    getDocumentById(documentId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v2/patients/documents/${documentId}`);
    }

    remove(documentIds) {
        return this.$http.delete(`${this.WEB_API_SERVICE_URI}v1/patients/documents`, { params: { ids: documentIds } });
    }

    share(documents, orders) {
        let model = {
            PatientDocuments: _.map(documents, (document) => document.Id),
            Orders: _.map(orders, (order) => order.Id)
        };

        return this.$http.post(`${this.WEB_API_SERVICE_URI}patient/documents/share`, model);
    }

    _getByteArray(bytes) {
        let byteArray = [],
            uint8Array = new Uint8Array(bytes);

        angular.forEach(uint8Array, (value) => byteArray.push(value));
        return byteArray;
    }

    _getStatusClass(documentStatusId) {
        switch (documentStatusId.toString()) {
            case '1': // active
                return 'green';
            case '2': // expired
                return 'orange';
            case '3': // renewed
                return 'blue';
            default:
                break;
        }
    }


}
