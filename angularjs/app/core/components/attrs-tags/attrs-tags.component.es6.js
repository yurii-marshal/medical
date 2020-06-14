import { addTagClass } from '../../helpers/map-tags.helper.es6';

import template from './attrs-tags.html';

class attrsTagsCtrl {
    constructor(
        $scope,
        coreOrderService,
        corePatientService,
        billingClaimsService,
        ngToast
    ) {

        this.ngToast = ngToast;
        this.corePatientService = corePatientService;
        this.coreOrderService = coreOrderService;
        this.billingClaimsService = billingClaimsService;

        this.autocompleteDisabled = false;
        this.newTagLoading = false;
        this.attrsTags = [];

        $scope.$watch(() => this.tags, (newVal) => {
            if (newVal) {
                this.attrsTags = newVal;

                this.attrsTags.forEach((tag) => {
                    tag.attrClass = addTagClass(tag.Name, this.tagsParent);
                });
            }
        }, true);
    }

    $onInit() {
        switch (this.tagsParent) {
            case 'patient':
                this.tagLabel = 'Patient Tags';
                break;
            case 'claim':
                this.tagLabel = 'Invoice Tags';
                break;
            case 'order':
            default:
                this.tagLabel = 'Order Tags';
        }
    }

    getTags(name) {
        let params = {
            name,
            pageSize: 100,
            sortExpression: 'Name ASC'
        };
        let promise;

        switch (this.tagsParent) {
            case 'patient':
                promise = this.corePatientService.getPatientsTags(params);
                break;
            case 'claim':
                promise = this.billingClaimsService.getClaimsTags(params);
                break;
            case 'order':
            default:
                promise = this.coreOrderService.getOrderTags(params);
        }

        return promise
            .then((response) => {
                let results = response.data.Items || response.data;

                results = results.map((tag) => {
                    if (!tag.attrClass) {
                        tag.attrClass = addTagClass(tag.Name, this.tagsParent);
                    }
                    return tag;
                });
                results = this._filterResults(results);

                if (this.isAddNewTagAllowed() && results.length && !results.find((item) => item.Name.toLowerCase() === name.toLowerCase())) {
                    results.unshift({
                        Id: null,
                        Name: `Add new tag "${name}"`,
                        newTagName: name,
                        itemClass: 'add-new-tag-item'
                    });
                }

                return results;
            });
    }

    isAddNewTagAllowed() {
        return this.searchTextTags && !this.disableAddNewTags;
    }

    addTag(newTag) {

        if (!newTag) {
            return;
        }

        if (!newTag.Id) {
            newTag = newTag.newTagName || newTag;

            this.newTagLoading = true;

            let itemIndex = _.findLastIndex(this.attrsTags,
                (i) => i.Name.toLowerCase() === newTag.toLowerCase());

            if (itemIndex === -1) {
                this.autocompleteDisabled = true;
                let promise;

                switch (this.tagsParent) {
                    case 'patient':
                        promise = this.corePatientService.createPatientsTag({ Name: newTag });
                        break;
                    case 'claim':
                        promise = this.billingClaimsService.createClaimsTag({ Name: newTag });
                        break;
                    case 'order':
                    default:
                        promise = this.coreOrderService.saveNewTag({ Name: newTag });
                }

                promise
                    .then((response) => {
                        this._addTagToList({
                            Id: (response.data.Id || response.data),
                            Name: (response.data.Name || newTag)
                        });
                    })
                    .finally(() => {
                        this.autocompleteDisabled = false;
                        this.newTagLoading = false;
                    });
            } else {
                this.ngToast.danger(`The tag with the same name already exists`);
            }
        } else {
            this._addTagToList(newTag);
        }

        $('#autocompleteAttrsTags input').blur();

        this.searchTextTags = '';

    }

    _addTagToList(newTag) {
        let tag = _.find(this.attrsTags, (tag) => {
            return newTag.Id === tag.Id;
        });

        if (!tag) {
            this.attrsTags.push({
                Id: newTag.Id,
                Name: newTag.Name,
                attrClass: addTagClass(newTag.Name, this.tagsParent)
            });
        } else {
            this.ngToast.danger('This tag is already added!');
        }
    }

    _filterResults(results) {
        let filteredArr = [];

        angular.forEach(results, (item) => {
            let itemIndex = _.findIndex(this.attrsTags, { Id: item.Id });

            if (itemIndex === -1) {
                filteredArr.push(item);
            }
        });
        return filteredArr;
    }

    deleteTagsByIndex(index) {
        this.attrsTags.splice(index, 1);
    }
}

const attrsTags = {
    bindings: {
        tagsParent: '@',
        tags: '=',
        disableAddNewTags: '='
    },
    template,
    controller: attrsTagsCtrl
};

export default attrsTags;
