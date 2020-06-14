import template from './appointment-documents.html';

class appointmentDocumentsCtrl {
    constructor($scope, calendarAppointmentService) {
        'ngInject';

        this.model = calendarAppointmentService.getModel();

        this.openPreview = calendarAppointmentService.openDocument.bind(calendarAppointmentService);

        $scope.$on('patientDocumentsInfoLoaded', () => {
            if (!this.model.event.Documents.length) {
                this.model.event.Documents.push({});
                return;
            }
            this.model.event.Documents = this.model.event.Documents.filter((item) => {
                return _.find(this.model.patientDocuments, (doc) => doc.Id === item.Id);
            });
        });
    }

    addDocument() {
        let hasUnselectedDocuments = false;

        this.model.event.Documents.forEach((item) => hasUnselectedDocuments = !item.Id);

        if (!(this.model.patientDocuments.length === this.model.event.Documents.length) && !hasUnselectedDocuments) {
            this.model.event.Documents.push({});
        }
    }

    deleteDocument(index) {
        this.model.event.Documents.splice(index, 1);
        if (!this.model.event.Documents.length) {
            this.model.event.Documents.push({});
        }
        this.setValidity();
    }

    changeDocument(document, index) {
        this.model.event.Documents.splice(index, 1, document);
        this.setValidity();
    }

    setValidity() {
        for (let i in this.model.event.Documents) {
            if (this.documentsForm[`document${i}`]) {
                let isDocumentUnique = this.model.event.Documents.filter((document) => {
                    return document.Id === this.model.event.Documents[i].Id;
                }).length < 2;

                this.documentsForm[`document${i}`].$setValidity('notUnique', isDocumentUnique);
                this.documentsForm[`document${i}`].$setTouched();
            }
        }
    }
}

const appointmentDocuments = {
    template,
    controller: appointmentDocumentsCtrl
};

export default appointmentDocuments;
