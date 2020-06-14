/**
 * @description Adding CSS Class for tag color
 * @param tagName
 * @param tagSource - module, where we use helper.
 * TagSource Work different for order Tags and equally for patient custom tags AND
 * invoice patient tags
 * @returns {string}
 */
export function addTagClass(tagName, tagSource) {
    if (tagSource && tagSource === 'order') {
        switch (tagName) {
            case 'Authorization Expired':
                return 'orange-label';
            case 'Insurance Verification':
                return 'red-label';
            case 'Pending Review':
                return 'lilac-label';
            case 'New Order':
                return 'light-blue-label';
            case 'Confirmation Required':
                return 'mint-label';
            case 'Action Required':
                return 'cobalt-blue-label';
            case 'Insurance Expired':
                return 'sky-blue-label';
            case 'Prescription Required':
                return 'dark-blue-label';
            case 'Prescription Expired':
                return 'light-violet-label';
            case 'Authorization Required':
                return 'light-green-label';
            case 'CMN Required':
                return 'bright-green-label';
            case 'CMN Expired':
                return 'bright-yellow-label';
            case 'Resupply Limit':
                return 'bright-violet-label';
            case 'Patient Non-Compliant':
                return 'bright-blue-label';
            default:
                return 'light-gray-label';
        }
    } else {
        return 'light-gray-label';
    }
}
