import { addTagClass } from '../../../core/helpers/map-tags.helper.es6';
import {
    patientStatusesConstants
} from '../../../core/constants/core.constants.es6';

export default class patientsController {
    constructor($state,
                $filter,
                advancedFiltersService,
                infinityTableService,
                patientsService,
                patientEditService,
                coreDictionariesService,
                corePatientService) {
        'ngInject';

        this.$state = $state;
        this.$filter = $filter;
        this.advancedFiltersService = advancedFiltersService;
        this.infinityTableService = infinityTableService;
        this.patientsService = patientsService;
        this.corePatientService = corePatientService;

        this.statuses = [];
        this.sortExpr = {};
        this.filterObj = {
            'filter.dateOfBirthday': '',
            'filter.createdDateFrom': $state.params.isOnlyNewPatients ? moment().subtract(30, 'days').format('MM/DD/YYYY') : '',
            'filter.createdDateTo': $state.params.isOnlyNewPatients ? moment().format('MM/DD/YYYY') : ''
        };
        this.cacheFiltersKey = 'patients';
        this.rewriteCacheFilters = $state.params.isOnlyNewPatients;

        corePatientService.getPatientStatuses()
            .then((response) => this.statuses = response.data);

        this.initFilters = {
            DOBFilters: {
                label: 'Date of Birth',
                type: 'date-range-filter',
                id: guid(true),
                filterStart: {
                    minDate: false,
                    filterName: 'filter.dateOfBirthFrom',
                    filterValue: ''
                },
                filterEnd: {
                    minDate: false,
                    filterName: 'filter.dateOfBirthTo',
                    filterValue: ''
                },
                isSelected: false
            },
            ZipCodesFilters: {
                label: 'Address (by Zip Code)',
                placeholder: '+ zip code',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.zipCodes',
                dictionaryKeyName: 'text',
                dictionarySearchParams: {
                    searchQueryKey: 'text',
                    defaultParams: {},
                    additionalParams: {}
                },
                filterPropName: 'text',
                filterValue: [],
                getDictionary: (params) => coreDictionariesService.getZipCodes(params)
                    .then((res) => res.data.Items),
                isStaticDictionary: false
            },
            LocationFilters: {
                label: 'Location',
                placeholder: '+ location',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.locations',
                dictionaryKeyName: 'Text',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {
                        sortExpression: 'Text ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => patientsService.getLocations(params).then((res) => res.data),
                isStaticDictionary: false
            },
            CreatedDateFilters: {
                label: 'Created Date',
                type: 'date-range-filter',
                id: guid(true),
                filterStart: {
                    filterName: 'filter.createdDateFrom',
                    filterValue: $state.params.isOnlyNewPatients
                        ? moment().subtract(30, 'days').format('MM/DD/YYYY')
                        : ''
                },
                filterEnd: {
                    filterName: 'filter.createdDateTo',
                    filterValue: $state.params.isOnlyNewPatients
                        ? moment().format('MM/DD/YYYY')
                        : ''
                },
                isSelected: false
            },
            GenderFilters: {
                label: 'Gender',
                type: 'checkbox-filter',
                filterName: 'filter.gender',
                buttonTypeCheckbox: true,
                items: [
                    {
                        id: guid(true),
                        displayName: 'Male',
                        filterValue: 1,
                        isSelected: false
                    },
                    {
                        id: guid(true),
                        displayName: 'Female',
                        filterValue: 2,
                        isSelected: false
                    }
                ]
            },
            DiagnosisFilters: {
                label: 'Diagnosis',
                chipsLabel: 'Diagnose',
                placeholder: '+ diagnosis',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.diagnosis',
                dictionaryKeyName: 'description',
                dictionarySearchParams: {
                    searchQueryKey: 'codeWithDescription',
                    defaultParams: {
                        sortExpression: 'text ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                filterPropName: 'id',
                getDictionary: (params) => patientsService.getDiagnosis(params).then((res) => res.data.Items),
                isStaticDictionary: false
            },
            MedicationsFilters: {
                label: 'Medications',
                chipsLabel: 'Medication',
                placeholder: '+ medication',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.medications',
                dictionaryKeyName: 'Description',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {
                        sortExpression: 'Description ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => patientsService.getMedications(params).then((res) => res.data.Items),
                isStaticDictionary: false
            },
            TagsFilters: {
                label: 'Patient Tags',
                placeholder: '+ tag',
                type: 'autocomplete-chips-filter',
                filterName: 'filter.tags',
                dictionaryKeyName: 'Name',
                dictionarySearchParams: {
                    searchQueryKey: 'name',
                    defaultParams: {
                        pageSize: 100,
                        sortExpression: 'Name ASC'
                    },
                    additionalParams: {}
                },
                filterValue: [],
                getDictionary: (params) => corePatientService.getPatientsTags(params).then((res) => res.data),
                isStaticDictionary: false
            },
            ResupplyProgramHold: {
                label: '',
                type: 'checkbox-filter',
                filterName: 'filter.ResupplyProgramHold',
                buttonTypeCheckbox: false,
                items: [
                    {
                        id: guid(true),
                        displayName: 'Resupply program on hold only',
                        isSelected: false
                    }
                ]
            }
        };

        this.updateFilters = (response) => {
            if (!_.isEqual(response, this.initFilters)) {
                this.initFilters = angular.copy(response, {});
                this.advancedFiltersService.mapFilterObject(response);
                this.filters = this.advancedFiltersService.getSearchFilters();
                this.infinityTableService.reload();

                if (this.filterObj.createdDateFrom || this.filterObj.createdDateTo) {
                    delete this.filterObj.createdDateFrom;
                    delete this.filterObj.createdDateTo;
                }
            }
        };

        this.getPatientPromise = this._getPatientPromise.bind(this);
    }

    _getPatientPromise(pageIndex, pageSize) {
        return this.patientsService.getPatients(pageIndex, pageSize, this.sortExpr, angular.merge({ 'filter.all': true }, this.filterObj, this.filters))
            .then((response) => {
                _.map(response.data.Items, (item) => this._mapPatientItems(item));
                return response;
            });
    }

    _mapPatientItems(patient) {
        switch (+patient.Status.Id) {
            case patientStatusesConstants.ACTIVE_ID:
                patient.statusClass = 'active';
                break;
            case patientStatusesConstants.INACTIVE_ID:
                patient.statusClass = 'dark-blue';
                break;
            case patientStatusesConstants.HOLD_ID:
                patient.statusClass = 'inactive';
                break;
            default:
                break;
        }

        patient.Tags = patient.Tags && patient.Tags.map((tag) => {
            tag.attrClass = addTagClass(tag.Name);
            return tag;
        });

        patient.Phones = patient.Phones.map((phone) => this.$filter('tel')(phone));

        if (patient.LocationName && patient.LocationNpi) {
            patient.Location = `${patient.LocationName} (${patient.LocationNpi})`;
        }

        return patient;
    }

    getPatientIds(displayId, pageIndex) {
        return this.corePatientService.getPatientsDictionary({
            DisplayId: displayId,
            PageIndex: pageIndex,
            selectCount: true
        }).then((response) => response.data);
    }

    chosePatient(patientId) {
        this.$state.go('root.patient.demographics', { patientId });
    }
}
