export default class orderNotesController {
    constructor($state, bsLoadingOverlayService, orderNotesService) {
        'ngInject';

        this.notesSubjects = undefined;
        let orderId = $state.params.orderId;

        bsLoadingOverlayService.start({ referenceId: 'patientPage' });

        orderNotesService.getSubjects()
            .then((response) => this.notesSubjects = response.data)
            .then(() => bsLoadingOverlayService.stop({ referenceId: 'patientPage' }));

        this.getUsers = (searchUser) => {
            return orderNotesService.getUsers(searchUser)
                .then((response) => response.data.Items);
        };

        this.getNotes = (pageIndex, pageSize, sortExpression, filterExpression) => {
            return orderNotesService.getNotes(orderId, pageIndex, pageSize, sortExpression, filterExpression);
        };

        this.addNote = (data) => {
            return orderNotesService.addNote(orderId, data);
        };
    }
}

