import {
    fieldTypes,
    questionItemTypes
} from './forms-types.es6';

export const getQuestionsForCMS484Data = [
    {
        title: 'Enter the result of most recent test taken on or before the certification date listed in Section A:',
        order: 1,
        type: questionItemTypes.FIELDS,
        fields: [
            {
                name: 'A',
                type: fieldTypes.GAS_MASK,
                placeholder: 'Arterial blood gas PO2(mm Hg):',
                value: null
            },
            {
                name: 'B',
                type: fieldTypes.INT_MASK,
                placeholder: 'Oxygen saturation test (%):',
                value: null
            },
            {
                name: 'C',
                type: fieldTypes.DATE,
                placeholder: 'Date of Test:',
                value: null
            }
        ]
    },
    {
        title: 'Was the test in Question 1 performed (1) with the patient in a chronic stable state as an outpatient, (2) within two days prior to discharge from an inpatient facility to home, or (3) under other circumstances?',
        order: 2,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: '1', id: '1' },
            { name: '2', id: '2' },
            { name: '3', id: '3' }
        ]
    },

    {
        title: 'Check the number of the condition of the test in Question 1: (1)At Rest; (2)During Exercise; (3)During Sleep.',
        order: 3,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: '1', id: '1' },
            { name: '2', id: '2' },
            { name: '3', id: '3' }
        ]
    },
    {
        title: 'If you are ordering portable oxygen, is the patient mobile within the home? If you are not ordering portable oxygen, check D.',
        order: 4,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Yes', id: '1' },
            { name: 'No', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Enter the highest oxygen flow rate ordered to this patient in liters per minute. If less than 1 LPM, enter "X".',
        order: 5,
        label: 'LPM:',
        type: questionItemTypes.TEXT,
        required: true,
        value: null
    },
    {
        title: 'If greater than 4 LPM is prescribed, enter results of most recent test taken on 4 LPM. This may be (a) arterial blood gas PO2 and/or (b) oxygen saturation test with patient in a chronic stable state. Enter date of test (c).',
        order: 6,
        type: questionItemTypes.FIELDS,
        fields: [
            {
                name: 'A',
                type: fieldTypes.GAS_MASK,
                placeholder: 'Arterial blood gas PO2(mm Hg):',
                value: null
            },
            {
                name: 'B',
                type: fieldTypes.INT_MASK,
                placeholder: 'Oxygen saturation test (%):',
                value: null
            },
            {
                name: 'C',
                type: fieldTypes.DATE,
                placeholder: 'Date of Test:',
                value: null
            }
        ]
    },
    {
        title: 'Does the patient have dependent edema due to congestive heart failure?',
        order: 7,
        type: questionItemTypes.RADIO,
        disable: true,
        value: null,
        options: [
            { name: 'Yes', id: '1' },
            { name: 'No', id: '2' }
        ]
    },
    {
        title: 'Does the patient have cor pulmonale or pulmonary hypertension documented by P pulmonale on an EKG or by an echocardiogram, gated blood pool scan or direct pulmonary artery pressure measurement?',
        order: 8,
        type: questionItemTypes.RADIO,
        disable: true,
        value: null,
        options: [
            { name: 'Yes', id: '1' },
            { name: 'No', id: '2' }
        ]
    },
    {
        title: 'Does the patient have a hematocrit greater than 56%?',
        order: 9,
        type: questionItemTypes.RADIO,
        disable: true,
        value: null,
        options: [
            { name: 'Yes', id: '1' },
            { name: 'No', id: '2' }
        ]
    },
    {
        title: 'Name of person answering.',
        order: 10,
        type: questionItemTypes.TEXT,
        label: 'Name:',
        value: null
    }
];

export function cms484Validator(questionsData) {
    let arterialBloodGasPo2 = questionsData[0].fields[0].value || '',
        oxygen = questionsData[0].fields[1].value || '';

    if ((arterialBloodGasPo2 > 5.59 && arterialBloodGasPo2 < 5.91) || oxygen.toString() === '89') {

        if (questionsData[8].value === null) {
            questionsData[8].value = 1;
            questionsData[8].disable = false;
        }

        if (questionsData[7].value === null) {
            questionsData[7].value = 1;
            questionsData[7].disable = false;
        }

        if (questionsData[6].value === null) {
            questionsData[6].value = 1;
            questionsData[6].disable = false;
        }

        return questionsData;
    }

    questionsData[6].value = null;
    questionsData[7].value = null;
    questionsData[8].value = null;
    questionsData[6].disable = true;
    questionsData[7].disable = true;
    questionsData[8].disable = true;

    return questionsData;
}
