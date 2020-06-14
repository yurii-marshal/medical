export default function simpleTooltipDirective() {
    return {
        restrict: 'A',
        scope: {
            text: '@simpleTooltip',
            tooltipPosition: '@?',            // Optional. Default 'top'. Tooltip position
            simpleTooltipEnable: '<?',              // Optional. Default true. Enable or disable tooltip on live
            simpleTooltipTheme: '@?',               // Optional. Tooltip theme. Default 'tooltipster-black'
            simpleTooltipMaxWidth: '@?',            // Optional. Tooltip max width. Default 270. Can use null
            simpleTooltipArrow: '@?',               // Optional. Default False, True/False
            simpleTooltipBreakpoint: '@?',          // Optional. Breakpoint window width, integer
            simpleTooltipBreakpointCondition: '@?', // Optional. Default 'To'. 'From' means 'show tooltip form selected breakpoint'. 'To' means 'show tooltip to selected breakpoint'
            simpleTooltipIsHtml: '@?'               // Optional. Default false. If the content of the tooltip is provided as a string, it is displayed as plain text by default. If this content should actually be interpreted as HTML, set this option to true.
        },
        link: function(scope, elem, attr) {
            if (!scope.text) { return; }

            let windowWidth = $(window).width();
            let defaults = {
                text: scope.text,
                pos: scope.tooltipPosition || 'top',
                breakpoint: scope.simpleTooltipBreakpoint || undefined,
                breakpointCondition: scope.simpleTooltipBreakpointCondition || 'To',
                arrow: scope.simpleTooltipArrow || false,
                contentAsHTML: scope.simpleTooltipIsHtml || false,
                theme: scope.simpleTooltipTheme ? scope.simpleTooltipTheme.split(',') : 'tooltipster-black',
                maxWidth: scope.simpleTooltipMaxWidth || 270,
                debug: false
            };

            $(elem).tooltipster({
                position: defaults.pos,
                content: defaults.text,
                breakpoint: defaults.breakpoint,
                breakpointCondition: defaults.breakpointCondition,
                arrow: defaults.arrow,
                contentAsHTML: defaults.contentAsHTML,
                theme: defaults.theme,
                maxWidth: defaults.maxWidth
            });

            breakpointsTooltip();

            if (defaults.breakpoint) { window.addEventListener('resize', breakpointsTooltip); };

            scope.$watch('simpleTooltipEnable', function(newVal) {

                if (!$(elem).attr('simple-tooltip-enable')) { return; }

                $(elem).tooltipster(scope.simpleTooltipEnable === true ? 'enable' : 'disable');
            });

            scope.$watch(() => scope.text, (newVal, oldVal) => {
                if (oldVal !== newVal && newVal) { $(elem).tooltipster('content', newVal); }
            });

            scope.$on('$destroy', () => window.removeEventListener('resize', breakpointsTooltip));

            function breakpointsTooltip() {
                if (defaults.breakpointCondition === 'To') {
                    scope.simpleTooltipEnable = $(window).width() <= defaults.breakpoint;
                } else if (defaults.breakpointCondition === 'From') {
                    scope.simpleTooltipEnable = $(window).width() > defaults.breakpoint;
                }
            }
        }
    };
}
