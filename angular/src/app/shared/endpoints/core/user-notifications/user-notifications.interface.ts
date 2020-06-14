export interface Notification {
    id: string;
    typeId: string;
    date: string;
    title: string;
    text: string;
    displayText?: string;
}

export interface  NotificationType {
    id: string;
    text: string;
    description: string;
}

export interface NotificationState {
    notifications: {
        count?: number;
        byId: {
            [id: string]: Notification,
        };
        allIds: string[];
    };
    types: {
        byId: {
            [id: string]: NotificationType,
        };
        allIds: string[];
    };
}

export function initNotificationState(): NotificationState {
    return {
        notifications: {
            byId: {},
            allIds: [],
        },
        types: {
            byId: {},
            allIds: [],
        },
    };
}
