import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-demo-click-outside',
    templateUrl: './demo-click-outside.component.html',
    styleUrls: ['./demo-click-outside.component.scss'],
})
export class DemoClickOutsideComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    public onClickOutside() {
        alert('CLICKED OUTSIDE');
    }

}
