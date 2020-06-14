export default class DurationValidatorDirective {
    constructor() {
        this.restrict = 'A';
        this.require = 'ngModel';
        this.scope = {};
    }

    link(scope, elem, attr, ctrl) {
        scope.$watch(() => ctrl.$viewValue, (newVal) => {
            ctrl.$setValidity('duration_out_of_range', validate(newVal));
        });

        function validate(value) {
            let format = 'HH mm';
            let min = moment('00h 05m', format);
            let max = moment('23h 59m', format);

            value = value.toLowerCase();

            let parts = value.split('h');

            if (parts.length === 2 && value.indexOf('h') !== -1 && value.indexOf('m') !== -1) {
                format = 'HH mm';
            } else if (parts.length === 1 && value.indexOf('h') !== -1) {
                format = 'HH';
            } else if (parts.length === 1 && value.indexOf('m') !== -1) {
                format = 'mm';
            }

            let time = moment(value, format);

            return time >= min && time <= max;
        }
    }
}
