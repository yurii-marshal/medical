// Constants
import { limitConstants } from '../../../core/constants/core.constants.es6.js';
import {
    invoiceStatusConstants,
    invoiceResubmissionCodeConstants,
    systemAttributesCategoryConstants,
    pricingTypeConstants,
    insuredSignatureOnFileConstants,
    patientSignatureOnFileConstants,
    providerSignatureOnFileConstants
} from '../../../core/constants/billing.constants.es6';

// Rental Options Modal
import rentalModalTemplate from '../../../core/modals/rental-options/rental-options.html';
import rentalModalController from '../../../core/modals/rental-options/rental-options.controller.es6.js';
// Price Options Modal
import pricingOptionsModalTemplate from '../../shared/modals/pricing-options/price-options.html';
import pricingOptionsModalController from '../../shared/modals/pricing-options/pricing-options-modal.controller.es6.js';
// Apply Price Options Modal
import applyPriceOptionsTemplate from '../../shared/modals/apply-price-options/apply-price-options.html';
import applyPriceOptionsController from '../../shared/modals/apply-price-options/apply-price-options.controller.es6.js';
// Invoice Validation Modal                №
import invoiceValidateModalTemplate from '../../views/modals/invoiceValidateModal.html';
import invoiceValidateModalController from '../../scripts/controllers/modals/invoiceValidateModal.controller.es6.js';
// Invoice Rental Service Line Modal
import invoiceRentalServiceLineModalTemplate from '../../views/modals/invoice-rental-service-line-modal.html';
import invoiceRentalServiceLineModalController from '../../scripts/controllers/modals/invoiceRentalServiceLineModal.controller.es6.js';

import {
    calcFloatDiff,
    calcFloatSum
} from '../../../core/helpers/math-operations.helper.es6';

export default class ModifyInvoiceController {
    constructor(
        $mdDialog,
        $scope,
        $timeout,
        $state,
        invoiceModifyService,
        billingsCommonService,
        billingDictionariesService,
        $q,
        ngToast,
        bsLoadingOverlayService,
        invoiceAttrDictionaryService,
        billingProvidersService
    ) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoiceAttrDictionaryService = invoiceAttrDictionaryService;
        this.billingProvidersService = billingProvidersService;
        this.invoiceModifyService = invoiceModifyService;
        this.billingsCommonService = billingsCommonService;
        this.billingDictionariesService = billingDictionariesService;
        this.$state = $state;
        this.ngToast = ngToast;
        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$timeout = $timeout;

        this.invoiceResubmissionCodeConstants = invoiceResubmissionCodeConstants;

        this.invoiceId = $state.params.invoiceId;
        this.model = undefined;
        this.dictionaries = undefined;
        this.diagnoses = [];
        this.selectedDiagnoses = [];
        this.showDiagnosesError = false;

        this.haveInfo = false;

        this.defaultLineModel = {
            Adjustment: 0,
            HcpcsCode: undefined,
            Quantity: 1,
            Charge: 0,
            ServicePeriod: {
                From: '',
                To: ''
            },
            Modifiers: {
                Level1: undefined,
                Level2: undefined,
                Level3: undefined,
                Level4: undefined
            },
            PlaceOfService: undefined,
            Diagnosis: {
                First: null,
                Second: null,
                Third: null,
                Fourth: null
            },
            TotalAmounts: {
                Charged: {
                    Amount: undefined,
                    Currency: '$'
                },
                CleanCharge: {
                    Amount: undefined,
                    Currency: '$'
                },
                Allowance: {
                    Amount: undefined,
                    Currency: '$'
                },
                Payments: {
                    Amount: 0,
                    Currency: '$'
                },
                Adjustments: {
                    Amount: 0,
                    Currency: '$'
                },
                Balance: {
                    Amount: 0,
                    Currency: '$'
                }
            },
            isAdded: true,
            disabled: false,
            Attributes: []
        };
        this.Lines = [angular.copy(this.defaultLineModel, {})];
        this.firstPayerLoad = true;

        this.notesMaxLength = limitConstants.ADD_INFO_MAXLENGTH;
        this.invoiceStatusConstants = invoiceStatusConstants;
        this.pricingTypeConstants = pricingTypeConstants;
        this.insuredSignatureOnFileConstants = insuredSignatureOnFileConstants;
        this.patientSignatureOnFileConstants = patientSignatureOnFileConstants;
        this.providerSignatureOnFileConstants = providerSignatureOnFileConstants;

        this.getProducts = invoiceModifyService.getProducts.bind(invoiceModifyService);

        this.isDisableSave = false;

        this.maxDiagnosisCount = 12;

        this._activate();
    }

    _activate() {
        if (this.invoiceId) {
            this.invoiceModifyService.clearModel();

            this.bsLoadingOverlayService.start({ referenceId: 'modify' });
            this.invoiceModifyService.getInvoiceById(this.invoiceId)
                .then(() => {
                    this.model = this.invoiceModifyService.getModel();
                    this._getDictionaries(this.invoiceId, this.model.PatientId);

                    return this.invoiceModifyService.getInsurancesByInvoice(this.invoiceId);
                })
                .then((res) => {
                    this.invoiceModifyService.generateDictionaryBillTo(res);
                })
                .finally(() => this.haveInfo = true);
        } else {
            this.model = this.invoiceModifyService.getModel();

            if (!this.model.PatientId) {
                this.$state.go('root.billing.invoices', { showNewInvoiceModal: true });
                return;
            }

            this._getDictionaries(this.invoiceId, this.model.PatientId)
                .finally(() => this.haveInfo = true);

            const insurancesDictionary = this.model.Insurances.map((item) => {
                return {
                    PriorityOrder: item.PriorityOrder,
                    PriorityOrderName: this.invoiceModifyService.setPriorityOrderName(item.PriorityOrder),
                    Id: item.PatientInsuranceId,
                    PatientInsuranceId: item.PatientInsuranceId,
                    Name: item.PayerName || `Insurance: ${item.PatientInsuranceId}`,
                    PayerId: item.Payer && item.Payer.Id || item.PayerId,
                    PayerPlan: {
                        Id: item.PayerPlanId,
                        Name: item.PayerPlanName
                    },
                    SignatureOnFile: item.SignatureOnFile
                };
            });

            this.invoiceModifyService.generateDictionaryBillTo(insurancesDictionary);
        }

        this._toggleDiagnosesError();
    }

    _getDictionaries(invoiceId, patientId) {
        const promises = [
            this.invoiceModifyService.downloadDictionaries(invoiceId, patientId),
            this.invoiceModifyService.getPatientDiagnoses()
        ];

        this.bsLoadingOverlayService.start({ referenceId: 'modify' });
        return this.$q.all(promises)
            .then(() => {
                this.dictionaries = this.invoiceModifyService.getDictionaries();

                this._loadServiceLines();
                if (this.model.ClaimOptions.Diagnosis.length > this.maxDiagnosisCount) {
                    this.model.ClaimOptions.Diagnosis = [];
                }
                this._toggleDiagnosesError();

                if (!invoiceId) {
                    angular.forEach(this.Lines, (line) => {
                        this._setDefaultDiagnos(line);
                    });
                }
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'modify' });
            });
    }

    getPatientDiagnoses() {
        return this.model.PatientDiagnoses.filter((item) =>
            !this.model.ClaimOptions.Diagnosis.find((selected) => selected.id === item.id)
        );
    }

    _loadServiceLines() {
        if (this.model.ServiceLines.length) {
            this.Lines = [];
            this.Lines = this.model.ServiceLines;
        }
    }

    _toggleDiagnosesError() {
        this.showDiagnosesError = _.has(this.model, 'ClaimOptions.Diagnosis') &&
            this.model.PatientDiagnosesLoaded &&
            (this.model.ClaimOptions.Diagnosis.length > this.maxDiagnosisCount || !this.model.ClaimOptions.Diagnosis.length);
    }

    getPOSDictionary(NameOrCode, pageIndex) {
        const params = {
            Text: NameOrCode,
            pageIndex,
            selectCount: true,
            SortExpression: 'Code ASC'
        };

        return this.billingDictionariesService.getPOSDictionary(params)
            .then((response) => response.data);
    }

    generatePosInputName(index) {
        return `pos-${index}`;
    }

    getRenderingProviders(text, pageIndex) {
        return this.invoiceModifyService.getRenderingProviders(text, pageIndex)
            .then((response) => response.data);
    }

    getReferringProviders(text, pageIndex) {
        return this.invoiceModifyService.getReferringProviders(text, pageIndex)
            .then((response) => {

                response.data.Items = response.data.Items.map((item) => {
                    item.Name = item.ReferralCardSource.Name;
                    item.Npi = item.ReferralCardSource.Npi;
                    return item;
                });

                return response.data;
            });
    }

    getBillingProviders(Name, PageIndex) {
        let params = { Name, PageIndex, IncludeArchived: true };

        return this.billingProvidersService.getBillingProvidersDictionary(params)
            .then((response) => response.data);
    }

    changedBillingProvider(provider) {
        if (provider && !provider.notModified) {

            this.bsLoadingOverlayService.start({ referenceId: 'modify' });
            this.invoiceModifyService.getBillingProviderDetails(provider.Id)
                .then((response) => {
                    this.model.ClaimOptions.ProviderAcceptAssignment = response.data.BillingSetting.AcceptAssignment.Id;
                    this.model.ClaimOptions.ProviderSignatureOnFile = response.data.BillingSetting.SignatureOnFile.Type.Id;
                    this.model.ClaimOptions.ProviderSignatureOnFileDate = response.data.BillingSetting.SignatureOnFile.SignedDate ?
                            moment.utc(response.data.BillingSetting.SignatureOnFile.SignedDate).format('MM/DD/YYYY') :
                            '';
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modify' }));
        }
    }

    getHcpcsCodes(code) {
        return this.invoiceModifyService.getHcpcsCodes(code)
            .then((response) => response.data.Items);
    }

    statusChanged(statusId) {
        if (!statusId || statusId !== invoiceStatusConstants.HOLD_STATUS_ID) {
            this.model.HoldReasons = [];
        }
    }

    signatureOnFileChanged(signType) {
        if (this.model.ClaimOptions[signType] === providerSignatureOnFileConstants.NO_ID) {
            this.model.ClaimOptions[`${signType}Date`] = '';
        }
    }

    addDiagnose(item) {
        if ( this.model.ClaimOptions.hasOwnProperty('Diagnosis') && this.model.ClaimOptions.Diagnosis.length < this.maxDiagnosisCount ) {

            let isContainInvoiceDiagnoses = _.findIndex(this.model.ClaimOptions.Diagnosis, (o) => {
                return o.description === item.description;
            });

            if (isContainInvoiceDiagnoses === -1) {
                this.model.ClaimOptions.Diagnosis.push(item);
            }
        }

        this._toggleDiagnosesError();
        this.diagnose = undefined;
    }

    deleteDiagnose(item) {
        let index = this.model.ClaimOptions.Diagnosis.indexOf(item);

        if (index !== -1) {
            this.model.ClaimOptions.Diagnosis.splice(index, 1);
            this._toggleDiagnosesError();
            this._clearLineDiagnosis();
        }
    }

    loadDiagnosesFromPatient() {
        const diagnosisLength = this.model.PatientDiagnoses.length;

        angular.copy(this.model.PatientDiagnoses, this.model.ClaimOptions.Diagnosis);

        if (diagnosisLength > this.maxDiagnosisCount) {
            this.model.ClaimOptions.Diagnosis.splice(this.maxDiagnosisCount, diagnosisLength);
        }

        this._toggleDiagnosesError();
        this._clearLineDiagnosis();
    }

    _setDefaultDiagnos(line) {
        if (this.model.ClaimOptions.Diagnosis.length === 1) {
            line.Diagnosis.First = this.model.ClaimOptions.Diagnosis[0];
        }
    }

    // if after update, service line doesn't contain correct diagnoses - clear them
    _clearLineDiagnosis() {
        angular.forEach(this.Lines, (line) => {
            angular.forEach(line.Diagnosis, (diagnose, key) => {
                if (diagnose) {
                    let match = _.find(this.model.ClaimOptions.Diagnosis, (item) => {
                        if (item) {
                            return diagnose.name === item.name;
                        }
                    });

                    if (!match) {
                        line.Diagnosis[key] = null;
                    }
                }
            });
        });
    }

    billToChanged(BillRecipient) {

        angular.forEach(this.Lines, (line) => {
            this._resetAuthNumber(line);
        });

        if (!this.firstPayerLoad) {

            // reset PayerOriginalClaimNumber
            this.model.Statuses.PayerOriginalClaimNumber = '';

            // Modify mode: In this mode. We do not reset price option
            if (!this.invoiceId) {
                angular.forEach(this.Lines, (line, index) => {
                    this.chargeChanged(index);
                    this._resetPriceOptionId(line);
                });
            }

            // manage auth number
            this.model.ClaimOptions.PriorAuthNumber = undefined;

            if (BillRecipient && BillRecipient.Type === 'Patient') {
                angular.forEach(this.Lines, (line) => {
                    line.PriorAuthNumber = null;
                    line.Attributes = [];
                });

            } else if (BillRecipient && BillRecipient.Type === 'Payer') {
                this.model.ClaimOptions.InsuredSignatureOnFile = BillRecipient.SignatureOnFile.IsSigned;
                this.model.ClaimOptions.InsuredSignatureOnFileDate = BillRecipient.SignatureOnFile.SignedDate;
            }
        } else {
            this.firstPayerLoad = false;
        }

    }

    isPriorAuthNumberRequired() {
        return !!this.Lines.find((item) => !!item.PriorAuthNumber);
    }

    chargeChanged(index) {
        let line = this.Lines[index];

        if (line.TotalAmounts.CleanCharge.Amount === undefined || line.TotalAmounts.CleanCharge.Amount === null) {
            return;
        }

        // If we change charge Tax will should reset
        if (_.has(line, 'TotalAmounts.Tax.Amount')) {
            line.TotalAmounts.Tax = null;
        }

        const total = line.TotalAmounts;
        const adjustments = total.Adjustments && total.Adjustments.Amount ? total.Adjustments.Amount : 0;

        const tax = total.Tax && total.Tax.Amount ? total.Tax.Amount : 0;

        const payments = total.Payments && total.Payments.Amount ? total.Payments.Amount : 0;

        const cleanBalance = calcFloatDiff(calcFloatDiff(total.CleanCharge.Amount, adjustments), payments);

        total.Balance.Amount = calcFloatSum(cleanBalance, tax);
        line.Charge = total.CleanCharge.Amount;
        line.Adjustment = adjustments;
    }

    hcpcsCodeSelected(index, code) {
        let line = this.Lines[index];

        if (code) {
            line.Name = code.Description || line.Name;

            if (line._hcpcsCodeChanged) {
                line._hcpcsCodeChanged = false;
                this.resetPriceOptions(index, line);
            }
        }
    }

    onChangeQty(index, qty) {
        let line = this.Lines[index];

        if (qty && line._quantityChanged) {
            line._quantityChange = false;
            this.resetPriceOptions(index, line);
        }
    }

    resetPriceOptions(index, line) {

        if (!line.ServicePeriod.From || !line.ServicePeriod.To) {
            this.ngToast.warning('Date of Service has to be entered before selecting Price Option');
            return;
        }

        this._resetPriceOptionId(line);
        this._getAvailablePriceOptions(index, line);
    }

    dosChanged(index, line) {
        if (_.isEmpty(this.form[`dateFrom-${index}`].$error) &&
            _.isEmpty(this.form[`dateTo-${index}`].$error)) {
            this._resetPriceOptionId(line);
            this._getAvailablePriceOptions(index, line);
        }
    }

    selectedProductChanged(index, line) {
        if (this.selectedProductHasChanged) {
            this._resetPriceOptionId(line);
            this._getAvailablePriceOptions(index, line);
        }

        this.selectedProductHasChanged = true;
    }

    _getAvailablePriceOptions(index, line) {
        if (!line.HcpcsCode ||
            this.form[`dateFrom-${index}`].$invalid) {

            return;
        }

        const billRecipientPatientId = 1;

        this.bsLoadingOverlayService.start({ referenceId: `line${ index }` });
        this.invoiceModifyService.getPriceOptions(
            {
                PriceRentCycle: line.Cycle ? line.Cycle.Id : null,
                RentalInterval: line.Period || 1,
                LocationId: this.model.Patient.Location && this.model.Patient.Location.Id,
                Hcpcs: line.HcpcsCode.Id,
                'EffectivePeriod.From': moment.utc(line.ServicePeriod.From).format('YYYY-MM-DD'),
                'EffectivePeriod.To': moment.utc(line.ServicePeriod.To).format('YYYY-MM-DD'),
                PayerId: +this.model.BillRecipient.PayerId === billRecipientPatientId ?
                    null :
                    this.model.BillRecipient.PayerId,
                PayerPlanId: this.model.BillRecipient.PayerPlan && this.model.BillRecipient.PayerPlan.Id || null,
                ProductId: _.has(line, 'ServiceProduct.ProductId') || _.has(line, 'ServiceProduct.Id') ?
                    line.ServiceProduct.ProductId || line.ServiceProduct.Id :
                    undefined
            })
            .then((response) => {

                const isMultiplePriceOptions = !!_.find(this.model.HoldReasons, { Id: pricingTypeConstants.MULTIPLE_TYPE_ID });
                const priceOptions = _.filter(response.data, (item) => {
                    if (line.RentProgramId && !isMultiplePriceOptions) {
                        return item.PricingType.Id === line.PriceType.Id;
                    } else if (line.RentProgramId && isMultiplePriceOptions) {
                        return item.PricingType.Id === pricingTypeConstants.RENTAL_TYPE_ID;
                    }
                    return item;
                });

                if (priceOptions.length === 1) {

                    this.priceOptionSelected(priceOptions[0], line);

                } else {
                    const defaultTypeItemsLength = _.filter(priceOptions, (item) => {
                        return item.PricingConfiguration && item.PricingConfiguration.Default;
                    }).length;

                    if (defaultTypeItemsLength === 1) {
                        const defaultPriceOption = _.find(priceOptions, (i) => {
                            return i.PricingConfiguration && i.PricingConfiguration.Default;
                        });

                        this.priceOptionSelected(defaultPriceOption, line);
                    }
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: `line${ index}` }));
    }

    // can't choose selected diagnoses
    selectedDiagnoseChanged(parentIndex, diagnose, key) {
        if (diagnose) {
            let match = _.find(this.Lines[parentIndex].Diagnosis, (item, index) => {
                if (item) {
                    return diagnose.name === item.name && key !== index;
                }
            });

            if (match) {
                this.Lines[parentIndex].Diagnosis[key] = null;
                this.ngToast.warning('This diagnosis was already selected');
            }
        }
    }

    getDiagnosis(searchText) {
        let deferred = this.$q.defer();
        let resultSet = _.filter(this.model.ClaimOptions.Diagnosis,
            (o) => o.description.indexOf(searchText) > -1 );

        deferred.resolve(resultSet);
        return deferred.promise;
    }

    addServiceLine() {
        let newLine = angular.copy(this.defaultLineModel, {});

        this._setDefaultDiagnos(newLine);
        this.Lines.push(newLine);
    }

    deleteServiceLine(event, index) {
        event.stopPropagation();
        this.Lines.splice(index, 1);
    }

    disableAccordionClickToggle($event) {
        $event.stopPropagation();
    }

    priceOptionSelected(priceOptionItem, serviceLine) {
        serviceLine.UpdatePriceOption = true;
        serviceLine.PriceOption = priceOptionItem;
        serviceLine.PriceType = priceOptionItem.PricingType;

        // set reason of claims: Status: 'On-Hold'
        if (priceOptionItem.HoldReason) {
            this.model.Statuses.Status = invoiceStatusConstants.HOLD_STATUS_ID;

            let holdReasons = this.dictionaries.holdReasons;
            let mappedAttr = this.invoiceAttrDictionaryService.prisingHoldReasonToClaimHoldReason(priceOptionItem.HoldReason, holdReasons);

            if (!_.find(this.model.HoldReasons, { Id: mappedAttr.Id })) {
                this.model.HoldReasons.push(mappedAttr);
            }

            if (serviceLine.Attributes.length) {
                let isPriceOptIndex = _.findIndex(serviceLine.Attributes,
                    (item) => item.Category.Id === systemAttributesCategoryConstants.PRICE_OPTION_CATEGORY_ID);

                if (isPriceOptIndex !== -1) {
                    serviceLine.Attributes[isPriceOptIndex] = this._getPriceOprObj(mappedAttr);
                } else {
                    serviceLine.Attributes.push(this._getPriceOprObj(mappedAttr));
                }

            } else {
                serviceLine.Attributes.push(this._getPriceOprObj(mappedAttr));
            }
        } else {
            let isPriceOptIndex = _.findIndex(serviceLine.Attributes,
                (item) => item.Category.Id === systemAttributesCategoryConstants.PRICE_OPTION_CATEGORY_ID);

            if (isPriceOptIndex !== -1) {
                serviceLine.Attributes.splice(isPriceOptIndex, 1);
            }
        }

        let units = priceOptionItem.Units || 1;

        serviceLine.TotalAmounts.Allowance = _.has(serviceLine, 'TotalAmounts.Allowance.Amount') ?
            serviceLine.TotalAmounts.Allowance :
            { Amount: undefined, Currency: '$' };

        if (priceOptionItem.Allowed) {
            serviceLine.TotalAmounts.Allowance.Amount = +((priceOptionItem.Allowed.Amount / units) * serviceLine.Quantity).toFixed(2);
        } else {
            serviceLine.TotalAmounts.Allowance.Amount = undefined;
        }

        let additionalText = `Charge, Modifiers${priceOptionItem.PricingConfiguration &&
                                priceOptionItem.PricingConfiguration.Product ? ', Product' : ''}`;

        this.$mdDialog.show({
            template: applyPriceOptionsTemplate,
            controller: applyPriceOptionsController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { additionalText }
        }).then(() => {

            serviceLine.TotalAmounts.Adjustments = _.has(serviceLine, 'TotalAmounts.Adjustments.Amount') ?
                serviceLine.TotalAmounts.Adjustments :
                { Amount: 0 };

            serviceLine.TotalAmounts.Payments = _.has(serviceLine, 'TotalAmounts.Payments.Amount') ?
                serviceLine.TotalAmounts.Payments :
                { Amount: 0 };

            serviceLine.TotalAmounts.CleanCharge.Amount = +((priceOptionItem.Charge.Amount / units) * serviceLine.Quantity).toFixed(2);

            this.chargeChanged(this.Lines.indexOf(serviceLine));

            if (priceOptionItem.PricingConfiguration.Modifiers === null) {
                serviceLine.Modifiers = {
                    Level1: null,
                    Level2: null,
                    Level3: null,
                    Level4: null
                };
                return;
            }

            let optionModifiers = priceOptionItem.PricingConfiguration.Modifiers;

            // set modifiers
            for (let level in serviceLine.Modifiers) {
                serviceLine.Modifiers[level] = _.has(optionModifiers, `${level}.Id`) ?
                    { Id: optionModifiers[level].Id } :
                    null;
            }
        });
    }

    _getPriceOprObj(mappedAttr) {
        return {
            Category: {
                Id: systemAttributesCategoryConstants.PRICE_OPTION_CATEGORY_ID,
                Name: mappedAttr.Name,
                Code: mappedAttr.Id
            },
            Name: mappedAttr.Name,
            Code: mappedAttr.Id,
            AttrClass: mappedAttr.AttrClass
        };
    }

    _resetPriceOptionId(line) {
        if (_.has(line, 'PriceOption.Id')) {
            line.PriceOption.Id = undefined;
        }
    }

    _resetAuthNumber(line) {
        if (_.has(line, 'PriorAuthNumber')) {
            line.PriorAuthNumber = null;
        }
    }

    showPriceOptions($event, serviceLine) {
        if (!serviceLine.ServicePeriod.From || !serviceLine.ServicePeriod.To) {
            this.ngToast.warning('Date of Service has to be entered before selecting Price Option');
            return;
        }

        $event.stopPropagation();
        this.$mdDialog.show({
            template: pricingOptionsModalTemplate,
            controller: pricingOptionsModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                location: this.model.Patient.Location,
                serviceLine,
                BillRecipient: this.model.BillRecipient,
                isMultiplePriceOptions: !!_.find(this.model.HoldReasons, {
                    Id: pricingTypeConstants.MULTIPLE_TYPE_ID
                })
            }
        })
        .then((priceOptionItem) => this.priceOptionSelected(priceOptionItem, serviceLine) );
    }

    showPricingDetails($event, serviceLine) {
        this.billingsCommonService.showPricingDetails($event, serviceLine, this.invoiceId);
    }

    isPriceOptionsDisabled(serviceLine, index) {
        const chosenHcpcsCode = serviceLine.HcpcsCode && serviceLine.HcpcsCode.Text;

        return !chosenHcpcsCode || (this.form[`dateFrom-${ index}`] && this.form[`dateFrom-${ index}`].$invalid);
    }

    isRentalOptionsAvailable(serviceLine) {
        if (this.haveInfo && serviceLine.PriceType && serviceLine.PriceType.Id) {
            /**
             * @description - in this case existent service line can has Id equal null,
             *                that is why we compare to undefined and not to null
             * @type {boolean}
             */
            const isServiceLineRental = (serviceLine.PriceType.Id === this.pricingTypeConstants.RENTAL_TYPE_ID),
                hasRentalProgram = serviceLine.RentProgramId;

            return isServiceLineRental && !hasRentalProgram;
        }
    }

    showRentalOptions($event, serviceLine) {
        $event.stopPropagation();

        let item = angular.copy(serviceLine);

        item.BillRecipient = angular.copy(this.model.BillRecipient);
        item.patientLocation = this.model.Patient && this.model.Patient.Location;
        item.Quantity = Number(item.Quantity);

        this.$mdDialog.show({
            template: rentalModalTemplate,
            controller: rentalModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                item,
                actionType: 'new',
                patientId: this.model.Patient.Id
            }
        })
        .then((response) => {
            if (response) {
                serviceLine.RentStartSettings = response;
            } else {
                delete serviceLine.RentStartSettings;
            }
        });
    }

    goToRental(event, rentProgramId) {
        event.stopPropagation();

        this.$state.go('root.patient.rental', {
            patientId: this.model.Patient.Id, rentProgramId
        });
    }

    showInvoiceValidationModal(invoiceId, saveFn, updateFn, isValidationFailed) {
        this.$mdDialog.show({
            template: invoiceValidateModalTemplate,
            controller: invoiceValidateModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { invoiceId, saveFn, updateFn, isValidationFailed }
        });
    }

    showRentalServiceLinenModal(invoiceId, saveFn, lines) {
        this.$mdDialog.show({
            template: invoiceRentalServiceLineModalTemplate,
            controller: invoiceRentalServiceLineModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { invoiceId, saveFn, lines }
        });
    }

    saveInvoice() {
        if (this.form.$valid) {
            const hasNotInitiatedRentalLines = this.Lines.find((line) =>
              line.PriceType.Id === pricingTypeConstants.RENTAL_TYPE_ID && !line.RentStartSettings && !line.RentProgramId);

            if (hasNotInitiatedRentalLines) {

                // @TODO please make sure why check BillRecipient.Type. I think BillRecipient.Type always present
                const isTypePatient = this.model.BillRecipient.Type && this.model.BillRecipient.Type.toLowerCase() === 'patient';

                this.showRentalServiceLinenModal(
                    this.model.DisplayId,
                    (isTypePatient ? this._save.bind(this) : this._validateAndSave.bind(this)),
                    this.Lines
                );
            } else if (this.model.BillRecipient.Type &&
                this.model.BillRecipient.Type.toLowerCase() === 'patient') {
                this._save();
            } else {
                this._validateAndSave();
            }

        } else {
            this._isPriceOptionChosen();
            touchedErrorFields(this.form);
        }
    }

    showValidationResults(restrictions) {
        let oldRestrictionsPresent = false;
        let results = {
            isValidationFailed: false,
            isShowModal: false
        };

        angular.forEach(this.Lines, (line) => {
            const existedRestrictions = line.Attributes.filter((attr) => {
                return attr.Category.Id === systemAttributesCategoryConstants.RESTRICTIONS_CATEGORY_ID;
            });

            if (existedRestrictions.length) {
                oldRestrictionsPresent = true;
            }

            line.Attributes = line.Attributes.filter((attr) => {
                return attr.Category.Id !== systemAttributesCategoryConstants.RESTRICTIONS_CATEGORY_ID;
            });
        });

        if (restrictions.length) {
            angular.forEach(this.Lines, (line) => {
                angular.forEach(restrictions, (restriction) => {
                    if (restriction.Restrictions.length &&
                        (restriction.Service.Hcpcs === line.HcpcsCode.Id) ) {
                        angular.forEach(restriction.Restrictions, (item) => {
                            line.Attributes.push({
                                Category: { Id: systemAttributesCategoryConstants.RESTRICTIONS_CATEGORY_ID },
                                Name: item.Name,
                                Code: item.Code,
                                AttrClass: this.invoiceAttrDictionaryService.getAttrClass(item.Code)
                            });
                        });
                    }
                });
            });

            results.isShowModal = true;
            results.isValidationFailed = true;
        } else if (oldRestrictionsPresent) {
            results.isShowModal = true;
            results.isValidationFailed = false;
        }

        return results;
    }

    _validateAndSave() {
        this.bsLoadingOverlayService.start({ referenceId: 'modify' });

        const params = {
            patientId: this.model.PatientId,
            patientInsuranceId: this.model.BillRecipient.InsuranceId,
            renderingProviderId: this.model.ClaimOptions.RenderingProvider && this.model.ClaimOptions.RenderingProvider.Id,
            lines: this.Lines
        };
        const promise = this.invoiceId ?
            this.invoiceModifyService.validateInvoiceById(this.invoiceId, params) :
            this.invoiceModifyService.validateInvoice(params);

        promise
            .then((response) => {
                if (response.data) {
                    const validationResults = this.showValidationResults(response.data);
                    const isValidationFailed = validationResults.isValidationFailed;
                    const isShowModal = validationResults.isShowModal;

                    if (isShowModal) {
                        this.bsLoadingOverlayService.stop({ referenceId: 'modify' });
                        this.showInvoiceValidationModal(
                            this.model.DisplayId,
                            this._save.bind(this),
                            () => this.update(response.data),
                            isValidationFailed
                        );
                    } else {
                        this._save();
                    }
                } else {
                    this._save();
                }
            },
            () => {
                this.bsLoadingOverlayService.stop({ referenceId: 'modify' });
            }
            );
    }

    _save() {
        this.bsLoadingOverlayService.start({ referenceId: 'modify' });
        this.invoiceModifyService.saveInvoice(this.invoiceId, this.Lines)
            .then(
                (response) => {
                    if (!_.has(response, 'data.Id')) {
                        this.bsLoadingOverlayService.stop({ referenceId: 'modify' });
                    }
                },
                () => {
                    this.bsLoadingOverlayService.stop({ referenceId: 'modify' });
                }
            );
    }

    _isPriceOptionChosen() {
        let errorMsgArr = [];

        for (let i = 0; i < this.Lines.length; i++) {
            let line = this.Lines[i];

            if (!(line.PriceOption && line.PriceOption.Id)) {
                errorMsgArr.push(`"Price Option" is not selected for ServiceLine #${(i + 1)}`);
            }
        }

        if (errorMsgArr.length > 0) {
            this.ngToast.danger(errorMsgArr.join('<br/>'));
        }
    }

    update(restrictions) {
        this.model.Statuses.Status = invoiceStatusConstants.HOLD_STATUS_ID;
        let holdReasons = this.dictionaries.holdReasons;
        let mappedHoldReasons = this.invoiceAttrDictionaryService.restrictionsToClaimHoldReasons(restrictions, holdReasons);

        angular.forEach(mappedHoldReasons, (i) => {
            if (!_.find(this.model.HoldReasons, { Id: i.Id })) {
                this.model.HoldReasons.push(i);
            }
        });

        this._save();
    }

    getPriorAuthNumber(code) {
        return this.invoiceModifyService.getPatientAuthorizationsDictionary(this.model.Patient.Id, code, this.model.BillRecipient.PayerId)
            .then((response) => {
                return response.data.Items.map((item) => {
                    const hcpcsCodes = item.Hcpcs.reduce((acc, hcpcsCode) => (`${acc + hcpcsCode }, `), '').replace(/, $/, '');

                    let OptionText = `${ item.AuthNumber } | ${ hcpcsCodes } | `;

                    if (item.PriceOption) {
                        OptionText += `${item.PriceOption.Text} | `;
                    }

                    OptionText += `${ moment(item.FromDate).format('MM/DD/YYYY') } - `;

                    OptionText += item.ToDate ? `${ moment(item.ToDate).format('MM/DD/YYYY') }` : '...';

                    return {
                        Text: item.AuthNumber,
                        OptionText: OptionText,
                        Id: item.AuthNumber
                    };
                });
            });
    }

    cancel() {
        if (this.invoiceId) {
            this.$state.go('root.invoice.details', { invoiceId: this.invoiceId });
        } else {
            this.$state.go('root.billing.invoices');
        }
    }

    holdReasonsQuerySearch(query) {
        let results = query ?
            this.dictionaries.holdReasons.filter(this._filterSearchQuery(query)) :
            this.dictionaries.holdReasons;

        if (results.length) {
            results = this._filterResults(results);
        }
        return results;
    }

    _filterSearchQuery(query) {
        let lowercaseQuery = query.toLowerCase();

        return function filterFn(item) {
            return item.Name.toLowerCase().indexOf(lowercaseQuery) !== -1;
        };
    }

    _filterResults(results) {
        let filteredArr = [];

        angular.forEach(results, (item) => {
            let itemIndex = _.findIndex(this.model.HoldReasons, { Id: item.Id });

            if (itemIndex === -1) {
                filteredArr.push(item);
            }
        });
        return filteredArr;
    }

    closeAutocompleteOnDelete() {
        $('.autocomplete-chips-dropdown').css('opacity', '0');
        $('.autocomplete-chips-block md-autocomplete-wrap').css('opacity', '0');

        this.$timeout(() => {
            $('.autocomplete-chips-block md-autocomplete input').blur();

            $('.autocomplete-chips-dropdown').css('opacity', '1');
            $('.autocomplete-chips-block md-autocomplete-wrap').css('opacity', '1');
        }, 100);
    }

    orderChanged(orderId) {
        if (orderId) {
            const selectedOrder = _.find(this.dictionaries.ordersDictionary, (item) => orderId === item.Id);

            if (selectedOrder && selectedOrder.Physician && !_.isEmpty(selectedOrder.Physician.Name)) {
                this.model.ClaimOptions.ReferringProvider = {
                    Id: selectedOrder.Physician.Id,
                    Name: {
                        FirstName: selectedOrder.Physician.Name && selectedOrder.Physician.Name.First,
                        LastName: selectedOrder.Physician.Name && selectedOrder.Physician.Name.Last
                    },
                    Npi: selectedOrder.Physician.Npi,
                    FullName: this.invoiceModifyService._mapRefferringProviderSingleFullName(selectedOrder.Physician)
                };
            } else {
                this.model.ClaimOptions.ReferringProvider = null;
            }
        } else {
            this.model.ClaimOptions.ReferringProvider = null;
        }
    }

    isDisableServiceLineDiagnosis(diagnosis, index, isMatchForRequired) {

        if (index === 0) {
            return false;
        }

        let lastFilledIndex = 0;

        Object.keys(diagnosis).forEach((key, keyIndex) => {
            if (diagnosis[key]) {
                lastFilledIndex = keyIndex + 1;
            }
        });

        lastFilledIndex = isMatchForRequired ? (lastFilledIndex - 1) : lastFilledIndex;

        return index > lastFilledIndex;
    }
}

