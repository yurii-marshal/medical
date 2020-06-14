//TODO check if we really need this. It seems it doesn't used
export default function renderBenefitItem() {
    'ngInject';

    return function (item) {
        if (!item || !item.Details) { return ''; }

        let lines = [];
        let _text = '';
        let _item = item.Details;

        //form first line
        _text += _item.Name || '';
        _text += _item.Dates && _item.Dates.length ? ` (${ _item.Dates.join(', ') })` : '';
        _text += _text && _item.Condition ? ': ' : '';
        _text += _item.Condition || '';

        //fill Deductible with orange
        _text = _text.replace(/(Deductible)/ig, "<span class='orange'>$1</span>");
        if (_text) { lines.push(_text); }

        //form next line
        //Show AuthorizationRequired only if not Unknown value.
        _text = (_item.AuthorizationRequired && _item.AuthorizationRequired.Code > 0)
            ? `Authorization required: ${_item.AuthorizationRequired.Name}`
            : '';
        if (_text) { lines.push(_text); }

        //form next line
        const ignoreFields = ['CoverageLevel', 'Network', 'Details'];
        for (let prop in item) {
            if (ignoreFields.indexOf(prop) !== -1) { continue; }

            let getStr = getValueFromUnknown(prop, item[prop]);
            if (getStr) { lines.push(getStr); }
        }

        function getValueFromUnknown(title, val) {
            if (!val || val.length === 0) { return ''; }
            let res = '';

            if (angular.isArray(val)) {
                res = getValueFromArray(val);
            } else if (angular.isObject(val)) {
                res = getValueFromObj(val);
            } else {
                res = val;
            }

            return res ? `${title}: ${res}` : '';
        }

        function getValueFromObj(val) {
            let resArr = [];

            // object {Code:'',Name:''} should return only "Name"
            if (val.hasOwnProperty('Code') && val.hasOwnProperty('Name')) {
                let count = 0;

                for (var prop in val) {
                    if (val.hasOwnProperty(prop)) { count++; }
                }

                if (count === 2) { return val.Name; }
            }

            for (var prop in val) {
                let str = getValueFromUnknown(prop, val[prop]);
                if (str) { resArr.push(`<div>${str}</div>`); }
            }

            let res = resArr.join('');
            if (res) { res = `<div class='moveleft'>${res}</div>`; }
            return res;
        }

        function getValueFromArray(val) {
            if (!val || val.length === 0) { return ''; }

            for (let i = 0; i < val.length; i++) {
                let _item = val[i];
                if (angular.isArray(_item)) {
                    val[i] = getValueFromArray(_item);
                } else if (angular.isObject(_item)) {
                    val[i] = getValueFromObj(_item);
                }
            }

            return val.join(',');
        }



        return `<div>${lines.join('</div><div>')}/div>`;
    }

}
