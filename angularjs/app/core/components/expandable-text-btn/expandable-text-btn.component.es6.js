class expandableTextCtrl {
    constructor() {
        this.maxLength = this.maxLength || 150;
        this.expandable = this.text ? this.text.length > this.maxLength : false;
        this.isExpanded = false;

        this.setText();
    }

    setText() {
        this.displayText = this.expandable && !this.isExpanded ? `${this.text.substring(0, this.maxLength)}...` : this.text;
    }
}

const expandableText = {
    bindings: {
        text: '<',
        maxLength: '<?'
    },
    template: '{{$ctrl.displayText}}',
    controller: expandableTextCtrl
};

export default expandableText;
