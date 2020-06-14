import { paymentTypeConstants } from '../../../core/constants/billing.constants.es6';

export function mapPaymentInvoiceForServer(clientInvoice, sourceType, forUpdate) {
    const serverInvoice = {
        Charge: clientInvoice.Charge.Amount,
        InvoiceId: clientInvoice.InvoiceId,
        Id: clientInvoice.Id,
        ValidationKey: clientInvoice.ValidationKey,
        Paid: clientInvoice.Paid.Amount
    };

    if (forUpdate) {
        serverInvoice.AddedServices = [];
        serverInvoice.UpdatedServices = [];
    } else {
        serverInvoice.Services = [];
    }

    if (paymentTypeConstants.PAYER_TYPE_ID === sourceType) {
        serverInvoice.Coverage = clientInvoice.Coverage ? clientInvoice.Coverage.Id : null;
    }

    if (clientInvoice.Adjustments && paymentTypeConstants.PAYER_TYPE_ID === sourceType) {
        serverInvoice.Adjustments = clientInvoice.Adjustments.map((adjustment) => {
            return {
                Reason: adjustment.Reason.Id,
                Group: adjustment.Group.Id,
                Amount: adjustment.Amount.Amount
            };
        });
    }

    if (clientInvoice.RemarkCodes && paymentTypeConstants.PAYER_TYPE_ID === sourceType) {
        serverInvoice.RemarkCodes = clientInvoice.RemarkCodes.map((remarkCode) => remarkCode.Id);
    }

    if (clientInvoice.Services) {
        const filterClientServices = (service) => {
            return sourceType === paymentTypeConstants.PAYER_TYPE_ID || (typeof service.Paid.Amount === 'number');
        };

        clientInvoice.Services.filter(filterClientServices).forEach((service) => {
            const outService = {
                Id: service.Id,
                ValidationKey: service.ValidationKey,
                ServiceId: service.ServiceId,
                Paid: service.Paid.Amount
            };

            if (!outService.Id || !forUpdate) {
                outService.Details = {
                    ServicePeriod: {
                        From: service.ServicePeriod.From,
                        To: service.ServicePeriod.To
                    },
                    Modifiers: null,
                    HcpcsCode: service.HcpcsCode,
                    Name: service.Name || 'test Id', // Waiting for fix on search invoice
                    Quantity: service.Quantity,
                    Charge: service.Charge.Amount,
                    Notes: service.Notes
                };

                if (service.Modifiers &&
                    service.Modifiers.Level1) {

                    outService.Details.Modifiers = {
                        Level1: service.Modifiers.Level1 && service.Modifiers.Level1.Id,
                        Level2: service.Modifiers.Level2 && service.Modifiers.Level2.Id,
                        Level3: service.Modifiers.Level3 && service.Modifiers.Level3.Id,
                        Level4: service.Modifiers.Level4 && service.Modifiers.Level4.Id
                    };
                }
            }

            if (service.Adjustments && paymentTypeConstants.PAYER_TYPE_ID === sourceType) {

                outService.Allowance = service.Allowed ? service.Allowed.Amount : null;

                outService.Adjustments = service.Adjustments.map((adjustment) => {
                    return {
                        Reason: adjustment.Reason.Id,
                        Group: adjustment.Group.Id,
                        Amount: adjustment.Amount.Amount
                    };
                });
            }

            if (outService.Id && forUpdate) {
                serverInvoice.UpdatedServices.push(outService);
            } else if (forUpdate) {
                serverInvoice.AddedServices.push(outService);
            } else {
                serverInvoice.Services.push(outService);
            }
        });
    }

    return serverInvoice;
}

export function mapPaymentAdjustmentForServer(adjustment) {
    return {
        ProviderRefId: adjustment.ProviderRefId,
        Amount: adjustment.Amount.Amount,
        Date: adjustment.Date,
        PLBCode: adjustment.PLBCode.Id,
        Description: adjustment.Description
    };
}

export function mapModalInvoiceToClientInvoice(invoice) {

    const outInvoice = {
        DisplayId: invoice.DisplayId,
        InvoiceId: invoice.InvoiceId,
        Id: null,
        Coverage: invoice.BillToPayerPriority,
        Status: invoice.Status,
        Customer: invoice.Customer,
        Charge: invoice.Charge,
        Balance: invoice.Balance,
        Paid: {
            Amount: null,
            Currency: '$'
        },
        PR: {
            Amount: null,
            Currency: '$'
        },
        RemarkCodes: [],
        ValidationKey: guid(),
        Adjustments: [],
        Services: []
    };

    if (invoice.RemarkCodes) {
        outInvoice.RemarkCodes = invoice.RemarkCodes.map((remarkCode) => remarkCode.Id);
    }

    if (invoice.ServiceLines) {
        invoice.ServiceLines.forEach((serviceLine) => {
            outInvoice.Services.push({
                ServiceId: serviceLine.Id,
                ServicePeriod: serviceLine.ServicePeriod,
                HcpcsCode: serviceLine.HcpcsCode ? serviceLine.HcpcsCode.Name : null,
                Modifiers: serviceLine.Modifiers,
                Quantity: serviceLine.Quantity,
                Charge: serviceLine.Charge,
                Balance: serviceLine.Balance,
                Name: serviceLine.Name,
                Paid: {
                    Amount: null,
                    Currency: '$'
                },
                Allowed: {
                    Amount: null,
                    Currency: '$'
                },
                Notes: null,
                ValidationKey: guid(),
                Adjustments: []
            });
        });
    }

    return outInvoice;
}

export function mapServiceModalDataToClientService(serviceLine) {
    const outServiceLine = {
        ServiceId: serviceLine.Id,
        ServicePeriod: serviceLine.ServicePeriod,
        HcpcsCode: serviceLine.HcpcsCode.Name,
        Name: serviceLine.Name,
        Modifiers: serviceLine.Modifiers,
        Quantity: serviceLine.Quantity,
        Charge: serviceLine.Charge,
        Balance: serviceLine.Balance,
        Paid: {
            Amount: null,
            Currency: '$'
        },
        Allowed: {
            Amount: null,
            Currency: '$'
        },
        ValidationKey: guid(),
        Notes: '',
        Adjustments: []
    };

    return outServiceLine;
}
