import { questionItemTypes } from './forms-types.es6';

export const getQuestionsForCMS846Data = [
    {
        title: 'Does the patient have chronic venous insufficiency with venous stasis ulcers?',
        order: 1,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'If the patient has venous stasis ulcers, have you seen the patient regularly over the past six months and treated the ulcers with a compression bandage system or compression garment?',
        order: 2,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Has the patient had radical cancer surgery or radiation for cancer that interrupted normal lymphatic drainage of the extremity?',
        order: 3,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Does the patient have a malignant tumor with obstruction of the lymphatic drainage of an extremity?',
        order: 4,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    },
    {
        title: 'Has the patient had lymphedema since childhood or adolescence?',
        order: 5,
        type: questionItemTypes.RADIO,
        value: null,
        options: [
            { name: 'Y', id: '1' },
            { name: 'N', id: '2' }
        ]
    }

];
