import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-datetimepicker',
  templateUrl: './demo-datetimepicker.component.html',
  styleUrls: ['./demo-datetimepicker.component.scss'],
})
export class DemoDatetimepickerComponent implements OnInit {
    public dtPickerType = 'date';
    public dateFormat = 'L';
    public dtPickerTodayBtn = true;
    public displayClearButton = false;
    public displayImage = true;
    public imagePosition: 'left' | 'right' = 'right';

    public minRange: Date = null;
    public maxRange: Date = null;
    public interval = 1;

    constructor() {}

    ngOnInit() {
    }

}
