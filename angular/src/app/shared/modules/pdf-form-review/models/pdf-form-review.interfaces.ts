export interface PdfFormInfo {
    Pages: PdfFormPage[];
    Fields?: PdfFormField[];
    Name?: string;
}

export interface PdfFormPage {
    Image: string;
    Index: number;
    Size: PdfFormSize;
    Fields: PdfFormField[];
}

export interface PdfFormSize {
    Width: number;
    Height: number;
}

export interface PdfFormField {
    Font: {
        Size: number;
        Name: string;
        Color: string;
    };
    Rect: PdfFormCoords;
    Type: {
        Id: string;
        Name: string;
    };
    Index: number;
    IndexOnPage: number;
    Required: boolean;
    FullName: string;
    PartialName: string;
    ParentName: string;
    Text: string;
    Multiline: boolean;
    Checked: boolean;
    Options: PdfFormOptions[];
    CheckValue: string;
    ToolTip: string;
    BoxStyle: {
        Id: string;
        Name: string;
    };
}

export interface PdfFormCoords {
    X: number;
    Y: number;
    Height: number;
    Width: number;
}

export interface PdfFormOptions {
    Index: number;
    Value: string;
    Name: string;
    Selected: boolean;
}

export interface PdfFormConfig {
    color?: string;
    lineWidth?: number;
    allowMultiple?: boolean;
}

export interface PdfFormObject {
    pageId: number;
    fieldId: number;
}
