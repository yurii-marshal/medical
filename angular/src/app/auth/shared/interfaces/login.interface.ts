export interface Login {
    username: string;
    password?: string;
    isRemember?: boolean;
}

export class LoginMock {
    username = '';
    password = '';
}
