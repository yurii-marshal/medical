export default class inboxAttachPatientController {
    constructor($scope, $state, $timeout, ngToast, inboxService, $stateParams, documentsService, invoicesService) {
        'ngInject';

        this.$state = $state;
        this.$timeout = $timeout;
        this.ngToast = ngToast;
        this.inboxService = inboxService;
        this.documentsService = documentsService;
        this.invoicesService = invoicesService;

        this.isOpenedPreview = false;
        this.patientsArr = [];
        this.isLoading = false;

        this.viewName = $state.current.name === 'root.attach_inbox_patient' ? 'attach' : 'new';

        this.docsArr = $stateParams['docsArr'] || [];
        this.docsArr.map((item) => {
            // extend document model with additional fields
            item.AllPages = true;
            item.DocumentType = null;
            item.CustomPages = '';
            return item;
        });

        if (this.docsArr.length < 1) {
            ngToast.danger('No Selected Documents.');
            this.cancel();
        }
        this.addPatient();
    }

    getDocumentTypes(name) {
        return this.documentsService.getDocumentTypes(name)
            .then((response) => {
                return response.data.Items.filter((item) => {
                    return !item.IsCmn;
                });
            });
    }

    getPatients(name) {
        return this.invoicesService.getPatientNames(name)
            .then((response) => response.data.Items);
    }

    addPatient() {
        let patientModel = null;

        if (this.viewName === 'new') {
            patientModel = {
                Name: {
                    First: '',
                    Last: ''
                },
                DateOfBirth: ''
            };
        }

        this.patientsArr.push({
            patient: patientModel, // different depends on 'attach' or 'new' view
            documents: angular.copy(this.docsArr)
        });

        this.$timeout((_) => {
            $('.body-new-patients').mCustomScrollbar('scrollTo', `#patient-row-${this.patientsArr.length - 1}`);
        });
    }

    deletePatient(index) {
        this.patientsArr.splice(index, 1);
    }

    viewFile(item) {
        this.inboxService.showDocumentInPreview(item.Id);
        this.isOpenedPreview = true;
    }

    save() {
        if (!this.form.$valid) {
            touchedErrorFields(this.form);
            return;
        }

        // Prepare dataArr for server
        let dataArr = [];

        this.patientsArr.map((item) => {
            let Documents = [];

            item.documents.map((doc) => {
                Documents.push({
                    'FileName': doc.FileName,
                    'FaxId': doc.Id,
                    'DocumentTypeId': doc.DocumentType.Id,
                    'ExpiredDate': doc.ExpiredDate ? moment(doc.ExpiredDate).format('YYYY-MM-DD') : undefined,
                    'Pages': doc.AllPages ? '' : doc.CustomPages
                });
            });

            if (this.viewName === 'attach') {
                dataArr.push({ PatientId: item.patient.Id, Documents });
            }
            if (this.viewName === 'new') {
                let DateOfBirth = moment.utc(item.patient.DateOfBirth).format('YYYY-MM-DDTHH:mm:ss');
                let Name = item.patient.Name;

                dataArr.push({ DateOfBirth, Name, Documents });
            }
        });

        let actionPromise, successTextStr;

        switch (this.viewName) {

            // view is "Attach to patients"
            case 'attach': {
                actionPromise = this.inboxService.applyDocuments(dataArr);
                successTextStr = 'Document(s) are attached to patient(s).';
                break;
            }

            // view is "New patients"
            case 'new': {
                actionPromise = this.inboxService.createPatientsWithDocuments(dataArr);
                successTextStr = 'Patient(s) are created.';
                break;
            }
        }

        this.isLoading = true;
        actionPromise.then((_) => {
            this.ngToast.success(successTextStr);
            this.cancel();
        })
            .finally((_) => {
                this.isLoading = false;
            });
    }

    cancel() {
        this.$state.go('root.inbox.list');
    }
}

