import { questionItemTypes } from './forms-types.es6';

export const getQuestionsForCMS848Data = [
    {
        title: 'Does the patient have chronic, intractable pain?',
        order: 1,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'How long has the patient had intractable pain? (Enter number of months, 1–99.)',
        order: 2,
        label: 'Months',
        type: questionItemTypes.INT,
        value: null
    },
    {
        title: 'Is the TENS unit being prescribed for any of the following conditions? (Check appropriate number)',
        order: 3,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Headache', id: '1' },
            { name: 'Visceral abdominal pain', id: '2' },
            { name: 'Pelvic pain', id: '3' },
            { name: 'Temporomandibular joint (TMJ) pain', id: '4' },
            { name: 'None of the above', id: '5' }
        ]
    },
    {
        title: 'Does the patient have chronic, intractable pain?',
        order: 4,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Has the patient received a TENS trial of at least 30 days?',
        order: 5,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'What is the date that you reevaluated the patient at the end of the trial period?',
        order: 6,
        label: 'Date',
        type: questionItemTypes.TEXT,
        value: null
    }
];

