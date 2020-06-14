class prescriptionDetailsCtrl {
    constructor($mdDialog,
                $filter,
                $scope,
                bsLoadingOverlayService,
                prescriptionDetailsService,
                coreReferralCardsService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$filter = $filter;
        this.prescriptionDetailsService = prescriptionDetailsService;
        this.coreReferralCardsService = coreReferralCardsService;
        this.savePrescriptionReferral = {};
        this.saveEffectiveDate = null;
        this.isLocationsLoading = false;

        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.prescriptions = [];

        $scope.$watch(() => this.patient, () => {

            if (this.patient) {
                this.getPrescriptions(this.patient.Id);
            }

            this.saveEffectiveDate = this.effectiveDate;
            this.savePrescriptionReferral = this.prescriptionReferral;
        });

    }

    getReferrals(name) {
        return this.prescriptionDetailsService.getReferrals(name)
            .then((response) => response.data.Items);
    }

    onChangePrescriptionSwitcher() {
        if (!this.isPrescriptionActive) {
            this.prescription = {};
            this.prescriptionReferral = this.savePrescriptionReferral;
            this.effectiveDate = this.saveEffectiveDate;
        } else {
            this.saveEffectiveDate = this.effectiveDate;
            this.savePrescriptionReferral = this.prescriptionReferral;
            this.prescriptionForm.prescription.$setTouched();
        }
    }

    onChangePrescription() {
        let referralDisplayName = '';

        if (this.markRemovedPrescription) {
            this.markRemovedPrescription = false;
        }

        if (this.prescription.TreatingProvider.PhysicianName) {
            referralDisplayName = this.prescription.TreatingProvider.PhysicianName.FullName;
        } else {
            referralDisplayName = this.prescription.TreatingProvider.Practice;
        }

        this.prescriptionReferral = {
            Id: this.prescription.TreatingProvider.Id,
            Location: this.prescription.TreatingProvider.Location,
            displayName: referralDisplayName
        };

        this.effectiveDate = this.prescription.EffectiveDate;
    }

    getPrescriptions(patientId) {
        this.bsLoadingOverlayService.start({ referenceId: 'prescriptionSelection' });

        return this.prescriptionDetailsService.getPrescriptions(patientId)
            .then((response) => {
                this.prescriptions = response.data.Items.map((item) => {
                    item.EffectiveDate = moment(item.EffectiveDate).format('MM/DD/YYYY');
                    if (this.prescription.Id === item.Id) {
                        this.prescription = item;
                    }
                    return item;
                });
            })
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'prescriptionSelection' });
            });
    }

    addReferral($event) {
        let addReferralModal = function(referral) {
            this.$mdDialog.show({
                controller: 'addReferralModalController as $ctrl',
                templateUrl: 'core/views/templates/modals/addReferral.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                clickOutsideToClose: true,
                locals: {
                    referral,
                    reopenModal: (response) => addReferralModal.apply(this, [response]),
                    updateReferral: (response) => {
                        if (!response) {
                            return;
                        }
                        this.prescriptionReferral = response;
                        this.referralChanged(response);
                        this.prescriptionReferral.displayName = this.$filter('referralDisplayName')(response);
                    }
                }
            });
        };

        addReferralModal.apply(this);
    }

    referralChanged(referral) {
        if (referral && !referral.Location) {
            this.isLocationsLoading = true;
            this.coreReferralCardsService.getLocations(referral.Id)
                .then((response) => {
                    this.isLocationsLoading = false;
                    this.prescriptionReferral.Location = null;
                    this.prescriptionReferral.Locations = response.data;
                    if (this.prescriptionReferral.Locations.length === 1) {
                        this.prescriptionReferral.Location = this.prescriptionReferral.Locations[0];
                    }
                });
        }
    }

    changeReferralLocation() {
        this.$mdDialog.show({
            templateUrl: 'core/modals/change-referral-location/change-referral-location.html',
            controller: 'changeReferralLocationController as modal',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                referralId: this.prescriptionReferral.Id,
                locationsList: null
            }
        })
        .then((location) => {
            this.prescriptionReferral.Location = location;
        });
    }
}

class prescriptionDetailsService {
    constructor($http, $filter, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.$filter = $filter;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getReferrals(personFullName) {
        let params = {
            filter: personFullName,
            pageIndex: 0,
            pageSize: 100
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/dictionary`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.searchName = this.$filter('referralDisplayName')(item, true);
                    item.displayName = this.$filter('referralDisplayName')(item);
                });
                return response;
            });
    }

    getPrescriptions(patientId) {
        let params = {
            'filter.patientId': patientId,
            'paggination.pageSize': 100
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/prescriptions`, { params })
            .then((response) => {
                return response;
            });
    }
}

const prescriptionDetails = {
    bindings: {
        effectiveDate: '=',
        prescriptionReferral: '=',
        isReferralRequired: '=',
        prescription: '=',
        patient: '=',
        addPrescriptionSelect: '@',
        isPrescriptionActive: '=?',
        disablePrescriptionSelect: '=',
        markRemovedPrescription: '='
    },
    templateUrl: 'core/components/prescription-details/prescription-details.html',
    controller: prescriptionDetailsCtrl
};

angular.module('app.core')
    .component('prescriptionDetails', prescriptionDetails)
    .service('prescriptionDetailsService', prescriptionDetailsService);

