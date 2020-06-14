import { renderingProviderTypeConstants } from '../../../core/constants/core.constants.es6';
import {
    insurancePriorityConstants,
    pricingTypeConstants
} from '../../../core/constants/billing.constants.es6';

import satisfiedInvoiceModalController from '../../scripts/controllers/modals/satisfiedInvoiceModal.controller.es6.js';
import satisfiedTemplate from '../../views/modals/satisfiedInvoiceModal.html';

export default class invoiceModifyService {
    constructor($q,
                ngToast,
                $state,
                $filter,
                $mdDialog,
                $http,
                billingDictionariesService,
                coreDictionariesService,
                invoiceAttrDictionaryService,
                WEB_API_SERVICE_URI,
                WEB_API_BILLING_SERVICE_URI,
                WEB_API_INVENTORY_SERVICE_URI,
                coreOrderService
    ) {
        'ngInject';

        this.$q = $q;
        this.ngToast = ngToast;
        this.$state = $state;
        this.$filter = $filter;
        this.$mdDialog = $mdDialog;
        this.$http = $http;
        this.billingDictionariesService = billingDictionariesService;
        this.coreDictionariesService = coreDictionariesService;
        this.invoiceAttrDictionaryService = invoiceAttrDictionaryService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.coreOrderService = coreOrderService;

        this.model = {};
        this.dictionaries = {};
    }

    getDictionaries() {
        return this.dictionaries;
    }

    getModel() {
        return this.model;
    }

    getPredefinedModel(patientId, OrderId, EventId) {
        const params = {
            orderId: OrderId || null,
            eventId: EventId || null
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/claims/predefined`, { params });
    }

    clearModel() {
        this.model = {
            Patient: {},
            OrderId: undefined,
            HoldReasons: [],
            Tags: [],
            Insurances: [],
            Lines: [],
            PatientDiagnoses: [],
            PatientDiagnosesLoaded: false,
            ClaimOptions: {
                Diagnosis: []
            },
            BillRecipient: {
                Type: '',
                InsuranceId: ''
            }
        };
    }

    setPredefinedModel(data) {

        this.model = angular.extend(this.model, data);
        this.model.Location = data.Patient.Location;
        this.model.PatientId = data.Patient.Id;
        this.model.Patient = data.Patient;

        this.model.Statuses.Status = data.Statuses.Status.Id;
        this.model.HoldReasons = data.Statuses.HoldReasons || [];
        this.model.Tags = data.Tags || [];
        this.model.Statuses.ResubmissionCode = data.Statuses.ResubmissionCode.Id;

        this.model.BillRecipient = {
            Type: data.BillRecipient.Type.Name,
            InsuranceId: data.BillRecipient.InsuranceId,
            Name: getBillRecipientName(data.BillRecipient),
            Id: data.BillRecipient.InsuranceId || '1'
        };

        this.model.ClaimOptions = {
            Diagnosis: data.Diagnosis && data.Diagnosis.length ?
                data.Diagnosis.map((item) => {
                    return {
                        id: item.Id,
                        name: item.Id,
                        description: `${item.Id} - ${item.Name}`
                    };
                }) :
                [],
            ProviderSignatureOnFile: this.model.Options.ProviderSignatureOnFile.Id,
            ProviderSignatureOnFileDate: this.model.Options.ProviderSignatureOnFileDate ?
                moment(this.model.Options.ProviderSignatureOnFileDate).format('MM/DD/YYYY') :
                '',
            ProviderAcceptAssignment: data.Options.ProviderAcceptAssignment.Id,
            InsuredSignatureOnFile: this.model.Options.InsuredSignatureOnFile.Id,
            InsuredSignatureOnFileDate: this.model.Options.InsuredSignatureOnFileDate ?
                moment(this.model.Options.InsuredSignatureOnFileDate).format('MM/DD/YYYY') :
                '',
            PatientSignatureOnFile: this.model.Options.PatientSignatureOnFile.Id,
            PatientSignatureOnFileDate: this.model.Options.PatientSignatureOnFileDate ?
                moment(this.model.Options.PatientSignatureOnFileDate).format('MM/DD/YYYY') :
                '',
            PriorAuthNumber: this.model.Options.PriorAuthNumber ?
                { Id: this.model.Options.PriorAuthNumber, Text: this.model.Options.PriorAuthNumber } :
                null,
            BillingProvider: data.Options.BillingProvider,
            ReferringProvider: this._mapReferringProvider(data.Options.ReferringProvider)
        };
        this.model.ClaimOptions.BillingProvider.notModified = true;

        let provider = data.Options.BillingProvider;

        this.model.ClaimOptions.BillingProvider.FullName = `${provider.Name} (NPI: ${provider.Npi})`;

        this.model.ServiceLines = data.ServiceLines && data.ServiceLines.length ?
            data.ServiceLines.map((line) => mapPredefinedLinesModel(line)) :
            [];

        function mapPredefinedLinesModel(line) {
            return {
                Name: line.Name,
                Adjustment: line.Adjustment || 0,
                HcpcsCode: line.HcpcsCode ?
                {
                    Id: line.HcpcsCode.Id || line.HcpcsCode,
                    Text: line.HcpcsCode.Name || line.HcpcsCode
                } :
                    null,
                ServiceProduct: line.ServiceProduct,
                Quantity: line.Quantity || 1,
                Charge: line.Charged || 0,
                ServicePeriod: {
                    From: moment.utc(line.ServicePeriod.From).format('MM/DD/YYYY'),
                    To: moment.utc(line.ServicePeriod.To).format('MM/DD/YYYY')
                },
                Modifiers: {
                    Level1: line.Modifiers && line.Modifiers.Level1 || null,
                    Level2: line.Modifiers && line.Modifiers.Level2 || null,
                    Level3: line.Modifiers && line.Modifiers.Level3 || null,
                    Level4: line.Modifiers && line.Modifiers.Level4 || null
                },
                PlaceOfService: {
                    Id: line.PlaceOfService.Id || line.PlaceOfService.Code,
                    Name: line.PlaceOfService.Name
                },
                PriorAuthNumber: line.PriorAuthNumber ? { Id: line.PriorAuthNumber, Text: line.PriorAuthNumber } : null,
                Diagnosis: {
                    First: _.has(line, 'Diagnosis.First') ?
                    {
                        id: line.Diagnosis.First.Id,
                        name: line.Diagnosis.First.Name,
                        description: `${line.Diagnosis.First.Id} - ${line.Diagnosis.First.Name}`
                    } :
                        null,
                    Second: _.has(line, 'Diagnosis.Second') && line.Diagnosis.Second !== null ?
                    {
                        id: line.Diagnosis.Second.Id,
                        name: line.Diagnosis.Second.Name,
                        description: `${line.Diagnosis.Second.Id} - ${line.Diagnosis.Second.Name}`
                    } :
                        null,
                    Third: _.has(line, 'Diagnosis.Third') && line.Diagnosis.Third !== null ?
                    {
                        id: line.Diagnosis.Third.Id,
                        name: line.Diagnosis.Third.Name,
                        description: `${line.Diagnosis.Third.Id} - ${line.Diagnosis.Third.Name}`
                    } :
                        null,
                    Fourth: _.has(line, 'Diagnosis.Fourth') && line.Diagnosis.Fourth !== null ?
                    {
                        id: line.Diagnosis.Fourth.Id,
                        name: line.Diagnosis.Fourth.Name,
                        description: `${line.Diagnosis.Fourth.Id} - ${line.Diagnosis.Fourth.Name}`
                    } :
                        null
                },
                TotalAmounts: {
                    Charged: {
                        Amount: line.Charged || 0,
                        Currency: '$'
                    },
                    CleanCharge: {
                        Amount: line.Charged || 0,
                        Currency: '$'
                    },
                    Payments: {
                        Amount: 0,
                        Currency: '$'
                    },
                    Adjustments: {
                        Amount: line.Adjustment || 0,
                        Currency: '$'
                    },
                    Balance: {
                        Amount: 0,
                        Currency: '$'
                    }
                },

                isAdded: true,
                Attributes: line.Attributes || [],
                SystemAttributes: line.SystemAttributes || []
            };
        }

        function getBillRecipientName(billRecipient) {
            let name = 'Patient';
            const isPatient = billRecipient.Type.Id === 'Patient';

            if (!isPatient) {
                name = billRecipient.PayerName ?
                    billRecipient.PayerName :
                    `Insurance: ${billRecipient.InsuranceId}`;
            }

            return name;
        }
    }

    setPriorityOrderName(PriorityOrder) {
        if (PriorityOrder.Id || PriorityOrder) {
            switch (PriorityOrder.toString()) {
                case '1':
                    return 'Primary';
                case '2':
                    return 'Secondary';
                default:
                    return 'Other';
            }
        }
    }

    getPatientDiagnoses(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId || this.model.PatientId}/diagnoses`)
            .then((response) => {
                this.model.PatientDiagnoses = response.data.Items.map((diagnosis) => {
                    return {
                        id: diagnosis.Code,
                        name: diagnosis.Code,
                        description: diagnosis.CodeWithDescription
                    };
                });
                this.model.PatientDiagnosesLoaded = true;
            });
    }

    getInvoiceById(id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${id}`)
            .then((response) => {
                this.model = angular.extend(this.model, response.data);

                this.model.invoiceId = response.data.InvoiceId;

                this.model.PatientId = response.data.Patient.Id;
                this.model.BillRecipient.Id = this.model.BillRecipient.InsuranceId || 1;

                this.model.ClaimOptions = {
                    Diagnosis: response.data.Diagnosis.map((item) => {
                        return {
                            id: item.Id,
                            name: item.Name,
                            description: `${item.Id} - ${item.Description}`
                        };
                    }),
                    ProviderAcceptAssignment: this.model.Options.ProviderAcceptAssignment.Id,
                    ProviderSignatureOnFile: this.model.Options.ProviderSignatureOnFile.Id,
                    ProviderSignatureOnFileDate: this.model.Options.ProviderSignatureOnFileDate ?
                        moment(this.model.Options.ProviderSignatureOnFileDate).format('MM/DD/YYYY') :
                        '',
                    InsuredSignatureOnFile: this.model.Options.InsuredSignatureOnFile.Id,
                    InsuredSignatureOnFileDate: this.model.Options.InsuredSignatureOnFileDate ?
                        moment(this.model.Options.InsuredSignatureOnFileDate).format('MM/DD/YYYY') :
                        '',
                    PatientSignatureOnFile: this.model.Options.PatientSignatureOnFile.Id,
                    PatientSignatureOnFileDate: this.model.Options.PatientSignatureOnFileDate ?
                        moment(this.model.Options.PatientSignatureOnFileDate).format('MM/DD/YYYY') :
                        '',
                    PriorAuthNumber: this.model.Options.PriorAuthNumber ?
                        { Id: this.model.Options.PriorAuthNumber, Text: this.model.Options.PriorAuthNumber } :
                        undefined,
                    RenderingProvider: this.model.Options.RenderingProvider,
                    ReferringProvider: this._mapReferringProvider(this.model.Options.ReferringProvider),
                    BillingProvider: this.model.Options.BillingProvider,
                    AdditionalInfo: this.model.Options.AdditionalInfo
                };

                this.model.ClaimOptions.BillingProvider.notModified = true;

                let provider = this.model.Options.BillingProvider;

                this.model.ClaimOptions.BillingProvider.FullName = `${provider.Name} (NPI: ${provider.Npi})`;

                let rendProv = this.model.Options.RenderingProvider;
                let refProv = this.model.Options.ReferringProvider;

                if (rendProv && rendProv.Type.Id === renderingProviderTypeConstants.ORGANIZATION_TYPE_ID) {
                    this.model.ClaimOptions.RenderingProvider.FullName = `${rendProv.OrganizationName} (NPI: ${rendProv.Npi})`;
                }

                if (rendProv && rendProv.Type.Id === renderingProviderTypeConstants.PERSON_TYPE_ID) {
                    this.model.ClaimOptions.RenderingProvider.FullName =
                        `${this.$filter('fullname')(rendProv.PersonName)} (NPI: ${rendProv.Npi})`;
                }

                if (refProv) {
                    this.model.ClaimOptions.ReferringProvider.FullName =
                        `${refProv.Name.FirstName} ${refProv.Name.LastName} (NPI: ${refProv.Npi})`;
                }

                this.model.Statuses.Status = this.model.Statuses.Status.Id;
                this.model.Statuses.ResubmissionCode = this.model.Statuses.ResubmissionCode.Id;

                this.model.HoldReasons = this.model.Statuses.HoldReasons || [];

                this.model.Tags = this.model.Tags || [];

                this.model.ServiceLines = response.data.ServiceLines.map((line) => mapLinesModel.apply(this, [line]));

            });

        function mapLinesModel(line) {
            line.TotalAmounts = line.TotalAmounts ?
                line.TotalAmounts :
                { Adjustments: {}, Balance: {}, Charged: {} };

            if (line.Attributes && line.Attributes.length) {
                line.Attributes =
                    this.invoiceAttrDictionaryService.attributesToClaimHoldReasons(line.Attributes);
                angular.forEach(line.Attributes, (attr) => {
                    attr.AttrClass = this.invoiceAttrDictionaryService.getAttrClass(attr.Code);
                });
            }

            let result = {
                Name: line.Name,
                Id: line.ServiceLineId,
                Adjustment: line.TotalAmounts.Adjustments ? line.TotalAmounts.Adjustments.Amount : null,
                HcpcsCode: {
                    Id: line.HcpcsCode.Id,
                    Text: line.HcpcsCode.Name
                },
                Quantity: line.Quantity || 1,
                Charge: line.TotalAmounts.CleanCharge ? line.TotalAmounts.CleanCharge.Amount : null,
                ServiceProduct: line.ServiceProduct,
                ServicePeriod: {
                    From: moment.utc(line.ServicePeriod.From).format('MM/DD/YYYY'),
                    To: moment.utc(line.ServicePeriod.To).format('MM/DD/YYYY')
                },
                Modifiers: line.Modifiers,
                PlaceOfService: line.PlaceOfService,
                PriorAuthNumber: line.PriorAuthNumber ? { Id: line.PriorAuthNumber, Text: line.PriorAuthNumber } : null,
                Diagnosis: mapDiagnosis(line.Diagnosis),
                TotalAmounts: line.TotalAmounts,
                isAdded: false,
                PriceOption: line.PriceOptionId ? { Id: line.PriceOptionId } : undefined,
                HoldReason: line.HoldReason || null,
                PriceType: line.PriceType || null,
                Period: line.Period || null,
                Cycle: line.Cycle,
                CanChangeOption: line.CanChangeOption || null,
                BillInArrears: line.BillInArrears,
                Attributes: line.Attributes || [],
                RentProgramId: line.RentProgramId || null
            };

            return result;
        }

        function mapDiagnosis(diagnosis) {
            for (let prop in diagnosis) {
                if (diagnosis[prop]) {
                    diagnosis[prop].id = diagnosis[prop].Id;
                    diagnosis[prop].name = diagnosis[prop].Name;
                    diagnosis[prop].description = `${diagnosis[prop].Name} - ${diagnosis[prop].Description}`;
                    delete diagnosis[prop].Id;
                    delete diagnosis[prop].Name;
                    delete diagnosis[prop].Description;
                }
            }
            return diagnosis;
        }
    }

    getInsurancesByInvoice(id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${id}/insurances/dictionary`)
            .then((response) => response.data);
    }

    // get Billing Provider Details for updating ProviderSignatureOnFile: & AcceptAssigment:
    // on changing Billing Provider in view
    getBillingProviderDetails(id) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/billing-providers/${id}`);
    }

    saveInvoice(invoiceId, lines) {
        return this.continueSavingInvoice(invoiceId, lines);
    }

    continueSavingInvoice(invoiceId, lines) {
        let promise = invoiceId ? this.updateInvoice(invoiceId, lines) : this.createInvoice(lines);

        return promise
            .then((response) => {
                this.ngToast.success(`Invoice is ${invoiceId ? 'updated' : 'created'}.`);
                this.$state.go('root.invoice.details', { invoiceId: invoiceId || response.data.Id });
                return response;
            });
    }

    prepareServiceLines(lines) {
        let result = [];

        angular.forEach(lines, (line) => {
            line.UniqueId = guid();
            let item = {
                UniqueId: line.UniqueId,
                Hcpcs: line.HcpcsCode.Id,
                Range: {
                    From: moment.utc(line.ServicePeriod.From, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    To: moment.utc(line.ServicePeriod.To, 'MM/DD/YYYY').format('YYYY-MM-DD')
                },
                Units: line.Quantity || '',
                Amount: line.TotalAmounts.Charged ? line.TotalAmounts.Charged.Amount : null,
                Modifiers: {}
            };

            angular.forEach(line.Modifiers, (value, key) => {
                if (value) {
                    item.Modifiers[key] = value.Id || value;
                }
            });

            if (_.isEmpty(item.Modifiers)) {
                delete item.Modifiers;
            }

            result.push(item);
        });
        return result;
    }

    showSatisfiedDialog(invoiceId, lines) {
        this.$mdDialog.show({
            template: satisfiedTemplate,
            controller: satisfiedInvoiceModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { lines }
        }).then((response) => {
            if (response) {
                this.continueSavingInvoice(invoiceId, lines);
            }
        });
    }

    createInvoice(lines) {
        return this.$http.post(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims`, this._getPostModel(lines));
    }

    updateInvoice(invoiceId, lines) {
        return this.$http.put(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/${invoiceId}`, this._getPutModel(lines));
    }

    validateInvoice(params) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${params.patientId}/claims/restrictions`,
            this._mapInvoiceValidateModel(params));
    }

    validateInvoiceById(invoiceId, params) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${params.patientId}/claims/${invoiceId}/restrictions`,
            this._mapInvoiceValidateModel(params));
    }

    _getPostModel(lines) {
        let model = angular.copy(this.model); // to prevent changing main model
        let result = {
            OrderId: model.OrderId,
            PatientId: model.PatientId,
            Lines: this._mapPostLines(lines),
            Status: model.Statuses.Status,
            HoldReasons: model.HoldReasons && model.HoldReasons.length ?
                model.HoldReasons.map((item) => item.Id) :
                [],
            Tags: model.Tags && model.Tags.length ? model.Tags.map((item) => item.Id) : [],
            ResubmissionCode: model.Statuses.ResubmissionCode,
            PayerOriginalClaimNumber: model.Statuses.PayerOriginalClaimNumber,
            BillRecipient: {
                Type: model.BillRecipient.Type,
                InsuranceId: model.BillRecipient.InsuranceId
            },
            ClaimOptions: model.ClaimOptions
        };

        result.ClaimOptions.Diagnosis = this._mapInvoiceDiagnosis(model.ClaimOptions.Diagnosis);
        result.ClaimOptions.PriorAuthNumber = model.ClaimOptions.PriorAuthNumber && model.ClaimOptions.PriorAuthNumber.Id;
        result.ClaimOptions.RenderingProviderId = model.ClaimOptions.RenderingProvider && model.ClaimOptions.RenderingProvider.Id;
        result.ClaimOptions.ReferringProviderId = model.ClaimOptions.ReferringProvider && model.ClaimOptions.ReferringProvider.Id;
        result.ClaimOptions.BillingProviderId = model.ClaimOptions.BillingProvider.Id;

        return result;
    }

    _mapPostLines(lines) {
        let result = [];

        angular.forEach(lines, (line) => {
            let item = {
                PriceOptionId: line.PriceOption && line.PriceOption.Id,
                UpdatePriceOption: typeof line.UpdatePriceOption === 'boolean' ? line.UpdatePriceOption : false,
                Allowed: _.has(line, 'TotalAmounts.Allowance.Amount') ? line.TotalAmounts.Allowance.Amount : null,
                Quantity: line.Quantity,
                HcpcsCode: line.HcpcsCode.Text,
                ServiceProduct: line.ServiceProduct,
                Name: line.Name,
                Charge: line.Charge,
                ServicePeriod: {
                    From: moment.utc(line.ServicePeriod.From, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    To: moment.utc(line.ServicePeriod.To, 'MM/DD/YYYY').format('YYYY-MM-DD')
                },
                Modifiers: {
                    Level1: line.Modifiers.Level1 && line.Modifiers.Level1.Id || null,
                    Level2: line.Modifiers.Level2 && line.Modifiers.Level2.Id || null,
                    Level3: line.Modifiers.Level3 && line.Modifiers.Level3.Id || null,
                    Level4: line.Modifiers.Level4 && line.Modifiers.Level4.Id || null
                },
                PlaceOfService: line.PlaceOfService.Id,
                Diagnosis: {
                    First: line.Diagnosis.First && line.Diagnosis.First.id || null,
                    Second: line.Diagnosis.Second && line.Diagnosis.Second.id || null,
                    Third: line.Diagnosis.Third && line.Diagnosis.Third.id || null,
                    Fourth: line.Diagnosis.Fourth && line.Diagnosis.Fourth.id || null
                },
                Notes: '',
                PriorAuthNumber: line.PriorAuthNumber && line.PriorAuthNumber.Id,
                Attributes: line.Attributes.length ?
                    _.filter(line.Attributes, (attr) => {
                        return attr.Category && attr.Category.Id === 'Restriction';
                    }).map((attr) => {
                        delete attr.AttrClass;
                        return attr;
                    }) :
                    []
            };

            if (line.RentStartSettings &&
                (line.PriceType && line.PriceType.Id === pricingTypeConstants.RENTAL_TYPE_ID)) {
                item.RentStartSettings = line.RentStartSettings;
            }

            // service line from server
            if (line.Id) {
                item.Id = line.Id;
            }

            // Send to the server 'null' if all Levels empty.
            item.Modifiers = (!item.Modifiers.Level1 && !item.Modifiers.Level2 && !item.Modifiers.Level3 && !item.Modifiers.Level4) ?
                null :
                item.Modifiers;

            result.push(item);
        });

        return result;
    }

    _getPutModel(lines) {
        let model = angular.copy(this.model); // to prevent changing main model
        let result = {
            OrderId: model.OrderId && model.OrderId,
            PatientId: model.PatientId,
            Status: model.Statuses.Status,
            HoldReasons: model.HoldReasons && model.HoldReasons.length ?
                model.HoldReasons.map((item) => item.Id) :
                [],
            Tags: model.Tags && model.Tags.length ? model.Tags.map((item) => item.Id) : [],
            ResubmissionCode: model.Statuses.ResubmissionCode,
            PayerOriginalClaimNumber: model.Statuses.PayerOriginalClaimNumber,
            ClaimOptions: model.ClaimOptions,
            BillRecipient: {
                Type: model.BillRecipient.Type,
                InsuranceId: model.BillRecipient.InsuranceId && model.BillRecipient.InsuranceId
            },
            Lines: this._mapPostLines(lines)
        };

        result.ClaimOptions.Diagnosis = this._mapInvoiceDiagnosis(model.ClaimOptions.Diagnosis);
        result.ClaimOptions.PriorAuthNumber = model.ClaimOptions.PriorAuthNumber && model.ClaimOptions.PriorAuthNumber.Id;
        result.ClaimOptions.RenderingProviderId = model.ClaimOptions.RenderingProvider && model.ClaimOptions.RenderingProvider.Id;
        result.ClaimOptions.ReferringProviderId = model.ClaimOptions.ReferringProvider && model.ClaimOptions.ReferringProvider.Id;
        result.ClaimOptions.BillingProviderId = model.ClaimOptions.BillingProvider.Id;

        return result;
    }

    _mapInvoiceDiagnosis(diagnosis) {
        let result = [];

        angular.forEach(diagnosis, (item) => {
            if (item && item.name) {
                result.push(item.name);
            }
        });
        return result;
    }

    _mapInvoiceValidateModel(params) {
        return {
            PatientInsuranceId: params.patientInsuranceId,
            RenderingProviderId: params.renderingProviderId,
            ServiceLines: params.lines.map((item) => {
                return {
                    Hcpcs: item.HcpcsCode.Id,
                    Count: item.Quantity,
                    DOS: moment(item.ServicePeriod.From).format('MM/DD/YYYY')
                };
            })
        };
    }

    getRenderingProviders(Name, pageIndex) {
        let params = {
            SortExpression: 'Name ASC',
            Name,
            pageIndex
        };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/providers/rendering/dictionary`, { params })
            .then((response) => {
                response.data.Items.map((item) => {
                    if (item.Type.Id === renderingProviderTypeConstants.ORGANIZATION_TYPE_ID) {
                        item.FullName = `${item.OrganizationName} (NPI: ${item.Npi})`;
                    }
                    if (item.Type.Id === renderingProviderTypeConstants.PERSON_TYPE_ID) {
                        item.FullName = `${this.$filter('fullname')(item.PersonName)} (NPI: ${item.Npi})`;
                    }
                });
                return response;
            });
    }

    getReferringProviders(Name, pageIndex) {
        let params = {
            SortExpression: 'Name ASC',
            filter: Name,
            isPerson: true,
            pageIndex
        };

        return this.coreDictionariesService.getReferralCards(params)
            .then((response) => {
                response.data.Items.forEach((item) => this._mapReferringProvider(item));
                return response;
            });
    }

    _mapReferringProvider(model) {
        if (!model) {
            return;
        }

        if (model.ReferralCardSource) {
            model.FullName = `${this.$filter('fullname')(model.ReferralCardSource.Name)} (NPI: ${model.ReferralCardSource.Npi})`;
        } else {
            model.FullName = `${this.$filter('fullname')(model.Name)} (NPI: ${model.Npi})`;
        }
        return model;
    }

    _mapRefferringProviderSingleFullName(physicianData) {
        if (physicianData) {
            return `${this.$filter('fullname')(physicianData.Name)} (NPI: ${physicianData.Npi})`;
        }
    }

    getProducts(NameOrPartNumber, pageIndex) {
        let params = { NameOrPartNumber, pageIndex, sortExpression: 'Name ASC' };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/dictionary`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.nameAndPartNumber = `#${item.PartNumber} - ${item.Name}`;
                });
                return response.data;
            });
    }

    getHcpcsCodes(code) {
        let params = { code };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }

    getPriceOptions(params) {
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/pricings/satisfied`, { params });
    }

    generateDictionaryBillTo(arr) {
        this.dictionaries.BillTo = [{
            Type: 'Patient',
            InsuranceId: null,
            Name: 'Patient',
            Id: 1
        }];

        angular.forEach(arr, (item) => {
            let itemPriorityOrder = item.PriorityOrder.Id || item.PriorityOrder;

            this.dictionaries.BillTo.push({
                Type: 'Payer',
                Id: item.Id,
                InsuranceId: item.Id,
                PatientInsuranceId: item.PatientInsuranceId,
                Name: item.Name,
                isPrimary: itemPriorityOrder === insurancePriorityConstants.PRIMARY_ID ||
                           itemPriorityOrder === 1,
                PayerId: item.PayerId,
                PayerPlan: item.PayerPlan,
                PriorityOrderName: item.PriorityOrder.Name || item.PriorityOrderName,
                SignatureOnFile: {
                    IsSigned: item.SignatureOnFile.Type ?
                        item.SignatureOnFile.Type.Id :
                        item.SignatureOnFile.IsSigned,
                    SignedDate: item.SignatureOnFile.SignedDate ?
                        moment.utc(item.SignatureOnFile.SignedDate).format('MM/DD/YYYY') :
                        ''
                }
            });
        });
    }

    downloadDictionaries(claimId, patientId) {
        this.dictionaries.signatureOnFile = [
            { Name: 'No', Id: 'No' },
            { Name: 'Yes', Id: 'Yes' }
        ];

        let statusDictionaryUrl = claimId ?
                `v1/claims/${claimId}/statuses/dictionary` :
                'v1/claims/new/statuses/dictionary';

        const patientOrdersParams = {
            status: [1, 2, 3, 5],
            pageSize: 100,
            patientId
        };

        return this.$q.all([
            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}${statusDictionaryUrl}`, { cache: true })
                .then((response) => this.dictionaries.statuses = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/hold-reasons/dictionary`, { cache: true })
                .then((response) => this.dictionaries.holdReasons = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/resubmission-codes/dictionary`, {
                cache: true,
                params: { editable: true }
            })
                .then((response) => this.dictionaries.resubmissionCodes = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/accept-assignment-type/dictionary`, { cache: true })
                .then((response) => this.dictionaries.acceptAssignmentType = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/insured-signature-on-file/dictionary`, { cache: true })
                .then((response) => this.dictionaries.insuredSignatureOnFile = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/patient-signature-on-file/dictionary`, { cache: true })
                .then((response) => this.dictionaries.patientSignatureOnFile = response.data),

            this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/filling-indicators/dictionary`, { cache: true })
                .then((response) => this.dictionaries.fillingIndicators = response.data),

            this.coreOrderService.getOrdersDictionary(patientOrdersParams)
                .then((response) => {
                    angular.forEach(response.data.Items, (item) => {
                        item.searchName = this.$filter('referralDisplayName')(item, true);
                        item.displayName = this.$filter('referralDisplayName')(item);
                    });
                    this.dictionaries.ordersDictionary = response.data.Items;
                })
        ]);
    }

    getPatientAuthorizationsDictionary(patientId, authNumber, payerId) {
        let params = { authNumber, payerId };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/authorizations`, { params });
    }
}
