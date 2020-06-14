import { NikoBotState } from './nlp.interface';

export function normalizeNikoBotData(nikoBotData: any): NikoBotState {

    const nikoBotState: NikoBotState = {
        msgs: {
            byId: {},
            allIds: [],
            count: nikoBotData.length,
        },
        attachments: {
            byId: {},
            allIds: [],
        },
    };

    nikoBotData.forEach((item, index) => {
        const msgId = `${index}${item.CreatedOn}`;

        nikoBotState.msgs.byId[msgId] = {
            id: msgId,
            msgContent: item.Text,
            imageLink: item.ImageLink || null,
            titleLink: item.TitleLink || null,
            isMarkdown: item.Markdown,
            type: item.Type,
            createdOn: item.CreatedOn,
            createdBy: item.CreatedBy,
            attachments: [],
            goToRef: () => {},
        };

        item.Attachments.forEach((a) => {
            const attachId = `${a.Title}${msgId}`;
            nikoBotState.msgs.byId[msgId].attachments.push(attachId);

            nikoBotState.attachments.byId[attachId] = {
                msgId,
                id: attachId,
                title: a.Title,
                titleLink: a.TitleLink,
                attachmentContent: a.Text,
                isMarkdown: a.Markdown,
                goToRef: () => {},
            };
        });
    });

    nikoBotState.msgs.allIds = Object.keys(nikoBotState.msgs.byId);
    nikoBotState.attachments.allIds = Object.keys(nikoBotState.attachments.byId);

    return nikoBotState;

}
