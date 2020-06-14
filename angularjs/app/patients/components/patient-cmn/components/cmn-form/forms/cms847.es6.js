import {
    fieldTypes,
    questionItemTypes
} from './forms-types.es6';

export const getQuestionsForCMS847Data = [
    {
        title: '(a) Does the patient have a failed fusion of a joint other than the spine?',
        order: 6,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: '(a) Does the patient have a failed fusion of a joint other than the spine? (b) How many months prior to ordering the device did the patient have the fusion?',
        order: 7,
        type: questionItemTypes.GROUP_FIELDS,
        groups: [
            {
                label: 'a)',
                fields: [
                    {
                        name: 'A',
                        type: questionItemTypes.RADIO,
                        value: null,
                        options: [
                            { name: 'Y', id: '1' },
                            { name: 'N', id: '2' },
                            { name: 'D', id: '3' }
                        ]
                    }
                ]
            },
            {
                label: 'b)',
                fields: [
                    {
                        name: 'B',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Months',
                        value: null
                    }
                ]
            }
        ]
    },
    {
        title: 'Does the patient have a congenital pseudoarthrosis?',
        order: 8,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: ' (a) Is the device being ordered as a treatment of a failed single level spinal fusion surgery in a patient who has not had a recent repeat fusion? (b) How many months prior to ordering the device did the patient have the fusion?',
        order: 9,
        value: null,
        type: questionItemTypes.GROUP_FIELDS,
        groups: [
            {
                label: 'a)',
                fields: [
                    {
                        name: 'A',
                        type: questionItemTypes.RADIO,
                        value: null,
                        options: [
                            { name: 'Y', id: '1' },
                            { name: 'N', id: '2' },
                            { name: 'D', id: '3' }
                        ]
                    }
                ]
            },
            {
                label: 'b)',
                fields: [
                    {
                        name: 'B',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Months',
                        value: null
                    }
                ]
            }
        ]
    },
    {
        title: ' (a) Is the device being ordered as an adjunct to repeat single level spinal fusion surgery in a patient with a previously failed spinal fusion at the same level(s)? (b) How many months prior to ordering the device did the patient have the repeat fusion? (c) How many months prior to ordering the device did the patient have the previously failed fusion?',
        order: 10,
        value: null,
        type: questionItemTypes.GROUP_FIELDS,
        groups: [
            {
                label: 'a)',
                fields: [
                    {
                        name: 'A',
                        type: questionItemTypes.RADIO,
                        value: null,
                        options: [
                            { name: 'Y', id: '1' },
                            { name: 'N', id: '2' },
                            { name: 'D', id: '3' }
                        ]
                    }
                ]
            },
            {
                label: 'b)',
                fields: [
                    {
                        name: 'B',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Months',
                        value: null
                    }
                ]
            },
            {
                label: 'c)',
                fields: [
                    {
                        name: 'C',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Months',
                        value: null
                    }
                ]
            }
        ]
    },
    {
        title: 'Is the device being ordered following multi¬level spinal fusion surgery?',
        order: 11,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    },
    {
        title: 'Has there been at least one open surgical intervention for treatment of the fracture?',
        order: 12,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' },
            { name: 'D', id: '3' }
        ]
    }
];
