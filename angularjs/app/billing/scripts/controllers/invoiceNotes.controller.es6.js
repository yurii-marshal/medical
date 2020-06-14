export default class invoiceNotesController {
    constructor($state, invoicesService) {
        'ngInject';

        this.invoicesService = invoicesService;

        this.invoiceId = $state.params.invoiceId;
        this.model = invoicesService.getModel();

        this.getNotes = this._getNotes.bind(this);
        this.addNote = this._addNote.bind(this);
        this.getUsers = this._getUsers.bind(this);
    }

    _getNotes(pageIndex, pageSize, sortExpression, filterExpression) {
        return this.invoicesService.getInvoiceNotes(pageIndex, pageSize, sortExpression, filterExpression, this.invoiceId);
    }

    _addNote(data) {
        let model = { Note: data.Description };
        return this.invoicesService.addInvoiceNote(model, this.invoiceId);
    }

    _getUsers(name) {
        return this.invoicesService.getUsers(name)
            .then((response) => response.data.Items);
    }
}
