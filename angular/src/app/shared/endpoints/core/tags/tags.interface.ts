export interface Tag {
    Id: string;
    Name: string;
}

export interface TagsState {
    byId: {
        [id: string]: Tag,
    };
    allIds: string[];
}
