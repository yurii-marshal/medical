import { PdfFormConfig } from './pdf-form-review.interfaces';

export function PdfFormDefaultOptions(): PdfFormConfig {
    return {
        color: '#06aed5',
        lineWidth: 8,
        allowMultiple: false,
    };
}
