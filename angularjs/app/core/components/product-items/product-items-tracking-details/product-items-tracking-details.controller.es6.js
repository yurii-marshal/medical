import { shippoDeliveryStatuses } from '../../../constants/shippo.constants.es6';

export default class productItemsTrackingDetailsCtrl {
    constructor(
        $mdDialog,
        $q,
        ngToast,
        bsLoadingOverlayService,
        shippoService,
        item
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$q = $q;
        this.bsLoadingOverlayService = bsLoadingOverlayService;

        this.shippoService = shippoService;
        this.ngToast = ngToast;

        this.item = item;

        this.trackingDetailsAvailable = null;
        this.trackingDetails = null;
        this.trackingDetailsLoaded = false;

        this.statuses = shippoDeliveryStatuses;

        this.trackingSteps = [
            {
                ActiveIds: [this.statuses.Unknown, this.statuses.InTransit, this.statuses.Delivered],
                Name: 'Pending',
                isActive: false
            },
            {
                ActiveIds: [this.statuses.InTransit, this.statuses.Delivered],
                Name: 'In Transit',
                isActive: false
            },
            {
                ActiveIds: [this.statuses.Delivered],
                Name: 'Delivered',
                isActive: false
            }
        ];

        this._activate();
    }

    isFail() {
        return this.trackingDetails.Status.Status.Id.toString() === this.statuses.Failure || this.trackingDetails.Status.Status.Id.toString() === this.statuses.Returned;
    }

    _setStatusColor(item) {
        switch (item.Status.Id) {
            case this.statuses.Delivered:
                item.statusClass = 'green';
                break;
            case this.statuses.Failure:
                item.statusClass = 'red';
                break;
            case this.statuses.InTransit:
                item.statusClass = 'blue';
                break;
            case this.statuses.Unknown:
                item.statusClass = 'gray';
                break;
            case this.statuses.Returned:
                item.statusClass = 'gray';
                break;
            default :
                break;
        }
    }

    _setActiveStaps() {
        let lastNotFailStatus = this.trackingDetails.History.reverse().find((el) => {
            return [this.statuses.Unknown, this.statuses.InTransit, this.statuses.Delivered].indexOf(el.Status.Id) > -1;
        });

        if (lastNotFailStatus) {
            this.trackingSteps.forEach((stap) => {
                if (stap.ActiveIds.indexOf(lastNotFailStatus.Status.Id) > -1) {
                    stap.isActive = true;
                }
            });
        }
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'modalOverlay' });

        this.shippoService.getTrackingDetails(this.item.TrackingNumber, this.item.Carrier)
            .then(((response) => {
                this.trackingDetailsLoaded = true;
                this.trackingDetails = response.data;

                this._setStatusColor(this.trackingDetails.Status);

                this.trackingDetails.History.forEach((item) => {
                    this._setStatusColor(item);
                });

                this.trackingDetailsAvailable = !!response.data;

                this._setActiveStaps();
            }))
            .finally(() => {
                this.bsLoadingOverlayService.stop({ referenceId: 'modalOverlay' });
            })
            .catch((response) => {

                if (response.status === 417) {
                    try {
                        this.ngToast.danger(JSON.parse(response.data[0].Message).detail);
                    } catch (e) {
                        this.ngToast.danger('Something wrong');
                    }
                }
                this.trackingDetailsAvailable = false;
            });
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
