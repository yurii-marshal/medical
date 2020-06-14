import template from './cmn-form.html';

import {
    fieldTypes,
    questionItemTypes,
    formQuestionsTypes
} from './forms/forms-types.es6';

class cmnFormCtrl {
    constructor(ngToast,
                $scope,
                $filter,
                appConstants,
                documentsService,
                billingDictionariesService,
                cmnFormService,
                patientShortInfoService,
                searchItemsService,
                FileUploader) {
        'ngInject';

        this.documentsService = documentsService;
        this.searchItemsService = searchItemsService;
        this.billingDictionariesService = billingDictionariesService;
        this.cmnFormService = cmnFormService;
        this.FileUploader = FileUploader;
        this.ngToast = ngToast;
        this.$scope = $scope;
        this.$filter = $filter;

        this.questionItemTypes = questionItemTypes;
        this.fieldTypes = fieldTypes;
        this.formQuestionsTypes = formQuestionsTypes;

        this.notesMaxLength = appConstants.limitConstants.NOTES_MAXLENGTH;
        this.cmnCertificationTypesConstants = appConstants.cmnCertificationTypesConstants;
        this.cmnRevisionTypesConstants = appConstants.cmnRevisionTypesConstants;

        this.uploader = undefined;
        this.uploadFile = {
            documentType: undefined,
            name: '',
            bytes: []
        };

        // Dictionaries
        this.docTypes = [];
        this.certificationTypes = [
            { Name: 'Initial', Id: this.cmnCertificationTypesConstants.INITIAL_TYPE_ID },
            { Name: 'Revised', Id: this.cmnCertificationTypesConstants.REVISED_TYPE_ID },
            { Name: 'Recertification', Id: this.cmnCertificationTypesConstants.RECERTIFICATION_TYPE_ID }
        ];
        this.revisionTypes = [
            { Name: 'Initial', Id: this.cmnRevisionTypesConstants.INITIAL_TYPE_ID },
            { Name: 'Recertification', Id: this.cmnRevisionTypesConstants.RECERTIFICATION_TYPE_ID }
        ];

        // narration options
        this.portableOxygenMobileStatuses = [
            { Name: 'Yes', Id: 1 },
            { Name: 'No', Id: 0 },
            { Name: 'D', Id: 2 }
        ];
        this.generalBooleanAnswers = [
            { Name: 'Yes', Id: 1 },
            { Name: 'No', Id: 0 }
        ];
        this.searchModel = {
            Hcpcs1: '',
            Hcpcs2: '',
            Hcpcs3: '',
            Hcpcs4: ''
        };

        this.$onInit = () => {
            this.patientInfo = patientShortInfoService.getPatientShortInfo();
            this.getDocumentTypesDictionary();
            this.getPOSDictionary();
            this._getUploader();
            this.isDocumentAttachAllowed = this.isNew;
        };
    }

    isRevisedCertType() {
        return +this.model.Cmn.ReviewStatus === this.cmnCertificationTypesConstants.REVISED_TYPE_ID;
    }

    isRevisedDateRequired() {
        return +this.model.Cmn.ReviewStatus === this.cmnCertificationTypesConstants.RECERTIFICATION_TYPE_ID ||
            +this.model.Cmn.ReviewStatus === this.cmnCertificationTypesConstants.REVISED_TYPE_ID;
    }

    showSectionC() {
        return this.model.DocumentTypeId.toString() !== this.formQuestionsTypes.CMS10126.toString();
    }

    /**
     * @description - set up FileUploader:
     *                - validation;
     *                - success/error action functions
     * @private
     */
    _getUploader() {
        let uploader = new this.FileUploader();

        uploader.filters.push({
            name: 'documentFilter',
            fn: function(item) {
                const validFilenameExtensions = ['docx', 'doc', 'rtf', 'ods', 'xml', 'xps', 'xls', 'xlsx', 'xla', 'xlsm', 'xlsb', 'csv', 'ppt', 'txt', 'odt', 'pdf', 'jpg', 'jpeg', 'png'];
                const currentExtention = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();

                return validFilenameExtensions.indexOf(currentExtention) !== -1;
            }
        });

        uploader.onAfterAddingAll = this._onAfterAddingAll.bind(this);
        uploader.onWhenAddingFileFailed = this._onWhenAddingFileFailed.bind(this);
        uploader.onErrorItem = this._onErrorItem.bind(this);

        this.uploader = uploader;
    }

    /**
     * @function passed to FileUploader on success file adding
     * @param val
     * @private
     */
    _onAfterAddingAll(val) {
        const fileReader = new FileReader();
        const $this = this;

        fileReader.onloadend = function() {
            $this.uploadFile.bytes = this.result;
            $this.uploadFile.name = val[0]._file.name;
            $this.$scope.$digest();
        };

        fileReader.readAsArrayBuffer(val[0]._file);
    }

    /**
     * @function passed to FileUploader on wrong file extension added
     * @param item
     * @param filter
     * @param options
     * @private
     */
    _onWhenAddingFileFailed(item, filter, options) {
        this.ngToast.danger(`Invalid file type. Selected file ''${item.name}'' 
                                has invalid type, must be:
                                 'docx, doc, rtf, ods, xml, xps, xls, xlsx, xla, xlsm, xlsb, 
                                 csv, ppt, txt, odt, pdf, jpg, jpeg, png'<br/>`);
    }

    _onErrorItem(fileItem, response, status, headers) {
        this.ngToast.danger('unexpected error happend while uploading files');
    }

    browseFiles() {
        angular.element('#fileUploader').trigger('click');
    }

    getDocumentTypesDictionary(name) {
        const filters = { 'filter.isCmn': true };

        this.documentsService.getDocumentTypesDictionary(name, filters)
            .then((response) => this.docTypes = response.data.Items);
    }

    getReferringProviders(text, pageIndex) {
        return this.cmnFormService.getReferringProviders(text, pageIndex)
            .then((response) => response.data);
    }

    getPOSDictionary(NameOrCode, pageIndex) {
        let params = {
            Text: NameOrCode,
            pageIndex,
            selectCount: true,
            SortExpression: 'Code ASC'
        };

        return this.billingDictionariesService.getPOSDictionary(params)
            .then((response) => response.data);
    }

    isAddNarrativeDescriptionItemButtonVisible() {
        return this.model.Cmn.SupplyItemsHcpcs.selectedHcpcs &&
          this.model.Cmn.NarrativeDescriptionOfItemsAndCost.length < this.model.Cmn.SupplyItemsHcpcs.selectedHcpcs.length;
    }

    addNarrativeDescriptionItem() {
        this.model.Cmn.NarrativeDescriptionOfItemsAndCost.push({
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
        });
    }

    deleteNarrativeDescriptionItem(index) {
        this.model.Cmn.NarrativeDescriptionOfItemsAndCost.splice(index, 1);
    }

    onChangeCertificationType() {
        if (!this.isRevisedCertType()) {
            this.model.Cmn.CmnRevisionType = null;
        }
        this.updateRevisedDate();
    }

    updateRevisedDate() {
        if (!this.isRevisedDateRequired()) {
            this.model.Cmn.RevisedOrRecertificationDate = '';
        }
    }

    getHcpcsCodes(code) {
        return this.searchItemsService.getHcpcsCodes(code)
            .then((response) => response.data.Items.filter((item) => {
                return !this.model.Cmn.SupplyItemsHcpcs.selectedHcpcs.find((selected) => selected.Id === item.Id);
            }));
    }

    isHcpcsRequired(index) {
        const supplyItemsHcpcs = this.model.Cmn.SupplyItemsHcpcs;
        let isRequired = false;

        if (index === 1) {
            return true;
        }
        for (let i = index; i <= supplyItemsHcpcs.fields.length; i++) {
            if (supplyItemsHcpcs[`Hcpcs${i}`]) {
                isRequired = true;
                break;
            }
        }
        if (this.cmnForm[`Hcpcs${index}`]) {
            const isValid = (!isRequired && !this.searchModel[`Hcpcs${index}`]) || supplyItemsHcpcs[`Hcpcs${index}`];

            this.cmnForm[`Hcpcs${index}`].$setValidity('md-require-match', !!isValid);
        }

        return isRequired;
    }

    onSelectedHcpcsCodeChange() {
        const supplyItemsHcpcs = this.model.Cmn.SupplyItemsHcpcs;
        const narrativeDescription = this.model.Cmn.NarrativeDescriptionOfItemsAndCost;
        const selectedHcpcs = [];

        supplyItemsHcpcs.fields.forEach((field) => {
            if (supplyItemsHcpcs[field]) {
                selectedHcpcs.push(supplyItemsHcpcs[field]);
            }
        });
        narrativeDescription.map((n) => n.Hcpcs).forEach((hcpcsId) => {
            if (!selectedHcpcs.find((hcpcs) => hcpcs.Id === hcpcsId)) {
                const index = narrativeDescription.findIndex((n) => n.Hcpcs === hcpcsId);

                if (index !== -1) {
                    this.deleteNarrativeDescriptionItem(index);
                }
            }
        });
        if (!narrativeDescription.length) {
            this.addNarrativeDescriptionItem();
        }
        supplyItemsHcpcs.selectedHcpcs = selectedHcpcs;
    }

    onNarrativeDescriptionItemChange(item) {
        let description = '';

        if (item.Hcpcs) {
            const selectedItem = this.model.Cmn.SupplyItemsHcpcs.selectedHcpcs.find((hcpcs) => item.Hcpcs === hcpcs.Id);

            description = selectedItem && selectedItem.Description;
        }
        item.Description = description;
    }

    isNarrativeDescriptionItemOptionDisabled(current, option) {
        return current.Hcpcs !== option.Id && !!this.model.Cmn.NarrativeDescriptionOfItemsAndCost.find((item) => item.Hcpcs === option.Id);
    }

    isMostRecentTestOn4LpmRequired() {
        return !!this.model.Cmn.MostRecentTestOn4Lpm.ArterialBloodGasPo2 || !!this.model.Cmn.MostRecentTestOn4Lpm.OxygenSaturationTestPercent;
    }

    onChangeDocumentType() {
        this.onTypeChange({ docType: this.model.DocumentTypeId });
    }

}

const cmnForm = {
    bindings: {
        model: '=',
        isNew: '<',
        uploadFile: '=',
        onTypeChange: '&'
    },
    template,
    controller: cmnFormCtrl
};

export default cmnForm;

