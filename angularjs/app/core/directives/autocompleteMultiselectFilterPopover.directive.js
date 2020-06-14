(function() {
    'use strict';

    angular
        .module('app.core')
        .directive('autocompleteMultiselectFilterPopoverDirective', autocompleteMultiselectFilterPopoverDirective);

    /* @ngInject */
    function autocompleteMultiselectFilterPopoverDirective() {
        'use strict';

        return {
            restrict: 'A',
            scope: {
                autocompleteMultiselectFilterPopoverDirective: '=',
                onDeleteItem: '&'
            },
            link: function(scope, element) {

                var tooltipTemplate = '',
                    tooltipsterDefaults = {
                        position: 'right',
                        trackOrigin: true,
                        minWidth: 135,
                        maxWidth: 300,
                        animation: 'fade',
                        animationDuration: 0,
                        content: tooltipTemplate,
                        contentAsHTML: true,
                        theme: ['tooltipster-shadow', 'tooltipster-niko', 'tooltipster-autocomplete-multiselect-filter'],
                        interactive: true,
                        IEmin: 11,
                        arrow: false,
                        distance: 20,
                        debug: false
                    };

                function activate() {
                    var data = Object.values(scope.autocompleteMultiselectFilterPopoverDirective);

                    // if is not opened
                    if (!(element.hasClass('tooltipstered') && element.tooltipster('status') === 'open')) {
                        element.tooltipster(tooltipsterDefaults);
                        element.tooltipster('enable');
                    }

                    tooltipTemplate = '';
                    data.forEach(function(item) {
                        tooltipTemplate += '<div class="autocomplete-multiselect-filter-popover-item"><span class="clear-field" data-item-value="' + item.value + '"></span>' + item.label + '</div>';
                    });

                    element.tooltipster('content', tooltipTemplate);
                }

                $('body').on('click', '.autocomplete-multiselect-filter-popover-item .clear-field', function(event) {
                    var id = $(this).data('item-value');

                    event.preventDefault();
                    event.stopPropagation();
                    delete scope.autocompleteMultiselectFilterPopoverDirective[id];
                    scope.onDeleteItem();
                    scope.$apply();
                });

                // if resize or scroll window we hide popover to prevent recalculate position
                $(window).on('resize', hideTooltip);
                $(window).on('scroll', hideTooltip);

                // clear listeners
                scope.$on('$destroy', function() {
                    $('body').off('click', '.autocomplete-multiselect-filter-popover-item .clear-field');
                    $(window).off('resize', hideTooltip);
                    $(window).off('scroll', hideTooltip);
                });

                function hideTooltip() {
                    if (!$(element).hasClass('tooltipstered')) {
                        return;
                    }

                    if (element.hasClass('tooltipstered') && element.tooltipster('status') === 'open') {
                        element.tooltipster('close');
                    }
                }

                scope.$watch(function() {
                    return scope.autocompleteMultiselectFilterPopoverDirective;
                }, function(newVal) {
                    if (newVal) {
                        activate();
                    }
                }, true);
            }
        };
    }

})();
