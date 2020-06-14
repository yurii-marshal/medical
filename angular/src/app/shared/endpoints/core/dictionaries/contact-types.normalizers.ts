import { ContactType } from './contact-types.interface';

export function normalizeContactTypesDictionary(response: any): ContactType[] {
    return response.map((item) => ({
        id: item.Id,
        text: item.Text,
        categoryType: item.CategoryType,
    }));
}
