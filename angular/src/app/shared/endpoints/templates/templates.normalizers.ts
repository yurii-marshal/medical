import {
    PdfFormField,
    PdfFormInfo,
} from '@shared/modules/pdf-form-review/models/pdf-form-review.interfaces';

export function normalizePdfFormInfo(response: PdfFormInfo): PdfFormInfo {
    const formFields: PdfFormField[] = [];

    for (const page of response.Pages) {
        for (const field of page.Fields) {
            if (formFields.find((item) => item.FullName === field.FullName)) {
                continue;
            }
            formFields.push(field);
        }
    }
    response.Fields = formFields;

    return response;
}
