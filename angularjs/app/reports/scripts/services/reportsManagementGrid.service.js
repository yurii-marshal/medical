(function () {
  'use strict';

  angular
    .module('app.reports')
    .service('reportManagementGridDetailsService', reportManagementGridDetailsService);

  reportManagementGridDetailsService.$inject = [];

  /* @ngInject */
  function reportManagementGridDetailsService() {
    this.initializeGrid = initializeGrid;
    this.getGridApi = getGridApi;

    var deleteTemplate = "<div class=\"ui-grid-cell-contents\"><span class=\"icon delete\" ng-click=\"grid.appScope.deleteDocumentDetails(row.entity)\"></span></div>";
    var footerTemplate = "<div class=\"ui-grid-footer-info ui-grid-grid-footer ng-scope\"><span class=\"ng-binding\" ng-style=\"grid.appScope.isFooterDisplaying()\">No data</span></div>";
    var rowNumberTemplate = "<div class=\"ui-grid-cell-contents\">{{grid.renderContainers.body.visibleRowCache.indexOf(row) + 1}}</div>";
    var descriptionTemplate = "<div><strong>Description:</strong><p>{{row.entity.description}}</p><hr/></div>";
    var subGridTemplatePath = "../../../modules/documentManagement/views/templates/documentManagement.subGrid.template.html";

    var api = {};
    var parentScope = undefined;
    var setModel = undefined;


    ////////////////
    function initializeGrid (scope, setModelFunction) {

      var mainOptions = {
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        enableColumnMenus: false,
        showGridFooter: true,
        gridFooterTemplate: footerTemplate,

        enableExpandable: true,
        expandableRowTemplate: subGridTemplatePath,
        expandableRowScope: {
          subGridVariable: "subGridScopeVariable"
        }
      };

      var columnDefs = [
        { name: "number", displayName: "#", width: "40", enableSorting: false, cellTemplate: rowNumberTemplate },
        { name: "parient_id", displayName: "Patient’s ID", width: "120" },
        { name: "branch", displayName: "Branch", width: "110" },
        { name: "status", displayName: "Status", width: "70"  },
        { name: "prefix", displayName: "Prefix:", width: "70"  },
        { name: "gender", displayName: "Status", width: "60"  },
        { name: "name", displayName: "Name", width: "200"  },
        { name: "birthday", displayName: "Birthday", width: "200"  },
        { name: "address1", displayName: "Address (line 1)", width: "150"  },
        { name: "address2", displayName: "Address (line 2)", width: "150"  },
        { name: "city", displayName: "City", width: "100" }
      ];

      //parentScope = scope;
      //setModel = setModelFunction;

      return {
        enableRowSelection: mainOptions.enableRowSelection,
        enableRowHeaderSelection: mainOptions.enableRowHeaderSelection,
        enableColumnMenus: mainOptions.enableColumnMenus,
        multiSelect: mainOptions.multiSelect,
        modifierKeysToMultiSelect: mainOptions.modifierKeysToMultiSelect,
        noUnselect: mainOptions.noUnselect,
        enableHorizontalScrollbar: mainOptions.enableHorizontalScrollbar,
        enableVerticalScrollbar: mainOptions.enableVerticalScrollbar,
        showGridFooter: mainOptions.showGridFooter,
        gridFooterTemplate: mainOptions.gridFooterTemplate,
        onRegisterApi: onRegisterApi,
        columnDefs: columnDefs,
        enableExpandable: mainOptions.enableExpandable,
        expandableRowTemplate: mainOptions.expandableRowTemplate,
        expandableRowScope: mainOptions.expandableRowScope
      }
    }

    function onRegisterApi (gridApi) {
      //gridApi.expandable.on.rowExpandedStateChanged(parentScope, rowExpandedStateChanged);
      //gridApi.selection.on.rowSelectionChanged(parentScope, function (data) {
      //    setModel(data.entity);
      //    gridApi.expandable.collapseAllRows();
      //    gridApi.expandable.toggleRowExpansion(data.entity);
      //});
      //api = gridApi;
    }

    function getGridApi() {
      return api;
    }
  }

})();
