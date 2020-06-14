export interface GetUsersParams {
    'filter.fullName'?: string;
    pageIndex?: number;
    pageSize?: number;
    sortExpression?: string;
}

interface User {
    id: string;
    name: string;
}
export interface IHelpdescRequest {
    description: string;
    subject: string;
    files: any[];
}

export interface UsersState {
    users: {
        count?: number;
        byId: {
            [id: string]: User,
        };
        allIds: string[];
    };
}

export function initUsersState(): UsersState {
    return {
        users: {
            byId: {},
            allIds: [],
        },
    };
}
