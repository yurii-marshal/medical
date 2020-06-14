export default function fullTimeFormat() {
    return function(input) {
        let time = parseFloat(input);

        const hoursNum = time / 60 / 60;
        const hours = hoursNum >= 1 ? Math.floor(hoursNum) + ' hrs.' : '';

        const minutesNum = hoursNum * 60 - Math.floor(hoursNum) * 60;
        const minutes = minutesNum >= 1 ? Math.floor(minutesNum) + ' mins.' : '';

        const secondsNum = minutesNum * 60 - Math.floor(minutesNum) * 60;
        const seconds = secondsNum ? Math.floor(secondsNum) + ' secs.' : '';

        return `${hours} ${minutes} ${seconds}`;
    };
}
