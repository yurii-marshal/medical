export default class patientCollectPaymentController {
    constructor($state, $mdDialog, $timeout, ngToast, bsLoadingOverlayService, $q, paymentsService, patientService, invoicesService, orderDocumentsService) {
        'ngInject';

        this.$state = $state;
        this.$mdDialog = $mdDialog;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.$q = $q;
        this.paymentsService = paymentsService;
        this.patientService = patientService;
        this.invoicesService = invoicesService;

        this.patientId = $state.params.patientId;

        this.paymentMethodsDictionary = paymentsService.getCollectMethodsDictionary();
        this.patientSavedCards = [];
        this.shortInfo = {};
        this.Note = '';
        this.Reference = '';
        this.Receipt = {};
        this.SaveThisCardOnFile = false;

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });

        let promises = [
            this.patientService.getBillingProviderInfo(this.patientId),
            this.patientService.getCreditCardOptions(),
            this.invoicesService.getAmountsByPatientId(this.patientId)
        ];

        this.$q.all(promises)
            .then((response) => {
                this.billingProvider = response[0].data;
                this.cardOptions = response[1].data;
                this.Balance = response[2].data.Balance;

                if (!this.cardOptions.PushableKey) {
                    this.ngToast.error(`Can't find "PushableKey" for Stripe account.`);
                    return;
                }

                if (!this.billingProvider.Id) {
                    this.ngToast.error(`Can't find Billing Provider Id for current Patient`);
                    return;
                }

                return this.patientService.getBillingProviderById(this.billingProvider.Id);
            })
            .then((response) => {
                this.billingProvider.StripeAccount = response.data.StripeAccount;

                if (!response.data.StripeAccount || !response.data.StripeAccount.AccountId) {
                    // err
                    this.ngToast.danger(`Billing Provider isn't connected to Stripe.`);
                    return;
                }
            })
            .finally(() => this._loadScript());
    }

    printPayment() {
        this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });
        this.paymentsService.printPayment(this.Receipt.Id)
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' }));
    }

    emailPayment() {
        this.$mdDialog.show({
            templateUrl: 'patients/views/modals/email-payment-modal.html',
            controller: emailPaymentModalController,
            controllerAs: '$ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                patientEmail: this.shortInfo.Email || ''
            }
        }).then((response) => {
            if (response) {
                this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });
                this.paymentsService.emailPayment(this.Receipt.Id, response)
                    .then(() => this.ngToast.success('Payment receipt was successfully sent to email'))
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' }));
            }
        });

        /* @ngInject */
        function emailPaymentModalController($mdDialog, patientEmail) {
            this.patientEmail = patientEmail;

            this.hide = function () {
                $mdDialog.hide(this.patientEmail);
            };

            this.cancel = function () {
                $mdDialog.cancel();
            };
        }
    }

    changedPaymentMethod(methodId) {
        switch (methodId) {
            case 1:
                this.savedCard = undefined;
                this._unmountStripeElems();
                break;

            case 2:
                this.savedCard = undefined;
                this._unmountStripeElems();
                break;

            case 3:
                this.savedCard = undefined;
                this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });
                this.$timeout(() => {
                    this._mountStripeElems();
                });
                break;

            case 4:
                this._unmountStripeElems();
                this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });

                this.paymentsService.getPatientCreditCards(this.patientId, this.billingProvider.Id)
                    .then(
                        (response) => {
                            this.patientSavedCards = response.data.Items;

                            if (!response.data.Items.length) {
                                this.ngToast.warning(`Patient doesn't have saved credit cards.`);
                            }
                        },
                        (response) => {
                            this.ngToast.danger(response.data);
                        }
                    )
                    .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' }));
                break;
        }
    }

    cancel() {
        this.$state.go('root.patient.demographics', {patientId: this.patientId});
    }

    submit() {
        if (this.Method === 3) {
            if (!this._isFormValid()) { return; }

            this._createStripeToken()
                .then((response) => {
                    if (!response || !response.token || !response.token.card || !response.token.id) { return; }

                    let Card = {
                        Type: response.token.card.brand,
                        Last4: response.token.card.last4
                    };
                    this._showConfirmModal(Card, response.token.id);
                });
        } else {
            if (this._isFormValid()) { this._showConfirmModal(this.savedCard); }
        }
    }

    _isFormValid() {
        if (this.collectForm.$invalid) {
            touchedErrorFields(this.collectForm);
        }

        return this.collectForm.$valid;
    }

    _showConfirmModal(Card, tokenId) {
        this.$mdDialog.show({
            templateUrl: 'patients/views/modals/confirm-payment-modal.html',
            controller: 'confirmPaymentModalController as $ctrl',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            locals: {
                shortInfo: this.shortInfo,
                Amount: this.Amount,
                Card
            }
        }).then(() => this._confirmPayment(tokenId));
    }

    _confirmPayment(stripeToken) {
        this.bsLoadingOverlayService.start({referenceId: 'collectOverlay'});
        this.paymentsService.collectPayment(this._getCollectModel(stripeToken))
            .then((response) => {
                if (!response || !response.data) {
                    return;
                }
                this.Receipt = response.data;
            })
            .catch((response) => {
                if (response.data && response.data.length) {
                    response.data.forEach((error) => this.ngToast.danger(error.Message));
                }
            })
            .finally(() => this.bsLoadingOverlayService.stop({referenceId: 'collectOverlay'}));
    }

    _getCollectModel(stripeToken) {
        let model = {
            Amount: this.Amount,
            Type: this.Method,
            Patient: {
                Id: this.patientId,
                Phone: this.shortInfo.HomePhone || this.shortInfo.Mobile || this.shortInfo.WorkPhone,
                Email: this.shortInfo.Email,
                Name: {
                    FirstName: this.shortInfo.Name.First,
                    LastName: this.shortInfo.Name.Last
                },
                DateOfBirth: this.shortInfo.DateOfBirthday,
                Gender: this.shortInfo.Gender.Id,
                Address: this.shortInfo.Address,
                Ssn: this.shortInfo.Ssn
            },
            Note: this.Note,
            BillingProviderId: this.billingProvider.Id
        };

        switch (this.Method) {
            case 1:
                return model;
                break;

            case 2:
                model.Check = {
                    Reference: this.Reference
                };
                return model;
                break;

            case 3:
                model.NewCreditCard = {
                    StripeToken: stripeToken,
                    SaveThisCardOnFile: this.SaveThisCardOnFile
                };
                return model;
                break;

            case 4:
                model.SavedCreditCard = {
                    CardId: this.savedCard.Id
                };
                return model;
                break;
        }
    }

    _loadScript() {
        let head = document.getElementsByTagName('head')[0];
        let script = document.createElement('script');

        script.type = 'text/javascript';
        script.src = 'https://js.stripe.com/v3/';

        script.onload = this._createStripeElems.bind(this);

        head.appendChild(script);
    }

    _unmountStripeElems() {
        this.stripeElements.forEach((elemObj) => {
            elemObj.element.unmount();
        });
    }

    _mountStripeElems() {
        this.stripeElements.forEach((elemObj) => {
            elemObj.element.mount(`#${elemObj.elementId}`);
        });
    }

    _createStripeElems() {
        let readyStripeElements = 0;
        this.stripe = Stripe(this.cardOptions.PushableKey);
        const elements = this.stripe.elements();
        const style = {
            base: {
                fontSize: '16px'
            }
        };
        this.stripeElements = [
            {
                element: elements.create('cardNumber', { style }),
                elementId: 'card-number',
                errorId: 'card-number-errors',
                hasError: false
            },
            {
                element: elements.create('cardExpiry', { style }),
                elementId: 'card-expiry',
                errorId: 'card-expiry-errors',
                hasError: false
            },
            {
                element: elements.create('cardCvc', {style}),
                elementId: 'card-cvc',
                errorId: 'card-cvc-errors',
                hasError: false
            }
        ];
        this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' });

        this.stripeElements.forEach((elemObj) => {
            elemObj.element.addEventListener('ready', () => checkElementsReady());
            elemObj.element.addEventListener('change', ({error}) => {
                const displayError = document.getElementById(elemObj.errorId);
                displayError.textContent = error ? error.message : '';
                elemObj.hasError = !!error;
            });
        });

        let checkElementsReady = () => {
            readyStripeElements++;
            if (readyStripeElements === this.stripeElements.length) {
                readyStripeElements = 0;
                this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' });
            }
        }
    }

    _createStripeToken() {
        this.bsLoadingOverlayService.start({ referenceId: 'collectOverlay' });
        return this.stripe.createToken(this.stripeElements[0].element, { name: this.NameOnCard })
            .then((response) => {
                if (response.error && response.error.message) {
                    this.ngToast.danger(response.error.message);
                }

                this.bsLoadingOverlayService.stop({ referenceId: 'collectOverlay' });
                return response;
            });
    }
}
