import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-toolbar',
  templateUrl: './demo-toolbar.component.html',
  styleUrls: ['./demo-toolbar.component.scss'],
})
export class DemoToolbarComponent implements OnInit {
    public menuOptions = [];

    constructor() {
        this.menuOptions = [
            {
                text: 'Create patient',
                isHidden: true,
                clickFunction: this.test.bind(this),
                icon: {
                    w: 18,
                    h: 18,
                    url: 'assets/images/default/pluto_operator_1.svg',
                },
            },
            {
                text: 'Create patient',
                isHidden: false,
                clickFunction: this.test.bind(this),
                icon: {
                    w: 18,
                    h: 18,
                    url: 'assets/images/default/pluto_operator_1.svg',
                },
            },
            {
                text: 'Create patient',
                isHidden: false,
                clickFunction: this.test.bind(this),
                icon: {
                    w: 18,
                    h: 18,
                    url: 'assets/images/default/pluto_operator_1.svg',
                },
            },
        ];
    }

    ngOnInit() {
    }

    public test() {
        alert('test message');
    }

}
