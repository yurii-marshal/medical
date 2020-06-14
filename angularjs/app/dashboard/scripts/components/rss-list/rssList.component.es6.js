import template from '../../../views/components/rssList.component.html';

class rssListCtrl {
    constructor($q, rssListService) {
        'ngInject';

        this.$q = $q;
        this.rssListService = rssListService;
        this.loaded = false;
        this.rssItems = [];

        this.$onInit = () => {
            this._activate();
        };
    }

    _activate() {
        let promises = [];

        angular.forEach(this.urls, (item) => {
            if (!item.url || !item.name) {
                return;
            }

            const promise = this.rssListService.getRss(item.name, item.url, this.maxItemsPerSource);

            promise.then((results) => {
                angular.forEach(results, (items) => {
                    this.rssItems = this.rssItems.concat(items);
                });
            });

            promises.push(promise);
        });

        this.$q.all(promises)
            .finally(() => {
                this.loaded = true;
            });
    }
}

const rssList = {
    bindings: {
        urls: '=',
        maxItemsPerSource: '='
    },
    template,
    controller: rssListCtrl
};

export default rssList;

