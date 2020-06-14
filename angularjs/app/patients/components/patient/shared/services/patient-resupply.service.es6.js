export default class PatientResupplyService {
    constructor(
        $mdDialog,
        $http,
        $q,
        WEB_API_SERVICE_URI,
        WEB_API_INVENTORY_SERVICE_URI,
        ordersService,
        coreOrderService
    ) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.$http = $http;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.ordersService = ordersService;
        this.coreOrderService = coreOrderService;

        this.model = {};

        this.dictionaries = {
            orderStatuses: [],
            periods: []
        };
    }

    getPeriodDaysByType(typeId) {
        let periodDays = 1;

        switch (typeId) {
            case 2:
                periodDays = 7;
                break;

            case 3:
                periodDays = 30;
                break;

            default:
                break;
        }

        return periodDays;
    }

    getMaxFrequency(item) {
        if (!item.Frequency.PeriodValue ||
            !item.Frequency.PeriodType
        ) {
            return null;
        }

        const periodDays = this.getPeriodDaysByType(+item.Frequency.PeriodType.Id);

        return item.Frequency.PeriodValue * periodDays;
    }

    calcItemPerDay(item) {
        let deviceCount = item.Frequency ? item.Frequency.Quantity : null;

        if (!deviceCount ||
            !item.Frequency.Frequency ||
            !item.Frequency.PeriodValue ||
            !item.Frequency.PeriodType
        ) {
            return null;
        }

        const periodDays = this.getPeriodDaysByType(+item.Frequency.PeriodType.Id);

        return (item.Frequency.Frequency * deviceCount) / (periodDays * item.Frequency.PeriodValue);
    }

    _calcDaysPerItem(item) {

        let deviceCount = item.Frequency ? item.Frequency.Quantity : null;

        if (!deviceCount ||
            !item.Frequency.Frequency ||
            !item.Frequency.PeriodValue ||
            !item.Frequency.PeriodType
        ) {
            return null;
        }

        const periodDays = this.getPeriodDaysByType(+item.Frequency.PeriodType.Id);

        return (periodDays * item.Frequency.PeriodValue) / item.Frequency.Frequency;
    }

    calcNextSchedule(item, onlyNew = false) {

        if (!item.IsNew && onlyNew) {
            return ;
        }

        const daysPerItem = this._calcDaysPerItem(item) || 0;
        let momentNextScheduledDate;

        if (item.RecentDeliveryDate) {
            momentNextScheduledDate = moment(item.RecentDeliveryDate).add(daysPerItem, 'd');
        } else {
            momentNextScheduledDate = moment().add(daysPerItem, 'd');
        }

        if (momentNextScheduledDate.startOf('day').diff(moment().startOf('day'), 'd') > 0 ) {
            item.NextScheduledDate = momentNextScheduledDate.format('MM/DD/YYYY');
        } else {
            item.NextScheduledDate = moment().format('MM/DD/YYYY');
        }
    }

    getResupplyPeriodsDictionary() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/resupply-programs/periods/dictionary`, { cache: true })
            .then((response) => {
                this.dictionaries.periods = response.data;
                return response;
            });
    }

    getOrdersStatuses() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/statuses/dictionary`, { cache: true })
            .then((response) => {
                this.dictionaries.orderStatuses = response.data;
                return response;
            });
    }

    getResupplyOrder(orderId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/resupply-orders/${orderId}`)
            .then((response) => {
                this.model = this.ordersService.getModel();
                angular.extend(this.model, response.data);

                if (this.model.Tags.length) {
                    this.model.Tags.map((i) => i.attrClass = this.ordersService.getAttrClass(i.Name));
                }
            });
    }

    getResupplyProgramByPatientId(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/resupply-programs`)
            .then((response) => {
                const periodTypes = {
                    'Day': '1',
                    'Week': '2',
                    'Month': '3'
                };

                if (response.data.Items) {
                    response.data.Items.forEach((item) => {
                        item.Frequency.PeriodType.Id = periodTypes[item.Frequency.PeriodType.Id];
                    });
                }

                if (response.data.ResupplyRules) {
                    response.data.ResupplyRules.forEach((item) => {
                        item.PeriodType.Id = periodTypes[item.PeriodType.Id];
                    });
                }

                return response;
            });
    }

    getPatientResupplyProgram(patientId) {
        return this.getResupplyProgramByPatientId(patientId)
            .then((response) => {

                if (response.data) {

                    if (!response.data.Items) {
                        response.data.Items = [];
                    }

                    response.data.Items.map((item) => {
                        item.InitialNextEligibleDate = moment(item.NextEligibleDate).format('MM/DD/YYYY');
                        item.NextEligibleDate = moment(item.NextEligibleDate).format('MM/DD/YYYY');
                        if (item.Components && item.Components.length) {
                            angular.forEach(item.Components, (component) => {
                                if (component.HcpcsCodes && component.HcpcsCodes.length === 1) {
                                    component.HcpcsCodes = component.HcpcsCodes[0].split('|');
                                }
                            });
                        }
                    });
                }

                return response;
            });
    }

    getResupplyOrdersHistory(params) {
        return this.coreOrderService.getOrdersDictionary(params)
            .then((response) => {
                response.data.Items.map((item) => {

                    item.InitialNextEligibleDate = moment(item.EligibleDeliveryDate).format('MM/DD/YYYY');
                    item.NextEligibleDate = moment(item.EligibleDeliveryDate).format('MM/DD/YYYY');

                    item.StatusText = getDictionaryText(item.State.Status.Id, this.dictionaries.orderStatuses);
                    item.StatusClass = getStatusClass(item.State.Status.Id);
                });
                return response;
            });

        function getDictionaryText(itemId, dictionary) {
            let result = '-';

            if (!itemId) {
                return result;
            }

            angular.forEach(dictionary, (item) => {
                if (Number(item.Id) === Number(itemId)) {
                    result = item.Text;
                    return result;
                }
            });
            return result;
        }

        function getStatusClass(orderStatusId) {
            switch (orderStatusId.toString()) {
                case '1': // hold
                    return 'orange';
                    break;
                case '2': // ready
                    return 'green';
                    break;
                case '3': // incomplete
                    return 'blue';
                    break;
                case '4': // cancelled
                    return 'gray';
                    break;
                case '5': // complete
                    return 'dark-gray';
                    break;
                default:
                    break;
            }
        }
    }

    getResupplyFrequency(patientId, hcpcsCode) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/resupply/${hcpcsCode}/frequency`);
    }

    addResupplyProgram(orderId, model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${orderId}/resupply-program`, this._mapSaveModel(model));
    }

    updateResupplyProgram(patientId, model) {
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/resupply-programs`, this._mapSaveModel(model));
    }

    _mapSaveModel(model) {
        let newModel = {
            Items: model.Items,
            ConfirmationRequired: model.ConfirmationRequired
        };

        if (model.groupItemsForDelivery) {
            newModel.DeliveryGroupingDays = model.DeliveryGroupingDays;
            newModel.ResupplyReplaceBundleItems = model.ResupplyReplaceBundleItems;
        }

        newModel.Items = newModel.Items.map((item) => {
            return {
                ProductId: item.Product.Id,
                Count: +item.Frequency.Quantity,
                Frequency: +item.Frequency.Frequency,
                PeriodValue: +item.Frequency.PeriodValue,
                PeriodType: +item.Frequency.PeriodType.Id,
                NextScheduledDate: moment(item.NextScheduledDate).format('YYYY-MM-DD'),
                RecentDeliveryDate: item.RecentDeliveryDate || null,
                Hold: item.Hold
            };
        });

        return newModel;
    }

    getPeriodFullValue(periodId, periodValue, itemsList = this.dictionaries.periods) {
        let result = '-';

        angular.forEach(itemsList, (item) => {
            if (item.Id === periodId) {
                result = `${periodValue} ${item.Text}(s)`;
            }
        });

        return result;
    }

    appendTrackingItems(orderId, patientId, Items) {
        let Products;

        Products = Items.map((item) => {
            return {
                ProductId: item.ProductId || item.Id,
                Count: item.Count
            };
        });
        return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/orders/${orderId}/tracking/append`, { Products });
    }

    getRecentDateByHcpcsCodes(patientId, hcpcsCodes) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/resupply-programs/items/recent-dates`, hcpcsCodes);
    }

    // Check is items frequency delivery less then payer rules or eq
    checkItemsByRules(items, resupplyRules) {
        let isValidAllItems = true;

        if (resupplyRules) {

            items.forEach((item) => {
                resupplyRules.forEach((ruleItem) => {
                    let result = _.intersection(item.Product.HcpcsCodes, ruleItem.HcpcsCodes);

                    if ((result.length || ruleItem.All) && isValidAllItems) {
                        isValidAllItems = this.calcItemPerDay(item) <= this.calcItemPerDay({ 'Frequency': ruleItem });
                    }
                });

            });
        }

        return isValidAllItems;
    }

    // Fetch recent dates. Calculated and set Eligible/Schedule date based on recent date
    setUpProgramDates(items, patientId) {

        const hcpcsCodes = items
            .map((item) => item.Product.HcpcsCodes[0])
            .filter((item) => !!item);

        if (hcpcsCodes.length) {
            this.getRecentDateByHcpcsCodes(patientId, {
                'HcpcsCodes': hcpcsCodes
            }).then((recentResponse) => {

                items.map((item) => {

                    const recent = recentResponse.data.Items.find((recentItem) => {
                        return recentItem.HcpcsCode === item.Product.HcpcsCodes[0];
                    });

                    if (recent) {
                        item.RecentDeliveryDate = recent.RecentDate;
                    }

                    this.calcNextSchedule(item, true);

                    if (!item.NextScheduledDate &&
                        item.NextEligibleDate) {

                        item.NextScheduledDate = item.NextEligibleDate;
                    }

                    if (item.NextScheduledDate &&
                        item.RecentDeliveryDate &&
                        !item.NextEligibleDate) {

                        item.NextEligibleDate = item.NextScheduledDate;
                    }

                    return item;
                });
            });
        }

        return items;
    }

    getImage(item) {
        let defer = this.$q.defer();

        let noImage = 'assets/images/colored/no-image-white.svg';

        item.image = noImage;

        if (!item.ImageAccessToken) {
            defer.resolve(noImage);
            return defer.promise;
        }

        this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${item.ProductId || item.Id}/picture/${item.ImageAccessToken}`, { cache: true })
            .then((response) => defer.resolve((response.data) ? `data:image/jpeg;base64,${response.data}` : noImage))
            .catch(() => defer.resolve(noImage));

        return defer.promise;
    }

    getRestriction(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/primary/restrictions`);
    }

}
