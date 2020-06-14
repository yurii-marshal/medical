class onPressEnter {
    constructor() {}

    link(scope, element, attrs) {
        element.bind("keydown keypress", event => {
            if (event.which === 13) {
                scope.$apply(_ => scope.$eval(attrs.onPressEnter));
                event.preventDefault();
            }
        });
    }
}

angular.module('app.core')
    .directive('onPressEnter', () => new onPressEnter);