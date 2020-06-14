export interface PdfTemplateField {
    Field: string;
    Value: string;
}

export interface PdfTemplateFile {
    Name: string;
    Bytes: string;
}

export interface PdfTemplate {
    Name: string;
    File?: PdfTemplateFile;
    Description: string;
    Fields: PdfTemplateField[];
}
