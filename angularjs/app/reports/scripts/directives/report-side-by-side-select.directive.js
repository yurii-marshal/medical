(function () {
  "use strict";

  angular
    .module('reportSelect',[]);
})();
(function () {
  'use strict';

  angular
    .module('reportSelect')
    .directive('reportSideBySideSelect', reportSideBySideSelect);

    /* @ngInject */
  function reportSideBySideSelect($filter) {
    var directive = {
      link: link,
      restrict: 'AE',
      templateUrl: 'reports/views/templates/multiselect.html',
      scope: {
        reportModel: "=reportModel",
        items: "&items"
      }
    };
    return directive;

    function link(scope, element, attrs) {

      scope.$watchCollection(
        function () {
          return scope.reportModel;
        },
        function (data) {
          var items = scope.items();
          if(items && items.length > 0 && scope.selected_columns_arr!== data) {
            init(scope.items(), data);
          }
        }
      );

      scope.$watch(function () {
        return scope.items();
      }, function (items) {
        init(items, scope.reportModel);
      });

      function init(items, selectedItems){
        items = items || [];

        //"aviable" - left side, "selected" - right side
        //scope.available_columns_arr = angular.copy(items);
        scope.available_columns_arr = angular.copy(items);
        scope.selected_columns_arr = [];

        //save selected element when click on element
        scope.available_columns_selected_arr = [];
        scope.selected_columns_selected_arr = [];

        //if reportModel not empty setup view
        if(selectedItems && selectedItems.length > 0) {
          var indexes = [];
          //get selected columns $indexes
          angular.forEach(selectedItems, function (itemSelected) {
            angular.forEach(items, function (item, key) {
              if(itemSelected.Id === item.Id){
                indexes.push(key);
              }
            });
          });
          //move selected columns right
          move_between_arrayes(scope.available_columns_arr, scope.selected_columns_arr, indexes);
        }
      }
      //scope.$watch(
      //  function () {
      //    return ;
      //  }, function (data) {
      //
      //
      //    /* put links on original objects */
      //    //scope.reportModel = [];
      //    //if(scope.items() && scope.items().length)
      //    //angular.forEach(data, function (item) {
      //    //  angular.forEach(scope.items(), function(item_source){
      //    //    if(angular.equals(item_source, item)) {
      //    //      scope.reportModel.push(item_source);
      //    //    }
      //    //  });
      //    //});
      //    /* end put links */
      //  });

      scope.moveOptionsRight = function () {
        move_between_arrayes(scope.available_columns_arr, scope.selected_columns_arr, scope.available_columns_selected_arr);
        scope.available_columns_selected_arr = [];
        scope.reportModel = scope.selected_columns_arr;
      };

      scope.moveOptionsLeft = function () {
        move_between_arrayes(scope.selected_columns_arr, scope.available_columns_arr, scope.selected_columns_selected_arr);
        scope.selected_columns_selected_arr = [];
        scope.available_columns_arr = $filter("orderBy")(scope.available_columns_arr, "Name", false);
        scope.reportModel = scope.selected_columns_arr;
      };

      scope.moveOptionTop = function () {
        scope.selected_columns_selected_arr =
          array_move_elements(scope.selected_columns_arr, scope.selected_columns_selected_arr, -999);
        scope.reportModel = scope.selected_columns_arr;
      };

      scope.moveOptionUp = function () {
        scope.selected_columns_selected_arr =
          array_move_elements(scope.selected_columns_arr, scope.selected_columns_selected_arr, -1);
        scope.reportModel = scope.selected_columns_arr;
      };

      scope.moveOptionDown = function () {
        scope.selected_columns_selected_arr =
          array_move_elements(scope.selected_columns_arr, scope.selected_columns_selected_arr, 1);
        scope.reportModel = scope.selected_columns_arr;
      };

      scope.moveOptionBottom = function () {
        scope.selected_columns_selected_arr =
          array_move_elements(scope.selected_columns_arr, scope.selected_columns_selected_arr, 999);
        scope.reportModel = scope.selected_columns_arr;
      };

    }
  }

  function array_move_elements(current_arr, indexes_arr, position_delta) {
    var new_indexes_arr = [];
    var direction = 1;

    indexes_arr.sort()

    //set derection of move + up - down
    if(position_delta > 0) {
      indexes_arr.reverse();
      direction = -1;
    }

    //move elements
    angular.forEach(indexes_arr, function (curr_pos) {
      var new_pos = curr_pos*1 + position_delta;

      //limits of array position
      new_pos = (new_pos < 0) ? 0 : new_pos;
      new_pos = (new_pos > current_arr.length-1) ? current_arr.length-1 : new_pos;

      //check vacant position
      new_pos = (new_indexes_arr.indexOf(new_pos.toString()) > -1)
        ? new_indexes_arr[new_indexes_arr.length-1]*1 + direction
        : new_pos;


      var elem = current_arr.splice(curr_pos, 1);
      current_arr.splice(new_pos, 0, elem[0]);

      new_indexes_arr.push(new_pos.toString());
    });

    return new_indexes_arr.sort();
  }

  function move_between_arrayes(from_arr, to_arr, indexes_arr) {
    var sortedDescIndexes = angular.copy(indexes_arr).sort(function(a, b) {
      return b - a;
    });
    angular.forEach(indexes_arr, function(index) {
      to_arr.push(from_arr[index]);
    });
    // to remove from the end of array
    angular.forEach(sortedDescIndexes, function(index) {
      from_arr.splice(index, 1);
    });
  }

})();
