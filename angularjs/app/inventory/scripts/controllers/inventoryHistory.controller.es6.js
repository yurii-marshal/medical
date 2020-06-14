export default class inventoryHistoryController {
    constructor($state, bsLoadingOverlayService, inventoryEquipmentService) {
        'ngInject';

        this.equipmentId = $state.params.equipmentId;
        this.historyListCount = undefined;
        this.historyList = [];

        bsLoadingOverlayService.start({ referenceId: 'historyPage' });
        inventoryEquipmentService.getEquipmentHistory(this.equipmentId)
            .then((response) => {
                this.historyListCount = response.data.Count;
                this.historyList = response.data.Items.map(mapItems);
            })
            .finally(() => bsLoadingOverlayService.stop({ referenceId: 'historyPage' }));

        function mapItems(item) {
            let decorationResult = labelClassAndName(item.Action);
            item.className = decorationResult.className;
            item.labelName = decorationResult.labelName;

            return item;
        }

        function labelClassAndName(action) {
            let result = {
                className: '',
                labelName: ''
            };
            const CREATED = 1;
            const UPDATED = 2;
            const MOVED = 3;
            
            switch (+action.Id) {
                case CREATED:
                    result.className = 'green';
                    result.labelName = 'Received';
                    break;
                case UPDATED:
                    result.className = 'blue';
                    result.labelName = 'Updated';
                    break;
                case MOVED:
                    result.className = 'dark-blue';
                    result.labelName = 'Moved';
                    break;
                default:
                    result.className = 'gray';
                    result.labelName = action.Name;
                    break;
            }

            return result;
        }
    }
}