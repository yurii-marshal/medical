export default class orderWizardReviewItemsController {
    constructor($mdDialog,
                orderWizardService,
                $scope,
                prescriptionService,
                mapProductsService,
                ngToast
                ) {
        'ngInject';

        this.model = orderWizardService.getModel();
        this.prescriptionService = prescriptionService;
        this.mapProductsService = mapProductsService;
        this.ngToast = ngToast;

        if (this.model.showRemovedPrescriptionAlert &&
            this.model.hasReferringProvider) {

            if (this.model.prescriptionList && this.model.prescriptionList.length) {
                this.ngToast.danger('Existing prescription was removed, select new one to continue.');
            } else {
                this.ngToast.danger('Existing prescription was removed. Please continue to create a new one.');
            }
        }

        this.deleteItem = (item) => {
            orderWizardService.deleteEquipment(item);
        };

        this.deletePrescriptionItem = (item) => {
            _.remove(this.model.currentItems, (model) => {
                return (model.isAny && item.isAny && model.Code === item.Code) || (model.Id === item.Id);
            });
        };

        $scope.$watch(() => this.model.prescription, (newVal, oldVal) => {
            this.model.newItems = this.model.newItems.filter((item) => {
                return item.prescriptionId === undefined;
            });

            if (this.model.prescription.Id &&
                newVal.Id !== oldVal.Id
            ) {
                this.model.currentItems = [];

                this.prescriptionService.getPrescriptionDetails(this.model.prescription.Id).then((prescription) => {

                    let products = this.mapProductsService.joinProductsFromPrescription(prescription);

                    this.model.currentItems = products;
                    this.model.prescriptionItems = products;

                    this.presetNewItemsData();

                });
            } else if (!this.model.isPrescriptionActive) {
                this.model.currentItems = [];
            }
        });

        this.presetNewItemsData();
    }

    presetNewItemsData() {
        this.model.newItems.forEach((newItem) => {
            this.model.currentItems.forEach((currentItem) => {
                if (newItem.Id === currentItem.Id) {

                    if (newItem.Bundle) {
                        newItem.Components.forEach((newComponent) => {
                            currentItem.Components.forEach((currentComponent) => {
                                if (newComponent.Id === currentComponent.Id) {
                                    // Check item that is new and never was set
                                    if (!newComponent.Diagnosis.filter((item) => item).length) {
                                        newComponent.Diagnosis = angular.copy(currentComponent.Diagnosis);
                                        newComponent.LengthOfNeed = angular.copy(currentComponent.LengthOfNeed);
                                    }
                                }
                            });
                        });

                    // if not generic item or generic item with the same Hcpcs Code
                    } else if (!newItem.isAny || (newItem.isAny && newItem.HcpcsCode.Id === currentItem.Code)) {
                        // Check item that is new and never was set
                        if (!newItem.Diagnosis.filter((item) => item).length) {
                            newItem.Diagnosis = angular.copy(currentItem.Diagnosis);
                            newItem.LengthOfNeed = angular.copy(currentItem.LengthOfNeed);
                        }
                    }

                }
            });
        });
    }

    getEffectiveDate() {
        if (this.model.hasReferringProvider) {
            return this.model.effectiveDate;
        }

        return null;
    }
}

