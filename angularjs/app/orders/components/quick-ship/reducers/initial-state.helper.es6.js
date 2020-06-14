import { lookupProperties } from '../quick-ship.config.es6';

export function initialQuickShipState() {
    return {
        orderShortInfo: {},
        patientInfo: {},
        inventory: {
            byId: {},
            allIds: []
        },
        locationProductsCounter: {
            byId: {
                // {
                //  prefilledCount: 0,
                //  selectedCount: 0,
                //  tempCount: 0
                // }
            },
            allIds: []
        },
        shipItems: {
            items: {
                byHash: {},
                allHashes: []
            },
            components: {
                byHash: {},
                allHashes: []
            }
        },
        pickedItems: {
            items: {
                byId: {},
                allIds: []
            },
            components: {
                byId: {},
                allIds: []
            }
        },
        linkedItems: {
            items: {
                byHash: {},
                allHashes: []
            },
            components: {
                byHash: {},
                allHashes: []
            }
        },
        currentProduct: {
            locationTo: {
                id: '',
                displayName: ''
            },
            locationFrom: {
                id: '',
                uniqueId: '',
                displayName: ''
            },
            isAnyLocationFrom: false,
            barcode: null,
            hash: null,
            productId: null,
            storeIds: [],
            product: {
                 // activeProperty: null // need to add reducer
            },
            components: {
                byId: {
                    // id: {
                    //   isActive: false,
                    //   activeProperty: null
                    // }
                },
                allIds: []
            },
            nextKey: null,
            status: null,
            lookupProperty: lookupProperties.LOCATION.id // string
        }
    };
}
