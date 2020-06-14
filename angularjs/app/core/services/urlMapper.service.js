(function () {
    "use strict";

    angular
        .module("app")
        .constant("Manufacturer",
        {
            "dictionary": "equipment/manufacturers/dictionary"
        })
        .constant("Equipment",
        {
            "equipment_groups_dictionary": "equipment/groups/dictionary",
            "getEquipmentSettings": "equipment/models/{0}/customization",
            'getAccessoriesByModel': 'equipment/models/{0}/accessories'
        })
        .constant("Device",
        {
            "getByPhysicianFilter": "v1/physicians/{0}/equipments?",
            "getDictionaryFilter": "equipment/models/dictionary?"

        })
        .constant("Patient",
        {
            "getInitCoughCheckList": "patients/events/complete/init/cough-assist-checklist/dictionaries",
            "getInitNiovCheckList": "patients/events/complete/init/niov-checklist/dictionaries",
            "getInitOxygenCheckList": "patients/events/complete/init/oxygen-therapy/dictionaries",
            "getInitPapCheckList": "patients/events/complete/init/pap-therapy/dictionaries",
            "getInitTrilogyCheckList": "patients/events/complete/init/trilogy/dictionaries",
            "getCommonInitDictionaries": "patients/events/complete/init/common/dictionaries",
            "getEquipments": "v1/patients/{0}/equipments"

        })
        .constant("Physician",
        {
            "getRefPhysician": "referred/physicians",
            "getRefOffices": ""

        });

    angular
        .module("app")
        .service("urlMapperService", urlMapperService);

    urlMapperService.$inject = ["Manufacturer", "Equipment", "Device", "Patient", "Physician"];

    function urlMapperService(Manufacturer, Equipment, Device, Patient, Physician) {
        this.getUrlMapper = getUrlMapper;

        function getUrlMapper() {
            return {
                Manufacturer: Manufacturer,
                Equipment: Equipment,
                Device: Device,
                Patient: Patient,
                Physician: Physician
            };
        }
    }
})();