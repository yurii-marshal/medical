export default function unique() {
    return function(arr, field) {
        return _.uniqBy(arr, (a) => a[field]);
    };
}
