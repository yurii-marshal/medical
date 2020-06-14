// Modal Controllers
import pricingDetailsModalController from '../../shared/modals/pricing-details/pricing-details-modal.controller.es6.js';
import billingImportModalController from '../controllers/modals/billingImportModal.controller.es6';

// Modal Templates
import pricingDetailsTemplate from '../../shared/modals/pricing-details/pricing-details.html';
import billingImportModalTemplate from '../../views/modals/import-modal.html';

export default class billingsCommonService {
    constructor(
        $http,
        $state,
        $mdDialog,
        WEB_API_SERVICE_URI,
        WEB_API_BILLING_SERVICE_URI,
        WEB_API_IDENTITY_URI,
        infinityTableService,
        invoicesService,
        corePatientService,
        coreOrderService
    ) {
        'ngInject';

        this.$http = $http;
        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.infinityTableService = infinityTableService;
        this.invoicesService = invoicesService;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_BILLING_SERVICE_URI = WEB_API_BILLING_SERVICE_URI;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;

        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;
    }

    getPatientNames(name) {
        const params = {
            'sortExpression': 'Name ASC',
            'fullName': name
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getInsurancePayerNames(name) {
        let params = {
            name,
            sortExpression: 'Name ASC'
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/payers`, { params });
    }

    searchBillingPayers(NameOrClaimCode, PageIndex = 0) {
        let params = { NameOrClaimCode, PageIndex, sortExpression: 'Name ASC' };
        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/payers/dictionary`, { params })
            .then((response) => {
                response.data.Items.forEach((item) => item.FullName = `${item.Name} - ${item.ClaimCode}`);
                return response;
            });
    }

    getCmnsTypes() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}document-types/dictionary?IsCmn=true`, { cache: true });
    }

    getClaims(DisplayId, pageIndex) {
        let params = {
            DisplayId,
            pageIndex
        };

        return this.$http.get(`${this.WEB_API_BILLING_SERVICE_URI}v1/claims/dictionary`, { params });
    }

    getOrderIds(displayId) {
        return this.coreOrderService.getOrdersDictionary({ displayId });
    }

    filtersMapping(paramsObj) {

        if (paramsObj.ExpiryDateEquals) {
            paramsObj['ExpiryDateEquals'] = moment.utc(paramsObj['ExpiryDateEquals']).format('YYYY-MM-DD');
        }

        if (paramsObj.ExpiryDateFrom) {
            paramsObj['ExpiryDateFrom'] =  moment.utc(paramsObj.ExpiryDateFrom).format('YYYY-MM-DD');
        }

        if (paramsObj.ExpiryDateTo) {
            paramsObj['ExpiryDateTo'] =  moment.utc(paramsObj.ExpiryDateTo).format('YYYY-MM-DD');
        }

        if (paramsObj.InProgressDateRangeFrom) {
            paramsObj['InProgressDateRangeFrom'] = moment(paramsObj.InProgressDateRangeFrom).startOf('day').format();
        }

        if (paramsObj.InProgressDateRangeTo) {
            paramsObj['InProgressDateRangeTo'] = moment(paramsObj.InProgressDateRangeTo).endOf('day').format();
        }

        if (paramsObj.inProgressStartDateFrom) {
            paramsObj['inProgressStartDateFrom'] = moment(paramsObj.inProgressStartDateFrom).startOf('day').format();
        }

        if (paramsObj.inProgressStartDateTo) {
            paramsObj['inProgressStartDateTo'] = moment(paramsObj.inProgressStartDateTo).endOf('day').format();
        }

        if (paramsObj.Patient) {
            paramsObj.PatientId = paramsObj.Patient.Id;
            delete paramsObj['Patient'];
        }

        if (paramsObj.PrimaryInsurance) {
            paramsObj.PrimaryInsurancePayerId = paramsObj.PrimaryInsurance.Id;
            delete paramsObj['PrimaryInsurance'];
        }

        if (paramsObj.Insurance) {
            paramsObj.Source = paramsObj.Insurance.Name;
            delete paramsObj['Insurance'];
        }

        if (paramsObj.PrimaryInsurancePayer) {
            paramsObj['PrimaryInsurancePayerId'] = paramsObj.PrimaryInsurancePayer.Id;
            delete paramsObj['PrimaryInsurancePayer'];
        }

        if (paramsObj.InsurancePayer) {
            paramsObj.PayerId = paramsObj.InsurancePayer.Id;
            delete paramsObj['InsurancePayer'];
        }

        if (paramsObj.Claim) {
            paramsObj.InvoiceId = paramsObj.Claim.Id;
            delete paramsObj['Claim'];
        }

        if (paramsObj.Code) {
            paramsObj.Code = paramsObj.Code.Code || paramsObj.Code.Id;
        }

        if (paramsObj.Dos) {
            paramsObj['Dos.From'] = moment.utc(paramsObj.Dos).format('YYYY-MM-DD');
            delete paramsObj['Dos'];
        }

        return paramsObj;
    }

    getProcessingPerson(params) {
        params.sortExpression = "Name.FullName ASC";
        return this.$http.get(`${ this.WEB_API_IDENTITY_URI }users/list`,  { params })
            .then((response) => {
                response.data.Items.map((item) => {
                    item.userName = item.FullName;
                });
                return response.data.Items;
            });
    }

    addInvoice(predefinedPatient) {
        this.invoicesService.createInvoice(predefinedPatient);
    }

    addPayment() {
        this.$state.go('root.newPayment');
    }

    goStatements() {
        this.$state.go('root.statements');
    }

    billingImport(stateName) {
        this.$mdDialog.show({
            template: billingImportModalTemplate,
            controller: billingImportModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: false
        }).then((response) => {
            if (response && stateName === 'root.billing.eob_era') {
                this.infinityTableService.reload();
            }
        });
    }

    showPricingDetails($event, serviceLine, invoiceId) {
        $event.stopPropagation();
        this.$mdDialog.show({
            template: pricingDetailsTemplate,
            controller: pricingDetailsModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: { invoiceId, serviceLine }
        });
    }

    filterExistValues(arr1, arr2) {
        let newAttrArr = angular.copy(arr2, []);

        // if (arr1 && arr1.length) {
        //     angular.forEach(arr1, (i) => {
        //         let isExist =_.find(arr2, (item) => item.Id === i.Id);
        //
        //         if (!isExist) {
        //             newAttrArr.push(i);
        //         }
        //     });
        // }

        if (arr1 && arr1.length) {
            angular.forEach(arr1, (i) => {
                let name = normalize(i);
                let isExist =_.find(arr2, (item) => normalize(item) === name);

                if (!isExist) {
                    newAttrArr.push(i);
                }
            });
        }

        function normalize(item) {
            return (item.Name || item.Text).toLowerCase().replace(/\s|\-/g, '');
        }

        return newAttrArr;
    }

    getHcpcsCodes(params) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/hcpcs/dictionary`, { params });
    }
}
