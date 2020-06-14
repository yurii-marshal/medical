import { Component } from '@angular/core';
import { Login } from '../../shared/interfaces/login.interface';

@Component({
    selector: 'app-login-container-component',
    templateUrl: './login-container.component.html',
    styleUrls: [],
})

export class LoginContainerComponent {
    public showLogin = true;
    public loginData: Login;

    constructor() {}

    showLoginForm() {
        this.loginData = null;
        this.showLogin = true;
    }

    showEnterCodeForm(data: Login) {
        this.loginData = data;
        this.showLogin = false;
    }
}
