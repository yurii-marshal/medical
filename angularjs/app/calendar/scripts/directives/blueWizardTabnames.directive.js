(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("blueWizardTabnames", blueWizardTabnames);

    blueWizardTabnames.$inject = ["$timeout", "$state", "$compile"];

    function blueWizardTabnames($timeout, $state, $compile) {
        var directive = {
            restrict: "A",
            scope: {
                steps: "=",
                isActive: "&"
            },
            link: function (scope, elem, attr) {

                var compileTabnames = function() {

                    var steps = scope.steps;
                    var template = '<div class="wizard_flow_tabs-parent">' +
                        '<div class="wizard_flow_tabs">' +
                        '</div>' +
                        '</div>';
                    var templateArr = [];

                    // preparation to add isFinished property
                    for (var i = 0; i < steps.length; i++) {
                        if (steps[i].view === $state.current.name) {
                            for (var j = 0; j < steps[i].number - 1; j++) {
                                steps[j].isFinished = true;
                            }
                        }
                    }

                    for (var i = 0; i < steps.length; i++) {
                        if (!steps[i] || !steps[i].hidden) {
                            templateArr.push(
                                '<a href="javascript:void(0);" ' +
                                'class="wizard_flow_link" ' +
                                'ng-class="{\'active\': ' + steps[i].isActive() + ', \'finished\': ' + steps[i].isFinished + '}" ' +
                                'ui-sref="root.' + steps[i].view + '">' +
                                steps[i].title +
                                '</a>'
                            )
                        }
                    }

                    elem.append(template);
                    $('.wizard_flow_tabs').append(templateArr.join(''));

                    $compile(elem)(scope);

                    $timeout(function(){

                        var tabposition = 0;

                        var links = $(elem).find('.wizard_flow_link');
                        var container = $(elem).find('.wizard_flow_tabs-parent');

                        links.each(function(){
                            var $this = $(this);
                            if ($this.hasClass('active')) {

                                if ( $this.position().left > (container.width() / 2) ) {

                                    tabposition = Math.round($this.position().left - $this.width()/2) + 'px';

                                    scope.scrollbarConfig = {
                                        setLeft: tabposition,
                                        setHeight: 62,
                                        axis: 'x',
                                        scrollButtons:{
                                            enable: true,
                                            scrollAmount: 400,
                                            scrollType: "stepped"
                                        },
                                        advanced:{
                                            updateOnContentResize: true
                                        },
                                        live: true
                                    };

                                } else {

                                    scope.scrollbarConfig = {
                                        setLeft: "0px",
                                        setHeight: 62,
                                        axis: 'x',
                                        scrollButtons:{
                                            enable: true,
                                            scrollAmount: 400,
                                            scrollType: "stepped"
                                        },
                                        advanced:{
                                            updateOnContentResize: true
                                        },
                                        live: true
                                    };

                                }
                            }
                        });

                    },0);
                };

                compileTabnames();

                scope.$watch(
                    function() { return $state.current.name; },
                    function(newValue, oldValue) {
                        if ( newValue !== oldValue ) {
                            $('.wizard_flow_tabs-parent').remove();
                            $('.wizard_flow_tabs-parent').mCustomScrollbar("destroy");
                            compileTabnames();
                        }
                    }
                );

                scope.$watch(function () {
                    return scope.steps;
                }, function () {
                        $('.wizard_flow_tabs-parent').remove();
                        $('.wizard_flow_tabs-parent').mCustomScrollbar("destroy");
                        compileTabnames();
                }, true);
            }
        };
        return directive;
    }
})();
