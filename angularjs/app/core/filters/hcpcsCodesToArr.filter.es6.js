export default function hcpcsCodesToArr() {
    return function(item) {
        let hcpcsObjKey = '', result = [];

        if (item && item.HcpcsCodes) {
            hcpcsObjKey = 'HcpcsCodes';
        } else if (item && item.HcpcsCode) {
            hcpcsObjKey = 'HcpcsCode';
        }

        result = mapHcpcsCodes(item);

        if (item.Components && item.Components.length) {
            angular.forEach(item.Components, (i) => {
                if (i && i.HcpcsCodes) {
                    hcpcsObjKey = 'HcpcsCodes';
                } else if (i && i.HcpcsCode) {
                    hcpcsObjKey = 'HcpcsCode';
                }
                result = result.concat(mapHcpcsCodes(i));
            });
        }

        function mapHcpcsCodes(item) {
            if (!item) {
                return;
            }

            let hcpcsCodePrimaryArr = item[`${hcpcsObjKey}`] && item[`${hcpcsObjKey}`].Primary
                ? item[`${hcpcsObjKey}`].Primary.split(',')
                : [];

            hcpcsCodePrimaryArr.map((code) => code.trim());

            return item[`${hcpcsObjKey}`] && item[`${hcpcsObjKey}`].Additional && item[`${hcpcsObjKey}`].Additional.length
                ? hcpcsCodePrimaryArr.concat(item[`${hcpcsObjKey}`].Additional)
                : hcpcsCodePrimaryArr;
        }

        return result;
    };
}
