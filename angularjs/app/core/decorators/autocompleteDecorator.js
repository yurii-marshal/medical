(function () {
    angular.module('app.core')
    .config(config);

    config.$inject = ['$provide'];

    // add additional functionality to md-autocomplete
    function config($provide) {
        // extend Angular Material's mdAutoCompleteDirective
        $provide.decorator('mdAutocompleteDirective', mdAutoCompleteDirectiveOverride);

        mdAutoCompleteDirectiveOverride.$inject = ['$delegate'];

        function mdAutoCompleteDirectiveOverride($delegate) {
            // grab the directive
            var directive = $delegate[0];

            // need to append to base compile function
            var compile = directive.compile;
            // add our custom attribute to the directive's scope
            angular.extend(directive.scope, {
                menuContainerClass: '@?mdMenuContainerClass'
            });

            // recompile directive and add our class to the virtual container
            directive.compile = function (element, attr) {
                var template = compile.apply(this, arguments);
                var menuContainerClass =
                  attr.mdMenuContainerClass ? attr.mdMenuContainerClass : '';
                var menuContainer = element.find('md-virtual-repeat-container');

                menuContainer.addClass(menuContainerClass);

                // recompile the template
                return function (e, a) {
                    template.apply(this, arguments);
                };
            };

            return $delegate;
        }
    }
})();