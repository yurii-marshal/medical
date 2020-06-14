(function() {
    "use strict";

    angular
        .module("app")
        .filter("tel", function() {
            return function(tel) {
                if (!tel) {
                    return '';
                }

                var val = tel.toString();

                //delete " " and "+"
                val = val.trim()
                    .replace(/^\+/, '');

                //consist not Numbers
                if (val.match(/[^0-9]/)) {
                    return tel;
                }

                switch (val.length) {
                    //mobile phone
                    case 10:
                        return "(" + val.slice(0, 3) + ") " + val.slice(3, 6) + "-" + val.slice(6);

                        //other types
                    default:
                        return tel;
                }
            };
        });
})();