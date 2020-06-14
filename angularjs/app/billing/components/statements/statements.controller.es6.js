import { statementsGenerationStatusConstants } from '../../../core/constants/core.constants.es6.js';

export default class statementsController {
    constructor(
        ngToast,
        $interval,
        bsLoadingOverlayService,
        infinityTableService,
        statementsService,
        $stateParams,
        claimsStatementsService,
        patientStatementsService
    ) {
        'ngInject';

        this.ngToast = ngToast;
        this.$interval = $interval;
        this.infinityTableService = infinityTableService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.statementsService = statementsService;
        this.claimsStatementsService = claimsStatementsService;
        this.patientStatementsService = patientStatementsService;

        this.generationStatuses = statementsGenerationStatusConstants;

        this.getTotalPatients = () => infinityTableService.getTotalCount();
        this.getSelectedItemsCount = () => infinityTableService.getSelectedItemsCount();
        this.getSelectedAllValue = () => infinityTableService.getSelectedAllValue();
        this.getSelectedItems = () => infinityTableService.getSelectedItems();
        this.toggleItem = (item) => infinityTableService.toggleItem(item);
        this.selectAllFn = () => infinityTableService.selectAllFn();

        this.agesDictionary = [];

        this.isLoading = false;
        this.isProgressShow = false;
        this.generationStatus = null;
        this.result = null;

        this.sortExpr = {};
        this.filterObj = {
            'FullName': $stateParams.filterByName || '',
            'Dob': null,
            'FullAddress': '',
            'Balance': undefined,
            'BalanceGreaterThan': undefined
        };

        this.applyFilters = {
            'BalanceGreaterThan': undefined,
            'Age': undefined
        };

        this._activate();
    }

    _activate() {
        this.claimsStatementsService.getStatementsAges()
            .then((response) => this.agesDictionary = response.data);

        this.getStatements = (pageIndex, pageSize) => this.statementsService.getStatements(pageIndex, pageSize, this.sortExpr, this.filterObj);

        this._getStatusLoading();

        this._linkPromise = this.$interval(this._getStatusLoading.bind(this), 10000);
    }

    selectAllPatients() {
        this.infinityTableService.selectAllItems();
    }

    search() {
        if (this.form.$invalid) {
            touchedErrorFields(this.form);
            return;
        }
        angular.extend(this.filterObj, this.applyFilters);
    }

    resetFilters() {
        this.applyFilters = {
            'BalanceGreaterThan': undefined,
            'Age': undefined
        };
        this.search();
    }

    generate() {
        let options = {};

        if (this.getSelectedAllValue()) {
            options.All = true;
            options.FullName = this.filterObj.FullName;
            options.Dob = this.filterObj.Dob ?
                moment.utc(this.filterObj.Dob, 'MM/DD/YYYY').format('YYYY-MM-DD') :
                undefined;
            options.FullAddress = this.filterObj.FullAddress;
            options.Balance = this.filterObj.Balance;

            options.BalanceGreaterThan = this.filterObj.BalanceGreaterThan;
            options.Age = this.filterObj.Age;

            this.isLoading = true;
            this.statementsService.getAllPatientIds(options)
                .then((res) => {
                    if (res.data.Items.length) {
                        const patientIds = res.data.Items.map((item) => item.Id);

                        this._generateStatements(patientIds);
                    }
                });
        } else {
            const patientIds = this.getSelectedItems().map((item) => item.Id);

            this._generateStatements(patientIds);
        }
    }

    _generateStatements(PatientIds) {
        this.isLoading = true;
        const params = {
            PatientIds
        };

        if (this.filterObj.Age) {
            params.Agging = this.filterObj.Age;
        }

        return this.patientStatementsService.generateStatements(params)
            .then((res) => {
                if (res.data) {
                    this._linkPromise = this.$interval(this._getStatusLoading.bind(this), 10000);
                    this._progressStatusHandling(res.data);
                }
            })
            .finally(() => this.isLoading = false);
    }

    _getStatusLoading() {
        return this.patientStatementsService.getStatementsStatus()
            .then((res) => {
                if (res.status === 204) {
                    this.isProgressShow = false;
                    this.result = undefined;
                    this.$interval.cancel(this._linkPromise);
                } else if (res.data) {
                    this._progressStatusHandling(res.data);
                    return res.data;
                }
            });
    }

    _progressStatusHandling(result) {
        this.result = result;
        this.generationStatus = this.result.Status.Id;

        if (this.generationStatus === this.generationStatuses.PROCESSING_STATUS_ID) {
            this.isProgressShow = true;
        } else if (this.generationStatus === this.generationStatuses.CANCELED_STATUS_ID ) {
            this.$interval.cancel(this._linkPromise);
            this.isProgressShow = false;
        } else if (this.generationStatus === this.generationStatuses.FAILED_STATUS_ID) {
            this.$interval.cancel(this._linkPromise);
            this.isProgressShow = false;
            this.ngToast.danger('Generation has failed!');
        }

        if (this.generationStatus === this.generationStatuses.PROCESSED_STATUS_ID) {
            this.$interval.cancel(this._linkPromise);
            this.isProgressShow = true;
        }
    }

    downloadStatements() {
        this.isLoading = true;
        this.statementsService.downloadStatements()
            .finally(() => this.isLoading = false);
    }

    cancelProcess() {
        this.$interval.cancel(this._linkPromise);
        // We recheck status. Because ui send request with interval 1 minute
        this._getStatusLoading()
            .then((data) => {
                if (data.Status.Id === this.generationStatuses.PROCESSING_STATUS_ID) {
                    this.patientStatementsService.statementGenerationCancel()
                        .then(() => {
                            this.isProgressShow = false;
                            this.result = undefined;
                            this.ngToast.danger('Statements generation was cancelled');
                        });
                } else {
                    this.ngToast.danger('Statements generation cannot canceled');
                }
            });

    }

    hideProgressBar() {
        this.statementsService.hideProgressBar();
        this.isProgressShow = false;
    }
}
