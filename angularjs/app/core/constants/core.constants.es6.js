export const limitConstants = {
    ADD_INFO_MAXLENGTH: 80,
    NOTES_MAXLENGTH: 1023
};

// ORDER
export const orderTypeConstants = {
    SALES_ORDER_ID: 1,
    RESUPPLY_ORDER_ID: 2,
    SIMPLE_ORDER_ID: 3
};

export const orderStatusConstants = {
    HOLD_ORDER_ID: 1,
    NEW_ORDER_ID: 2,
    IN_PROGRESS_ORDER_ID: 3,
    CANCELLED_ORDER_ID: 4,
    COMPLETED_ORDER_ID: 5
};

export const orderConfirmationContactTypes = {
    EMAIL_ID: 'email',
    FAX_ID: 'fax'
};

export const priceHoldReasonConstants = {
    AUTORIZATION_REQUIRED_ID: 'AuthorizationRequired',
    DOCUMENTATION_REQUIRED_ID: 'DocumentationRequired',
    CMN_REQUIRED_ID: 'CmnRequired',
    OTHER_ID: 'Other'
};

export const orderItemsStatusConstants = {
    PENDING_STATUS_ID: 1,
    BACKORDERED_STATUS_ID: 2,
    SHIPPED_STATUS_ID: 3,
    DELIVERED_STATUS_ID: 4
};

// RENDERING PROVIDER
export const renderingProviderTypeConstants = {
    ORGANIZATION_TYPE_ID: 'Organization',
    PERSON_TYPE_ID: 'Person'
};

// PATIENT
export const patientRelationshipConstants = {
    SELF_ID: 'Self',
    SPOUSE_ID: 'Spouse',
    PARENT_ID: 'Parent',
    CHILD_ID: 'Child'
};

export const patientGenderConstants = {
    UNKNOWN_GENDER_ID: 'Unknown',
    MALE_GENDER_ID: 'Male',
    FEMALE_GENDER_ID: 'Female'
};

export const patientGenderConstantsV1 = {
    UNKNOWN_GENDER_ID: '0',
    MALE_GENDER_ID: '1',
    FEMALE_GENDER_ID: '2'
};

export const patientStatusConstants = {
    ACTIVE_STATUS_ID: 1,
    INACTIVE_STATUS_ID: 2,
    HOLD_STATUS_ID: 3
};

export const patientStatusEnumConstants = {
    ACTIVE_STATUS_ID: 'Active',
    INACTIVE_STATUS_ID: 'Inactive',
    HOLD_STATUS_ID: 'Hold'
};

export const inventoryStatusConstants = {
    ACTIVE_STATUS_ID: 'Active',
    INACTIVE_STATUS_ID: 'Inactive',
    RETIRED_STATUS_ID: 'Retired'
};

export const purchaseOrderStatusConstants = {
    NEW_STATUS_ID: 'New',
    SUBMITTED_STATUS_ID: 'Submitted',
    IN_PROGRESS_STATUS_ID: 'InProgress',
    FULFILLED_STATUS_ID: 'Fulfilled'
};

export const purchaseOrderAuditTypeConstants = {
    CREATED_ID: 'Created',
    UPDATED_ID: 'Updated',
    ITEM_ADDED_ID: 'ItemAdded',
    ITEM_UPDATED_ID: 'ItemUpdated',
    ITEM_REMOVED_ID: 'ItemRemoved',
    ITEM_RECEIVED_ID: 'ItemReceived',
    STATUS_CHANGED_ID: 'StatusChanged'
};

export const patientInactivityReasonConstants = {
    OTHER_ID: 12
};

// CONTACT TYPES
export const contactTypeConstants = {
    EMAIL_ID: 'Email',
    FAX_ID: 'Fax',
    PHONE_ID: 'Phone',
    WEBSITE_ID: 'Website'
};
// TODO remove after all types will be enums
export const contactTypeIdConstants = {
    '1': contactTypeConstants.EMAIL_ID,
    '2': contactTypeConstants.FAX_ID,
    '8': contactTypeConstants.PHONE_ID,
    '16': contactTypeConstants.WEBSITE_ID
};

// PATIENT CONTACT TYPES
export const patientContactTypeConstants = {
    HOME_ID: 1,
    WORK_ID: 2,
    CELL_ID: 3,
    OTHER_ID: 4,
    EMAIL_ID: 5,
    FAX_ID: 6
};

// PATIENT STATUS TYPES
export const patientStatusesConstants = {
    ACTIVE_ID: 1,
    INACTIVE_ID: 2,
    HOLD_ID: 3
};

export const importStatusConstants = {
    PROCESSING_STATUS_ID: 2,
    PROCESSED_STATUS_ID: 3,
    CANCELED_STATUS_ID: 4,
    FAILED_STATUS_ID: 5
};

export const importItemsTypeConstants = {
    PRODUCTS_TYPE: 'Products',
    NOTES_TYPE: 'Notes'
};

export const statementsGenerationStatusConstants = {
    PROCESSING_STATUS_ID: 'Processing',
    PROCESSED_STATUS_ID: 'Processed',
    CANCELED_STATUS_ID: 'Canceled',
    FAILED_STATUS_ID: 'Failed'
};

export const cmnCertificationTypesConstants = {
    INITIAL_TYPE_ID: 1,
    REVISED_TYPE_ID: 2,
    RECERTIFICATION_TYPE_ID: 3
};

export const cmnRevisionTypesConstants = {
    INITIAL_TYPE_ID: 1,
    RECERTIFICATION_TYPE_ID: 2
};

export const expansePayerTypes = {
    INSURANCE_ID: 'Insurance',
    PATIENT_ID: 'Patient'
};
