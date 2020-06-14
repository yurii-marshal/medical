export interface AppNavigationItem {
    name: string;
    route: string;
    imageUrl?: string;
    topMenu?: string;
    active: boolean;
    isHide: boolean;
}

export function getNavigationItemsConfig(): AppNavigationItem[] {
    return [
        {
            name: 'Calendar',
            route: '/calendar',
            imageUrl: 'assets/images/main-menu/calendar.svg',
            topMenu: 'Calendar',
            active: false,
            isHide: false,
        },
        {
            name: 'Patients',
            route: '/patients',
            imageUrl: 'assets/images/main-menu/patients.svg',
            topMenu: 'Patients',
            active: false,
            isHide: false,
        },
        {
            name: 'Orders',
            route: '/orders',
            imageUrl: 'assets/images/main-menu/orders.svg',
            topMenu: 'Orders',
            active: false,
            isHide: false,
        },
        {
            name: 'Reports',
            route: '/reports-dashboard',
            imageUrl: 'assets/images/main-menu/reports.svg',
            topMenu: 'Reports',
            active: false,
            isHide: false,
        },
        {
            name: 'Management',
            route: '/management/personnel',
            imageUrl: 'assets/images/main-menu/management.svg',
            topMenu: 'Management',
            active: false,
            isHide: false,
        },
        {
            name: 'Billing',
            route: '/billing/invoices',
            imageUrl: 'assets/images/main-menu/billing.svg',
            topMenu: 'Billing',
            active: false,
            isHide: false,
        },
        {
            name: 'Inventory',
            route: '/inventory/list',
            imageUrl: 'assets/images/main-menu/inventory.svg',
            topMenu: 'Inventory',
            active: false,
            isHide: false,
        },
        {
            name: 'Inbox',
            route: '/inbox/list',
            imageUrl: 'assets/images/main-menu/inbox.svg',
            topMenu: 'Inbox',
            active: false,
            isHide: false,
        },
    ];
}
