import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-attrs-tags',
  templateUrl: './demo-attrs-tags.component.html',
  styleUrls: ['./demo-attrs-tags.component.scss'],
})
export class DemoAttrsTagsComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    public showTags(event) {
        console.log(event);
    }

}
