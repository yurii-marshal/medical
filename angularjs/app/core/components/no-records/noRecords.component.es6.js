import template from './noRecords.html';

class noRecordsCtrl {
    constructor() {
        'ngInject';
        this.isDefaultText = this.isDefaultText || true;
        this.isFullpage = this.isFullpage || false;
    }
}

const noRecords = {
    template,
    controller: noRecordsCtrl,
    bindings: {
        text: "@",
        isDefaultText: "<?",     // Boolean (default true), if false - "Sorry, there are no available" doesn't shows
        textArray: "<?",         // array of texts
        isFullpage: "<?"         // Boolean (default false)
    }
};

export default noRecords;