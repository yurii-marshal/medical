import { appConfig } from '../../../app-config/app-config';

export const WEB_API_URLS = {
  WEB_API_SERVICE_URI: appConfig.server_url + 'core/',
  WEB_API_BILLING_SERVICE_URI: appConfig.server_url + 'billing/',
  WEB_API_INVENTORY_SERVICE_URI: appConfig.server_url + 'inventory/',
  WEB_API_NLP_SERVICE_URI: appConfig.server_url + 'nlp/',
  WEB_API_TASKS_SERVICE_URI: appConfig.server_url + 'tasks/',
  WEB_API_IDENTITY_URI: appConfig.server_url + 'identity/',
  WEB_API_FAX_URI: appConfig.server_url + 'fax/',
  WEB_API_UPS_URI: appConfig.server_url + 'ups/',
  WEB_API_CATALOG_URI: appConfig.server_url + 'catalog/',
  WEB_API_ORGANIZATIONS_URI: appConfig.server_url + 'organizations/',
  WEB_API_TEMPLATES_URI: appConfig.server_url + 'templates/',
};
