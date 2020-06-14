import { orderTrackingStatusesConstants } from '../constants/order.constants.es6';

/**
 * @description Add css class for tracking items status label color
 * @param id
 * @returns {string}
 */

export function mapTrackingItemStatusClass(id) {
    switch (id) {
        case orderTrackingStatusesConstants.PENDING_ID:   // Pending
            return 'pending';
        case orderTrackingStatusesConstants.BACKORDERED_ID:   // Backordered
            return 'dark-blue';
        case orderTrackingStatusesConstants.SHIPPED_ID:   // Shipped
            return 'blue';
        case orderTrackingStatusesConstants.DELIVERED_ID:   // Delivered
            return 'active';
        case orderTrackingStatusesConstants.DROP_SHIPPED_ID:   // region DropShip Requested
            return 'pending';
        case orderTrackingStatusesConstants.REJECTED_ID:   // Rejected
            return 'rejected';
        case orderTrackingStatusesConstants.ACCEPTED_ID:   // Accepted
            return 'accepted';
        default:
            break;
    }
}

