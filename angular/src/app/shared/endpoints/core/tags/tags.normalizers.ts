import { Tag, TagsState } from './tags.interface';

export function normalizeTags(dictionaries: any): TagsState {
    dictionaries = dictionaries.Items || dictionaries;
    const tagsState: TagsState = {
        byId: {},
        allIds: [],
    };

    dictionaries.forEach((tags) => {
        const tag: Tag = {
            Id: tags.Id,
            Name: tags.Name,
        };
        tagsState.byId[tag.Id] = tag;
    });

    tagsState.allIds = Object.keys(tagsState.byId);
    return tagsState;
}
