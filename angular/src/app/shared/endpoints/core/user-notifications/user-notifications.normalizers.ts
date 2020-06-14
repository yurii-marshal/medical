import { NotificationState } from './user-notifications.interface';

export function normalizeNotificationData(notificationData: any): NotificationState {
    const notificationState: NotificationState = {
        notifications: {
            byId: {},
            allIds: [],
        },
        types: {
            byId: {},
            allIds: [],
        },
    };

    notificationState.notifications.count = notificationData.Count;

    notificationData.Items.forEach((item) => {
        notificationState.notifications.byId[item.Id.toString()] = {
            id: item.Id.toString(),
            typeId: item.Type.Id.toString(),
            date: item.Date,
            title: item.Title,
            text: item.Text,
        };

        notificationState.types.byId[item.Type.Id.toString()] = {
            id: item.Type.Id.toString(),
            text: item.Type.Text,
            description: item.Description,
        };
    });

    notificationState.types.allIds = Object.keys(notificationState.types.byId);
    notificationState.notifications.allIds = Object.keys(notificationState.notifications.byId);

    return notificationState;
}
