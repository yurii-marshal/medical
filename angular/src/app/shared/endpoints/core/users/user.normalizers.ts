import { UsersState } from './users.interfaces';

export function normalizeUsersData(usersData: any): UsersState {

    const usersState: UsersState = {
        users: {
            byId: {},
            allIds: [],
        },
    };

    usersState.users.count = usersData.Count;

    usersData.Items.forEach((item) => {
        usersState.users.byId[item.Id.toString()] = {
            id: item.Id.toString(),
            name: `${item.Name.FirstName} ${item.Name.MiddleName ? item.Name.MiddleName : ''} ${item.Name.LastName}`,
        };
    });

    usersState.users.allIds = Object.keys(usersState.users.byId);

    return usersState;

}

export function normalizeUserPermissions(userPermissions): any {
    return userPermissions;
}
