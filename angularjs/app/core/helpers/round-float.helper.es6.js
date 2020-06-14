export function roundToTwoDigitsAfterComma(floatNumber) {
    return parseFloat((Math.round(floatNumber * 100) / 100).toFixed(2));
}
