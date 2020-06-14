// PRICINGS
export const pricingTypeConstants = {
    PURCHASE_TYPE_ID: 'Purchase',  // old val: 1
    RENTAL_TYPE_ID: 'Rental', // old val: 2,
    MULTIPLE_TYPE_ID: 'MultiplePriceOptions'
}

export const rentalHintConstants = {
    DATE_OF_SERVICE: 'Date of Service reflects the current date of service period (anniversary or span date). If the date of service is edited to a prior date, the system will automatically create any invoices from that prior date till current date according to available price record. Any edits to the Date of Service will impact future invoices created.',
    BILLING_PERIOD: 'The Billing Period reflects the current billing period according to the available price record. If you change the Billing Period (i.e. Change it from Period 2 to Period 3) the next invoice the system will create will be for period 4.'
};

// TODO remove after dictionary change not only in billing
export const pricingTypeConstantsV1 = {
    PURCHASE_TYPE_ID: '1',  // old val: 1
    RENTAL_TYPE_ID: '2' // old val: 2
}

export const pricingCyclesConstants = {
    DAY_ID: 'Day',
    WEEK_ID: 'Week',
    MONTH_ID: 'Month'
}

// INVOICE
export const invoiceStatusConstants = {
    NEW_STATUS_ID: 'New', // 1
    OPEN_STATUS_ID: 'Open', // 2
    HOLD_STATUS_ID: 'Hold', // 3
    SUBMITTED_STATUS_ID: 'Submitted', // 4
    REJECTED_STATUS_ID: 'Rejected', // 9
    DENIED_STATUS_ID: 'Denied', // 10
    VOID_STATUS_ID: 'Void', // 11
    CLOSED_STATUS_ID: 'Closed' // 99
}

// TODO remove after dictionary change not only in billing
export const invoiceStatusConstantsV1 = {
    NEW_STATUS_ID: '1', // 1
    OPEN_STATUS_ID: '2', // 2
    HOLD_STATUS_ID: '3', // 3
    SUBMITTED_STATUS_ID: '4', // 4
    REJECTED_STATUS_ID: '9', // 9
    DENIED_STATUS_ID: '10', // 10
    VOID_STATUS_ID: '11', // 11
    CLOSED_STATUS_ID: '99' // 99
}

export const invoiceAllowedActionConstants = {
    PRINT_ACTION_ID: 'Print',
    CMS1500_ACTION_ID: 'Cms1500',
    EXPORT_ACTION_ID: 'Export',
    SUBMIT_ACTION_ID: 'Submit',
    RESUBMIT_ACTION_ID: 'Resubmit'
}

export const auditDetailsTypeConstants = {
    INVOICE_ACKNOWLEDGMENT_ID: 'InvoiceAcknowledgment', // 1
    IMPLEMENTATION_ACKNOWLEDGMENT_ID: 'ImplementationAcknowledgment' // 2
}

export const auditDetailsStatusConstants = {
    REJECTED_STATUS_ID: 'Rejected', // 1 old
    ACCEPTED_STATUS_ID: 'Accepted' // 2 old
}

export const invoiceResubmissionCodeConstants = {
    ORIGINAL_ID: 'Original',
    CORRECTED_ID: 'Corrected',
    REPLACEMENT_ID: 'Replacement',
    CANCEL_ID: 'Cancel'
}

// INVOICE SERVICE LINE SystemAttributes
export const systemAttributesCategoryConstants = {
    PRICE_OPTION_CATEGORY_ID: 'PriceOption',
    DIFFERS_CATEGORY_ID: 'Differs',
    RESTRICTIONS_CATEGORY_ID: 'Restriction',
    OTHER_CATEGORY_ID: 'Other'
}


// INSURANCE
export const insurancePriorityConstants = {
    PRIMARY_ID: 'Primary',
    SECONDARY_ID: 'Secondary',
    TERTIARY_ID: 'Tertiary'
}

// PAYMENT
export const paymentTypeConstants = {
    PATIENT_TYPE_ID: 'Patient',
    PAYER_TYPE_ID: 'Insurance'
}

export const billToTypes = {
    PATIENT_ID: 'Patient',
    PAYER_TYPE_ID: 'Payer'
}


export const paymentStatusConstants = {
    NEW_STATUS_ID: 'New',
    APPLIED_STATUS_ID: 'Applied',
    UNAPPLIED_STATUS_ID: 'Unapplied',
    FAILED_STATUS_ID: 'Failed',
    COMPLETED_STATUS_ID: 'Completed'
}

export const paymentServiceLineStatusConstants = {
    APPLIED_STATUS_ID: 'Applied',
    FAILED_STATUS_ID: 'Failed'
}

export const importPaymentStatusConstants = {
    PROCESSED_STATUS_ID: 'Processed',
    FAILED_STATUS_ID: 'Failed'
}

export const paymentAdjustmentGroupConstants = {
    CO_ID: 'CO', // Contractual Obligation
    PI_ID: 'PI', // Payor Initiated Reductions
    OA_ID: 'OA', // Other Adjustments
    PR_ID: 'PR'  // Patient Responsibility
}

// DENIALS
export const denialsStatusConstants = {
    PAID_STATUS_ID: 'Paid',
    NEW_STATUS_ID: 'New',
    RESUBMITED_STATUS_ID: 'Resubmitted',
    WRITE_OFF_STATUS_ID: 'WriteOff',
    IGNORE_STATUS_ID: 'Ignore'
}

// SIGNATURES ON FILE
export const providerSignatureOnFileConstants = {
    YES_ID: 'Yes', // 2
    NO_ID: 'No' // 1
}

export const insuredSignatureOnFileConstants = {
    YES_ID: 'Yes',
    NO_ID: 'No'
}

export const patientSignatureOnFileConstants = {
    YES_ID: 'Yes',
    NO_ID: 'No'
}

export const acceptAssignmentConstants = {
    YES_ID: 'Yes',
    NO_ID: 'No'
}

// BILLING PROVIDER
export const billingProviderTaxTypeConstants = {
    EMPLOER_IDENTIFICATION_NUMBER_ID: 'EmployerIdentitificationNumber',
    SOCIAL_SECURITY_NUMBER_ID: 'SocialSecurityNumber'
}

// ADJUSTMENTS
export const adjustmentTypeConstants = {
    PAYMENT_ID: 'Payment',
    REVERSAL_ID: 'Reversal',
    DENIAL_ID: 'Denial',
    ADJUSTMENT_ID: 'Adjustment'
}

export const adjustmentSourceConstants = {
    PATIENT_ID: 'Patient',
    PROVIDER_ID: 'Provider',
    PAYER_ID: 'Payer'
}

export const invoiceTaskStatusConstants = {
    Open: 'Open',
    Completed: 'Completed',
    Archived: 'Archived',
};

export const invoiceTaskPriorityConstants = {
    Low: 'Low',
    Normal: 'Normal',
    High: 'High',
};
