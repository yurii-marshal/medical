import { LOGIN } from '@app/auth/shared/consts/login.const';

function setHeaders(token: any) {
    return {
        setHeaders: {
            'Authorization': `Bearer ${token}`,
            'If-Modified-Since': 'Mon, 26 Jul 1997 05:00:00 GMT',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
        },
    };
}

function isActivateTokenRefresh(getTokenExpireDate: string): boolean {
    const tokenExpireTime = +getTokenExpireDate;
    const deltaTime = LOGIN.refreshTokenBeforeSec;
    const timeNow = new Date().getTime();

    return tokenExpireTime && timeNow >= tokenExpireTime - deltaTime;
}

/* need the token for all URLs apart from those URLs */
function isUrlRequireToken(url: string): boolean {
    return url.indexOf('Token') === -1
        && url.indexOf('token') === -1
        && url.indexOf('ForgotPassword') === -1;
}

export { setHeaders, isActivateTokenRefresh, isUrlRequireToken };
