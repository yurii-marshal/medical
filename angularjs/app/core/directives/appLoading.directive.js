(function () {
    "use strict";

    angular
        .module("app")
        .directive("appLoading", function ($animate) {
              return ({
                  link: link,
                  restrict: "C"
              });
              function link(scope, element, attributes) {
                  window.addEventListener('load', function () {
                      element.remove();
                      scope = element = attributes = null;
                  });
              }
          }
      );
})();