export default class addMedicalInfoRecordModalController {
    constructor($mdDialog, demographicsService, addMedicalInfo, record) {
        'ngInject';

        this.$mdDialog = $mdDialog;
        this.record = record;
        this.addMedicalInfo = addMedicalInfo;

        this.medicalInfo = record
            ? angular.copy(record)
            : {
                RelationType: undefined,
                Email: '',
                Phone: '',
                Name: undefined
            };

        this.relationTypes = [];
        this.titleText = record ? 'Edit Medical Info release:' : 'Add Medical Info release:';
        this.saveText = record ? 'Save' : 'Add';

        demographicsService.getMedicalInfoReleaseRelation()
            .then((response) => this.relationTypes = response.data);
    }

    save() {
        if (this.medicalInfoRecord.$invalid) {
            touchedErrorFields(this.medicalInfoRecord);
        } else {
            if (this.record) {
                this.record.RelationType = this.medicalInfo.RelationType;
                this.record.Email = this.medicalInfo.Email;
                this.record.Phone = this.medicalInfo.Phone;
                this.record.Name = this.medicalInfo.Name;
                this.record.Name.FullName = `${this.medicalInfo.Name.First} ${this.medicalInfo.Name.Last}`;
            } else {
                this.record = {
                    RelationType: this.medicalInfo.RelationType,
                    Email: this.medicalInfo.Email,
                    Phone: this.medicalInfo.Phone,
                    Name: {
                        First: this.medicalInfo.Name.First,
                        Last: this.medicalInfo.Name.Last,
                        FullName: `${this.medicalInfo.Name.First} ${this.medicalInfo.Name.Last}`
                    }
                };
                this.addMedicalInfo(this.record);
            }
            this.cancel();
        }
    }

    cancel() {
        this.$mdDialog.cancel();
    }
}
