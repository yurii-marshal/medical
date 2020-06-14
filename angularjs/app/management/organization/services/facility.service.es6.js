import { transformAddress } from '../../../core/helpers/transform-address.helper.es6.js';
import {
    contactTypeConstants,
    contactTypeIdConstants
} from '../../../core/constants/core.constants.es6.js';

export default class FacilityService {
    constructor() {
        'ngInject';

        this.defModel = {
            Id: null,
            Name: null,
            Address: {
                AddressLine: null,
                AddressLine2: null,
                City: null,
                State: null,
                Zip: null,
                Country: null
            },
            Contacts: [
                // {
                //     Type: {
                //         Id: null,
                //         Name: null,
                //         Code: null,
                //     },
                //     Value: null
                // }
            ],
            Locations: [
                // {
                //     Id: null,
                //     Address: {
                //         AddressLine: null,
                //         AddressLine2: null,
                //         City: null,
                //         State: null,
                //         Zip: null,
                //         Country: null
                //     },
                //     Contacts: [
                //         {
                //             Type: {
                //                 Id: null,
                //                 Name: null,
                //                 Code: null,
                //             },
                //             Value: null
                //         }
                //     ]
                // }
            ]
        };

        this.transformAddress = transformAddress.bind(this);
    }

    getDefaultModel() {
        return this.defModel;
    }

    mapFacilityModel(res) {
        let model = res.data;

        model.Contacts = this._mapContacts(model.Contacts);
        model.Locations = this.mapLocations(model.Locations);

        return model;
    }

    mapFacilities(res) {
        res.data.Items = res.data.Items.map((item) => {
            item.Address = this.transformAddress(item.Address);
            item.Contacts = this._mapContacts(item.Contacts);
            return item;
        });

        return res;
    }

    _mapContacts(contacts) {
        if (contacts && contacts.length) {
            return contacts.map((c) => {
                return {
                    type: c.Type && c.Type.Id,
                    value: c.Value
                };
            });
        }

        return [];
    }

    mapLocations(locations, transformAddress) {
        if (locations) {
            return locations.map((loc) => {
                loc.Contacts = this._mapContacts(loc.Contacts);

                const phone = loc.Contacts.find((c) => {
                    return c.type === contactTypeConstants.PHONE_ID;
                });
                const fax = loc.Contacts.find((c) => {
                    return c.type === contactTypeConstants.FAX_ID;
                });

                loc.Phone = phone ? phone.value : '-';
                loc.Fax = fax ? fax.value : '-';

                if (transformAddress) {
                    loc.FullAddress = this.transformAddress(loc.Address);
                }

                return loc;
            });
        }

        return [];
    }

    mapPostModel(model) {
        return {
            Name: model.Name,
            Address: model.Address,
            Npi: model.Npi,
            Contacts: model.Contacts.map((contact) => {
                return {
                    Type: contactTypeIdConstants[contact.type] || contact.type,
                    Value: contact.value
                };
            }),
            FacilityLocations: model.Locations ?
                model.Locations.map((loc) => {
                    return {
                        Id: loc.Id,
                        Address: loc.Address,
                        Contacts: loc.Contacts.map((c) => {
                            return {
                                Type: contactTypeIdConstants[c.type] || c.type,
                                Value: c.value
                            };
                        })
                    };
                }) :
                []
        };
    }

}
