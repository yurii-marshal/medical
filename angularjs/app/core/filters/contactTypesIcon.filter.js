(function () {
    "use strict";

    angular
        .module("app.core")
        .filter("contactTypesIcon", function () {
            return function (input) {
                    switch (input) {
                        case 1:
                            return "email-circle";
                        case 2:
                            return "phone-work";
                        case 8:
                            return "phone-work";
                        case 16:
                            return "website";
                        default:
                            return "phone-other";
                    }
                };
            }
        );
})();