/**
 * @description Add css class for order status label color
 * @param id
 * @returns {string}
 */
export function mapOrderStatusClass(id) {
    switch (Number(id)) {
        case 1:
            return 'orange';
        case 2:
            return 'green';
        case 3:
            return 'blue';
        case 4:
            return 'gray';
        case 5:
            return 'dark-blue';
        default :
            break;
    }
}
