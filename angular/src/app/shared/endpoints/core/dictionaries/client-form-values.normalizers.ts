import { ClientFormValue } from '@shared/endpoints/core/dictionaries/client-form-values.interface';

export function normalizeClientFormValues(response: any): ClientFormValue[] {
    return response.map((item) => ({
        id: item.Id,
        name: item.Name,
        description: item.Description,
    }));
}
