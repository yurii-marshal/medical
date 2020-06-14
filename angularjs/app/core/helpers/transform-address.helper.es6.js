/**
 * @description Transform Address object to valid string in format:
 * [Address Line 1], [Address Line 2], [City], [State] [Zip]
 * @param obj
 * @returns {string}
 */
export function transformAddress(obj) {
    if (!obj) {
        return '-';
    }

    let address = [obj.AddressLine];

    if (obj.AddressLine2) {
        address.push(obj.AddressLine2);
    }

    address.push(obj.City);
    address.push(`${obj.State} ${obj.Zip}`);

    return address.join(', ');
}
