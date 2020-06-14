export const prescriptionStatus = {
    bindings: {
        statusObj: '<',
    },
    templateUrl: 'core/components/prescription-status/prescription-status.html',
    controller: class prescriptionStatusCtrl {
        constructor() {
            this.update();
        }

        $onChanges() {
            this.update();
        }

        update(){
            if (this.statusObj && this.statusObj.Id) {
                this.StatusClass = _getStatusClass(this.statusObj.Id);
                this.Text = this.statusObj.Text;
            }
        }
    }
};

function _getStatusClass(prescriptionStatusId) {
    switch (prescriptionStatusId.toString()) {
        case '1': // new
        case '2': // active
            return 'green';
        case '3': // expired
            return 'orange';
        case '4': // renew
            return 'blue';
    }
}
