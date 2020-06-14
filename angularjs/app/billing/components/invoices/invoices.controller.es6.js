import { insurancePriorityConstants, invoiceStatusConstants } from '../../../core/constants/billing.constants.es6';

// Modal Templates
import submitInvoiceModalTemplate from '../../shared/modals/submit-invoice/submit-invoice.html';
import cms1500TypeModalTemplate from '../../shared/modals/cms1500-type/cms1500-type.html';
import loadFileModalTemplate from './modals/load-file/load-file-modal.html';
import batchSubmitModalTemplate from './modals/batch-submit-modal/batch-submit-modal.html';

// Modal Controllers
import submitInvoiceModalController from '../../shared/modals/submit-invoice/submitInvoiceModal.controller.es6';
import loadFileModalController from './modals/load-file/load-file-modal.controller.es6';
import batchSubmitModalController from './modals/batch-submit-modal/batch-submit-modal.controller.es6';
import Cms1500TypeModalCtrl from '../../shared/modals/cms1500-type/cms1500-type.es6';

export default class invoicesController {
    constructor(
        $state,
        $scope,
        $mdDialog,
        ngToast,
        infinityTableService,
        bsLoadingOverlayService,
        invoicesService,
        advancedFiltersService,
        billingsCommonService,
        billingClaimsService,
        documentUpdateService
    ) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.ngToast = ngToast;
        this.infinityTableService = infinityTableService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;
        this.advancedFiltersService = advancedFiltersService;
        this.billingsCommonService = billingsCommonService;
        this.billingClaimsService = billingClaimsService;
        this.documentUpdateService = documentUpdateService;

        this.insurancePriorityConstants = insurancePriorityConstants;

        this.toolbarItems = [
            {
                name: 'submit',
                text: 'Submit',
                icon: {
                    url: 'assets/images/default/check-circle-2.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: this.batchSubmitInvoicesModal.bind(this),
                isHidden: true
            },
            {
                text: 'New Invoice',
                icon: {
                    url: 'assets/images/default/plus-circle-thin.svg',
                    w: 20,
                    h: 20
                },
                clickFunction: () => this.billingsCommonService.addInvoice()
            },
            {
                text: 'Add Payment',
                icon: {
                    url: 'assets/images/default/card-plus.svg',
                    w: 24,
                    h: 20
                },
                clickFunction: this.billingsCommonService.addPayment.bind(this)
            },
            {
                text: 'Statements',
                icon: {
                    url: 'assets/images/default/list.svg',
                    w: 16,
                    h: 16
                },
                clickFunction: this.billingsCommonService.goStatements.bind(this)
            },
            {
                name: 'print',
                text: 'Print',
                icon: {
                    url: 'assets/images/default/printer.svg',
                    w: 20,
                    h: 18
                },
                clickFunction: this.printInvoices.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                name: 'cms1500',
                text: 'CMS 1500',
                icon: {
                    url: 'assets/images/default/printer.svg',
                    w: 20,
                    h: 18
                },
                clickFunction: this.generateCMS1500.bind(this),
                isHidden: true,
                byDefault: false
            },
            {
                text: 'Import ERA',
                icon: {
                    url: 'assets/images/default/upload-v2.svg',
                    w: 14,
                    h: 17
                },
                clickFunction: () => {
                    this.billingsCommonService.billingImport(this.$state.current.name);
                }
            }
        ];

        this.filters = {};
        this.cacheFiltersKey = 'invoices';
        // if new invoices route
        this.rewriteCacheFilters = $state.params.filterByStatus === invoiceStatusConstants.NEW_STATUS_ID;

        this.initFilters = {
            SaleTypeFilters: {
                label: 'Sale Type',
                type: 'radio-button-filter',
                items: [
                    {
                        id: guid(true),
                        displayName: 'All',
                        filterName: '',
                        isSelected: true,
                        isDefault: true
                    },
                    {
                        id: guid(true),
                        displayName: 'Rental',
                        filterName: 'Rental',
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Purchase',
                        filterName: 'Purchase',
                        isSelected: false
                    }
                ]
            },
            BalanceAgingFilters: {
                label: 'Aging',
                type: 'select-input-range-filter',
                items: [
                    {
                        id: guid(true),
                        displayName: '0-30',
                        filterStart: {
                            filterName: 'AgingTo',
                            filterValue: moment().format()
                        },
                        filterEnd: {
                            filterName: 'AgingFrom',
                            filterValue: moment().subtract(29, 'days').format()
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: '31-60',
                        filterStart: {
                            filterName: 'AgingTo',
                            filterValue: moment().subtract(30, 'days').format()
                        },
                        filterEnd: {
                            filterName: 'AgingFrom',
                            filterValue: moment().subtract(60, 'days').format()
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: '61-90',
                        filterStart: {
                            filterName: 'AgingTo',
                            filterValue: moment().subtract(60, 'days').format()
                        },
                        filterEnd: {
                            filterName: 'AgingFrom',
                            filterValue: moment().subtract(90, 'days').format()
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: '91-120',
                        filterStart: {
                            filterName: 'AgingTo',
                            filterValue: moment().subtract(90, 'days').format()
                        },
                        filterEnd: {
                            filterName: 'AgingFrom',
                            filterValue: moment().subtract(120, 'days').format()
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Over 120',
                        filterStart: undefined,
                        filterEnd: {
                            filterName: 'AgingTo',
                            filterValue: moment().subtract(121, 'days').format()
                        },
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Custom',
                        filterStart: {
                            filterName: 'AgingToCustom',
                            filterValue: ''
                        },
                        filterEnd: {
                            filterName: 'AgingFromCustom',
                            filterValue: ''
                        },
                        isSelected: false,
                        isCustom: true
                    }
                ]
            },
            PayersTypeFilters: {
                label: 'Payers',
                chipsLabel: 'Payer',
                placeholder: '+ payer',
                type: 'autocomplete-chips-filter',
                filterName: 'PayerTypes',
                dictionaryKeyName: 'Name',
                filterValue: [],
                getDictionary: () => this.invoicesService.getPayersTypes(),
                isStaticDictionary: true,
                isSelected: false
            },
            InvoiceHoldReasonFilters: {
                label: 'Hold Reasons',
                chipsLabel: 'Hold Reason',
                placeholder: '+ hold reason',
                type: 'autocomplete-chips-filter',
                filterName: 'ClaimHoldReasons',
                dictionaryKeyName: 'Name',
                filterValue: [],
                getDictionary: () => this.invoicesService.getInvoicesHoldReasons(),
                isStaticDictionary: true,
                additionalField: {
                    id: guid(true),
                    filterName: 'HoldReasonOther',
                    filterValue: ''
                },
                isSelected: false
            },
            InvoiceTagsFilters: {
                label: 'Invoice Tags',
                placeholder: '+ tag',
                type: 'autocomplete-chips-filter',
                filterName: 'Tags',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'Name',
                    defaultParams: {
                        pageSize: 100,
                        sortExpression: 'Name ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => this.billingClaimsService.getClaimsTags(params).then((res) => res.data),
                isStaticDictionary: false
            },
            InvoiceHcpcsCodesFilters: {
                label: 'HCPCS codes',
                chipsLabel: 'HCPCS code',
                placeholder: '+ HCPCS codes',
                type: 'autocomplete-chips-filter',
                filterName: 'HcpcsCodes',
                filterValue: [],
                dictionaryKeyName: 'Text',
                dictionarySearchParams: {
                    searchQueryKey: 'code'
                },
                getDictionary: (params) => this.billingsCommonService.getHcpcsCodes(params).then((res) => res.data.Items),
                isSelected: false,
                smAutocompleteClass: 'sm-autocomplete'
            },
            InvoiceAllowableFilters: {
                label: '',
                title: 'Actual allowable amount does not match allowable amount from Pricing',
                type: 'checkbox-filter',
                filterName: 'ActualAllowableDiffers',
                buttonTypeCheckbox: false,
                items: [
                    {
                        id: guid(true),
                        displayName: 'Allowable',
                        isSelected: false
                    }
                ]
            }
        };

        this.updateFilters = (response) => {
            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response, {});
                this.advancedFiltersService.mapFilterObject(response);
                this.filters = this.advancedFiltersService.getSearchFilters();
                this.infinityTableService.reload();
            }
        };

        this.filtersObj = {
            Statuses: $state.params.filterByStatus,
            CreatedOn: '',
            ModifiedOn: '',
            BillDate: ''
        };
        this.sortExpr = {};
        this.statuses = [];
        this.holdReasons = [];

        if ($state.params.showNewInvoiceModal) {
            this.billingsCommonService.addInvoice(this.$state.params.predefinedPatient);
        }

        this.getInvoices = (pageIndex, pageSize) =>
            invoicesService.getInvoices(angular.merge({}, this.filtersObj, this.filters), this.sortExpr, pageIndex, pageSize);

        invoicesService.getInvoicesStatuses()
            .then((response) => this.statuses = response.data.map((item) => item.Name.replace('-', '')));

        invoicesService.getInvoicesHoldReasons()
            .then((response) => this.holdReasons = response);

        $scope.$watch(() => this.selectedItemsArrCount(), (newVal) => {
            const selectedItems = this.infinityTableService.getSelectedItems();
            const submitItem = _.find(this.toolbarItems, (item) => item.name === 'submit');
            const isAvailableForSubmit = !_.find(selectedItems, (item) => item.isAvailableSubmit === false);

            const updateToolbarItemByAction = (itemName, actionName) => {
                const toolbarItem = this.toolbarItems.find((item) => item.name === itemName);

                if (toolbarItem) {
                    if (newVal > 0) {
                        let isActionAllowed = true;

                        for (const item of selectedItems) {
                            if (!item.AllowedActions.find((action) => action.Name === actionName)) {
                                isActionAllowed = false;
                                break;
                            }
                        }
                        toolbarItem.isHidden = !isActionAllowed;

                    } else {
                        toolbarItem.isHidden = true;
                    }
                }
            };

            updateToolbarItemByAction('cms1500', 'Cms1500');
            updateToolbarItemByAction('print', 'Print');

            if (submitItem) {
                submitItem.isHidden = !(newVal > 0) || !isAvailableForSubmit;
            }

        });
    }

    printInvoices() {
        const params = {
            ClaimIds: this.infinityTableService.getSelectedItems().map((item) => item.Id)
        };

        this.bsLoadingOverlayService.start({ referenceId: 'invoicesPage' });
        this.billingClaimsService.printInvoices(params)
            .then((response) => {
                this.openLoadFileModal({
                    totalCount: params.ClaimIds.length,
                    buttonText: 'Download',
                    jobId: response.data.JobId
                });
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicesPage' }));
    }

    generateCMS1500(event, ids) {
        let postModel = {
            ClaimIds: ids || this.infinityTableService.getSelectedItems().map((item) => item.Id)
        };

        this.$mdDialog.show({
            template: cms1500TypeModalTemplate,
            controller: Cms1500TypeModalCtrl,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        })
        .then((response) => {
            const isBlank = !!response;

            this.billingClaimsService.getCms1500ForInvoices(postModel.ClaimIds, isBlank).then((response) => {

                this.openLoadFileModal({
                    totalCount: postModel.ClaimIds.length,
                    buttonText: 'Download',
                    jobId: response.data.JobId
                });
            });
        });
    }

    openLoadFileModal(params) {
        return this.$mdDialog.show({
            template: loadFileModalTemplate,
            controller: loadFileModalController,
            controllerAs: 'modal',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: params
        });
    }

    openBatchSubmitModal(params) {
        return this.$mdDialog.show({
            template: batchSubmitModalTemplate,
            controller: batchSubmitModalController,
            controllerAs: 'modal',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            locals: params
        }).then((response) => {
            let successMsg = `${params.totalCount > 1 ? 'Invoices were' : 'Invoice was'} submitted.`;
            const hasNotElectronicallySubmitted = response.data.NotElectronicallySubmitted.length > 0;
            const hasNotSubmittedInvoices = response.data.NotSubmittedInvoices.length > 0;

            if (!hasNotElectronicallySubmitted && !hasNotSubmittedInvoices) {
                this.ngToast.success(successMsg);
            }
            if (hasNotSubmittedInvoices) {
                const notSubmittedIds = response.data.NotSubmittedInvoices.map((item) => `#${item.DisplayId}`).join(', ');
                const msg = `The ${response.data.NotSubmittedInvoices.length > 1 ?
                    `invoices ${notSubmittedIds} have` :
                    `invoice ${notSubmittedIds} has`} already been submitted, please try after 24h.`;

                this.ngToast.danger(msg);
            }
            if (hasNotElectronicallySubmitted) {
                this.generateCMS1500(params.event, response.data.NotElectronicallySubmitted);
            }

            this.infinityTableService.reload();
        });
    }

    toggleItem($event, item) {
        $event.stopPropagation();
        this.infinityTableService.toggleItem(item);
    }

    selectedItemsArrCount() {
        let arr = this.infinityTableService.getSelectedItems();

        return arr && arr.length;
    }

    getPatients(name, pageIndex) {
        return this.invoicesService.getPatientNamesFromBilling(name, pageIndex)
            .then((response) => response.data);
    }

    getInvoicesDictionary(name, pageIndex) {
        return this.invoicesService.getInvoicesDictionary({
            DisplayId: name,
            PageIndex: pageIndex
        }).then((response) => response.data);
    }

    goToInvoice(invoiceId) {
        this.$state.go('root.invoice.details', { invoiceId });
    }

    batchSubmitInvoicesModal(event) {
        const selectedClaimIds = this.infinityTableService.getSelectedItems().map((item) => item.Id);

        if (!selectedClaimIds.length) {
            return;
        }
        this.$mdDialog.show({
            template: submitInvoiceModalTemplate,
            controller: submitInvoiceModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { isMultiple: selectedClaimIds.length > 1 }
        }).then(() => {
            this.bsLoadingOverlayService.start({ referenceId: 'invoicesPage' });

            this.invoicesService.batchSubmitInvoice({ ClaimIds: selectedClaimIds })
                .then((response) => {
                    this.openBatchSubmitModal({
                        event,
                        totalCount: selectedClaimIds.length,
                        jobId: response.data.JobId
                    });
                })
                .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'invoicesPage' }));
        });
    }
}

