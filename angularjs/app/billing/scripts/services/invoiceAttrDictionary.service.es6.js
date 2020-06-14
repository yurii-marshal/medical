export default class invoiceAttrDictionaryService {
    constructor() {
        'ngInject';

        /**
         * @categories - there are 2 categories of invoice properties:
         * PriceOptions = 1, Denials = 2, Restrictions = 3
         *
         * SystemAttributes === PriceOptions + Denials
         * GET model
         * "Attributes": [
                 {
                     "Category": {
                         "Id": "string",
                         "Name": "string",
                         "Code": "string"
                     },
                     "Code": "string",
                     "Name": "string"
                 }
             ]
         *
         * Attributes === Restrictions
         * GET model
         * "SystemAttributes": [
                 {
                     "Category": {
                         "Id": "string",
                         "Name": "string",
                         "Code": "string"
                     },
                     "Code": "string",
                     "Name": "string"
                 }
             ]
         * GET model from validation
         * "Restrictions": [
                 {
                     "Id": "string",
                     "Text": "string",
                     "Code": "string"
                 }
            ]
         */


        // https://dme-dev.drowz.net/api/billing/v1/claims/hold-reasons/dictionary

        this.claimHoldReasonsDictionary = [
            {
                Id: 'AuthorizationRequired',
                Name: 'Authorization Required',
                Code: 'null'
            },
            {
                Id: 'AuthorizationExpired',
                Name: 'Authorization Expired',
                Code: ''
            },
            {
                Id: 'DocumentationRequired',
                Name: 'Documentation Required',
                Code: ''
            },
            {
                Id: 'PrescriptionRequired',
                Name: 'Prescription Required',
                Code: ''
            },
            {
                Id: 'PrescriptionExpired',
                Name: 'Prescription Expired',
                Code: ''
            },
            {
                Id: 'CmnRequired',
                Name: 'CMN Required',
                Code: ''
            },
            {
                Id: 'CmnExpired',
                Name: 'CMN Expired',
                Code: ''
            },
            {
                Id: 'ResupplyLimit',
                Name: 'Resupply Limit',
                Code: ''
            },
            {
                Id: 'PatientNonCompliant',
                Name: 'Patient Non-Compliant',
                Code: ''
            },
            {
                Id: 'MultiplePriceOptions',
                Name: 'Multiple Price Options',
                Code: ''
            },
            {
                Id: 'Other',
                Name: 'Other',
                Code: ''
            }

        ];


        // https://dme-dev.drowz.net/api/billing/v1/pricings/hold-reason/dictionary
        /*
        this.prisingHoldReasonsDictionary = [
             {
                 "Id": "1",
                 "Name": "Authorization Required",
                 "Code": null
             },
             {
                 "Id": "2",
                 "Name": "Documentation  Required",
                 "Code": null
             },
             // {
             //     "Id": "?",
             //     "Name": "CMN Required",
             //     "Code": null
             // },
             {
                 "Id": "7",
                 "Name": "Other",
                 "Code": null
             }
         ];
         */

        /* No dictionary
        this.RestrictionsDictionary = [
            {
                Id: '1',
                Name: 'PrescriptionRequired',
                Code: 'null'
            },
            {
                Id: '2',
                Name: 'PrescriptionExpired',
                Code: ''
            },
            {
                Id: '3',
                Name: 'AuthorizationRequired',
                Code: ''
            },
            {
                Id: '4',
                Name: 'AuthorizationExpired',
                Code: ''
            },
            {
                Id: '5',
                Name: 'CmnRequired',
                Code: ''
            },
            {
                Id: '6',
                Name: 'CmnExpired',
                Code: ''
            },
            {
                Id: '7',
                Name: 'ResupplyLimit',
                Code: ''
            },
            {
                Id: '8',
                Name: 'PatientNonCompliant',
                Code: ''
            }

        ]
        */

    }


    /**
     * @desc - we have dictionary only for Hold Reasons but not for SystemAttributes & Attributes.
     * These are different entites and have different ID, so we  need to map Restrictions we get
     * after invoice validation to get list of Hold Reasons
     *
     * @param restrictions
     * @param holdReasons
     * @returns {Array}
     */
    restrictionsToClaimHoldReasons(restrictions, holdReasons) {
        let mappedHoldReasons = [];
        let restrictionsNormalized = [];

        angular.forEach(restrictions, (restriction) => {
            angular.forEach(restriction.Restrictions, (i) => {

                if (!_.find(restrictionsNormalized, { Id: i.Code })) {
                    let item = {
                        Id: i.Code,
                        Code: i.Code,
                        Name: i.Name
                    }

                    if (i.Category) {
                        item.Category = i.Category;
                    }

                    restrictionsNormalized.push(item);
                }
            });
        });

        angular.forEach(restrictionsNormalized, (restriction) => {
            angular.forEach(holdReasons, (reason) => {
                let name1 = restriction.Name;
                let name2 = reason.Name;

                if (this._isNameEqual(name1, name2)) {

                    restriction.Id = reason.Id;
                    let item = {
                        Id: restriction.Id,
                        Code: restriction.Code,
                        Name: restriction.Name
                    }

                    if (restriction.Category) {
                        item.Category = restriction.Category;
                    }

                    mappedHoldReasons.push(item);
                }
            });
        });

        return mappedHoldReasons;
    }


    attributesToClaimHoldReasons(attributes) {
        angular.forEach(attributes, (attribute) => {
            angular.forEach(this.claimHoldReasonsDictionary, (reason) => {
                let name1 = attribute.Name || attribute.Text;
                let name2 = reason.Name || reason.Text;

                if (this._isNameEqual(name1, name2)) {
                    attribute.Code = reason.Id;
                }

                if (!_.find( this.claimHoldReasonsDictionary,
                    (item) => {
                        return item.Name.toLowerCase().replace(/\s|\-/g, '') === (
                                ( attribute.Name.toLowerCase().replace(/\s|\-/g, '') || attribute.Text.toLowerCase().replace(/\s|\-/g,'') )
                            )
                    })
                ) {
                    attribute.Code = 12;
                }
            });
        });

        return attributes;
    }

    _isNameEqual(name1, name2) {
        return name1.toLowerCase().replace(/\s|\-/g,'') === name2.toLowerCase().replace(/\s|\-/g,'');
    }

    prisingHoldReasonToClaimHoldReason(pricingHoldReason, claimHoldReasons) {
        let mappedHoldReason = {};

        angular.forEach(claimHoldReasons, (r) => {
            let name1 = pricingHoldReason.Name || pricingHoldReason.Text;
            let name2 = r.Name || r.Text;

            if (this._isNameEqual(name1, name2)) {
                mappedHoldReason = {
                    Id: r.Id,
                    Code: r.Code,
                    Name: r.Name || r.Text,
                    AttrClass: this.getAttrClass(r.Id)
                };
            }
        });

        return mappedHoldReason;
    }

    /**
     * @param attrId {String}
     * @returns {*}
     */

    getAttrClass(attrId) {
        switch (attrId) {
            case '1':
            case 'AuthorizationRequired':  // 1
                return 'light-green-label';
            case '2':
            case 'AuthorizationExpired':   // 2
                return 'orange-label';
            case '3':
            case 'DocumentationRequired':  // 3
                return 'red-label';
            case '4':
            case 'PrescriptionRequired':   // 4
                return 'dark-blue-label';
            case '5':
            case 'PrescriptionExpired':     // 5
                return 'light-violet-label';
            case '6':
            case 'CmnRequired':             // 6
                return 'bright-green-label';
            case '7':
            case 'CmnExpired':              // 7
                return 'bright-yellow-label';
            case '8':
            case 'ResupplyLimit': // 8
                return 'bright-violet-label';
            case '9':
            case 'PatientNonCompliant': // 9
                return 'bright-blue-label';
            case '10':
            case 'MultiplePriceOptions': // 10
                return 'light-blue-label';
            case '11':
            case 'Other': // 11
                return 'light-gray-label';
            case 'SalesTaxRequired':
                return 'mint-label';
            default:
                return 'light-gray-label';
        }
    }
}
