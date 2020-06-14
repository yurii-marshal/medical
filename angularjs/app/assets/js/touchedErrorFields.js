function touchedErrorFields(form) {
    angular.forEach(form.$error, function(error) {
        angular.forEach(error, function(field) {
            if (field.hasOwnProperty('$viewValue')) {
                field.$setTouched();
            } else {
                touchedErrorFields(field);
            }
        });
    });
};
