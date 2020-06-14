export function calcFloatSum(a, b) {
    return +((parseFloat(a) + parseFloat(b)).toFixed(2));
}

export function calcFloatDiff(a, b) {
    return +((parseFloat(a) - parseFloat(b)).toFixed(2));
}

export function minusPercentage(number, percenrage) {
    const num = parseFloat(number);

    percenrage = percenrage || 0;

    return num - (percenrage/100 * num);
}
