export function normalizeDeliveryСompaniesData(response) {
    const outArr = response.data.map((item) => ({
        id: item.Id,
        name: item.Name
    }));

    return outArr;
}

/*
    [{
        id: string,
        text: string
    }]
*/
