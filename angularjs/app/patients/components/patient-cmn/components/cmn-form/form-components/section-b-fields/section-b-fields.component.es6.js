import template from './section-b-fields.html';
import { fieldTypes } from '../../forms/forms-types.es6';

class SectionBFieldsCtrl {
    constructor() {
        'ngInject';

        this.fieldTypes = fieldTypes;
    }

}

const sectionBFields = {
    bindings: {
        sectionFields: '='
    },
    template,
    controller: SectionBFieldsCtrl
};

export default sectionBFields;
