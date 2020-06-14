export const lookupProperties = {
    LOCATION: {
        id: 'LOCATION',
        key: 'Location',
        name: 'Location',
        propertyName: null,
        label: 'Scan or Enter Location Barcode, Use Search for Location Lookup or Leave Empty'
    },
    PRODUCT_ID: {
        id: 'PRODUCT_ID',
        key: 'ProductId',
        name: 'Product Id',
        propertyName: 'productId',
        label: 'Scan or Enter Product Barcode or Use Search for Product Lookup'
    },
    SERIAL_NUMBER: {
        id: 'SERIAL_NUMBER',
        key: 'SerialNumber',
        name: 'Serial Number',
        propertyName: 'serialNumber',
        checkProperty: 'isSerialized',
        label: 'Scan or Enter Serial Number'
    },
    LOT_NUMBER: {
        id: 'LOT_NUMBER',
        key: 'LotNumber',
        name: 'Lot Number',
        propertyName: 'lotNumber',
        checkProperty: 'isLotted',
        label: 'Scan or Enter Lot Number'
    }
}
