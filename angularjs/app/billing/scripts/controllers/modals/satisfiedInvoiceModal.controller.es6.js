export default class satisfiedInvoiceModalController {
    constructor($mdDialog, lines) {
        'ngInject';

        this.$mdDialog = $mdDialog;

        this.infoText = '';
        this.nonSatisfiedLines = [];

        angular.forEach(lines, (line, key) => {
            if (!line.Satisfied) {
                this.nonSatisfiedLines.push(line);
                this.infoText += (key === lines.length - 1) ? `Service Line ${key + 1} ` : `Service Line ${key + 1}, `;
            }
        });
    }

    save() {
        this.$mdDialog.hide(true);
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}