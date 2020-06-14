import { pricingTypeConstants, rentalHintConstants, paymentTypeConstants } from '../../constants/billing.constants.es6';

export default class rentalModalController {
    /**
     *
     * @param item - will be Rent Program for init from Patient Rent Tab
     *                   and Service Line for init from invoice
     * @param actionType - can be 'new', 'stop', 'start', 'edit'
     */
    constructor($scope,
                $mdDialog,
                bsLoadingOverlayService,
                $timeout,
                rentalOptionsService,
                item,
                actionType,
                patientId
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$timeout = $timeout;
        this.rentalOptionsService = rentalOptionsService;
        this.rentalHintConstants = rentalHintConstants;
        this.paymentTypeConstants = paymentTypeConstants;

        this.billingPeriodChangedFlag = false;

        this.actionType = actionType;
        this.title = actionType === 'new' ? 'Rental Options' : `${actionType} Rental`;
        this.isProgramAvailable = actionType !== 'new';
        this.patientId = patientId;

        this.item = angular.copy(item);

        this.itemId = angular.copy(item.Id);
        this.itemClaimId = angular.copy(item.ClaimId);

        this.payersLoaded = false;
        this.selectedPriceOption = null;
        this.payers = [];
        this.items = [];
        this.filters = {
            DateOfService: {
                From: '',
                To: ''
            },
            BillRecipient: {
                Id: null,
                PayerId: null
            }
        };

        if (this.actionType !== 'stop') {
            $scope.$watch(() => this.filters, (newVal) => {
                if (!newVal) {
                    return;
                }

                // $timeout is used because form data not always
                // linked before $scope.$watch firing
                $timeout(() => {
                    if (this.modalForm.$valid &&
                        this.payersLoaded &&
                        this.isProgramAvailable) {

                        this._loadPriceOptions(this.filters);
                    }
                }, 600);
            }, true);
        }

        this._activate();
    }

    _activate() {
        if (this.actionType === 'new' && this.item.RentStartSettings) {
            this.isProgramAvailable = true;
            this.toggleRentalAvailability(this.isProgramAvailable);
        }

        if ((this.actionType === 'start') || (this.actionType === 'edit')) {
            this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
            this._getBillToDictionary()
                .then(() => {
                    return this._getRentalById(this.itemId);
                })
                .then((rentalItem) => {
                    this.item.Period = rentalItem.PriceOption.BillingPeriod;
                    this.item.Qty = Number(rentalItem.RentObject.Quantity);

                    this.filters.DateOfService = {
                        From: moment(rentalItem.PriceOption.DateOfServiceFrom).format('MM/DD/YYYY'),
                        To: moment(rentalItem.PriceOption.DateOfServiceTo).format('MM/DD/YYYY')
                    };

                    if (rentalItem.Location) {
                        this.filters.LocationId = rentalItem.Location.Id;
                    }

                    this.setBillRecipient(angular.copy(this.payers), rentalItem);

                    this.selectedPriceOption = rentalItem.PriceOption.PriceOptionId;

                    // payers loading in _getBillToDictionary(), but we set this flag here
                    // to prevent loading price option on watch
                    this.payersLoaded = true;
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
        }

        if (this.actionType === 'stop') {
            this._setStopModel();
        }
    }

    onUpdateRentalOptions() {
        if (this.billingPeriodChangedFlag &&
            this.actionType !== 'stop' &&
            this.modalForm.$valid &&
            this.payersLoaded &&
            this.isProgramAvailable
        ) {
            this._loadPriceOptions(this.filters);
            this.billingPeriodChangedFlag = false;
        }
    }

    onChangeBillingPeriod() {
        this.billingPeriodChangedFlag = true;
    }

    toggleRentalAvailability(isProgramAvailable) {
        if (!isProgramAvailable) {
            this._clearRental();
        } else {
            this._setPayers();
        }
    }

    _setPayers() {

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });

        this.rentalOptionsService.getBillToDictionary(this.patientId).then((response) => {
            this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
            this.payers = response.data;
            this.payersLoaded = true;

            this._setRentalForInvoiceServiceLine(angular.copy(this.payers), this.item);
        });
    }

    _clearRental() {
        this.filters = {
            DateOfService: {
                From: '',
                To: ''
            },
            BillRecipient: {
                Id: null,
                PayerId: null
            }
        };
        this.selectedPriceOption = null;
        this.item.Period = null;
        this.item.Qty = null;
        this.items = [];
        delete this.item.RentStartSettings;
    }

    _setSelectedPriceOption(items) {
        const isItemSelectedAmongItems = items.filter((item) => item.Id === this.selectedPriceOption);

        if (!isItemSelectedAmongItems.length) {
            this.selectedPriceOption = null;
        }
    }

    _loadPriceOptions(filters) {
        const params = {
            Hcpcs: this.item.HcpcsCode.Id || this.item.RentObject.HcpcsCode,
            RentalInterval: this.item.Period,
            'EffectivePeriod.From': moment(filters.DateOfService.From).format('YYYY-MM-DD'),
            'EffectivePeriod.To': moment(filters.DateOfService.To).format('YYYY-MM-DD'),
            PayerId: filters.BillRecipient.PayerId || null,
            PayerPlanId: this._getPayerPlanId(filters),
            LocationId: filters.LocationId || (this.item.patientLocation && this.item.patientLocation.Id),
            PriceRentCycle: this._getCycles()
        };

        if (this.item.RentObject &&
            this.item.RentObject.ProductId) {

            params.ProductId = this.item.RentObject.ProductId;
        }

        if (this.item.ServiceProduct &&
            this.item.ServiceProduct.Id) {

            params.ProductId = this.item.ServiceProduct.Id;
        }

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.rentalOptionsService.getPriceOptions(params)
            .then((response) => {
                this.items = response.data.filter((item) => item.PricingType.Id.toString() === pricingTypeConstants.RENTAL_TYPE_ID);
                this._setSelectedPriceOption(this.items);
             })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    _getCycles() {
        if (this.item.Cycle) {
            return this.item.Cycle.Id;
        } else if (this.item.PeriodCycle) {
            return this.item.PeriodCycle.Id;
        } else if (this.item.PriceOption &&
            this.item.PriceOption.RentalConfigurationModel &&
            this.item.PriceOption.RentalConfigurationModel.Cycle
        ) {
            return this.item.PriceOption.RentalConfigurationModel.Cycle.Id;
        }

        return null;
    }

    _getPayerPlanId(filters) {
        return filters.BillRecipient ? filters.BillRecipient.PayerPlanId : null;
    }

    _getRentalById(id) {
        return this.rentalOptionsService.getRentProgramById(id);
    }

    _getBillToDictionary() {
        return this.rentalOptionsService.getBillToDictionary(this.patientId)
            .then((response) => {
                this.payers = response.data;
            });
    }

    setBillRecipient(payers, item) {
        const indexOfPayer = item.PriceOption.BillTo.PayerId ?
            _.findIndex(payers, {
                Id: item.PriceOption.BillTo.InsuranceId,
                Type: { Id: paymentTypeConstants.PAYER_TYPE_ID }
            }) :
            _.findIndex(payers, { Type: { Id: paymentTypeConstants.PATIENT_TYPE_ID } });

        this.item.BillRecipient = payers[indexOfPayer];
        if (item.PriceOption.BillTo.PayerName) {
            if (!this.item.BillRecipient) {
                this.item.BillRecipient = {};
            }
            this.item.BillRecipient.Name = item.PriceOption.BillTo.PayerName;
        }
        this.item.HcpcsCode = item.RentObject.HcpcsCode;
        this._setFiltersBillRecipient(indexOfPayer, payers);
    }

    _addRentForInvoiceServiceLine(item, filters, selectedPriceOption) {
        let RentStartSettings = {
            DateOfService: {
                From: moment(filters.DateOfService.From).format('YYYY-MM-DD'),
                To: moment(filters.DateOfService.To).format('YYYY-MM-DD')
            },
            Period: item.Period,
            PayerId: filters.BillRecipient.PayerId,
            PayerPlanId: this._getPayerPlanId(filters),
            PatientInsuranceId: filters.BillRecipient && filters.BillRecipient.PayerId && filters.BillRecipient.Id,
            PriceOptionId: selectedPriceOption,
            Quantity: Number(item.Qty)
        };

        if (this.isProgramAvailable) {
            this.$mdDialog.hide(RentStartSettings);
        } else {
            this.$mdDialog.hide();
        }
    }

    _setRentalForInvoiceServiceLine(payers, item) {
        if (!this.isProgramAvailable) {
            return;
        }

        let indexOfPayer = -1;

        if (item.RentStartSettings) {
            this.filters.DateOfService = {
                From: moment(item.RentStartSettings.DateOfService.From).format('MM/DD/YYYY'),
                To: moment(item.RentStartSettings.DateOfService.To).format('MM/DD/YYYY')
            };

            this.item.Period = item.RentStartSettings.Period;
            this.item.Qty = Number(item.RentStartSettings.Quantity);

            indexOfPayer = item.RentStartSettings.PayerId ?
                _.findIndex(payers, {
                    Id: item.RentStartSettings.PatientInsuranceId
                }) :
                _.findIndex(payers, { Type: 'Patient' });

            this.selectedPriceOption = item.RentStartSettings.PriceOptionId;

        } else {
            this.filters.DateOfService = {
                From: moment(item.ServicePeriod.From).format('MM/DD/YYYY'),
                To: moment(item.ServicePeriod.To).format('MM/DD/YYYY')
            };

            this.item.Period = 1;
            this.item.Qty = Number(this.item.Quantity);

            indexOfPayer = (_.findIndex(payers, (payer) => payer.Type.Id === this.paymentTypeConstants.PAYER_TYPE_ID) !== -1) ?
                _.findIndex(payers, (payer) => payer.Type.Id === this.paymentTypeConstants.PAYER_TYPE_ID) :
                _.findIndex(payers, (payer) => payer.Type.Id === this.paymentTypeConstants.PATIENT_TYPE_ID);
        }

        this._setFiltersBillRecipient(indexOfPayer, payers);
    }

    _setFiltersBillRecipient(indexOfPayer, payers) {
        if (indexOfPayer !== -1) {
            this.filters.BillRecipient = payers[indexOfPayer];
        }
    }

    _startRent() {
        let model = this._getRentalModel(this.item, this.filters, this.selectedPriceOption);

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.rentalOptionsService.startRent(this.item.Id, model)
            .then(() => this.$mdDialog.hide())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    _updateRent() {
        let model = this._getRentalModel(this.item, this.filters, this.selectedPriceOption);

        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.rentalOptionsService.updateRent(this.item.Id, model)
            .then(() => this.$mdDialog.hide())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    _getRentalModel(item, filters, selectedPriceOption) {
        return {
            Settings: {
                DateOfService: {
                    From: moment(filters.DateOfService.From).format('YYYY-MM-DD'),
                    To: moment(filters.DateOfService.To).format('YYYY-MM-DD')
                },
                Period: item.Period,
                PayerId: filters.BillRecipient.PayerId,
                PayerPlanId: this._getPayerPlanId(filters),
                PatientInsuranceId: filters.BillRecipient && filters.BillRecipient.PayerId && filters.BillRecipient.Id,
                PriceOptionId: selectedPriceOption,
                Quantity: Number(item.Qty)
            }
        };
    }

    _stopRent() {
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });
        this.rentalOptionsService.stopRent(this.item.Id, this.stopModel)
            .then(() => this.$mdDialog.hide())
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' }));
    }

    _setStopModel() {
        this.stopModel = {
            Date: '',
            Reason: ''
        };
    }

    saveRent() {
        if (this.modalForm.$invalid && this.isProgramAvailable) {
            touchedErrorFields(this.modalForm);
            return;
        }

        switch (this.actionType) {
            case 'new':
                this._addRentForInvoiceServiceLine(this.item, this.filters, this.selectedPriceOption);
                break;
            case 'start':
                this._startRent();
                break;
            case 'stop':
                this._stopRent();
                break;
            case 'edit':
                this._updateRent();
                break;
            default:
                break;
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
