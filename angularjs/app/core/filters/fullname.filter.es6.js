export default function fullnameFilter() {
    return function (obj) {
        if (!obj) { return ''; }

        let FirstName = obj.FirstName || obj.First || '';
        let LastName = obj.LastName || obj.Last || '';

        return [FirstName, LastName].filter((str) => !!str).join(' ');
    };
}
