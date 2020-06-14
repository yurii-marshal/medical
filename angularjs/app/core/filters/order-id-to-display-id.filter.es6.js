export default function orderIdToDisplayIdFilter() {
    return function(orderId) {
        return `${ orderId.match(/^\S{2}/)[0].toUpperCase() }-${ orderId.match(/\S{8}$/)[0].toUpperCase() }`;
    };
}
