export default function getAllHcpcsCodesFromItem(item) {
    let hcpcs = [];

    if (item.isAny) {
        hcpcs.push(item.Code);
    } else {
        hcpcs = item.allHcpcsCodes || item.HcpcsCodes || item.Hcpcs || [];
    }

    if (item.Components) {

        item.Components.forEach((component) => {
            const codes = component.allHcpcsCodes || component.HcpcsCodes;

            hcpcs = hcpcs.concat(codes);
        });
    }

    return hcpcs;
}
