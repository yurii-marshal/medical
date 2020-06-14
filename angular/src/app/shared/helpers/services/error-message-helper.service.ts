import { Injectable } from '@angular/core';

@Injectable()
export class ErrorMessageHelperService {

    // Function for prepare error message from server
    getErrorMsg(err): string {

        console.error({error: 'Error send/get data from server.', response: err});

        // For forgot pass window only
        // Message is shown without error codes
        if (window.location.href.indexOf('forgotpass') !== -1 && err.data) {
            return JSON.stringify(err.data);
        }

        if (err && err.status === -1) {
            return 'Error: No connection to the server';
        }

        if (Array.isArray(err)) {
            const msgArr = [];
            err.forEach((item) => {
                msgArr.push(item.Message);
            });
            return msgArr.join('<br/>');
        }

        if (err.error.Error && Array.isArray(err.error.Error)) {
            const msgArr = [];

            err.error.Error.forEach((item) => {
                msgArr.push(item);
            });

            return msgArr.join('<br/>');
        }

        if (err.error && err.error.Message) {
            return 'Error. ' + err.status + '<br/>' + err.error.Message;
        }

        if (err.error && Array.isArray(err.error)) {
            const msgArr = [];
            err.error.forEach((item) => {
                msgArr.push(item.Message || item);
            });

            return msgArr.join('<br/>');
        }

        if (err && err.message) {
            return 'Error. ' + err.status + '<br/>' + err.message;
        }

        // This is for special error message format at change password
        if (err
            && Object.keys(err).length === 1
            && Array.isArray(err[Object.keys(err)[0]])
        ) {
            const msgArr = [];
            err[Object.keys(err)[0]].forEach((item) => {
                msgArr.push(item);
            });
            return msgArr.join('<br/>');
        }

        if (err) {
            return 'Error. Status ' + err.status + ' ' + err;
        }

        return 'Error. Status ' + err.status;
    }
}
