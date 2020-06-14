export default class statisticsController {
    constructor() {
        'ngInject';

        var stat = this;

        stat.chartNewOrders = [];
        stat.chartNewOrdersCategories = [];

        stat.chartNewPatients = [];
        stat.chartNewPatientsCategories = [];

        stat.chartAccountReceivable = [];
        stat.chartAccountReceivableCategories = [];

        // delete mock data after adding BL
        stat.mockChartNewOrders = [
            {
                Date: moment().month(0),
                NumberOfNewOrders: 40
            },
            {
                Date: moment().month(1),
                NumberOfNewOrders: 30
            },
            {
                Date: moment().month(2),
                NumberOfNewOrders: 50
            },
            {
                Date: moment().month(3),
                NumberOfNewOrders: 20
            },
            {
                Date: moment().month(4),
                NumberOfNewOrders: 40
            },
            {
                Date: moment().month(5),
                NumberOfNewOrders: 50
            },
            {
                Date: moment().month(6),
                NumberOfNewOrders: 30
            },
            {
                Date: moment().month(7),
                NumberOfNewOrders: 10
            },
            {
                Date: moment().month(8),
                NumberOfNewOrders: 60
            },
            {
                Date: moment().month(9),
                NumberOfNewOrders: 30
            },
            {
                Date: moment().month(10),
                NumberOfNewOrders: 50
            },
            {
                Date: moment().month(11),
                NumberOfNewOrders: 20
            }
        ];
        stat.mockChartNewPatients = [
            {
                Date: moment().month(0),
                NumberOfNewPatients: 20
            },
            {
                Date: moment().month(1),
                NumberOfNewPatients: 50
            },
            {
                Date: moment().month(2),
                NumberOfNewPatients: 30
            },
            {
                Date: moment().month(3),
                NumberOfNewPatients: 60
            },
            {
                Date: moment().month(4),
                NumberOfNewPatients: 10
            },
            {
                Date: moment().month(5),
                NumberOfNewPatients: 30
            },
            {
                Date: moment().month(6),
                NumberOfNewPatients: 50
            },
            {
                Date: moment().month(7),
                NumberOfNewPatients: 40
            },
            {
                Date: moment().month(8),
                NumberOfNewPatients: 20
            },
            {
                Date: moment().month(9),
                NumberOfNewPatients: 50
            },
            {
                Date: moment().month(10),
                NumberOfNewPatients: 30
            },
            {
                Date: moment().month(11),
                NumberOfNewPatients: 40
            }
        ];
        stat.mockChartAccountReceivable = [
            {
                Date: moment().month(0),
                Amount: 5000
            },
            {
                Date: moment().month(1),
                Amount: 6000
            },
            {
                Date: moment().month(2),
                Amount: 5000
            },
            {
                Date: moment().month(3),
                Amount: 7000
            },
            {
                Date: moment().month(4),
                Amount: 4000
            },
            {
                Date: moment().month(5),
                Amount: 7000
            },
            {
                Date: moment().month(6),
                Amount: 6000
            },
            {
                Date: moment().month(7),
                Amount: 5000
            },
            {
                Date: moment().month(8),
                Amount: 7000
            },
            {
                Date: moment().month(9),
                Amount: 5000
            },
            {
                Date: moment().month(10),
                Amount: 6000
            },
            {
                Date: moment().month(11),
                Amount: 7000
            }
        ];

        function activate() {
            angular.forEach(stat.mockChartNewOrders, function (item) {
                stat.chartNewOrdersCategories.push(moment.utc(item.Date).format('MMMM'));
                stat.chartNewOrders.push(item.NumberOfNewOrders);
            });

            angular.forEach(stat.mockChartNewPatients, function (item) {
                stat.chartNewPatientsCategories.push(moment.utc(item.Date).format('MMMM'));
                stat.chartNewPatients.push(item.NumberOfNewPatients);
            });

            angular.forEach(stat.mockChartAccountReceivable, function (item) {
                stat.chartAccountReceivableCategories.push(moment.utc(item.Date).format('MMMM'));
                stat.chartAccountReceivable.push(item.Amount);
            });
        }

        stat.newOrdersChart = {
            options: {
                chart: {
                    type: 'areaspline',
                    plotBorderWidth: 0
                },
                tooltip: {
                    formatter: function() {
                        return '<span style="font-size: 11px;">' + stat.chartNewOrdersCategories[this.x] + ':</span><br><span>' + this.y + ' New Orders</span>';
                    },
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
                    data: stat.chartNewOrders,
                    color: '#2a3f54',
                    fillColor: {
                        linearGradient: [0, 0, 0, 350],
                        stops: [
                            [0, 'rgba(42,63,84,1)'],
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
                        return stat.chartNewOrdersCategories[this.value];
                    }
                },
                startOnTick: false,
                endOnTick: false,
                minPadding: 0.02,
                maxPadding: 0.02
            },
            yAxis: {
                maxPadding: 0.2
            }
        };

        stat.newPatientsChart = {
            options: {
                chart: {
                    type: 'areaspline',
                    plotBorderWidth: 0
                },
                tooltip: {
                    formatter: function() {
                        return '<span style="font-size: 11px;">' + stat.chartNewPatientsCategories[this.x] + ':</span><br><span>' + this.y + ' New Patients</span>';
                    },
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
                    data: stat.chartNewPatients,
                    color: '#6dc85e',
                    fillColor: {
                        linearGradient: [0, 0, 0, 350],
                        stops: [
                            [0, 'rgba(109,200,94,1)'],
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
                        return stat.chartNewPatientsCategories[this.value];
                    }
                },
                startOnTick: false,
                endOnTick: false,
                minPadding: 0.02,
                maxPadding: 0.02
            },
            yAxis: {
                maxPadding: 0.2
            }
        };

        stat.accountReceivableChart = {
            options: {
                chart: {
                    type: 'areaspline',
                    plotBorderWidth: 0,
                    marginTop: 25
                },
                tooltip: {
                    formatter: function() {
                        return '<span style="font-size: 11px;">' + stat.chartAccountReceivableCategories[this.x] + ':</span><br><span>Received: $ ' + this.y + '</span>';
                    },
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
                    data: stat.chartAccountReceivable,
                    color: '#06aed5',
                    fillColor: {
                        linearGradient: [0, 0, 0, 350],
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
                        return stat.chartAccountReceivableCategories[this.value];
                    }
                },
                startOnTick: false,
                endOnTick: false,
                minPadding: 0.02,
                maxPadding: 0.02
            },
            yAxis: {
                tickInterval: 1000,
                labels: {
                    step: 0.5,
                    formatter: function() {
                        return this.value;
                    }
                },
                title: {
                    align: 'high',
                    offset: -5,
                    text: '$',
                    rotation: 0,
                    y: -15,
                    style: {
                        color: "#606060",
                        fontWeight: 'bold'
                    }
                },
                maxPadding: 0.2
            }
        };

        activate();
    }
}