function isAdBlockOn() {
    var addBlockElement = document.getElementById('adblock');

    if (addBlockElement) {
        return getComputedStyle(addBlockElement).display === 'none';
    }

}
