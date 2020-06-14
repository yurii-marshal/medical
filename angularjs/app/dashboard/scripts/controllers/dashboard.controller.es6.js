import {
    billingPermissionsConstants,
    permissionsCategoriesConstants
} from '../../../core/constants/permissions.constants.es6';

export default class dashboardController {
    constructor(currentUser,
                $scope,
                $state,
                $timeout,
                dashboardService,
                profileService,
                $q,
                userPermissions
    ) {
        'ngInject';

        this.$q = $q;
        this.$state = $state;
        this.$timeout = $timeout;
        this.profileService = profileService;
        this.dashboardService = dashboardService;
        this.userPermissions = userPermissions;

        this.permissionsCategoriesConstants = permissionsCategoriesConstants;
        this.billingPermissionsConstants = billingPermissionsConstants;

        this.counters = {
            NewPatients: { isLoaded: false, value: '' },
            NewOrders: { isLoaded: false, value: '' },
            NewInvoces: { isLoaded: false, value: '' },
            Tasks: { isLoaded: false, value: '' }
        };
        this.statPatients = [];
        this.statPatientsCategories = [];
        this.statPayers = [];
        this.statPhysicians = [];
        this.quickSearchText = '';
        this.currentUser = currentUser;

        this.profile = profileService.getProfile();
        this.profileId = null;

        this.urlsList = [
            {
                name: 'cms.gov',
                url: 'https://www.medicare.gov/rss-feeds'
            },
            // {
            //     name: 'cnn.com',
            //     url: 'http://rss.cnn.com/rss/edition.rss'
            // },
            {
                name: 'homecaremag.com',
                url: 'http://www.homecaremag.com/news/feed'
            }
        ];

        const $this = this;

        this.patientChart = {
            options: {
                chart: {
                    type: 'areaspline',
                    plotBorderWidth: 0
                },
                tooltip: {
                    formatter: function() {
                        return `<span style="font-size: 11px;">
                                    ${$this.statPatientsCategories[this.x]}:
                                </span>
                                <br>
                                <span>${this.y} New Patients</span>`;
                    },
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            legend: {
                enabled: false,
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 10,
                floating: true,
                backgroundColor: '#FFFFFF',
                symbolWidth: 19,
                symbolHeight: 19,
                symbolRadius: 0,
                symbolPadding: 9,
                useHTML: true,
                itemStyle: {
                    fontSize: '11px',
                    fontWeight: 'normal',
                    color: '#606060',
                    fontFamily: '"Roboto", sans-serif'
                }
            },
            plotOptions: {
                series: {
                    fillOpacity: 1,
                    lineWidth: 3,
                    marker: {
                        lineWidth: 2,
                        radius: 8,
                        symbol: 'circle'
                    }
                }
            },
            series: [
                {
                    name: 'Year: 2017',
                    data: $this.statPatients,
                    color: '#06aed5',
                    fillColor: {
                        linearGradient: [0, 0, 0, 370],
                        stops: [
                            [0, 'rgba(6,174,213,1)'],
                            [1, 'rgba(255,255,255,0)']
                        ]
                    },
                    fillOpacity: 0.3,
                    stickyTracking: false
                }
            ],
            xAxis: {
                labels: {
                    formatter: function() {
                        return $this.statPatientsCategories[this.value];
                    }
                },
                startOnTick: false,
                endOnTick: false,
                minPadding: 0.02,
                maxPadding: 0.02
            },
            yAxis: {
                maxPadding: 0.3,
                allowDecimals: false
            }
        };

        this.physiciansChart = {
            options: {
                chart: {
                    type: 'column',
                    plotBorderWidth: 0
                },
                tooltip: {
                    backgroundColor: 'rgba(255,255,255,1)',
                    useHTML: true,
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillOpacity: 1,
                    borderWidth: 2
                }
            },
            series: [{
                name: 'Orders',
                data: $this.statPhysicians
            }],
            xAxis: {
                tickWidth: 0,
                labels: {
                    useHTML: true,
                    formatter: function() {
                        let name = $this.statPhysicians[this.value].name,
                            template = '';

                        name.split(/\s(.+)/).forEach((item) => {
                            if (item) {
                                template += `<span class="center-text ellipsis" title="${name}">${item}</span>`;
                            }
                        });
                        return template;
                    }
                }
            },
            yAxis: {
                maxPadding: 0.15,
                allowDecimals: false
            }
        };

        this.payersChart = {
            options: {
                chart: {
                    type: 'pie',
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false
                },
                tooltip: {
                    formatter: function() {
                        return `<span style="font-size: 11px;">
                                    ${this.point.name}:
                                </span>
                                <br>
                                <span>${this.series.name}: <b>${Math.round(this.percentage)} %</b></span>`;
                    },
                    style: {
                        padding: 10
                    }
                }
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                x: 0,
                y: 0,
                itemMarginTop: 5,
                itemMarginBottom: 5,
                backgroundColor: '#FFFFFF',
                symbolWidth: 19,
                symbolHeight: 19,
                symbolRadius: 0,
                symbolPadding: 4,
                useHTML: true,
                itemStyle: {
                    fontSize: '11px',
                    fontWeight: 'normal',
                    color: '#606060',
                    fontFamily: '"Roboto", sans-serif'
                },
                labelFormatter: function() {
                    return `<span class="graphic-percents">${Math.round(this.percentage)}%</span>
                            <span title="${this.name}">
                                ${(this.name.length>35 ? `${this.name.slice(0, 35)}...` : this.name)}
                            </span>`;
                }
            },
            plotOptions: {
                pie: {
                    borderWidth: 2,
                    innerSize: '35%',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    point: {
                        events: {
                            legendItemClick: function() {
                                return false; // <== returning false will cancel the default action
                            }
                        }
                    }
                }
            },
            series: [{
                name: 'Rating',
                colorByPoint: true,
                data: $this.statPayers
            }]
        };

        // redirect on "/"
        $scope.$on('$stateChangeSuccess', () => {
            if ($state.is('root.dashboard')) {
                $state.go('root.dashboard.index');
            }
        });

        $scope.$watch(() => profileService.getProfile(), (newValue) => {
            if (this.profileId) {
                return;
            }
            if (newValue && newValue.Id) {
                this.profileId = newValue.Id;
                this._activate();
            }
        }, true);

    }

    _activate() {

        let promises = [];

        this.dashboardService.getCounters(this.profileId)
            .then((responses) => {
                this.counters.NewPatients = { value: responses[0].data, isLoaded: true };
                this.counters.NewOrders = { value: responses[1].data, isLoaded: true };
                this.counters.NewInvoces = { value: responses[2].data, isLoaded: true };
                this.counters.Tasks = { value: responses[3].data.Count, isLoaded: true };
            });

        promises.push(this.dashboardService.getStatNewPatients());
        promises.push(this.dashboardService.getStatPayrs());
        promises.push(this.dashboardService.getStatPhysicians());

        this.$q.all(promises).then((res) => {

            // getStatNewPatients
            res[0].data = _.sortBy(res[0].data, [(o) => moment.utc(o.Date).format('YYYY DD MM')]);

            angular.forEach(res[0].data, (item) => {
                this.statPatientsCategories.push(moment.utc(item.Date).format('MMMM YYYY'));
                this.statPatients.push(item.NumberOfNewPatients);
            });

            // getStatPayrs
            angular.forEach(res[1].data, (item) => {
                if (item && item.NumberOfPatientInsurances) {
                    this.statPayers.push({
                        id: item.Id || '',
                        name: item.Name || '',
                        y: item.NumberOfPatientInsurances
                    });
                }
            });

            // getStatPhysicians
            angular.forEach(res[2].data, (item, index) => {
                if (item && item.NumberOfReferrals) {
                    this.statPhysicians.push({
                        id: item.Id || '',
                        y: item.NumberOfReferrals,
                        name: item.Name && item.Name.FullName || item.Practice,
                        color: (index % 2) ? '#06aed5' : '#2a3f54'
                    });
                }
            });

        });
    }

    getQuickSearchItems(text) {
        return this.dashboardService.quickSearch(text)
            .then((response) => response.data);
    }

    openPatient(patientId) {
        // Bug on fast select - md-autocomplite doesn't clear on destroy blocker classes.
        this.$timeout(() => {
            this.$state.go('root.patient.demographics', { patientId });
        }, 100);
    }


}
