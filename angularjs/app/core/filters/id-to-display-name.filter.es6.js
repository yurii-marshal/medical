export default function idToDisplayName() {
    return function(input) {
        const lastIndex = input.length + 1;

        // Return 2 first and 8 last characters from Claim/Order ID
        return `${input.substr(0, 2)}-${input.substr(lastIndex - 9, 8)}`;
    };
}
