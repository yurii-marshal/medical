export default class PrescriptionDetailsCtrl {
    constructor(
        $scope,
        $state,
        $filter,
        bsLoadingOverlayService,
        prescriptionService,
        WEB_API_INVENTORY_SERVICE_URI
    ) {
        'ngInject';

        this.prescriptionService = prescriptionService;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;

        this.prescriptionId = $state.params.prescriptionId;
        this.model = {};
        this.noImage = 'assets/images/no-image-equipment.svg';

        /**
         * @interface this.model
            {
              "Status": {
                "Id": "string",
                "Text": "string",
                "Code": "string"
              },
              "InProgress": true,
              "EffectiveDate": "2018-02-13T09:54:54.195Z",
              "TreatingProvider": {
                "Id": "string",
                "Practice": "string",
                "Npi": "string",
                "PhysicianName": {
                  "First": "string",
                  "Last": "string",
                  "Middle": "string",
                  "FullName": "string"
                },
                "Location": {
                  "Address": "string",
                  "Phone": "string",
                  "Fax": "string",
                  "Email": "string"
                }
              },
              "HcpcsCodes": [
                {
                  "LengthOfNeed": 0,
                  "Code": "string",
                  "Count": 0,
                  "Description": "string"
                }
              ],
              "Products": [
                {
                  "LengthOfNeed": 0,
                  "Count": 0,
                  "Description": "string",
                  "Product": {
                    "Id": "string",
                    "Manufacturer": "string",
                    "Name": "string",
                    "PartNumber": "string",
                    "Hcpcs": [
                      "string"
                    ],
                    "PictureUrl": "string"
                  }
                }
              ],
              "BundleProducts": [
                {
                  "Count": 0,
                  "Description": "string",
                  "Product": {
                    "Id": "string",
                    "Manufacturer": "string",
                    "Name": "string",
                    "PartNumber": "string",
                    "Hcpcs": [
                      "string"
                    ],
                    "PictureUrl": "string"
                  },
                  "Components": [
                    {
                      "LengthOfNeed": 0,
                      "Count": 0,
                      "Description": "string",
                      "Product": {
                        "Id": "string",
                        "Manufacturer": "string",
                        "Name": "string",
                        "PartNumber": "string",
                        "Hcpcs": [
                          "string"
                        ],
                        "PictureUrl": "string"
                      }
                    }
                  ]
                }
              ],
              "CreatedOn": "2018-02-13T09:54:54.196Z",
              "CreatedBy": {
                "First": "string",
                "Last": "string",
                "Middle": "string",
                "FullName": "string"
              },
              "ModifiedOn": "2018-02-13T09:54:54.196Z",
              "ModifiedBy": {
                "First": "string",
                "Last": "string",
                "Middle": "string",
                "FullName": "string"
              },
              "SignInfo": {
                "Physician": {
                  "Id": "string",
                  "Practice": "string",
                  "Npi": "string",
                  "PhysicianName": {
                    "First": "string",
                    "Last": "string",
                    "Middle": "string",
                    "FullName": "string"
                  },
                  "Location": {
                    "Address": "string",
                    "Phone": "string",
                    "Fax": "string",
                    "Email": "string"
                  }
                },
                "Date": "2018-02-13T09:54:54.196Z"
              }
            }
         */

        this._activate();
    }

    _activate() {
        if (this.prescriptionId) {
            this._getPrescriptionDetails(this.prescriptionId);
        }
    }

    _getPrescriptionDetails(prescriptionId) {
        this.bsLoadingOverlayService.start({ referenceId: 'prescriptionDetails' });
        this.prescriptionService.getPrescriptionDetails(prescriptionId)
            .then((response) => {
                this.model = this._modelNormalize(response);
                this.prescriptionService.mapTreatingProviderContacts(this.model.TreatingProvider);
                this.model.StatusClass = this.prescriptionService.getStatusClass(this.model.Status.Id);
            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'prescriptionDetails' }));
    }

    _modelNormalize(model) {
        if (model.Products) {
            model.Products.map((product) => {
                this._productFlatStructure(product);
                return product;
            });
        }

        if (model.BundleProducts) {
            model.BundleProducts.map((product) => {
                product.isBundle = true;
                this._productFlatStructure(product);

                if (product.Components.length) {
                    product.Components.map((component) => {
                        this._productFlatStructure(component);
                        return component;
                    });
                }

                return product;
            });

            // Concat BundleProducts with Products into one array
            model.Products = model.Products
                ? model.Products.concat(model.BundleProducts)
                : [].concat(model.BundleProducts);
        }

        if (model.HcpcsCodes) {
            model.HcpcsCodes.map((item) => {
                item.Notes = item.Description;
                item.isAny = true;

                return item;
            });

            // Concat HcpcsCodes(Any device of this category) with Products into one array
            model.Products = model.Products
                ? model.Products.concat(model.HcpcsCodes)
                : [].concat(model.HcpcsCodes);
        }

        return model;
    }

    _productFlatStructure(item) {
        item.Name = item.Product.Name;
        item.allHcpcsCodes = item.Product.Hcpcs;
        item.Manufacturer = item.Product.Manufacturer;
        item.PartNumber = item.Product.PartNumber;
        item.PictureUrl = item.Product.PictureUrl;
        item.Notes = item.Description;

        return item;
    }
}
