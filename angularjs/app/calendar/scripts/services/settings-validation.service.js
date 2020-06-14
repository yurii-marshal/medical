(function () {
    "use strict";

    angular
        .module("app.calendar")
        .service("settingsValidationService", settingsValidationService);

    function settingsValidationService() {
        this.validateEquipmentSetting = validateEquipmentSetting;

        function validateEquipmentSetting(equipmentSettingItem) {
            var errorList = [];
            if (equipmentSettingItem.Template && !checkPropertiesList(equipmentSettingItem.Template.RootGroup)) {
                errorList.push("Not all required values selected at checked groups");
            }
            return errorList;
        }

        function checkPropertiesList(group) {
            if (group.ForChoose && group.hasOwnProperty("isChosen") && group.isChosen && group.Required
                ||
                !group.ForChoose && group.Required) {
                for (var i in group.Properties) {
                    if ((group.Properties[i].Type === 5 || group.Properties[i].Type === 3 || group.Properties[i].Type === 2)
                        && group.Properties[i].Required
                        && (group.Properties[i].Value === undefined || group.Properties[i].Value === null || group.Properties[i].Value === "")) {
                        return false;
                    }
                }
            }

            for (var g in group.Groups) {
                if (!checkPropertiesList(group.Groups[g]))
                    return false;
            }
            return true;
        }
    }
})();
