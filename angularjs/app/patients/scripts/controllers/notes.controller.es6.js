export default class notesController {
    constructor($state, notesService, bsLoadingOverlayService) {
        'ngInject';

        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.notesService = notesService;

        this.patientId = $state.params.patientId;
        this.notesSubjects = undefined;

        this.getUsers = () => this.notesService.notesUsers(this.patientId);
        this.getNotes = (pageIndex, pageSize, sortExpression, filterExpression) => {
            return this.notesService.getNotes(this.patientId, pageIndex, pageSize, sortExpression, filterExpression);
        };
        this.addNote = (data) => this.notesService.createNote(this.patientId, data);

        this._activate();
    }

    _activate() {
        this.bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        this.notesService.noteSubjectDictionary()
            .then((response) => {
                this.notesSubjects = response.data;
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));
    }
}
