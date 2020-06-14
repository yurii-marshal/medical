export interface NikoBotActionRequest {
    Text: string;
    TimezoneOffset: string;
}

export interface NikoBotAttachment {
    msgId: string;
    id: string;
    title?: string;
    titleLink?: string | null;
    attachmentContent?: string;
    isMarkdown?: boolean;
    goToRef?: () => void;
}

export interface NikoBotMessage {
    id: string;
    msgContent: string;
    imageLink?: string | null;
    titleLink?: string | null;
    isMarkdown?: boolean;
    type?: string;
    msgTypeUser?: boolean;
    createdOn: string;
    createdBy: string;
    attachments?: string[];
    goToRef?: () => void;
}

export interface NikoBotState {
    msgs: {
        byId: {
            [id: string]: NikoBotMessage,
        };
        allIds: string[];
        count: number;
    };

    attachments: {
        byId: {
            [id: string]: NikoBotAttachment,
        },
        allIds: string[];
    };
}

export function initNikoBotState(): NikoBotState {
    return {
        msgs: {
            byId: {},
            allIds: [],
            count: 0,
        },
        attachments: {
            byId: {},
            allIds: [],
        },
    };
}

