export function parseHcpcsCodes(hcpcs) {
    let outHcpcsArr = [];

    if (hcpcs instanceof Array) {
        return hcpcs;
    }

    Object.keys(hcpcs).forEach((key) => {
        if (typeof hcpcs[key] === 'string') {
            outHcpcsArr.push(hcpcs[key]);
        } else if (hcpcs[key] instanceof Array) {
            outHcpcsArr = outHcpcsArr.concat(hcpcs[key]);
        }
    });

    return outHcpcsArr;
}
