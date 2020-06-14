export function normalizeDeliveryMethodDictionariesData(response) {
    const outArr = response.data.map((item) => ({
        id: item.Id,
        name: item.Text
    }));

    return outArr;
}

/*
    [{
        id: string,
        text: string
    }]
*/
