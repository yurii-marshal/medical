export default class ExpenseEstimatesService {
    constructor(
        coreOrderService
    ) {
        'ngInject';

        this.coreOrderService = coreOrderService;

        this.model = this.getEmptyModel();
    }

    getModel() {
        return this.model;
    }

    getEmptyModel() {
        return {
            Charge: null,
            Allowed: null,
            Deductible: null,
            Copay: null,
            Coinsurance: null,
            PatientResposibility: null,
            InsuranceResposibility: null,
            Payers: [

                // Example payer data

                // {
                //     PayerType:{
                //         Id:"Insurance",
                //         Text:"Insurance"
                //     },
                //     Insurance:{
                //         Id:"084242ecdea00079d3a455d3196704d0d99850f2",
                //         Name:"Aetna Better Health of Florida5",
                //         PositionIndex:1,
                //         Deductible:null,
                //         Coinsurance:null,
                //         Copay:null
                //     },
                //     Items: [
                //         {
                //             ItemId:"UN2acf294f28774680b27daa540058cd3e",
                //             Name:"DreamStation CPAP Pro (device only)",
                //             Hcpcs:"E0601",
                //             Count:1,
                //             Charge:null,
                //             Allowed:null,
                //             Deductible:null,
                //             Copay:null,
                //             Coinsurance:null
                //             "Product": {
                //                  "Id": "string",
                //                  "Name": "string",
                //                  "Manufacturer": "string",
                //                  "PartNumber": "string"
                //             },
                //             }
                //     ]
                // }
            ]
        };
    }

    getExpenseEstimatePricing(orderId, patientId) {
        return this.coreOrderService.getExpenseEstimatePricing(orderId, patientId);
    }

    getCalculatedDataAndSetModel(orderId, patientId, pricings) {
        const requestData = this.mapPricingsForCalculateReq(pricings);

        return this.coreOrderService.expenseEstimateCalculate(orderId, patientId, requestData)
                   .then((response) => {
                       this.model = response.data;

                       return this.model;
                   });
    }

    saveExpenseEstimates(orderId, patientId, pricings) {
        const requestData = this.mapPricingsForCalculateReq(pricings);

        return this.coreOrderService.expenseEstimatesSave(orderId, patientId, requestData);
    }

    downloadExpenseEstimates(orderId, patientId, pricings) {
        const requestData = this.mapPricingsForCalculateReq(pricings);

        return this.coreOrderService.expenseEstimatesDownload(orderId, patientId, requestData);
    }

    mapPricingsForCalculateReq(pricings) {

        return pricings.map((pricing) => {
            const newPricing = {
                ItemId: pricing.ItemId,
                Hcpcs: pricing.Hcpcs,
                ProductId: pricing.ProductId,
                PriceOptionId: null
            };

            const defaultOptions = pricing.PriceOptions.filter((price) => {
                return price.Default;
            });

            if (defaultOptions.length === 1) {
                newPricing.PriceOptionId = defaultOptions[0].Id;
            }

            return newPricing;
        });
    }
}
