import {
    invoiceStatusConstants,
    invoiceAllowedActionConstants,
    adjustmentTypeConstants
} from '../../../core/constants/billing.constants.es6.js';
import {
    patientStatusConstants
} from '../../../core/constants/core.constants.es6.js';
import { addTagClass } from '../../../core/helpers/map-tags.helper.es6.js';
import { mapTransactionsDescription } from './map-transaction-description.helper.es6';


// Modal Controllers
import closeInvoiceModalController from '../../scripts/controllers/modals/closeInvoiceModal.controller.es6.js';
import addInvoiceModalController from '../modals/add-invoice/add-invoice.controller.es6.js';

// Modal Templates
import closeInvoiceModalTemplate from '../../views/modals/close-invoice-modal.html';
import addInvoiceModalTemplate from '../modals/add-invoice/add-invoice.html';

export default class invoicesService {
    constructor($mdDialog,
                $q,
                $http,
                $filter,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI,
                WEB_API_INVENTORY_SERVICE_URI,
                WEB_API_IDENTITY_URI,
                infinityTableFilterService,
                Upload,
                authService,
                invoiceAttrDictionaryService,
                billingInvoiceTransactionService,
                corePatientService,
                coreOrderService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.$http = $http;
        this.$filter = $filter;

        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;

        this.infinityTableFilterService = infinityTableFilterService;
        this.authService = authService;
        this.invoiceAttrDictionaryService = invoiceAttrDictionaryService;
        this.billingInvoiceTransactionService = billingInvoiceTransactionService;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;
        this.Upload = Upload;

        this.model = {};
    }

    getStatusClass(invoiceStatusId) {
        switch (invoiceStatusId.toString()) {
            case invoiceStatusConstants.NEW_STATUS_ID : // new
                return 'green';
            case invoiceStatusConstants.OPEN_STATUS_ID: // open
                return 'blue';
            case invoiceStatusConstants.HOLD_STATUS_ID: // on-hold
                return 'orange';
            case invoiceStatusConstants.SUBMITTED_STATUS_ID: // submited
                return 'dark-blue';
            case invoiceStatusConstants.REJECTED_STATUS_ID: // rejected
            case invoiceStatusConstants.DENIED_STATUS_ID: // denied
                return 'red';
            default: // closed OR void
                return 'gray';
        }
    }

    getModel() {
        return this.model;
    }

    // patient and order info from DME API
    _getAndSetDmeInfo(orderId, patientId) {
        let promises = [];

        if (orderId) {
            promises.push(this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/short-info`));
        } else {
            promises.push(undefined);
        }
        if (patientId) {
            promises.push(this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/short-info`));
        } else {
            promises.push(undefined);
        }
        return this.$q.all(promises)
            .then((data) => {
                this.model.Order = data[0] ? data[0].data : undefined;
                this.model.Patient = data[1] ? data[1].data : undefined;
            });
    }

    _setModel(data, activeLineId) {
        this.model.isVoidInvoice = data.Statuses.Status.Id === invoiceStatusConstants.VOID_STATUS_ID;
        this.model.BillDate = data.BillDate;
        this.model.InvoiceId = data.ClaimId;
        this.model.DisplayId = data.DisplayId;
        this.model.Options = data.Options;
        this.model.Diagnosis = data.Diagnosis;
        this.model.BillRecipient = data.BillRecipient;
        this.model.Statuses = data.Statuses;
        this.model.Tags = data.Tags;
        this.model.UniqueTags = data.UniqueTags;
        this.model.TotalAmounts = data.TotalAmounts;
        this.model.AllowedActions = data.AllowedActions;
        this.model.IsBillInArrears = data.IsBillInArrears;

        if (!activeLineId) {
            this.model.ServiceLines = data.ServiceLines;

            // set patient and order info
            return this._getAndSetDmeInfo(data.OrderId, data.Patient.Id);
        }

        let oldLine = _.find(this.model.ServiceLines, (line) => {
                return activeLineId === line.ServiceLineId;
            }),
            newLine = _.find(data.ServiceLines, (line) => {
                return activeLineId === line.ServiceLineId;
            });

        oldLine.IsDenied = newLine.IsDenied;
        oldLine.TotalAmounts = newLine.TotalAmounts;
    }

    _setDefaultModel() {
        this.model = {
            InvoiceId: '',
            DisplayId: '',
            Patient: {},
            Order: {},
            TotalAmounts: undefined,
            Options: undefined,
            Diagnosis: [],
            BillRecipient: undefined,
            Statuses: undefined,
            Tags: [],
            ServiceLines: [],
            BillDate: undefined
        };
    }

    // invoice info from billing API
    getAndSetModel(invoiceId, activeLineId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}`)
            .then((response) => {
                response.data.UniqueTags = [];
                response.data.Statuses.statusClass = this.getStatusClass(response.data.Statuses.Status.Id);

                if (response.data.Statuses.HoldReasons && response.data.Statuses.HoldReasons.length) {
                    response.data.Statuses.HoldReasons.forEach((item) => {
                        item.AttrClass = this.invoiceAttrDictionaryService.getAttrClass(item.Id);
                        response.data.UniqueTags.push({ Name: item.Name, AttrClass: item.AttrClass });
                    });
                }
                angular.forEach(response.data.ServiceLines, (item) => {
                    item.Attributes = this.invoiceAttrDictionaryService.attributesToClaimHoldReasons(item.Attributes);
                    if (item.Attributes && item.Attributes.length) {
                        item.Attributes.forEach((attr) => {
                            attr.AttrClass = this.invoiceAttrDictionaryService.getAttrClass(attr.Code);
                        });
                    }
                    item.SystemAttributes = this.invoiceAttrDictionaryService.attributesToClaimHoldReasons(item.SystemAttributes);
                    if (item.SystemAttributes && item.SystemAttributes.length) {
                        item.SystemAttributes.map((i) => i.AttrClass = this.invoiceAttrDictionaryService.getAttrClass(i.Code));
                    }
                });
                if (response.data.Tags && response.data.Tags.length) {
                    response.data.Tags.forEach((t) => {
                        t.AttrClass = addTagClass(t.Name);
                        if (!_.find(response.data.UniqueTags, (u) => u.Name === t.Name)) {
                            response.data.UniqueTags.push({ Name: t.Name, AttrClass: t.AttrClass });
                        }
                    });
                }

                return this._setModel(response.data, activeLineId);
            });
    }

    getInsuranceList(invoiceId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/insurances`, {params});
    }

    getInsurances(patientId, params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances`, {params});
    }

    deleteInsurance(invoiceId, insuranceId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/insurances/${insuranceId}`);
    }

    updateInsuranceSingle(claimId, patientInsuranceId, claimInsuranceId, patientId) {
        const params = {claimId, claimInsuranceId};

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances/${patientInsuranceId}/update`, {params});
    }

    updateInsurances(InsuranceIds, ClaimId, patientId) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/insurances/update`, {InsuranceIds, ClaimId});
    }

    reorderInsurances(insurances, invoiceId) {
        let model = {Items: []};

        angular.forEach(insurances, function (item, index) {
            model.Items.push({
                InsuranceId: item.Id,
                PriorityOrder: index + 1
            });
        });

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/insurances/change-priority`, model);
    }

    getActiveInvoices(filter, sortExpr, pageIndex, pageSize) {
        return this.getInvoices(filter, sortExpr, pageIndex, pageSize, `v1/claims/active`);
    }

    getClosedInvoices(filter, sortExpr, pageIndex, pageSize) {
        return this.getInvoices(filter, sortExpr, pageIndex, pageSize, `v1/claims/history`);
    }

    getInvoices(filter, sortExpr, pageIndex, pageSize, getInvoicesUrl) {
        let params = this.infinityTableFilterService.getFilters(filter);

        if (params.CreatedOn) {
            params.CreatedOn = moment(params.CreatedOn).format();
        }
        if (params.ModifiedOn) {
            params.ModifiedOn = moment(params.ModifiedOn).format();
        }
        if (params.Patient) {
            params.PatientId = params.Patient.Id;
            delete params['Patient'];
        }
        if (params.Invoice) {
            params.Id = params.Invoice.Id;
            delete params['Invoice'];
        }

        if (params.AgingFromCustom) {
            params['AgingFrom'] = moment().subtract(Number(params.AgingFromCustom), 'days').format();
            delete params.AgingFromCustom;
        }

        if (params.AgingToCustom) {
            params['AgingTo'] = moment().subtract(Number(params.AgingToCustom), 'days').format();
            delete params.AgingToCustom;
        }

        params = angular.merge(params, {
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortExpression: sortExpr
                ? this.infinityTableFilterService.getSortExpressions(sortExpr)
                : 'CreatedOn DESC'
        });

        getInvoicesUrl = getInvoicesUrl || `v1/claims`;

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}${getInvoicesUrl}`, {params})
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.statusClass = this.getStatusClass(item.Status.Id);
                    item.PatientFullName = `${item.Patient.FirstName} ${item.Patient.LastName}`;
                    item.isAvailableSubmit = !!_.find(item.AllowedActions, (i) => {
                        return (i.Id === invoiceAllowedActionConstants.SUBMIT_ACTION_ID) ||
                        (i.Id === invoiceAllowedActionConstants.RESUBMIT_ACTION_ID);
                    });
                    item.UniqueTags = [];
                    if (item.HoldReasons && item.HoldReasons.length) {
                        item.HoldReasons.forEach((i) => {
                            i.AttrClass = this.invoiceAttrDictionaryService.getAttrClass(i.Id);
                            item.UniqueTags.push({ Name: i.Name, AttrClass: i.AttrClass });
                        });
                    }
                    if (item.Tags && item.Tags.length) {
                        item.Tags.forEach((t) => {
                            t.AttrClass = addTagClass(t.Name);
                            if (!_.find(item.UniqueTags, (u) => u.Name === t.Name)) {
                                item.UniqueTags.push({ Name: t.Name, AttrClass: t.AttrClass });
                            }
                        });
                    }
                });

                return response;
            });
    }

    getPayments(patientId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/patients/${patientId}/payments`, {params});
    }

    getRelatedInvoices(invoiceId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/related`, { params });
    }

    getInvoicesDictionary(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/dictionary`, { params });
    }

    getPatientNames(name) {
        const params = {
            'sortExpression': 'Name.FullName ASC',
            'fullName': name
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    // for invoices list only at this moment
    getPatientNamesFromBilling(name, pageIndex) {
        let params = {
            'sortExpression': 'FullName ASC',
            'PageIndex': pageIndex
        };

        if (name) {
            params.Name = name;
        }
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patients/dictionary`, {params})
            .then((response) => {
                angular.forEach(response.data.Items, (o) => {
                    o.Name.FullName = this.$filter('fullname')(o.Name);
                });
                return response;
            });
    }

    getActivePatients(fullName) {
        const params = {
            fullName,
            status: patientStatusConstants.ACTIVE_STATUS_ID
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getReadyOrdersByPatient(patientId) {
        let params = {
            status: [1, 2, 3, 5],
            pageSize: 100,
            patientId
        };

        return this.coreOrderService.getOrdersDictionary(params)
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.searchName = this.$filter('referralDisplayName')(item, true);
                    item.displayName = this.$filter('referralDisplayName')(item);
                });
                return response;
            });
    }

    getEventsByOrder(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/events`);
    }

    adjustmentGroupsDictionary() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/services-lines/adjustment/groups/dictionary`);
    }

    adjustmentReasonsDictionary(name) {
        let params = {name};

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/services-lines/adjustment/reasons/dictionary`, {params});
    }

    postPayOff(invoiceId, model) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/pay-off`, model);
    }

    closeInvoiceModal(invoiceId) {
        if (_.has(this.model, 'Statuses.Status.Id') &&
            this.model.Statuses.Status.Id !== invoiceStatusConstants.CLOSED_STATUS_ID) {
            this.$mdDialog.show({
                template: closeInvoiceModalTemplate,
                controller: closeInvoiceModalController,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {
                    invoiceId,
                    displayId: this.model.DisplayId
                }
            });
        } else {
            this.$mdDialog.hide();
        }
    }

    closeInvoice(invoiceId) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/close`);
    }

    getInvoicesStatuses() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/statuses/dictionary`, {cache: true});
    }

    getInvoicesHoldReasons() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/hold-reasons/dictionary`, {cache: true})
            .then((response) => response.data);
    }

    getPayersTypes() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/payers/types/dictionary`, {cache: true})
            .then((response) => response.data);
    }

    getInvoiceNotes(pageIndex, pageSize, sortExpression, filterExpression, invoiceId) {
        let params = this.infinityTableFilterService.getFilters(filterExpression);

        params = angular.merge(params, {
            pageSize: pageSize,
            pageIndex: pageIndex,
            sortExpression: sortExpression
        });

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/notes`, {params})
            .then((response) => {
                response.data = {
                    Count: response.data.Count,
                    Items: response.data.Items.map((item) => {
                        return {
                            Description: item.Note,
                            CreatedByUser: {
                                Name: {
                                    First: item.CreatedBy.FirstName,
                                    Last: item.CreatedBy.LastName,
                                    FullName: `${item.CreatedBy.FirstName} ${item.CreatedBy.LastName}`
                                }
                            },
                            CreatedDate: item.CreatedOn
                        };
                    })
                };
                return response;
            });
    }

    addInvoiceNote(note, invoiceId) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/notes`, note);
    }

    submitInvoice(invoiceId) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/submit`);
    }

    batchSubmitInvoice(invoicesIds) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/submit`, invoicesIds);
    }

    exportInvoice(invoiceId) {
        return this.$http({
            url: `${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/export`,
            method: 'POST',
            data: '',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            download(response.data, `claim_${invoiceId}_${moment().format('MM-DD-YYYY hh-mm-ss A')}.clm`, 'application/octet-stream');
        });
    }

    getUsers(fullName) {
        let params = {fullName};

        return this.$http.get(`${ this.WEB_API_IDENTITY_URI }users/list`, { params });
    }

    _makeTooltip(transactions) {
        angular.forEach(transactions, (item) => {
            item.tooltipText = `<div class="transaction-tooltip-row">
                                    Created by: ${item.CreatedBy.FirstName} ${item.CreatedBy.LastName} 
                                    on: ${moment(item.CreatedOn).format('MM/DD/YYYY hh:mm:A')}
                                </div>`;
        });
    }

    _mapTransactionTypeClass(transaction) {

        switch (transaction.Type.Id.toString()) {
            case adjustmentTypeConstants.PAYMENT_ID:
                return 'green';
            case adjustmentTypeConstants.ADJUSTMENT_ID:
                return 'blue';
            case adjustmentTypeConstants.DENIAL_ID:
                return 'red';
            case adjustmentTypeConstants.REVERSAL_ID:
                return 'dark-blue';
            default:
                break;
        }

    }

    getSLTransactions(invoiceId, lineId) {
        return this.billingInvoiceTransactionService.getSLTransactions(invoiceId, lineId)
            .then((response) => {
                let line = _.find(this.model.ServiceLines, (item) => {
                    return lineId === item.ServiceLineId;
                });

                line.transactions = response.data.Items.map((i) => {
                    i.typeClass = this._mapTransactionTypeClass(i);
                    return i;
                });

                this._makeTooltip(line.transactions);

                line.transactions = mapTransactionsDescription(line.transactions);
            });
    }

    getInvoiceTransactions(invoiceId) {
        return this.billingInvoiceTransactionService.getInvoiceTransactions(invoiceId)
            .then((response) => {

                response.data.Items = response.data.Items.map((i) => {
                    i.typeClass = this._mapTransactionTypeClass(i);
                    return i;
                });
                this._makeTooltip(response.data.Items);

                return mapTransactionsDescription(response.data.Items);
            });
    }

    getTransactionGroups() {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/services-lines/adjustment/groups/dictionary`);
    }

    getTransactionReasons(Name) {
        let params = { Name };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/services-lines/adjustment/reasons/dictionary`, {params});
    }

    getPriceDetails(pricingId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/${pricingId}`);
    }

    getServiceLinesByInvoiceId(invoiceId, params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/service-lines`, {params});
    }

    getAmountsByOrderId(orderId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/orders/${orderId}/amounts`);
    }

    getAmountsByPatientId(patientId) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/patients/${patientId}/amounts`);
    }

    searchServiceLines(filter, PageIndex, PageSize) {
        let params = this.infinityTableFilterService.getFilters(filter);

        if (params['Dos.To']) {
            params['Dos.To'] = moment.utc(params['Dos.To'], 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (params['Dos.From']) {
            params['Dos.From'] = moment.utc(params['Dos.From'], 'MM/DD/YYYY').format('YYYY-MM-DD');
        }
        if (params.Patient) {
            params.PatientId = params.Patient.Id;
            delete params['Patient'];
        }
        if (params.HcpcsItem) {
            params.Hcpcs = params.HcpcsItem.Id;
            delete params['HcpcsItem'];
        }
        // Balance by default should be more than 0
        if (!params.Balance) {
            params.Balance = 0.01;
        }

        params.PageIndex = PageIndex || 0;
        params.PageSize = PageSize || 10;
        params.SortExpression = 'Patient ASC';

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/service-lines/search`, {params});
    }

    billingImport(file) {
        if (!file) {
            return;
        }

        let token = this.authService.getAccessToken();

        if (!token) {
            return;
        }

        return this.Upload.upload({
            url: `${this.WEB_API_BILLING_SERVICE_URI}v1/transactions/payments/form-import`,
            data: {file},
            method: 'POST',
            headers: {'Authorization': `Bearer${token}`}
        });
    }

    getMessages(invoiceId) {
        let params = {SortExpression: 'Date DESC'};

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/messages`, {params});
    }

    deleteMessage(invoiceId, messageId) {
        return this.$http.delete(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}/messages/${messageId}`);
    }

    createInvoice(patient, order) {
        this.$mdDialog.show({
            template: addInvoiceModalTemplate,
            controller: addInvoiceModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { patient, order }
        });
    }

    getResubmissionCodes(editable = false) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/resubmission-codes/dictionary`,
            {
                params: { editable: editable }
            });
    }

    resubmitInvoice(claimId, ResubmissionCode, PayerOriginalClaimNumber) {
        const data = {ResubmissionCode, PayerOriginalClaimNumber};

        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${claimId}/resubmit`, data);
    }
}
