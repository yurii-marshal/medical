export default class orderWizardService {
    constructor($http,
                $filter,
                bsLoadingOverlayService,
                WEB_API_SERVICE_URI,
                WEB_API_INVENTORY_SERVICE_URI,
                WEB_API_IDENTITY_URI,
                ordersService,
                mapProductsService,
                prescriptionService,
                corePatientService,
                $q
    ) {
        'ngInject';

        this.orderTypes = {
            Prescribed: 1,
            Resupply: 2
        };

        this.$http = $http;
        this.$filter = $filter;
        this.$q = $q;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
        this.WEB_API_INVENTORY_SERVICE_URI = WEB_API_INVENTORY_SERVICE_URI;
        this.bsLoadingOverlayService = bsLoadingOverlayService;
        this.ordersService = ordersService;
        this.prescriptionService = prescriptionService;
        this.mapProductsService = mapProductsService;
        this.corePatientService = corePatientService;
        this.WEB_API_IDENTITY_URI = WEB_API_IDENTITY_URI;

        this.model = {};

    }

    getTabs(orderId) {
        const mainState = orderId ? 'root.orders.edit' : 'root.orders.add';

        return [{
            name: 'Referral',
            state: `${mainState}.step1`
        },
        {
            name: 'Medical',
            state: `${mainState}.step2`
        },

        {
            name: 'Items',
            state: `${mainState}.step3`
        },
        {
            name: 'Rx',
            state: `${mainState}.step4`
        },
        {
            name: 'Tags',
            state: `${mainState}.step5`
        },
        {
            name: 'Documents',
            state: `${mainState}.step6`
        },
        {
            name: 'Summary',
            state: `${mainState}.step7`
        }];
    }

    setDefaultModel(orderId, patient) {
        this.model = this._getModelDefault(patient);

        if (orderId) {
            this._getOrder(orderId);
        }
    }

    _getModelDefault(patient) {
        return {

            patient: patient || undefined,
            referral: undefined,
            referralDate: '',
            isCustom: false,
            hasReferringProvider: true,
            isPrescriptionActive: false,
            wizardIsEdit: false,

            showAdmission: false,
            diagnosis: [],
            medications: [],
            admissions: [],
            hospitalDischarge: {
                isEnabled: false,
                dischargeDate: '',
                from: '',
                to: '',
                isTimeUnknown: false,
                hospital: undefined,
                hospitalName: '',
                hospitalAddress: '',
                hospitalContact: '',
                room: ''
            },

            showRemovedPrescriptionAlert: false,
            equipment: [],
            newItems: [],
            currentItems: [],
            prescriptionItems: [],

            prescriptionList: [],

            prescriptionReferral: {},
            prescription: {},
            effectiveDate: moment().format('MM/DD/YYYY'),
            priorityLevel: { Id: 2 },
            startDate: moment().format('MM/DD/YYYY'),
            info: '',
            detailedWrittenOrder: {
                LegibleOrder: true,
                PatientName: true,
                SignedDate: true,
                SignedDateTime: '',
                StartOrderDate: true,
                StartOrderDateTime: '',
                FrequencyOfUse: true,
                Evidance: true,
                PhysicianName: true,
                PhysicianNpi: true,
                PhysicianSignature: true,
                ItemDescription: true,
                QualifiedDiagnosisCode: true
            },

            Tags: [],

            patientDocuments: [],
            uploadedDocuments: [],
            removeDocuments: [],

            notificationData: null
        };
    }

    _getOrder(orderId) {
        this.bsLoadingOverlayService.start({ referenceId: 'order-wizard' });
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${ orderId }`)
            .then((orderResponse) => {

                const promises = [];

                // Set data for simple order
                this.model.patient = {
                    Name: orderResponse.data.Patient.Name,
                    DateOfBirthday: orderResponse.data.Patient.DateOfBirth,
                    Id: orderResponse.data.Patient.Id
                };

                this.model.priorityLevel = orderResponse.data.PriorityLevel;
                this.model.startDate = moment.utc(orderResponse.data.StartDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                this.model.info = orderResponse.data.Description;

                this.model.wizardIsEdit = true;

                this.model.hasReferringProvider = !!orderResponse.data.ReferralCard;

                this.model.hospitalDischarge = {};

                if (_.has(orderResponse, 'data.HospitalDischarge.DischargeDate')) {
                    this.model.hospitalDischarge = {
                        isEnabled: true,
                        dischargeDate: moment.utc(orderResponse.data.HospitalDischarge.DischargeDate, 'YYYY-MM-DD').format('MM/DD/YYYY'),
                        from: orderResponse.data.HospitalDischarge.DischargeFrom ? moment.utc(orderResponse.data.HospitalDischarge.DischargeFrom, 'HH:mm:ss').format('hh:mm A') : '',
                        to: orderResponse.data.HospitalDischarge.DischargeTo ? moment.utc(orderResponse.data.HospitalDischarge.DischargeTo, 'HH:mm:ss').format('hh:mm A') : '',
                        room: orderResponse.data.HospitalDischarge.Room
                    };
                    this.model.hospitalDischarge.isTimeUnknown = this.model.hospitalDischarge.from === '';
                    this.model.hospitalDischarge.hospital = {
                        Name: orderResponse.data.HospitalDischarge.Name,
                        Id: orderResponse.data.HospitalDischarge.HospitalId
                    };
                    this.model.hospitalDischarge.hospitalAddress = orderResponse.data.HospitalDischarge.Address;
                    this.model.hospitalDischarge.hospitalContact = orderResponse.data.HospitalDischarge.Contact;
                } else {
                    this.model.hospitalDischarge.isEnabled = false;
                }

                this.model.patientDocuments = orderResponse.data.Documents;
                this.model.Tags = orderResponse.data.Tags.map((tag) => {
                    tag.attrClass = this.ordersService.getAttrClass(tag.Name);
                    return tag;
                });

                promises.push(this.getOrderItems(orderId, { 'paggination.pageSize': 100 }));

                this.getPatientDiagnoses(this.model.patient.Id)
                    .then((response) => this.model.diagnosis = response);

                this.getPatientMedications(this.model.patient.Id)
                    .then((response) => this.model.medications = response);

                // Set data for prescribed order
                if (orderResponse.data.ReferralCard) {

                    this.model.referral = orderResponse.data.ReferralCard;
                    this.model.referral.displayName = this.$filter('referralDisplayName')(orderResponse.data.ReferralCard);

                    this.model.referralDate = moment.utc(orderResponse.data.ReferralDate, 'YYYY-MM-DD').format('MM/DD/YYYY');

                    promises.push(this.prescriptionService.getPrescriptionsList({
                        'filter.patientId': this.model.patient.Id,
                        'paggination.pageSize': 100
                    }));
                }

                // Handle getOrders and getPrescriptions responses
                this.$q.all(promises)
                    .then((responses) => {

                        this.model.newItems = responses[0].data.Items;

                        if (responses.length > 1) {
                            this.model.prescriptionList = responses[1].map((prescription) => {
                                prescription.EffectiveDate = moment(prescription.EffectiveDate).format('MM/DD/YYYY');
                                return prescription;
                            });
                        }

                        // Check prescriptionId from order is Active
                        const isOrderPrescriptionActive = !!this.model.prescriptionList.find((prescription) => {
                            return prescription.Id === orderResponse.data.PrescriptionId;
                        });

                        if (orderResponse.data.ReferralCard) {
                            this.model.showRemovedPrescriptionAlert = !isOrderPrescriptionActive;
                        }

                        this.model.isPrescriptionActive = this.model.prescriptionList.length > 0;

                        if (orderResponse.data.ReferralCard &&
                            isOrderPrescriptionActive) {

                            // Get prescription detail and set to model
                            this.prescriptionService.getPrescriptionDetails(orderResponse.data.PrescriptionId)
                                .then((prescriptionDetailResponse) => {
                                    let products = this.mapProductsService.joinProductsFromPrescription(prescriptionDetailResponse);

                                    this.model.prescriptionItems = products;

                                    products.forEach((product) => {
                                        this.model.newItems.forEach((item) => {
                                            if (item.Id === product.Id) {
                                                if (!item.Bundle) {
                                                    item.Diagnosis = product.Diagnosis;
                                                    item.LengthOfNeed = product.LengthOfNeed;
                                                } else {
                                                    item.Components = product.Components;
                                                }
                                            }
                                        });
                                    });

                                    products = products.filter((product) => {
                                        return !this.model.newItems.find((item) => {
                                            let isFiltered = false;

                                            if (item.isAny && product.isAny) {
                                                isFiltered = item.Code === product.Code;
                                            } else if (item.Id && product.Id) {
                                                isFiltered = item.Id === product.Id;
                                            }

                                            return isFiltered;
                                        });
                                    });

                                    prescriptionDetailResponse.Id = orderResponse.data.PrescriptionId;

                                    products.forEach((item) => {
                                        item.prescriptionId = this.model.prescription.Id;
                                        this.model.currentItems.push(item);
                                    });

                                    let referralDisplayName = '';

                                    if (prescriptionDetailResponse.TreatingProvider.PhysicianName) {
                                        referralDisplayName = prescriptionDetailResponse.TreatingProvider.PhysicianName.FullName;
                                    } else if (prescriptionDetailResponse.TreatingProvider.Practice) {
                                        referralDisplayName = prescriptionDetailResponse.TreatingProvider.Practice;
                                    } else {
                                        referralDisplayName = '-';
                                    }

                                    this.model.effectiveDate = moment.utc(prescriptionDetailResponse.EffectiveDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                                    this.model.prescriptionReferral = {
                                        Id: prescriptionDetailResponse.TreatingProvider.Id,
                                        Location: prescriptionDetailResponse.TreatingProvider.Location,
                                        displayName: referralDisplayName
                                    };

                                    this.model.prescription = prescriptionDetailResponse;
                                });
                        }
                    });

            })
            .finally(() => this.bsLoadingOverlayService.stop({ referenceId: 'order-wizard' }));
    }

    getRestrictionTags() {
        const sendData = {
            'OrderStartDate': moment(this.model.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
            'Products': this.model.newItems.map((item) => {
                return {
                    'Hcpcs': this._getAllHcpcsCodesFromItem(item),
                    'Count': item.Count
                };
            })
        };

        if (this.model.hasReferringProvider) {
            sendData.ReferringProviderId = this.model.referral.Id;
        }

        if (this.model.hasReferringProvider) {
            const effectiveDate = this.model.isPrescriptionActive ? this.model.prescription.EffectiveDate : this.model.effectiveDate;

            sendData.Prescription = {
                'Id': this.model.prescription.Id || null,
                'EffectiveDate': moment(effectiveDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                'Items': []
            };

            this.mapProductsService.flatItemsWithComponents(this.model.currentItems).forEach((item) => {
                sendData.Prescription.Items.push({
                    'Hcpcs': this._getAllHcpcsCodesFromItem(item),
                    'LengthOfNeed': item.LengthOfNeed,
                    'Count': item.Count
                });
            });

            this.mapProductsService.flatItemsWithComponents(this.model.newItems).forEach((item) => {
                sendData.Prescription.Items.push({
                    'Hcpcs': this._getAllHcpcsCodesFromItem(item),
                    'LengthOfNeed': item.LengthOfNeed,
                    'Count': item.Count
                });
            });
        }

        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${ this.model.patient.Id }/orders/tags`, sendData);
    }

    _getAllHcpcsCodesFromItem(item) {
        let hcpcs = [];

        if (item.isAny) {
            const code = item.Code || item.HcpcsCode.Id;

            hcpcs.push(code);
        } else {
            hcpcs = item.allHcpcsCodes || item.HcpcsCodes || [];
        }

        if (item.Components) {

            item.Components.forEach((component) => {
                const codes = component.allHcpcsCodes || component.HcpcsCodes;

                hcpcs = hcpcs.concat(codes);
            });
        }

        return hcpcs;
    }

    clearModel(patient) {
        this.model = angular.merge(this.model, this._getModelDefault(patient));

        this.model.prescriptionReferral = {};
        this.model.prescription = {};
    }

    getModel() {
        return this.model;
    }

    getPatients(fullName) {
        const params = {
            'filter.fullName': fullName,
            'filter.status': 1,
            'sortExpression': 'Name ASC'
        };

        return this.corePatientService.getPatientsDictionary(params);
    }

    getReferrals(personFullName) {
        const params = {
            filter: personFullName,
            pageIndex: 0,
            pageSize: 100
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/referral/cards/dictionary`, { params })
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.searchName = this.$filter('referralDisplayName')(item, true);
                    item.displayName = this.$filter('referralDisplayName')(item);
                });
                return response;
            });
    }

    getLocations(address) {
        const params = { address };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/locations`, { params });
    }

    getPatientDiagnoses(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/diagnoses`)
            .then((response) => {
                return _.map(response.data.Items, (diagnose) => {
                    return {
                        Id: diagnose.Id,
                        Text: diagnose.Code,
                        Code: diagnose.Code,
                        Description: diagnose.Description,
                        AdditionDate: diagnose.AdditionDate
                    };
                });
            });
    }

    getPatientMedications(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/medications`)
            .then((response) => {
                return _.map(response.data.Items, (medication) => {
                    return {
                        id: medication.MedicationId,
                        text: medication.Medication,
                        AdditionDate: medication.AdditionDate
                    };
                });
            });
    }

    getHospitals(name) {
        const params = { name };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}hospitals`, { params });
    }

    getHospitalAdmissions(patientId) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/hospital-admissions`)
            .then((response) => {
                angular.forEach(response.data.Items, (item) => {
                    item.AdmissionDate = moment.utc(item.AdmissionDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    item.DischargeDate = moment.utc(item.DischargeDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
                    item.Diagnoses = _.map(item.Diagnoses, (diagnosis) => {
                        return {
                            Id: diagnosis.Id,
                            DiagnosisCodeId: diagnosis.DiagnosisCodeId,
                            CodeWithDescription: diagnosis.CodeWithDescription
                        };
                    });
                });
                return response;
            });
    }

    getDiagnoses(codeWithDescription) {
        const params = {
            codeWithDescription,
            PageSize: 100
        };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/diagnosis-codes/dictionary`, { cache: true, params });
    }

    getAllDiagnosis(codeWithDescription, pageSize = 100, pageIndex = 0, filters) {
        let params = { codeWithDescription, pageSize, pageIndex };

        if (filters) {
            params = angular.merge({}, params, filters);
        }
        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/diagnosis-codes/dictionary`,
            { cache: true, params })
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        Code: item.text,
                        Text: item.text,
                        Description: item.description,
                        Id: item.id
                    };
                });

                return response;
            });
    }

    getMedications(description) {
        const params = { description, PageSize: 100 };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}settings/medications/dictionary`, { params })
            .then((response) => {
                response.data.Items = response.data.Items.map((item) => {
                    return {
                        id: item.Id,
                        text: item.Description
                    };
                });
                return response;
            });
    }

    getImage(id, token) {
        if (!token) {
            return false;
        }
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${id}/picture/${token}`, { cache: true });
    }

    getPriorityLevels() {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/priority-level/dictionary`);
    }

    getPatientDocuments(patientId, name) {
        const params = { filter: name };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}v1/patients/${patientId}/documents/dictionary`, { params });
    }

    getOrderItems(orderId, params = {}) {
        const deferred = this.$q.defer();

        this.$http.get(`${this.WEB_API_SERVICE_URI}v1/orders/${orderId}/ordered/items`, { params })
            .then((response) => {
                const bundlePromises = [];

                // Fetch only bundle components from server
                response.data.Items.forEach((item) => {
                    item = this.mapProductsService.flatProductStructure(item);

                    item.Id = item.ProductId;
                    delete item.ProductId;

                    item.Diagnosis = [];

                    if (item.Bundle) {
                        const bundlePromise = this.getBundleComponents(item.Id);

                        bundlePromises.push(bundlePromise);

                        bundlePromise.then((products) => {
                            products.data.forEach((component) => {
                                component.HcpcsCodes = this.$filter('hcpcsCodesToArr')(component);
                                component.Diagnosis = [];
                            });

                            item.Components = products.data;
                        });
                    }
                });

                // Resolve deffer if all request done
                if (bundlePromises.length) {
                    this.$q.all(bundlePromises).then(() => {
                        deferred.resolve(response);
                    });
                } else {
                    deferred.resolve(response);
                }
            }).catch((err) => {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    getBundleComponents(productId) {
        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/${ productId }/components`);
    }

    getProductsById(Ids) {
        let params = {
            Ids,
            PageIndex: 0,
            PageSize: 100,
            StoreTypeIds: ['4431a39527655d7683172f00f10aec9b6afdf5da']
        };

        return this.$http.get(`${this.WEB_API_INVENTORY_SERVICE_URI}v1/products/search`, { params });
    }

    getDocumentTypes(name) {
        const params = { name };

        return this.$http.get(`${this.WEB_API_SERVICE_URI}document-types`, { params });
    }

    deleteEquipment(equipment) {
        if (equipment.isAny && equipment.HcpcsCode) {
            _.remove(this.model.newItems, (model) => {
                if (!model.HcpcsCode) {
                    return false;
                }

                const modelHcpcsCode = model.HcpcsCode.Id || model.HcpcsCode;
                const equipmentHcpcsCode = equipment.HcpcsCode.Id || equipment.HcpcsCode;

                return model.isAny && (modelHcpcsCode === equipmentHcpcsCode);
            });
        }

        if (equipment.Id) {
            _.remove(this.model.newItems, (model) => {
                return model.Id === equipment.Id;
            });
        }
    }

    saveOrder(orderId) {
        const postModel = this._getPostModel(orderId);

        if (orderId) {
            return this.$http.put(`${this.WEB_API_SERVICE_URI}v1/patients/${this.model.patient.Id}/orders/${orderId}`, postModel);
        }

        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/patients/${this.model.patient.Id}/orders`, postModel);
    }

    _getPostModel(orderId) {
        const postModel = {
            Order: {
                'Priority': this.model.priorityLevel.Id,
                'OrderStartDate': moment(this.model.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                'PatientDocuments': this.model.patientDocuments.reduce((acc, obj) => {
                    if (obj.DocumentId) {
                        acc.push(obj.DocumentId);
                    }
                    return acc;
                }, []),
                'RemoveDocuments': this.model.removeDocuments,
                'Tags': this.model.Tags.map((tag) => tag.Id),
                'Products': this.mapProductsService.getOrderProducts(this.model.newItems)
            }
        };

        let prescriptionItems = this.model.currentItems;

        this.model.newItems.forEach((newItem) => {

            const prescriptionItem = prescriptionItems.find((prescriptionItem) => {

                if (newItem.isAny && prescriptionItem.isAny) {
                    const newItemCode = newItem.Code || newItem.HcpcsCode.Id,
                        prescriptionItemCode = prescriptionItem.Code || prescriptionItem.HcpcsCode.Id;

                    return newItemCode === prescriptionItemCode;
                }

                return newItem.Id === prescriptionItem.Id;
            });

            if (!prescriptionItem) {
                prescriptionItems.push(newItem);
            }

            prescriptionItems.forEach((prescriptionItem, key) => {
                if (newItem.isAny && prescriptionItem.isAny) {
                    const newItemCode = newItem.Code || newItem.HcpcsCode.Id,
                        prescriptionItemCode = prescriptionItem.Code || prescriptionItem.HcpcsCode.Id;

                    if (newItemCode === prescriptionItemCode) {
                        prescriptionItems[key] = newItem;
                    }
                } else if (newItem.Id === prescriptionItem.Id) {
                    prescriptionItems[key] = newItem;
                }
            });
        });

        if (!orderId) {

            postModel.OrderConfirmation = null;
            postModel.Dwo = null;

            if (this.model.notificationData) {

                if (this.model.notificationData.DWO) {
                    postModel.Dwo = {
                        'Emails': this.model.notificationData.emails,
                        'Faxes': this.model.notificationData.faxes,
                        'Notes': this.model.notificationData.note
                    };
                } else {
                    postModel.OrderConfirmation = {
                        'Emails': this.model.notificationData.emails,
                        'Faxes': this.model.notificationData.faxes,
                        'Notes': this.model.notificationData.note
                    };
                }

            }
        }

        if (this.model.hasReferringProvider) {
            postModel.Order.ReferringProviderId = this.model.referral.Id;
            postModel.Order.ReferringProviderLocationId = this.model.referral.Location && this.model.referral.Location.Id;
            postModel.Order.ReferralDate = moment.utc(this.model.referralDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
            postModel.Order.Description = this.model.info;
            postModel.Order.HospitalDischarge = this.model.hospitalDischarge.isEnabled
                        ? {
                            DischargeDate: moment.utc(this.model.hospitalDischarge.dischargeDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                            DischargeFrom: !this.model.hospitalDischarge.isTimeUnknown ? moment.utc(this.model.hospitalDischarge.from, 'hh:mm A').format('HH:mm') : undefined,
                            DischargeTo: !this.model.hospitalDischarge.isTimeUnknown ? moment.utc(this.model.hospitalDischarge.to, 'hh:mm A').format('HH:mm') : undefined,
                            HospitalId: this.model.hospitalDischarge.hospital ? this.model.hospitalDischarge.hospital.Id : undefined,
                            Name: this.model.hospitalDischarge.hospital ? this.model.hospitalDischarge.hospital.Name : this.model.hospitalDischarge.hospitalName,
                            Address: this.model.hospitalDischarge.hospitalAddress,
                            Room: this.model.hospitalDischarge.room,
                            Contact: this.model.hospitalDischarge.hospitalContact
                        }
                        : '';

            postModel.Prescription = {
                Id: this.model.prescription.Id,
                EffectiveDate: this.model.effectiveDate ?
                    moment(this.model.effectiveDate, 'MM/DD/YYYY').format('YYYY-MM-DD') :
                    moment(this.model.startDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                TreatingProviderId: this.model.prescriptionReferral.Id,
                TreatingProviderLocationId: this.model.prescriptionReferral.Location && this.model.prescriptionReferral.Location.Id,
                Hcpcs: this.mapProductsService.getHcpcsFromAnyProducts(prescriptionItems),
                Products: this.mapProductsService.getPrescriptionProducts(prescriptionItems)
            };

            postModel.Medications = _.map(this.model.medications, (medication) => {
                return {
                    MedicationId: medication.id,
                    AdditionDate: medication.AdditionDate
                };
            });

            postModel.Diagnoses = _.map(this.model.diagnosis, (diagnose) => {
                return {
                    DiagnosisId: diagnose.Id
                };
            });

            postModel.HospitalAdmissions = _.map(this.model.admissions, (admission) => {
                return {
                    Id: admission.Id,
                    HospitalId: admission.HospitalId,
                    AdmissionDate: moment.utc(admission.AdmissionDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    DischargeDate: moment.utc(admission.DischargeDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
                    Notes: '',
                    Diagnoses: _.map(admission.Diagnoses, (diagnose) => {
                        return {
                            DiagnosisCodeId: diagnose.DiagnosisCodeId,
                            Description: diagnose.CodeWithDescription
                        };
                    })
                };
            });
        }

        return postModel;
    }

    saveReferral(referral) {
        return this.$http.post(`${this.WEB_API_SERVICE_URI}v1/referral/cards`, this._getReferalSaveModel(referral));
    }

    _getReferalSaveModel(referral) {
        const physicianName = referral.Physician && referral.Physician.Name;

        if (referral.Location) {
            referral.Location.Email = referral.Location.Email || null;
            referral.Location.Fax = referral.Location.Fax || null;
            referral.Location.Phone = referral.Location.Phone || null;
        }

        const saveModel = {
            PrimaryLocation: referral.Location,
            Physician: physicianName && physicianName.First && physicianName.Last
                ? {
                    First: physicianName.First,
                    Last: physicianName.Last
                }
                : undefined,
            Practice: referral.Practice,
            Npi: referral.Physician && referral.Physician.Npi || undefined,
            ContactPerson: referral.ContactPerson,
            SalesAgentId: referral.SalesAgent ? referral.SalesAgent.Id : undefined
        };

        return saveModel;
    }

    _mapHcpcsCodes() {
        let hcpcsCodes = [];

        angular.forEach(this.model.newItems, (prescribedModel) => {
            if (prescribedModel.isAny) {
                hcpcsCodes.push({
                    Code: prescribedModel.HcpcsCode.Text || prescribedModel.HcpcsCode,
                    LengthOfNeed: prescribedModel.LengthOfNeed,
                    Count: 1,
                    Description: prescribedModel.Notes
                });
            }
        });
        return hcpcsCodes;
    }

    _mapModels() {
        let models = [];

        angular.forEach(this.model.newItems, (prescribedModel) => {
            if (!prescribedModel.isAny) {
                let model = {
                    Id: prescribedModel.Id,
                    ProductType: prescribedModel.ProductType
                        ? prescribedModel.ProductType.Id
                        : prescribedModel.Type.Id,
                    LengthOfNeed: prescribedModel.Bundle
                        ? null
                        : prescribedModel.LengthOfNeed,
                    Description: prescribedModel.Notes,
                    Count: prescribedModel.Count
                };

                if (prescribedModel.Bundle) {
                    model.Components = prescribedModel.Components.map((component) => {
                        return {
                            Id: component.Id,
                            LengthOfNeed: component.LengthOfNeed
                        };
                    });
                }

                models.push(model);
            }
        });
        return models;
    }

    _getByteArray(bytes) {
        let byteArray = [];
        let uint8Array = new Uint8Array(bytes);

        angular.forEach(uint8Array, (value) => {
            byteArray.push(value);
        });
        return byteArray;
    }

    setNotificationData(notifData) {
        this.model.notificationData = notifData;
    }

    getUsers(name, pageIndex) {
        const params = {
            fullName: name,
            sortExpression: 'Name.FullName ASC',
            pageIndex
        };

        return this.$http.get(`${this.WEB_API_IDENTITY_URI}users/list`, { params });
    }

    validateOrderItems(patientId) {
        if (!patientId) {
            patientId = this.model.patient.Id;
        } else if (_.isObject(patientId)) {
            patientId = patientId.Id || this.model.patient.Id;
        }

        let postModel = {
            OrderStartDate: this.model.startDate,
            HcpcsCodes: [],
            Products: [],
            ReferralCardId: ''
        };

        angular.forEach(this.model.newItems, (item) => {
            postModel.OrderStartDate = this.model.startDate;
            if (item.isAny) {
                postModel.HcpcsCodes.push({
                    Code: item.HcpcsCode.Id || item.HcpcsCode,
                    Count: item.Count
                });
            } else {
                postModel.Products.push({
                    Id: item.Id,
                    Count: item.Count
                });
            }
        });

        postModel.ReferralCardId = this.model.referral.Id;

        return this.$http.post(`${this.WEB_API_SERVICE_URI}/v1/patients/${patientId}/sales-orders/validate`, postModel)
            .then((response) => {
                angular.forEach(response.data, (item) => {
                    angular.forEach(item.Tags, (tag) => {
                        let index = _.findIndex(this.model.Tags, (j) => {
                            return j.Name.toLowerCase() === tag.Name.toLowerCase();
                        });

                        if (index === -1) {
                            tag.attrClass = this.ordersService.getAttrClass(tag.Name);
                            this.model.Tags.push(tag);
                        }
                    });
                });

                return response;
            });
    }

}
