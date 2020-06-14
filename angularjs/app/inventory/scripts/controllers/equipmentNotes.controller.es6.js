export default class equipmentNotesController {
    constructor($state, inventoryEquipmentService, invoicesService) {
        'ngInject';

        this.$state = $state;
        this.inventoryEquipmentService = inventoryEquipmentService;
        this.invoicesService = invoicesService;

        this.equipmentId = $state.params.equipmentId;

        this.getNotes = this._getNotes.bind(this);
        this.getUsers = this._getUsers.bind(this);
        this.addNote = this._addNote.bind(this);
    }

    _getNotes(pageIndex, pageSize, sortExpression, filterExpression) {
        return this.inventoryEquipmentService.getEquipmentNotes(pageIndex,
                                                                pageSize,
                                                                sortExpression,
                                                                filterExpression,
                                                                this.equipmentId);
    }

    _getUsers() {
        return this.invoicesService.getUsers();
    }

    _addNote(data) {
        let model = { Text: data.Description };

        return this.inventoryEquipmentService.addEquipmentNote(model, this.equipmentId);
    }
}
