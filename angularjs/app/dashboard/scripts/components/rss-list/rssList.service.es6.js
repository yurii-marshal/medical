export default class rssListService {
    constructor($http, WEB_API_SERVICE_URI) {
        'ngInject';

        this.$http = $http;
        this.WEB_API_SERVICE_URI = WEB_API_SERVICE_URI;
    }

    getRss(name, url, maxItems) {
        return this.$http.get(`${this.WEB_API_SERVICE_URI}rss/load`, { params: { url }, cache: true })
            .then((response) => {

                if (!response.data) {
                    return [];
                }

                return this._parseRssXmlToJson(response.data, name)
                    .map((item) => {
                        item.websiteName = name;
                        return item;
                    })
                    .slice(0, maxItems);
            });
    }

    _getParsedDate(dateStr, name) {
        switch (name) {
            case 'cms.gov':
                return moment(dateStr, 'dddd, MMMM DD, YYYY - HH:mm');
            default:
                return moment(dateStr, 'ddd, DD MMM YYYY HH:mm:ss ZZ');
        }
    }

    _parseRssXmlToJson(xmlString, rssName) {
        let rssItemsArr = [],
            xmlDoc = $.parseXML(xmlString),
            items = $(xmlDoc).find('item');

        angular.forEach(items, (item) => {
            let categoryEl = $(item).find('category'),
                categoriesArr = [],
                pubDateEl = $(item).find('pubDate'),
                titleEl = $(item).find('title'),
                linkEl = $(item).find('link');

            angular.forEach(categoryEl, (item) => {
                if (item.textContent) {
                    categoriesArr.push(item.textContent);
                }
            });

            rssItemsArr.push({
                title: (titleEl && titleEl[0]) ? titleEl[0].textContent : '',
                link: (linkEl && linkEl[0]) ? linkEl[0].innerHTML : '',
                categories: categoriesArr,
                publishedDateInt: (pubDateEl && pubDateEl[0] && pubDateEl[0].textContent)
                    ? this._getParsedDate(pubDateEl[0].textContent, rssName).unix()
                    : '',
                publishedDate: (pubDateEl && pubDateEl[0]) ? this._getParsedDate(pubDateEl[0].innerHTML, rssName).format() : ''
            });
        });

        return rssItemsArr;
    }

}
