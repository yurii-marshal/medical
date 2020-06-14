import template from './expandable-text-btn.html';

class expandableTextBtnCtrl {
    constructor() {
        this.maxLength = this.maxLength || 150;
        this.shortText = this._getShortText(this.text, this.maxLength);
        this.expandable = !(this.shortText === this.text);
        this.isExpanded = false;

        this.setText();
    }

    setText() {
        this.displayText = this.expandable && !this.isExpanded ? `${this.shortText}...` : this.text;
    }

    toggleExpand($event) {
        $event.stopPropagation();
        this.isExpanded = !this.isExpanded;
        this.setText();
    }

    _getShortText(text, length) {
        const arr = text.match(/^(.*?\n.*?)(\n[^]*)$/m);

        if (arr && arr[2] && arr[2].length <= length) {
            return arr[1];
        } else if (text.length >= length) {
            return text.substring(0, length);
        }

        return text;

    }
}

const expandableTextBtn = {
    bindings: {
        text: '<',
        maxLength: '<?'
    },
    template,
    controller: expandableTextBtnCtrl
};

export default expandableTextBtn;
