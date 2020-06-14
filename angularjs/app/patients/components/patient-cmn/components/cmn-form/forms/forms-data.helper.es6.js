import { getQuestionsForCMS847Data } from './cms847.es6';
import { getQuestionsForCMS848Data } from './cms848.es6';
import { getQuestionsForCMS849Data } from './cms849.es6';
import { getQuestionsForCMS10126Data } from './cms10126.es6';
import { getQuestionsForCMS846Data } from './cms846.es6';
import { getQuestionsForCMS484Data } from './cms484.es6';
import { formQuestionsTypes } from './forms-types.es6';

export function getQuestionsForSectionB(type) {
    let outObj = null;

    switch (type) {

        case formQuestionsTypes.CMS847:
            outObj = getQuestionsForCMS847Data;
            break;
        case formQuestionsTypes.CMS848:
            outObj = getQuestionsForCMS848Data;
            break;
        case formQuestionsTypes.CMS849:
            outObj = getQuestionsForCMS849Data;
            break;
        case formQuestionsTypes.CMS10126:
            outObj = getQuestionsForCMS10126Data;
            break;
        case formQuestionsTypes.CMS846:
            outObj = getQuestionsForCMS846Data;
            break;
        case formQuestionsTypes.CMS484:
            outObj = getQuestionsForCMS484Data;
            break;
        default:
            break;
    }

    return _.cloneDeep(outObj);
}
