(function () {
    'use strict';
    

    /* this value will be replaced by Octopus automatically */
    var serverUrl = 'https://dev-ci.nikohealth.com/api/';
    var appV2Domain = 'http://niko.loc:8082';
    var clientSecret = 'AUs45xM5nQoUseIUwpO8e2eRKjK9nMaNd9YpAUE';
    var coreUrl = serverUrl + 'core/';
    var billingUrl = serverUrl + 'billing/';
    var inventoryUrl = serverUrl + 'inventory/';
    var nlpHelpUrl = serverUrl + 'nlp/';
    var tasksUrl = serverUrl + 'tasks/';
    var identityUri = serverUrl + 'identity/';
    var faxUri = serverUrl + 'fax/';
    var UPSUri = serverUrl + 'ups/';
    var ShippoUri = serverUrl + 'shippo/';
    var catalogUri = serverUrl + 'catalog/';
    var organizationsUrl = serverUrl + 'organizations/';
    var templatesUrl = serverUrl + 'templates/';
    /* end of replacement */

    angular
        .module('app')
        .constant('WEB_API_URI', serverUrl)
        .constant('WEB_API_SERVICE_URI', coreUrl)
        .constant('WEB_API_BILLING_SERVICE_URI', billingUrl)
        .constant('WEB_API_INVENTORY_SERVICE_URI', inventoryUrl)
        .constant('WEB_API_NLP_SERVICE_URI', nlpHelpUrl)
        .constant('WEB_API_TASKS_SERVICE_URI', tasksUrl)
        .constant('WEB_API_IDENTITY_URI', identityUri)
        .constant('WEB_API_FAX_URI', faxUri)
        .constant('WEB_API_UPS_URI', UPSUri)
        .constant('WEB_API_SHIPPO_URI', ShippoUri)
        .constant('WEB_API_CATALOG_URI', catalogUri)
        .constant('WEB_API_ORGANIZATIONS_URI', organizationsUrl)
        .constant('WEB_API_TEMPLATES_URI', templatesUrl)
        .constant('CURRENT_DOMAIN', appV2Domain)
        .constant('loginConstants', {
            tokenExpireDate: 'tokenExpireDate',
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
            clientId: 'DME',
            scopeValue: 'billing core inventory offline_access inbox system',
            clientSecret: clientSecret,
            grantType: 'password',
            refreshGrantType: 'refresh_token',
            refreshTokenBeforeSec: 1000 * 60 * 3, // starting refresh token before 3 min of token expire
            refreshTokenMaxFailRequests: 3
        });

    })();
