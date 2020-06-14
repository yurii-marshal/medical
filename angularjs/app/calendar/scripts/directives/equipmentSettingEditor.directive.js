(function () {
    "use strict";

    angular
      .module("app.calendar")
      .directive("equipmentSettingEditor", equipmentSettingEditor);

    function equipmentSettingEditor() {

        function getGroupHasRealValue(group) {
            if (!group.isChosen) {
                return false;
            }
            if (group.Properties.length > 0) {
                return true;
            }
            for (var i in group.Groups) {
                if (getGroupHasRealValue(group.Groups[i])) {
                    return true;
                }
            }
        }

        var directive = {
            restrict: 'E',
            templateUrl: "core/views/templates/equipmentSettingEditor.html",
            scope: {
                groups: '=',
                hideNotChosen: '=',
                disableInputs: '='
            },
            controller: [ '$scope', function ($scope) {


                this.setChecked = function(groupId) {
                    if ($scope.disableInputs) {
                        return;
                    }
                };

                this.getGroupVisible = function (hideNotChosen, group) {
                    var groupHasRealValue = getGroupHasRealValue(group);
                    return hideNotChosen && !groupHasRealValue;
                }
            }],
            controllerAs: 'grSettingEditor'
        };
        return directive;
    }
})();
