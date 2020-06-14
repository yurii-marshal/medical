export default class MapProductsService {

    getPrescriptionProducts(products) {
        let newProducts = [];

        angular.forEach(products, (item) => {
            if (!item.isAny) {
                let product = {
                    ProductId: item.Id || item.Product.Id,
                    Description: item.Notes,
                    Count: item.Count
                };

                if (!item.Bundle) {
                    product.LengthOfNeed = item.LengthOfNeed;
                    product.DiagnosisCodes = item.Diagnosis.filter((diagnose) => !!diagnose).map((diagnose) => diagnose.Code);
                }

                if (item.Bundle) {
                    product.Components = item.Components.map((component) => {
                        return {
                            ProductId: component.Id || component.Product.Id,
                            LengthOfNeed: component.LengthOfNeed,
                            Description: item.Notes,
                            Count: item.Count,
                            DiagnosisCodes: component.Diagnosis.filter((diagnose) => !!diagnose).map((diagnose) => diagnose.Code)
                        };
                    });
                }

                if (item.Bundle) {
                    newProducts.push({ Bundle: product } );
                } else {
                    newProducts.push({ Primitive: product } );
                }
            }
        });

        return newProducts;
    }

    getOrderProducts(products) {
        let newProducts = _.filter(products, (product) => product.Id || product.isAny );

        return newProducts.map((product) => {
            const obj = {
                'Count': product.Count,
                'Notes': product.Notes
            };

            if (product.isAny) {
                obj.GenericHcpcs = product.HcpcsCode.Id;
                obj.Type = 'Generic';
            } else {
                obj.ProductId = product.Id;
                obj.Type = 'Product';
            }

            return obj;
        });
    }


    // This map function for prescription any products
    getHcpcsFromAnyProducts(products) {
        let hcpcsCodes = [];

        angular.forEach(products, (item) => {
            if (item.isAny) {
                hcpcsCodes.push({
                    Code: item.Code || item.HcpcsCode.Id,
                    LengthOfNeed: item.LengthOfNeed,
                    Count: +item.Count,
                    Description: item.Notes,
                    DiagnosisCodes: item.Diagnosis.filter((diagnose) => !!diagnose).map((diagnose) => diagnose.Code)
                });
            }
        });
        return hcpcsCodes;
    }

    joinProductsFromPrescription(prescriptionModel) {
        const products = [];

        if (prescriptionModel.Products) {
            prescriptionModel.Products.forEach((product) => {
                products.push(this.flatProductStructure(product));
            });
        }

        if (prescriptionModel.BundleProducts) {
            prescriptionModel.BundleProducts.forEach((product) => {
                this.flatProductStructure(product);
                product.Bundle = true;

                if (product.Components.length) {
                    product.Components = product.Components.map((component) => {
                        this.flatProductStructure(component);
                        return component;
                    });
                }

                products.push(product);
            });
        }

        if (prescriptionModel.HcpcsCodes) {
            prescriptionModel.HcpcsCodes.forEach((item) => {
                item.Notes = item.Description;
                item.isAny = true;

                products.push(item);
            });
        }

        return products;
    }

    flatProductStructure(item) {

        if (!item.GenericHcpcs) {
            item.Name = item.Product.Name;
            item.allHcpcsCodes = item.Product.Hcpcs;
            item.Manufacturer = item.Product.Manufacturer;
            item.PartNumber = item.Product.PartNumber;
            item.PictureUrl = item.Product.PictureUrl;
            item.Id = item.Product.Id;
            item.Bundle = item.Product.Bundle;
        } else {
            item.isAny = true;
            item.Code = item.GenericHcpcs;
            item.HcpcsCode = {
                Id: item.GenericHcpcs,
                Name: item.GenericHcpcs
            };
        }

        item.Notes = item.Description || item.Notes;

        return item;
    }

    // Join items and items component to one arr
    flatItemsWithComponents(items) {
        let newCollection = [];

        items.forEach((item) => {
            if (item.Bundle) {
                newCollection = newCollection.concat(item.Components);
            } else {
                newCollection.push(item);
            }
        });

        return newCollection;
    }

}

