import template from './search-service-lines.html';
import { paymentTypeConstants } from '../../constants/billing.constants.es6';

class searchServiceLinesCtrl {
    constructor($scope, bsLoadingOverlayService, invoicesService, pricingService) {
        'ngInject';

        this.$scope = $scope;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.invoicesService = invoicesService;

        this.currentPage = 0;
        this.PageSize = 10;

        this.serviceLineList = [];

        // Selected items
        this.selectedItemsIds = [];
        this.selectedItem = {};
        this.filtersObj = {};
        this.searchHcpcsCode = '';
        this.getHcpcsCodes = pricingService.getHcpcsCodes.bind(pricingService);
        this.showMoreButton = false;

        this.paymentTypeConstants = paymentTypeConstants;

        if (this.paymentInfoData &&
            this.paymentInfoData.Type &&
            this.paymentInfoData.Type.Id === this.paymentTypeConstants.PATIENT_TYPE_ID) {

            this.filtersObj.Patient = {
                Id: this.paymentInfoData.PatientSource.Id,
                DateOfBirthday: this.paymentInfoData.PatientSource.DateOfBirth,
                Name: {
                    FullName: `${this.paymentInfoData.PatientSource.Name.FirstName} ${this.paymentInfoData.PatientSource.Name.LastName}`
                }
            };
        }

        this.getServiceLines();
    }

    $onInit() {
        this.type = this.type || 'checkbox';
    }

    getServiceLines(page) {
        if (!page) {
            this.serviceLineList = [];
            this.currentPage = 0;
            page = 0;
        }

        this.filtersObj.Hcpcs = this.paymentServiceLine && this.paymentServiceLine.hcpcs ?
            this.paymentServiceLine.hcpcs :
            '';

        this.bsLoadingOverlayService.start({ referenceId: 'searchServiceLines' });
        return this.invoicesService.searchServiceLines(this.filtersObj, this.currentPage, this.PageSize)
            .then((res) => {
                this.serviceLineList = [
                    ...this.serviceLineList,
                    ...this.excludeSelected(res.data.Items.map(this.mapServiceLine))
                ];

                // calculate result
                this.showMoreButton = res.data.Count > (page + 1) * this.PageSize;
                if (res.data && res.data.Count === 0) {
                    this.showMoreButton = false;
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'searchServiceLines' }));
    }

    showMore() {
        this.currentPage++;
        this.showMoreButton = false;
        this.getServiceLines(this.currentPage);
    }

    getPatients(name) {
        return this.invoicesService.getPatientNames(name)
            .then((response) => response.data.Items);
    }

    excludeSelected(arr) {
        let selectedserviceLinesHashTable = this.selectedServiceLines.map((item) => item.ServiceLineId);

        return arr.filter((item) => selectedserviceLinesHashTable.indexOf(item.ServiceLineId) === -1);
    }

    mapServiceLine(item) {
        item.Adjustments = [];
        item.Amount = {
            Currency: "$",
            Amount: 0
        };
        return item;
    }

    isSelected(item) {
        return this.selectedItemsIds.indexOf(item.ServiceLineId) > -1;
    }

    toggleItem(item) {
        let pos = this.selectedItemsIds.indexOf(item.ServiceLineId);
        if (pos > -1) {
            this.selectedItemsIds.splice(pos, 1);
        } else {
            this.selectedItemsIds.push(item.ServiceLineId);
        }
    }

    cancelSearch() {
        this.isShow = false;
    }

    select() {
        if (this.type === 'checkbox') {
            this.serviceLineList.map((item) => {
                if (this.selectedItemsIds.indexOf(item.ServiceLineId) > -1) {
                    item.Adjustments = [];
                    item.Amount = {
                        Currency: "$",
                        Amount: 0
                    };
                    this.selectedServiceLines.push(item);
                }
            });
        } else if (this.paymentServiceLine) {
            let selectedServiceLine = _.find(this.serviceLineList, (item) => {
                 return item.ServiceLineId === this.selectedServiceLines[0];
            });
            this.connectServiceLine(this.paymentServiceLine.serviceLineId, selectedServiceLine.ClaimId, selectedServiceLine.ServiceLineId);
        }

        this.isShow = false;
    }

    clearFilters() {
        this.filtersObj = {};
        this.selectedItemsIds = [];
        this.searchHcpcsCode = '';
        this.getServiceLines();
    }

    search() {
        this.getServiceLines();
    }
}

export default {
    bindings: {
        isShow: '=',
        selectedServiceLines: '=',
        paymentServiceLine: '=?',
        connectServiceLine: '=?',
        paymentInfoData: '<?',
        type: '@?'      // default is 'checkbox'. 'checkbox' or 'radio'.
    },
    template,
    controller: searchServiceLinesCtrl
};
