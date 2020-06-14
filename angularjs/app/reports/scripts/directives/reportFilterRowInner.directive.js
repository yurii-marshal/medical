(function () {
  'use strict';

  angular
    .module('app.reports')
    .directive('reportFilterRowInner', reportFilterRowInner);

  function reportFilterRowInner() {
    var directive = {
      restrict: 'A',
      templateUrl: 'reports/views/templates/reportsFilters.filterRowInner.html'
    };
    return directive;
  }

})();
