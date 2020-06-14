export default function absNumber() {
    return function(input, toFixedNumber) {

        if (!(input === null || input === undefined)) {
            let inputNum = Number(input.toString().replace(/\,/g, ''));

            if (toFixedNumber) {
                inputNum = inputNum.toFixed(toFixedNumber);
            }

            return inputNum < 0 ? `(${Math.abs(inputNum)})` : inputNum;
        }

        return input;
    };
}
