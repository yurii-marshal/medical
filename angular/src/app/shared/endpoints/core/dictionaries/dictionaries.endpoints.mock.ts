import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    ZipDictionaryState,
} from './zip-codes.interface';
import { normalizeZipDictionaries } from './zip-codes.normalizers';
import { normalizeContactTypesDictionary } from './contact-types.normalizers';
import { ContactType } from './contact-types.interface';
import { of } from 'rxjs/observable/of';

const zipData = {
    Count: 2089,
    Items: [
        {
            'custom-data': null,
            'description': 'Aguadilla',
            'id': 604,
            'text': '00604',
        },
        {
            'custom-data': null,
            'description': 'Salinas',
            'id': 704,
            'text': '00704',
        },
        {
            'custom-data': null,
            'description': 'Saint Thomas',
            'id': 804,
            'text': '00804',
        },
        {
            'custom-data': null,
            'description': 'Hampshire',
            'id': 1004,
            'text': '01004',
        },
        {
            'custom-data': null,
            'description': 'Hampden',
            'id': 1040,
            'text': '01040',
        },
        {
            'custom-data': null,
            'description': 'Hampden',
            'id': 1041,
            'text': '01041',
        },
        {
            'custom-data': null,
            'description': 'Hampden',
            'id': 1104,
            'text': '01104',
        },
        {
            'custom-data': null,
            'description': 'Worcester',
            'id': 1504,
            'text': '01504',
        },
        {
            'custom-data': null,
            'description': 'Worcester',
            'id': 1604,
            'text': '01604',
        },
        {
            'custom-data': null,
            'description': 'Middlesex',
            'id': 1704,
            'text': '01704',
        },
        {
            'custom-data': null,
            'description': 'Essex',
            'id': 1904,
            'text': '01904',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2040,
            'text': '02040',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2041,
            'text': '02041',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2043,
            'text': '02043',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2044,
            'text': '02044',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2045,
            'text': '02045',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2047,
            'text': '02047',
        },
        {
            'custom-data': null,
            'description': 'Bristol',
            'id': 2048,
            'text': '02048',
        },
        {
            'custom-data': null,
            'description': 'Suffolk',
            'id': 2204,
            'text': '02204',
        },
        {
            'custom-data': null,
            'description': 'Plymouth',
            'id': 2304,
            'text': '02304',
        },
    ],
};

const data = [
    {
        CategoryType: 1,
        Id: 1,
        Text: 'Home',
        Description: null,
    },
    {
        CategoryType: 1,
        Id: 2,
        Text: 'Work',
        Description: null,
    },
    {
        CategoryType: 1,
        Id: 3,
        Text: 'Cell',
        Description: null,
    },
    {
        CategoryType: 2,
        Id: 6,
        Text: 'Fax',
        Description: null,
    },
    {
        CategoryType: 1,
        Id: 4,
        Text: 'Other',
        Description: null,
    },
    {
        CategoryType: 3,
        Id: 5,
        Text: 'Email',
        Description: null,
    },
];

@Injectable()
export class DictionariesEndpointsMockService {

    constructor() {
    }

    public getZipDictionary(): Observable<ZipDictionaryState> {
        return of(normalizeZipDictionaries(zipData));
    }

    public getPatientContactTypes(): Observable<ContactType[]> {
        return of(normalizeContactTypesDictionary(data));
    }

    public getOrganizationContactTypes(): Observable<ContactType[]> {
        return of(normalizeContactTypesDictionary(data));
    }

}
