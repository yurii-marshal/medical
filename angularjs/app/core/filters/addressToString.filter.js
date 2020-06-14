(function () {
    "use strict";

    angular
        .module("app")
        .filter("addressToString", function () {
            return function (arr) {
                if (!arr) {
                    return '';
                }

                var City = arr.City ? arr.City : '';
                var State = arr.State ? arr.State : '';
                var Zip = arr.Zip ? arr.Zip : '';

                if (angular.isObject(Zip)) {
                    Zip = Zip.Text ? Zip.Text :
                        Zip.text ? Zip.text :
                            '';
                }

                //State only 2 char
                if (angular.isObject(State)) {
                    State = State.description && State.description.length <= 2 ? State.description :
                        State.Text && State.Text.length <= 2 ? State.Text :
                            State.id && State.id.length <= 2 ? State.id :
                                State.Id && State.Id.length <= 2 ? State.Id :
                                    '';
                }

                return _.filter([
                    arr.AddressLine,
                    arr.AddressLine1,
                    arr.AddressLine2,
                    City,
                    State,
                    Zip
                ], function (str) {
                    return !!str;
                }).join(', ');

            }
        });
})();
