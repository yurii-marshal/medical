import { questionItemTypes } from './forms-types.es6';

export const getQuestionsForCMS849Data = [
    {
        title: 'Does the patient have severe arthritis of the hip or knee?',
        order: 1,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Does the patient have a severe neuromuscular disease?',
        order: 2,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Is the patient completely incapable of standing up from a regular armchair or any chair in his/her home?',
        order: 3,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Once standing, does the patient have the ability to ambulate?',
        order: 4,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Have all appropriate therapeutic modalities to enable the patient to transfer from a chair to a standing position (e.g., medication, physical therapy) been tried and failed? If YES, this is documented in the patient’s medical records.',
        order: 5,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    }
];

