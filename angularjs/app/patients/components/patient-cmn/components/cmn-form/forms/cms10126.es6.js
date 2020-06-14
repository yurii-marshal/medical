import {
    fieldTypes,
    questionItemTypes
} from './forms-types.es6';

export const getQuestionsForCMS10126Data = [
    {
        title: 'Is there documentation in the medical record that supports the patient having a permanent non-function or disease of the structures that normally permit food to reach or be absorbed from the small bowel?',
        order: 1,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Is the enteral nutrition being provided for administration via tube? (i.e., gastrostomy tube, jejunostomy tube, nasogastric tube)',
        order: 2,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Print Supply Item/Service Procedure Code(s) of product.',
        order: 3,
        type: questionItemTypes.FIELDS,
        fields: [
            {
                name: 'A',
                type: fieldTypes.TEXT,
                placeholder: 'A',
                value: null
            },
            {
                name: 'B',
                type: fieldTypes.TEXT,
                placeholder: 'B',
                value: null
            }
        ]
    },
    {
        title: 'Calories per day for each corresponding Supply Item/Service Procedure Code(s).',
        order: 4,
        type: questionItemTypes.FIELDS,
        fields: [
            {
                name: 'A',
                type: fieldTypes.TEXT,
                placeholder: 'A',
                value: null
            },
            {
                name: 'B',
                type: fieldTypes.TEXT,
                placeholder: 'B',
                value: null
            }
        ]
    },
    {
        title: 'Check the number for method of administration?)',
        order: 5,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Syringe', id: '1' },
            { name: 'Gravity', id: '2' },
            { name: 'Pump', id: '3' },
            { name: 'Oral (i.e. drinking)', id: '4' }
        ]
    },
    {
        title: 'Days per week administered or infused (Enter 1–7)',
        order: 6,
        label: 'Days',
        type: questionItemTypes.INT,
        value: null
    },
    {
        title: 'Is there documentation in the medical record that supports the patient having permanent disease of the  gastrointestinal tract causing malabsorption severe enough to prevent maintenance of weight and strength commensurate with the patient’s overall health status?',
        order: 7,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Formula components:',
        order: 8,
        type: questionItemTypes.GROUP_FIELDS,
        groups: [
            {
                fields: [
                    {
                        name: 'A',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Amino Acid(ml/day)',
                        value: null
                    },
                    {
                        name: 'B',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Concentration(%)',
                        value: null
                    },
                    {
                        name: 'C',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'gms protein/day',
                        value: null
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'D',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Dextrose (ml/day)',
                        value: null
                    },
                    {
                        name: 'E',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Concentration(%)',
                        value: null
                    }
                ]
            },
            {
                fields: [
                    {
                        name: 'F',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Lipids (ml/day)',
                        value: null
                    },
                    {
                        name: 'G',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'days/week',
                        value: null
                    },
                    {
                        name: 'H',
                        type: fieldTypes.INT_MASK,
                        placeholder: 'Concentration(%)',
                        value: null
                    }
                ]
            }
        ]
    },
    {
        title: 'Check the number for the route of administration.',
        order: 9,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Central Line (Including PICC)', id: '1' },
            { name: 'Hemodialysis Access Line', id: '2' },
            { name: 'Peritoneal Catheter', id: '3' }
        ]
    }
];

