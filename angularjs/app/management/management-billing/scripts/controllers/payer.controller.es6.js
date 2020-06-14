import confirmModalTemplate from '../../components/modals/confirm-modal/confirm.html';
import ConfirmModalCtrl from '../../components/modals/confirm-modal/confirm.controller.es6';

export default class payerController {
    constructor(
        $scope,
        $state,
        bsLoadingOverlayService,
        payersService,
        $rootScope,
        $mdDialog,
        iframeUtils
    ) {
        'ngInject';

        this.$state = $state;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.payersService = payersService;

        this.$mdDialog = $mdDialog;

        this.enablePassUrl = false;

        this.saveModel = null;
        this.model = null;

        this.iframeUtils = iframeUtils;

        this.payersService.registerAfterSaveCallback('payers', this._saveModelState.bind(this));

        this.routerSuccessChangeSub = $rootScope.$on('$stateChangeSuccess', () => {
            setTimeout(() => {
                this._saveModelState();
            }, 100);
        });

        this.routerStartChangeSub = $rootScope.$on('$stateChangeStart', (evt, to, params) => {

            if (this.enablePassUrl ||
                _.isEqual(angular.toJson(this.saveModel), angular.toJson(this.model))
            ) {
                this.enablePassUrl = false;
                return ;
            }

            evt.preventDefault();

            this.$mdDialog.show({
                template: confirmModalTemplate,
                controller: ConfirmModalCtrl,
                controllerAs: '$ctrl',
                parent: angular.element(document.body),
                clickOutsideToClose: true,
                locals: {
                    text: 'Are you sure you want to leave this page? The changes you made will be lost.'
                }
            }).then((res) => {
                if (res.confirm) {

                    this.model.Restrictions = _.cloneDeep(this.saveModel.Restrictions);
                    this.model.Plans = _.cloneDeep(this.saveModel.Plans);
                    this.model.BillingOptions = _.cloneDeep(this.saveModel.BillingOptions);

                    this.enablePassUrl = true;

                    $state.go(to.name, params, { location: 'replace' } );
                }
            });

        });

        $scope.$on('$destroy', () => {
            this.routerStartChangeSub();
            this.routerSuccessChangeSub();
            this.payersService.removeAfterSaveCallback('payers');
        });

        this.Id = $state.params.id;
        this.isNew = this.Id.toLowerCase() === 'new';

        this.vm = {};

        this.tabs = [
            {
                'title': 'Details',
                'view': 'root.management.payer.details'
            },
            {
                'title': 'Billing',
                'view': 'root.management.payer.billing'
            },
            {
                'title': 'Rules',
                'view': 'root.management.payer.rules',
                'linkView': 'root.management.payer.rules.prescription'
            }
        ];

        this._activate();
        $scope.$on('$stateChangeSuccess', (_) => this._checkState());
        this._checkState();
    }

    _checkState() {
        if (this.$state.is('root.management.payer')) {
            this.$state.go('root.management.payer.details');
        }
    }

    _saveModelState() {
        this.model = this.payersService.getModel();
        this.saveModel = _.cloneDeep(this.model);
    }

    _activate() {
        if (this.Id) {
            if (this.isNew) {   // creating new with data from service
                let newModel = this.payersService.getModel();
                if (!newModel.Name) {   // if page was refreshed
                    this.$state.go('root.management.billing.payers');
                    return;
                }

                this._setRulesData();

                newModel.isNew = this.isNew;
                this.vm = newModel;
            } else {                    // edit existing payer
                this.payersService.setDefaultModel();
                this._setPayerDataById(this.Id);
            }
        } else {
            this.$state.go('root.management.billing.payers');
        }
    }

    _setPayerDataById(id) {
        this.bsLoadingOverlayService.start({ referenceId: 'payerPage' });
        this.payersService.getPayer(id)
            .then((response) => {
                this.payersService.setModel(response.data);
                this.vm = this.payersService.getModel();
                this._setRulesData(true);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'payerPage' }));
    }

    _setRulesData(isEditMode) {
        let model = this.payersService.getModel();

        if (isEditMode) {
            model.fieldRules.payerNameDisabled = true;
            model.fieldRules.payerIdDisabled = true;
            model.fieldRules.acceptElectronicClaims = model.BillingOptions.Method===1;
            model.fieldRules.supportElectronicEligibility = !!model.EligibilityCode;
        } else {
            model.fieldRules.payerNameDisabled = model.PreselectedPayerName;
            model.fieldRules.payerIdDisabled = model.PreselectedClaimCode;
            model.fieldRules.acceptElectronicClaims = model.PreselectedPayerName && model.PreselectedClaimCode;
            model.fieldRules.supportElectronicEligibility = model.PreselectedPayerName && !!model.EligibilityCode;

            if (!model.BillingOptions.Method) {
                model.BillingOptions.Method = (model.PreselectedPayerName && model.PreselectedClaimCode ? 1 : 2);
            }
        }
        setTimeout(() => {
            this._saveModelState();
        }, 100);
    }
}
