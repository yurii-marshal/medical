import { appConfig } from '../../../../app-config/app-config';

export const LOGIN = {
  tokenExpireDate: 'tokenExpireDate',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  clientId: 'DME',
  scopeValue: 'billing core inventory offline_access inbox system',
  clientSecret: appConfig.client_secret,
  grantType: 'password',
  refreshGrantType: 'refresh_token',
  refreshTokenBeforeSec: 1000 * 30, // starting refresh token before 3 min of token expire
  refreshTokenMaxFailRequests: 3,
};
