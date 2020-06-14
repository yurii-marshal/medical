export interface ChangePass {
    oldPassword: string;
    newPassword: string;
    rptPassword: string;
}

export class ChangePassMock {
    oldPassword = '';
    newPassword = '';
    rptPassword = '';
}

export interface ChangePassRequest {
    Email: string;
    NewPassword: string;
    Password: string;
}
