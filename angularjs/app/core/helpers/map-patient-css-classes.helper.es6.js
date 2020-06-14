/**
 * @description Add css class for patient status label color
 * @param id
 * @returns {string}
 */
export function mapPatientStatusClass(id) {
    switch (id.toString()) {
        case '1': // active
            return 'green';
        case '2': // inactive
            return 'dark-blue';
        case '3': // hold
            return 'orange';
        default:
            break;
    }
}
