export const orderTrackingStatusesConstants = {
    PENDING_ID: 'Pending',
    BACKORDERED_ID: 'Backordered',
    SHIPPED_ID: 'Shipped',
    DELIVERED_ID: 'Delivered',
    DROP_SHIPPED_ID: 'DropShipped',
    REJECTED_ID: 'Rejected',
    ACCEPTED_ID: 'Accepted'
};

// QUICK SHIP
export const shipmentDeliveryMethodConstants = {
    INVENTORY_ID: 'Inventory',
    MANUALLY_ID: 'Manually',
    DROP_SHIP_ID: 'DropShip'
};

export const searchEquipmentStatusConstants = {
    FOUND_ID: 'Found',
    NOT_FOUND_ID: 'NotFound',
    NOT_DETERMINED_ID: 'NotDetermined'
};

export const searchEquipmentLookupKeyConstants = {
    SERIAL_NUMBER_ID: '1',
    LOT_NUMBER_ID: '2',
    DEVICE_ID: '3' // TODO find out if it exists
};
